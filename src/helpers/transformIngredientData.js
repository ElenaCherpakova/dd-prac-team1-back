const unitConverter = require('./unitConverter');

// Function to transform ingredient data based on a multiplier
const transformIngredients = (ingredients, multiplier) => {
  return ingredients.map((ingredient) => {
    if (ingredient.ingredientUnit === 'cloves' || ingredient.ingredientUnit === 'medium' || ingredient.ingredientUnit === 'pinch') {
      // Cloves, pinch and medium are excluded from conversion, use the original ingredient amount
      return {
        ingredientName: ingredient.ingredientName,
        ingredientAmount: ingredient.ingredientAmount,
        ingredientUnit: ingredient.ingredientUnit,
      };
    } else if (ingredient.ingredientUnit === 'other' && ingredient.ingredientAmount < 0) {
      // For ingredients with unit 'other' and negative amounts, display as 'as desired'
      return {
        ingredientName: ingredient.ingredientName,
        ingredientUnit: 'as desired',
      };
    } else {
     
      const adjustedAmount = ingredient.ingredientAmount * multiplier;

      // UnitConverter helper function for unit conversion
      const amountInGrams = unitConverter.convertToGrams(
        adjustedAmount,
        ingredient.ingredientUnit
      );

      if (amountInGrams === null) {
        console.error(`Error converting ingredient: ${ingredient.ingredientName}`);
      }

      // Round the amount to the nearest integer (grams)
      const roundedAmount = Math.round(amountInGrams);

      return {
        ingredientName: ingredient.ingredientName,
        ingredientAmount: roundedAmount,
        ingredientUnit: 'g', // Convert the rest of the units to grams
      };
    }
  });
};

module.exports = {
  transformIngredients,
};
