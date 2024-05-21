const Joi = require('joi');

const requestValidationSchema = Joi.object({
  type: Joi.string().required(),
  subject: Joi.string().required(),
  content: Joi.string().required(),
  startDate: Joi.date(),
  endDate: Joi.date()
});

module.exports = requestValidationSchema;
