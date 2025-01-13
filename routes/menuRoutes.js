// routes/menuRoutes.js
const express = require('express');
const router = express.Router();
const Menu = require('../models/menu'); // Importa el modelo de menu

// Ruta para crear un nuevo menú
router.post('/', async (req, res) => {
  console.log('Datos recibidos en el servidor: ',req.body);
  try{
    //Extraigo los datos del cuerpo de la solicitud
    const{platos,bebidas}=req.body;

    //validación
    if(!platos || !bebidas){
      return res.status(400).json({message:'Los campos de platos y bebida son obligatorios'});

    }

    //creo un nuevo documento
    const nuevoMenu= new Menu({
      platos,bebidas
    });

    //guardo el menú en la bbdd
    const menuGuardado= await nuevoMenu.save();

    //respuesta
    res.status(201).json({
      message:'Menú creado con éxito',
      menu:menuGuardado
    });
  }catch(error){
    console.log('Error al crear el menú',error);
    res.status(500).json({message:'Error del servidor al crear el menú',error:error.message});
  }



});


//enrutamiento para get
router.get('/',async(req,res)=>{

  try {
    const menus=await Menu.find();
    res.status(200).json(menus);
  } catch (error) {
    console.log('Error al obtener los menús',error);
    res.status(500).json({message:'Error al obtener los menús'});
  }

});

// Ruta para obtener un menú específico por ID
router.get('/:id', async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id); // Busca el menú por ID
    if (!menu) {
      return res.status(404).json({ error: 'Menú no encontrado' });
    }
    res.status(200).json(menu);
  } catch (error) {
    console.error('Error al obtener el menú:', error);
    res.status(500).json({ error: 'Error al obtener el menú' });
  }
});




module.exports = router;
