'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { userAdapter } = require('../adapters');
const { validateLogin } = require('../validators');
const { UserRepository } = require('../../repositories');
const {
  createConflictError,
  createUnauthorizedError,
} = require('../../errors');

const {
  TOKEN_SECRET: tokenSecret,
  TOKEN_EXPIRATION: tokenExp,
  REFRESH_TOKEN_EXPIRATION: refreshTokenExp,
} = process.env;

/**
 * Check if the user exists and is activated
 * @param {Object} user saved user data
 * @throws ConflictError
 * @throws UnauthorizedError
 */
const checkUserIsActive = async (user) => {
  if (!user) {
    throw createUnauthorizedError('Unauthorized login', 'wrong email or password');
  }
  if (!user.activatedAt) {
    throw createConflictError('Inactive user', 'user not activated');
  }
};

/**
 * Check that the input password is correct.
 * @param {String} password input password
 * @param {String} hashPassword saved password hash
 * @throws UnauthorizedError
 */
const checkPassword = async (password, hashPassword) => {
  const match = await bcrypt.compare(password, hashPassword);
  if (!match) {
    throw createUnauthorizedError('Unauthorized login', 'wrong email or password');
  }
};

/**
 * Generates the authentication tokens with the user's info.
 * @param {Object} user saved user data
 * @returns {Promise<{accessToken:String,refreshToken:String,expiresIn:Number}>}
 */
const generateTokens = async (user) => {
  const { uuid, email, permissions } = user;

  const accessToken = jwt.sign(
    { uuid, email, permissions },
    tokenSecret,
    { expiresIn: Number(tokenExp) }
  );
  const refreshToken = jwt.sign(
    { uuid, email },
    tokenSecret,
    { expiresIn: Number(refreshTokenExp) }
  );

  return {
    accessToken,
    refreshToken: await bcrypt.hash(refreshToken, 10),
    expiresIn: Number(tokenExp),
  };
};

/**
 * Performs a login using the passed email and password.
 * @param {Object} context context object: correlationId, logger, ...
 * @param {Object} payload login data
 * @param {String} payload.email user email
 * @param {String} payload.password user password
 * @returns {Promise<{}>} authentication tokens and user data
 * @throws ValidationError when user data is wrong
 * @throws UnauthorizedError when the login fails
 */
const loginUC = async (context, payload) => {
  await validateLogin(payload);
  const { email, password } = payload;

  const user = await UserRepository.findByEmail(email);
  await checkUserIsActive(user);

  const { password: securePassword } = user;
  await checkPassword(password, securePassword);

  const tokens = await generateTokens(user);

  return {
    ...tokens,
    user: userAdapter(user),
  };
};

module.exports = loginUC;
