const db = require('../models');
const userValidation = require('../joiValidation/userValidation');
const userSearchValidation = require('../joiValidation/user-search')
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();



const transporter = nodemailer.createTransport({
    service: process.env.service,
    auth: {
        user: process.env.email,
        pass: process.env.pass
    }
});

const mailOptions = (email, password) => {
    return {
        from: process.env.email,
        to: email,
        subject: 'Dxc-account',
    text: `this is your DXC Technology account :  
                - Email:${email}
                - Password:${password}`
    }
};



const allRoles = () => {
    return db.Role.findAll()
}


const generateRandomUserPassword = () => {
    return crypto.randomBytes(8).toString('hex');
};

const addNewUser = (userData) => {
    const userDetails = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        gender: userData.gender,
        telephone: userData.telephone,
        email: userData.email,
        password: userData.password,
        posteId: userData.posteId
    }
    
    const validationResult = userValidation.validation(userDetails);
    if (validationResult instanceof Error) {
        throw validationResult;
    }
    else {
        return db.User.findOne({ where: { email: userData.email } })
            .then(existingUser => {
                if (existingUser) {
                    throw new Error("Email is already in use");
                } else {
                    return bcrypt.hash(userData.password, 10)
                        .then(hashedPassword => {
                            const pass = userData.password;
                            userData.password = hashedPassword;
                            if (userData.role === "superadmin") {
                                const superAdminDetails = {
                                    departmentId: userData.departmentId
                                }
                                const validationResult = userValidation.supAdminvalidation(superAdminDetails);
                                if (validationResult instanceof Error) {
                                    throw validationResult;
                                }
                                else{
                                userData.roleId = 2;
                                userData.teamId = null;
                                if (userData.imageMimeCheck) {
                                    throw new Error({ error: userData.imageMimeCheck })
                                }
                                else if (userData.image) {
                                    userData.imageName = userData.image.filename;
                                    if (userData.departmentId) {
                                        return db.User.create(userData)
                                            .then(() => {
                                                return transporter.sendMail(mailOptions(userData.email, pass))
                                                    .then(() => 'Admin account created successfully')
                                                    .catch(error => { throw error });
                                            })
                                            .catch(err => { throw err });
                                    }
                                    else throw new Error('department required')
                                }
                                else if (!userData.image) {
                                    userData.imageName = null;
                                    if (userData.departmentId) {
                                        return db.User.create(userData)
                                            .then(() => {
                                                return transporter.sendMail(mailOptions(userData.email, pass))
                                                    .then(() => 'Admin account created successfully')
                                                    .catch(error => { throw error });
                                            })
                                            .catch(err => { throw err });
                                    }
                                    else throw new Error('department required')
                                }
                                else throw new Error("An error occured")
                            }
                            }
                            else if (userData.role === "admin") {
                                const adminDetails = {
                                    roleId:userData.roleId,
                                    teamId:userData.teamId,
                                    adminId:userData.adminId
                                }
                                const validationResult = userValidation.adminvalidation(adminDetails);
                                if (validationResult instanceof Error) {
                                    throw validationResult;
                                }
                                else{
                                return db.User.findByPk(userData.adminId)
                                    .then(admin => {
                                        userData.departmentId = admin.departmentId;
                                        if (userData.roleId == 3) {
                                            if (userData.teamId) {
                                                if (userData.imageMimeCheck) {
                                                    throw new Error({ error: userData.imageMimeCheck })
                                                }
                                                else if (userData.image) {
                                                    userData.imageName = userData.image.filename;
                                                    return db.User.create(userData)
                                                        .then(() => {
                                                            return transporter.sendMail(mailOptions(userData.email, pass))
                                                                .then(() => 'Manager account created successfully')
                                                                .catch(error => { throw error });
                                                        })
                                                        .catch(err => { throw err });
                                                }
                                                else if (!userData.image) {
                                                    userData.imageName = null;
                                                    return db.User.create(userData)
                                                        .then(() => {
                                                            return transporter.sendMail(mailOptions(userData.email, pass))
                                                                .then(() => 'Manager account created successfully')
                                                                .catch(error => { throw error });
                                                        })
                                                        .catch(err => { throw err });
                                                }

                                                else throw new Error("An error occured")
                                            }
                                            else throw new Error('manager should have a team')
                                        }
                                        else if (userData.roleId == 4) {
                                            if (userData.imageMimeCheck) {
                                                throw new Error({ error: userData.imageMimeCheck })
                                            }
                                            else if (userData.teamId) {
                                                return db.User.findOne({
                                                    where: {
                                                        teamId: userData.teamId,
                                                        roleId: 3
                                                    }
                                                })
                                                    .then(manager => {
                                                        if (manager) {
                                                            if (userData.image) {
                                                                userData.imageName = userData.image.filename;

                                                                return db.User.create(userData)
                                                                    .then(() => {
                                                                        return transporter.sendMail(mailOptions(userData.email, pass))
                                                                            .then(() => 'Collaborator account created successfully')
                                                                            .catch(error => { throw error });
                                                                    })
                                                                    .catch(err => { throw err });
                                                            }
                                                            else if (!userData.image) {
                                                                userData.imageName = null;
                                                                return db.User.create(userData)
                                                                    .then(() => {
                                                                        return transporter.sendMail(mailOptions(userData.email, pass))
                                                                            .then(() => 'Collaborator account created successfully')
                                                                            .catch(error => { throw error });
                                                                    })
                                                                    .catch(err => { throw err });
                                                            }
                                                            else throw new Error("An error occured")

                                                        }
                                                        else throw new Error('this team doesnt have a manager yet , you cant add this collaborator to a team')
                                                    })
                                                    .catch(err => { throw err })
                                            }
                                            else if (!userData.teamId) {
                                                userData.teamId = null;
                                                if (userData.image) {
                                                    userData.imageName = userData.image.filename;

                                                    return db.User.create(userData)
                                                        .then(() => {
                                                            return transporter.sendMail(mailOptions(userData.email, pass))
                                                                .then(() => 'Collaborator account created successfully')
                                                                .catch(error => { throw error });
                                                        })
                                                        .catch(err => { throw err });
                                                }
                                                else if (!userData.image) {
                                                    userData.imageName = null;
                                                    return db.User.create(userData)
                                                        .then(() => {
                                                            return transporter.sendMail(mailOptions(userData.email, pass))
                                                                .then(() => 'Collaborator account created successfully')
                                                                .catch(error => { throw error });
                                                        })
                                                        .catch(err => { throw err });
                                                }
                                                else throw new Error("An error occured")

                                            }



                                        }
                                        else throw new Error("Unauthorized")

                                    })
                                    .catch(err => { throw err })
                            }
                        }
                            else throw new Error("Unauthorized")
                        })
                        .catch(err => { throw err });
                }
            })
            .catch(err => { throw err });
    }


}

const allUsers = (userDetails) => {
    if (userDetails.role === 'superadmin') {
        return db.User.findAll({
            where: {
                roleId: 2
            },
            include: [
                { model: db.Department },
                { model: db.Role },
                { model: db.Poste }
            ]
        })
            .then(adminstrators => {
                const adminDetails = adminstrators.map(admin => {
                    return {
                        firstName: admin.firstName,
                        lastName: admin.lastName,
                        id: admin.id,
                        gender: admin.gender,
                        status: admin.status,
                        email: admin.email,
                        image: admin.imageName,
                        role: admin.Role.roleName,
                        poste: admin.Poste.posteName,
                        department: admin.Department.departmentName,
                        departmentId: admin.Department.id,
                        posteId: admin.Poste.id,
                        telephone: admin.telephone
                    }
                })
                return adminDetails;
            })
            .catch(err => { throw err })
    }
    else if (userDetails.role === 'admin') {
        return db.User.findByPk(userDetails.id)
            .then(admin => {
                return db.User.findAll({
                    where: {
                        departmentId: admin.departmentId
                    },
                    include: [
                        { model: db.Department },
                        { model: db.Role },
                        { model: db.Poste }
                    ]
                })
                    .then(employees => {
                        const listWithoutAdmin = employees.filter(emp => emp.Role.roleName !== 'admin');
                        const employeeDetails = listWithoutAdmin.map(emp => {
                            return {
                                firstName: emp.firstName,
                                lastName: emp.lastName,
                                id: emp.id,
                                gender: emp.gender,
                                status: emp.status,
                                email: emp.email,
                                image: emp.imageName,
                                role: emp.Role.roleName,
                                poste: emp.Poste.posteName,
                                department: emp.Department.departmentName,
                                telephone: emp.telephone
                            }
                        })
                        return employeeDetails;
                    })
                    .catch(err => { throw err })
            })
            .catch(err => { throw err })
    }
    else if (userDetails.role === 'manager') {
        return db.User.findByPk(userDetails.id)
            .then(manager => {
                return db.User.findAll({
                    where: {
                        departmentId: manager.departmentId,
                        teamId: manager.teamId
                    },
                    include: [
                        { model: db.Department },
                        { model: db.Role },
                        { model: db.Poste }
                    ]
                })
                    .then(employees => {
                        const listWithoutManager = employees.filter(emp => emp.Role.roleName !== 'manager');
                        const employeeDetails = listWithoutManager.map(emp => {
                            return {
                                firstName: emp.firstName,
                                lastName: emp.lastName,
                                gender: emp.gender,
                                email: emp.email,
                                image: emp.imageName,
                                role: emp.Role.roleName,
                                poste: emp.Poste.posteName,
                                department: emp.Department.departmentName,
                                telephone: emp.telephone

                            }
                        })
                        return employeeDetails;
                    })
                    .catch(err => { throw err })
            })
            .catch(err => { throw err })
    }
}

const updateUser = (userDetails) => {

    const { firstName, lastName, newPosteId, telephone } = userDetails
    const validationResult = userValidation.updateValidation({ firstName: firstName, lastName: lastName, posteId: newPosteId, telephone: telephone });
    if (validationResult instanceof Error) {
        throw validationResult;
    }
    else {
        if (userDetails.role === 'superadmin' || userDetails.role === 'admin') {
            return db.User.findByPk(userDetails.userId)
                .then(emp => {
                    emp.firstName = firstName;
                    emp.lastName = lastName;
                    emp.telephone = telephone;
                    emp.posteId = newPosteId;
                    return emp.save()
                        .then(emp => {
                            return {
                                msg: 'user updated successfully',
                                result: emp
                            }
                        })
                })

        }
        else throw new Error('Not authorized')
    }
}

const deleteUser = (userDetails) => {
    if (userDetails.role === 'superadmin') {
        return db.User.findByPk(userDetails.userId)
            .then(admin => {
                if (!userDetails.status) {
                    return db.User.findAll({ where: { departmentId: admin.departmentId } })
                        .then(departmentEmployees => {
                            const empWithoutAdmin = departmentEmployees.filter(emp => emp.roleId !== 2 && emp.status);
                            if (!empWithoutAdmin.length) {
                                admin.status = false;
                                admin.roleId = 4;
                                return admin.save()
                                    .then(adminDeleted => {
                                        return {
                                            msg: 'admin deleted successfully',
                                            data: adminDeleted
                                        }
                                    })
                            }
                            else throw new Error('department without an admin  ')
                        })
                        .catch(err => { throw err })
                }
            })
            .catch(err => { throw err })

    }
    else if (userDetails.role === 'admin') {
        if (!userDetails.status) {
            return db.User.findByPk(userDetails.userId)
                .then(employee => {
                    if (employee.roleId == 3) {
                        return db.User.findAll({ where: { teamId: employee.teamId } })
                            .then(teamMates => {
                                const collaborators = teamMates.filter(emp => emp.roleId !== 3);
                                if (!collaborators.length) {
                                    employee.status = false;
                                    employee.teamId = null;
                                    return employee.save()
                                        .then(manager => {
                                            return {
                                                msg: 'manager deleted successfully',
                                                data: manager
                                            }
                                        })
                                        .catch(err => { throw err })
                                }
                                else throw new Error('team doesnt have a manager , put a new manager first  ')
                            })
                            .catch(err => { throw err })
                    }
                    else if (employee.roleId == 4) {

                        employee.teamId = null;
                        employee.status = false;
                        return employee.save()
                            .then(collaborator => {
                                return {
                                    msg: 'collaborator deleted successfully',
                                    data: collaborator
                                }
                            })
                            .catch(err => { throw err })

                    }
                    else throw new Error('role doesnt exist')
                })
                .catch(err => { throw err })
        }
        else if (userDetails.status) {
            return db.User.findByPk(userDetails.userId)
                .then(collaborator => {
                    collaborator.status = true;
                    return collaborator.save()
                        .then(collaborator => {
                            return {
                                msg: 'collaborator restored successfully',
                                data: collaborator
                            }
                        })
                        .catch(err => { throw err })
                })
        }
        else throw new Error('status invalid')
    }
    else throw new Error('Not authorized')
}

const advancedFilter = (userDetails) => {
    if (userDetails.role === 'superadmin') {
        const supAdminDetails = {
            email: userDetails.email,
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            departmentId: userDetails.departmentId,
            posteId: userDetails.posteId

        }
        const validationResult = userSearchValidation.supAdminValidation(supAdminDetails);
        if (validationResult instanceof Error) {
            throw validationResult;
        }
        else {
            supAdminDetails.roleId = 2;
            const elementsToSearch = {};
            for (const [cle, valeur] of Object.entries(supAdminDetails)) {

                if (valeur) {
                    elementsToSearch[cle] = valeur;
                }
            }

            if (Object.keys(elementsToSearch).length === 1 && elementsToSearch.hasOwnProperty('roleId')) {
                throw new Error("No Data provided")
            }
            else {
                return db.User.findAll({
                    where: elementsToSearch,
                    include: [
                        { model: db.Department },
                        { model: db.Role },
                        { model: db.Poste }
                    ]
                })
                    .then(emp => {
                        if (emp.length) {
                            const empDetails = emp.map(emp => {
                                return {
                                    firstName: emp.firstName,
                                    lastName: emp.lastName,
                                    id: emp.id,
                                    gender: emp.gender,
                                    status: emp.status,
                                    email: emp.email,
                                    image: emp.imageName,
                                    role: emp.Role.roleName,
                                    poste: emp.Poste.posteName,
                                    department: emp.Department.departmentName,
                                    departmentId: emp.Department.id,
                                    posteId: emp.Poste.id,
                                    telephone: emp.telephone
                                }
                            });
                            return empDetails;
                        }
                        else return emp;

                    })
            }
        }
    }
    else if (userDetails.role === 'admin') {
        const adminDetails = {
            email: userDetails.email,
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            roleId: userDetails.roleId,
            posteId: userDetails.posteId,
            teamId: userDetails.teamId

        }
        const adminOfDepartment = userDetails.userId;
        const validationResult = userSearchValidation.adminValidation(adminDetails);
        if (validationResult instanceof Error) {
            throw validationResult;
        }
        else {
            return db.User.findByPk(adminOfDepartment)
                .then(admin => {
                    adminDetails.departmentId = admin.departmentId;
                    const elementsToSearch = {}
                    for (const [cle, valeur] of Object.entries(adminDetails)) {

                        if (valeur) {
                            elementsToSearch[cle] = valeur;
                        }
                    }

                    if (Object.keys(elementsToSearch).length === 1 && adminDetails.hasOwnProperty('departmentId')) {
                        throw new Error("No Data provided")
                    }
                    else {
                        return db.User.findAll({
                            where: elementsToSearch,
                            include: [
                                { model: db.Department },
                                { model: db.Role },
                                { model: db.Poste }
                            ]
                        })
                            .then(emp => {
                                if (emp.length) {
                                    const empDetails = emp.map(emp => {
                                        return {
                                            firstName: emp.firstName,
                                            lastName: emp.lastName,
                                            id: emp.id,
                                            gender: emp.gender,
                                            status: emp.status,
                                            email: emp.email,
                                            image: emp.imageName,
                                            role: emp.Role.roleName,
                                            poste: emp.Poste.posteName,
                                            department: emp.Department.departmentName,
                                            departmentId: emp.Department.id,
                                            posteId: emp.Poste.id,
                                            telephone: emp.telephone
                                        }
                                    });
                                    return empDetails;
                                }
                                else return emp;

                            }
                            )
                    }
                })
                .catch(err => { throw err })

        }

    }
    else if (userDetails.role === 'manager') {
        const managerDetails = {
            email: userDetails.email,
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            posteId: userDetails.posteId,
        };
        const managerId = userDetails.userId;
        const validationResult = userSearchValidation.adminValidation(managerDetails);
        if (validationResult instanceof Error) {
            throw validationResult;
        }
        else {

            return db.User.findByPk(managerId)
                .then(manager => {
                    managerDetails.teamId = manager.teamId;
                    const elementsToSearch = {};
                    for (const [cle, valeur] of Object.entries(managerDetails)) {

                        if (valeur) {
                            elementsToSearch[cle] = valeur;
                        }
                    }
                    if (Object.keys(elementsToSearch).length === 1 && elementsToSearch.hasOwnProperty('teamId')) {
                        throw new Error("No Data provided")
                    }
                    else {
                        return db.User.findAll({
                            where: elementsToSearch,
                            include: [
                                { model: db.Department },
                                { model: db.Role },
                                { model: db.Poste }
                            ]
                        })
                            .then(emp => {
                                if (emp.length) {
                                    const empDetails = emp.map(emp => {
                                        return {
                                            firstName: emp.firstName,
                                            lastName: emp.lastName,
                                            id: emp.id,
                                            gender: emp.gender,
                                            status: emp.status,
                                            email: emp.email,
                                            image: emp.imageName,
                                            role: emp.Role.roleName,
                                            poste: emp.Poste.posteName,
                                            department: emp.Department.departmentName,
                                            departmentId: emp.Department.id,
                                            posteId: emp.Poste.id,
                                            telephone: emp.telephone
                                        }
                                    });
                                    return empDetails;
                                }
                                else return emp;

                            }
                            )
                    }
                })
                .catch(err => { throw err })
        }

    }
    else throw new Error('not Authorized')
}



module.exports = { addNewUser, generateRandomUserPassword, allUsers, allRoles, updateUser, deleteUser, advancedFilter };

