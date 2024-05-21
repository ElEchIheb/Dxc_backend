const db = require('../models');
const posteValidation = require('../joiValidation/posteValidation')

const createPoste = (newPoste) => {
    const validationResult = posteValidation.validation({
        posteName: newPoste.posteName,
        sickLeave: newPoste.sickLeave,
        leave: newPoste.leave
    });
    if (validationResult instanceof Error) {

        throw validationResult;
    }

    else if (newPoste.role === 'superadmin') {
        return db.Poste.findAll({ where: { posteName: newPoste.posteName, isAdmin: false } })
            .then(poste => {
                if (!poste.length) {
                    return db.Poste.create({
                        isAdmin: false,
                        posteName: newPoste.posteName,
                        sickLeave: newPoste.sickLeave,
                        leave: newPoste.leave
                    })
                        .then(newPoste => newPoste)
                        .catch(err => { throw err })
                }
                else throw new Error('This postName already exists')
            })
            .catch(err => { throw err })

    }
    else if (newPoste.role === 'admin') {
        return db.User.findOne({
            where: { id: newPoste.adminId }
        })
            .then(admin => {
                const departmentId = admin.departmentId;
                return db.Poste.findAll({ where: { posteName: newPoste.posteName, isAdmin: true } })
                    .then(poste => {
                        if (!poste.length) {
                            return db.Poste.create({
                                isAdmin: true,
                                posteName: newPoste.posteName,
                                sickLeave: newPoste.sickLeave,
                                leave: newPoste.leave,
                                departmentId: departmentId
                            })
                                .then(newPoste => newPoste)
                                .catch(err => { throw err })
                        }
                        else throw new Error("This postName already exists")
                    })
                    .catch(err => { throw err })

            })
            .catch(err => { throw err })

    }
    else throw new Error("Not authorized");


}


const allPostes = (details) => {

    if (details.role === 'superadmin') {
        return db.Poste.findAll()
            .then(superAdminPostes => superAdminPostes)
            .catch(err => { throw err });
    }
    else if (details.role === 'admin') {
        return db.User.findOne({
            where: { id: details.adminId }
        })
            .then(admin => {
                return db.Poste.findAll({ where: { isAdmin: true, departmentId: admin.departmentId } })
                    .then(adminPostes => adminPostes)
                    .catch(err => { throw err })
            })
            .catch(err => { throw err })
    }
    else throw new Error("Not authorized");

}


const updatePoste = (posteDetails) => {

    const { newPosteName,
        newLeave,
        newSickLeave } = posteDetails;

    const validationResult = posteValidation.validation({
        posteName: newPosteName,
        leave: newLeave,
        sickLeave: newSickLeave
    });
    if (validationResult instanceof Error) {
        throw validationResult;
    }
    else return db.Poste.findOne({ where: { id: posteDetails.posteId } })
        .then(poste => {
            if (poste) {
                if (!poste.isAdmin) {
                    return db.Poste.findAll({ where: { posteName: newPosteName, isAdmin: false } })
                        .then(checkPoste => {
                            if (!checkPoste.length || poste.posteName === newPosteName) {
                                return poste.update({
                                    posteName: newPosteName,
                                    leave: newLeave,
                                    sickLeave: newSickLeave
                                });
                            }
                            else throw new Error('This posteName already exists')
                        })
                        .catch(err => { throw err })
                }
                else {
                    return db.Poste.findAll({ where: { posteName: newPosteName, isAdmin: true } })
                        .then(checkPoste => {
                            if (!checkPoste.length || poste.posteName === newPosteName) {
                                return poste.update({
                                    posteName: newPosteName,
                                    leave: newLeave,
                                    sickLeave: newSickLeave
                                });
                            }
                            else throw new Error('This posteName already exists')
                        })
                        .catch(err => { throw err })
                }

            }
            else return poste;
        })
        .then(updatedPoste => {
            if (updatedPoste) return "poste updated successfully";
            else throw new Error("poste not found");
        })

        .catch(err => {
            throw err; S
        });
}

const onePoste = (posteDetails) => {

    if (posteDetails.role === 'superadmin') {
        return db.Poste.findOne({ where: { id: posteDetails.posteId } })
            .then(result => {
                if (result) {
                    return result
                }
                else throw new Error("poste not found")
            })
            .catch(err => { throw err })
    }
    else if (posteDetails.role === 'admin') {
        return db.Poste.findAll({ where: { isAdmin: true } })
            .then(adminPoste => {
                const findPoste = adminPoste.find(poste => poste.id === posteDetails.posteId);
                return findPoste;
            })
            .then(result => {
                if (result) {
                    return result
                }
                else throw new Error("poste not found")
            })
            .catch(err => { throw err })
    }
    else throw new Error("Not authorized")
}

const deletePoste = (posteDetails) => {
    return db.Poste.findOne({
        where: { id: posteDetails.posteId },
        include: [{ model: db.User }]
    })
        .then(poste => {
            if (poste) {
                const activeUsers = poste.Users.filter(user => user.status);
                if (activeUsers.length && posteDetails.status == false) {
                    throw new Error("Impossible to delete this Poste , it contains employees . ")
                }
                else if (!activeUsers.length && posteDetails.status == false) {
                    poste.status = posteDetails.status;
                    return poste.save();
                }
                else {
                    poste.status = posteDetails.status;
                    return poste.save();
                }
            }
            else throw new Error("poste not found")
        })
        .then(statusChange => {
            if (statusChange.status) {
                return "Poste restored successfully";
            } else {
                return "Poste deleted successfully";
            }
        })

        .catch(err => {
            throw err;
        });


}

const allActivePostes = (posteDetails) => {

    if (posteDetails.role === 'superadmin') {
        return db.Poste.findAll({
            where: {
                isAdmin:false,
                status: true
            }
        })
            .then(activePostes => activePostes)
            .catch(err => { throw err })
    }

    else if (posteDetails.role === 'admin') {
        return db.User.findOne({
            where: { id: posteDetails.adminId }
        })
            .then(admin => {
                return db.Poste.findAll({
                    where: {
                        status: true,
                        isAdmin: true,
                        departmentId: admin.departmentId
                    }
                })
                    .then(activePostes => activePostes)
                    .catch(err => { throw err })
            })

    }
    else throw new Error("Not authorized");
}

module.exports = { createPoste, allPostes, updatePoste, onePoste, deletePoste, allActivePostes }