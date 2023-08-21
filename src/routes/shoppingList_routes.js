const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authentication');
const {
    addRecipeToShoppingList,
    getShoppingList,
} = require('../controllers/shoppingList_controller');

router.post('/:recipeId', addRecipeToShoppingList);
router.get('/', getShoppingList);

module.exports = router;