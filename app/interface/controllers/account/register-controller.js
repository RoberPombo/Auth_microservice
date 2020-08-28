'use strict';

const { errorMapper } = require('../../mappers');
const { registerUc } = require('../../../domain/use-cases/account');

const registerController = async (request, reply) => {
  const { context } = request;
  try {
    const payload = request.body;

    const user = await registerUc(context, payload);

    reply.code(201).send(user);
  } catch (error) {
    context.logger
      .info(`${error.name}: ${JSON.stringify(error.message)}`);

    throw errorMapper(error);
  }
};

module.exports = registerController;
