const teamController =require('../controllers/teamController')
const express=require('express');
const router = express.Router();

router.post('/createTeam', teamController.addNewTeam);
router.get('/',teamController.getAllTeams);
router.get('/activeTeams',teamController.getActiveTeams);
router.put('/putTeam/:id', teamController.updateTeam);
router.put('/delTeam/:id', teamController.deleteTeam);
router.get('/listUpdate/:id',teamController.getCollaboratorsForUpdate)
module.exports=router;