const { InferenceClient } = require('@huggingface/inference');
const env = require('../../config/env');

const client = new InferenceClient(env.HUGGINGFACE_API_KEY);

const MODEL = 'sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2';

async function generateEmbedding(text) {
  const result = await client.featureExtraction({
    model: MODEL,
    inputs: text,
  });

  return result;
}

module.exports = { generateEmbedding };