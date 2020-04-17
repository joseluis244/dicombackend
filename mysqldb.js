const mysql = require('mysql');
const jwt = require('jsonwebtoken')
const fs = require("fs")
const pako = require('pako');


const condata = {
    host: "localhost",
    user: "medicaltecmysql",
    password: "Medicaltec310188$",
    database: "medicaltec"
}
//const con = mysql.createConnection({
//    host: "localhost",
//    user: "medicaltecmysql",
//    password: "Medicaltec310188$",
//    database: "medicaltec"
//});
// var con
exports.buscarestudios = async function buscarestudios(inicio,final){
    let con = mysql.createConnection(condata);
    return new Promise ((Pres,Prej)=>{
    let query = `SELECT fecha.id As ID, CAST(fecha.value as UNSIGNED) As FECHA, nombre.value As NOMBRE, sexo.value As SEXO, pas_id.value As PAS_ID,
    res.publicId As EST_UID
    FROM MainDicomTags fecha 
    JOIN MainDicomTags nombre ON fecha.id = nombre.id 
    JOIN MainDicomTags sexo ON sexo.id = fecha.id
    JOIN MainDicomTags pas_id ON pas_id.id = fecha.id
    JOIN Resources res ON res.internalId = fecha.id
    WHERE fecha.tagGroup=8 and fecha.tagElement=32 AND CAST(fecha.value as UNSIGNED) > ${inicio} AND CAST(fecha.value as UNSIGNED) <= ${final}
    AND nombre.tagGroup=16 AND nombre.tagElement=16 
    AND sexo.tagGroup=16 AND sexo.tagElement=64
    AND pas_id.tagGroup=16 AND pas_id.tagElement=32
    AND res.resourceType=1`
        con.connect();
        con.query(query, async (err, res) => {
            if(err){
                console.log(err)
            }
            for(let i =0 ; i<=res.length-1 ; i ++){
                let series = await agregarseries(res[i].ID)
                res[i].SERIES = series
            }
            Pres(res)
        })
        setTimeout(()=>{
            con.end()
        },2000)
    })
}

function agregarseries(ID){
    let con = mysql.createConnection(condata);
    return new Promise((Pres,Prej)=>{
        let query = `SELECT serie.internalId As SER_UID, serie.publicId As SER_ID, modalidad.value As MODALIDAD 
        FROM Resources serie
        JOIN MainDicomTags modalidad ON modalidad.id = serie.internalId
        WHERE serie.parentId=${ID}
        AND modalidad.tagGroup=8 AND modalidad.tagElement=96`
        con.connect();
        con.query(query,async (err, res, field)=>{
            for(let i = 0 ; i <= res.length-1 ; i++){
                let nombre = await getnombre(res[i].SER_UID,i)
                res[i].NOMBRE = nombre
                let archivos = await getarchivos(res[i].SER_UID)
                res[i].FILES = archivos
            }
            Pres(res)
        })
        con.end()
    })
}

function getnombre(ID,i){
    let con = mysql.createConnection(condata);
    return new Promise((Pres,Prej)=>{
        let query = `SELECT value as NOMBRE 
                    FROM medicaltec.MainDicomTags 
                    WHERE (id = ${ID} and tagGroup = 8 and tagElement = 4158) or (id = ${ID} and tagGroup = 24 and tagElement = 5120)`
            con.connect();
            con.query(query,(err,res)=>{
            try{
                Pres(res[0].NOMBRE)
            }catch(e){
                Pres(`serie-${i}`)
            }
        })
        con.end()
    })
}

function getarchivos(ID){
    let con = mysql.createConnection(condata);
    return new Promise((Pres,Prej)=>{
        let query = `select instancia.uuid As INS_UID 
        FROM medicaltec.Resources serie 
        JOIN medicaltec.AttachedFiles instancia ON serie.internalId = instancia.id 
        WHERE serie.parentId = ${ID} AND serie.resourceType = 3 AND instancia.fileType = 1`
        let query1 = `SELECT  main.value as POS, att.uuid as INS_UID 
        FROM medicaltec.Resources res 
        JOIN medicaltec.MainDicomTags main on res.internalId = main.id 
        JOIN medicaltec.AttachedFiles att on res.internalId = att.id 
        WHERE res.parentId = ${ID} and main.tagGroup = 32 and main.tagElement = 19 and att.fileType = 1;`
        con.connect();
        con.query(query1,(err,res)=>{
            let resorden = ordenar(res)
            //console.log(resorden)
            Pres(resorden)
        })
        con.end()
    })
}

function ordenar(files){
    let largo = files.length-1
    while(largo > 0){
        for(let i = 0 ; i<= largo-1 ; i++){
            let ini = parseInt(files[i].POS)
            let ad = parseInt(files[i+1].POS)
            if(ini > ad){
                let aux = files[i+1]
                files[i+1] = files[i]
                files[i] = aux
            }
        }
        largo--
    }
    return(files)
}

exports.files = function files(ID){
    return new Promise((Pres,Prej)=>{
        let con = mysql.createConnection(condata);
        con.connect();
        let query = `SELECT content 
        FROM StorageArea where uuid = "${ID}";`
        con.query(query,(err,res)=>{
            try{
                Pres(res[0].content)
            }catch(e){
                fs.appendFileSync("./errorslogs/error.txt",`${new Date()}---->${ID}---->${e}\n`)
                Pres(null)
            }
        })
        con.end()
    })
}

exports.files2 = function files2(ID){
    return new Promise((Pres,Prej)=>{
        let con = mysql.createConnection(condata);
        con.connect();
        let query = `SELECT content 
        FROM StorageArea where uuid = "${ID}";`
        con.query(query,(err,res)=>{
            try{
                Pres(res[0].content)
            }catch(e){
                fs.appendFileSync("./errorslogs/error.txt",`${new Date()}---->${ID}---->${e}\n`)
                Pres(null)
            }
        })
        con.end()
    })
}

module.exports.externo = async function externo(token){
    return new Promise((Pres,Prej)=>{
        try{
            let estudio = jwt.verify(token,'Medicaltec3101')
            let con = mysql.createConnection(condata);
            let query = `SELECT fecha.id as ID, fecha.value as FECHA, nombre.value as NOMBRE, sexo.value as SEXO, pasid.value as PAS_ID 
            FROM medicaltec.MainDicomTags fecha 
            JOIN medicaltec.MainDicomTags nombre ON nombre.id = fecha.id 
            JOIN medicaltec.MainDicomTags sexo ON sexo.id = fecha.id
            JOIN medicaltec.MainDicomTags pasid ON pasid.id = fecha.id  
            WHERE fecha.id = ${estudio.ID} and fecha.tagGroup=8 and fecha.tagElement=32 and nombre.tagGroup=16 and nombre.tagElement=16 and sexo.tagGroup=16 and sexo.tagElement=64 and pasid.tagGroup=16 and pasid.tagElement=32;`
            con.connect()
            con.query(query,async (err,sqlres)=>{
                let series = await agregarseries(sqlres[0].ID)
                sqlres[0].SERIES = series
                Pres({estado:true,estudio:sqlres[0]})
            })
            con.end()
        }catch(e){
            Pres({estado:false,estudio:null})
        }
    })
}

module.exports.medibook = async function medibook(id){
    let con = mysql.createConnection(condata);
    return new Promise((Pres,Prej)=>{
        let query = `select  PATID.id as ID, FECHA.value as FECHA 
        from medicaltec.MainDicomTags PATID 
        join medicaltec.MainDicomTags FECHA on PATID.id = FECHA.id
        where PATID.tagGroup=16 and PATID.tagElement=32 and PATID.value=${id} and FECHA.tagGroup=8 and FECHA.tagElement=32`
        con.connect()
        con.query(query,(err,sqlres)=>{
            Pres({estado:true,estudio:sqlres})
        })
    })
}