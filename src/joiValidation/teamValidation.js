const joi = require('joi');

const teamValidation = joi.object({
    teamName: joi.string().min(1).required()
})

const validation = (data) => {
    const { error } = teamValidation.validate(data);
    if (error) {
        return new Error(error.details[0].message);
    }
    return null;
}

module.exports = { validation } 