const Usuarios = require("../modelos/usuarios")
const Difucion = require("../modelos/listaclientes")

module.exports.ListaUsuarios = async ()=>{
    let usuarios = await Usuarios.find({ "DATOS.NOMBRE": { $ne: "admin" } })
    return usuarios
}
module.exports.CrearUsuario = async (user)=>{
    let correo = await Usuarios.find({ "DATOS.CORREO": user.DATOS.CORREO })
    if(correo.length>0){
        return false
    }
    let Nusuario = new Usuarios(user)
    await Nusuario.save()
    if(user.CONFIGURACION.LISTABLE){
        let NuevoUsuarioDif = new Difucion({
            nombre:user.DATOS.NOMBRE+" "+user.DATOS.APELLIDO,
            area:"Local",
            correo:user.DATOS.CORREO,
            prefijo:user.DATOS.PREFIJO,
            telefono:user.DATOS.TELEFONO
        })
        await NuevoUsuarioDif.save()
    }
    return true
}
module.exports.BorrarUsuario = async (id)=>{
    let user = Usuarios.findById(id)
    await user.remove()
    return true
}
module.exports.getdifucion = async ()=>{
let difucion = await Difucion.find()
return difucion
}