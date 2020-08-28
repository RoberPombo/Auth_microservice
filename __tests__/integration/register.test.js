'use strict';

process.env.TOKEN_SECRET = 'secret';

const bcrypt = require('bcrypt');
const faker = require('faker');

const dbInMemory = require('../config/db-in-memory');
const { UserModel } = require('../../app/domain/models');
const { server } = require('../../app/infrastructure/http-server/init-http-server');

const EMAIL = faker.internet.email();
const PASSWORD = faker.internet.password();

const USER_DB = {
  uuid: '123456789',
  email: 'userInBD@test.com',
  password: bcrypt.hashSync('Test123-', 10),
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

  it('Should return activationCode', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/api/auth/account',
      payload: {
        email: EMAIL,
        password: PASSWORD,
      },
    });

    expect(res).toHaveProperty('statusCode', 201);
    expect(JSON.parse(res.body)).toMatchObject({
      activationCode: expect.any(String),
    });
  });

  it('Should fail and return a ValidationError', async () => {
    const MALFORMED_EMAIL = 'otherEmail';

    const res = await server.inject({
      method: 'POST',
      url: '/api/auth/account',
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

  it('Should fail and return a Conflict', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/api/auth/account',
      payload: {
        email: USER_DB.email,
        password: PASSWORD,
      },
    });

    expect(res).toHaveProperty('statusCode', 409);
    expect(JSON.parse(res.body)).toMatchObject({
      jsonapi: expect.any(Object),
      errors: [{
        title: 'Duplicate user',
      }],
    });
  });
});
