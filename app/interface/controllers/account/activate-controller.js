'use strict';

const { errorMapper } = require('../../mappers');
const { activateUC } = require('../../../domain/use-cases/account');

const activateController = async (request, reply) => {
  const { context } = request;
  try {
    const queryParams = request.query;

    await activateUC(context, queryParams);

    reply.code(204);
  } catch (error) {
    context.logger
      .info(`${error.name}: ${JSON.stringify(error.message)}`);

    throw errorMapper(error);
  }
};

module.exports = activateController;
