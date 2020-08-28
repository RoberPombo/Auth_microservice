'use strict';

const { fastify } = require('fastify');
const cors = require('fastify-cors').default;
const helmet = require('fastify-helmet');

const {
  accountRouter,
} = require('./routes');
const { contextHook } = require('../../interface/hooks');
const { logger } = require('../../lib');

const {
  APP_NAME = 'auth',
  CORS_ORIGINS_ALLOWED = '',
} = process.env;

const BASE_URL = `api/${APP_NAME}`;

const server = fastify({ logger });

server.register(helmet);
server.register(cors, {
  origin: CORS_ORIGINS_ALLOWED.split(''),
});
server.decorateRequest('context', {});
server.addHook('onRequest', contextHook);
server.register(accountRouter, {
  prefix: `${BASE_URL}/account`,
});

server.setErrorHandler((error, request, reply) => {
  // @ts-ignore
  const { status, headers, body } = error;

  reply
    .code(status)
    .headers(headers)
    .send(body);
});

const init = async (port) => {
  await server.listen(port, '0.0.0.0', (err) => {
    if (err) {
      logger.fatal(err);
      process.exit(1);
    }
  });
};

module.exports = {
  init,
  server,
};
