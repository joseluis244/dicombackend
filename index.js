const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
const cors = require("cors");
const Rutas = require('./Rutas');



app.use(cors())
app.use(express.json())
app.use(express.urlencoded());
app.use(fileUpload({
    createParentPath: true
}));
app.use('/',Rutas)


app.listen(4000,()=>{console.log('Servidor activo')})