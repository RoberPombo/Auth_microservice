'use strict';

const { errorMapper } = require('../../mappers');
const { registerUc } = require('../../../domain/use-cases/account');
const { flags } = require('../../../lib');

const registerController = async (request, reply) => {
  const { context } = request;
  try {
    const payload = request.body;

    const user = await registerUc(context, payload);

    if (flags.isFeatureEnabledForUser('notSendEmail', {
      permissions: context.auth.permissions,
      features: context.features,
    })) {
      reply.code(201).send(user);
    } else {
      reply.code(201).send('User created. Check your email');
    }
  } catch (error) {
    context.logger
      .info(`${error.name}: ${JSON.stringify(error.message)}`);

    throw errorMapper(error);
  }
};

module.exports = registerController;
