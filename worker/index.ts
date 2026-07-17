/**
 * Worker da Rubee Apis: serve os assets do site e expõe
 * POST /api/checkout, que cria uma Stripe Checkout Session.
 * A chave secreta vive em um secret do Cloudflare (STRIPE_SECRET_KEY),
 * nunca no código ou no repositório.
 */

interface Env {
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET?: string;
  STRIPE_PRICE_ID?: string;
  ASSETS: { fetch(request: Request): Promise<Response> };
}

const PRICE_CENTS = 11990; // R$ 119,90 — preço único para toda a linha

// Catálogo da linha Rubee Apis. Todos os produtos compartilham o mesmo preço.
// `useConfiguredPrice` faz o produto usar o Price já cadastrado na Stripe
// (env.STRIPE_PRICE_ID); os demais são criados via price_data com o mesmo valor.
const PRODUCTS: Record<string, { name: string; useConfiguredPrice?: boolean }> = {
  vermelha: { name: "Rubee Apis · Extrato de Própolis Vermelha 30 ml", useConfiguredPrice: true },
  capsula: { name: "Rubee Apis · Própolis Vermelha em Cápsulas · 60 cápsulas" },
  verde: { name: "Rubee Apis · Extrato de Própolis Verde 30 ml" },
  blend: { name: "Rubee Apis · Blend Própolis Verde + Vermelha 30 ml" },
};
const DEFAULT_PRODUCT = "vermelha";

function hex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function safeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return mismatch === 0;
}

async function verifyStripeSignature(payload: string, signatureHeader: string, secret: string) {
  const parts = signatureHeader.split(",").map((part) => part.trim().split("="));
  const timestamp = parts.find(([key]) => key === "t")?.[1];
  const signatures = parts.filter(([key]) => key === "v1").map(([, value]) => value);
  if (!timestamp || signatures.length === 0) return false;
  const timestampNumber = Number(timestamp);
  if (!Number.isFinite(timestampNumber) || Math.abs(Date.now() / 1000 - timestampNumber) > 300) return false;

  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const expected = hex(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${timestamp}.${payload}`)));
  return signatures.some((signature) => safeEqual(signature, expected));
}

function stripeHeaders(secretKey: string) {
  return {
    Authorization: `Bearer ${secretKey}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/stripe-webhook" && request.method === "POST") {
      if (!env.STRIPE_WEBHOOK_SECRET) return new Response("Webhook não configurado.", { status: 503 });
      const signature = request.headers.get("stripe-signature");
      const payload = await request.text();
      if (!signature || !(await verifyStripeSignature(payload, signature, env.STRIPE_WEBHOOK_SECRET))) {
        return new Response("Assinatura inválida.", { status: 400 });
      }

      const event = JSON.parse(payload) as {
        id: string;
        type: string;
        data?: { object?: { id?: string; payment_status?: string; customer_details?: { email?: string }; metadata?: Record<string, string> } };
      };
      const session = event.data?.object;
      if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
        console.log("Stripe checkout confirmed", { eventId: event.id, sessionId: session?.id, paymentStatus: session?.payment_status, email: session?.customer_details?.email, metadata: session?.metadata });
      } else if (event.type === "checkout.session.async_payment_failed") {
        console.warn("Stripe checkout failed", { eventId: event.id, sessionId: session?.id });
      }
      return Response.json({ received: true });
    }

    if (url.pathname === "/api/checkout" && request.method === "POST") {
      if (!env.STRIPE_SECRET_KEY) {
        return Response.json({ error: "Checkout não configurado." }, { status: 503 });
      }
      let quantity = 1;
      let product = DEFAULT_PRODUCT;
      try {
        const body = (await request.json()) as { quantity?: unknown; product?: unknown };
        quantity = Math.min(10, Math.max(1, Math.floor(Number(body.quantity)) || 1));
        if (typeof body.product === "string" && body.product in PRODUCTS) product = body.product;
      } catch {
        quantity = 1;
      }
      const selected = PRODUCTS[product];

      const params = new URLSearchParams({
        mode: "payment",
        success_url: `${url.origin}/pedido-confirmado?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${url.origin}/checkout?product=${product}&quantity=${quantity}&cancelado=1`,
        locale: "pt-BR",
        customer_creation: "always",
        billing_address_collection: "required",
        "phone_number_collection[enabled]": "true",
        "shipping_address_collection[allowed_countries][0]": "BR",
        submit_type: "pay",
        "line_items[0][quantity]": String(quantity),
        "metadata[product]": product,
        "metadata[product_name]": selected.name,
        "metadata[quantity]": String(quantity),
      });
      if (env.STRIPE_PRICE_ID && selected.useConfiguredPrice) {
        params.set("line_items[0][price]", env.STRIPE_PRICE_ID);
      } else {
        params.set("line_items[0][price_data][currency]", "brl");
        params.set("line_items[0][price_data][unit_amount]", String(PRICE_CENTS));
        params.set("line_items[0][price_data][product_data][name]", selected.name);
      }

      try {
        const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
          method: "POST",
          headers: stripeHeaders(env.STRIPE_SECRET_KEY),
          body: params.toString(),
        });
        const session = (await response.json()) as { url?: string; error?: { message?: string } };
        if (!response.ok || !session.url) {
          console.error("Stripe error:", session.error?.message);
          return Response.json({ error: "Não foi possível iniciar o pagamento. Tente novamente." }, { status: 502 });
        }
        return Response.json({ url: session.url });
      } catch {
        return Response.json({ error: "Não foi possível iniciar o pagamento. Tente novamente." }, { status: 500 });
      }
    }

    if (url.pathname === "/api/checkout-session" && request.method === "GET") {
      if (!env.STRIPE_SECRET_KEY) {
        return Response.json({ error: "Checkout não configurado." }, { status: 503 });
      }
      const sessionId = url.searchParams.get("id");
      if (!sessionId || !sessionId.startsWith("cs_")) {
        return Response.json({ error: "Sessão inválida." }, { status: 400 });
      }

      try {
        const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
          headers: stripeHeaders(env.STRIPE_SECRET_KEY),
        });
        const session = (await response.json()) as {
          payment_status?: string;
          status?: string;
          amount_total?: number;
          currency?: string;
          customer_details?: { email?: string; name?: string };
          metadata?: { quantity?: string; product?: string; product_name?: string };
          error?: { message?: string };
        };
        if (!response.ok) {
          console.error("Stripe session error:", session.error?.message);
          return Response.json({ error: "Não foi possível confirmar o pedido." }, { status: 502 });
        }
        return Response.json({
          paid: session.payment_status === "paid",
          status: session.status,
          amountTotal: session.amount_total,
          currency: session.currency,
          email: session.customer_details?.email,
          customerName: session.customer_details?.name,
          quantity: Number(session.metadata?.quantity) || 1,
          product: session.metadata?.product,
          productName: session.metadata?.product_name ?? (session.metadata?.product ? PRODUCTS[session.metadata.product]?.name : undefined),
        });
      } catch {
        return Response.json({ error: "Não foi possível confirmar o pedido." }, { status: 500 });
      }
    }

    return env.ASSETS.fetch(request);
  },
};
