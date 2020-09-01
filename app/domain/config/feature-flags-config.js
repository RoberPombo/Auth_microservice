'use strict';

const config = {
  criteria: [
    {
      id: 'isCorporation',
      check: (user, corpName) => user.permissions
        .find((corp) => corp.name === corpName),
    },
    {
      id: 'isDeactivatedFlag',
      check: (user, featureId) => !user.features
        .includes(featureId),
    },
  ],
  features: [
    {
      id: 'notSendEmail',
      name: 'Not send email',
      description: 'In order to test the creation and activation of a user',
      endpoints: [{
        name: 'register',
        uri: '/account',
        method: 'post',
      }],
      criteria: {
        isCorporation: 'testCORP',
        isDeactivatedFlag: 'notSendEmail',
      },
    },
  ],
};

module.exports = config;
