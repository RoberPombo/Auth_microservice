'use strict';

const faker = require('faker');

const { flagUc } = require('../../../../../app/domain/use-cases/corporation');

const CORP_SLUG = 'testCORP';
const AUTH = {
  permissions: [{
    corpSlug: CORP_SLUG,
    role: 'admin',
  }],
};

describe('[user cases - unit test] [feature-flag]', () => {
  it('Should return an array of feature flags', async () => {
    await expect(flagUc({ auth: AUTH }, { corpSlug: CORP_SLUG }))
      .resolves.toMatchObject([expect.any(Object)]);
  });

  it('Should fail and return a UnauthorizedError', async () => {
    const WRONG_AUTH = {
      permissions: {
        corpSlug: faker.helpers.slugify(),
        role: 'admin',
      },
    };

    await expect(flagUc({ auth: WRONG_AUTH }, { corpSlug: CORP_SLUG }))
      .rejects.toMatchObject({
        name: 'UnauthorizedError',
      });
  });
});
