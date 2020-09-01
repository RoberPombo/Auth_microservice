'use strict';

const fflip = require('fflip');

const { featureFlagsConfig } = require('../config');

fflip.config(featureFlagsConfig);

module.exports = fflip;
