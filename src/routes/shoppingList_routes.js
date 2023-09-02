const express = require('express');
const router = express.Router();
const {
    addIngredientToShoppingList,
    addRecipeToShoppingList,
    getShoppingList,
    deleteIngredientShoppingList,
    deleteShoppingList,
    updateIngredientShoppingList,
    shareShoppingList,
} = require('../controllers/shoppingList_controller');

router.post('/add-ingredient', addIngredientToShoppingList);
router.post('/share', shareShoppingList);
router.post('/:recipeId', addRecipeToShoppingList);
router.get('/', getShoppingList);
router.put('/:ingredientName', updateIngredientShoppingList);
router.delete('/:ingredientName', deleteIngredientShoppingList);
router.delete('/', deleteShoppingList);



module.exports = router;