const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const pinoHttp = require('pino-http');

const errorHandler = require('./shared/middlewares/errorHandler');
const chatRoutes = require('./modules/chat/chatRoutes');
const ingestionRoutes = require('./modules/ingestion/ingestionRoutes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(pinoHttp());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use(chatRoutes);
app.use(ingestionRoutes);

app.use(errorHandler);

module.exports = app;