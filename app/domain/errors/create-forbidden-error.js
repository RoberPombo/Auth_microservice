'use strict';

const { FORBIDDEN } = require('http-status-codes');

class ForbiddenError extends Error {
  constructor(status, message) {
    super();
    this.name = 'ForbiddenError';
    this.status = status;
    this.message = message;
    this.code = status;
  }
}

const createForbiddenError = (title, detail, pointer = '') => {
  const message = [{
    code: FORBIDDEN,
    source: {
      pointer,
    },
    detail,
    title,
  }];

  return new ForbiddenError(FORBIDDEN, message);
};

module.exports = createForbiddenError;
