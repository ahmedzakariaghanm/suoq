const productController = require('../controllers/product-controller');
const shared = require('./shared/shared')

module.exports = (app) => {
  app.get('/product',shared.isAuthorized, productController.getProducts);
}

