'use strict';

const email = {
  type: 'string',
  format: 'email',
};
const password = {
  type: 'string',
  minLength: 6,
};
const activationCode = {
  type: 'string',
  format: 'uuid',
};
const uuid = {
  type: 'string',
  format: 'uuid',
};

module.exports = {
  email,
  password,
  activationCode,
  uuid,
};
