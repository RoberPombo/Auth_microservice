const {
  v4: uuidV4,
  validate: uuidValidate,
} = require('uuid');

const { logger } = require('../../lib');

const { APP_NAME } = process.env;

/**
 * Check if request Id header exist
 * @param {Object} headers
 * @returns {Boolean | String}
 */
const getRequestHeaders = (headers) => {
  const { 'x-request-id': requestId } = headers;

  return uuidValidate(requestId) && requestId;
};

/**
 * Adds context object with request Id to the request object.
 * @param {Object} request
 * @param {Object} reply
 * @param {Function} done
 */
const contextHook = (request, reply, done) => {
  try {
    const { headers } = request;
    const requestId = getRequestHeaders(headers) || uuidV4();

    request.context = {
      requestId,
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
