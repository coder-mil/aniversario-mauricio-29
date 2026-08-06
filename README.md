# Mauricio faz 29 — convite web

Convite digital para o aniversário de 29 anos do Mauricio Milano.

- **Data:** sábado, 15 de agosto de 2026
- **Horário:** a partir das 19h
- **Local:** [Casa 264](https://www.casa264.com.br/), Rua General Andrade Neves, 264 — São Domingos, Niterói/RJ
- **Tema:** festa mais “de humanas” — tira o sapatênis e traz sua ecobag para performar.

## Rodar localmente

O site é estático e não precisa de dependências:

```bash
python3 -m http.server 4173
```

Abra <http://localhost:4173> no navegador.

## Personalização pendente

Antes de compartilhar o link final:

1. (resolvido) RSVP é integrado com `inbox.mauriciomilano.com/api/v1/submit` — o token de site está versionado no `script.js`.
2. Se quiser, incluir uma foto do aniversariante ou da Casa 264.
3. Definir se haverá informações de entrada, consumação, acompanhantes e encerramento.
4. Trocar o link de sugestão de música por uma playlist colaborativa real do Spotify.

## Integração com o Milano Inbox

O formulário de RSVP envia os dados para `https://inbox.mauriciomilano.com/api/v1/submit`
via `fetch` (POST, JSON, header `X-Site-Token`). Campos enviados:

- `name` (obrigatório, do input `name`)
- `email` (fixo: `aniversariodo@mauriciomilano.com` — não é pedido ao visitante)
- `phone` (vazio — campo legado do schema, não é mais pedido)
- `note` (opcional, textarea de mensagem livre) — incluído no `message` como bloco "Recado:"
- `subject` (fixo: `RSVP · aniversário M29 · 15.08.2026`)
- `message` (composto a partir de `answer` + `note`)

Anti-spam: campo `_honey` hidden; se vier preenchido, finge sucesso e não envia.

## Arquivos

- `index.html` — estrutura e conteúdo
- `styles.css` — identidade visual responsiva
- `script.js` — contagem regressiva e RSVP
