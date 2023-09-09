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
    if (!fraction) return NaN;
    const [wholeNum, fract] = fraction.trim().split(' ');

    let total = 0;

    if (wholeNum) {
      if (!wholeNum.includes('/')) {
        total += Number(wholeNum);
      } else {
        const [numerator, denominator] = wholeNum.split('/');
        if (denominator === '0' || !denominator) {
          return NaN;
        }
        total += Number(numerator) / Number(denominator);
      }
    }
    if (fract) {
      const [numerator, denominator] = fract.split('/');
      if (denominator === '0' || !denominator) {
        return NaN;
      }
      total += Number(numerator) / Number(denominator);
    }
    return total;
  };

  const wordQty = {
    'to taste': -1,
    'for serving': -2,
    'for garnish': -3,
    'to serve': -4,
    'to garnish': -5,
  };
  const convertIngredientAmountIntoInteger = (value) => {
    if (wordQty[value] !== undefined) {
      return wordQty[value];
    }
    // Check if the value is a fraction
    const fractionRegex = /^(\d+\s)?(\d+\/\d+)?$/;
    if (fractionRegex.test(value)) {
      return convertFractionToDecimal(value);
    }
    return Number(value) || NaN;
  };

  const recipeIngredients = ingredients.map((ingredient) => {
    const [quantityValue] =
      ingredient.quantity.match(
        /^[\d\s\/]+|to taste|for serving|for garnish|to serve|to garnish/
      ) || [];
    return {
      ingredientName: ingredient.name,
      ingredientAmount: convertIngredientAmountIntoInteger(quantityValue.split('')[0]),
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
