const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
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
    enum: ['OL', 'IS'],
    default: 'IS',
  },
  created_date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = model('Truck', schema);
