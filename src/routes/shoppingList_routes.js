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
router.delete('/:ingredientName', deleteIngredientShoppingList);
router.delete('/', deleteShoppingList);
router.put('/:ingredientName', updateIngredientShoppingList);

module.exports = router;