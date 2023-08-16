const mealPlanner = require('../models/MealPlanner');
const { StatusCodes } = require('http-status-codes');
const asyncWrapper = require('../middleware/async');

const createMealPlan = asyncWrapper(async (req, res) => {
  const userId = req.user.userId;
  const { recipeId, day, mealSlot } = req.body;

  if (!recipeId || !day || !mealSlot) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Missing required fields' });
  }

  let mealPlanData = {
    userId,
    days: {
      [day]: {
        [mealSlot]: { recipeId },
      },
    },
  };
  let newMealPlan = await mealPlanner.create(mealPlanData);

  if (!newMealPlan) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: 'Meal plan not found' });
  }
  res.status(StatusCodes.CREATED).json({ newMealPlan });
});

// const updateMealPlan = asyncWrapper(async (req, res) => {
//   const userId = req.user.userId;
//   const mealPlanId = req.params.id;
//   const { recipeId, day, mealSlot } = req.body;

//   if (!recipeId || !day || !mealSlot) {
//     return res
//       .status(StatusCodes.BAD_REQUEST)
//       .json({ message: 'Missing required fields' });
//   }
//   //check for existing mealplan with the given id and user id
//   let mealPlan = await mealPlanner.findOne({ _id: mealPlanId, userId });
//   if (!mealPlan) {
//     return res
//       .status(StatusCodes.NOT_FOUND)
//       .json({ message: 'Meal plan not found' });
//   }
//   //check if the day exists
//   if (!mealPlan.days[day]) {
//     mealPlan.days[day] = {};
//   }
//   //check if the meal slot exists
//   if (!mealPlan.days[day][mealSlot]) {
//     mealPlan.days[day][mealSlot] = {};
//   }
//   //update the recipe id
//   mealPlan.days[day][mealSlot].recipeId = recipeId;
//   //save the meal plan
//   await mealPlan.save();
//   res.status(StatusCodes.OK).json({ mealPlan });
// });

module.exports = { createMealPlan };
