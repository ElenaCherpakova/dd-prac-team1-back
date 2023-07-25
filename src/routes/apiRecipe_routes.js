const express = require('express');
const router = express.Router();

const { fetchApiRecipe } = require('../controllers/aiRecipe_controller');

router.post('/', fetchApiRecipe);

module.exports = router;
