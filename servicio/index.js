const express = require("express")
const app = express()
const Usuario = require("../modelos/usuarios")
const ListaCliente = require("../modelos/listaclientes")
const checkDiskSpace = require('check-disk-space')
const fs = require("fs")
///////////////////////////////
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/medpacs', {useNewUrlParser: true});
///////////////////////////////

app.use(express.urlencoded())
app.use(express.json())

app.get("/",(req,res)=>{
    res.sendfile("./vistas/index.html")
})
app.get("/:html.html",(req,res)=>{
    res.sendfile(`./vistas/${req.params.html}.html`)
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
app.get("/getspace",(req,res)=>{
    let DiskRuta = fs.readFileSync("./disk.json")
    DiskRuta = JSON.parse(DiskRuta.toString())
    checkDiskSpace(DiskRuta.ruta).then((diskSpace) => {
        let Pocupado = (100*(diskSpace.size-diskSpace.free))/(diskSpace.size)
        res.json({uso:Pocupado.toFixed(2)})
        // {
        //     free: 12345678,
        //     size: 98756432
        // }
    })

})
app.listen(8000)