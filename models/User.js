const {Schema, model} = require('mongoose');

const schema = new Schema({
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    require: true,
    enum: ['SHIPPER', 'DRIVER'],
  },
  created_date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = model('User', schema);
