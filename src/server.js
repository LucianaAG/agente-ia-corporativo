const app = require('./app');
const env = require('./config/env');
const { loadStore } = require('./modules/rag/vectorStore');

loadStore();

app.listen(env.PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${env.PORT} (${env.NODE_ENV})`);
});