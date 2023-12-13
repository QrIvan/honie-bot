const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  coins: { type: Number, default: 0 },
});

module.exports = mongoose.model('User', userSchema);
