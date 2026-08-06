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

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const name = String(data.get('name') || '').trim();
  const answer = String(data.get('answer') || '');
  const song = String(data.get('song') || '').trim();

  const answerText = {
    sim: 'Sim, estarei performando!',
    talvez: 'Talvez — estou negociando com o universo.',
    nao: 'Não consigo ir, mas mando amor.'
  }[answer] || 'Ainda não sei.';

  const message = [
    'Oi, Mauricio! Vim pelo convite do M29 🎉',
    `Meu nome é ${name}.`,
    answerText,
    song ? `Minha sugestão de música: ${song}` : ''
  ].filter(Boolean).join('\n');

  // Replace with Mauricio's number when the RSVP channel is defined.
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank', 'noopener');
  form.hidden = true;
  success.hidden = false;
});

editButton.addEventListener('click', () => {
  success.hidden = true;
  form.hidden = false;
  $('name').focus();
});
