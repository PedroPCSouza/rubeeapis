import { useEffect, useMemo, useState } from "react";
import Scene3D from "./Scene3D";

const PRICE = 119.9;
const checkoutBaseUrl = import.meta.env.VITE_CHECKOUT_URL?.trim();
const waitlistBaseUrl = import.meta.env.VITE_WAITLIST_URL?.trim();

type IconName =
  | "arrow"
  | "bottle"
  | "check"
  | "drop"
  | "leaf"
  | "lock"
  | "minus"
  | "plus"
  | "shield"
  | "spark"
  | "sun";

const iconPaths: Record<IconName, React.ReactNode> = {
  arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
  bottle: <><path d="M9 2h6v4H9z"/><path d="M8 6h8l1 4v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V10z"/><path d="M9 14h6"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  drop: <path d="M12 2s6 7 6 12a6 6 0 1 1-12 0c0-5 6-12 6-12Z"/>,
  leaf: <><path d="M20.8 3.2C13 3 5 6 4.2 14.5c-.2 2.2 1.6 4 3.8 3.8C16.5 17.5 20 10 20.8 3.2Z"/><path d="M5 20c3-5 7-8 12-11"/></>,
  lock: <><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
  minus: <path d="M5 12h14"/>,
  plus: <><path d="M12 5v14"/><path d="M5 12h14"/></>,
  shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></>,
  spark: <path d="m12 2 1.7 5.3L19 9l-5.3 1.7L12 16l-1.7-5.3L5 9l5.3-1.7z"/>,
  sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.9 4.9 1.4 1.4"/><path d="m17.7 17.7 1.4 1.4"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m4.9 19.1 1.4-1.4"/><path d="m17.7 6.3 1.4-1.4"/></>,
};

function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {iconPaths[name]}
    </svg>
  );
}

function BrandMark() {
  return (
    <a className="brand" href="#inicio" aria-label="Rubee Apis, voltar ao início">
      <img className="brand-logo" src="/images/rubee-logo-white-v2.png" alt="Rubee Apis" width="343" height="271" />
    </a>
  );
}

function useReveal() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll("[data-reveal]"));
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

const ctaLabel = checkoutBaseUrl ? "Comprar agora" : "Quero a minha";

const moments = [
  {
    icon: "sun" as const,
    kicker: "6h47 · antes do café",
    title: "Começa fácil",
    text: "Dez gotas entre o despertador e o café. Sabor suave, sem careta, sem preparo. Em segundos, o cuidado do dia já aconteceu.",
  },
  {
    icon: "drop" as const,
    kicker: "Todos os dias · mesma medida",
    title: "Continua sem esforço",
    text: "O conta-gotas entrega sempre a mesma quantidade indicada no rótulo. Nada de adivinhar, nada de desperdiçar.",
  },
  {
    icon: "leaf" as const,
    kicker: "Do litoral brasileiro",
    title: "Você sabe o que está tomando",
    text: "Própolis vermelha brasileira, de origem identificada, com rótulo transparente. A escolha natural que você consegue reconhecer.",
  },
  {
    icon: "bottle" as const,
    kicker: "30 ml · onde você for",
    title: "Cabe na sua vida",
    text: "Um frasco pequeno que acompanha a rotina inteira: a semana corrida, a mochila da viagem, a mesa de cabeceira.",
  },
];

const scienceAreas = [
  { title: "Defesas do organismo", text: "Pesquisadores investigam compostos da própolis vermelha em estudos sobre a resposta imune." },
  { title: "Ação antioxidante", text: "Seus fenólicos e isoflavonoides são estudados em laboratório pela atividade contra radicais livres." },
  { title: "Saúde bucal", text: "Extratos de própolis aparecem em pesquisas ligadas à higiene oral e ao equilíbrio da boca." },
  { title: "Rotinas de bem-estar", text: "Presente há gerações nas rotinas brasileiras de cuidado natural, agora com origem identificada." },
];

const ritualSteps = [
  { number: "01", title: "Pingue", text: "Dez gotas, direto do conta-gotas, conforme a orientação do rótulo." },
  { number: "02", title: "Sinta", text: "O sabor suave da própolis vermelha, sem o gosto forte que você esperava." },
  { number: "03", title: "Siga", text: "O resto do dia é seu. Amanhã, o gesto se repete em segundos." },
];

const faqs = [
  { q: "O que é a Rubee Apis?", a: "Um extrato de própolis vermelha brasileira em gotas, com sabor suave e conta-gotas, criado para caber na sua rotina diária sem esforço." },
  { q: "A própolis vermelha faz bem para quê?", a: "A própolis vermelha brasileira é uma das mais estudadas do mundo: pesquisas investigam seus compostos em áreas como resposta imune, ação antioxidante e saúde bucal. A Rubee Apis não é medicamento e não promete prevenir, tratar ou curar doenças — use conforme o rótulo." },
  { q: "O sabor é forte?", a: "Não. A Rubee Apis foi pensada para ter sabor suave, sem o gosto forte que costuma afastar as pessoas da própolis." },
  { q: "Como uso no dia a dia?", a: "Pingue a quantidade indicada no rótulo — o conta-gotas facilita a medida. Consulte sempre as orientações, restrições e conservação na embalagem." },
  { q: "O que vem na compra?", a: "Uma unidade Rubee Apis de 30 ml com conta-gotas, em sua embalagem individual." },
  { q: "Como devo conservar?", a: "Siga as condições de conservação indicadas na embalagem e mantenha o produto em local adequado." },
];

function Header() {
  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <BrandMark />
        <a className="nav-buy header-primary-cta" href="#comprar">{ctaLabel} <Icon name="arrow" size={17}/></a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="inicio">
      <Scene3D />
      <div className="hero-noise" />
      <div className="hero-glow" />
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow"><span /> Própolis vermelha brasileira · extrato em gotas · 30 ml</p>
          <h1>Dez gotas.<br/><em>O resto do dia é seu.</em></h1>
          <p className="hero-lead">O cuidado natural que cabe entre o despertador e o café: sabor suave, medida certa no conta-gotas e a própolis vermelha do litoral brasileiro.</p>
          <div className="hero-purchase">
            <div className="hero-price"><span>Rubee Apis · 30 ml</span><strong>R$ 119<sup>,90</sup></strong></div>
            <a className="button button--gold" href="#comprar">{ctaLabel} <Icon name="arrow" size={19}/></a>
          </div>
          <div className="micro-trust"><span><Icon name="spark" size={15}/> Sabor suave</span><span><Icon name="leaf" size={15}/> Origem brasileira</span><span><Icon name="lock" size={15}/> Compra segura</span></div>
        </div>
        <div className="hero-side-note" aria-hidden="true"><span>01</span><i /> <p>NATURALMENTE<br/>BRASILEIRA</p></div>
      </div>
      <div className="scroll-cue" aria-hidden="true"><span>Descubra</span><i /></div>
    </section>
  );
}

function Identification() {
  return (
    <section className="section identification" aria-labelledby="identification-title">
      <div className="container identification-inner" data-reveal>
        <p className="section-kicker">Feita para quem vive dias cheios</p>
        <h2 id="identification-title">Você não procura mais uma promessa.<br/><em>Procura algo que caiba no seu dia.</em></h2>
        <p>Rotinas de cuidado costumam falhar no mesmo ponto: exigem demais. Gosto forte, preparo, lembrete, esforço.</p>
        <p>A Rubee Apis foi desenhada de trás pra frente — a partir do seu dia. Um gesto de segundos, agradável o bastante para você querer repetir amanhã.</p>
      </div>
    </section>
  );
}

function Moments() {
  return (
    <section className="section moments" id="beneficios">
      <div className="container">
        <div className="section-heading" data-reveal>
          <div><p className="section-kicker">O que muda pra você</p><h2>Pequeno no gesto.<br/><em>Presente o dia inteiro.</em></h2></div>
          <p>Quatro momentos em que a Rubee Apis trabalha a seu favor — sem pedir quase nada em troca.</p>
        </div>
        <div className="moment-grid">
          {moments.map((moment, index) => (
            <article className="moment-card" key={moment.title} data-reveal style={{ transitionDelay: `${index * 90}ms` }}>
              <p className="moment-kicker">{moment.kicker}</p>
              <div className="moment-icon"><Icon name={moment.icon}/></div>
              <h3>{moment.title}</h3>
              <p>{moment.text}</p>
              <span className="card-line" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Science() {
  return (
    <section className="section science" id="ciencia">
      <div className="container">
        <div className="section-heading section-heading--light" data-reveal>
          <div><p className="section-kicker section-kicker--light">Onde a ciência olha</p><h2>Uma das própolis mais estudadas<br/><em>do mundo.</em></h2></div>
          <p>A própolis vermelha brasileira, ligada à <i>Dalbergia ecastophyllum</i> do litoral, concentra isoflavonoides e compostos fenólicos que despertam o interesse de pesquisadores em diferentes áreas.</p>
        </div>
        <div className="science-grid">
          {scienceAreas.map((area, index) => (
            <article className="science-card" key={area.title} data-reveal style={{ transitionDelay: `${index * 90}ms` }}>
              <span className="science-index">{String(index + 1).padStart(2, "0")}</span>
              <h3>{area.title}</h3>
              <p>{area.text}</p>
            </article>
          ))}
        </div>
        <div className="science-footnote" data-reveal>
          <Icon name="shield" size={18}/>
          <p>A Rubee Apis não é medicamento, não substitui tratamentos e não promete prevenir, tratar ou curar doenças. Os estudos citados investigam a própolis vermelha em laboratório e não comprovam efeitos clínicos deste produto. Use conforme o rótulo.</p>
        </div>
        <div className="science-sources" data-reveal><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC2529384/" target="_blank" rel="noreferrer">Estudo botânico <Icon name="arrow" size={14}/></a><a href="https://www.gov.br/anvisa/pt-br/assuntos/fiscalizacao-e-monitoramento/propaganda/propaganda" target="_blank" rel="noreferrer">Regras da Anvisa <Icon name="arrow" size={14}/></a></div>
      </div>
    </section>
  );
}

function Ritual() {
  return (
    <section className="section ritual" id="como-usar">
      <div className="container">
        <div className="section-heading" data-reveal>
          <div><p className="section-kicker">O ritual</p><h2>Três passos.<br/><em>Nenhuma desculpa.</em></h2></div>
          <p>Consulte no rótulo a quantidade, as restrições e a conservação. O resto leva segundos.</p>
        </div>
        <div className="ritual-grid">
          {ritualSteps.map((step, index) => (
            <div className="ritual-step" key={step.number} data-reveal style={{ transitionDelay: `${index * 110}ms` }}>
              <span className="ritual-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Origin() {
  return (
    <section className="origin" id="origem">
      <div className="origin-art" data-reveal>
        <img className="origin-presenter" src="/images/presenter-with-product.webp" alt="Apresentadora Rubee Apis segurando o frasco do produto" width="1536" height="1024" loading="lazy" />
      </div>
      <div className="origin-copy" data-reveal>
        <p className="section-kicker section-kicker--light">Da origem para o seu dia</p>
        <h2>Brasileira na origem.<br/><em>Sua na rotina.</em></h2>
        <p>Do mangue do litoral brasileiro até o seu conta-gotas: a própolis vermelha chega com origem identificada, sabor suave e a praticidade que faz você continuar.</p>
        <div className="specs">
          <div><span>Conteúdo</span><b>30 ml em gotas</b></div>
          <div><span>Experiência</span><b>Sabor suave</b></div>
          <div><span>Praticidade</span><b>Conta-gotas preciso</b></div>
          <div><span>Origem</span><b>Litoral brasileiro</b></div>
        </div>
        <a className="text-link" href="#comprar">Quero na minha rotina <Icon name="arrow" size={18}/></a>
      </div>
    </section>
  );
}

function Offer() {
  const [quantity, setQuantity] = useState(1);
  const [waitlistMessage, setWaitlistMessage] = useState(false);
  const total = PRICE * quantity;
  const checkoutUrl = useMemo(() => {
    if (!checkoutBaseUrl) return undefined;
    try {
      const url = new URL(checkoutBaseUrl);
      url.searchParams.set("quantity", String(quantity));
      return url.toString();
    } catch {
      return checkoutBaseUrl;
    }
  }, [quantity]);

  const handleWaitlistSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (!waitlistBaseUrl) {
      event.preventDefault();
      setWaitlistMessage(true);
    }
  };

  return (
    <section className="section offer-section" id="comprar">
      <div className="container offer-grid">
        <div className="offer-story" data-reveal>
          <p className="section-kicker">Sua Rubee Apis</p>
          <h2>Amanhã de manhã,<br/><em>dez gotas já podem ser suas.</em></h2>
          <p>Um frasco de 30 ml acompanha semanas de rotina. Garanta o seu e descubra como um cuidado pode ser simples de manter.</p>
          <ul>
            <li><Icon name="check" size={17}/> Gesto de segundos, todos os dias</li>
            <li><Icon name="check" size={17}/> Sabor suave, sem careta</li>
            <li><Icon name="check" size={17}/> Origem brasileira identificada</li>
          </ul>
          <div className="offer-note"><Icon name="spark"/><span><b>{checkoutUrl ? "Envio para todo o Brasil" : "Lançamento chegando"}</b>{checkoutUrl ? "Compra segura e rastreável" : "Entre na lista prioritária e compre antes de todo mundo"}</span></div>
        </div>
        <div className="buy-card" data-reveal>
          <div className="buy-card-top"><span>Rubee Apis</span><span>30 ml</span></div>
          <div className="buy-product"><img src="/images/product-packshot-official.png" alt="Frasco e embalagem do Extrato de Própolis Vermelha Rubee Apis" width="705" height="1199" loading="lazy" /></div>
          <div className="buy-info">
            <p>Rubee Apis · Própolis Vermelha</p>
            <div className="buy-price"><span>{checkoutUrl ? "Total" : "Preço de lançamento"}</span><strong>{total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong></div>
            {checkoutUrl && <div className="quantity-row" role="group" aria-labelledby="quantity-label">
              <span id="quantity-label">Quantidade</span>
              <div className="quantity-control">
                <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Diminuir quantidade"><Icon name="minus" size={17}/></button>
                <output id="quantity" aria-live="polite">{quantity}</output>
                <button type="button" onClick={() => setQuantity((value) => Math.min(10, value + 1))} aria-label="Aumentar quantidade"><Icon name="plus" size={17}/></button>
              </div>
            </div>}
            {checkoutUrl ? (
              <a className="button button--wine button--full" href={checkoutUrl}>Comprar {quantity} {quantity === 1 ? "unidade" : "unidades"} <Icon name="arrow" size={19}/></a>
            ) : (
              <form className="waitlist-form" action={waitlistBaseUrl} method="post" onSubmit={handleWaitlistSubmit}>
                <label htmlFor="waitlist-email">Seu melhor e-mail</label>
                <div className="waitlist-fields">
                  <input id="waitlist-email" name="email" type="email" autoComplete="email" placeholder="voce@exemplo.com" required />
                  <button className="button button--wine" type="submit">Garantir prioridade <Icon name="arrow" size={19}/></button>
                </div>
                <input type="hidden" name="source" value="landing-page-rubee-apis" />
              </form>
            )}
            {waitlistMessage && <p className="checkout-message" role="status">O canal de cadastro ainda não está conectado. Nenhuma informação foi enviada.</p>}
            <p className="secure-line"><Icon name="lock" size={14}/> {checkoutUrl ? "Pagamento processado em ambiente seguro" : "Nenhuma cobrança agora"}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <section className="section faq" id="duvidas">
      <div className="container faq-grid">
        <div className="faq-intro" data-reveal><p className="section-kicker">Perguntas frequentes</p><h2>Escolha com mais<br/><em>tranquilidade.</em></h2><p>Respostas diretas sobre a experiência, o uso e a compra da Rubee Apis.</p></div>
        <div className="accordion" data-reveal>
          {faqs.map((item, index) => {
            const isOpen = index === openIndex;
            const answerId = `faq-answer-${index}`;
            return <div className={`faq-item ${isOpen ? "is-open" : ""}`} key={item.q}><button type="button" aria-expanded={isOpen} aria-controls={answerId} onClick={() => setOpenIndex(isOpen ? -1 : index)}><span>{item.q}</span><Icon name={isOpen ? "minus" : "plus"} size={19}/></button><div className="faq-answer" id={answerId} hidden={!isOpen}><p>{item.a}</p></div></div>;
          })}
        </div>
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section className="closing">
      <div className="closing-pattern" />
      <div className="container closing-inner" data-reveal>
        <BrandMark />
        <p>Rubee Apis · Própolis vermelha brasileira</p>
        <h2>Amanhã, dez gotas.<br/><em>Comece hoje.</em></h2>
        <a className="button button--gold" href="#comprar">{ctaLabel} <Icon name="arrow" size={19}/></a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <div className="container footer-top">
        <BrandMark />
        <div className="footer-copy"><p>Rubee Apis · Própolis vermelha brasileira</p><small>Use conforme as orientações do rótulo. Este produto não é medicamento e não substitui tratamentos.</small></div>
        <a href="#inicio" className="back-top" aria-label="Voltar ao topo"><Icon name="arrow" size={18}/></a>
      </div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} Rubee Apis. Todos os direitos reservados.</span><span>Produto brasileiro</span></div>
    </footer>
  );
}

function App() {
  useReveal();
  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <Header />
      <main id="conteudo">
        <Hero />
        <Identification />
        <Moments />
        <Science />
        <Ritual />
        <Origin />
        <Offer />
        <FAQ />
        <Closing />
      </main>
      <Footer />
      <a className="mobile-buy" href="#comprar"><span><small>Rubee Apis · 30 ml</small>R$ 119,90</span><b>{checkoutBaseUrl ? "Comprar" : "Garantir"} <Icon name="arrow" size={17}/></b></a>
    </>
  );
}

export default App;
