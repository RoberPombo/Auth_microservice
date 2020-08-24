const {
  loginController,
  registerController,
} = require('../../../interface/controllers/account');

const accountRouter = async (fastify, options) => {
  fastify.post('/login', {}, loginController);
  fastify.post('/', {}, registerController);
};

module.exports = accountRouter;
