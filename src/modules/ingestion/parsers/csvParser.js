const Papa = require('papaparse');

function parse(buffer, fileName) {
  const raw = buffer.toString('utf-8');

  const result = Papa.parse(raw, {
    header: true,
    skipEmptyLines: true,
  });

  if (result.errors.length > 0) {
    throw new Error(`Error al parsear CSV: ${result.errors[0].message}`);
  }

  const text = result.data
    .map((row) =>
      Object.entries(row)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ')
    )
    .join('\n');

  return {
    text,
    metadata: {
      fileName,
      fileType: 'csv',
      domain: null,
      ingestedAt: new Date().toISOString(),
    },
  };
}

module.exports = { parse };