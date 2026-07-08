const { askQuestion } = require('../rag/ragService');

async function handleChat(req, res, next) {
  try {
    const { sessionId, question, domain } = req.body;

    if (!sessionId || typeof sessionId !== 'string') {
      return res.status(400).json({ error: 'sessionId es requerido y debe ser un string' });
    }

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({ error: 'question es requerida y debe ser un string no vacío' });
    }

    const result = await askQuestion(question, sessionId, domain || null);

    res.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = { handleChat };