const usuarios = require('./modelos/usuarios')
const informes = require('./modelos/informe')
const listaclientes = require('./modelos/listaclientes')
const jwt = require('jsonwebtoken')
const moment = require('moment')

module.exports.login = async function login(datos){
        let usuario = await usuarios.findOne({"LOGIN.USUARIO": datos.username, "LOGIN.PASSWORD": datos.password},{ "LOGIN": 0, "LISTA": 0})
        if(usuario !== null){
            let token = jwt.sign({id:usuario._id},'Medicaltec3101',{ expiresIn: '48h' })
            usuario = {DATOS:usuario.DATOS,CONFIGURACION:usuario.CONFIGURACION}
            let res = {
                usuario:usuario,
                token:token
            }
            return(res)
        }else{
            return(false)
        }
}

module.exports.comprobar = async function comprobar(token){
    let token2
    let verificado
    try{
        token2 = await jwt.verify(token,'Medicaltec3101')
        verificado = true
    }catch(e){
        verificado = false
    }
    if(verificado){
        let id = token2.id
        let usuario = await usuarios.findById(id,{ "LOGIN": 0, "LISTA": 0,"_id": 0})
        return({verificado:verificado,usuario:usuario})
    }else{
        return({verificado:verificado,usuario:null})
    }
}

module.exports.guardarinforme = async function guardarinforme(informe,estudio,fechasubida){
    console.log(informe)
    console.log(estudio)
    console.log(fechasubida)
    //informe.mv('./informes/'+nuevonombreinforme)
    //let data = {
    //    ID:  estudio.ID,
    //    FECHA: moment(estudio.FECHA,'YYYYMMDD').format(),
    //    NOMBRE: estudio.NOMBRE,
    //    SEXO: estudio.SEXO,
    //    PAS_ID: estudio.PAS_ID,
    //    MODALIDAD: estudio.SERIES[0].MODALIDAD,
    //    INFORME:{
    //        FECHA: nf,
    //        NOMBRE: nuevonombreinforme
    //    }
    //}
    //let informeestudio = new informes(data)
    //informeestudio.save(()=>{})
    //return true
}

module.exports.leerlistaclientes = async function leerlistaclientes(){
    return new Promise(async (Pres,Prej)=>{
        let clientes = await listaclientes.find()
        Pres(clientes)
    })
}

module.exports.informesF = async function informesF(ID){
    try{
        let inf = await informes.findOne({"ID":ID})
        return inf
    }catch(e){
        return false
    }
}