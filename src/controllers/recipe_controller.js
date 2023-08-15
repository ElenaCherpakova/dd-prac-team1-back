/* OpenAI API */
const Recipe = require('../models/Recipe');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors');
const asyncWrapper = require('../middleware/async');
const transformRecipeData = require('../helpers/transformRecipeData');
const myRecipePrompt = require('../prompts/recipePrompt');
const generateImagePrompt = require('../prompts/generateImagePrompt');
const cloudinary = require('cloudinary');
const fs = require('fs').promises;

const fetchAiRecipe = async (req, res) => {
  const { query, optionValues } = req.body;
  const optValue = optionValues.length > 0 ? optionValues.join(', ') : '';

  if (!query || query.trim() === '') {
    throw new BadRequestError('Please provide a query.');
  }
  const assistant = `You are a helpful assistant that generates delicious recipes for various ingredients. Your goal is to provide unique recipes based on user input, considering specific ingredients, dietary preferences, or cuisine types that are safe for human consumption. Please do not provide recipes that are poisonous, such as fly agaric. Please note that you can only answer recipe-related queries. If you cannot find a relevant meaning in the presented text, please ask the user to try re-phrasing the question.`;
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: assistant },
        {
          role: 'user',
          content: `User receives a recipe based on following ingredient: ${query}. Preferences or Dietaries:${optValue}`,
        },
      ],
      temperature: 0.4,
      max_tokens: 750,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      functions: [myRecipePrompt],
    }),
  };
  try {
    const response = await fetch(
      'https://api.openai.com/v1/chat/completions',
      options
    );
    const { choices } = await response.json();
    const data = JSON.parse(choices[0].message.function_call.arguments);

    // Call the generateImagePrompt for data
    const imageGenerationPrompt = generateImagePrompt(data);
    // Use Bing Image Search API to search for images related to the recipe
    const bingImageOptions = {
      method: 'GET',
      headers: {
        'Ocp-Apim-Subscription-Key': process.env.BING_IMAGE_SEARCH_API_KEY,
      },
    };
    // Define the desired height (in pixels)
    // const desiredHeight = 150;
    const sizeFilter = 'medium';

    const endPointToGenerateImg = `https://api.bing.microsoft.com/v7.0/images/search?q=${encodeURIComponent(
      imageGenerationPrompt
    )}&size=${sizeFilter}`;

    const bingImageResponse = await fetch(
      endPointToGenerateImg,
      bingImageOptions
    );

    const bingImageData = await bingImageResponse.json();
    const imageUrl =
      bingImageData.value && bingImageData.value.length > 0
        ? bingImageData.value[0].contentUrl
        : '';
    const responseData = {
      ...data,
      image: imageUrl,
    };
    console.log(responseData);
    res.status(StatusCodes.OK).send(responseData);
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Failed to generate the recipe.' });
  }
};

// Create a new AI recipe
const createAiRecipe = asyncWrapper(async (req, res) => {
  const recipeData = transformRecipeData(req.body);
  recipeData.recipeCreatedBy = req.user.userId;
  console.log(recipeData);
  const newRecipe = await Recipe.create(recipeData);
  res
    .status(StatusCodes.CREATED)
    .json({ data: newRecipe, message: 'Recipe created successfully' });
});

// Create a new manual recipe
const createManualRecipe = asyncWrapper(async (req, res) => {
  if (!req.file) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'No file was uploaded' });
  }
  const manualRecipeData = { ...req.body }; // shallow copy of object using spread operator.
  // Set the recipe's creator to the authenticated user's ID
  manualRecipeData.recipeCreatedBy = req.user.userId;
  // If there's an uploaded image, associate its path with the recipe
  try {
    const response = await cloudinary.v2.uploader.upload(req.file.path);
    console.log(response);
    await fs.unlink(req.file.path);
    manualRecipeData.recipeImage = response.secure_url;
    manualRecipeData.recipeImagePublic = response.public_id;
    // Create a new recipe using the data from the request body
    const recipe = await Recipe.create(manualRecipeData);
    console.log('HERE IS RECIPE', recipe);
    res.status(StatusCodes.CREATED).json({ recipe });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error uploading image or creating recipe' });
  }
});

// Get all recipes created by the authenticated user and sort them by creation date
const getAllRecipes = asyncWrapper(async (req, res) => {
  const recipes = await Recipe.find({ recipeCreatedBy: req.user.userId }).sort(
    'createdAt'
  );
  res.status(StatusCodes.OK).json({ recipes, count: recipes.length });
});

// Get a specific saved recipe by its ID
const getRecipe = asyncWrapper(async (req, res) => {
  const {
    user: { userId },
    params: { recipeId },
  } = req;

  // Find a recipe with the recipe ID created by the auth user
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
    console.error(error); // Log the error for debugging purposes
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error retrieving recipe', error: error.message });
  }
});

// Update a saved recipe
const updateRecipe = asyncWrapper(async (req, res) => {
  const {
    body,
    user: { userId },
    params: { recipeId },
  } = req;

  if (req.file) {
    const response = await cloudinary.v2.uploader.upload(req.file.path);
    await fs.unlink(req.file.path);
    body.recipeImage = response.secure_url;
    body.recipeImagePublic = response.public_id;
  }
  const updatedRecipe = await Recipe.findOneAndUpdate(
    {
      _id: recipeId,
      recipeCreatedBy: userId,
    },
    body,
    // { new: true, runValidators: true } // Return the updated recipe
  );
  if (req.file && updatedRecipe.recipeImagePublic) {
    await cloudinary.v2.uploader.destroy(updatedRecipe.recipeImagePublic);
  }

  res.status(StatusCodes.OK).json(updatedRecipe);
});
// Delete a saved recipe
const deleteRecipe = asyncWrapper(async (req, res) => {
  const {
    user: { userId },
    params: { recipeId },
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
    console.error(error); // Log the error for debugging purposes
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error deleting recipe', error: error.message });
  }
});

module.exports = {
  fetchAiRecipe,
  createAiRecipe,
  createManualRecipe,
  getAllRecipes,
  getRecipe,
  updateRecipe,
  deleteRecipe,
};
