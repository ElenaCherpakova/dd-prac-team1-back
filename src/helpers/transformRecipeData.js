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

  const recipeIngredients = ingredients.map((ingredient) => {
    return {
      ingredientName: ingredient.name,
      ingredientAmount: parseFloat(ingredient.quantity),
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
