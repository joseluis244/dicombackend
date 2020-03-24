const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let listaclientes = new Schema({
    nombre:String,
    area:String,
    correo:String,
    prefijo:String,
    telefono:String
});

var Listaclientes = mongoose.model('Listaclientes', listaclientes);

module.exports = Listaclientes;