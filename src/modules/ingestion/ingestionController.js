const { parseFile } = require('./parserRouter');
const { chunkDocument } = require('../rag/chunker');
const { generateEmbedding } = require('../rag/embeddings');
const { addEntry } = require('../rag/vectorStore');
const { normalizeDomain } = require('../../shared/domains');

async function handleUpload(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió ningún archivo' });
    }

    const { buffer, originalname } = req.file;
    const domain = normalizeDomain(req.body.domain);

    const parsed = await parseFile(buffer, originalname);
    parsed.metadata.domain = domain;

    const chunks = await chunkDocument(parsed);

    for (const chunk of chunks) {
      const embedding = await generateEmbedding(chunk.text);
      addEntry({ text: chunk.text, metadata: chunk.metadata, embedding });
    }

    res.json({
      fileName: originalname,
      domain,
      chunksIndexed: chunks.length,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { handleUpload };