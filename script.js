const eventDate = new Date('2026-08-15T19:00:00-03:00');
const $ = (id) => document.getElementById(id);

function pad(value) {
  return String(Math.max(0, value)).padStart(2, '0');
}

function updateCountdown() {
  const diff = eventDate.getTime() - Date.now();
  const totalSeconds = Math.max(0, Math.floor(diff / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  $('days').textContent = days;
  $('hours').textContent = pad(hours);
  $('minutes').textContent = pad(minutes);
  $('seconds').textContent = pad(seconds);
}

updateCountdown();
setInterval(updateCountdown, 1000);

const form = $('rsvp-form');
const success = $('form-success');
const editButton = $('edit-rsvp');
const submitButton = $('rsvp-submit');
const errorBox = $('form-error');

// --- config do inbox ---
const INBOX_ENDPOINT = 'https://inbox.mauriciomilano.com/api/v1/submit';
const INBOX_TOKEN = 'mb_16e924eae3514664bd31892df41ec2b58ad3a7a0baf8bf78';

// email fixo do site — todas as confirmações caem na inbox do Mauricio
const SITE_EMAIL = 'aniversariodo@mauriciomilano.com';

const ANSWER_TEXT = {
  sim: 'Sim, estarei performando!',
  talvez: 'Talvez — estou negociando com o universo.',
  nao: 'Não consigo ir, mas mando amor.'
};

function showError(msg) {
  errorBox.textContent = msg;
  errorBox.hidden = false;
}
function clearError() {
  errorBox.textContent = '';
  errorBox.hidden = true;
}

function setLoading(isLoading) {
  submitButton.disabled = isLoading;
  submitButton.dataset.loading = isLoading ? '1' : '0';
  submitButton.setAttribute('aria-busy', isLoading ? 'true' : 'false');
  // mantém o <span> ↗ intacto; só troca o texto antes dele
  const labelNode = [...submitButton.childNodes].find(
    (n) => n.nodeType === Node.TEXT_NODE
  );
  if (labelNode) {
    labelNode.textContent = isLoading ? 'enviando… ' : 'confirmar presença ';
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearError();

  const data = new FormData(form);
  const name = String(data.get('name') || '').trim();
  const phone = String(data.get('phone') || '').trim();
  const answer = String(data.get('answer') || '');
  const song = String(data.get('song') || '').trim();
  const honey = String(data.get('_honey') || '').trim();

  // --- honeypot: bot detectado — finge sucesso e sai ---
  if (honey) {
    form.hidden = true;
    success.hidden = false;
    return;
  }

  // --- validação client-side ---
  if (!name) return showError('Falta teu nome.');
  if (!answer) return showError('Escolhe uma opção de presença.');

  // --- monta o payload pro inbox ---
  const answerText = ANSWER_TEXT[answer] || answer;
  const message = [
    'Convite M29 · 15.08.2026 · Casa 264',
    `Presença: ${answerText}`,
    song ? `Sugestão de música: ${song}` : ''
  ].filter(Boolean).join('\n');

  const payload = {
    name,
    email: SITE_EMAIL,
    phone,
    subject: 'RSVP · aniversário M29 · 15.08.2026',
    message
  };

  setLoading(true);
  try {
    const res = await fetch(INBOX_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Site-Token': INBOX_TOKEN
      },
      body: JSON.stringify(payload)
    });

    let body = null;
    try { body = await res.json(); } catch { /* resposta sem JSON */ }

    if (!res.ok || !body || !body.ok) {
      const reason = (body && (body.error || body.message)) || `HTTP ${res.status}`;
      throw new Error(reason);
    }

    // --- sucesso ---
    form.hidden = true;
    success.hidden = false;
    // (opcional) expor o id pra debug em window
    if (body.id) form.dataset.lastInboxId = body.id;
  } catch (err) {
    // mensagem amigável; loga o detalhe técnico no console
    console.error('[rsvp] envio falhou:', err);
    showError(
      'Não rolou enviar agora. Tenta de novo em alguns segundos — ' +
      'se persistir, me chama no WhatsApp.'
    );
  } finally {
    setLoading(false);
  }
});

editButton.addEventListener('click', () => {
  success.hidden = true;
  form.hidden = false;
  clearError();
  $('name').focus();
});
