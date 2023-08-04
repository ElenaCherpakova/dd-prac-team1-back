const express = require('express');
const router = express.Router();

const {
  fetchAiRecipe,
  createAiRecipe,
} = require('../controllers/aiRecipe_controller');

router.post('/', fetchAiRecipe).post('/add', createAiRecipe);

module.exports = router;
