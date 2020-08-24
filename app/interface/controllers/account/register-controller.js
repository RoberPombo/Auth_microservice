'use strict';

const { registerUc } = require('../../../domain/use-cases/account');

const registerController = async (request, reply) => {
  const { context } = request;
  try {
    const {
      email,
      password,
    } = request.body;

    const user = await registerUc(context, email, password);

    reply.send(user);
  } catch (error) {
    context.logger.error(error.message);

    throw new Error(error.message);
  }
};

module.exports = registerController;
