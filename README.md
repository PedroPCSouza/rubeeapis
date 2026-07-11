# Rubee Apis

Landing page de produto único para o Extrato de Própolis Vermelha Rubee Apis, desenvolvida com React, TypeScript e Vite para publicação na Cloudflare.

## Desenvolvimento local

```bash
npm install
cp .env.example .env
npm run dev
```

No pré-lançamento, deixe `VITE_CHECKOUT_URL` vazio e configure `VITE_WAITLIST_URL` com o endpoint que receberá os e-mails via `POST`. Quando as vendas abrirem, informe o endereço real do checkout em `VITE_CHECKOUT_URL`; a quantidade escolhida será acrescentada ao link no parâmetro `quantity`.

## Build

```bash
npm run build
npm run preview
```

O resultado é gerado em `dist/`.

## Publicar na Cloudflare

### Cloudflare Pages (recomendado com GitHub)

1. Conecte este repositório no painel da Cloudflare Pages.
2. Selecione o preset `Vite`.
3. Use `npm run build` como comando de build.
4. Use `dist` como diretório de saída.
5. Cadastre `VITE_WAITLIST_URL` no pré-lançamento e `VITE_CHECKOUT_URL` quando a venda estiver ativa, em **Settings > Environment variables**.

### Wrangler

Depois de autenticar a CLI da Cloudflare:

```bash
npm run deploy
```

## Antes de colocar no ar

- Revisar e aprovar as fotografias do produto e da apresentadora antes da campanha final.
- Configurar a URL real do checkout.
- Conectar `VITE_WAITLIST_URL` a um serviço autorizado de captura de leads e publicar a política de privacidade antes de coletar e-mails.
- Conferir no rótulo: ingredientes, concentração, graduação alcoólica, advertências e modo de uso.
- Confirmar regras comerciais de frete, rastreamento e suporte.
- Adicionar política de privacidade, termos, dados da empresa e canal de atendimento.
- Configurar domínio, analytics, Meta Pixel e eventos de conversão apenas com os identificadores oficiais.

## Ativos fotográficos

Os arquivos otimizados ficam em `public/images/`:

- `hero-product.webp`: composição publicitária criada a partir das fotografias reais do produto.
- `product-packshot.webp`: fotografia do frasco com a embalagem.
- `product-nature.webp`: fotografia do frasco em ambiente natural.
- `presenter.webp`: fotografia da apresentadora usada na seção de rotina.
