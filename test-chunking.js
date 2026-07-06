const fs = require('fs');
const path = require('path');
const { parseFile } = require('./src/modules/ingestion/parserRouter');
const { chunkDocument } = require('./src/modules/rag/chunker');

async function main() {
  const filePath = path.join(__dirname, 'test-files', 'Documento sin título.pdf');
  const buffer = fs.readFileSync(filePath);

  const parsed = await parseFile(buffer, 'Documento sin título.pdf');
  const chunks = await chunkDocument(parsed);

  console.log(`Total de chunks generados: ${chunks.length}\n`);

  chunks.forEach((chunk) => {
    console.log(`--- Chunk ${chunk.metadata.chunkIndex + 1}/${chunk.metadata.totalChunks} ---`);
    console.log(chunk.text);
    console.log();
  });
}

main();