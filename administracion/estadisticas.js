const mysql = require('mysql');
const checkDiskSpace = require('check-disk-space');
const DiskRuta = require("./disk.json");
const moment = require("moment");
moment.locale("es")

const condata = {
    host: "localhost",
    user: "medicaltecmysql",
    password: "Medicaltec310188$",
    database: "medicaltec"
};
class Estadistica{
    constructor(){
        this.CantidadEstudios = 0;
        this.UsoDisco = 0;
        this.EstudiosModalidadDia = 0;
        this.EstudiosMaquinasDia = {};
        this.EstudiosModalidadMes = {};
        this.EstudiosMaquinasMes = {};
        this.EstudiosModalidad24 = {};
    }
}

module.exports.Dashboard = async function (){
    let respuesta = new Estadistica();
    respuesta.CantidadEstudios = await CantidadEstudios();
    respuesta.UsoDisco=await UsoDisco();
    respuesta.EstudiosModalidadDia = await EstudiosModalidad(moment().subtract(1, 'days').format("YYYYMMDD"),moment().format("YYYYMMDD"));
    respuesta.EstudiosMaquinasDia = await EstudiosMaquinas(moment().subtract(1, 'days').format("YYYYMMDD"),moment().format("YYYYMMDD"));
    respuesta.EstudiosModalidadMes = await EstudiosModalidad(moment().subtract(1, 'months').startOf('month').format("YYYYMMDD"),moment().format("YYYYMMDD"));
    respuesta.EstudiosMaquinasMes = await EstudiosMaquinas(moment().subtract(1, 'months').startOf('month').format("YYYYMMDD"),moment().format("YYYYMMDD"));
    respuesta.EstudiosModalidad24 = await getResporte24()
    return respuesta
}

function CantidadEstudios(){
    let con = mysql.createConnection(condata);
    return new Promise ((Pres,Prej)=>{
        let query = `SELECT * FROM Resources where resourceType=1;`;
        con.connect((err)=>{console.log(err)});
        con.query(query,(err, res) => {
            Pres(res.length)
        })
        con.end()
    })
}

function UsoDisco(){
    return new Promise((Pres,Prej)=>{
        checkDiskSpace(DiskRuta.ruta)
        .then((diskSpace) => {
            let Ucupado = (100*(diskSpace.size-diskSpace.free))/(diskSpace.size)
            Pres(Ucupado)
        })
    })
}
function EstudiosModalidad(inicio,fin){
    inicio = parseInt(inicio)
    fin = parseInt(fin)
    let con = mysql.createConnection(condata);
    return new Promise ((Pres,Prej)=>{
        let query = `SELECT RES.internalId as ID FROM medicaltec.Resources RES join medicaltec.MainDicomTags MD on RES.internalId = MD.id where (RES.resourceType=1 and (MD.tagGroup=8 and MD.tagElement=32)) and ( cast(MD.value as UNSIGNED) > ${inicio} and cast(MD.value as UNSIGNED) <= ${fin}) order by cast(MD.value as UNSIGNED) desc;`;
        con.connect();
        con.query(query,async (err,res)=>{
            for (let i = 0; i < res.length; i++) {
                res[i].MOD = await getModalidad(res[i].ID)
            }
            let Contar = await contar(res)
            Pres(Contar)
        })
        con.end()
    })
}

function getModalidad(ID){
    let con = mysql.createConnection(condata);
    return new Promise (async (Pres,Prej)=>{
        let query = `SELECT MD.value as MODAL FROM medicaltec.Resources RES join medicaltec.MainDicomTags MD on RES.internalId=MD.id where RES.resourceType=2 and RES.parentId = ${ID} and (MD.tagGroup=8 and MD.tagElement=96) limit 1;`;
        con.connect();
        con.query(query,(err,res)=>{
            Pres(res[0].MODAL)
        })
        con.end()
    })
}

function contar(DATA){
    let comprobante = []
    let listaModalidades = {}
    for (let i = 0; i < DATA.length; i++) {
        if(comprobante.indexOf(DATA[i].MOD)===-1){
            comprobante.push(DATA[i].MOD)
            listaModalidades[DATA[i].MOD] = 1
        }else{
            listaModalidades[DATA[i].MOD] = listaModalidades[DATA[i].MOD] + 1
        }
    }
    return listaModalidades
}
//////////////////////////////////////MAQUINA////////////////////////////////////
function EstudiosMaquinas(inicio,fin){
    inicio = parseInt(inicio)
    fin = parseInt(fin)
    let con = mysql.createConnection(condata);
    return new Promise ((Pres,Prej)=>{
        let query = `SELECT RES.internalId as ID FROM medicaltec.Resources RES join medicaltec.MainDicomTags MD on RES.internalId = MD.id where RES.resourceType=1 and (MD.tagGroup=8 and MD.tagElement=32) and ( cast(MD.value as UNSIGNED) > ${inicio} and cast(MD.value as UNSIGNED) <= ${fin}) order by cast(MD.value as UNSIGNED) desc;`;
        con.connect();
        con.query(query,async (err,res)=>{
            for (let i = 0; i < res.length; i++) {
                res[i].AE = await getMaquina(res[i].ID)
            }
            let Contar = await contarAE(res)
            Pres(Contar)
        })
        con.end()
    })
}

function getMaquina(ID){
    let con = mysql.createConnection(condata);
    return new Promise ((Pres,Prej)=>{
        let query = `SELECT internalId as IntID FROM medicaltec.Resources where resourceType=2 and parentId=${ID} limit 1;`;
        con.connect();
        con.query(query,async (err,res)=>{
            let AE = await getAE(res[0].IntID)
            Pres(AE)
        })
        con.end()
    })
}

function getAE(ID){
    let con = mysql.createConnection(condata);
    return new Promise ((Pres,Prej)=>{
        let query = `SELECT MD.value as AE FROM medicaltec.Resources RES join medicaltec.Metadata MD on RES.internalId = MD.id where RES.resourceType=3 and RES.parentId=${ID} and (MD.type = 3) limit 1;`;
        con.connect();
        con.query(query,async (err,res)=>{
            Pres(res[0].AE)
        })
        con.end()
    })
}
function contarAE(DATA){
    let comprobante = []
    let listaAE = {}
    for (let i = 0; i < DATA.length; i++) {
        if (comprobante.indexOf(DATA[i].AE)===-1) {
            comprobante.push(DATA[i].AE)
            listaAE[DATA[i].AE] = 1
        }else{
            listaAE[DATA[i].AE] = listaAE[DATA[i].AE] + 1
        }
    }
    return(listaAE)
}
//////////////////////////////////////////////////////////////////////////////


class DataSet{
    constructor(array){
        this.DataSet = []
        for (let i = 0; i < array.length; i++) {
            this.DataSet.push({
                label:array[i],
                data : new Array(25).fill(0)
            })
        }
    }
    asignar(Obj,pos){
        let keys = Object.keys(Obj)
        for (let i = 0; i < this.DataSet.length; i++) {
            for (let j = 0; j < keys.length; j++) {
                if(this.DataSet[i].label === keys[j]){
                    this.DataSet[i].data[pos] = Obj[keys[j]]
                }
            }
        }
    }
}
//////////////24MESES///////////////////////////////
async function getResporte24(){
    let Labs = []
    let inicio = moment().subtract(24, 'month').startOf('month').format("YYYYMMDD");
    let fin = moment().format("YYYYMMDD");
    let Modalidades = Object.keys(await EstudiosModalidad(inicio,fin))
    let DatasetSend = new DataSet(Modalidades)
    for (let i = 24; i >= 0; i--) {
        Labs.push(moment().subtract(i, 'month').format("MMMYY"))
        let inicioM = moment().subtract(i, 'month').startOf('month').format("YYYYMMDD");
        let finM = moment().subtract(i, 'month').endOf('month').format("YYYYMMDD");
        let datames = await EstudiosModalidad(inicioM,finM)
        DatasetSend.asignar(datames,24-i)
    }
    return({labs:Labs,dataset:DatasetSend})
}
/////////////////////////////////////////////////////
module.exports.ListaEstudios = function(){
    let con = mysql.createConnection(condata);
    return new Promise ((Pres,Prej)=>{
        /*let query = `select A.id as id,A.value as FECHA,C.value as NOMBRE,D.value as MODAL from medicaltec.MainDicomTags A
        join (select * from medicaltec.Resources group by parentId) B on B.parentId=A.id
        join (select * from medicaltec.MainDicomTags where tagGroup=16 and tagElement=16) C on C.id=A.id
        join (select * from medicaltec.MainDicomTags where tagGroup=8 and tagElement=96) D on D.id=B.internalId
        where A.tagGroup=8 and A.tagElement=32 order by cast(A.value as unsigned) asc;`*/
        let query = `SELECT B.id as id, A.publicId as UID, B.value as NOMBRE, C.value as FECHA FROM medicaltec.Resources A
        left join (select * from medicaltec.MainDicomTags where tagGroup=16 and tagElement=16) B on A.internalId = B.id
        left join (select * from medicaltec.MainDicomTags where tagGroup=8 and tagElement=32) C on A.internalId = C.id
        where A.resourceType=1 order by C.value asc;`
        con.connect();
        con.query(query,async (err,res)=>{
            for (let index = 0; index < res.length; index++) {
                const element = res[index].id;
                let MODAL = await getModalidades(element)
                res[index].MODAL = MODAL[0].MODAL
            }
            Pres(res)
        })
        con.end()
    })
}

async function getModalidades(id){
    return new Promise ((Pres,Prej)=>{
        let con = mysql.createConnection(condata);
        let query = `select B.value as MODAL from medicaltec.Resources A
        left join (select * from medicaltec.MainDicomTags where tagGroup=8 and tagElement=96) B on A.internalId=B.id
        where A.resourceType=2 and A.parentId=${id} limit 1;`
        con.connect();
        con.query(query,(err,res)=>{
            Pres(res)
        })
        con.end()
    })
}