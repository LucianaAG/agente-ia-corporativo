const express = require('express');
const multer = require('multer');

const { handleUpload } = require('./ingestionController');

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post('/ingestion/upload', upload.single('file'), handleUpload);

module.exports = router;