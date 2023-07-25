/* OpenAI API */
const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors');

const API_KEY = process.env.OPENAI_API_KEY;

const fetchApiRecipe = async (req, res) => {
  const { query } = req.body;
  if (!query || !query.trim() === '') {
    throw new BadRequestError('Please provide a query.');
  }
  const assistant = `You are a helpful assistant that has a collection of recipes and generates them based on user input`;
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: assistant },
        {
          role: 'user',
          content: `User can provide a one word or several words asking about providing recipe with ${query}`,
        },
      ],
      temperature: 1,
      max_tokens: 500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      functions: [
        {
          name: 'recipe',
          description: 'This function generates a recipe based on user input',
          parameters: {
            type: 'object',
            properties: {
              title: {
                type: 'string',
                description:
                  'You are a helpful assistant that generates cooking recipes',
              },
              ingredients: {
                type: 'array',
                description: 'Ingredients',
                items: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                      description: 'Ingredient name',
                    },
                    quantity: {
                      type: 'string',
                      description: 'Ingredient quantity',
                    },
                  },
                },
              },
              instructions: {
                type: 'array',
                description: 'Instructions',
                items: {
                  type: 'string',
                  description: 'Instruction',
                },
              },
              categories: {
                type: 'array',
                description: 'Categories',
                items: {
                  type: 'string',
                  description: 'Category',
                },
              },
              servingFor: {
                type: 'string',
                description: 'Serving for',
              },
              prepTimeInSeconds: {
                type: 'string',
                description: 'Preparing time in minutes',
              },
              cookTimeInSeconds: {
                type: 'string',
                description: 'Cooking time in minutes',
              },
              totalTimeInSeconds: {
                type: 'string',
                description: 'Total time in minutes',
              },
              nutritionInformation: {
                type: 'string',
                description: 'Nutrition information',
              },
              images: {
                type: 'string',
                description: 'Image URL',
              },
            },
            required: [
              'title',
              'ingredients',
              'instructions',
              'servingFor',
              'prepTimeInSeconds',
              'cookTimeInSeconds',
              'nutritionInformation',
              'images',
            ],
          },
          examples: [
            {
              query: 'pomegranate',
              title: 'Pomegranate Chicken Salad',
              ingredients: [
                {
                  name: 'chicken',
                  quantity: '1',
                },
                {
                  name: 'pomegranate',
                  quantity: '1',
                },
                {
                  name: 'salt',
                  quantity: '1',
                },
              ],
              instructions: [
                'Cut the chicken into pieces',
                'Put the chicken in a pot',
                'Add the pomegranate and salt',
                'Cook for 30 minutes',
              ],
              categories: ['salad', 'vegetarian'],
              servingFor: '4',
              prepTimeInSeconds: '10',
              cookTimeInSeconds: '30',
              totalTimeInSeconds: '40',
              nutritionInformation: 'Calories: 100',
              images: ['https://example.com/image1.jpg'],
            },
          ],
        },
      ],
    }),
  };
  try {
    const response = await fetch(
      'https://api.openai.com/v1/chat/completions',
      options
    );
    const { choices } = await response.json();
    const data = choices[0].message.function_call.arguments;
    res.status(StatusCodes.OK).send(data);
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Failed to generate the recipe.' });
  }
};

module.exports = {
  fetchApiRecipe,
};
