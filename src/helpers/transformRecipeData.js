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

  const wordQty = {
    'to taste': -1,
    'for serving': -2,
    'for garnish': -3,
  };
  const convertIngredientAmountIntoInteger = (value) => {
    if (wordQty[value] !== undefined) {
      return wordQty[value];
    }
    // Check if the value is a fraction
    const fractionRegex = /^\d+(\.\d+)?\/\d+(\.\d+)?$/;
    if (fractionRegex.test(value)) {
      return convertFractionToDecimal(value);
    }
    return Number(value);
  };

  const recipeIngredients = ingredients.map((ingredient) => {
    const [quantityValue] =
      ingredient.quantity.match(
        /^[\d\s\/]+|to taste|for serving|for garnish/
      ) || [];
    return {
      ingredientName: ingredient.name,
      ingredientAmount: convertIngredientAmountIntoInteger(quantityValue),
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
    recipeServings: servingFor,
    recipePrepTime: {
      recipePrepTimeMinutes: prepTimeInMinutes,
    },
    recipeCookTime: {
      recipeCookTimeMinutes: cookTimeInMinutes,
    },
    recipeTotalTime: {
      recipeTotalTimeMinutes: totalTimeInMinutes,
    },
    recipeNutritionInfo: {
      NutritionInfoCalories: nutritionInformation.calories,
      NutritionInfoProtein: nutritionInformation.protein,
      NutritionInfoCarbs: nutritionInformation.carbs,
      NutritionInfoFat: nutritionInformation.fat,
    },
    recipeImage: image,
    recipeComplexityLevel: recipeComplexityLevel,
    recipeTags: tags.map((tag) => ({ tagName: tag })),
    recipeSpecialDiets: specialDiets.map((diet) => diet),
  };
  return transformedRecipe;
};
module.exports = transformRecipeData;
