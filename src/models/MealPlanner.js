const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mealPlanner = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  dayOfWeek: {
    type: String,
    enum: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
  },
  mealSlot: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner'],
  },
  recipeId: {
    type: Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true,
  },
});

module.exports = mongoose.model('mealPlanner', mealPlanner);
