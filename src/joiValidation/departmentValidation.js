const joi = require('joi');

const departmentValidation = joi.object({
    departmentName: joi.string().min(1).required()
})

const validation = (data) => {
    const { error } = departmentValidation.validate(data);
    if (error) {
        return new Error(error.details[0].message);
    }
    return null;
}

module.exports = { validation }
