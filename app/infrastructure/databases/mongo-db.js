'use strict';

const mongoose = require('mongoose');

const { mongoConfig } = require('../../domain/config');
const { logger } = require('../../lib');

const { MONGO_CONNECTION_STING } = process.env;

const connect = async (connectionString = MONGO_CONNECTION_STING) => mongoose
  .connect(connectionString, mongoConfig);

const disconnect = async () => mongoose
  .disconnect();

mongoose.connection
  .on('connected', () => logger
    .info('Connected to MongoDB'))
  .on('disconnected', () => logger
    .info('Closed connection to MongoDB'))
  .on('reconnect', () => logger
    .info('Reconnecting to MongoDB...'));

module.exports = {
  connect,
  disconnect,
};
