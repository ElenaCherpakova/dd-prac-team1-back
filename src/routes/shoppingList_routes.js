const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authentication');
const {
    addRecipeToShoppingList,
    getShoppingList,
    deleteIngredientShoppingList,
    deleteShoppingList,
    updateIngredientShoppingList,
} = require('../controllers/shoppingList_controller');

router.post('/:recipeId', addRecipeToShoppingList);
router.get('/', getShoppingList);
router.put('/:ingredientName', updateIngredientShoppingList);
router.delete('/:ingredientName', deleteIngredientShoppingList);
router.delete('/', deleteShoppingList);

module.exports = router;