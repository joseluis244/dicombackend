const jwt = require("jsonwebtoken")
const jwtsecreto = "Medicaltec310188$"

module.exports.validar = async function validar(token){
    try{
        let data = await jwt.verify(token,jwtsecreto)
        return({valido:true,data:data,token:token})
    }catch(e){
        return({valido:false,data:null,token:null})
    }
}