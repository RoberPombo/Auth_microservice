'use strict';

require('dotenv').config();

const {
  MONGO_CONNECTION_STING,
  MONGO_DATABASE_NAME,
} = process.env;

const config = {
  mongodb: {
    url: MONGO_CONNECTION_STING,
    databaseName: MONGO_DATABASE_NAME,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.js',
};

module.exports = config;
