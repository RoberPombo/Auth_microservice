'use strict';

const { Schema, model } = require('mongoose');

const corporationSchema = new Schema({
  uuid: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    unique: true,
    required: true,
  },
  ownerId: {
    type: String,
    required: true,
  },
  ownerName: String,
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date,
  applications: [{
    uuid: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      unique: true,
    },
    accessLevel: String,
  }],
});

corporationSchema.set('timestamps', true);

module.exports = model('corporations', corporationSchema);
