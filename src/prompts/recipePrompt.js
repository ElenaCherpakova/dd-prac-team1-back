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
        description: 'List of ingredients used in the recipe.',
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description:
                'Name of the ingredient. This should be a singular, common name for the ingredient (e.g., "chicken", "pomegranate", "salt"). Avoid brand names or specific varieties unless they are essential to the recipe.',
            },
            quantity: {
              type: 'string',
              description:
                'Quantity of the ingredient, represented only as a number, fraction, or decimal (e.g., "2", "1/2", or "1.5"). Do not include units here.',
            },
            unit: {
              type: 'string',
              description:
                'Unit of measurement for the ingredient. Only standard measurement units should be used (e.g., "kg", "g", "cup", etc.).',
              enum: [
                'kg',
                'g',
                'lbs',
                'cup',
                'tsp',
                'tbsp',
                'cups',
                'cloves',
                'ml',
                'l',
                'medium',
                'pinch',
                'other',
              ],
            },
          },
        },
      },
      instructions: {
        type: 'array',
        description:
          'Step-by-step cooking instructions. Ensure that each instruction is clear and concise.',
        items: {
          type: 'string',
          description:
            'A single step in the recipe, written in the imperative mood (e.g., "Cut the chicken", "Stir the mixture").',
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
        ],
      },
      servingFor: {
        type: 'number',
        description:
          'Number of servings. For this request, please provide recipes that serve 2 persons.',
      },
      prepTimeInMinutes: {
        type: 'number',
        description: 'Preparing time in minutes',
      },
      cookTimeInMinutes: {
        type: 'number',
        description: 'Cooking time in minutes',
      },
      totalTimeInMinutes: {
        type: 'number',
        description: 'Total time in minutes',
      },
      nutritionInformation: {
        type: 'object',
        description: 'Nutrition information. All properties must be numbers.',
        properties: {
          calories: {
            type: 'number',
            description: 'Calories',
          },
          protein: {
            type: 'number',
            description: 'Protein',
          },
          carbs: {
            type: 'number',
            description: 'Carbs',
          },
          fat: {
            type: 'number',
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
                'Keto',
                'Low Calorie',
                'Lactose Free',
                'Dairy Free',
                'Soy Free',
                'None',
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
          quantity: '1/2',
          unit: 'medium',
        },
      ],
      instructions: [
        'Cut the chicken into pieces',
        'Put the chicken in a pot',
        'Add the pomegranate and salt',
        'Cook for 30 minutes',
      ],
      categories: ['Salad'],
      servingFor: 2,
      prepTimeInMinutes: 10,
      cookTimeInMinutes: 30,
      totalTimeInMinutes: 40,
      nutritionInformation: [
        { calories: 100 },
        { protein: 110 },
        { carbs: 100 },
        { fat: 80 },
      ],
      image: ['https://example.com/image1.jpg'],
      recipeComplexityLevel: 'easy',
      tags: ['pomegranate', 'chicken', 'salad', 'vegetarian'],
      specialDiets: ['Gluten-free', 'Vegetarian'],
    },
  ],
};

module.exports = myRecipePrompt;
