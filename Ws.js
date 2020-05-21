let NegReg = [];
let RemReg = [];
let Asociaciones = [];

module.exports = async function Wss(http) {
  var io = require("socket.io")(http);

  io.on("connection", (socket) => {
    socket.on("init", (data) => {
      NegReg.push({id:socket.id,data:data});
      console.log(NegReg.indexOf("A"))
    });
    socket.on("disconnect",()=>{
      console.log("desconectado")
      console.log(socket.id)
    })
  });
};
