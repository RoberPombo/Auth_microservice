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
  uuid: faker.random.uuid(),
  email: 'userInBD@test.com',
  password: bcrypt.hashSync('Test123-', 10),
  activatedAt: new Date(),
  activationCode: [{
    uuid: faker.random.uuid(),
    sendAt: new Date(),
  }],
};

const setUP = async () => {
  await UserModel.create(USER_DB);
};

describe('[integration test] [register]', () => {
  beforeAll(async () => {
    await dbInMemory.connect();
    await setUP();
  });
  afterAll(async () => {
    await dbInMemory.disconnect();
  });

  it('Should return status code Created', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/api/auth/account',
      payload: {
        email: EMAIL,
        password: PASSWORD,
      },
    });

    expect(res).toHaveProperty('statusCode', 201);
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
