'use strict';

const defaultError = (error) => ({
  status: 500,
  headers: { 'Content-type': 'application/json' },
  body: {
    message: error.message,
  },
});

/** Complies with the jsonapi convection */
const businessError = (error) => ({
  status: error.status,
  headers: { 'Content-type': 'application/json' },
  body: {
    jsonapi: { version: 1.0 },
    errors: error.message,
  },
});

/**
 * Converts application errors to http errors.
 * @param {Object} error
 *
 * @throws {Error}
 */
const errorMapper = (error) => {
  const { name } = error;

  switch (name) {
    case 'ConflictError':
    case 'ForbiddenError':
    case 'NotFoundError':
    case 'UnauthorizedError':
    case 'ValidationError':
      return businessError(error);
    default:
      return defaultError(error);
  }
};

module.exports = errorMapper;
