const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    enum: ['kg', 'g', 'lbs', 'cups', 'tbs', 'tbsp', 'OtherUnit'],
    required: true,
  },
});

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: (value) => value.replace(/[^\w\s]/g, '-'),
  },
});

const RecipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide the recipe name'],
      maxlength: 50,
    },
    ingredients: [ingredientSchema],
    servings: {
      type: Number,
      default: 1,
      required: [true, 'Please provide the serving size'],
      validate: {
        validator: Number.isInteger,
        message: 'Servings must be an integer.',
      },
    },
    complexityLevel: {
      type: String,
      enum: ['easy', 'medium', 'difficult'],
      default: 'medium',
    },
    tags: [tagSchema],
    category: {
      type: String,
      required: [true, 'Please provide the category'],
      enum: [
        'Main Dishes',
        'Snacks',
        'Soups',
        'Cream Soups',
        'Cocktails',
        'Salads',
        'Desserts',
        'Kids Menu',
        'Breakfasts',
        'Appetizers',
        'Side Dishes',
        'Sandwiches',
        'Picnic Ideas',
        'Smoothies',
        'Party Menu',
        'CustomCategory',
      ],
    },
    specialDiets: [
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
          'CustomSpecialDiet',
        ],
      },
    ],
    instructions: {
      type: String,
      required: [true, 'Please provide the cooking instructions'],
    },
    prepTime: {
      hours: {
        type: Number,
        default: 0,
      },
      minutes: {
        type: Number,
        default: 0,
      },
    },
    cookTime: {
      hours: {
        type: Number,
        default: 0,
      },
      minutes: {
        type: Number,
        default: 0,
      },
    },
    totalTime: {
      hours: {
        type: Number,
        default: 0,
      },
      minutes: {
        type: Number,
        default: 0,
      },
    },
    nutritionInfo: {
      calories: {
        type: Number,
      },
      protein: {
        type: Number,
      },
      carbs: {
        type: Number,
      },
      fat: {
        type: Number,
      },
    },
    image: {
      type: String,
    },
    createdBy: [
      { 
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user'],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Recipe', RecipeSchema);
