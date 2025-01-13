const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
    nombre:String,
    correo:String,
    password:String,
    comandas: [
        {
          platoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plato' },
          nombre: String,
          tipo: String,
          precio: Number,
        },
      ],
    comandasFinalizadas:[
      {
        platoId:{type:mongoose.Schema.Types.ObjectId,ref:'Plato'},
        nombre:String,
        tipo:String,
        precio:Number
      }
    ]

});

module.exports= mongoose.model('Usuario',usuarioSchema);