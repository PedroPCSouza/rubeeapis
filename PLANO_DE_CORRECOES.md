# Plano de correções — Rubee Apis

O plano deve começar pela operação comercial, não pelo visual. O site já parece profissional, mas ainda não possui todos os elementos necessários para vender com segurança.

## Fase 0 — Reunir informações indispensáveis

Antes de alterar a oferta, precisamos receber:

- Plataforma e URL do checkout.
- Razão social, CNPJ, endereço e canais de atendimento.
- Fotos legíveis da frente e do verso do rótulo.
- Ingredientes, concentração, graduação alcoólica e alergênicos.
- Modo de uso, advertências, conservação e restrições.
- Fabricante, município/UF e relação com o S.I.F. 3698.
- Formas de pagamento, postagem, frete e rastreamento.
- Regras reais de troca, devolução e reembolso.
- WhatsApp e e-mail de suporte.
- Laudos, registros ou documentos que possam ser publicados.

Sem esses dados, alguns componentes podem ser preparados, mas não finalizados.

## Fase 1 — Tornar a venda funcional

Prioridade máxima.

1. Criar e configurar a oferta de R$ 119,90 no checkout.
2. Confirmar como a plataforma recebe a quantidade.
3. Configurar `VITE_CHECKOUT_URL` no build de produção.
4. Conectar todos os CTAs ao checkout.
5. Informar meios de pagamento e condições de entrega.
6. Executar uma compra completa de teste.
7. Validar confirmação, e-mail, estoque, rastreamento e reembolso.

**Critério de conclusão:** uma compra real ou em ambiente de teste deve funcionar do início ao fim.

Enquanto isso não estiver pronto, os textos comerciais devem indicar `Vendas online em breve`.

## Fase 2 — Regularização e transparência

1. Criar a seção `Informações completas do produto`.
2. Adicionar galeria com zoom do rótulo frontal e traseiro.
3. Publicar os dados exatamente como aprovados na embalagem.
4. Criar rodapé empresarial completo.
5. Criar páginas de:

   - Contato.
   - Termos de compra.
   - Trocas e devoluções.
   - Entrega.
   - Privacidade.

6. Exibir um resumo do direito de arrependimento junto à oferta.
7. Complementar o S.I.F. com fabricante, município/UF e consulta oficial específica.

As políticas devem refletir a operação real e receber revisão jurídica antes do lançamento.

## Fase 3 — Corrigir deploy e infraestrutura

1. Atualizar o GitHub Actions para executar:

   - `actions/checkout`.
   - Configuração do Node.
   - `npm ci`.
   - `npm run build`.
   - Deploy com o Wrangler do projeto.
   - Teste HTTP da URL publicada.

2. Disponibilizar `VITE_CHECKOUT_URL` durante o build.
3. Desabilitar source maps em produção.
4. Aplicar cache longo às imagens.
5. Adicionar preload da imagem principal.
6. Implementar CSP e HSTS.
7. Validar rollback e deploy automático.

O deploy manual está funcional; o objetivo desta fase é tornar cada push para `main` confiável.

## Fase 4 — Encurtar e fortalecer a oferta

Nova ordem recomendada:

1. Hero.
2. Barra de confiança verificável.
3. Benefícios concretos.
4. Oferta e compra.
5. Evidências específicas da Rubee Apis.
6. Informações completas.
7. Origem da própolis.
8. FAQ e objeções.
9. CTA final.

Mudanças principais:

- Levar a oferta para logo após os benefícios.
- Reduzir a seção científica para um accordion.
- Remover uma das duas aparições da apresentadora.
- Manter uma única identidade visual para a personagem.
- Criar logo oficial transparente e vetorial.
- Transformar concentração, procedência, laudos e rendimento em argumentos de valor.
- Adicionar prova social somente quando autêntica.
- Inserir WhatsApp discreto e atendimento humano.
- Tornar o cabeçalho fixo no desktop.
- Trocar `A partir de R$ 119,90` por `1 unidade — R$ 119,90`.

## Fase 5 — SEO, analytics e acessibilidade

### SEO

- Criar `robots.txt` e `sitemap.xml` reais.
- Implementar resposta 404 correta.
- Adicionar URL canônica.
- Adicionar Open Graph, Twitter Card e imagem 1200×630.
- Criar JSON-LD de `Product`, `Brand` e `Offer`.
- Pré-renderizar a landing page ou migrar para geração estática.

### Mensuração

- Configurar GA4, GTM ou Meta Pixel.
- Implementar eventos:

  - `view_item`.
  - `select_quantity`.
  - `click_buy`.
  - `begin_checkout`.
  - `purchase`.

- Adicionar consentimento de cookies quando necessário.

### Acessibilidade

- Aumentar corpo de texto para pelo menos 16 px no celular.
- Melhorar contraste dos textos secundários.
- Aumentar os controles de quantidade para 44×44 px.
- Corrigir a semântica do seletor de quantidade.
- Adicionar link `Pular para o conteúdo`.
- Completar o comportamento acessível do menu mobile.
- Testar navegação por teclado e leitor de tela.

## Fase 6 — Validação antes dos anúncios

O lançamento só deve ocorrer depois de:

- Checkout testado integralmente.
- Informações do produto conferidas com o rótulo.
- Dados empresariais publicados.
- Políticas revisadas.
- Deploy automático aprovado.
- Testes mobile, desktop e navegadores principais.
- Lighthouse e validação de dados estruturados.
- Eventos de conversão confirmados.
- Teste de compartilhamento no WhatsApp.
- Revisão regulatória e jurídica final.

## Ordem recomendada

| Ordem | Ação | Resultado esperado |
|---:|---|---|
| 1 | Configurar e testar checkout real | Permitir vendas |
| 2 | Inserir dados empresariais e políticas | Reduzir risco e aumentar confiança |
| 3 | Publicar composição, álcool, advertências e modo de uso | Garantir transparência |
| 4 | Corrigir GitHub Actions e build da Cloudflare | Garantir deploys confiáveis |
| 5 | Reescrever a oferta com diferenciais comprovados | Justificar o preço |
| 6 | Informar frete, pagamento e atendimento | Reduzir abandono |
| 7 | Unificar apresentadora e corrigir logotipo | Dar consistência à marca |
| 8 | Configurar analytics e eventos | Permitir otimização |
| 9 | Corrigir SEO, compartilhamento e dados estruturados | Melhorar descoberta |
| 10 | Refinar acessibilidade e performance | Melhorar a experiência |

## Direção estratégica

Executar primeiro as fases 0 a 3. Elas transformam o site de apresentação em uma operação comercial confiável. As melhorias visuais, mensuração e aquisição de tráfego devem vir depois.

