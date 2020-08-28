'use strict';

process.env.TOKEN_SECRET = 'secret';
process.env.TOKEN_EXPIRATION = '10000';
process.env.REFRESH_TOKEN_EXPIRATION = '100';

const bcrypt = require('bcrypt');
const faker = require('faker');

const dbInMemory = require('../config/db-in-memory');
const { UserModel } = require('../../app/domain/models');
const { server } = require('../../app/infrastructure/http-server/init-http-server');

const EMAIL = faker.internet.email();
const PASSWORD = faker.internet.password();

const USER_DB = {
  uuid: '123456789',
  email: EMAIL,
  password: bcrypt.hashSync(PASSWORD, 10),
  activatedAt: Date.now(),
  activationCode: [{
    uuid: '987654321',
    sendAt: Date.now(),
  }],
};

const setUP = async () => {
  await UserModel.create(USER_DB);
};

describe('[integration test] [login]', () => {
  beforeAll(async () => {
    await dbInMemory.connect();
    await setUP();
  });
  afterAll(async () => {
    await dbInMemory.disconnect();
  });

  it('Should return authentication tokens and user info', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/api/auth/account/login',
      payload: {
        email: EMAIL,
        password: PASSWORD,
      },
    });

    expect(res).toHaveProperty('statusCode', 200);
    expect(JSON.parse(res.body)).toMatchObject({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
      expiresIn: expect.any(Number),
      user: expect.any(Object),
    });
  });

  it('Should fail and return a ValidationError', async () => {
    const MALFORMED_EMAIL = 'otherEmail';

    const res = await server.inject({
      method: 'POST',
      url: '/api/auth/account/login',
      payload: {
        email: MALFORMED_EMAIL,
        password: PASSWORD,
      },
    });

    expect(res).toHaveProperty('statusCode', 400);
    expect(JSON.parse(res.body)).toMatchObject({
      jsonapi: expect.any(Object),
      errors: [{
        title: 'some_inputs_are_invalid',
      }],
    });
  });

  it('Should fail and return a UnauthorizedError', async () => {
    const WRONG_EMAIL = 'otherEmail@test.com';

    const res = await server.inject({
      method: 'POST',
      url: '/api/auth/account/login',
      payload: {
        email: WRONG_EMAIL,
        password: PASSWORD,
      },
    });

    expect(res).toHaveProperty('statusCode', 401);
    expect(JSON.parse(res.body)).toMatchObject({
      jsonapi: expect.any(Object),
      errors: [{
        title: 'Unauthorized login',
      }],
    });
  });
});
