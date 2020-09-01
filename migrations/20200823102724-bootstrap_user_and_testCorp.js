'use strict';

require('dotenv').config();
const bcrypt = require('bcrypt');
const { v4: uuidV4 } = require('uuid');

const {
  SUPERADMIN_EMAIL,
  SUPERADMIN_PASSWORD,
} = process.env;

const CORP_UUID = uuidV4();
const ADMIN_USER = {
  uuid: uuidV4(),
  email: SUPERADMIN_EMAIL,
  password: bcrypt.hashSync(SUPERADMIN_PASSWORD, 10),
  activatedAt: new Date(),
  permissions: [{
    corporationId: CORP_UUID,
    role: 'superadmin',
    corpSlug: 'testCORP',
    name: 'Testing Corporation',
    applications: [],
  }],
  profile: {
    fullName: 'Admin TestCORP',
  },
};
const TEST_CORP = {
  uuid: CORP_UUID,
  corpSlug: 'testCORP',
  name: 'Testing Corporation',
  ownerId: ADMIN_USER.uuid,
  ownerName: ADMIN_USER.profile.fullName,
  applications: [],
};

const up = async (db) => {
  await db.collection('corporations').insertOne(TEST_CORP);

  await db.collection('users').insertOne(ADMIN_USER);
};

const down = async (db) => {
  await db.collection('corporations').deleteOne({
    name: TEST_CORP.name,
  });
  await db.collection('users').deleteOne({
    email: ADMIN_USER.email,
  });
};

module.exports = {
  up,
  down,
};
