const pino = require('pino');

const logger = pino({
  prettyPrint: true,
  level: 'warn',
});

module.exports = logger;
