'use strict';

process.env.TOKEN_SECRET = 'secret';
process.env.TOKEN_EXPIRATION = '10000';
process.env.REFRESH_TOKEN_EXPIRATION = '100';

const faker = require('faker');
const bcrypt = require('bcrypt');

const { loginUC } = require('../../../../../app/domain/use-cases/account');
const { UserRepository } = require('../../../../../app/domain/repositories');

const CONTEXT = {};
const PASSWORD = 'pass123!';
const USER_DATA = {
  email: 'test@test.com',
  password: bcrypt.hashSync('pass123!', 2),
  uuid: faker.random.uuid(),
  activatedAt: Date.now(),
};

describe('[use cases - unit test] [login]', () => {
  beforeEach(() => {
    UserRepository.findByEmail = jest.fn().mockReturnValue(USER_DATA);
  });

  it('Should return authentication tokens and user info', async () => {
    await expect(loginUC(CONTEXT, { email: USER_DATA.email, password: PASSWORD }))
      .resolves.toMatchObject({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
        expiresIn: expect.any(Number),
        user: expect.any(Object),
      });
  });

  it('Should fail and return a ValidationError', async () => {
    const MALFORMED_PASSWORD = 'A1';

    await expect(loginUC(CONTEXT, { email: USER_DATA.email, password: MALFORMED_PASSWORD }))
      .rejects.toMatchObject({
        name: 'ValidationError',
      });
  });

  it('Should fail and return a UnauthorizedError', async () => {
    const WRONG_PASSWORD = 'Aa12345-';

    await expect(loginUC(CONTEXT, { email: USER_DATA.email, password: WRONG_PASSWORD }))
      .rejects.toMatchObject({
        name: 'UnauthorizedError',
      });
  });

  it('Should fail and return a ConflictError', async () => {
    const USER_2 = {
      ...USER_DATA,
      activatedAt: undefined,
    };
    UserRepository.findByEmail = jest.fn().mockReturnValue(USER_2);

    await expect(loginUC(CONTEXT, { email: USER_2.email, password: PASSWORD }))
      .rejects.toMatchObject({
        name: 'ConflictError',
      });
  });
});
