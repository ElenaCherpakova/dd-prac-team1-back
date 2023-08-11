const express = require('express');
const router = express.Router();

const {
  fetchAiRecipe,
  createAiRecipe,
  createManualRecipe,
  getAllRecipes,
  getRecipe,
  deleteRecipe,
  updateRecipe,
} = require('../controllers/recipe_controller');

router.get('/', getAllRecipes);
router.post('/', fetchAiRecipe);
router.post('/add-ai', createAiRecipe);
router.post('/add-manual', createManualRecipe);
router.route('/:recipeId').get(getRecipe).delete(deleteRecipe).patch(updateRecipe);

module.exports = router;
