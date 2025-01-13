// models/menu.js
const mongoose = require('mongoose');
const Plato = require('./plato');
const Bebida = require('./bebida');

const menuSchema = new mongoose.Schema({
  platos: [Plato.schema],
  bebidas: [Bebida.schema],
});

module.exports = mongoose.model('Menu', menuSchema);
