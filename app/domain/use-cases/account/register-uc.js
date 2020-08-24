'use strict';

const bcrypt = require('bcrypt');
const { v4: uuidV4 } = require('uuid');

const { validateData } = require('../validators');
const { UserRepository } = require('../../repositories');

/**
 * Create a new user using the email and password sent.
 * @param {Object} context context object: correlationId, logger, ...
 * @param {String} email user email
 * @param {String} password user password
 *
 * @returns {Promise<Object>}
 * @throws ValidationError when user data is wrong
 * @throws ConflictError when the user already exists
 */
const registerUc = async (context, email, password) => {
  await validateData({
    email,
    password,
  }, ['email', 'password'], false);

  const securePassword = await bcrypt.hash(password, 10);
  const activationCode = uuidV4();
  const user = await UserRepository.createUser(email, securePassword, activationCode);

  return {
    activationCode: user.activationCode[0].uuid,
  };
};

module.exports = registerUc;
