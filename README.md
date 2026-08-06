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

1. Substituir o `wa.me/?text=...` em `script.js` pelo número do Mauricio, caso o RSVP seja via WhatsApp.
2. Se quiser, incluir uma foto do aniversariante ou da Casa 264.
3. Definir se haverá informações de entrada, consumação, acompanhantes e encerramento.
4. Trocar o link de sugestão de música por uma playlist colaborativa real do Spotify.

## Arquivos

- `index.html` — estrutura e conteúdo
- `styles.css` — identidade visual responsiva
- `script.js` — contagem regressiva e RSVP
