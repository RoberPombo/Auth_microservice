'use strict';

const faker = require('faker');

const { activateUC } = require('../../../../app/domain/use-cases/account');
const { UserRepository } = require('../../../../app/domain/repositories');

const ACTIVATION_CODE = faker.random.uuid();
const USER_ID = faker.random.uuid();

const CONTEXT = {};
const USER_DB = {
  uuid: USER_ID,
  activationCode: [{
    uuid: ACTIVATION_CODE,
    sendAt: Date.now(),
  }],
};

describe('[user cases - unit test] [activate]', () => {
  beforeEach(() => {
    UserRepository.findById = jest.fn().mockReturnValue(USER_DB);
    UserRepository.activate = jest.fn().mockReturnValue({});
  });

  it('Should return a user data', async () => {
    await expect(activateUC(CONTEXT, { uuid: USER_ID, activationCode: ACTIVATION_CODE }))
      .resolves.toMatchObject({
        uuid: expect.any(String),
        activationCode: expect.any(Object),
      });
  });

  it('Should fail and return a ValidationError', async () => {
    const WRONG_USER_ID = '123456789';

    await expect(activateUC(CONTEXT, { uuid: WRONG_USER_ID, activationCode: ACTIVATION_CODE }))
      .rejects.toMatchObject({
        name: 'ValidationError',
      });
  });

  it('Should fail and return a NotFoundError', async () => {
    UserRepository.findById = jest.fn().mockReturnValue(null);

    await expect(activateUC(CONTEXT, { uuid: USER_ID, activationCode: ACTIVATION_CODE }))
      .rejects.toMatchObject({
        name: 'NotFoundError',
      });
  });

  it('Should fail and return a ForbiddenError', async () => {
    UserRepository.findById = jest.fn().mockReturnValue({
      ...USER_DB,
      activationCode: [{
        uuid: ACTIVATION_CODE,
        sendAt: new Date(Date.now() - 30 * 60 * 60 * 1000),
      }],
    });

    await expect(activateUC(CONTEXT, { uuid: USER_ID, activationCode: ACTIVATION_CODE }))
      .rejects.toMatchObject({
        name: 'ForbiddenError',
      });
  });
});
