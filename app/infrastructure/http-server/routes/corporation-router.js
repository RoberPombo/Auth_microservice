'use strict';

const {
  flagController,
} = require('../../../interface/controllers/corporation');

const corporationRouter = async (fastify, options) => {
  fastify.get('/:corpSlug/flags', {}, flagController);
};

module.exports = corporationRouter;
