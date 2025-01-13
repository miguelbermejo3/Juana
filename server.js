const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware para permitir CORS y manejar JSON
app.use(cors());
app.use(express.json()); // Para parsear cuerpos JSON

// Conectar con MongoDB
mongoose.connect('mongodb+srv://betis5268:fXQyCOkqxC7ZhBwj@regalacomanda.oohtf.mongodb.net/?retryWrites=true&w=majority&appName=regalaComanda', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.log('Error al conectar a MongoDB:', err));

// Importa las rutas
const usuarioRoutes = require('./routes/usuarioRoutes');
const menuRoutes=require('./routes/menuRoutes');
const platoRoutes=require('./routes/platoRoutes');
// Usa el router de usuarios
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/plato', platoRoutes);

// Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
