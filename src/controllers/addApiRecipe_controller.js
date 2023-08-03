const RecipeSchema = require('../models/Recipe');
const asyncWrapper = require('../middleware/async');
const { StatusCodes } = require('http-status-codes');
const transformRecipeData = require('../helpers/transformRecipeData');

const addApiRecipe = asyncWrapper(async (req, res) => {
  const recipeData = transformRecipeData(req.body);
  recipeData.recipeCreatedBy = req.user.userId;
  console.log(recipeData);
  const newRecipe = await RecipeSchema.create(recipeData);
  res.status(StatusCodes.CREATED).json({ data: newRecipe, msg: 'recipe created successfully' });
});

module.exports = { addApiRecipe };
