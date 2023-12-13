// sugerenciaModel.js
const mongoose = require('mongoose');

const sugerenciaSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  estado: { type: String, enum: ['Voting', 'Accept', 'Deny'], default: 'Voting' },
  contenido: { type: String, required: true },
  fechaCreacion: { type: Date, default: Date.now },
  autor: { type: String, required: true },
  votosAFavor: { type: Number, default: 0 },
  votosEnContra: { type: Number, default: 0 },
  comentarios: [{ autor: String, contenido: String, fecha: Date }],
  categorias: [String],
  prioridad: { type: Number, default: 1 },
  evaluado: { type: Boolean, default: false },
  evaluador: { type: String },
  historialCambios: [{ fecha: Date, autor: String, cambio: String }]
});

const Sugerencia = mongoose.model('Sugerencia', sugerenciaSchema);

module.exports = Sugerencia;
