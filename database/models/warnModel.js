const mongoose = require('mongoose');
const History = require('..//models/historyModel'); // Reemplaza con la ruta correcta a tu modelo History

const warnSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  moderator_id: { type: String, required: true },
  reason: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

// Middleware para ejecutar acciones después de guardar una advertencia
warnSchema.post('save', async function (doc) {
  try {
    // Crear un registro en la colección History
    const historyRecord = new History({
      user_id: doc.user_id,
      type: 'warn',
      moderator_tag: doc.moderator_id, // Puedes cambiar esto según tu lógica
      reason: doc.reason,
      timestamp: doc.timestamp,
    });

    await historyRecord.save();
  } catch (error) {
    console.error('[DATABASE ERROR] Error creating history record:', error);
    // Manejar el error según tus necesidades
  }
});

module.exports = mongoose.model('Warn', warnSchema);
