const { PDFParse } = require('pdf-parse');

async function parse(buffer, fileName) {
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();

  const text = result.text
    .replace(/--\s*\d+\s*of\s*\d+\s*--/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return {
    text,
    metadata: {
      fileName,
      fileType: 'pdf',
      domain: null,
      ingestedAt: new Date().toISOString(),
    },
  };
}

module.exports = { parse };