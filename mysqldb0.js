const mysql = require("mysql");
var DBMEMORI = {activo:false,registros:[],cantidadregistros:0}
const condata = {
  host: "localhost",
  user: "medicaltecmysql",
  password: "Medicaltec310188$",
  database: "medicaltec",
};
DBmemoria()
setInterval(() => {
if(!DBMEMORI.activo){
	DBmemoria()
}
}, 60000);

/*function DBmemoria() {
	activo = true
  ConsultaEstudios(19000101, 40001212)
    .then((res) => {
      if (res.length > 0) {
        DBMEMORI = CrearLista(res);
      } else {
        DBMEMORI=[]
      }
  	activo=false
    })
    .catch((e) => {
      console.log(e);
    });
}*/

function DBmemoria() {
  DBMEMORI.activo = true
  ContarRegistros()
  .then(cantidadregistros=>{
    if(cantidadregistros != DBMEMORI.cantidadregistros){
      ConsultaEstudios(19000101, 40001212)
      .then((res) => {
        if (res.length > 0) {
          DBMEMORI.registros = CrearLista(res);
        } else {
          DBMEMORI.registros = []
        }
        DBMEMORI.activo = false
      })
      .catch((e) => {
        console.log(e);
      });
    }else{
      DBMEMORI.activo = false
    }
  })
}

/**
 * cuenta los registros de la base de datos
 */
function ContarRegistros(){
  let con = mysql.createConnection(condata);
  let query = `SELECT count(*) as cantidad FROM medicaltec.MainDicomTags;`
  con.connect();
  return new Promise((Pres,Prej)=>{
    con.query(query, (err, res) => {
      if(err){
        Prej(err)
      }
      Pres(res);
    });
    con.end();
  })
}

/**
 * objeto Estudio
 */
class Estudio {
  /**
   * 
   * @param {Array} elemento primer elemento del array
   */
  constructor(elemento) {
    this.ID = elemento.ID;
    this.FECHA = elemento.FECHA;
    this.NOMBRE = elemento.NOMBRE;
    this.SEXO = elemento.SEXO;
    this.PAS_ID = elemento.PAS_ID;
    this.EST_UID = elemento.EST_UID;
    this.SERIES = [
      {
        SER_UID: elemento.SER_UID,
        SER_ID: elemento.SER_ID,
        MODALIDAD: elemento.MODALIDAD,
        NOMBRE: elemento.NOMBRE_EST,
        FILES: [
          {
            POS: elemento.POS,
            INS_UID: elemento.INS_UID,
          },
        ],
      },
    ];
  }
  agregarserie(elemento) {
    this.SERIES.push({
      SER_UID: elemento.SER_UID,
      SER_ID: elemento.SER_ID,
      MODALIDAD: elemento.MODALIDAD,
      NOMBRE: elemento.NOMBRE_EST,
      FILES: [
        {
          POS: elemento.POS,
          INS_UID: elemento.INS_UID,
        },
      ],
    });
  }
  agregararchivo(elemento) {
    let pos = this.SERIES.length-1;
    this.SERIES[pos].FILES.push(
        {
            POS: elemento.POS,
            INS_UID: elemento.INS_UID,
        }
    )
  }
}
/**
 * 
 * @param {Number} fechainicio formato de fecha YYYYMMDD
 * @param {Number} fechafinal formato de fecha YYYYMMDD
 */
function ConsultaEstudios(fechainicio,fechafinal) {
  let con = mysql.createConnection(condata);
  let query1 = `SELECT A.id as ID, A.value as FECHA, B.value as NOMBRE,C.value as SEXO, D.value as PAS_ID,E.publicId as EST_UID,
    F.internalId as SER_UID,F.publicId as SER_ID, G.value as NOMBRE_EST, H.value as MODALIDAD, j.uuid as INS_UID, K.value as POS
    FROM medicaltec.MainDicomTags A 
    left join (SELECT * FROM medicaltec.MainDicomTags where tagGroup=16 and tagElement=16) B on A.id = B.id
    left join (SELECT * FROM medicaltec.MainDicomTags where tagGroup=16 and tagElement=64) C on A.id = C.id
    left join (SELECT * FROM medicaltec.MainDicomTags where tagGroup=16 and tagElement=32) D on A.id = D.id
    left join (SELECT * FROM medicaltec.Resources where resourceType=1) E on E.internalId = A.id
    /*agregar serie*/
    left join (SELECT * FROM medicaltec.Resources where resourceType=2) F on A.id = F.parentId
    left join (SELECT * FROM medicaltec.MainDicomTags where (tagGroup=8 and tagElement=4158)or(tagGroup = 24 and tagElement = 5120)) G on G.id = F.internalId
    left join (SELECT * FROM medicaltec.MainDicomTags where tagGroup=8 and tagElement=96) H on H.id = F.internalId
    /*imagenes*/
    left join (SELECT * FROM medicaltec.Resources where resourceType = 3) I on I.parentId = H.id
    left join (SELECT * FROM medicaltec.AttachedFiles where fileType = 1) J on J.id = I.internalId
    left join (SELECT * FROM medicaltec.MainDicomTags where tagGroup = 32 and tagElement = 19) K on J.id = K.id
    /*ordenamiento*/
    where A.tagGroup = 8 and A.tagElement = 32 
    ORDER BY 
    A.value DESC,
    A.id DESC,
    F.internalId ASC,
    cast(K.value as UNSIGNED) ASC;`;
let query2 = `SELECT A.id as ID, A.value as FECHA, B.value as NOMBRE,C.value as SEXO, D.value as PAS_ID,E.publicId as EST_UID,
    F.internalId as SER_UID,F.publicId as SER_ID, G.value as NOMBRE_EST, H.value as MODALIDAD, J.uuid as INS_UID, K.value as POS
    FROM medicaltec.MainDicomTags A 
    left join (SELECT * FROM medicaltec.MainDicomTags where tagGroup=16 and tagElement=16) B on A.id = B.id
    left join (SELECT * FROM medicaltec.MainDicomTags where tagGroup=16 and tagElement=64) C on A.id = C.id
    left join (SELECT * FROM medicaltec.MainDicomTags where tagGroup=16 and tagElement=32) D on A.id = D.id
    left join (SELECT * FROM medicaltec.Resources where resourceType=1) E on E.internalId = A.id
    /*agregar serie*/
    left join (SELECT * FROM medicaltec.Resources where resourceType=2) F on A.id = F.parentId
    left join (SELECT * FROM medicaltec.MainDicomTags where (tagGroup=8 and tagElement=4158)or(tagGroup = 24 and tagElement = 5120)) G on G.id = F.internalId
    left join (SELECT * FROM medicaltec.MainDicomTags where tagGroup=8 and tagElement=96) H on H.id = F.internalId
    /*imagenes*/
    left join (SELECT * FROM medicaltec.Resources where resourceType = 3) I on I.parentId = H.id
    left join (SELECT * FROM medicaltec.AttachedFiles where fileType = 1) J on J.id = I.internalId
    left join (SELECT * FROM medicaltec.MainDicomTags where tagGroup = 32 and tagElement = 19) K on J.id = K.id
    /*ordenamiento*/
    where A.tagGroup = 8 and A.tagElement = 32 and A.value >= ${fechainicio} and A.value <= ${fechafinal}
    ORDER BY 
    A.value DESC,
    A.id DESC,
    F.internalId ASC,
    cast(K.value as UNSIGNED) ASC;`;
    let query = (fechainicio == undefined || fechafinal == undefined)?query1:query2
  con.connect();
  return new Promise((Pres, Prej) => {
    con.query(query, (err, res) => {
      Pres(res);
    });
    con.end();
  });
}



function CrearLista(array) {
  let lista = [new Estudio(array[0])];
  let cont = 0;
  for (let index = 1; index < array.length; index++) {
    const element = array[index];
    const elementPass = array[index - 1];
    if (element.ID == elementPass.ID) {
      if (element.SER_UID == elementPass.SER_UID) {
        lista[cont].agregararchivo(element);
      } else {
        lista[cont].agregarserie(element);
      }
    } else {
        lista.push(new Estudio(element));
        cont++;
    }
  }
  return(lista);
}
/**
 * 
 * @param {Number} I fecha inicio formato de fecha YYYYMMDD
 * @param {Number} F fecha final formato de fecha YYYYMMDD
 */
module.exports.GetListaEstudios = (I,F)=>{
    return new Promise((Pres,Prej)=>{
      let envio = []
      for (let index = 0; index < DBMEMORI.registros.length; index++) {
        const element = DBMEMORI.registros[index];
        if(element.FECHA >= I && element.FECHA <= F){
          envio.push(element)
        }
      }
      Pres(envio)
        /*ConsultaEstudios(I,F)
        .then((res) => {
            if(res.length > 0){
                let ListaEstudios = CrearLista(res);
                Pres(ListaEstudios)
            }else{
                Pres([])
            }
        })
        .catch(err=>{
          console.log(err)
        })*/
    })
}