const Joi = require('joi');

// Schéma de validation pour la création et la mise à jour d'un bulletin
const bulletinSchema = Joi.object({
  marque: Joi.string().required(),
  refBS: Joi.string().required(),
  nomAdherent: Joi.string().required(),
  prenomMalade: Joi.string().required(),
  dateSoins: Joi.date().iso().required(),
  honoraires: Joi.string().required(),
  pharmacie: Joi.string().required(),
  analyse: Joi.string().required(),
  maternite: Joi.string().required(),
  chirurgie: Joi.string().required(),
  inject:Joi.string().required(),
  dent:Joi.string().required(),
  monture:Joi.string().required(),
  total:Joi.string().required()

});

// Fonction de validation des données du bulletin
const validation = (data) => {
  return bulletinSchema.validate(data, { abortEarly: false }).error;
};

module.exports = { validation };
