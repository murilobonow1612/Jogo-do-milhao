const express = require('express');
const { getQuestion, validateAnswer } = require('../controllers/questionController');
const router = express.Router();

router.get('/', getQuestion);
router.post('/validate', validateAnswer);

module.exports = router;