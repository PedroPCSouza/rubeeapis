import { useMemo, useState } from "react";

const PRICE = 119.9;
const checkoutBaseUrl = import.meta.env.VITE_CHECKOUT_URL?.trim();

type IconName =
  | "arrow"
  | "bottle"
  | "box"
  | "check"
  | "drop"
  | "leaf"
  | "lock"
  | "menu"
  | "minus"
  | "plus"
  | "shield"
  | "spark"
  | "truck"
  | "x";

const iconPaths: Record<IconName, React.ReactNode> = {
  arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
  bottle: <><path d="M9 2h6v4H9z"/><path d="M8 6h8l1 4v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V10z"/><path d="M9 14h6"/></>,
  box: <><path d="m21 8-9-5-9 5 9 5z"/><path d="m3 8 9 5 9-5"/><path d="M12 13v9"/><path d="m21 8v9l-9 5-9-5V8"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  drop: <path d="M12 2s6 7 6 12a6 6 0 1 1-12 0c0-5 6-12 6-12Z"/>,
  leaf: <><path d="M20.8 3.2C13 3 5 6 4.2 14.5c-.2 2.2 1.6 4 3.8 3.8C16.5 17.5 20 10 20.8 3.2Z"/><path d="M5 20c3-5 7-8 12-11"/></>,
  lock: <><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
  menu: <><path d="M4 7h16"/><path d="M4 17h16"/></>,
  minus: <path d="M5 12h14"/>,
  plus: <><path d="M12 5v14"/><path d="M5 12h14"/></>,
  shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></>,
  spark: <path d="m12 2 1.7 5.3L19 9l-5.3 1.7L12 16l-1.7-5.3L5 9l5.3-1.7z"/>,
  truck: <><path d="M3 6h11v10H3z"/><path d="M14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></>,
  x: <><path d="m6 6 12 12"/><path d="M18 6 6 18"/></>,
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

const benefits = [
  { icon: "drop" as const, number: "01", title: "Simples de manter", text: "10 gotinhas por dia em um gesto rápido, fácil de repetir e de encaixar na rotina." },
  { icon: "spark" as const, number: "02", title: "Sabor que não pesa", text: "Sabor suave, sem gosto forte, para tornar a experiência mais agradável todos os dias." },
  { icon: "bottle" as const, number: "03", title: "Praticidade de verdade", text: "O conta-gotas ajuda a separar a quantidade do dia de forma simples e sem desperdício." },
  { icon: "leaf" as const, number: "04", title: "Origem sem exageros", text: "Própolis vermelha brasileira apresentada com clareza para você escolher com mais confiança." },
];

const faqs = [
  { q: "O que é a Rubee Apis?", a: "É um extrato de própolis vermelha brasileira pensado para tornar essa escolha mais simples, agradável e prática no dia a dia." },
  { q: "Como incluir no dia a dia?", a: "A indicação informada pela marca é de 10 gotinhas por dia. Use sempre conforme as orientações e advertências presentes no rótulo." },
  { q: "O sabor é forte?", a: "A Rubee Apis tem sabor suave, pensado para uma experiência mais agradável e sem gosto forte." },
  { q: "O que vem na compra?", a: "Você recebe uma unidade Rubee Apis de 30 ml com conta-gotas e sua embalagem individual." },
  { q: "Como devo conservar?", a: "Siga as condições de conservação indicadas na embalagem e mantenha o produto em local adequado." },
  { q: "Quando as vendas começam?", a: "A loja está em pré-lançamento. Use o botão “Quero ser avisado” para acompanhar a abertura das vendas." },
];

function Header() {
  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <BrandMark />
        <a className="nav-buy header-primary-cta" href="#comprar">{checkoutBaseUrl ? "Comprar Rubee Apis" : "Quero ser avisado"} <Icon name="arrow" size={17}/></a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero-photo" aria-hidden="true">
        <img src="/images/hero-product-blurred-v2.webp" alt="" width="1672" height="939" fetchPriority="high" />
      </div>
      <div className="hero-noise" />
      <div className="hero-glow" />
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow"><span /> Própolis vermelha brasileira</p>
          <h1>Seu cuidado diário, <em>mais simples.</em></h1>
          <p className="hero-lead">10 gotinhas por dia, sabor suave e a praticidade do conta-gotas para acompanhar sua rotina sem complicação.</p>
          <div className="hero-purchase">
            <div className="hero-price"><span>1 unidade</span><strong>R$ 119<sup>,90</sup></strong></div>
            <a className="button button--gold" href="#comprar">{checkoutBaseUrl ? "Comprar Rubee Apis" : "Quero ser avisado"} <Icon name="arrow" size={19}/></a>
          </div>
          <div className="micro-trust"><span><Icon name="drop" size={15}/> 10 gotinhas por dia</span><span><Icon name="spark" size={17}/> Sabor suave</span></div>
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
      <div className="container identification-inner">
        <p className="section-kicker">Uma escolha que cabe no dia</p>
        <h2 id="identification-title">Natural no que importa.<br/><em>Simples no que você precisa.</em></h2>
        <p>Você não precisa de mais uma rotina difícil de seguir. Precisa de uma escolha agradável, prática e fácil de continuar mesmo nos dias corridos.</p>
        <p>Rubee Apis transforma a própolis vermelha brasileira em um pequeno gesto diário, com sabor suave e nenhuma complicação.</p>
      </div>
    </section>
  );
}

function TrustStrip() {
  return (
    <section className="trust-strip" aria-label="Diferenciais da compra">
      <div className="container trust-grid">
        <div><Icon name="drop"/><span><b>10 gotinhas</b>Um gesto simples por dia</span></div>
        <div><Icon name="spark"/><span><b>Sabor suave</b>Sem gosto forte</span></div>
        <div><Icon name="bottle"/><span><b>Conta-gotas</b>Praticidade sem desperdício</span></div>
        <div><Icon name="leaf"/><span><b>Origem brasileira</b>Própolis vermelha sem exageros</span></div>
      </div>
    </section>
  );
}

function Benefits() {
  return (
    <section className="section benefits" id="beneficios">
      <div className="container">
        <div className="section-heading">
          <div><p className="section-kicker">Vantagens para a vida real</p><h2>Mais fácil de começar.<br/><em>Mais fácil de continuar.</em></h2></div>
          <p>Menos esforço para usar, sabor mais agradável e uma origem que você consegue reconhecer.</p>
        </div>
        <div className="benefit-grid">
          {benefits.map((benefit) => (
            <article className="benefit-card" key={benefit.title}>
              <span className="benefit-number">{benefit.number}</span>
              <div className="benefit-icon"><Icon name={benefit.icon}/></div>
              <h3>{benefit.title}</h3>
              <p>{benefit.text}</p>
              <span className="card-line" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Origin() {
  return (
    <section className="origin" id="origem">
      <div className="origin-art origin-art--presenter">
        <img className="origin-presenter" src="/images/presenter-hq.webp" alt="Apresentadora Rubee Apis mostrando o produto" width="1386" height="1848" loading="lazy" />
        <img className="origin-presenter-product origin-presenter-product--bottle" src="/images/product-bottle-official.png" alt="Frasco Rubee Apis" width="154" height="500" loading="lazy" />
      </div>
      <div className="origin-copy">
        <p className="section-kicker section-kicker--light">Da origem para o seu dia</p>
        <h2>Brasileira na origem.<br/><em>Simples na experiência.</em></h2>
          <p>A própolis vermelha brasileira é o ponto de partida. Rubee Apis combina essa origem com sabor suave e um uso simples, para quem quer uma escolha natural que realmente caiba no dia.</p>
        <div className="specs">
          <div><span>No dia a dia</span><b>10 gotinhas</b></div>
          <div><span>Experiência</span><b>Sabor suave</b></div>
          <div><span>Praticidade</span><b>Conta-gotas</b></div>
          <div><span>Origem</span><b>Brasileira</b></div>
        </div>
        <a className="text-link" href="#ciencia">Conheça a origem botânica <Icon name="arrow" size={18}/></a>
      </div>
    </section>
  );
}

function OriginScience() {
  return (
    <section className="origin-science" id="ciencia">
      <div className="container">
        <details className="science-details">
          <summary><span><small>Origem & pesquisa</small>Entenda a própolis vermelha brasileira</span><Icon name="plus" size={21}/></summary>
          <div className="science-details-content">
            <p>Estudos identificam relação com fontes botânicas costeiras, incluindo a <i>Dalbergia ecastophyllum</i>, conhecida como rabo-de-bugio. A literatura descreve isoflavonoides e compostos fenólicos, cuja composição pode variar conforme origem, safra e extração.</p>
            <p className="science-disclaimer">Resultados laboratoriais não comprovam benefícios clínicos deste produto. A Rubee Apis não promete prevenir, tratar ou curar doenças.</p>
            <div className="science-sources"><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC2529384/" target="_blank" rel="noreferrer">Estudo botânico</a><a href="https://www.gov.br/anvisa/pt-br/assuntos/fiscalizacao-e-monitoramento/propaganda/propaganda" target="_blank" rel="noreferrer">Regras da Anvisa</a></div>
          </div>
        </details>
      </div>
    </section>
  );
}

function Routine() {
  return (
    <section className="section routine" id="como-usar">
      <div className="container routine-grid">
        <div className="routine-copy">
          <p className="section-kicker">Um gesto fácil de repetir</p>
          <h2>Dez gotinhas.<br/><em>Um passo simples no seu dia.</em></h2>
          <p className="routine-intro">Separe as 10 gotinhas conforme a orientação da marca e siga sempre as advertências do rótulo. O conta-gotas deixa esse momento rápido, prático e fácil de manter.</p>
          <div className="routine-guidance"><Icon name="shield"/><p>Para usar com tranquilidade, consulte as orientações e restrições apresentadas na embalagem.</p></div>
        </div>
        <div className="routine-visual">
          <img className="routine-photo" src="/images/hero-product-blurred-v2.webp" alt="Frasco e embalagem Rubee Apis" width="1672" height="939" loading="lazy" />
          <div className="routine-quote"><Icon name="drop" size={18}/><p>10 gotinhas.<br/>Sem complicação.</p></div>
        </div>
      </div>
    </section>
  );
}

function Offer() {
  const [quantity, setQuantity] = useState(1);
  const [checkoutMessage, setCheckoutMessage] = useState(false);
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

  const handleCheckout = () => {
    if (!checkoutUrl) setCheckoutMessage(true);
  };

  return (
    <section className="section offer-section" id="comprar">
      <div className="container offer-grid">
        <div className="offer-story">
          <p className="section-kicker">Oportunidade de pré-lançamento</p>
          <h2>Comece com uma rotina<br/><em>mais simples de manter.</em></h2>
          <p>Entre na lista para saber primeiro quando a Rubee Apis estiver disponível por R$ 119,90.</p>
          <ul>
            <li><Icon name="check" size={17}/> Uso diário simples e rápido</li>
            <li><Icon name="check" size={17}/> Sabor suave e agradável</li>
            <li><Icon name="check" size={17}/> Praticidade para continuar todos os dias</li>
          </ul>
          <div className="offer-note"><Icon name="spark"/><span><b>Seja avisado primeiro</b>Acompanhe a abertura das vendas</span></div>
        </div>
        <div className="buy-card">
          <div className="buy-card-top"><span>Rubee Apis</span><span>30 ml</span></div>
          <div className="buy-product"><img src="/images/product-packshot-official.png" alt="Frasco e embalagem do Extrato de Própolis Vermelha Rubee Apis" width="705" height="1199" loading="lazy" /></div>
          <div className="buy-info">
            <p>Rubee Apis · Própolis Vermelha</p>
            <div className="buy-price"><span>{checkoutUrl ? "Total" : "Preço"}</span><strong>{total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong></div>
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
              <button className="button button--wine button--full" type="button" onClick={handleCheckout}>Quero ser avisado <Icon name="arrow" size={19}/></button>
            )}
            {checkoutMessage && <p className="checkout-message" role="status">Seja uma das primeiras pessoas a saber quando a Rubee Apis estiver disponível. O canal de cadastro será publicado aqui.</p>}
            <p className="secure-line"><Icon name="lock" size={14}/> Nenhuma cobrança no pré-lançamento</p>
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
        <div className="faq-intro"><p className="section-kicker">Perguntas frequentes</p><h2>Escolha com mais<br/><em>tranquilidade.</em></h2><p>Respostas diretas sobre a experiência, o uso e o pré-lançamento da Rubee Apis.</p></div>
        <div className="accordion">
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
      <div className="container closing-inner">
        <BrandMark />
        <p>Rubee Apis · Própolis vermelha brasileira</p>
        <h2>Seu próximo cuidado<br/><em>pode ser o mais simples.</em></h2>
        <a className="button button--gold" href="#comprar">{checkoutBaseUrl ? "Comprar Rubee Apis" : "Quero ser avisado"} <Icon name="arrow" size={19}/></a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <div className="container footer-top">
        <BrandMark />
        <div className="footer-copy"><p>Rubee Apis · Própolis vermelha brasileira</p><small>Use conforme as orientações do rótulo. Este produto não é medicamento.</small><small className="footer-pending">Loja em pré-lançamento. Nenhuma cobrança é realizada nesta etapa.</small></div>
        <a href="#inicio" className="back-top" aria-label="Voltar ao topo"><Icon name="arrow" size={18}/></a>
      </div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} Rubee Apis. Todos os direitos reservados.</span><span>Produto brasileiro</span></div>
    </footer>
  );
}

function App() {
  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <Header />
      <main id="conteudo">
        <Hero />
        <Identification />
        <Benefits />
        <Offer />
        <TrustStrip />
        <Origin />
        <OriginScience />
        <Routine />
        <FAQ />
        <Closing />
      </main>
      <Footer />
      <a className="mobile-buy" href="#comprar"><span><small>1 unidade</small>R$ 119,90</span><b>{checkoutBaseUrl ? "Comprar" : "Quero ser avisado"} <Icon name="arrow" size={17}/></b></a>
    </>
  );
}

export default App;
