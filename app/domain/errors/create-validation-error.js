'use strict';

const { BAD_REQUEST } = require('http-status-codes');

class ValidationError extends Error {
  constructor(status, message) {
    super();
    this.name = 'ValidationError';
    this.status = status;
    this.message = message;
    this.code = status;
  }
}

/**
 * Generates a ValidationError
 * @param {Array<Object>} errors Array with input errors
 * @returns {Error} ValidationError
 */
const createValidationError = (errors) => {
  const message = errors.map((err) => ({
    code: BAD_REQUEST,
    source: {
      pointer: err.dataPath.slice(1) || err.params.missingProperty,
    },
    detail: err.message,
    title: 'some_inputs_are_invalid',
  }));

  return new ValidationError(BAD_REQUEST, message);
};

module.exports = createValidationError;
