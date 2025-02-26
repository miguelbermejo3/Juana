const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario'); // Importa el modelo de Usuario
const jwt=require('jsonwebtoken'); //

const bcrypt = require('bcrypt');
const saltRounds = 10;

router.post('/', async (req, res) => {
  const { nombre, correo, password } = req.body;

  try {
    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ correo });
    if (usuarioExistente) {
      return res.status(400).json({ message: "Ya existe un usuario con ese correo" });
    }

    // Cifrar la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear el nuevo usuario
    const nuevoUsuario = new Usuario({ nombre, correo, password: hashedPassword });
    await nuevoUsuario.save();

    // Responder con JSON indicando éxito
    return res.status(201).json({
      message: "Usuario creado exitosamente",
      usuario: nuevoUsuario,
    });
  } catch (err) {
    console.error("Error al crear el usuario:", err);
    return res.status(500).json({ message: "Error al crear el usuario" });
  }
});



router.get('/', async (req, res) => {
  const { email, password } = req.query;

  try {
    console.log('Buscando usuario con email:', email); 

    const usuario = await Usuario.findOne({ correo: email });

    if (!usuario) {
      console.log('Usuario no encontrado');
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar la contraseña utilizando bcrypt
    const passwordMatch = await bcrypt.compare(password, usuario.password);
    if (!passwordMatch) {
      console.log('Contraseña incorrecta');
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    //creo un jwt con el id del usuario a iniciar sesión
    const token=jwt.sign({
      id:usuario._id,correo:usuario.correo},
      'admin1',//clave secreta
      {expiresIn:'1h'}
    );

    console.log('Usuario encontrado y login exitoso', usuario);
   
    res.status(200).json({
      message: 'Login exitoso',
      usuario: {_id:usuario._id, nombre: usuario.nombre, correo: usuario.correo },
      token: token  // Enviar el token al cliente
    });

  } catch (error) {
    console.error('Error al verificar el usuario:', error);
    res.status(500).json({ message: 'Error al verificar el usuario' });
  }
});

// Ruta para agregar una comanda al usuario
router.post('/:usuarioId/add-comandas', async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const { platoId, nombre, tipo, precio } = req.body;

    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    usuario.comandas.push({ platoId, nombre, tipo, precio });
    await usuario.save();

    res.status(200).json({ message: 'Comanda agregada con éxito', usuario });
  } catch (error) {
    console.error('Error al agregar la comanda:', error);
    res.status(500).json({ error: 'Error al agregar la comanda' });
  }
});

// Ruta para obtener las comandas del usuario
router.get('/comandas/:usuarioId', async (req, res) => {
  const { usuarioId } = req.params;

  try {
    // Buscar al usuario y obtener sus comandas
    const usuario = await Usuario.findById(usuarioId).populate('comandas'); // Rellenar los datos de los platos

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json({ comandas: usuario.comandas });
  } catch (error) {
    console.error('Error al obtener las comandas', error);
    return res.status(500).json({ message: 'Error al obtener las comandas' });
  }
});

router.delete('/:usuarioId/comandas/:platoId', async (req, res) => {
  const { usuarioId, platoId } = req.params;
  console.log('Usuario ID:', usuarioId, 'Plato ID:', platoId);
  try {
    const result = await Usuario.updateOne(
      { _id: usuarioId },
      { $pull: { comandas: { _id: platoId } } } // Elimina del array comandas el plato con ese _id
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: 'Plato eliminado correctamente' });
    } else {
      res.status(404).json({ message: 'Plato no encontrado en las comandas' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el plato', error });
  }
});

// Ruta para agregar una comandaFinalizada al usuario
router.post('/:usuarioId/add-comandas-finalizadas', async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const comandas = req.body;

    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Agregar todas las comandas finalizadas
    usuario.comandasFinalizadas.push(...comandas);
    usuario.comandas = []; // Opcional: Limpiar comandas activas
    await usuario.save();

    res.status(200).json({ message: 'Comandas finalizadas agregadas con éxito', usuario });
  } catch (error) {
    console.error('Error al agregar las comandas finalizadas:', error);
    res.status(500).json({ error: 'Error al agregar las comandas finalizadas' });
  }
});

//get de comandas finalizadas
router.get('/comandas-finalizadas/:usuarioId',async (req,res) =>{
  const {usuarioId}=req.params;
  try {
    const usuario= await Usuario.findById(usuarioId).populate('comandasFinalizadas.platoId');
    if(!usuario){
      return res.status(404).json({message:"Usuario no encontrado"});
    }
    return res.status(200).json({comandasFinalizadas: usuario.comandasFinalizadas});
    
  } catch (error) {
    console.log('Error al obtener las comandas finalizadas',error);
    return res.status(500).json({message:'Error a obtener las comandas finalizadas'});
  }
})

module.exports = router;
