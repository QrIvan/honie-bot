const mongoose = require('mongoose');
const History = require('..//models/historyModel'); // Reemplaza con la ruta correcta a tu modelo History

const unbanSchema = new mongoose.Schema({
  user_id: String,
  user_tag: String,
  moderator_id: String,
  moderator_tag: String,
  reason: String,
  timestamp: Date,
});

// Middleware para ejecutar acciones después de guardar un desbanneo
unbanSchema.post('save', async function (doc) {
  try {
    // Crear un registro en la colección History
    const historyRecord = new History({
      user_id: doc.user_id,
      type: 'unban', // Puedes cambiar esto según tu lógica
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

const Unban = mongoose.model('Unban', unbanSchema);

module.exports = Unban;
