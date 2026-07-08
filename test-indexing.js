const fs = require('fs');
const path = require('path');
const { parseFile } = require('./src/modules/ingestion/parserRouter');
const { chunkDocument } = require('./src/modules/rag/chunker');
const { generateEmbedding } = require('./src/modules/rag/embeddings');
const { loadStore, addEntry, getSize } = require('./src/modules/rag/vectorStore');

async function main() {
  loadStore();
  console.log(`Vector store cargado. Entradas actuales: ${getSize()}\n`);

  const filePath = path.join(__dirname, 'test-files', 'Documento sin título.pdf');
  const buffer = fs.readFileSync(filePath);

  const parsed = await parseFile(buffer, 'Documento sin título.pdf');
  const chunks = await chunkDocument(parsed);

  console.log(`Documento dividido en ${chunks.length} chunk(s). Generando embeddings e indexando...\n`);

  for (const chunk of chunks) {
    const embedding = await generateEmbedding(chunk.text);
    addEntry({ text: chunk.text, metadata: chunk.metadata, embedding });
    console.log(`✅ Chunk ${chunk.metadata.chunkIndex + 1}/${chunk.metadata.totalChunks} indexado`);
  }

  console.log(`\nTotal de entradas en el vector store: ${getSize()}`);
}

main().catch((error) => {
  console.error('❌ Error durante la indexación:', error.message);
});