const profileService = require('../services/profileService');

const changePassword=(req,res)=>{
  
    const userDetails={
        userId:req.userId,
        newPassword:req.body.newPassword
    }
    profileService.changePassword(userDetails)
    .then(result=>res.status(200).json(result))
    .catch(err=>{throw err})

}

const getProfile=(req,res)=>{
  const userDetails= {
    userId:req.userId,
    role:req.userRole
}
   profileService.showProfile(userDetails)
   .then(result=>res.status(200).json(result))
   .catch(err=>{throw err})
}

const updateProfile =(req,res)=>{
    const userDetails={
        userId:req.userId,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        gender:req.body.gender,
        telephone:req.body.telephone,
        image : req.file,
        imageMimeCheck: req.fileValidationError

    }

    profileService.updateProfile(userDetails)
    .then((result=>res.status(200).json(result)))
    .catch(err=>{throw err})
}

module.exports={updateProfile,getProfile,changePassword}