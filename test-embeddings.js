const fs = require('fs');
const path = require('path');
const { parseFile } = require('./src/modules/ingestion/parserRouter');
const { chunkDocument } = require('./src/modules/rag/chunker');
const { generateEmbedding } = require('./src/modules/rag/embeddings');

async function main() {
  const filePath = path.join(__dirname, 'test-files', 'Documento sin título.pdf');
  const buffer = fs.readFileSync(filePath);

  const parsed = await parseFile(buffer, 'Documento sin título.pdf');
  const chunks = await chunkDocument(parsed);

  const firstChunk = chunks[0];

  console.log('Generando embedding para el primer chunk...');
  console.log(`(texto de ${firstChunk.text.length} caracteres)\n`);

  const startTime = Date.now();
  const embedding = await generateEmbedding(firstChunk.text);
  const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log(`✅ Embedding generado en ${elapsedSeconds}s`);
  console.log(`Dimensiones del vector: ${embedding.length}`);
  console.log(`Primeros 5 valores: [${embedding.slice(0, 5).join(', ')}]`);
}

main().catch((error) => {
  console.error('❌ Error al generar embedding:', error.message);
});