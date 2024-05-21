const Joi = require('joi');

const schemaValidation = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    gender: Joi.string().length(1).required(),
    telephone: Joi.string().allow(null,''),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
   posteId:Joi.number().required(),
    
});
const supAdminSchema= Joi.object({
    departmentId:Joi.number().integer().required()
});
const adminSchema= Joi.object({
    roleId:Joi.number().required(),
    teamId:Joi.number().integer().allow(null,''),
    adminId: Joi.number().required()
});
const supAdminvalidation = (data) => {
    const { error } = supAdminSchema.validate(data);
    if (error) {
        return new Error(error.details[0].message);
    }
    return null;
}
const adminvalidation = (data) => {
    const { error } = adminSchema.validate(data);
    if (error) {
        return new Error(error.details[0].message);
    }
    return null;
}

const validation = (data) => {
    const { error } = schemaValidation.validate(data);
    if (error) {
        return new Error(error.details[0].message);
    }
    return null;
}
const updateSchemaValidation = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    telephone: Joi.number().integer().allow(null),
    posteId:Joi.number().required(),

});

const updateValidation=(data) => {
    const { error } = updateSchemaValidation.validate(data);
    if (error) {
        return new Error(error.details[0].message);
    }
    return null;
}
module.exports = { validation,updateValidation,supAdminvalidation,adminvalidation }