const express = require('express');
const router = express.Router();

const {
  fetchAiRecipe,
  createAiRecipe,
  getAllAiRecipe,
} = require('../controllers/aiRecipe_controller');

router.get('/', getAllAiRecipe);
router.post('/', fetchAiRecipe);
router.post('/add', createAiRecipe);
module.exports = router;
