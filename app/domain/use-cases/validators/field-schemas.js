'use strict';

const email = {
  type: 'string',
  format: 'email',
};
const password = {
  type: 'string',
  minLength: 6,
};

module.exports = {
  email,
  password,
};
