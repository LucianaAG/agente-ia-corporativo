function parse(buffer, fileName) {
  const raw = buffer.toString('utf-8');
  const data = JSON.parse(raw);
  const text = JSON.stringify(data, null, 2);

  return {
    text,
    metadata: {
      fileName,
      fileType: 'json',
      domain: null,
      ingestedAt: new Date().toISOString(),
    },
  };
}

module.exports = { parse };