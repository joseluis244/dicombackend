const express = require('express');
const app = express();
const http = require('http').createServer(app);
const Ws = require("./Ws")(http)
const cors = require("cors");
const Rutas = require('./Rutas');
const administracion = require("./administracion/Rutas")
const negatoscopio = require("./Negatoscopio/Rutas")
//const fs = require("fs")
//const https = require("https")
//const https_port = 4443

//const secureserveroptios = {
//    key:fs.readFileSync("/var/www/html/medpacs/ssl/private.key"),
//    cert:fs.readFileSync("/var/www/html/medpacs/ssl/certificate.crt")
//}

//https.createServer(secureserveroptios, app)
//.listen(https_port,()=>{
//    console.log("secure server enable")
//})

app.use(cors())



app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use('/',Rutas)
app.use('/administracion',administracion)
app.use('/neg',negatoscopio)
/*agregar tambien en el index pendiente*/


http.listen(4000,()=>{console.log('Servidor activo')})