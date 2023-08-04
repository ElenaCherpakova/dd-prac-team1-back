const express = require('express');
const router = express.Router();

const {
  fetchApiRecipe,
  createApiRecipe,
} = require('../controllers/aiRecipe_controller');
// const { addApiRecipe } = require('../controllers/addApiRecipe_controller');

router.post('/', fetchApiRecipe).post('/add', createApiRecipe);

module.exports = router;
