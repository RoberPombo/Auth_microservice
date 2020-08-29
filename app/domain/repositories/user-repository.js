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

/**
 *
 * @param {Object} user user data
 * @param {String} user.email
 * @param {String} user.password
 * @param {String} user.activationCode
 * @param {Number} user.sendAt
 * @returns {Promise<Object>}
 * @throws ConflictError
 */
const createUser = async ({
  email, password, activationCode, sendAt,
}) => {
  try {
    const user = await UserModel.create({
      uuid: uuidV4(),
      email,
      password,
      activationCode: [{
        uuid: activationCode,
        sendAt,
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

/**
 * Returns the saved user if it is not soft deleted.
 * @param {String} email user email to search
 * @returns {Promise<{
              email:String, password:String,
              uuid:String, createdAt:Date,
              updatedAt:Date, activatedAt?:Date
            }>} saved user data
 */
const findByEmail = async (email) => UserModel.findOne({
  email,
  deletedAt: {
    $exists: false,
  },
}, PROJECTION).lean();

/**
 * Returns the saved user if it is not soft deleted.
 * @param {String} uuid user id to search
 * @returns {Promise<{
  email:String, password:String,
  uuid:String, createdAt:Date,
  updatedAt:Date, activatedAt?:Date
}>} saved user data
*/
const findById = async (uuid) => UserModel.findOne({
  uuid,
  deletedAt: {
    $exists: false,
  },
}, PROJECTION).lean();

const activate = async (uuid) => UserModel.findOneAndUpdate({
  uuid,
}, {
  activatedAt: Date.now(),
}).lean();

module.exports = {
  createUser,
  findByEmail,
  findById,
  activate,
};
