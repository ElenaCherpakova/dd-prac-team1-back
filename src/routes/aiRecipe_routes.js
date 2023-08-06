const express = require('express');
const router = express.Router();

const {
  fetchAiRecipe,
  createAiRecipe,
  getAllAiRecipe,
  getAiRecipe,
  deleteAiRecipe,
} = require('../controllers/aiRecipe_controller');

router.get('/', getAllAiRecipe);
router.post('/', fetchAiRecipe);
router.post('/add', createAiRecipe);
router.get('/saved-recipes/:recipeId', getAiRecipe);
router.delete('/saved-recipes/:recipeId', deleteAiRecipe);
module.exports = router;
