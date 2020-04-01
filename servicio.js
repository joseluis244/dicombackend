const express = require('express')
const Servicio = express.Router()
const instalar = require("./install")

Servicio.get("/",(req,res)=>{
    res.send("servicio")
})

Servicio.get("/install/:data",(req,res)=>{
    let telefono = req.params.data.split("$")[0]
    let correo = req.params.data.split("$")[1]
    instalar.creardb(telefono,correo)
    res.send("listo")
})
module.exports = Servicio