const { loadStore, search } = require('./src/modules/rag/vectorStore');
const { generateEmbedding } = require('./src/modules/rag/embeddings');

async function main() {
  loadStore();

  const query = '¿Cuántos días de vacaciones tengo?';

  console.log(`Pregunta: "${query}"\n`);

  const queryEmbedding = await generateEmbedding(query);
  const results = search(queryEmbedding, 3);

  console.log('Resultados más relevantes:\n');
  results.forEach((result, index) => {
    console.log(`--- Resultado ${index + 1} (score: ${result.score.toFixed(4)}) ---`);
    console.log(`Archivo: ${result.metadata.fileName}`);
    console.log(result.text.slice(0, 200) + '...\n');
  });
}

main().catch((error) => {
  console.error('❌ Error durante la búsqueda:', error.message);
});