const express = require('express');
const { getQuestion, validateAnswer } = require('../controllers/questionController');
const router = express.Router();

// Defina a rota para pegar uma pergunta
router.get('/api/questions', getQuestion);
router.post('/api/questions/validate', validateAnswer);

module.exports = router;
