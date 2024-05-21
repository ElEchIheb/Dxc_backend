const { Request } = require('../models');

module.exports = {
  getAllRequests: async () => {
    return await Request.findAll();
  },
  createRequest: async (requestData) => {
    return await Request.create(requestData);
  }
};
