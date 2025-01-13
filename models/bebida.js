// models/bebida.js
const mongoose = require('mongoose');

const bebidaSchema = new mongoose.Schema({
  nombre: String,
  categoria: String,
  tipo: String, // Tipo como string, por ejemplo 'alcohólica', 'sin alcohol'
  precio: Number,
});

module.exports = mongoose.model('Bebida', bebidaSchema);
