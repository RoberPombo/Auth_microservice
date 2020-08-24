'use case';

const { UNAUTHORIZED } = require('http-status-codes');
const { create } = require('../models/user-model');

class UnauthorizedError extends Error {
  constructor(status, message) {
    super();
    this.name = 'UnauthorizedError';
    this.status = status;
    this.message = message;
    this.code = status;
  }
}

const createUnauthorizedError = (title, detail, pointer = null) => {
  const message = {
    code: UNAUTHORIZED,
    source: {
      pointer,
    },
    detail,
    title,
  };

  return new UnauthorizedError(UNAUTHORIZED, message);
};

module.exports = createUnauthorizedError;
