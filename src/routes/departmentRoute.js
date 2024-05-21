const express = require('express')
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const image=require('../middleware/image')

router.get('/', departmentController.getAllDepartments);
router.get('/search-department/:id', departmentController.getOneDepartment);
router.post('/createDepartment', departmentController.addNewDepartment);
router.put('/putDeptAdmin/:id',image.upload.single('file'),departmentController.updateDepartmentWithAdmin)
router.put('/putDept/:id', departmentController.updateDepartment);
router.put('/delDept/:id', departmentController.deleteDepartment);
router.get('/activeDepartments', departmentController.getAllActiveDepartments);
router.get('/departmentCollaborators/:id',departmentController.getAllDepartmentCollaborators)
module.exports = router;