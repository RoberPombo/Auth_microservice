'use strict';

const jwt = require('jsonwebtoken');

const { TOKEN_SECRET } = process.env;

const getAuthToken = (authorization) => {
  const [type, token] = authorization.split(' ');
  if (type !== 'Bearer') {
    throw new Error('Invalid authorization');
  }

  return token;
};

const authHook = (request, reply, done) => {
  const { authorization } = request.headers;
  try {
    if (authorization) {
      const token = getAuthToken(authorization);
      const authData = jwt.verify(token, TOKEN_SECRET);

      request.context.auth = {
        ...authData,
        accessToken: token,
      };
    }
  } catch (error) {
    done(error);
  }

  done();
};

module.exports = authHook;
