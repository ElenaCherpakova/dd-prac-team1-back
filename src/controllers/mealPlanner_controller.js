const mealPlanner = require('../models/MealPlanner');
const { StatusCodes } = require('http-status-codes');
const asyncWrapper = require('../middleware/async');

const createMealPlan = asyncWrapper(async (req, res) => {
  //extract the user ID from the auth user
  const { userId } = req.user;
  const { recipeId, dayOfWeek, mealSlot } = req.body;

  // check if require fields are missing
  if (!dayOfWeek || !mealSlot) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Missing required fields' });
  }
  // check if a meal plan already exists for the same day and slot
  const existingMealPlan = await mealPlanner.findOne({
    userId,
    dayOfWeek,
    mealSlot,
  });
  if (existingMealPlan) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message:
        'A meal plan already exists for the same day and slot. Please choose a different recipe or slot.',
    });
  }
  let mealPlanData = {
    userId,
    dayOfWeek,
    mealSlot,
    recipeId,
  };
  let newMealPlan = await mealPlanner.create(mealPlanData);

  if (!newMealPlan) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Failed to create a meal plan' });
  }
  res
    .status(StatusCodes.CREATED)
    .json({ newMealPlan, message: 'Meal plan created successfully' });
});

const updateMealPlan = asyncWrapper(async (req, res) => {
  const { mealCreatedBy } = req.user;
  const { id: mealPlanId } = req.params;
  const { recipeId, dayOfWeek, mealSlot } = req.body;

  if (!dayOfWeek || !mealSlot) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Missing required fields' });
  }

  // check if a meal plan already exists for the same day and slot
  const existingMealPlan = await mealPlanner.findOne({
    userId,
    dayOfWeek,
    mealSlot,
  });
  if (existingMealPlan && existingMealPlan._id.toString() !== mealPlanId) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message:
        'A meal plan already exists for the same day and slot. Please choose a different recipe or slot.',
    });
  }
  //check for existing meal plan with the given id and user id
  let mealPlanData = {
    userId,
    dayOfWeek,
    mealSlot,
    recipeId,
  };
  let mealPlan = await mealPlanner.findOneAndUpdate(
    { _id: mealPlanId, userId },
    mealPlanData,
    { new: true, runValidators: true }
  );
  if (!mealPlan) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: 'Meal plan not found' });
  }
  console.log(mealPlan);

  //save the meal plan
  await mealPlan.save();
  res
    .status(StatusCodes.OK)
    .json({ mealPlan, message: 'Meal plan updated successfully' });
});

const getAllMealPlan = asyncWrapper(async (req, res) => {
  const { userId } = req.user;
  const mealPlans = await mealPlanner.find({ userId });
  res.status(StatusCodes.OK).json({ mealPlans, count: mealPlans.length });
});

module.exports = { createMealPlan, updateMealPlan, getAllMealPlan };
