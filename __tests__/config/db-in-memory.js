'use strict';

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const { mongoConfig } = require('../../app/domain/config');

const mongoServer = new MongoMemoryServer();

const clear = async () => {
  const { collections } = mongoose.connection;

  await Object.values(collections).forEach(async (collection) => collection.deleteMany());
};

const connect = async () => {
  const mongoUri = await mongoServer.getConnectionString();

  await mongoose.connect(mongoUri, mongoConfig);
};

const disconnect = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();

  await mongoServer.stop();
};

module.exports = {
  clear,
  connect,
  disconnect,
};
