const posteService = require('../services/posteService');

const addNewPoste = (req, res) => {
    const data = {
        posteName: req.body.posteName,
        leave: req.body.leave,
        sickLeave: req.body.sickLeave,
        role: req.userRole,
        adminId:req.userId
    }
    posteService.createPoste(data)
        .then(result => res.status(201).json({
            msg: "poste added successfully",
            newPoste: result
        }))
        .catch(err => res.status(400).json({ msg: err }))
}
const getAllPostes = (req, res) => {
    const details = {
        adminId:req.userId,
        role:req.userRole
    }
    posteService.allPostes(details)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json({ msg: err.message || "An unexpected error occurred" }))
}

const updatePoste = (req, res) => {
    const posteDetails = {
        posteId: req.params.id,
        newPosteName: req.body.posteName,
        newLeave: req.body.leave,
        newSickLeave: req.body.sickLeave
    }
    posteService.updatePoste(posteDetails)
        .then(result => res.status(200).json({ msg: result }))
        .catch(err => res.status(400).json({ msg: err.message || "An unexpected error occurred" }))
}

const getOnePoste = (req, res) => {
    const posteDetails = {
        role: req.userRole,
        posteId: req.params.id
    }
    posteService.onePoste(posteDetails)
        .then(result => res.status(200).json(result))
        .catch(err => res.status(400).json({ msg: err.message || "An unexpected error occurred" }))

}

const deletePoste = (req, res) => {
    const status = req.body.status;
    const posteId = req.params.id;
    const posteDetails = {
        status:status,
        posteId:posteId
    }
    posteService.deletePoste(posteDetails)
        .then(result => res.status(200).json({ msg: result }))
        .catch(err => res.status(400).json({ msg: err.message || "An unexpected error occurred" }))
}

const getAllActivePostes = (req, res) => {
    const posteDetails={
        adminId:req.userId,
        role:req.userRole
    }
    posteService.allActivePostes(posteDetails)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json({ msg: err.message || "An unexpected error occurred" }))
}

module.exports = { addNewPoste, getAllPostes, updatePoste, getOnePoste, deletePoste, getAllActivePostes }