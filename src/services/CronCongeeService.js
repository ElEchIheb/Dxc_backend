const cron = require('node-cron');
const db = require('../models');

function startScheduledTasks() {
    
    cron.schedule('0 0 1 * *', () => {
        db.User.findAll({where:{status:true}})
            .then(users => {
                const leaveBalanceAddition = users.map(user => {
                    return db.Poste.findByPk(user.posteId)
                        .then(poste => {
                            if (poste) {
                                user.leaveBalance += poste.leave;
                                return user.save();
                            }
                        });
                });
                return Promise.all(leaveBalanceAddition);
            })
            .catch(err => {
                console.error( err);
            });
    });

    
    cron.schedule('0 0 1 1 *', () => {
        db.User.findAll({where:{status:true}})
            .then(users => {
                const sickLeaveBalanceAddition = users.map(user => {
                    return db.Poste.findByPk(user.posteId)
                        .then(poste => {
                            if (poste) {
                                user.sickLeaveBalance += poste.sickLeave; 
                                return user.save();
                            }
                        });
                });
                return Promise.all(sickLeaveBalanceAddition);
            })
            .catch(err => {
                console.error( err);
            });
    });
}

module.exports = { startScheduledTasks };
