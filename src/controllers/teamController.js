const teamService = require('../services/teamService');

const addNewTeam = (req, res) => {
    const teamDetails = {
        teamName: req.body.teamName,
        adminId: req.userId    
    }
    teamService.createTeam(teamDetails)
        .then(result => res.status(201).json({
            msg: "New team added successfully",
            newTeam: result
        }))
        .catch(err => res.status(400).json({ msg: err.message || "An unexpected error occurred" }))

}

const getAllTeams = (req, res) => {
    teamService.allTeams(req.userId)
        .then(result => res.status(200).json(result))
        .catch(err => res.status(400).json({ msg: err.message || "An unexpected error occurred" }));
}
const deleteTeam = (req, res) => {
    const teamDetails = {
        status: req.body.status,
        teamId: req.params.id
    }
    teamService.deleteTeam(teamDetails)
        .then(result => res.status(200).json({ msg: result }))
        .catch(err => res.status(400).json({ msg: err.message || "An unexpected error occurred" }))
}
//feha liste wa9t add manager w wa9t add collaborator
const getActiveTeams = (req, res) => {
    const adminId = req.userId;
    teamService.allActiveTeams(adminId)
        .then(result => res.status(200).json(result))
        .catch(err => res.status(400).json({ msg: err.message || "An unexpected error occurred" }));
}



const updateTeam = (req, res) => {
    const teamDetails = {
        teamId: req.params.id,
        newTeamName: req.body.teamName,
        newManagerId:req.body.newManagerId,
        adminId:req.userId,
        teamData:req.body.collaborators
    }
    
    teamService.updateTeam(teamDetails)
        .then(result => res.status(200).json({ msg: result }))
        .catch(err => res.status(400).json({ msg: err.message || "An unexpected error occurred" }))
}
const getCollaboratorsForUpdate = (req,res)=>{
    const teamDetails={
        teamId:req.params.id,
        adminId:req.userId
    };
    teamService.getToUpdateCollaborators(teamDetails)
    .then(result=>res.status(200).json(result))
    .catch(err=>{throw err})

}


module.exports = { addNewTeam, getAllTeams, deleteTeam, getActiveTeams ,updateTeam,getCollaboratorsForUpdate}