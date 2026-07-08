const { InferenceClient } = require('@huggingface/inference');
const env = require('../../config/env');
const { generateEmbedding } = require('./embeddings');
const { search } = require('./vectorStore');

const client = new InferenceClient(env.HUGGINGFACE_API_KEY);
const LLM_MODEL = 'Qwen/Qwen2.5-7B-Instruct';

function buildPrompt(question, chunks) {
  const context = chunks
    .map((chunk, index) => `[Fragmento ${index + 1}] (${chunk.metadata.fileName})\n${chunk.text}`)
    .join('\n\n');

  return `Sos un asistente corporativo que responde preguntas de colaboradores de una empresa, basándote ÚNICAMENTE en la información de los documentos internos que se te proporcionan.

Si la respuesta no está en el contexto proporcionado, decí claramente que no tenés esa información en los documentos disponibles, no inventes datos.

Contexto:
${context}

Pregunta del colaborador: ${question}`;
}

async function askQuestion(question, topK = 3) {
  const queryEmbedding = await generateEmbedding(question);
  const relevantChunks = search(queryEmbedding, topK);

  if (relevantChunks.length === 0) {
    return {
      answer: 'No hay documentos indexados todavía en la base de conocimiento.',
      sources: [],
    };
  }

  const prompt = buildPrompt(question, relevantChunks);

  const response = await client.chatCompletion({
    model: LLM_MODEL,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 500,
    temperature: 0.3,
  });

  return {
    answer: response.choices[0].message.content,
    sources: relevantChunks.map((chunk) => ({
      fileName: chunk.metadata.fileName,
      score: chunk.score,
    })),
  };
}

module.exports = { askQuestion };