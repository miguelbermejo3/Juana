// models/plato.js
const mongoose = require('mongoose');

const platoSchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: true 
  },
  categoria: { 
    type: String, 
    required: true 
  },
  tipo: {
    type: String,
    enum: ['plato', 'tapa', 'unidad'],  // Añadido 'unidad' como opción
    required: true
  },
  precio: {
    type: Number,
    required: true // Este campo es ahora el único requerido para todos los tipos
  }
});

module.exports = mongoose.model('Plato', platoSchema);
