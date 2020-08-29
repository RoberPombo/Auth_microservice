const {
  loginController,
  registerController,
  activateController,
} = require('../../../interface/controllers/account');

const accountRouter = async (fastify, options) => {
  fastify.post('/login', {}, loginController);
  fastify.post('/', {}, registerController);
  fastify.get('/activate', {}, activateController);
};

module.exports = accountRouter;
