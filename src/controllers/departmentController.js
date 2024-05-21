const departmentService = require('../services/departmentService');

const getAllDepartments = (req, res) => {
    departmentService.allDepartments()
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json({ msg: err.message || "An unexpected error occurred" }))
}

const getOneDepartment = (req, res) => {
    const { id } = req.params;
    departmentService.oneDepartment(id)
        .then(result => res.status(200).json(result))
        .catch(err => res.status(400).json({ msg: err.message || "An unexpected error occurred" }))

}

const addNewDepartment = (req, res) => {
    const departmentDetails={
        departmentName:req.body.departmentName
    }
    departmentService.createDepartment(departmentDetails)
        .then(result => res.status(201).json({
            msg: "department added successfully",
            data:result
        }))
        .catch(err => res.status(400).json({ msg: err }))

}

const updateDepartment = (req, res) => {
    const deptDetails = {
        departmentId: req.params.id,
        newDepartmentName: req.body.departmentName,
        NewAdminId:req.body.adminId
    }

    departmentService.updateDepartment(deptDetails)
        .then(result => res.status(200).json({ msg: result }))
        .catch(err => res.status(400).json({ msg: err.message || "An unexpected error occurred" }))
}

//ist of collaborators for update
const getAllDepartmentCollaborators = (req, res) => {
    const userDetails = {
      departmentId: req.params.departmentId,
      }
      departmentService.DepartmentListOfCollaborators(userDetails)
      .then(result => res.status(200).json(result))
      .catch(err => res.status(400).json({ msg: err.message || "An unexpected error occurred" }))
  }

const updateDepartmentWithAdmin=(req,res)=>{
    const deptDetails={
      adminData:{
        firstName: req.body.firstname,
        lastName: req.body.lastName,
        gender: req.body.gender,
        telephone: req.body.telephone,
        email: req.body.email,
        password: req.body.password,
        posteId: req.posteId,
        departmentId: req.params.id,
        imageName: req.file.fileName
       
    }  ,
    departmentData:{
        departmentId: req.params.id,
        departmentName:req.body.departmentName, 
    },
    imageMimeCheck: req.fileValidationError
    }
    departmentService.updateDepartmentWithAdmin(deptDetails)
    .then(result=>res.status(200).json(result))
    .catch(err=>res.status(400).json({ msg: err.message || "An unexpected error occurred" }))

}

const deleteDepartment = (req, res) => {
    const deptDetails = {
        status: req.body.status,
        departmentId:req.params.id
    }
    departmentService.deleteDepartment(deptDetails)
        .then(result => res.status(200).json({ msg: result }))
        .catch(err => res.status(400).json({ msg: err.message || "An unexpected error occurred" }))
}

const getAllActiveDepartments = (req, res) => {
    departmentService.allActiveDepartments()
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json({ msg: err.message || "An unexpected error occurred" }))
}



module.exports = { getAllDepartments, getOneDepartment, addNewDepartment, updateDepartment, deleteDepartment, getAllActiveDepartments, updateDepartmentWithAdmin,getAllDepartmentCollaborators }
