/**
 * Worker da Rubee Apis: serve os assets do site e expõe
 * POST /api/checkout, que cria uma Stripe Checkout Session.
 * A chave secreta vive em um secret do Cloudflare (STRIPE_SECRET_KEY),
 * nunca no código ou no repositório.
 */

interface Env {
  STRIPE_SECRET_KEY: string;
  ASSETS: { fetch(request: Request): Promise<Response> };
}

const PRICE_CENTS = 11990; // R$ 119,90
const PRODUCT_NAME = "Rubee Apis · Extrato de Própolis Vermelha 30 ml";

function stripeHeaders(secretKey: string) {
  return {
    Authorization: `Bearer ${secretKey}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/checkout" && request.method === "POST") {
      if (!env.STRIPE_SECRET_KEY) {
        return Response.json({ error: "Checkout não configurado." }, { status: 503 });
      }
      let quantity = 1;
      try {
        const body = (await request.json()) as { quantity?: unknown };
        quantity = Math.min(10, Math.max(1, Math.floor(Number(body.quantity)) || 1));
      } catch {
        quantity = 1;
      }

      const params = new URLSearchParams({
        mode: "payment",
        success_url: `${url.origin}/pedido-confirmado?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${url.origin}/checkout?quantity=${quantity}&cancelado=1`,
        locale: "pt-BR",
        customer_creation: "always",
        billing_address_collection: "required",
        "phone_number_collection[enabled]": "true",
        "shipping_address_collection[allowed_countries][0]": "BR",
        submit_type: "pay",
        "line_items[0][quantity]": String(quantity),
        "line_items[0][price_data][currency]": "brl",
        "line_items[0][price_data][unit_amount]": String(PRICE_CENTS),
        "line_items[0][price_data][product_data][name]": PRODUCT_NAME,
        "metadata[product]": "rubee-apis-30ml",
        "metadata[quantity]": String(quantity),
      });

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
          metadata?: { quantity?: string };
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
        });
      } catch {
        return Response.json({ error: "Não foi possível confirmar o pedido." }, { status: 500 });
      }
    }

    return env.ASSETS.fetch(request);
  },
};
