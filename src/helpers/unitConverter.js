// Function to convert an ingredient amount to grams
const convertToGrams = (ingredientAmount, ingredientUnit) => {
  console.log(`Converting ${ingredientAmount} ${ingredientUnit} to grams`);

  // Conversion logic
  let result;

  switch (ingredientUnit) {
    case 'g':
      result = ingredientAmount;
      break;
    case 'kg':
      result = ingredientAmount * 1000;
      break;
    case 'oz':
      result = ingredientAmount * 28.3495;
      break;
    case 'lb':
      result = ingredientAmount * 453.592;
      break;
    case 'cup':
      result = ingredientAmount * 128; // Assuming 1 cup is 128 grams
      break;
    case 'cups':
      result = ingredientAmount * 128; // Assuming 1 cup is 128 grams
      break;
    case 'tbsp':
      result = ingredientAmount * 14.7868; // Assuming 1 tbsp is 14.7868 grams
      break;
    case 'tsp':
      result = ingredientAmount * 4.9289; // Assuming 1 tsp is 4.9289 grams
      break;
    default:
      // Log an error if the unit is unrecognized
      console.error(`Unrecognized unit: ${ingredientUnit}`);
      result = null;
  }

  // Log the result before returning
  console.log(`Result: ${result} grams`);

  return result;
};

module.exports = {
  convertToGrams,
};
