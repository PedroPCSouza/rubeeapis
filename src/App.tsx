import { useEffect, useMemo, useState } from "react";

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
      <img className="brand-logo" src="/images/rubee-logo-official.webp" alt="Rubee Apis" width="343" height="271" />
    </a>
  );
}

const benefits = [
  { icon: "drop" as const, number: "01", title: "Praticidade todos os dias", text: "O frasco conta-gotas torna o uso simples e controlado, em casa ou onde a sua rotina levar." },
  { icon: "leaf" as const, number: "02", title: "Origem brasileira", text: "Produzido a partir de própolis vermelha, um ingrediente natural de origem apícola brasileira." },
  { icon: "spark" as const, number: "03", title: "Apresentação premium", text: "Frasco protegido e uma experiência elegante, pensada para transformar o cuidado em ritual." },
  { icon: "shield" as const, number: "04", title: "Escolha transparente", text: "Composição, procedência, modo de uso e fabricação apresentados com clareza no rótulo." },
];

const faqs = [
  { q: "O que é a Rubee Apis?", a: "É um extrato de própolis vermelha brasileira apresentado em frasco conta-gotas de 30 ml." },
  { q: "Como devo utilizar?", a: "Utilize somente conforme as instruções presentes no rótulo do produto. Não substitua as orientações do fabricante por recomendações encontradas na internet." },
  { q: "O produto contém álcool?", a: "A formulação e a graduação alcoólica, quando aplicável, devem ser verificadas diretamente no rótulo da unidade recebida." },
  { q: "Qual é o prazo de entrega?", a: "O prazo e as modalidades de envio são calculados no checkout a partir do CEP informado." },
  { q: "Como acompanho meu pedido?", a: "Quando a modalidade de entrega escolhida oferecer rastreamento, o código ou link será enviado pelo canal cadastrado durante a compra." },
  { q: "A compra é segura?", a: "O checkout é processado em ambiente protegido pela plataforma de pagamento configurada pela Rubee Apis." },
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const close = () => setMenuOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <BrandMark />
        <nav className={menuOpen ? "nav-links is-open" : "nav-links"} aria-label="Navegação principal">
          <a href="#beneficios" onClick={() => setMenuOpen(false)}>Benefícios</a>
          <a href="#origem" onClick={() => setMenuOpen(false)}>Origem</a>
          <a href="#qualidade" onClick={() => setMenuOpen(false)}>Qualidade</a>
          <a href="#duvidas" onClick={() => setMenuOpen(false)}>Dúvidas</a>
          <a className="nav-buy" href="#comprar" onClick={() => setMenuOpen(false)}>Comprar agora <Icon name="arrow" size={17}/></a>
        </nav>
        <button className="menu-button" type="button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}>
          <Icon name={menuOpen ? "x" : "menu"} />
        </button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero-photo" aria-hidden="true">
        <img src="/images/hero-product.webp" alt="" width="1672" height="939" fetchPriority="high" />
      </div>
      <div className="hero-noise" />
      <div className="hero-glow" />
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow"><span /> Extrato de própolis vermelha · 30 ml</p>
          <h1>A força da natureza <em>em cada gota.</em></h1>
          <p className="hero-lead">Própolis vermelha brasileira em uma apresentação premium, prática e fácil de incluir na sua rotina.</p>
          <div className="hero-purchase">
            <div className="hero-price"><span>por apenas</span><strong>R$ 119<sup>,90</sup></strong></div>
            <a className="button button--gold" href="#comprar">Comprar agora <Icon name="arrow" size={19}/></a>
          </div>
          <div className="micro-trust"><span><Icon name="lock" size={15}/> Compra em ambiente protegido</span><span><Icon name="truck" size={17}/> Entrega calculada pelo CEP</span></div>
        </div>
        <div className="hero-side-note" aria-hidden="true"><span>01</span><i /> <p>NATURALMENTE<br/>BRASILEIRA</p></div>
      </div>
      <div className="scroll-cue" aria-hidden="true"><span>Descubra</span><i /></div>
    </section>
  );
}

function TrustStrip() {
  return (
    <section className="trust-strip" aria-label="Diferenciais da compra">
      <div className="container trust-grid">
        <div><Icon name="leaf"/><span><b>Origem</b>Própolis vermelha brasileira</span></div>
        <div><Icon name="bottle"/><span><b>Praticidade</b>Frasco conta-gotas de 30 ml</span></div>
        <div><Icon name="lock"/><span><b>Segurança</b>Pagamento em ambiente protegido</span></div>
        <div><Icon name="truck"/><span><b>Entrega</b>Opções informadas no checkout</span></div>
      </div>
    </section>
  );
}

function Benefits() {
  return (
    <section className="section benefits" id="beneficios">
      <div className="container">
        <div className="section-heading">
          <div><p className="section-kicker">Feita para o seu ritmo</p><h2>Um cuidado natural que<br/><em>acompanha a rotina.</em></h2></div>
          <p>Mais que um frasco: uma experiência que une origem, praticidade e beleza em todos os detalhes.</p>
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
      <div className="origin-art">
        <img src="/images/product-nature.webp" alt="Frasco de extrato de própolis vermelha Rubee Apis em ambiente natural" width="387" height="516" loading="lazy" />
        <div className="origin-photo-caption"><Icon name="leaf" size={16}/><span>Fotografia do<br/><b>produto real</b></span></div>
      </div>
      <div className="origin-copy">
        <p className="section-kicker section-kicker--light">Rara por natureza</p>
        <h2>Vermelha na cor.<br/><em>Brasileira na origem.</em></h2>
        <p>A própolis vermelha se destaca pela coloração característica e pela relação com ecossistemas costeiros brasileiros. Na Rubee Apis, ela chega em um frasco de 30 ml com conta-gotas, facilitando sua inclusão na rotina.</p>
        <div className="specs">
          <div><span>Tipo</span><b>Extrato de própolis vermelha</b></div>
          <div><span>Conteúdo</span><b>30 ml</b></div>
          <div><span>Origem</span><b>Brasileira</b></div>
          <div><span>Embalagem</span><b>Frasco âmbar com conta-gotas</b></div>
        </div>
        <a className="text-link" href="#ciencia">Conheça a origem botânica <Icon name="arrow" size={18}/></a>
      </div>
    </section>
  );
}

function OriginScience() {
  return (
    <section className="section origin-science" id="ciencia">
      <div className="container">
        <div className="section-heading">
          <div><p className="section-kicker">Origem & pesquisa</p><h2>O que a ciência<br/><em>ajuda a explicar.</em></h2></div>
          <p>Informação científica apresentada com responsabilidade: contexto sobre a matéria-prima, sem transformar pesquisa em promessa terapêutica.</p>
        </div>
        <div className="science-grid">
          <article className="science-card">
            <span>01</span><div className="science-card-icon"><Icon name="leaf"/></div>
            <h3>Uma origem costeira</h3>
            <p>Estudos identificam a <i>Dalbergia ecastophyllum</i>, conhecida como rabo-de-bugio, como uma das principais fontes botânicas da própolis vermelha brasileira.</p>
          </article>
          <article className="science-card">
            <span>02</span><div className="science-card-icon"><Icon name="spark"/></div>
            <h3>Composição singular</h3>
            <p>A literatura descreve isoflavonoides e outros compostos fenólicos. A composição pode variar conforme origem, safra e processo de extração.</p>
          </article>
          <article className="science-card">
            <span>03</span><div className="science-card-icon"><Icon name="shield"/></div>
            <h3>Ciência com responsabilidade</h3>
            <p>Resultados de laboratório não comprovam, por si só, benefícios clínicos deste produto. Por isso, a Rubee Apis não promete prevenir, tratar ou curar doenças.</p>
          </article>
        </div>
        <div className="science-note">
          <Icon name="shield" size={22}/>
          <p><b>Transparência primeiro.</b> Use o produto somente conforme as instruções e advertências do rótulo.</p>
          <div className="science-sources"><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC2529384/" target="_blank" rel="noreferrer">Estudo botânico</a><a href="https://www.gov.br/anvisa/pt-br/assuntos/fiscalizacao-e-monitoramento/propaganda/propaganda" target="_blank" rel="noreferrer">Regras da Anvisa</a></div>
        </div>
      </div>
    </section>
  );
}

function Routine() {
  const steps = [
    ["01", "Abra o frasco", "Desrosqueie cuidadosamente o conta-gotas."],
    ["02", "Siga o rótulo", "Utilize somente a quantidade indicada pelo fabricante."],
    ["03", "Mantenha o cuidado", "Conserve o produto nas condições indicadas na embalagem."],
  ];

  return (
    <section className="section routine">
      <div className="container routine-grid">
        <div className="routine-copy">
          <p className="section-kicker">Seu ritual Rubee</p>
          <h2>Simples de incluir.<br/><em>Fácil de manter.</em></h2>
          <p className="routine-intro">Um pequeno gesto pode marcar um momento só seu. Siga sempre as instruções do rótulo.</p>
          <div className="steps">
            {steps.map(([number, title, text]) => <div className="step" key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}
          </div>
        </div>
        <div className="routine-visual">
          <div className="routine-ring"><span>Ritual<br/>diário</span></div>
          <img className="presenter-photo" src="/images/presenter.webp" alt="Apresentadora Rubee Apis indicando o produto" width="1386" height="1848" loading="lazy" />
          <div className="presenter-product-card" aria-hidden="true">
            <img src="/images/product-packshot.webp" alt="" width="387" height="516" loading="lazy" />
          </div>
          <div className="routine-quote"><Icon name="drop" size={18}/><p>Praticidade que<br/>cabe na rotina.</p></div>
        </div>
      </div>
    </section>
  );
}

function Quality() {
  return (
    <section className="quality" id="qualidade">
      <div className="container quality-grid">
        <div className="quality-seal" aria-hidden="true"><svg viewBox="0 0 240 240"><defs><path id="circleText" d="M120,120 m-88,0 a88,88 0 1,1 176,0 a88,88 0 1,1 -176,0"/></defs><text><textPath href="#circleText">RUBEE APIS • S.I.F. 3698 • INSPEÇÃO FEDERAL • </textPath></text><path d="M120 72c16 13 25 28 25 44a25 25 0 1 1-50 0c0-16 9-31 25-44Z"/><path d="m108 118 8 8 17-19"/></svg></div>
        <div className="quality-copy">
          <p className="section-kicker section-kicker--light">Escolha consciente</p>
          <h2>Inspeção e informação<br/><em>fazem parte da escolha.</em></h2>
          <p>A embalagem exibe o selo S.I.F. 3698. Vinculado ao DIPOA/MAPA, o Serviço de Inspeção Federal fiscaliza produtos de origem animal destinados aos mercados interno e externo.</p>
          <div className="quality-points">
            <span><Icon name="check" size={17}/> S.I.F. 3698 exibido na embalagem</span>
            <span><Icon name="check" size={17}/> Inspeção federal de produto apícola</span>
            <span><Icon name="check" size={17}/> Lote e validade identificados</span>
            <span><Icon name="check" size={17}/> Modo de uso indicado no rótulo</span>
          </div>
          <a className="text-link" href="https://www.gov.br/agricultura/pt-br/internacional/assuntos/inspecao/produtos-animal/sif/servico-de-inspecao-federal-sif" target="_blank" rel="noreferrer">Entenda o S.I.F. no MAPA <Icon name="arrow" size={18}/></a>
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
          <p className="section-kicker">A sua Rubee Apis</p>
          <h2>Um ritual pequeno.<br/><em>Uma escolha especial.</em></h2>
          <p>Receba em casa uma apresentação cuidadosamente criada para preservar e valorizar a própolis vermelha brasileira.</p>
          <ul>
            <li><Icon name="check" size={17}/> 1 frasco conta-gotas de 30 ml</li>
            <li><Icon name="check" size={17}/> Embalagem individual Rubee Apis</li>
            <li><Icon name="check" size={17}/> Rótulo com informações do produto</li>
          </ul>
          <div className="offer-note"><Icon name="box"/><span><b>Opções de entrega</b>Prazo informado no checkout</span></div>
        </div>
        <div className="buy-card">
          <div className="buy-card-top"><span>Rubee Apis</span><span>30 ml</span></div>
          <div className="buy-product"><img src="/images/product-packshot.webp" alt="Frasco e embalagem do Extrato de Própolis Vermelha Rubee Apis" width="387" height="516" loading="lazy" /></div>
          <div className="buy-info">
            <p>Extrato de Própolis Vermelha</p>
            <div className="buy-price"><span>Total</span><strong>{total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong></div>
            <div className="quantity-row">
              <label htmlFor="quantity">Quantidade</label>
              <div className="quantity-control">
                <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Diminuir quantidade"><Icon name="minus" size={17}/></button>
                <output id="quantity" aria-live="polite">{quantity}</output>
                <button type="button" onClick={() => setQuantity((value) => Math.min(10, value + 1))} aria-label="Aumentar quantidade"><Icon name="plus" size={17}/></button>
              </div>
            </div>
            {checkoutUrl ? (
              <a className="button button--wine button--full" href={checkoutUrl}>Ir para o checkout <Icon name="arrow" size={19}/></a>
            ) : (
              <button className="button button--wine button--full" type="button" onClick={handleCheckout}>Comprar agora <Icon name="arrow" size={19}/></button>
            )}
            {checkoutMessage && <p className="checkout-message" role="status">As vendas online serão abertas em breve.</p>}
            <p className="secure-line"><Icon name="lock" size={14}/> Compra processada em ambiente seguro</p>
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
        <div className="faq-intro"><p className="section-kicker">Perguntas frequentes</p><h2>Antes de escolher,<br/><em>saiba mais.</em></h2><p>Ainda ficou com alguma dúvida? As informações da unidade recebida e do seu rótulo devem ser sempre a referência principal.</p></div>
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

function PresenterSupport() {
  return (
    <section className="presenter-support">
      <div className="presenter-support-photo">
        <img src="/images/presenter-support.webp" alt="Apresentadora em composição editorial da Rubee Apis" width="1122" height="1408" loading="lazy" />
      </div>
      <div className="presenter-support-copy">
        <p className="section-kicker">Rubee Apis por perto</p>
        <h2>Clareza para escolher.<br/><em>Leveza para incluir.</em></h2>
        <p>Antes da compra, conheça os detalhes do produto, consulte as orientações do rótulo e encontre respostas para as dúvidas mais comuns.</p>
        <div className="presenter-support-points">
          <span><Icon name="check" size={17}/> Informações essenciais reunidas</span>
          <span><Icon name="check" size={17}/> Uso sempre orientado pelo rótulo</span>
        </div>
        <a className="text-link text-link--wine" href="#duvidas">Ver perguntas frequentes <Icon name="arrow" size={18}/></a>
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
        <p>Própolis vermelha brasileira · 30 ml</p>
        <h2>Leve a força da natureza<br/><em>para a sua rotina.</em></h2>
        <a className="button button--gold" href="#comprar">Quero minha Rubee Apis <Icon name="arrow" size={19}/></a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <div className="container footer-top">
        <BrandMark />
        <div className="footer-copy"><p>Extrato de Própolis Vermelha Rubee Apis · 30 ml</p><small>Use conforme as instruções do rótulo. Este produto não é medicamento.</small></div>
        <a href="#inicio" className="back-top" aria-label="Voltar ao topo"><Icon name="arrow" size={18}/></a>
      </div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} Rubee Apis. Todos os direitos reservados.</span><span>Produto brasileiro</span></div>
    </footer>
  );
}

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustStrip />
        <Benefits />
        <Origin />
        <OriginScience />
        <Routine />
        <Quality />
        <Offer />
        <FAQ />
        <PresenterSupport />
        <Closing />
      </main>
      <Footer />
      <a className="mobile-buy" href="#comprar"><span><small>A partir de</small>R$ 119,90</span><b>Comprar agora <Icon name="arrow" size={17}/></b></a>
    </>
  );
}

export default App;
