const express = require('express');
const router = express.Router();
const campagneController = require('../controllers/campagneController');


router.get('/', campagneController.getAllCampagne);
router.get('/search-campagne/:id', campagneController.getOneCampagne);
router.post('/createcampagne', campagneController.addNewCampagne);
router.put('/delCampagne/:id', campagneController.deleteCampagne);
router.get('/activeCampagne',campagneController.getActiveCampagne)
module.exports = router;