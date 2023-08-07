const express = require('express');
const router = express.Router();

const {
  fetchAiRecipe,
  createAiRecipe,
  getAllAiRecipe,
  getAiRecipe,
  deleteAiRecipe,
  updateAiRecipe,
} = require('../controllers/aiRecipe_controller');

router.get('/', getAllAiRecipe);
router.post('/', fetchAiRecipe);
router.post('/add', createAiRecipe);
router.get('/saved/:recipeId', getAiRecipe);
router.patch('/saved/:recipeId', updateAiRecipe);
router.delete('/saved/:recipeId', deleteAiRecipe);
module.exports = router;
