const express = require('express');
const router = express.Router();
const {
  createMealPlan,
  updateMealPlan,
  getAllMealPlan
} = require('../controllers/mealPlanner_controller');

router.get('/', getAllMealPlan)
router.post('/', createMealPlan);
router.put('/:id', updateMealPlan);

module.exports = router;
