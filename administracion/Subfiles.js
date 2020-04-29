module.exports = function SubRutas(ruta=String){
    switch (ruta) {
        case "Dashboard":
            return("./administracion/viewes/dashboard.html")
        default:
            return("./administracion/viewes/dashboard.html")
    }
}