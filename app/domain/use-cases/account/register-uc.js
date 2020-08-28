'use strict';

const bcrypt = require('bcrypt');
const { v4: uuidV4 } = require('uuid');

const { validateRegister } = require('../validators');
const { UserRepository } = require('../../repositories');

/**
 * Create a new user using the email and password sent.
 * @param {Object} context context object: correlationId, logger, ...
 * @param {Object} payload register data
 * @param {String} payload.email user email
 * @param {String} payload.password user password
 * @returns {Promise<{activationCode:String}>} user activation code
 * @throws ValidationError when user data is wrong
 * @throws ConflictError when the user already exists
 */
const registerUc = async (context, payload) => {
  await validateRegister(payload);
  const { email, password } = payload;

  const sendActivationEmail = Date.now();
  const securePassword = await bcrypt.hash(password, 10);
  const activationCode = uuidV4();
  const user = await UserRepository.createUser({
    email,
    password: securePassword,
    activationCode,
    sendAt: sendActivationEmail,
  });

  return {
    activationCode: user.activationCode[0].uuid,
  };
};

module.exports = registerUc;
