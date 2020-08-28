'use strict';

const { CONFLICT } = require('http-status-codes');

class ConflictError extends Error {
  constructor(status, message) {
    super();
    this.name = 'ConflictError';
    this.status = status;
    this.message = message;
    this.code = status;
  }
}

const createConflictError = (title, detail, pointer = null) => {
  const message = [{
    code: CONFLICT,
    source: {
      pointer,
    },
    detail,
    title,
  }];

  return new ConflictError(CONFLICT, message);
};

module.exports = createConflictError;
