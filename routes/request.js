const requestController = require('../controllers/request-controller');
const shared = require('./shared/shared')

module.exports = (app) => {
  app.post('/request',shared.isAuthorized, requestController.createRequest);
  app.get('/request',shared.isAuthorized, requestController.getRequests);
  app.put('/request/:requestId/deliver',shared.isAuthorized, requestController.deliverRequest);
  app.delete('/request/:requestId',shared.isAuthorized, requestController.cancelRequest);
}

