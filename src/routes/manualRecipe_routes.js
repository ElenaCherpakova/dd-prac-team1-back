const express = require('express');
const router = express.Router();
const {
    getAllRecipes,
    getManualRecipe,
    createManualRecipe,
    updateManualRecipe,
    deleteManualRecipe,
} = require('../controllers/manualRecipe_controller');

router.route('/').post(createManualRecipe).get(getAllRecipes);
router.route('/:id').get(getManualRecipe).delete(deleteManualRecipe).patch(updateManualRecipe);

module.exports = router;