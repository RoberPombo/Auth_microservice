'use strict';

const isAllowedTo = require('./access-control-entity');
const flags = require('./feature-flags-entity');

module.exports = {
  isAllowedTo,
  flags,
};
