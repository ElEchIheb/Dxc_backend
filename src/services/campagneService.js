const db = require('../models');
const campagneValidation = require('../joiValidation/campagneValidation');

const allCampagne = () => {

    return db.Campagne.findAll()

        .then(campagnes => {
            return campagnes;
        })

        .catch(err => {
            throw err;
        });
}

const oneCampagne = (id) => {
    return db.Campagne.findOne({
        where: { id }
    })
        .then(campagne => {
            if (campagne) {
                return campagne
            }
            else throw new Error("Campagne not found");
        })
        .catch(err => { throw err })
}

const createCampagne = (newYear) => {
    const validationResult = campagneValidation.validation(newYear);
    if (validationResult instanceof Error) {

        throw validationResult;
    }

    return db.Campagne.create(newYear)
        .then(newCampagne => newCampagne)
        .catch(err => { throw err });

}


const deleteCampagne = (campagneDetails) => {
    return db.Campagne.findOne({ where: { id: campagneDetails.campagneId } })
        .then(campagne => {
            if (campagne) {
                campagne.status = campagneDetails.status;
                return campagne.save();
            }
            else return campagne
        })
        .then(statusChange => {
            if (statusChange) {

                if (statusChange.status) {
                    return "Campagne restored successfully";
                } else {
                    return "Campagne deleted successfully";
                }

            }
            else return "Campagne not found "

        })

        .catch(err => {
            throw err;
        });


}
const activeCampagne = () => {

    return db.Campagne.findAll()

        .then(campagnes => {


            if (campagnes.length) {

                const activeCampagnes = campagnes.filter(campagne => campagne.status);
                return activeCampagnes;
            }
            else return campagnes;
        })

        .catch(err => {
            throw err;
        });
}




module.exports = { createCampagne, oneCampagne, allCampagne, deleteCampagne, activeCampagne }