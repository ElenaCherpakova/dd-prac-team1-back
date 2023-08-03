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
            unit: {
              type: 'string',
              description: 'Ingredient unit of measurement',
              enum: ['kg', 'g', 'lbs', 'cup', 'tsp', 'tbsp', 'other'],
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
        type: 'string',
        description:
          'Category. Please provide only one category from the following options:',
        enum: [
          'Main Dish',
          'Snack',
          'Soups',
          'Cream Soup',
          'Cocktail',
          'Salad',
          'Dessert',
          'Kids Menu',
          'Breakfast',
          'Appetizer',
          'Side Dish',
          'Sandwich',
          'Picnic Ideas',
          'Smoothy',
          'Party Menu',
          'CustomCategory',
        ],
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
      recipeComplexityLevel: {
        type: 'string',
        description: 'Recipe complexity level',
        enum: ['easy', 'medium', 'hard'],
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
          anyOf: [
            {
              type: 'string',
              enum: [
                'Weight Loss',
                'Gluten-free',
                'Pork-free',
                'Vegetarian',
                'Vegan',
                'Gluten-free',
                'Mediterranean',
                'Diabetes Friendly',
                'Low Carb',
                'CustomSpecialDiet',
              ],
            },
          ],
        },
      },
    },
    required: [
      'recipeName',
      'ingredients',
      'instructions',
      'categories',
      'servingFor',
      'prepTimeInMinutes',
      'cookTimeInMinutes',
      'totalTimeInMinutes',
      'nutritionInformation',
      'image',
      'recipeComplexityLevel',
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
          unit: 'kg',
        },
        {
          name: 'pomegranate',
          quantity: '1',
          unit: 'otherUnit',
        },
      ],
      instructions: [
        'Cut the chicken into pieces',
        'Put the chicken in a pot',
        'Add the pomegranate and salt',
        'Cook for 30 minutes',
      ],
      categories: ['Salad'],
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
      recipeComplexityLevel: 'easy',
      tags: ['pomegranate', 'chicken', 'salad', 'vegetarian'],
      specialDiets: ['Gluten-free', 'Vegetarian'],
    },
  ],
};

module.exports = myRecipePrompt;
