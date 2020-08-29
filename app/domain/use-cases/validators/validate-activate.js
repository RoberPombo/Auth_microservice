'use strict';

const Ajv = require('ajv');

const fieldSchemas = require('./field-schemas');
const { createValidationError } = require('../../errors');

const ajv = new Ajv({ allErrors: true });

const schema = {
  type: 'object',
  additionalProperties: false,
  required: [
    'uuid',
    'activationCode',
  ],
  properties: {
    uuid: fieldSchemas.uuid,
    activationCode: fieldSchemas.activationCode,
  },
};

/**
 * Validate input data for activate user
 * @param {Object} data data to be validated.
 * @param {String} data.uuid
 * @param {String} data.activationCode
 *
 * @throws ValidationError
 */
const validateActivate = async (data) => {
  const validate = ajv.compile(schema);
  const valid = validate(data);

  if (!valid) {
    throw createValidationError(validate.errors);
  }
};

module.exports = validateActivate;
