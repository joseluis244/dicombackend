const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
const cors = require("cors");
const Rutas = require('./Rutas');
const Servicio = require("./servicio")


app.use(fileUpload({
    createParentPath: true
}));

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use('/',Rutas)
app.use('/servicio',Servicio)


app.listen(4000,()=>{console.log('Servidor activo')})