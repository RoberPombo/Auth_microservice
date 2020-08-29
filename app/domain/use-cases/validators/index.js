'use strict';

const validateLogin = require('./validate-login');
const validateRegister = require('./validate-register');
const validateActivate = require('./validate-activate');

module.exports = {
  validateLogin,
  validateRegister,
  validateActivate,
};
