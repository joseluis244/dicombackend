class Negatoscopio {
  constructor() {
    this.type = "neg";
    this.CODE = "";
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }
  asignarcodigo(code) {
    this.CODE = code;
  }
}
class Mensaje {
  constructor(tipo, data) {
    this.Tipo = tipo;
    this.Data = data;
  }
}
let socket = io();
let DOMimg = document.getElementById("Imagenes")
let DOMcontenedor = DOMimg.querySelector(".ContImagenes")
function enviar() {
  let mensaje = new Mensaje("test", "sssssss");
  websocket.send(JSON.stringify({ FF: "asdasdasd" }));
}
function Generarcodigo(){
    return Math.random().toString(16).substring(2, 6).toUpperCase();
}
function inicioSocket(negatoscopio){
  socket.emit("init",negatoscopio)
}
async function init() {
  let negatoscopio = new Negatoscopio();
  let screen_ID = Generarcodigo()
  let Pantalla = document.getElementById("ID_Conect");
  negatoscopio.asignarcodigo(screen_ID);
  Pantalla.querySelector("#SCREEN_CODE").innerHTML = screen_ID;

  inicioSocket(negatoscopio)
}


function ConfigurarLayout(filas,columnas){
  DOMcontenedor.style.gridTemplateColumns = `repeat(${columnas}, 1fr)`
  DOMcontenedor.style.gridTemplateRows = `repeat(${filas}, 1fr)`
}


function CrearImagenes(filas,columnas){
  let total = filas * columnas
  for (let i = 0; i < total; i++) {
    const element = document.createElement("div");
    element.className = "ImgBox"
    DOMcontenedor.appendChild(element)
  }
}

init();
ConfigurarLayout(6,5)
CrearImagenes(6,5)