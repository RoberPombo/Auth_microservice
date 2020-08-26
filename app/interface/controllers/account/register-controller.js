'use strict';

const { errorMapper } = require('../../mappers');
const { registerUc } = require('../../../domain/use-cases/account');

const registerController = async (request, reply) => {
  const { context } = request;
  try {
    const {
      email,
      password,
    } = request.body;

    const user = await registerUc(context, email, password);

    reply.code(201).send(user);
  } catch (error) {
    context.logger
      .error(`${error.name}: ${JSON.stringify(error.message)}`);

    throw errorMapper(error);
  }
};

module.exports = registerController;
