const profileController = require("../controllers/profileController")
const express=require('express')
const router = express.Router();
const image=require('../middleware/image')

router.get('/',profileController.getProfile);
router.put('/changePassword',profileController.changePassword);
router.put('/putProfile',image.upload.single('file'),profileController.updateProfile)


module.exports = router;