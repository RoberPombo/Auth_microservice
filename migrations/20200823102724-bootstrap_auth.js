'use strict';

require('dotenv').config();
const bcrypt = require('bcrypt');
const { v4: uuidV4 } = require('uuid');

const {
  SUPERADMIN_EMAIL,
  SUPERADMIN_PASSWORD,
} = process.env;

const up = async (db) => db.collection('users').insertOne({
  uuid: uuidV4(),
  email: SUPERADMIN_EMAIL,
  password: await bcrypt.hash(SUPERADMIN_PASSWORD, 10),
  activatedAt: Date.now(),
});

const down = async (db) => db.collection('users').deleteOne({
  email: SUPERADMIN_EMAIL,
});

module.exports = {
  up,
  down,
};
