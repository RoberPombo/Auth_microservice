'use strict';

const userAdapter = (user) => ({
  uuid: user.uuid,
  email: user.email,
  profile: user.profile,
});

module.exports = userAdapter;
