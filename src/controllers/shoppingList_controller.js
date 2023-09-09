const asyncWrapper = require('../middleware/async');
const Recipe = require('../models/Recipe');
const ShoppingList = require('../models/ShoppingList');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');
const createTransporter = require('../mailerConfig');
const emailValidation = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const { transformIngredients } = require('../helpers/transformIngredientData');

// During user registration, create or ensure an empty shopping list
const createOrUpdateShoppingList = async (userId, ingredients) => {
  ingredients = ingredients || [];
  let shoppingList;
  try {
    shoppingList = await ShoppingList.findOne({ userID: userId });

    if (!shoppingList) {
      shoppingList = new ShoppingList({ userID: userId, ingredients });
      await shoppingList.save();
    } else {
      // Loop through the ingredients to update or add them
      for (const ingredient of ingredients) {
        const existingIngredient = shoppingList.ingredients.find(
          (item) => item.ingredientName === ingredient.ingredientName
        );

        if (existingIngredient) {
          existingIngredient.ingredientAmount += ingredient.ingredientAmount;
        } else {
          shoppingList.ingredients.push(ingredient);
        }
      }
      await shoppingList.save();
    }
  } catch (error) {
    throw new Error('Error creating/updating shopping list');
  }
  return shoppingList;
};

// Add recipe ingredients to shopping list
const addRecipeToShoppingList = asyncWrapper(async (req, res) => {
  const { recipeId } = req.params;
  const userId = req.user.userId;
  let { servingSize } = req.body;

  if (servingSize === '' || servingSize <= 0) {
    servingSize = 1;
  }

  try {
    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      throw new NotFoundError('Recipe not found');
    }

    // Calculate the serving size multiplier
    const originalServingSize = recipe.recipeServings || 1; // Default to 1 if not provided
    const multiplier = servingSize / originalServingSize;

    const { recipeIngredients } = recipe;

    // Call the function to transform ingredients
    const adjustIngredients = transformIngredients(
      recipeIngredients,
      multiplier
    );

    // Create or update the shopping list
    await createOrUpdateShoppingList(userId, adjustIngredients);

    res
      .status(StatusCodes.CREATED)
      .json({ message: 'Recipe ingredients added to shopping list' });
  } catch (error) {
    console.error('Error adding recipe to shopping list:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'An error occurred while adding the recipe to the shopping list',
    });
  }
});

// Get shopping list for a user
const getShoppingList = asyncWrapper(async (req, res) => {
  try {
    const userId = req.user.userId;
    const shoppingList = await ShoppingList.findOne({ userID: userId });

    if (!shoppingList) {
      // If no shopping list exists, create an empty one
      const emptyShoppingList = new ShoppingList({ userID: userId, ingredients: [] });
      await emptyShoppingList.save();
      return res
        .status(StatusCodes.OK)
        .json(emptyShoppingList);
    }
    
    res
      .status(StatusCodes.OK)
      .json(shoppingList);
    
  } catch (error) {
    console.error('Error fetching shopping list:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'An error occurred while fetching the shopping list'});
    }
  });

// Update an ingredient in the shopping list
const updateIngredientShoppingList = asyncWrapper(async (req, res) => {
  // Decode the URL-encoded ingredient name
  const decodedIngredientName = decodeURIComponent(req.params.ingredientName);
  const userId = req.user.userId;
  const { ingredientAmount } = req.body;

  try {
    const shoppingList = await ShoppingList.findOne({ userID: userId });

    if (!shoppingList) {
      throw new NotFoundError('Shopping list not found');
    }

    // Find the index of the ingredient to be updated
    const ingredientIndex = shoppingList.ingredients.findIndex(
      (item) => item.ingredientName === decodedIngredientName
    );

    if (ingredientIndex === -1) {
      throw new NotFoundError('Ingredient not found in shopping list');
    }

    // Update the ingredient properties
    shoppingList.ingredients[ingredientIndex].ingredientAmount =
      ingredientAmount;

    await shoppingList.save();

    res
      .status(StatusCodes.OK)
      .json({ message: 'Ingredient updated in shopping list' });
  } catch (error) {
    console.error('Error updating ingredient in shopping list:', error);
    if (error instanceof NotFoundError) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: error.message });
    } else {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred while updating the ingredient' });
    }
  }
});

// Add an ingredient to the shopping list
const addIngredientToShoppingList = asyncWrapper(async (req, res) => {
  const { userId } = req.user;
  const { ingredientName, ingredientAmount, ingredientUnit } = req.body;

  if(!ingredientName || !ingredientAmount || !ingredientUnit){
    return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ message: 'Missing required fields' });
  }
  try {
    let shoppingList = await ShoppingList.findOne({ userID: userId });

    if (!shoppingList) {
      shoppingList = new ShoppingList({
        userID: userId,
        ingredients: [],
      });
    }

    // Check if the ingredient already exists in the shopping list
    const existingIngredient = shoppingList.ingredients.find(
      (item) => item.ingredientName === ingredientName
    );

    if (existingIngredient) {
      // If ingredient exists, suggest updating the amount of existing ingredient
      res.status(StatusCodes.OK).json({
        message:
          'Ingredient already exists in shopping list. Please update the amount.',
        existingIngredient,
      });
      return;
    }

    // Add the new ingredient to the shopping list
    shoppingList.ingredients.unshift({
      ingredientName,
      ingredientAmount,
      ingredientUnit,
    });

    await shoppingList.save();

    res
      .status(StatusCodes.OK)
      .json({ message: 'Ingredient added to shopping list' });
  } catch (error) {
    console.error('Error adding ingredient to shopping list:', error);
    if (error instanceof NotFoundError) {
      res.status(StatusCodes.NOT_FOUND).json({ error: error.message });
    } else {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred while adding the ingredient' });
    }
  }
});

// Delete an ingredient from the shopping list
const deleteIngredientShoppingList = asyncWrapper(async (req, res) => {
  // Decode the URL-encoded ingredient name
  const decodedIngredientName = decodeURIComponent(req.params.ingredientName);
  const userId = req.user.userId;

  try {
    const shoppingList = await ShoppingList.findOne({ userID: userId });

    if (!shoppingList) {
      throw new NotFoundError('Shopping list not found');
    }

    // Find the index of the ingredient to be deleted
    const ingredientIndex = shoppingList.ingredients.findIndex(
      (item) => item.ingredientName === decodedIngredientName
    );

    if (ingredientIndex === -1) {
      throw new NotFoundError('Ingredient not found in shopping list');
    }

    // Remove the ingredient from the shopping list
    shoppingList.ingredients.splice(ingredientIndex, 1);

    await shoppingList.save();

    res
      .status(StatusCodes.OK)
      .json({ message: 'Ingredient deleted from shopping list' });
  } catch (error) {
    console.error('Error deleting ingredient from shopping list:', error);
    if (error instanceof NotFoundError) {
      res.status(StatusCodes.NOT_FOUND).json({ error: error.message });
    } else {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred while deleting the ingredient' });
    }
  }
});

// Delete the entire shopping list for a user
const deleteShoppingList = asyncWrapper(async (req, res) => {
  const userId = req.user.userId;

  try {
    const shoppingList = await ShoppingList.findOneAndDelete({
      userID: userId,
    });

    if (!shoppingList) {
      throw new NotFoundError('Shopping list not found');
    }

    res
      .status(StatusCodes.OK)
      .json({ message: 'Shopping list deleted successfully' });
  } catch (error) {
    console.error('Error deleting shopping list:', error);
    if (error instanceof NotFoundError) {
      res.status(StatusCodes.NOT_FOUND).json({ error: error.message });
    } else {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred while deleting the shopping list' });
    }
  };
});

const shareShoppingList = asyncWrapper(async (req, res) => {
  const { recipientEmail } = req.body;
  const { userId } = req.user;

  try {
    if (!recipientEmail) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Provide email to who you want to send shopping list',
      });
    }
    // check if email is valid format
    if (!emailValidation.test(recipientEmail)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Invalid email format',
      });
    }
    // Fetch the user's details to get their email.
    const senderEmail = await User.findOne({ _id: userId });

    if (!senderEmail) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'User not found',
      });
    }

    const userEmailAddress = senderEmail.email;

    // Fetch the user's shopping list.
    const shoppingList = await ShoppingList.findOne({
      userID: userId,
    });
    if (!shoppingList) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Shopping list not found' });
    }

    let emailContainer = `
    <div style="display: table-row; background-color: #f2f2f2;">
        <div style="display: table-cell; padding: 10px; border-right: 1px solid #ddd; font-weight: bold;">Ingredient Name</div>
        <div style="display: table-cell; padding: 10px; border-right: 1px solid #ddd; font-weight: bold;">Amount</div>
        <div style="display: table-cell; padding: 10px; font-weight: bold;">Unit</div>
    </div>
`;
    shoppingList.ingredients.forEach((item) => {
      emailContainer += `
    <div style="display: table-row; border-bottom: 1px solid #ddd;">
        <div style="display: table-cell; padding: 10px; border-right: 1px solid #ddd;">${item.ingredientName}</div>
        <div style="display: table-cell; padding: 10px; border-right: 1px solid #ddd;">${item.ingredientAmount}</div>
        <div style="display: table-cell; padding: 10px;">${item.ingredientUnit}</div>
    </div>
`;
    });
    const transporter = await createTransporter();

    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: recipientEmail,
      subject: `Shopping list sent by ${userEmailAddress}`,
      text: `${userEmailAddress} sent you shopping list.`,
      html: `<div style="display: flex; flex-direction: column;">
              ${userEmailAddress}&nbsp; sent you the following shopping list: </div>
              ${emailContainer}`,
    };
    await transporter.sendMail(mailOptions);

    const confirmationMailOptions = {
      from: process.env.FROM_EMAIL,
      to: userEmailAddress,
      subject: `Shopping list received`,
      text: `Your shopping list was sent successfully to ${recipientEmail}`,
      html: `
          <b>Your shopping list was sent successfully to ${recipientEmail}</b>`,
    };

    // Send the confirmation message to the user
    await transporter.sendMail(confirmationMailOptions);

    return res
      .status(StatusCodes.OK)
      .json({ message: 'Email sent successfully' });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error sending email', error: error.message });
  }
});

module.exports = {
  addIngredientToShoppingList,
  addRecipeToShoppingList,
  createOrUpdateShoppingList,
  getShoppingList,
  updateIngredientShoppingList,
  deleteIngredientShoppingList,
  deleteShoppingList,
  shareShoppingList,
}
