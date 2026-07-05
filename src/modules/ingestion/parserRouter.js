const path = require('path');

const markdownParser = require('./parsers/markdownParser');
const jsonParser = require('./parsers/jsonParser');
const csvParser = require('./parsers/csvParser');
const htmlParser = require('./parsers/htmlParser');
const pdfParser = require('./parsers/pdfParser');
const docxParser = require('./parsers/docxParser');

const parsers = {
  '.md': markdownParser,
  '.json': jsonParser,
  '.csv': csvParser,
  '.html': htmlParser,
  '.htm': htmlParser,
  '.pdf': pdfParser,
  '.docx': docxParser,
};

async function parseFile(buffer, fileName) {
  const extension = path.extname(fileName).toLowerCase();
  const parser = parsers[extension];

  if (!parser) {
    throw new Error(`Formato no soportado: ${extension}`);
  }

  return await parser.parse(buffer, fileName);
}

async function parseBatch(files) {
  const successful = [];
  const failed = [];

  for (const { buffer, fileName } of files) {
    try {
      const result = await parseFile(buffer, fileName);
      successful.push(result);
    } catch (error) {
      failed.push({ fileName, error: error.message });
    }
  }

  return { successful, failed };
}

module.exports = { parseFile, parseBatch };