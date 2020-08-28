'use strict';

const faker = require('faker');

const { registerUc } = require('../../../../app/domain/use-cases/account');
const { UserRepository } = require('../../../../app/domain/repositories');

const CONTEXT = {};
const USER_DATA = {
  uuid: faker.random.uuid(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  activationCode: [{
    uuid: faker.random.uuid(),
  }],
};

describe('[use cases - unit test] [register]', () => {
  beforeEach(() => {
    UserRepository.createUser = jest.fn().mockReturnValue(USER_DATA);
  });

  it('Should return the activation code', async () => {
    await expect(registerUc(CONTEXT, { email: USER_DATA.email, password: USER_DATA.password }))
      .resolves.toMatchObject({
        activationCode: USER_DATA.activationCode[0].uuid,
      });
  });

  it('Should fail and return a ValidationError', async () => {
    const WRONG_PASSWORD = 'A1';

    await expect(registerUc(CONTEXT, { email: USER_DATA.email, password: WRONG_PASSWORD }))
      .rejects.toMatchObject({
        name: 'ValidationError',
      });
  });
});
