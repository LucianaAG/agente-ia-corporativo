function parse(buffer, fileName) {
  const text = buffer.toString('utf-8');

  return {
    text,
    metadata: {
      fileName,
      fileType: 'markdown',
      domain: null,
      ingestedAt: new Date().toISOString(),
    },
  };
}

module.exports = { parse };