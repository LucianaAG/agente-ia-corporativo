const MAX_HISTORY_MESSAGES = 10;

const sessions = new Map();

function getHistory(sessionId) {
  return sessions.get(sessionId) || [];
}

function addMessage(sessionId, role, content) {
  const history = getHistory(sessionId);
  history.push({ role, content });

  const trimmed = history.slice(-MAX_HISTORY_MESSAGES);
  sessions.set(sessionId, trimmed);
}

function clearSession(sessionId) {
  sessions.delete(sessionId);
}

module.exports = { getHistory, addMessage, clearSession };