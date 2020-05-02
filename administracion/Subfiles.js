module.exports = function SubRutas(ruta = String) {
  switch (ruta) {
    case "Dashboard":
      return "./administracion/viewes/dashboard.html";
    case "Usuarios":
      return "./administracion/viewes/usuarios.html";
    case "Estudios":
      return "./administracion/viewes/Estudios.html";
    case "Difucion":
      return "./administracion/viewes/difucion.html";
    default:
      return "./administracion/viewes/dashboard.html";
  }
};
