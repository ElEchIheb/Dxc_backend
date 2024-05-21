const joi = require('joi');

const posteValidation = joi.object({
    posteName: joi.string().min(1).required(),
    leave: joi.number().required(),
    sickLeave: joi.number().required()
})

const validation = (data) => {
    const { error } = posteValidation.validate(data);
    if (error) {
        return new Error(error.details[0].message);
    }
    return null;
}

module.exports = { validation }
