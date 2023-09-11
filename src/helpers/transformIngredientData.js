const unitConverter = require('./unitConverter');

const transformIngredients = (ingredients, multiplier) => {
  const shoppingList = {};

  ingredients.forEach((ingredient) => {
    if (ingredient.ingredientUnit === 'cloves' || ingredient.ingredientUnit === 'medium' || ingredient.ingredientUnit === 'pinch') {
      // Cloves, pinch, and medium are excluded from conversion, use the original ingredient amount
      const { ingredientName, ingredientAmount, ingredientUnit } = ingredient;
      shoppingList[ingredientName] = shoppingList[ingredientName] || { ingredientAmount: 0, ingredientUnit };
      shoppingList[ingredientName].ingredientAmount += ingredientAmount;
    } else if (ingredient.ingredientUnit === 'other') {
      if (ingredient.ingredientAmount < 0) {
        // For ingredients with unit 'other' and negative amounts, set ingredientAmount to 1 and unit to 'to taste'
        const { ingredientName } = ingredient;
        shoppingList[ingredientName] = { ingredientAmount: 1, ingredientUnit: 'to taste' };
      } else {
        // For ingredients with unit 'other' and positive amounts, sum them up
        const { ingredientName, ingredientAmount, ingredientUnit } = ingredient;
        shoppingList[ingredientName] = shoppingList[ingredientName] || { ingredientAmount: 0, ingredientUnit: '' };
        shoppingList[ingredientName].ingredientAmount += ingredientAmount;
      }
    } else {
      // Handle other units and convert them
      const adjustedAmount = ingredient.ingredientAmount * multiplier;

      if (isNaN(adjustedAmount)) {
        console.error(`Error converting ingredient: ${ingredient.ingredientName}`);
        return;
      }

      // UnitConverter helper function for unit conversion
      const amountInGrams = unitConverter.convertToGrams(
        adjustedAmount,
        ingredient.ingredientUnit
      );

      if (isNaN(amountInGrams)) {
        console.error(`Error converting ingredient: ${ingredient.ingredientName}`);
        return;
      }

      // Round the amount to the nearest integer (grams)
      const roundedAmount = Math.round(amountInGrams);

      shoppingList[ingredient.ingredientName] = shoppingList[ingredient.ingredientName] || { ingredientAmount: 0, ingredientUnit: 'g' };
      shoppingList[ingredient.ingredientName].ingredientAmount += roundedAmount;
    }
  });

  // Convert the shoppingList object back to an array
  const transformedIngredients = Object.keys(shoppingList).map((ingredientName) => ({
    ingredientName,
    ingredientAmount: shoppingList[ingredientName].ingredientAmount,
    ingredientUnit: shoppingList[ingredientName].ingredientUnit,
  }));

  return transformedIngredients;
};

module.exports = {
  transformIngredients,
};
