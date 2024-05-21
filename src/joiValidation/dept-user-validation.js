const Joi = require('joi');

const schemaValidation = Joi.object({
   adminData:{ 
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    gender: Joi.string().length(1).required(),
    telephone: Joi.number().integer().allow(null),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    posteId:Joi.number().required(),
    departmentId:Joi.number().integer().required()
   },
   departmentData:{
    departmentId: Joi.number().required(),
    departmentName:Joi.string().min(1).required(),
   }
});

const validation = (data) => {
    const { error } = schemaValidation.validate(data);
    if (error) {
        return new Error(error.details[0].message);
    }
    return null;
}

module.exports = { validation }
