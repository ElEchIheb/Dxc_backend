const campagneService = require('../services/campagneService');

const getAllCampagne = (req, res) => {
    campagneService.allCampagne()
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json({ msg: err.message || "An unexpected error occurred" }))
}

const getOneCampagne = (req, res) => {
    const { id } = req.params;
    campagneService.oneCampagne(id)
        .then(result => res.status(200).json(result))
        .catch(err => res.status(400).json({ msg: err.message || "An unexpected error occurred" }))

}

const addNewCampagne = (req, res) => {
    campagneService.createCampagne(req.body)
        .then(result => res.status(201).json({
            msg: "campagne added successfully",
            newDepartment: result
        }))
        .catch(err => res.status(400).json({ msg: err }))

}

const deleteCampagne = (req, res) => {
    const status = req.body.status;
    const campagneId = req.params.id;
    const deptDetails = {
        status,
        campagneId
    }
    campagneService.deleteCampagne(deptDetails)
        .then(result => res.status(200).json({ msg: result }))
        .catch(err => res.status(400).json({ msg: err.message || "An unexpected error occurred" }))
}


const getActiveCampagne = (req, res) => {
    campagneService.activeCampagne()
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json({ msg: err.message || "An unexpected error occurred" }))
}

module.exports = { getAllCampagne, getOneCampagne, addNewCampagne, deleteCampagne, getActiveCampagne }