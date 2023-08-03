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
    const parsedNumerator = parseFloat(numerator);
    const parsedDenominator = parseFloat(denominator);
    if (parsedDenominator === 0) {
      return NaN;
    }
    return parsedNumerator / parsedDenominator;
  };
  const convertIngredientAmountIntoInteger = (value) => {
    if (value === 'to taste') {
      return -1;
    }
    if (/^\d+(\.\d+)?\/\d+(\.\d+)?$/.test(value)) {
      // Check if the value is a fraction
      return convertFractionToDecimal(value);
    }
    return parseFloat(value);
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
    recipeServings: parseFloat(servingFor),
    recipePrepTime: {
      recipePrepTimeMinutes: parseFloat(prepTimeInMinutes),
    },
    recipeCookTime: {
      recipeCookTimeMinutes: parseFloat(cookTimeInMinutes),
    },
    recipeTotalTime: {
      recipeTotalTimeMinutes: parseFloat(totalTimeInMinutes),
    },
    recipeNutritionInfo: {
      NutritionInfoCalories: parseFloat(nutritionInformation.calories),
      NutritionInfoProtein: parseFloat(nutritionInformation.protein),
      NutritionInfoCarbs: parseFloat(nutritionInformation.carbs),
      NutritionInfoFat: parseFloat(nutritionInformation.fat),
    },
    recipeImage: image,
    recipeComplexityLevel: recipeComplexityLevel,
    recipeTags: tags.map((tag) => ({ tagName: tag })),
    recipeSpecialDiets: specialDiets.map((diet) => diet),
  };
  return transformedRecipe;
};
module.exports = transformRecipeData;
