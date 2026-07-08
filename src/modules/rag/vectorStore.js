const fs = require('fs');
const path = require('path');

const STORE_PATH = path.join(__dirname, '..', '..', '..', 'data', 'vector-store.json');

let store = [];

function loadStore() {
  if (fs.existsSync(STORE_PATH)) {
    const raw = fs.readFileSync(STORE_PATH, 'utf-8');
    store = JSON.parse(raw);
  }
  return store;
}

function saveStore() {
  const dir = path.dirname(STORE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
}

function addEntry({ text, metadata, embedding }) {
  store.push({ text, metadata, embedding });
  saveStore();
}

function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

function search(queryEmbedding, topK = 5) {
  const scored = store.map((entry) => ({
    text: entry.text,
    metadata: entry.metadata,
    score: cosineSimilarity(queryEmbedding, entry.embedding),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, topK);
}

function getSize() {
  return store.length;
}

module.exports = { loadStore, saveStore, addEntry, search, getSize };