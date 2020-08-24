'use strict';

const { v4: uuidV4 } = require('uuid');

const { UserModel } = require('../models');
const { createConflictError } = require('../errors');

const PROJECTION = {
  _id: 0,
  __v: 0,
  'activationCode._id': 0,
  'permissions._id': 0,
  'permissions.applications._id': 0,
};

const createUser = async (email, password, activationCode) => {
  try {
    const user = await UserModel.create({
      uuid: uuidV4(),
      email,
      password,
      activationCode: [{
        uuid: activationCode,
        sendAt: Date.now(),
      }],
    });

    return user.toObject();
  } catch (error) {
    if (error.message.includes('E11000')) {
      throw createConflictError('Duplicate user', 'user_already_exists_in_the_system');
    }

    throw new Error(error.message);
  }
};

const findByEmail = async (email) => UserModel.findOne({
  email,
  deletedAt: {
    $exists: false,
  },
}, PROJECTION).lean().exec();

module.exports = {
  createUser,
  findByEmail,
};
