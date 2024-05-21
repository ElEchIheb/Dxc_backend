const express =require('express');
const router=express.Router();
const posteController = require('../controllers/posteController');

router.get('/', posteController.getAllPostes);
router.get('/search-poste/:id', posteController.getOnePoste);
router.post('/createPoste', posteController.addNewPoste);
router.put('/putPoste/:id', posteController.updatePoste);
router.put('/delPoste/:id', posteController.deletePoste);
router.get('/activePostes', posteController.getAllActivePostes);

module.exports = router;