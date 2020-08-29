'use strict';

const { validateActivate } = require('../validators');
const { UserRepository } = require('../../repositories');
const {
  microserviceConfig: {
    activationCode: { expiresIn },
  },
} = require('../../config');
const {
  createForbiddenError,
  createNotFoundError,
  createConflictError,
} = require('../../errors');

const checkActivationCode = async (activationCode, user) => {
  if (!user) {
    throw createNotFoundError('User not found', 'user_does_not_exist');
  }
  if (user.activatedAt) {
    throw createConflictError('Already active user', 'user_is_already_activated');
  }

  const actCode = user.activationCode
    .filter((code) => code.uuid === activationCode);
  if (actCode.length !== 1) {
    throw createNotFoundError('Activation code not found', 'activation_code_fail');
  }
  if ((new Date(actCode[0].sendAt).getTime() + expiresIn - Date.now()) < 0) {
    throw createForbiddenError('Activation code expired', 'send_new_activation_code');
  }
};

/**
 * Activates a user if the activation code has not expired
 * @param {Object} context context object: correlationId, logger, ...
 * @param {Object} queryParams activation data
 * @param {String} queryParams.uuid user id
 * @param {String} queryParams.activationCode user activation code
 * @return {Promise<Object>} user data
 * @throws NotFoundError when user or activation code does not exist
 * @throws ForbiddenError when activation code is expired
 */
const activateUC = async (context, queryParams) => {
  await validateActivate(queryParams);
  const { uuid, activationCode } = queryParams;

  const user = await UserRepository.findById(uuid);
  await checkActivationCode(activationCode, user);

  await UserRepository.activate(user.uuid);

  return user;
};

module.exports = activateUC;
