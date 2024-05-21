const requestService = require('../services/requestService');

module.exports = {
  getAllRequests: async (req, res) => {
    try {
      const requests = await requestService.getAllRequests();
      res.status(200).json(requests);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  createRequest: async (req, res) => {
    try {
      const newRequest = await requestService.createRequest(req.body);
      res.status(201).json(newRequest);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};
