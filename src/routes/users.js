const userController = require("../controllers/userController")
const express=require('express')
const router = express.Router();
const image=require('../middleware/image');
const path = require('path');

const uploadsPath = path.join(__dirname, '../../public/uploads');
router.use('/uploads', express.static(uploadsPath));
router.post("/createUser",image.upload.single('file'),userController.register)
router.get('/',userController.getAllUsers);
router.put('/putUser/:id',userController.updateUser);
router.put('/delUser/:id',userController.deleteUser);
router.get('/roles',userController.getRoles);
router.get('/advancedSearch',userController.getAdvancedFilter)

module.exports = router;