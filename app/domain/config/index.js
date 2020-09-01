'use strict';

const accessControlConfig = require('./access-control-config');
const featureFlagsConfig = require('./feature-flags-config');
const mongoConfig = require('./mongo-config');
const microserviceConfig = require('./microservice-config');

module.exports = {
  accessControlConfig,
  featureFlagsConfig,
  mongoConfig,
  microserviceConfig,
};
