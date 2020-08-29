'use strict';

const createConflictError = require('./create-conflict-error');
const createUnauthorizedError = require('./create-unauthorized-error');
const createValidationError = require('./create-validation-error');
const createNotFoundError = require('./create-not-found-error');
const createForbiddenError = require('./create-forbidden-error');

module.exports = {
  createConflictError,
  createUnauthorizedError,
  createValidationError,
  createNotFoundError,
  createForbiddenError,
};
