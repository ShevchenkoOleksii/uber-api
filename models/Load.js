const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
  name: {
    type: String,
    require: true,
  },
  payload: {
    type: Number,
    require: true,
  },
  pickup_address: {
    type: String,
    require: true,
  },
  delivery_address: {
    type: String,
    require: true,
  },
  dimensions: {
    width: {
      type: Number,
      require: true,
    },
    length: {
      type: Number,
      require: true,
    },
    height: {
      type: Number,
      require: true,
    },
  },
  created_by: {
    type: Types.ObjectId,
    require: true,
  },
  assigned_to: {
    type: Types.ObjectId,
    require: true,
    default: null,
  },
  type: {
    type: String,
    require: true,
    enum: ['SPRINTER', 'SMALL STRAIGHT', 'LARGE STRAIGHT'],
  },
  status: {
    type: String,
    require: true,
    default: 'NEW',
    enum: ['NEW', 'POSTED', 'ASSIGNED', 'SHIPPED'],
  },
  created_date: {
    type: Date,
    default: Date.now(),
  },
  state: {
    type: String,
    require: true,
    default: null,
    enum: [
      null,
      'En route to Pick Up',
      'Arrived to Pick Up',
      'En route to delivery',
      'Arrived to delivery',
    ],
  },
  logs: [{
    message: {
      type: String,
      require: true,
    },
    time: {
      type: Date,
      default: Date.now(),
    },
  },
  ],
});

module.exports = model('Load', schema);
