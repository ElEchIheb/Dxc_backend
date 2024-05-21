const db = require('../models');
const bcrypt = require('bcrypt');

const changePassword = (userDetails) => {
    const {
        userId,
        newPassword
    } = userDetails
    return db.User.findByPk(userId)
        .then(user => {
            return bcrypt.hash(newPassword, 10)
                .then(hashedPassword => {
                    user.password = hashedPassword;
                    return user.save()
                        .then(() => {
                            return {
                                msg: "Password updated successfully"
                            }
                        })
                })
                .catch(err => { throw err })

        })
        .catch(err => { throw err })
}

const showProfile = (userDetails) => {
    const { role, userId } = userDetails;
    return db.User.findOne({
        where: {
            id: userId
        },
        include: [
            { model: db.Poste },
            { model: db.Team },
            {model:db.Department}
        ]
    })
        .then(user => {
            if (role === 'superadmin')
                return {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    gender: user.gender,
                    telephone: user.telephone,
                    email: user.email,
                    imageName: user.imageName,


                }
            else if (role === 'admin') {
                return {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    gender: user.gender,
                    telephone: user.telephone,
                    sickLeaveBalance: user.sickLeaveBalance,
                    compensatoryTimeOffBalance: user.compensatoryTimeOffBalance,
                    leaveBalance: user.leaveBalance,
                    email: user.email,
                    imageName: user.imageName,
                    posteName: user.Poste.posteName,
                    departmentName: user.Department.departmentName

                }
            }
            else if (role === 'manager') {
                return {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    gender: user.gender,
                    telephone: user.telephone,
                    sickLeaveBalance: user.sickLeaveBalance,
                    compensatoryTimeOffBalance: user.compensatoryTimeOffBalance,
                    leaveBalance: user.leaveBalance,
                    email: user.email,
                    imageName: user.imageName,
                    posteName: user.Poste.posteName,
                    teamName: user.Team.teamName,
                    departmentName: user.Department.departmentName


                }
            }
            else if (role === 'collaborator') {
                if (user.Team) {
                    return {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        gender: user.gender,
                        telephone: user.telephone,
                        sickLeaveBalance: user.sickLeaveBalance,
                        compensatoryTimeOffBalance: user.compensatoryTimeOffBalance,
                        leaveBalance: user.leaveBalance,
                        email: user.email,
                        imageName: user.imageName,
                        posteName: user.Poste.posteName,
                        teamName: user.Team.teamName,
                        departmentName: user.Department.departmentName

                    }
                }
                else return {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    gender: user.gender,
                    telephone: user.telephone,
                    sickLeaveBalance: user.sickLeaveBalance,
                    compensatoryTimeOffBalance: user.compensatoryTimeOffBalance,
                    leaveBalance: user.leaveBalance,
                    email: user.email,
                    imageName: user.imageName,
                    posteName: user.Poste.posteName,
                    departmentName: user.Department.departmentName,
                    teamName: null

                }
            }
        })
}

const updateProfile = (userDetails) => {
    const {
        userId,
        firstName,
        lastName,
        gender,
        telephone,
        image,
        imageMimeCheck

    } = userDetails
    return db.User.findByPk(userId)
        .then(user => {
            if (imageMimeCheck) {
                throw new Error({ error: userData.imageMimeCheck })
            }

            else if (image) {
                return user.update({
                    firstName:firstName,
                    lastName:lastName,
                    gender:gender,
                    telephone:telephone,
                    imageName:image.filename
                })
                .then(()=>{
                    return {
                        msg:'profile updated successfully'
                    }
                })
            }
            else return user.update({
                firstName:firstName,
                lastName:lastName,
                gender:gender,
                telephone:telephone
            })
            .then(()=>{
                return {
                    msg:'profile updated successfully'
                }
            })
        })
}

module.exports={changePassword,showProfile,updateProfile}