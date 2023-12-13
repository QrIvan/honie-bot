const mongoose = require('mongoose');
const History = require('..//models/historyModel'); // Reemplaza con la ruta correcta a tu modelo History

const banSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    moderator_id: {
        type: String,
        required: true,
    },
    reason: {
        type: String,
        default: 'No Reason',
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

// Middleware para ejecutar acciones después de guardar un ban
banSchema.post('save', async function (doc) {
    try {
        // Crear un registro en la colección History
        const historyRecord = new History({
            user_id: doc.user_id,
            type: 'ban', // Puedes cambiar esto según tu lógica
            moderator_tag: doc.moderator_tag, // Asegúrate de tener moderator_tag en el modelo Ban
            reason: doc.reason,
            timestamp: doc.timestamp,
        });

        await historyRecord.save();
    } catch (error) {
        console.error('[DATABASE ERROR] Error creating history record:', error);
        // Manejar el error según tus necesidades
    }
});

module.exports = mongoose.model('Ban', banSchema);
