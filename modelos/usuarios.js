const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let usuarios = new Schema({
    DATOS:  {
        NOMBRE:String,
        APELLIDO:String,
        TELEFONO:Number,
        CORREO:String
    },
    LOGIN: {
        USUARIO:String,
        PASSWORD:String
    },
    CONFIGURACION: {
        LISTABLE : Boolean, 
        RESTRINGIDO : false, 
        TIPO : String, 
        ESTADO : String, 
        FECHACREACION : Date, 
        ULTIMOACCESO : Date
    },
    LISTA:[
        {
            FECHA_ESTUDIO : Date, 
            ID : String, 
            FECHA_ASIGNACION : Date
        }
    ]
});

var Usuario = mongoose.model('Usuario', usuarios);

module.exports = Usuario;