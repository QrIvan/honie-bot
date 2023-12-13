const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  moderator_tag: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now(),
  },
});

const History = mongoose.model('History', historySchema);

module.exports = History;
