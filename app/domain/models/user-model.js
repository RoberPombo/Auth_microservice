'use strict';

const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  uuid: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  activatedAt: Date,
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date,
  activationCode: [{
    uuid: String,
    sendAt: Date,
  }],
  changePassword: {
    uuid: String,
    password: String,
    sendAt: Date,
  },
  permissions: [{
    corporationId: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    corpSlug: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    applications: [{
      uuid: {
        type: String,
        required: true,
      },
      appSlug: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        required: true,
      },
    }],
  }],
  profile: {
    avatarUrl: String,
    fullName: String,
  },
});

userSchema.set('timestamps', true);

module.exports = model('users', userSchema);
