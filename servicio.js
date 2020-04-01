const express = require('express')
const Servicio = express.Router()

Servicio.get("/",(req,res)=>{
    res.send("servicio")
})


module.exports = Servicio