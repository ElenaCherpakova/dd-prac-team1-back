// Generate the image generation prompt with the recipe data
const generateImagePrompt = (data) => {
  const imageGenerationPrompt = `Please create a stunning and professional image with an appetizing presentation for the recipe: ${
    data.recipeName
  }.
    Ingredients: ${data.ingredients
      .map((ingredient) => `${ingredient.name} (${ingredient.quantity})`)
      .join(', ')}.
    Guidelines:
    1. Use a clean and stylish background that complements the dish.
    2. Include relevant garnishes or plating elements to enhance visual appeal.
    3. Ensure effective lighting to highlight dish details.
    4. Avoid showing any hands or other irrelevant elements in the photo.
    Add creative touches to make the image visually captivating and aligned with the magazine's aesthetics.`;
  return imageGenerationPrompt;
};

module.exports = generateImagePrompt;
