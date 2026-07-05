const cheerio = require('cheerio');

function parse(buffer, fileName) {
  const raw = buffer.toString('utf-8');
  const $ = cheerio.load(raw);

  $('script, style').remove();

  const text = $('body').text().replace(/\s+/g, ' ').trim();

  return {
    text,
    metadata: {
      fileName,
      fileType: 'html',
      domain: null,
      ingestedAt: new Date().toISOString(),
    },
  };
}

module.exports = { parse };