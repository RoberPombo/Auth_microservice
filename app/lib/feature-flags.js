'use strict';

const fflip = require('fflip');

const { featureFlagsConfig } = require('../domain/config');

fflip.config(featureFlagsConfig);

module.exports = fflip;
