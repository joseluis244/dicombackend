const Usuario = require("./modelos/usuarios");

exports.creardb = async function creardb(telefono, correo) {
    let mail = correo.toUpperCase() 
  let admin = new Usuario({
    DATOS: {
      NOMBRE: "admin",
      APELLIDO: "admin",
      TELEFONO: telefono,
      CORREO: mail
    },
    LOGIN: { USUARIO: "admin", PASSWORD: "admin" },
    CONFIGURACION: {
      LISTABLE: false,
      RESTRINGIDO: false,
      TIPO: "admin",
      ESTADO: "activo",
      FECHACREACION: new Date(),
      ULTIMOACCESO: new Date()
    }
  });
  await admin.save()
  console.log(admin)
};
