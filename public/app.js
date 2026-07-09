const sessionId = crypto.randomUUID();

const chatForm = document.getElementById('chat-form');
const chatHistory = document.getElementById('chat-history');
const questionInput = document.getElementById('question-input');
const domainSelect = document.getElementById('domain-select');

const uploadForm = document.getElementById('upload-form');
const fileInput = document.getElementById('file-input');
const uploadDomainSelect = document.getElementById('upload-domain-select');
const uploadStatus = document.getElementById('upload-status');

function appendMessage(role, text, sources) {
  const messageEl = document.createElement('div');
  messageEl.className = `message ${role}`;
  messageEl.textContent = text;

  if (sources && sources.length > 0) {
    const sourcesEl = document.createElement('div');
    sourcesEl.className = 'sources';
    sourcesEl.textContent = 'Fuentes: ' + sources.map((s) => `${s.fileName} (${s.domain || 'General'})`).join(', ');
    messageEl.appendChild(sourcesEl);
  }

  chatHistory.appendChild(messageEl);
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

chatForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const question = questionInput.value.trim();
  if (!question) return;

  const domain = domainSelect.value || null;

  appendMessage('user', question);
  questionInput.value = '';

  try {
    const response = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, question, domain }),
    });

    const data = await response.json();

    if (!response.ok) {
      appendMessage('assistant', `Error: ${data.error || 'algo salió mal'}`);
      return;
    }

    appendMessage('assistant', data.answer, data.sources);
  } catch (error) {
    appendMessage('assistant', 'Error de conexión con el servidor.');
  }
});

uploadForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const file = fileInput.files[0];
  if (!file) return;

  const domain = uploadDomainSelect.value;

  const formData = new FormData();
  formData.append('file', file);
  if (domain) formData.append('domain', domain);

  uploadStatus.textContent = 'Subiendo e indexando...';

  try {
    const response = await fetch('/ingestion/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      uploadStatus.textContent = `Error: ${data.error || 'algo salió mal'}`;
      return;
    }

    uploadStatus.textContent = `✅ "${data.fileName}" indexado (${data.chunksIndexed} fragmento(s), dominio: ${data.domain})`;
    uploadForm.reset();
  } catch (error) {
    uploadStatus.textContent = 'Error de conexión con el servidor.';
  }
});