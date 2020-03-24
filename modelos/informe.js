const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let informes = new Schema({
    ID:  Number,
    FECHA: Date,
    NOMBRE: String,
    SEXO: String,
    PAS_ID: String,
    MODALIDAD: String,
    INFORME:{
        FECHA: Date,
        NOMBRE: String
    }
});

var Informe = mongoose.model('Informe', informes);

module.exports = Informe;