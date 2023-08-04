const generateImagePrompt = (data) => {
  const imageGenerationPrompt = `Create a visually compelling, professionally crafted photo that exudes sophistication for the following recipe: ${
    data.recipeName
  }. The recipe uses the following ingredients: ${data.ingredients
    .map((ingredient) => `${ingredient.name})`)
    .join(
      ', '
    )}. Also each generated image should be unique and not a repetition of previously generated images. The image should adhere to these guidelines:
    1. Uniqueness: Each image created should be distinctly different from the others. Avoid replicating the same layouts, angles, or compositions.
    2. Dish Focus: The image should focus solely on the dish itself. Avoid including utensils, dishware, or other kitchen items unless they are part of the dish presentation.
    3. Color Palette: Utilize a light green color palette in the image. This can be achieved through the dish itself, garnishes, or other elements in the photo.
    4. Background: Use a high-quality, minimalist background that complements the dish and the light green color palette, adding a stylish, professional backdrop.
    5. Garnish and Plating: The dish should be arranged in a precise and elegant manner, as you would expect in a high-end restaurant. Garnishes that match the light green palette are preferred.
    6. Composition: The composition should be well thought out and sophisticated, with a focus on the dish's key elements.
  The ultimate aim is to produce a high-quality, professional image that showcases the recipe in a gourmet cooking magazine style, with a pleasing light green aesthetic and a unique perspective each time.`;
  return imageGenerationPrompt;
};

module.exports = generateImagePrompt;
