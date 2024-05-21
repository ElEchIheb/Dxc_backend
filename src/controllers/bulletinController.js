const bulletinService = require('../services/bulletinService');
const { validation: validateBulletin } = require('../joiValidation/bulletinValidation');

// Créer un bulletin de soins
exports.createBulletin = async (req, res) => {
  try {
    const validationResult = validateBulletin(req.body);
    if (validationResult) {
      return res.status(400).json({ error: validationResult.details.map(detail => detail.message) });
    }
    
    const newBulletin = await bulletinService.createBulletin(req.body);
    res.status(201).json(newBulletin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtenir tous les bulletins de soins
exports.getAllBulletins = async (req, res) => {
  try {
    const bulletins = await bulletinService.allBulletins();
    res.status(200).json(bulletins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour un bulletin de soins
exports.updateBulletin = async (req, res) => {
  try {
    const { id } = req.params;
    const newData = req.body;

    const validationResult = validateBulletin(newData);
    if (validationResult) {
      return res.status(400).json({ error: validationResult.details.map(detail => detail.message) });
    }

    const updatedBulletin = await bulletinService.updateBulletin(id, newData);
    res.status(200).json(updatedBulletin);
  } catch (error) {
    console.log('asba')
    res.status(500).json({ error: error.message });
  }
};

// Supprimer un bulletin de soins
exports.deleteBulletin = async (req, res) => {
  try {
    const { id } = req.params;
    await bulletinService.deleteBulletin(id);
    res.status(200).json({ message: 'Bulletin deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
