const fs = require('fs');
const path = require('path');
const { parseBatch } = require('./src/modules/ingestion/parserRouter');

const testDir = path.join(__dirname, 'test-files');

async function main() {
  const files = fs.readdirSync(testDir).map((fileName) => ({
    fileName,
    buffer: fs.readFileSync(path.join(testDir, fileName)),
  }));

  const result = await parseBatch(files);

  console.log('\n=== EXITOSOS ===');
  result.successful.forEach((r) => {
    console.log(`\n📄 ${r.metadata.fileName} (${r.metadata.fileType})`);
    console.log(r.text.slice(0, 300));
  });

  console.log('\n=== FALLIDOS ===');
  result.failed.forEach((f) => {
    console.log(`\n❌ ${f.fileName}: ${f.error}`);
  });
}

main();