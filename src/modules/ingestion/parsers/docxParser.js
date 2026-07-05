const mammoth = require('mammoth');

async function parse(buffer, fileName) {
  const result = await mammoth.extractRawText({ buffer });

  return {
    text: result.value.trim(),
    metadata: {
      fileName,
      fileType: 'docx',
      domain: null,
      ingestedAt: new Date().toISOString(),
    },
  };
}

module.exports = { parse };