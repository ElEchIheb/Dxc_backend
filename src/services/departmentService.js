const db = require('../models');
const departmentValidation = require('../joiValidation/departmentValidation')
const departmentWithAdminValidation = require('../joiValidation/dept-user-validation');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

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

const allDepartments = () => {

  return db.Department.findAll({
    include: [{
      model: db.User,
      required: false,
      include: [{
        model: db.Role
      }]
    }]
  })

    .then(departments => {


      if (departments.length) {
        const departmentDetails = departments.map(dept => {
          const activeUsers = dept.Users.filter(user => user.status);
          const departmentAdmin = dept.Users.find(user => user.Role.roleName === 'admin');
          const adminName = departmentAdmin ? `${departmentAdmin.firstName} ${departmentAdmin.lastName}` : 'No Admin';
          if(!departmentAdmin){
            return {
              departmentId: dept.id,
              departmentName: dept.departmentName,
              status: dept.status,
              departmentAdmin: adminName,
              numberOfEmployees: activeUsers.length,
  
            };
          }
          
          else {
            return {
              departmentId: dept.id,
              departmentName: dept.departmentName,
              status: dept.status,
              departmentAdmin: adminName,
              adminId:departmentAdmin.id,
              numberOfEmployees: activeUsers.length,
  
            };
          }

        });

        return departmentDetails;
      }
      else return departments;


    })

    .catch(err => {
      throw err;
    });
}

const oneDepartment = (id) => {

  return db.Department.findOne({
    where: { id },
    include: [{
      model: db.User,
      required: false,
      include: [{
        model: db.Role
      }]
    }]
  })

    .then(department => {

      if (department) {

        const activeUsers = department.Users.filter(user => user.status);
        const departmentAdmin = department.Users.find(user => user.Role.roleName === 'admin')
        const adminName = departmentAdmin ? `${departmentAdmin.firstName} ${departmentAdmin.lastName}` : 'No Admin';

        return {
          departmentId: department.id,
          departmentName: department.departmentName,
          status: department.status,
          departmentAdmin: adminName,
          numberOfEmployees: activeUsers.length

        }
      }
      else throw new Error("Department not found");

    }
    )
    .catch(err => { throw err })
}


const createDepartment = (newDepartment) => {
  const validationResult = departmentValidation.validation(newDepartment);
  if (validationResult instanceof Error) {
    throw validationResult;
  } else {
    return db.Department.create({ departmentName: newDepartment.departmentName })
      .then(newDep => newDep)
      .catch(err => { throw err });
  }
};
const updateDepartment = (departmentDetails) => {
  const {
    newDepartmentName,
    departmentId,
    newAdminId
  } = departmentDetails;

  const validationResult = departmentValidation.validation({ departmentName: newDepartmentName });
  if (validationResult instanceof Error) {
    throw validationResult;
  }

  return db.Department.findOne({ where: { id: departmentId } })
    .then(department => {
      if (!department) {
        throw new Error("Department not found");
      }

      else {
        return db.User.findAll({ where: { departmentId: departmentId } })
          .then(users => {
            if(newAdminId){
            const newAdmin = users.find(emp => emp.id == newAdminId);
            const oldAdmin = users.find(admin => admin.roleId === 2);

            if (newAdmin && oldAdmin && newAdmin.id !== oldAdmin.id) {
              newAdmin.roleId = 2;
              oldAdmin.roleId = 4;
              if(newAdmin.teamId) newAdmin.teamId=null;
              department.departmentName = newDepartmentName;
              return Promise.all([oldAdmin.save(), newAdmin.save(), department.save()])
                .then(() => "Department updated successfully")
                .catch(err=>{throw err})
            } else {
              department.departmentName = newDepartmentName;
              return department.save()
                .then(() => "Department updated successfully")
                .catch(err=>{throw err})
            }
          }
          else {
            {
              department.departmentName = newDepartmentName;
              return department.save()
                .then(() => "Department updated successfully")
                .catch(err=>{throw err})
            }
          }
          });
      }
    })
    .catch(err => {
      throw err;
    });
};

const updateDepartmentWithAdmin = (departmentDetails) => {
  const validationResult = departmentWithAdminValidation.validation(departmentDetails);
  if (validationResult instanceof Error) {

    throw validationResult;
  }
  else {
    return db.Department.findByPk(departmentDetails.departmentData.departmentId)
      .then(department => {
        if (!department) {
          throw new Error("Department not found");
        }
        else {
          return db.User.findOne({ where: { email: departmentDetails.data.email } })
            .then(existingUser => {
              if (existingUser) {
                throw new Error("Email is already in use");
              }
              else if (departmentDetails.imageMimeCheck) throw new Error({ error: departmentDetails.imageMimeCheck })
              else return bcrypt.hash(departmentDetails.adminData.password, 10)
                .then(hashedPassword => {
                  const pass = departmentDetails.adminData.password;
                  departmentDetails.adminData.password = hashedPassword;
                  departmentDetails.adminData.roleId = 2;
                  return db.User.findOne({
                    where: {
                      departmentId: departmentDetails.departmentData.departmentId,
                      roleId: 2
                    }
                  })
                    .then(oldAdmin => {
                      if (oldAdmin) {
                        oldAdmin.roleId = 4;
                        department.departmentName = departmentDetails.departmentData.departmentName;
                        return Promise.all([oldAdmin.save(), db.User.create(departmentDetails.adminData), department.save()])
                          .then(update => {
                            return transporter.sendMail(mailOptions(departmentDetails.adminData.email, pass))
                              .then(() => ({
                                msg: 'Admin account created successfully and Department updated successfully',
                                data: update
                              }))
                              .catch(error => { throw error });
                          })
                          .catch(err => { throw err })
                      }
                      else {
                        department.departmentName = departmentDetails.departmentData.departmentName;
                        return Promise.all([db.User.create(departmentDetails.adminData), department.save()])
                          .then(update => {
                            return transporter.sendMail(mailOptions(departmentDetails.adminData.email, pass))
                              .then(() => ({
                                msg: 'Admin account created successfully and Department updated successfully',
                                data: update
                              }))
                              .catch(error => { throw error });
                          })
                          .catch(err => { throw err })
                      }
                    })
                    .catch(err => { throw err })

                }
                )
                .catch(err => { throw err })
            })
            .catch(err => { throw err })
        }
      })
      .catch(err => { throw err })
  }

}



const deleteDepartment = (departmentDetails) => {
  return db.Department.findOne({
    where: {
      id: departmentDetails.departmentId
    },
    include: [{
      model: db.User,
      required: false,
      include: [{
        model: db.Role
      }]
    }]
  }
  )
    .then(department => {
      if (department) {
        const activeUsers = department.Users.filter(user => user.status);
        if (activeUsers.length && departmentDetails.status == false) {
          throw new Error("Impossible to delete this Department , it contains employees . ")
        }
        else if (!activeUsers.length && departmentDetails.status == false) {
          department.status = departmentDetails.status;
          return department.save();
        }
        else {
          department.status = departmentDetails.status;
          return department.save();
        }
      }
      else return department
    })
    .then(statusChange => {
      if (statusChange) {

        if (statusChange.status) {
          return "Department restored successfully";
        } else {
          return "Department deleted successfully";
        }

      }
      else throw new Error("department not found ");

    })

    .catch(err => {
      throw err;
    });


}

const DepartmentListOfCollaborators = (userDetails) => {
  return db.User.findAll({
    where: {
      departmentId: userDetails.departmentId,
      roleId: 4,
      status:true
    }
  })
}


const allActiveDepartments = () => {

  return db.Department.findAll({
    where: { status: true },
    include: [{
      model: db.User,
      required: false,
      include: [{
        model: db.Role
      }]
    }]
  })

    .then(departments => {
      if (departments.length) {

        let departmentsWithoutAdmin = [];
        let departmentsWithAdmin = [];

        for (let dept of departments) {
          if (dept.Users.length) {
            const checkStatus=dept.Users.filter(emp=>emp.status);
            if(checkStatus.length){
              departmentsWithAdmin.push(dept)
            }
            else departmentsWithoutAdmin.push(dept)
          }
          else departmentsWithoutAdmin.push(dept)
        }
        return departmentsWithoutAdmin;
      }
      else return departments;
    })

    .catch(err => {

      throw err;
    });
}


module.exports = { allDepartments, oneDepartment, createDepartment, updateDepartment, deleteDepartment, allActiveDepartments, updateDepartmentWithAdmin, DepartmentListOfCollaborators };
