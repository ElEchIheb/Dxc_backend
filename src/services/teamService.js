const db = require('../models');
const teamValidation = require('../joiValidation/teamValidation');


const createTeam = (newTeam) => {
  const teamDetails = {
    teamName: newTeam.teamName
  }
  const validationResult = teamValidation.validation(teamDetails);
  if (validationResult instanceof Error) {
    throw validationResult;
  } else {
    return db.User.findOne({ where: { id: newTeam.adminId } })
      .then(admin => {
        if (!admin) {
          throw new Error('Admin user not found');
        }
        return db.Team.create({
          teamName: newTeam.teamName,
          departmentId: admin.departmentId,
        })

      });
  }
};


const allTeams = (adminId) => {

  return db.User.findOne({ where: { id: adminId } })
    .then(admin => {
      return db.Team.findAll({
        where: { departmentId: admin.departmentId },
        include: [{
          model: db.User,
          required: false,
          include: [{
            model: db.Role
          }]
        }]
      })
        .then(teams => {
          if (teams.length) {
            const teamDetails = teams.map(team => {
              const activeUsers = team.Users.filter(user => user.status);
              const teamManager = team.Users.find(user => user.Role.roleName === 'manager');
              const managerName = teamManager ? `${teamManager.firstName} ${teamManager.lastName}` : 'No Manager';
              if (!teamManager) {
                return {
                  teamId: team.id,
                  teamName: team.teamName,
                  status: team.status,
                  teamManager: managerName,
                  numberOfMembers: activeUsers.length
                };
              }
              else {
                return {
                  teamId: team.id,
                  teamName: team.teamName,
                  status: team.status,
                  teamManager: managerName,
                  managerId: teamManager.id,
                  numberOfMembers: activeUsers.length
                };
              }

            });
            return teamDetails;
          }
          else return teams;


        })

        .catch(err => {
          throw err;
        });
    })

}

const deleteTeam = (teamDetails) => {
  return db.Team.findOne({
    where: {
      id: teamDetails.teamId
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
    .then(team => {
      if (team) {
        const activeUsers = team.Users.filter(user => user.status);
        if (activeUsers.length && teamDetails.status == false) {
          throw new Error("Impossible to delete this Team , it contains employees . ")
        }
        else if (!activeUsers.length && teamDetails.status == false) {
          team.status = teamDetails.status;
          return team.save();
        }
        else {
          team.status = teamDetails.status;
          return team.save();
        }
      }
      else return team
    })
    .then(statusChange => {
      if (statusChange) {

        if (statusChange.status) {
          return "Team restored successfully";
        } else {
          return "Team deleted successfully";
        }

      }
      else throw new Error("Team not found ");

    })

    .catch(err => {
      throw err;
    });
}


const allActiveTeams = (adminId) => {
  return db.User.findByPk(adminId)
    .then(admin => {
      return db.Team.findAll({
        where: {
          status: true,
          departmentId: admin.departmentId
        },
        include: [{
          model: db.User,
          required: false,
        }]
      })
        .then(teams => {
          const teamsWithManager = teams.filter(team => team.Users.length)
          const teamsWithoutManager = teams.filter(team => !team.Users.length)
          return {
            listTeamsWithManager: teamsWithManager,
            listTeamsWithoutManager: teamsWithoutManager
          }
        })
    })
    .catch(err => { throw err })
}




const updateTeam = (teamDetails) => {
  const {
    newTeamName,
    teamId,
    newManagerId,
    adminId,
    teamData
  } = teamDetails;

  const validationResult = teamValidation.validation({ teamName: newTeamName });
  if (validationResult instanceof Error) {
    throw validationResult;
  } else {
    return db.Team.findByPk(teamId)
      .then(team => {
        if (!team) {
          throw new Error("team not found");
        } else {
          return db.User.findByPk(adminId)
            .then(admin => {
              return db.User.findAll({
                where: {
                  departmentId: admin.departmentId,
                  status: true
                }
              })
                .then(users => {
                  let newManager = users.find(emp => emp.id == newManagerId);
                  let oldManager = users.find(manager => manager.roleId == 3 && manager.teamId == teamId);
                  let checkMangerinCollaboratorsList=teamData.find(emp=>emp.id==newManagerId);
                  if(checkMangerinCollaboratorsList){teamData = teamData.filter(emp => emp.id !== newManagerId);}
                  if (newManager && oldManager && newManager.id !== oldManager.id && teamData.length) {
                    newManager.roleId = 3;
                    oldManager.roleId = 4;
                    newManager.teamId = oldManager.teamId;
                    oldManager.teamId = null;
                    team.teamName = newTeamName;
                    let listToChange = users.filter(emp => !emp.teamId || emp.teamId == teamId);
                    let listToaddToTeam = [];
                    let listToremoveTeam = [];
                    for (let emp of listToChange) {

                      if (teamData.some(obj => obj.id === emp.id)) {
                        listToaddToTeam.push(emp)
                      } else {
                        listToremoveTeam.push(emp)
                      }
                    }
                    const addNewTeamates=listToaddToTeam.map(emp=>{
                      emp.teamId=teamId;
                      return emp.save()
                    })
                    const collabsNotInTeam=listToremoveTeam.map(emp=>{
                      emp.teamId=null;
                      return emp.save()
                    })
                    return Promise.all([oldManager.save(), newManager.save(), team.save(), addNewTeamates, collabsNotInTeam])
                      .then(() => "Team updated successfully");
                  }
                  else if (newManager && oldManager && newManager.id == oldManager.id && teamData.length) {
                    team.teamName = newTeamName;
                    const listToChange = users.filter(emp => !emp.teamId || emp.teamId == teamId);
                    const listToaddToTeam = [];
                    const listToremoveTeam = [];
                    for (let emp of listToChange) {

                      if (teamData.some(obj => obj.id === emp.id)) {
                        listToaddToTeam.push(emp)
                      } else {
                        listToremoveTeam.push(emp)
                      }
                    }
                    const addNewTeamates=listToaddToTeam.map(emp=>{
                      emp.teamId=teamId;
                      return emp.save()
                    })
                    const collabsNotInTeam=listToremoveTeam.map(emp=>{
                      emp.teamId=null;
                      return emp.save()
                    })
                    return Promise.all([team.save(), addNewTeamates, collabsNotInTeam])
                      .then(() => "Team updated successfully");
                  }
                  else {
                    team.teamName = newTeamName;
                    return team.save()
                      .then(() => "Team updated successfully");
                  }
                });
            });
        }
      });
  }
};



//hedhiya zeyda 
const allCollaborators = (adminId) => {
  return db.User.findByPk(adminId)
    .then(admin => {
      return db.User.findAll({
        where: {
          departmentId: admin.departmentId,
          status: true,
          roleId: 4
        }
      })
        .then(collaborators => {
          const collaboratorsWithoutTeam = collaborators.filter(emp => !emp.teamId);
          return collaboratorsWithoutTeam;
        })
    })
}

const getToUpdateCollaborators = (teamDetails) => {
  const { teamId, adminId } = teamDetails
  return db.User.findByPk(adminId)
    .then(admin => {
      return db.User.findAll({
        where: {
          departmentId: admin.departmentId,
          status: true,
          roleId: 4
        }
      })
        .then(collaborators => {
          const collaboratorsWithoutTeamOrInSameTeam = collaborators.filter(emp => !emp.teamId || emp.teamId == teamId);
          const filtredData = collaboratorsWithoutTeamOrInSameTeam.map(emp => {
            return {
              id: emp.id,
              fullName: `${emp.firstName} ${emp.lastName}`,
              teamId: emp.teamId

            }
          })
          return filtredData;

        })
        .catch(err => { throw err })
    })
    .catch(err => { throw err })
}



module.exports = { createTeam, allTeams, deleteTeam, allActiveTeams, updateTeam, allCollaborators, getToUpdateCollaborators }

