/* OpenAI API */
const Recipe = require('../models/Recipe');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors');
const asyncWrapper = require('../middleware/async');
const transformRecipeData = require('../helpers/transformRecipeData');
const myRecipePrompt = require('../prompts/recipePrompt');
const generateImagePrompt = require('../prompts/generateImagePrompt');

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

const createAiRecipe = asyncWrapper(async (req, res) => {
  const recipeData = transformRecipeData(req.body);
  recipeData.recipeCreatedBy = req.user.userId;
  console.log(recipeData);
  const newRecipe = await Recipe.create(recipeData);
  res
    .status(StatusCodes.CREATED)
    .json({ data: newRecipe, message: 'Recipe created successfully' });
});

const getAllAiRecipe = asyncWrapper(async (req, res) => {
  const { userId } = req.user;
  const recipe = await Recipe.find({ recipeCreatedBy: userId }).sort(
    'createdAt'
  );
  res.status(StatusCodes.OK).json({ recipe, totalRecipes: recipe.length });
});

const getAiRecipe = asyncWrapper(async (req, res) => {
  const recipeId = req.params.recipeId;
  const { userId } = req.user;

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

const updateAiRecipe = asyncWrapper(async (req, res) => {
  const recipeId = req.params.recipeId;
  const { userId } = req.user;
  const updatedData = req.body;

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

const deleteAiRecipe = asyncWrapper(async (req, res) => {
  const recipeId = req.params.recipeId;
  const { userId } = req.user;

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
  fetchAiRecipe,
  createAiRecipe,
  getAllAiRecipe,
  getAiRecipe,
  updateAiRecipe,
  deleteAiRecipe,
};
