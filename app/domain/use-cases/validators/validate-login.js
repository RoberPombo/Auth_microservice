'use strict';

const Ajv = require('ajv');

const fieldSchemas = require('./field-schemas');
const { createValidationError } = require('../../errors');

const ajv = new Ajv({ allErrors: true });

const schema = {
  type: 'object',
  additionalProperties: false,
  required: [
    'email',
    'password',
  ],
  properties: {
    email: fieldSchemas.email,
    password: fieldSchemas.password,
  },
};

/**
 * Validate input data for login
 * @param {Object} data data to be validated.
 * @param {String} data.email
 * @param {String} data.password
 *
 * @throws ValidationError
 */
const validateLogin = async (data) => {
  const validate = ajv.compile(schema);
  const valid = validate(data);

  if (!valid) {
    throw createValidationError(validate.errors);
  }
};

module.exports = validateLogin;
