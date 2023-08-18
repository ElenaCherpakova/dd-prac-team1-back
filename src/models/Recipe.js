const mongoose = require('mongoose');

const recipeIngredientSchema = new mongoose.Schema({
  ingredientName: {
    type: String,
    required: true,
  },
  ingredientAmount: {
    type: Number,
    required: true,
  },
  ingredientUnit: {
    type: String,
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
    //required: true,
  },
});

const tagSchema = new mongoose.Schema({
  tagName: {
    type: String,
    required: true,
    trim: true,
    set: (value) =>
      value.match(/(\p{L})|((?<=\p{L})(-| )(?=\p{L}))/gu).join(''),
  },
});

const RecipeSchema = new mongoose.Schema(
  {
    recipeName: {
      type: String,
      required: [true, 'Please provide the recipe name'],
      maxlength: 50,
    },
    recipeIngredients: [recipeIngredientSchema],
    recipeServings: {
      type: Number,
      default: 1,
      //required: [true, 'Please provide the serving size'],
      validate: {
        validator: Number.isInteger,
        message: 'Servings must be an integer.',
      },
    },
    recipeComplexityLevel: {
      type: String,
      enum: ['easy', 'medium', 'difficult'],
      default: 'medium',
    },
    recipeTags: [tagSchema],
    recipeCategory: {
      type: String,
      required: [true, 'Please provide the category'],
      enum: [
        'Main Dish',
        'Snack',
        'Soup',
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
        'Smoothie',
        'Party Menu',
      ],
    },
    recipeSpecialDiets: [
      {
        type: String,
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
    recipeInstructions: {
      type: String,
      required: [true, 'Please provide the cooking instructions'],
    },
    recipePrepTime: {
      recipePrepTimeMinutes: {
        type: Number,
        default: 0,
      },
    },
    recipeCookTime: {
      recipeCookTimeMinutes: {
        type: Number,
        default: 0,
      },
    },
    recipeTotalTime: {
      recipeTotalTimeMinutes: {
        type: Number,
        default: 0,
      },
    },
    recipeNutritionInfo: {
      NutritionInfoCalories: {
        type: Number,
      },
      NutritionInfoProtein: {
        type: Number,
      },
      NutritionInfoCarbs: {
        type: Number,
      },
      NutritionInfoFat: {
        type: Number,
      },
    },
    recipeImage: {
      type: String,
    },
    recipeImagePublic: {
      type: String,
    },
    recipeCreatedBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Recipe', RecipeSchema);
