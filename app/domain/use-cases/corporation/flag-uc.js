'use strict';

const { featureFlagsConfig } = require('../../config');
const { isAllowedTo } = require('../../entity');

/**
 * Returns a list of all feature flags in the microservice.
 * Only testCORP users
 * @param {Object} context context object: correlationId, logger, ...
 * @param {Object} context.auth user authorization
 * @param {Object} scope corporation and application
 * @param {String} scope.corpSlug corporation slug
 * @returns {Promise<Array<Object>>} features array
 * @throws UnauthorizedError
 */
const flagUc = async (context, scope) => {
  const { corpSlug } = scope;
  const { permissions } = context.auth;
  await isAllowedTo(permissions, {
    action: 'read',
    resource: 'feature-flag',
    corpSlug,
  });

  const { features } = featureFlagsConfig;

  return features;
};

module.exports = flagUc;
