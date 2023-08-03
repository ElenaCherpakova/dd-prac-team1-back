const express = require('express');
const router = express.Router();

const { fetchApiRecipe } = require('../controllers/aiRecipe_controller');
const { addApiRecipe } = require('../controllers/addApiRecipe_controller');

router.post('/', fetchApiRecipe).post('/add', addApiRecipe);

module.exports = router;
