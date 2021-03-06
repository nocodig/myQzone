let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let mood = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'Users'
  },
  content: {
    type: String
  },
  good_num:{
    type: Array,
    default: []
  },
  is_remove: {
    type: Number,
    default: 0
  },
  created_time: {
    type: Date,
    default: Date.now
  }
});

module.exports = mood;

