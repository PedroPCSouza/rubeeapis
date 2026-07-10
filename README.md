# Rubee Apis

Landing page de produto único para o Extrato de Própolis Vermelha Rubee Apis, desenvolvida com React, TypeScript e Vite para publicação na Cloudflare.

## Desenvolvimento local

```bash
npm install
cp .env.example .env
npm run dev
```

Edite `VITE_CHECKOUT_URL` no arquivo `.env` com o endereço real do checkout. A quantidade escolhida pelo cliente é acrescentada ao link no parâmetro `quantity`.

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
5. Cadastre `VITE_CHECKOUT_URL` em **Settings > Environment variables**.

### Wrangler

Depois de autenticar a CLI da Cloudflare:

```bash
npm run deploy
```

## Antes de colocar no ar

- Substituir o mockup vetorial por fotografias oficiais do produto, se disponíveis.
- Configurar a URL real do checkout.
- Conferir no rótulo: ingredientes, concentração, graduação alcoólica, advertências e modo de uso.
- Confirmar regras comerciais de frete, rastreamento e suporte.
- Adicionar política de privacidade, termos, dados da empresa e canal de atendimento.
- Configurar domínio, analytics, Meta Pixel e eventos de conversão apenas com os identificadores oficiais.

