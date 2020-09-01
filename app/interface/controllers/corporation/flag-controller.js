'use strict';

const { errorMapper } = require('../../mappers');
const { flagUc } = require('../../../domain/use-cases/corporation');

const flagController = async (request, reply) => {
  const { context } = request;
  try {
    const { corpSlug } = request.params;

    const features = await flagUc(context, { corpSlug });

    reply.code(200).send(features);
  } catch (error) {
    context.logger
      .info(`${error.name}: ${JSON.stringify(error.message)}`);

    throw errorMapper(error);
  }
};

module.exports = flagController;
