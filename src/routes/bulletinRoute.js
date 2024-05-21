
const express = require('express');
const router = express.Router();
const bulletinController = require('../controllers/bulletinController');

// Créer un bulletin de soins
router.post('/bulletins', bulletinController.createBulletin);

// Obtenir tous les bulletins de soins
router.get('/bulletins', bulletinController.getAllBulletins);

// Mettre à jour un bulletin de soins
router.put('/bulletins/:id', bulletinController.updateBulletin);
router.delete('/bulletins/:id', bulletinController.deleteBulletin);



module.exports = router;