const express = require('express')
const router = express.Router()
const db = require('./dbconsultas')
const nodemailer = require('nodemailer');
require('dotenv').config()
const mensaje = require('./generarcorreo');
const mysqldb = require('./mysqldb');
const mysqldb0 = require('./mysqldb0');
const pako = require("pako")
const multer  = require('multer')
const request = require("request")

const fs = require('fs')
const conf = JSON.parse( fs.readFileSync("./conf.json").toString() )


const upload = multer({ dest: 'informes/' })
///////////////////////////////
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/medpacs', {useNewUrlParser: true});
///////////////////////////////

console.log("Test",process.env.NODE_USER)
console.log("Test",process.env.CLIENTID)
console.log("Test",process.env.MAILSECRET)
console.log("Test",process.env.TOKEN)

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {type: 'oauth2',
            user: process.env.NODE_USER,
            clientId: process.env.CLIENTID,
            clientSecret: process.env.MAILSECRET,
            refreshToken: process.env.TOKEN
        }
});

router.post('/login',(req,res)=>{
    db.login(req.body)
    .then((dbres)=>{
        console.log(dbres)
        res.json({db:dbres})
    })
})

router.get('/autenticacion/:token',(req,res)=>{
    db.comprobar(req.param('token'))
    .then((Fres)=>{
        res.json(Fres)
    })
})


router.get('/getestudios2',(req,res)=>{
    let initcontrol = new Date().getTime()
    let inicio,final
    req.param("inicio")?inicio= parseInt( req.param("inicio") ):inicio=19000101
    req.param("fin")?final=parseInt( req.param("fin") ):final=40001212
    mysqldb.buscarestudios(inicio,final)
    .then((dbres)=>{
        let fincontrol = new Date().getTime()
        console.log(fincontrol - initcontrol)
        res.json(dbres)
    })
})

router.get('/getestudios',(req,res)=>{
    let inicio,final
    req.param("inicio")?inicio= parseInt( req.param("inicio") ):inicio=19000101
    req.param("fin")?final=parseInt( req.param("fin") ):final=40001212
    mysqldb0.GetListaEstudios(inicio,final)
    .then(dbres=>{
        res.json(dbres)
        res.end()
    })
})


router.post('/sharecorreo',(req,res)=>{
    let destinatario = req.body.destino
    let nombre = req.body.nombre
    let modalidad = req.body.modalidad
    let fechasys = new Date()
    let fecha = `${fechasys.getDate()}/${fechasys.getMonth()+1}/${fechasys.getFullYear()} ${fechasys.getHours()}:${fechasys.getMinutes()}`
    let titulo = `Estudio:${nombre} - ${modalidad} ${fecha}`
    let datos = req.body.data
    var mailOptions = {
        from: conf.Remitente,
        to: destinatario,
        subject: titulo,
        html: mensaje.mail(datos,modalidad,nombre)
    }
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
            res.json({res:false})
        } else {
            console.log('Email sent: ' + info.response);
            res.send({res:true})
        }
    });
})

router.post('/cargarInforme',upload.any(), (req,res)=>{
       let estudio = JSON.parse(req.body.estudio)
       let fechasubida = req.body.fechasubida
       let informe = req.files[0]
       db.guardarinforme(informe,estudio,fechasubida)
       res.json({estado:true})
})

router.get('/listaclientes',(req,res)=>{
    db.leerlistaclientes()
    .then((Pres)=>{
        res.json(Pres)
    })
})

router.get('/getfiles/:id',(req,res)=>{
    mysqldb.files(req.param('id'))
    .then((DBres)=>{
        res.send(DBres)
    })
})

router.get('/getfileszip/:id',(req,res)=>{
    mysqldb.files(req.param('id'))
    .then((DBres)=>{
        console.log(DBres.length)
        let zip = pako.gzip(new Uint8Array(DBres))
        res.send(zip)
    })
})


router.get('/existeinforme/:id',(req,res)=>{
    db.informesF(req.params.id)
    .then((DBres)=>{
        if(DBres !== null){
            res.json({"existe":true,"nombre":DBres.INFORME.NOMBRE})
        }else{
            res.json({"existe":false,"nombre":null})
        }
    })
})

router.get('/descargarinforme/:file',(req,res)=>{
    res.download(`./informes/${req.params.file}`,`${req.params.file}.pdf`)
})

router.get('/descargarinformever/:file',(req,res)=>{
    let file = req.params.file.split(".")[0]
    res.contentType("application/pdf")
    res.sendfile(`./informes/${file}`)
})

router.get('/visorexterno/:token',(req,res)=>{
    mysqldb.externo(req.params.token)
    .then((Fres)=>{
        res.json(Fres)
    })
})

router.get('/facturacion',(req,res)=>{
    res.send("facturacion")
})
/*router.get("/medibook/:id/:date",(req,res)=>{
    let id = req.params.id
    let date = parseInt(req.params.date)
    mysqldb.medibook(id)
    .then(sqlres=>{
        if(sqlres.estado){
            let estudio = sqlres.estudio
            let envio = false
            let estudioEnvio = {}
            let token = ""
            for(let i = 0 ; i <= estudio.length-1 ; i++){
                let FechaTest = parseInt(estudio[0].FECHA)
                if(FechaTest >= date){
                    envio = true
                    estudioEnvio=estudio[i]
                    break;
                }
            }
            if(envio){
                token = jwt.sign({ID:estudioEnvio.ID},'Medicaltec3101',{expiresIn:'48h'})
            }
            res.json({encontrado:envio,token:token})
        }
    })
})*/

router.get("/DescargaEstudio/:id",(req,res)=>{
    let server = "localhost:8042"
    request(`http://${server}/studies/${req.params.id}/media`)
    setTimeout(() => {
        request(`http://${server}/studies/${req.params.id}/media`).pipe(res);
    }, 2000);
})
module.exports = router