const express = require('express')
const router = express.Router()
const manejotokens = require("./tokens")
const multer  = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const subrutas = require("./Subfiles")
const estadisticas = require("./estadisticas")
const mongoDB = require("./mongo")


router.use(express.static("./administracion/estaticos/"))


router.get("/",(req,res)=>{
    res.sendfile("./administracion/viewes/index.html")
})

router.get("/autorisar",(req,res)=>{
    let token = req.headers.authorization
    if(token === "null"){
        res.sendfile("./administracion/viewes/cargartoken.html")
    }else{
        manejotokens.validar(token)
        .then((TK)=>{
            if(TK.valido){
                res.sendfile("./administracion/viewes/bastidor.html")
            }else{
                res.sendfile("./administracion/viewes/cargartoken.html")
            }
        })
    }
})

router.post("/loadtoken",upload.any(),(req,res)=>{
    let token = req.files[0].buffer.toString()
    manejotokens.validar(token)
    .then((TK)=>{
        res.json(TK)
    })
})

router.get("/SubContenido/:ruta",(req,res)=>{
    res.sendfile(subrutas(req.params.ruta))
})

router.get("/estadisticas",(req,res)=>{
    estadisticas.Dashboard()
    .then((DB)=>{
        res.json(DB)
    })
})

router.get("/listausuarios",(req,res)=>{
    mongoDB.ListaUsuarios()
    .then((DB)=>{
        res.json(DB)
    })
})
/////////////////////////////USUARIOS///////////////////////
router.put("/usuario",(req,res)=>{
    mongoDB.CrearUsuario(req.body)
    .then((DB)=>{
        res.json({save:DB,error:"Correo existente"})
    })
})
router.delete("/usuario",(req,res)=>{
    mongoDB.BorrarUsuario(req.body.id)
    .then(()=>{
        res.json(true)
    })
})
//////////////////////////////ESTUDIOS//////////////////////////////
router.get("/listaestudios",(req,res)=>{
    estadisticas.ListaEstudios()
    .then((DB)=>{
        res.json(DB)
    })
})
////////////////////Lista difucion //////////////////////////////////
router.get("/Listadifucion",(req,res)=>{
    mongoDB.getdifucion()
    .then((DB)=>{
        res.json(DB)
    })
})

module.exports = router