const express = require('express');
const router = express.Router();
const upload = require('../middleware/multerMiddleware');
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
router.post('/add-manual', upload, createManualRecipe);
router
  .route('/:recipeId')
  .get(getRecipe)
  .delete(deleteRecipe)
  .patch(upload, updateRecipe);

module.exports = router;
