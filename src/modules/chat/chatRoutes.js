const express = require('express');
const { handleChat } = require('./chatController');

const router = express.Router();

router.post('/chat', handleChat);

module.exports = router;