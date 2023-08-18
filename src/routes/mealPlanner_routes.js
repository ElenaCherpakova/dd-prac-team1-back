const express = require('express');
const router = express.Router();
const {
  createMealPlan,
  updateMealPlan,
} = require('../controllers/mealPlanner_controller');

router.post('/', createMealPlan);
router.put('/:id', updateMealPlan);

module.exports = router;
