const userService = require('../services/userService');

const register = (req, res) => {
  const userDetails = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    gender: req.body.gender,
    telephone: req.body.telephone,
    roleId: req.body.roleId,
    teamId: req.body.teamId,
    email: req.body.email,
    password: req.body.password,
    posteId: req.body.posteId,
    departmentId: req.body.departmentId,
    adminId: req.userId,
    role: req.userRole,
    image: req.file,
    imageMimeCheck: req.fileValidationError
  }
  userService.addNewUser(userDetails)
    .then(response => {res.status(201).json(response)})
    .catch(err => res.status(400).json({ msg: err.message || "An unexpected error occurred" }));
};
const getAllUsers = (req, res) => {
  const userDetails = {
    role: req.userRole,
    id: req.userId
  }
  
  userService.allUsers(userDetails)
    .then(result => res.status(200).json(result))
    .catch(err => res.status(400).json({ msg: err.message || "An unexpected error occurred" }))
}


const getRandomPassword = (req, res) => {
  const generatedPassword = userService.generateRandomUserPassword()
  res.status(200).json({ generatedPassword })

}


const updateUser = (req, res) => {
  const userDetails = {
    userId: req.params.id,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    telephone: req.body.telephone,
    newPosteId: req.body.posteId,
    role: req.userRole

  }

  userService.updateUser(userDetails)
    .then(result => res.status(200).json({ msg: result }))
    .catch(err => res.status(400).json({ msg: err.message || "An unexpected error occurred" }))
}


const deleteUser=(req,res)=>{
  const userDetails={
    role:req.userRole,
    status:req.body.status,
    userId:req.params.id,

  }
  userService.deleteUser(userDetails)
  .then(result => res.status(200).json(result))
  .catch(err => res.status(400).json({ msg: err.message || "An unexpected error occurred" }))
}

const getRoles=(req,res)=>{

  userService.allRoles()
  .then(roles=>res.status(200).json(roles))
  .catch(err=>{throw err})
}
const getAdvancedFilter=(req,res)=>{
  const userDetails= {
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    departmentId: req.body.departmentId,
    posteId: req.body.posteId,
    teamId: req.body.teamId,
    roleId:req.body.roleId,
    role:req.userRole,
    userId:req.userId
}
userService.advancedFilter(userDetails)
.then(response => {res.status(201).json(response)})
    .catch(err => res.status(400).json({ msg: err.message || "An unexpected error occurred" }));
};

module.exports = { register, getAllUsers, getRandomPassword,updateUser ,deleteUser,getRoles,getAdvancedFilter}