const asyncWrapper = require('../middleware/async');
const Recipe = require('../models/Recipe');
const ShoppingList = require('../models/ShoppingList');
const { BadRequestError, NotFoundError } = require('../errors');
const { StatusCodes } = require('http-status-codes');

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

  res.status(StatusCodes.CREATED).json({ message: 'Recipe ingredients added to shopping list' });
});

// Get shopping list for a user
const getShoppingList = asyncWrapper(async (req, res) => {
  try {
    const userId = req.user.userId;
    const shoppingList = await ShoppingList.findOne({ userID: userId });

    if (!shoppingList) {
      throw new NotFoundError('Shopping list not found');
    }

    res.status(StatusCodes.OK).json(shoppingList);
  } catch (error) {
    console.error('Error fetching shopping list:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred while fetching the shopping list' });
  }
});

// Update an ingredient in the shopping list
const updateIngredientShoppingList = asyncWrapper(async (req, res) => {
  // Decode the URL-encoded ingredient name
  const decodedIngredientName = decodeURIComponent(req.params.ingredientName);
  const userId = req.user.userId;
  const { ingredientAmount } = req.body;

  try {
    const shoppingList = await ShoppingList.findOne({ userID: userId });

    if (!shoppingList) {
      throw new NotFoundError('Shopping list not found');
    }

    // Find the index of the ingredient to be updated
    const ingredientIndex = shoppingList.ingredients.findIndex(
      (item) => item.ingredientName === decodedIngredientName
    );

    if (ingredientIndex === -1) {
      throw new NotFoundError('Ingredient not found in shopping list');
    }

    // Update the ingredient properties
    shoppingList.ingredients[ingredientIndex].ingredientAmount = ingredientAmount;

    await shoppingList.save();

    res.status(StatusCodes.OK).json({ message: 'Ingredient updated in shopping list' });
  } catch (error) {
    console.error('Error updating ingredient in shopping list:', error);  
    if (error instanceof NotFoundError) {
      res.status(StatusCodes.NOT_FOUND).json({ error: error.message });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred while updating the ingredient' });
    }
  }
});

// Add an ingredient to the shopping list
const addIngredientToShoppingList = asyncWrapper(async (req, res) => {
  const userId = req.user.userId;
  const { ingredientName, ingredientAmount, ingredientUnit } = req.body;

  // Check if required fields are missing
  if (!ingredientName || !ingredientAmount || !ingredientUnit) {
    throw new BadRequestError('Missing required fields in the request.');
  }

  try {
    const shoppingList = await ShoppingList.findOne({ userID: userId });

    if (!shoppingList) {
      throw new NotFoundError('Shopping list not found');
    }

    // Check if the ingredient already exists in the shopping list
    const existingIngredient = shoppingList.ingredients.find(
      (item) => item.ingredientName === ingredientName
    );

    if (existingIngredient) {
      // If ingredient exists, suggest updating the amount of existing ingredient
      res.status(StatusCodes.OK).json({
        message: 'Ingredient already exists in shopping list. Please update the amount.',
        existingIngredient,
      });
      return;
    }

    // Add the new ingredient to the shopping list
    shoppingList.ingredients.push({
      ingredientName,
      ingredientAmount,
      ingredientUnit,
    });

    await shoppingList.save();

    res.status(StatusCodes.OK).json({ message: 'Ingredient added to shopping list' });
  } catch (error) {
    console.error('Error adding ingredient to shopping list:', error);
    if (error instanceof NotFoundError) {
      res.status(StatusCodes.NOT_FOUND).json({ error: error.message });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred while adding the ingredient' });
    }
  }
});

// Delete an ingredient from the shopping list
const deleteIngredientShoppingList = asyncWrapper(async (req, res) => {
  // Decode the URL-encoded ingredient name
  const decodedIngredientName = decodeURIComponent(req.params.ingredientName);
  const userId = req.user.userId;

  try {
    const shoppingList = await ShoppingList.findOne({ userID: userId });

    if (!shoppingList) {
      throw new NotFoundError('Shopping list not found');
    }

    // Find the index of the ingredient to be deleted
    const ingredientIndex = shoppingList.ingredients.findIndex(
      (item) => item.ingredientName === decodedIngredientName
    );

    if (ingredientIndex === -1) {
      throw new NotFoundError('Ingredient not found in shopping list');
    }

    // Remove the ingredient from the shopping list
    shoppingList.ingredients.splice(ingredientIndex, 1);

    await shoppingList.save();

    res.status(StatusCodes.OK).json({ message: 'Ingredient deleted from shopping list' });
  } catch (error) {
    console.error('Error deleting ingredient from shopping list:', error);
    if (error instanceof NotFoundError) {
      res.status(StatusCodes.NOT_FOUND).json({ error: error.message });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred while deleting the ingredient' });
    }
  }
});

// Delete the entire shopping list for a user
const deleteShoppingList = asyncWrapper(async (req, res) => {
  const userId = req.user.userId;

  try {
    const shoppingList = await ShoppingList.findOneAndDelete({ userID: userId });

    if (!shoppingList) {
      throw new NotFoundError('Shopping list not found');
    }

    res.status(StatusCodes.OK).json({ message: 'Shopping list deleted successfully' });
  } catch (error) {
    console.error('Error deleting shopping list:', error);
    if (error instanceof NotFoundError) {
      res.status(StatusCodes.NOT_FOUND).json({ error: error.message });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred while deleting the shopping list' });
    }
  }
});

module.exports = {
  addIngredientToShoppingList,
  addRecipeToShoppingList,
  createOrUpdateShoppingList,
  getShoppingList,
  updateIngredientShoppingList,
  deleteIngredientShoppingList,
  deleteShoppingList,
};
