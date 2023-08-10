const Recipe = require('../models/Recipe');
const { StatusCodes } = require('http-status-codes');
const { NotFoundError } = require('../errors');
const asyncWrapper = require('../middleware/async');

// Get all manual recipes created by the authenticated user
const getAllRecipes = asyncWrapper(async (req, res) => {
    // Find all recipes created by the user and sort them by creation date
    const recipes = await Recipe.find({ recipeCreatedBy: req.user.userId }).sort('createdAt');
    res.status(StatusCodes.OK).json({ recipes, count: recipes.length });
});

// Get a specific manual recipe by its ID
const getManualRecipe = asyncWrapper(async (req, res) => {
    const {
        user: { userId },
        params: { id: recipeId },
    } = req;

    // Find a recipe with the recipe ID created by the user
    try {
        const recipe = await Recipe.findOne({
          _id: recipeId,
          recipeCreatedBy: userId,
        });
    
        if (!recipe) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: 'Recipe not found' });
        }
    
        res.status(StatusCodes.OK).json(recipe);
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'Error retrieving recipe' });
      }
    });

// Create a new manual recipe
const createManualRecipe = asyncWrapper(async (req, res) => {
    // Set the recipe's creator to the authenticated user's ID
    req.body.recipeCreatedBy = req.user.userId;
    // Create a new recipe using the data from the request body
    const recipe = await Recipe.create(req.body);
    res.status(StatusCodes.CREATED).json({ recipe });
});

// Update an existing manual recipe
const updateManualRecipe = asyncWrapper(async (req, res) => {
    const {
        body,
        user: { userId },
        params: { id: recipeId },
    } = req;

    // Find and update the recipe with the recipe ID created by the user
    try {
        const updatedRecipe = await Recipe.findOneAndUpdate(
          {
            _id: recipeId,
            recipeCreatedBy: userId,
          },
          updatedData,
          { new: true } // Return the updated recipe
        );
    
        if (!updatedRecipe) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: 'Recipe not found or not authorized to update' });
        }
    
        res.status(StatusCodes.OK).json(updatedRecipe);
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'Error updating recipe' });
      }
});

// Delete a manual recipe
const deleteManualRecipe = asyncWrapper(async (req, res) => {
    const {
        user: { userId },
        params: { id: recipeId },
    } = req;

    // Find and delete the recipe with the recipe ID created by the user
    try {
        const deletedRecipe = await Recipe.findOneAndDelete({
          _id: recipeId,
          recipeCreatedBy: userId,
        });
    
        if (!deletedRecipe) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: 'Recipe not found' });
        }
    
        res.status(StatusCodes.OK).json({ message: 'Recipe deleted successfully' });
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'Error deleting recipe' });
      }
    });

module.exports = {
    getAllRecipes,
    getManualRecipe,
    createManualRecipe,
    updateManualRecipe,
    deleteManualRecipe,
};
