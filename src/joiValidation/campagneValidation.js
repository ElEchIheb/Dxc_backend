const joi = require('joi');

const campagneValidation = joi.object({
    year: joi.number().integer().min(2000).max(9999).required()
});


const validation = (data) => {
    const { error } = campagneValidation.validate(data);
    if (error) {
        return new Error(error.details[0].message);
    }
    return null;
}

module.exports = { validation }
