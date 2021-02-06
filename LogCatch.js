const fs = require('fs')
const moment = require('moment')
const dir = './LOGS'
if(!fs.existsSync(dir)){
    fs.mkdirSync(dir)
}else{
    fs.readdirSync(dir)
}
CrearRegistroError("teest.log","la pajara pinta")
/**
 * 
 * @param {String} nombrearchivo nombre del archivo ejemplo "error.log"
 * @param {String} error datos del error ocurrido
 * @returns void
 */

async function CrearRegistroError(nombrearchivo,error){
    let fecha = moment().format("DD/MM/YYYY HH:mm:ss")
    if(fs.existsSync(dir+"/"+nombrearchivo)){
        fs.appendFileSync(dir+"/"+nombrearchivo,`\n${fecha}\t${error}`)
    }else{
        fs.writeFileSync(dir+"/"+nombrearchivo,`Fecha\t\t\t\t|| Descripcion\n`)
        fs.appendFileSync(dir+"/"+nombrearchivo,`====================||===================================================`)
        fs.appendFileSync(dir+"/"+nombrearchivo,`\n${fecha}\t|| ${error}`)
    }
}