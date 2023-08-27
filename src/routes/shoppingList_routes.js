const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authentication');
const {
    addRecipeToShoppingList,
    getShoppingList,
    deleteIngredientShoppingList,
    deleteShoppingList,
} = require('../controllers/shoppingList_controller');

router.post('/:recipeId', addRecipeToShoppingList);
router.get('/', getShoppingList);
router.delete('/:ingredientName', deleteIngredientShoppingList);
router.delete('/', deleteShoppingList);

module.exports = router;