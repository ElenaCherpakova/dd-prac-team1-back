const myRecipePrompt = {
  name: 'recipe',
  description: 'This function generates a recipe based on user input',
  parameters: {
    type: 'object',
    properties: {
      recipeName: {
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
      prepTimeInMinutes: {
        type: 'string',
        description: 'Preparing time in minutes',
      },
      cookTimeInMinutes: {
        type: 'string',
        description: 'Cooking time in minutes',
      },
      totalTimeInMinutes: {
        type: 'string',
        description: 'Total time in minutes',
      },
      nutritionInformation: {
        type: 'object',
        description: 'Nutrition information',
        properties: {
          calories: {
            type: 'string',
            description: 'Calories',
          },
          protein: {
            type: 'string',
            description: 'Protein',
          },
          carbs: {
            type: 'string',
            description: 'Carbs',
          },
          fat: {
            type: 'string',
            description: 'Fat',
          },
        },
      },
      image: {
        type: 'string',
        description: 'Image URL',
      },
      tags: {
        type: 'array',
        description: 'Tags',
        items: {
          type: 'string',
          description: 'Tag',
        },
      },
      specialDiets: {
        type: 'array',
        description: 'Special Diets',
        items: {
          type: 'string',
          description: 'Special Diet',
        },
      },
    },
    required: [
      'recipeName',
      'ingredients',
      'instructions',
      'servingFor',
      'prepTimeInMinutes',
      'cookTimeInMinutes',
      'totalTimeInMinutes',
      'nutritionInformation',
      'image',
      'tags',
      'specialDiets',
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
      prepTimeInMinutes: '10',
      cookTimeInMinutes: '30',
      totalTimeInMinutes: '40',
      nutritionInformation: [
        { calories: '100' },
        { protein: '110' },
        { carbs: '100' },
        { fat: '80' },
      ],
      image: ['https://example.com/image1.jpg'],
      tags: ['pomegranate', 'chicken', 'salad', 'vegetarian'],
      specialDiets: ['gluten-free', 'nut-free'],
    },
  ],
};

module.exports = myRecipePrompt;
