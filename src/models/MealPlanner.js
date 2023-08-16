const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mealSchema = new Schema({
  recipeId: {
    type: Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true,
    unique: true,
  },
});

const DaySchema = new Schema({
  breakfast: mealSchema,
  lunch: mealSchema,
  dinner: mealSchema,
});

const mealWeeklyPlanner = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  days: {
    Monday: DaySchema,
    Tuesday: DaySchema,
    Wednesday: DaySchema,
    Thursday: DaySchema,
    Friday: DaySchema,
    Saturday: DaySchema,
    Sunday: DaySchema,
  },
});

module.exports = mongoose.model('WeeklyPlanner', mealWeeklyPlanner);
