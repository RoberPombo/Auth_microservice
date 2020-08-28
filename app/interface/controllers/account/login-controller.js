'use strict';

const { errorMapper } = require('../../mappers');
const { loginUC } = require('../../../domain/use-cases/account');

const loginController = async (request, reply) => {
  const { context } = request;
  try {
    const payload = request.body || {};

    const login = await loginUC(context, payload);

    reply.send(login);
  } catch (error) {
    context.logger
      .info(`${error.name}: ${JSON.stringify(error.message)}`);

    throw errorMapper(error);
  }
};

module.exports = loginController;
