const { RecursiveCharacterTextSplitter } = require('@langchain/textsplitters');

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 700,
  chunkOverlap: 100,
});

async function chunkDocument(parsedDocument) {
  const { text, metadata } = parsedDocument;

  const chunks = await splitter.splitText(text);

  return chunks.map((chunkText, index) => ({
    text: chunkText,
    metadata: {
      ...metadata,
      chunkIndex: index,
      totalChunks: chunks.length,
    },
  }));
}

module.exports = { chunkDocument };