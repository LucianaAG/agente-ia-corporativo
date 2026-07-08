const { InferenceClient } = require('@huggingface/inference');
const env = require('./src/config/env');

const client = new InferenceClient(env.HUGGINGFACE_API_KEY);

async function main() {
  console.log('Probando el modelo...\n');

  const startTime = Date.now();

  const response = await client.chatCompletion({
    model: 'Qwen/Qwen2.5-7B-Instruct',
    messages: [
      { role: 'user', content: 'Respondé en una sola oración: ¿qué es una política de vacaciones corporativa?' },
    ],
    max_tokens: 200,
    temperature: 0.3,
  });

  const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log(`✅ Respuesta generada en ${elapsedSeconds}s\n`);
  console.log(response.choices[0].message.content);
}

main().catch((error) => {
  console.error('❌ Error al llamar al LLM:', error.message);
});