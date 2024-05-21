const joi =require('joi');
const searchValidationSupAdmin = joi.object({
    email: joi.string().email().allow('',null),
    firstName:joi.string().allow('',null),
    lastName:joi.string().allow('',null),
    departmentId: joi.number().allow('',null),
    posteId:joi.number().allow('',null)
})

const searchValidationadmin = joi.object({
    email: joi.string().email().allow('',null),
    firstName:joi.string().allow('',null),
    lastName:joi.string().allow('',null),
    roleId:joi.number().allow('',null),
    posteId:joi.number().allow('',null),
    teamId:joi.number().allow('',null)

})

const searchValidationManager= joi.object({
    email: joi.string().email().allow('',null),
    firstName:joi.string().allow('',null),
    lastName:joi.string().allow('',null),
    roleId:joi.number().allow('',null),
    posteId:joi.number().allow('',null),
})

const supAdminValidation = (data) => {
    const { error } = searchValidationSupAdmin.validate(data);
    if (error) {
        return new Error(error.details[0].message);
    }
    return null;
}
const adminValidation = (data) => {
    const { error } = searchValidationSupAdmin.validate(data);
    if (error) {
        return new Error(error.details[0].message);
    }
    return null;
}
const managerValidation = (data) => {
    const { error } = searchValidationSupAdmin.validate(data);
    if (error) {
        return new Error(error.details[0].message);
    }
    return null;
}

module.exports = { managerValidation,adminValidation,supAdminValidation } 