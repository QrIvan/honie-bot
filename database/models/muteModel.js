const mongoose = require('mongoose');
const History = require('..//models/historyModel'); // Reemplaza con la ruta correcta a tu modelo History

const muteSchema = new mongoose.Schema({
  user_id: String,
  user_tag: String,
  moderator_id: String,
  moderator_tag: String,
  reason: String,
  timestamp: Date,
  duration: Number,
  unmuted: Boolean,
});

// Middleware para ejecutar acciones después de guardar un mute
muteSchema.post('save', async function (doc) {
  try {
    // Crear un registro en la colección History
    const historyRecord = new History({
      user_id: doc.user_id,
      type: 'mute', // Puedes cambiar esto según tu lógica
      moderator_tag: doc.moderator_tag,
      reason: doc.reason,
      timestamp: doc.timestamp,
    });

    await historyRecord.save();
  } catch (error) {
    console.error('[DATABASE ERROR] Error creating history record:', error);
    // Manejar el error según tus necesidades
  }
});

const Mute = mongoose.model('Mute', muteSchema);

module.exports = Mute;
