const express = require("express")
const app = express()
const Usuario = require("../modelos/usuarios")
const ListaCliente = require("../modelos/listaclientes")
///////////////////////////////
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/medpacs', {useNewUrlParser: true});
///////////////////////////////

app.use(express.urlencoded())
app.use(express.json())

app.get("/",(req,res)=>{
    res.sendfile("./servicio/vistas/index.html")
})
app.get("/:html.html",(req,res)=>{
    res.sendfile(`./servicio/vistas/${req.params.html}.html`)
})
app.post("/crearusuario",async (req,res)=>{
    let Nusuario = new Usuario(req.body)
    await Nusuario.save()
    res.send(true)
})
app.post("/agregarlista",async (req,res)=>{
    let Ncliente = new ListaCliente(req.body)
    await Ncliente.save()
    console.log(Ncliente)
    res.send(true)
})

app.listen(8000)