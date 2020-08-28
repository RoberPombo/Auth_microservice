'use strict';

require('dotenv').config();

const { mongo } = require('./app/infrastructure/databases');
const { httpServer } = require('./app/infrastructure/http-server');
const { logger } = require('./app/lib');

const { AUTH_HTTP_PORT } = process.env;

const init = async () => {
  try {
    await mongo.connect();
    await httpServer.init(AUTH_HTTP_PORT);
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};

init();

process.on('uncaughtException', (error) => {
  logger.error(`uncaughtException: ${error}`);
  process.exit(1);
});
process.on('unhandledRejection', (error) => {
  logger.error(`unhandledRejection: ${error}`);
  process.exit(1);
});
