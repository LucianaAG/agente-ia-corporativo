const ExcelJS = require('exceljs');

async function parse(buffer, fileName) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  const sheetsText = [];

  workbook.eachSheet((worksheet) => {
    const rows = [];
    let headers = [];

    worksheet.eachRow((row, rowNumber) => {
      const values = row.values.slice(1);

      if (rowNumber === 1) {
        headers = values;
        return;
      }

      const rowText = values
        .map((value, index) => `${headers[index] ?? `col${index + 1}`}: ${value}`)
        .join(', ');

      rows.push(rowText);
    });

    if (rows.length > 0) {
      sheetsText.push(`--- Hoja: ${worksheet.name} ---\n${rows.join('\n')}`);
    }
  });

  const text = sheetsText.join('\n\n');

  return {
    text,
    metadata: {
      fileName,
      fileType: 'xlsx',
      domain: null,
      ingestedAt: new Date().toISOString(),
    },
  };
}

module.exports = { parse };