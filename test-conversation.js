const { loadStore } = require('./src/modules/rag/vectorStore');
const { askQuestion } = require('./src/modules/rag/ragService');

async function main() {
  loadStore();

  const sessionId = 'test-session-1';

  console.log('--- Pregunta 1 ---');
  const result1 = await askQuestion('¿Cuántos días de vacaciones tengo?', sessionId);
  console.log(result1.answer);

  console.log('\n--- Pregunta 2 (referencia a la anterior) ---');
  const result2 = await askQuestion('¿Y esos días son corridos o hábiles?', sessionId);
  console.log(result2.answer);
}

main().catch((error) => {
  console.error('❌ Error:', error.message);
});