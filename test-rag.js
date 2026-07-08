const { loadStore } = require('./src/modules/rag/vectorStore');
const { askQuestion } = require('./src/modules/rag/ragService');

async function main() {
  loadStore();

  const question = '¿Cuántos días de vacaciones tengo?';

  console.log(`Pregunta: "${question}"\n`);

  const result = await askQuestion(question);

  console.log('Respuesta del agente:\n');
  console.log(result.answer);

  console.log('\nFuentes utilizadas:');
  result.sources.forEach((source) => {
    console.log(`- ${source.fileName} (score: ${source.score.toFixed(4)})`);
  });
}

main().catch((error) => {
  console.error('❌ Error:', error.message);
});