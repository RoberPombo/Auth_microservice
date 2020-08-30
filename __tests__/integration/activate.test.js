'use strict';

const faker = require('faker');

const dbInMemory = require('../config/db-in-memory');
const { UserModel } = require('../../app/domain/models');
const { server } = require('../../app/infrastructure/http-server/init-http-server');

const BASE_URL = '/api/auth/account/activate';

const USER_DB_ID = faker.random.uuid();
const USER_DB_ACT_CODE = faker.random.uuid();
const USER_CODE_EXP_ID = faker.random.uuid();
const USER_CODE_EXP_ACT_CODE = faker.random.uuid();

const USER_DB = {
  uuid: USER_DB_ID,
  email: faker.internet.email(),
  password: faker.internet.password(),
  activationCode: [{
    uuid: USER_DB_ACT_CODE,
    sendAt: new Date(),
  }],
};
const USER_CODE_EXPIRES = {
  uuid: USER_CODE_EXP_ID,
  email: faker.internet.email(),
  password: faker.internet.password(),
  activationCode: [{
    uuid: USER_CODE_EXP_ACT_CODE,
    sendAt: new Date(2000, 1, 1),
  }],
};

const getUri = (uuid, activationCode) => (
  `${BASE_URL}?uuid=${uuid}&activationCode=${activationCode}`
);

const setUP = async () => {
  await UserModel.create(USER_DB);
  await UserModel.create(USER_CODE_EXPIRES);
};

describe('[integration test] [activate]', () => {
  beforeAll(async () => {
    await dbInMemory.connect();
    await setUP();
  });
  afterAll(async () => {
    await dbInMemory.disconnect();
  });

  it('Should return status 204', async () => {
    const res = await server.inject({
      method: 'GET',
      url: getUri(USER_DB_ID, USER_DB_ACT_CODE),
    });

    expect(res).toHaveProperty('statusCode', 204);
  });

  it('Should fail and return a NotFoundError', async () => {
    const WRONG_ACT_CODE = faker.random.uuid();

    const res = await server.inject({
      method: 'GET',
      url: getUri(USER_CODE_EXP_ID, WRONG_ACT_CODE),
    });

    expect(res).toHaveProperty('statusCode', 404);
    expect(JSON.parse(res.body)).toMatchObject({
      jsonapi: expect.any(Object),
      errors: [{
        title: 'Activation code not found',
      }],
    });
  });

  it('Should fail and return a ForbiddenError', async () => {
    const res = await server.inject({
      method: 'GET',
      url: getUri(USER_CODE_EXP_ID, USER_CODE_EXP_ACT_CODE),
    });

    expect(res).toHaveProperty('statusCode', 403);
    expect(JSON.parse(res.body)).toMatchObject({
      jsonapi: expect.any(Object),
      errors: [{
        title: 'Activation code expired',
      }],
    });
  });
});
