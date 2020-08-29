'use strict';

const { NOT_FOUND } = require('http-status-codes');

class NotFoundError extends Error {
  constructor(status, message) {
    super();
    this.name = 'NotFoundError';
    this.status = status;
    this.message = message;
    this.code = status;
  }
}

const createNotFoundError = (title, detail, pointer = null) => {
  const message = [{
    code: NOT_FOUND,
    source: {
      pointer,
    },
    detail,
    title,
  }];

  return new NotFoundError(NOT_FOUND, message);
};

module.exports = createNotFoundError;
