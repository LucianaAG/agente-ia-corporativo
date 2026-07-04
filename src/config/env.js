require('dotenv').config();
const { z } = require('zod');

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Error de configuración: variables de entorno inválidas o faltantes');
  console.error(parsed.error.format());
  process.exit(1);
}

module.exports = parsed.data;