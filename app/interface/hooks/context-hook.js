'use strict';

const {
  v4: uuidV4,
  validate: uuidValidate,
} = require('uuid');

const { logger } = require('../../lib');

const { APP_NAME } = process.env;

/**
 * Check if request id header exist.
 * If not exist, generate a new uuid.
 * @param {Object} headers
 * @returns {String}
 */
const getRequestHeaders = (headers) => {
  const { 'x-request-id': requestId } = headers;

  return uuidValidate(requestId)
    ? requestId
    : uuidV4();
};

/**
 * Check if features off header exist.
 * This header is a comma-separated string with the ids of the features
 * that it want to be disabled in this request.
 * @param {Object} headers
 * @returns {String}
 */
const getFeaturesOffHeaders = (headers) => {
  const { 'x-features-off': features = '' } = headers;

  return features;
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
    const requestId = getRequestHeaders(headers);
    const features = getFeaturesOffHeaders(headers);

    request.context = {
      requestId,
      microservice: APP_NAME,
      init: Date.now(),
      logger,
      features,
    };
  } catch (error) {
    done(error);
  }

  done();
};

module.exports = contextHook;
