const express = require('express');
const router = express.Router();

const { fetchApiRecipe } = require('../controllers/aiRecipe_controller');
const {addApiRecipe} = require('../controllers/')
router.post('/', fetchApiRecipe);
router.post('/add', addApiRecipe);

module.exports = router;
