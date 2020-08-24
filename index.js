'use strict';

require('dotenv').config();

const { mongo } = require('./app/infrastructure/database');
const { httpServer } = require('./app/infrastructure/http-server');
const { logger } = require('./app/lib');

const { AUTH_HTTP_PORT } = process.env;

const init = async () => {
  try {
    await mongo.connect();
    await httpServer.init(AUTH_HTTP_PORT);
  } catch (error) {
    logger.fatal(error);
    process.exit(1);
  }
};

init();

process.on('uncaughtException', (error) => {
  logger.fatal(`uncaughtException: ${error}`);
  process.exit(1);
});
process.on('unhandledRejection', (error) => {
  logger.fatal(`unhandledRejection: ${error}`);
  process.exit(1);
});
