const mysql = require('mysql');
const checkDiskSpace = require('check-disk-space');
const DiskRuta = require("./disk.json");

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
        this.EstudiosModalidadDia = [];
        this.EstudiosMaquinasDia = [];
        this.EstudiosModalidadMes = [];
        this.EstudiosMaquinasMes = [];
        this.EstudiosModalidad24 = [];
    }
}

module.exports = async function (){
    let respuesta = new Estadistica();
    respuesta.CantidadEstudios = await CantidadEstudios();
    respuesta.UsoDisco=await UsoDisco()
    return respuesta
}

function CantidadEstudios(){
    let con = mysql.createConnection(condata);
    return new Promise ((Pres,Prej)=>{
        let query = `SELECT * FROM medicaltec.resources where resourceType=1;`;
        con.connect();
        con.query(query,(err, res) => {
            Pres(res.length)
        })
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