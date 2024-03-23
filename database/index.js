const mongoose = require('mongoose');

mongoose.connect('MONGO_URL_DD', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Aumenta el tiempo de espera si es necesario
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, '[DATABASE ERROR] Connection error:'));
db.once('open', () => {
  console.log('[DATABASE] Connected to MongoDB');
});
