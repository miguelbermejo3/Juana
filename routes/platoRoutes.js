// routes/menuRoutes.js
const express = require('express');
const router = express.Router();
const Plato=require('../models/plato');



// Ruta para crear un plato
router.post('/crear', async (req, res) => {
    try {
      console.log(req.body);  // Verifica los datos que se reciben
      
      const { nombre, categoria, tipo, precio } = req.body;
  
      // Crear un nuevo plato
      const nuevoPlato = new Plato({
        nombre,
        categoria,
        tipo,  // El tipo ahora se validará automáticamente por Mongoose
        precio
      });
  
      // Intentar guardar el plato en la base de datos
      await nuevoPlato.save();
      res.status(201).json({ message: 'Plato creado exitosamente', plato: nuevoPlato });
  
    } catch (error) {
      console.error(error);
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: 'El tipo debe ser "plato", "tapa" o "unidad"' });
      }
      res.status(500).json({ error: 'Error al crear el plato' });
    }
  });
  
  // Ruta GET para obtener todos los platos
router.get('/', async (req, res) => {
    try {
      // Obtener todos los platos de la base de datos
      const platos = await Plato.find();
  
      // Enviar la lista de platos como respuesta
      res.status(200).json(platos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener los platos' });
    }
  });
/*
  // Ruta para obtener platos por categoría
router.get('/categoria/:categoria', async (req, res) => {
    try {
      const { categoria } = req.params;  // Obtener el parámetro de categoría desde la URL
  
      // Buscar los platos con la categoría proporcionada
      const platos = await Plato.find({ categoria });
  
      if (platos.length === 0) {
        return res.status(404).json({ message: 'No se encontraron platos en esta categoría' });
      }
  
      res.json(platos);
    } catch (error) {
      console.error(error);  // Esto te permitirá ver más detalles sobre el error en los logs
      res.status(500).json({ error: 'Error al obtener los platos por categoría' });
    }
  });*/
  
  // Ruta para obtener todas las categorías únicas de los platos
router.get('/categorias', async (req, res) => {
    try {
      // Obtener todos los platos de la base de datos
      const platos = await Plato.find();
  
      // Extraer las categorías únicas utilizando un Set
      const categorias = [...new Set(platos.map(plato => plato.categoria))];
  
      // Enviar las categorías como respuesta
      res.json(categorias);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener las categorías' });
    }
  });
 
  router.get('/categoria/:categoria', async (req, res) => {
    try {
      const categoria = req.params.categoria; // Obtener el parámetro de categoría
      const platos = await Plato.find({ categoria }); // Buscar platos por categoría
  
      if (!platos || platos.length === 0) {
        return res.status(404).json({ message: 'No se encontraron platos en esta categoría' });
      }
  
      // Agrupar platos por categoría
      const groupedPlatos = platos.reduce((acc, plato) => {
        const existing = acc.find(p => p.nombre === plato.nombre);
        if (existing) {
          existing.precios[plato.tipo] = plato.precio;
        } else {
          acc.push({
            nombre: plato.nombre,
            precios: { [plato.tipo]: plato.precio },
          });
        }
        return acc;
      }, []);
  
      res.json(groupedPlatos);
    } catch (error) {
      console.error('Error al obtener platos por categoría:', error);
      res.status(500).json({ error: 'Error al obtener platos por categoría' });
    }
  });
  
  
  
  


module.exports = router;
