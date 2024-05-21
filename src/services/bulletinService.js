const db = require('../models');
const bulletinValidation = require('../joiValidation/bulletinValidation');

const allBulletins = () => {
  return db.bulletin.findAll()
    .then(bulletins => {
      return bulletins;
    })
    .catch(err => {
      throw err;
    });
}

const oneBulletin = (id) => {
  return db.bulletin.findByPk(id)
    .then(bulletin => {
      if (bulletin) {
        return bulletin;
      } else {
        throw new Error("Bulletin not found");
      }
    })
    .catch(err => {
      throw err;
    });
}

const createBulletin = (newBulletin) => {
  const validationResult = bulletinValidation.validation(newBulletin);
  if (validationResult instanceof Error) {
    throw validationResult;
  } else {
    return db.bulletin.create(newBulletin)
      .then(createdBulletin => {
        return createdBulletin;
      })
      .catch(err => {
        throw err;
      });
  }
};

const updateBulletin = (bulletinDetails) => {
  const { id, newData } = bulletinDetails;

  return db.bulletin.findByPk(id)
    .then(bulletin => {
      if (!bulletin) {
        throw new Error("Bulletin not found");
      } else {
        return bulletin.update(newData)
          .then(updatedBulletin => {
            return "Bulletin updated successfully"; // Message de succès
          })
          .catch(err => {
            throw err;
          });
      }
    })
    .catch(err => {
      throw err;
    });
};

const deleteBulletin = (id) => {
  return db.bulletin.findByPk(id)
    .then(bulletin => {
      if (!bulletin) {
        throw new Error("Bulletin not found");
      } else {
        return bulletin.destroy()
          .then(() => {
            return "Bulletin deleted successfully";
          })
          .catch(err => {
            throw err;
          });
      }
    })
    .catch(err => {
      throw err;
    });
};

module.exports = { allBulletins, oneBulletin, createBulletin, updateBulletin, deleteBulletin };
