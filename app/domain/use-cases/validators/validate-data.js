'use strict';

const Ajv = require('ajv');

const schemas = require('./field-schemas');
const { createValidationError } = require('../../errors');

const ajv = new Ajv({ allErrors: true });

const generateObjectSchema = (data, requiredFields, additionalProperties) => ({
  type: 'object',
  additionalProperties,
  required: requiredFields,
  properties:
    Object.keys(data).reduce((acc, cur) => {
      const obj = schemas[cur];
      if (!obj) {
        throw new Error(`${cur} data does not have an associated scheme.`);
      }

      return {
        ...acc,
        [cur]: obj,
      };
    }, {}),
});

/**
 * Validate input data
 * @param {Object} data data to be validated.
 * @param {Array<String>} requiredFields array with name of required fields.
 * @param {Boolean} additionalProperties if data can have more properties than the validated.
 */
const validateData = async (data, requiredFields, additionalProperties) => {
  const schema = generateObjectSchema(data, requiredFields, additionalProperties);
  const validate = ajv.compile(schema);
  const valid = validate(data);

  if (!valid) {
    throw createValidationError(validate.errors);
  }
};

module.exports = validateData;
