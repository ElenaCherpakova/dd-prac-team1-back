const express = require('express');
const router = express.Router();
const asyncWrapper = require('../middleware/async');
const Recipe = require('../models/Recipe');
const ShoppingList = require('../models/ShoppingList');
const { BadRequestError, NotFoundError } = require('../errors');

// Create or update shopping list for a recipe
const createOrUpdateShoppingList = async (userId, ingredients) => {
  ingredients = ingredients || [];

  let shoppingList = await ShoppingList.findOne({ userID: userId });

  if (!shoppingList) {
    shoppingList = new ShoppingList({ userID: userId, ingredients });
    await shoppingList.save();
  } else {
    // Loop through the ingredients to update or add them
    for (const ingredient of ingredients) {
      const existingIngredient = shoppingList.ingredients.find(
        (item) => item.ingredientName === ingredient.ingredientName
      );

      if (existingIngredient) {
        existingIngredient.ingredientAmount += ingredient.ingredientAmount;
      } else {
        shoppingList.ingredients.push(ingredient);
      }
    }
    await shoppingList.save();
  }

  return shoppingList;
};

// Add recipe ingredients to shopping list
const addRecipeToShoppingList = asyncWrapper(async (req, res) => {
  const { recipeId } = req.params;
  const userId = req.user.userId;

  const recipe = await Recipe.findById(recipeId);

  if (!recipe) {
    throw new NotFoundError('Recipe not found');
  }

  const { recipeIngredients } = recipe;

  await createOrUpdateShoppingList(userId, recipeIngredients);

  res.status(201).json({ message: 'Recipe ingredients added to shopping list' });
});

// Get shopping list for a user
const getShoppingList = asyncWrapper(async (req, res) => {
  try {
    const userId = req.user.userId;
    const shoppingList = await ShoppingList.findOne({ userID: userId });

    if (!shoppingList) {
      throw new NotFoundError('Shopping list not found');
    }

    res.status(200).json(shoppingList);
  } catch (error) {
    console.error('Error fetching shopping list:', error);
    res.status(500).json({ error: 'An error occurred while fetching the shopping list' });
  }
});

module.exports = {
  addRecipeToShoppingList,
  createOrUpdateShoppingList,
  getShoppingList,
};
