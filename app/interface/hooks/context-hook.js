const {
  v4: uuidV4,
  validate: uuidValidate,
} = require('uuid');

const { logger } = require('../../lib');

const { APP_NAME } = process.env;

/**
 * Check if correlation Id header exist
 * @param {Object} headers
 * @returns {Boolean | String}
 */
const getRequestHeaders = (headers) => {
  const { 'x-correlation-id': correlationId } = headers;

  return uuidValidate(correlationId) && correlationId;
};

/**
 * Adds context object with correlation Id to the request object.
 * @param {Object} request
 * @param {Object} reply
 * @param {Function} done
 */
const contextHook = (request, reply, done) => {
  try {
    const { headers } = request;
    const correlationId = getRequestHeaders(headers) || uuidV4();

    request.context = {
      correlationId,
      microservice: APP_NAME,
      init: Date.now(),
      logger,
    };
  } catch (error) {
    done(error);
  }

  done();
};

module.exports = contextHook;
