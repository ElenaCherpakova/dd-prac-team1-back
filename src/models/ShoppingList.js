const mongoose = require('mongoose');

const ShoppingListSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ingredients: [
    {
      ingredientName: String,
      ingredientAmount: Number,
      ingredientUnit: String,
    },
  ],
});

module.exports = mongoose.model('ShoppingList', ShoppingListSchema);
