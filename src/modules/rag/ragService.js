const { InferenceClient } = require('@huggingface/inference');
const env = require('../../config/env');
const { generateEmbedding } = require('./embeddings');
const { search } = require('./vectorStore');
const { getHistory, addMessage } = require('../chat/conversationMemory');

const client = new InferenceClient(env.HUGGINGFACE_API_KEY);
const LLM_MODEL = 'Qwen/Qwen2.5-7B-Instruct';

const SYSTEM_PROMPT = `Sos un asistente corporativo que responde preguntas de colaboradores de una empresa, basándote ÚNICAMENTE en la información de los documentos internos que se te proporcionan.

Si la respuesta no está en el contexto proporcionado, decí claramente que no tenés esa información en los documentos disponibles, no inventes datos.`;

function buildContextMessage(question, chunks) {
  const context = chunks
    .map((chunk, index) => `[Fragmento ${index + 1}] (${chunk.metadata.fileName})\n${chunk.text}`)
    .join('\n\n');

  return `Contexto:\n${context}\n\nPregunta del colaborador: ${question}`;
}

async function askQuestion(question, sessionId, domain = null, topK = 3) {
  const queryEmbedding = await generateEmbedding(question);
  const relevantChunks = search(queryEmbedding, topK, domain);

  if (relevantChunks.length === 0) {
    return {
      answer: domain
        ? `No hay documentos indexados en el dominio "${domain}" que respondan esta pregunta.`
        : 'No hay documentos indexados todavía en la base de conocimiento.',
      sources: [],
    };
  }

  const contextMessage = buildContextMessage(question, relevantChunks);
  const history = getHistory(sessionId);

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history,
    { role: 'user', content: contextMessage },
  ];

  const response = await client.chatCompletion({
    model: LLM_MODEL,
    messages,
    max_tokens: 500,
    temperature: 0.3,
  });

  const answer = response.choices[0].message.content;

  addMessage(sessionId, 'user', question);
  addMessage(sessionId, 'assistant', answer);

  return {
    answer,
    sources: relevantChunks.map((chunk) => ({
      fileName: chunk.metadata.fileName,
      domain: chunk.metadata.domain,
      score: chunk.score,
    })),
  };
}
  

module.exports = { askQuestion };