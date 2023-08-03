const Recipe = require('../models/Recipe');
const isValidIngredientUnitEnum = (value) => {
  return Recipe.schema
    .path('recipeIngredients.ingredientUnit')
    .enumValues.includes(value);
};

const transformRecipeData = (openAIOutput) => {
  const {
    recipeName,
    ingredients,
    instructions,
    categories,
    servingFor,
    prepTimeInMinutes,
    cookTimeInMinutes,
    totalTimeInMinutes,
    nutritionInformation,
    image,
    recipeComplexityLevel,
    tags,
    specialDiets,
  } = openAIOutput;

  const convertFractionToDecimal = (fraction) => {
    const [numerator, denominator] = fraction.split('/');
    const parsedNumerator = Number(numerator);
    const parsedDenominator = Number(denominator);
    if (parsedDenominator === 0) {
      return NaN;
    }
    return parsedNumerator / parsedDenominator;
  };
  const convertIngredientAmountIntoInteger = (value) => {
    if (value === 'to taste') {
      return -1;
    }
    // Check if the value is a fraction
    if (/^\d+(\.\d+)?\/\d+(\.\d+)?$/.test(value)) {
      return convertFractionToDecimal(value);
    }
    return Number(value);
  };

  const recipeIngredients = ingredients.map((ingredient) => {
    return {
      ingredientName: ingredient.name,
      ingredientAmount: convertIngredientAmountIntoInteger(ingredient.quantity),
      ingredientUnit: isValidIngredientUnitEnum(ingredient.unit)
        ? ingredient.unit
        : 'other',
    };
  });

  const transformedRecipe = {
    recipeName,
    recipeIngredients: recipeIngredients,
    recipeInstructions: instructions.join('\n'),
    recipeCategory: categories,
    recipeServings: Number(servingFor),
    recipePrepTime: {
      recipePrepTimeMinutes: Number(prepTimeInMinutes),
    },
    recipeCookTime: {
      recipeCookTimeMinutes: Number(cookTimeInMinutes),
    },
    recipeTotalTime: {
      recipeTotalTimeMinutes: Number(totalTimeInMinutes),
    },
    recipeNutritionInfo: {
      NutritionInfoCalories: Number(nutritionInformation.calories),
      NutritionInfoProtein: Number(nutritionInformation.protein),
      NutritionInfoCarbs: Number(nutritionInformation.carbs),
      NutritionInfoFat: Number(nutritionInformation.fat),
    },
    recipeImage: image,
    recipeComplexityLevel: recipeComplexityLevel,
    recipeTags: tags.map((tag) => ({ tagName: tag })),
    recipeSpecialDiets: specialDiets.map((diet) => diet),
  };
  return transformedRecipe;
};
module.exports = transformRecipeData;
