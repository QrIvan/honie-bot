const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://DDv:yoPx0OVx2I5mgD4r@dsdev.qapom1v.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Aumenta el tiempo de espera
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, '[DATABASE ERROR] Connection error:'));
db.once('open', () => {
  console.log('[DATABASE] Connected to MongoDB');
});