'use strict';

const { loginUC } = require('../../../domain/use-cases/account');

const loginController = async (request, reply) => {
  const { context } = request;
  try {
    const {
      email,
      password,
    } = request.body || {};

    const login = await loginUC(context, email, password);

    reply.send(login);
  } catch (error) {
    context.logger.error(error.message);

    throw new Error(error.name);
  }
};

module.exports = loginController;
