function mensaje(datos,modalidad,nombre){
return(

    `
            <!DOCTYPE html>
            <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html xmlns="http://www.w3.org/1999/xhtml">
              <head>
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
              </head>
              <body style="padding: 0px;margin: 0px;">
                <table
                  border="0"
                  cellpadding="40"
                  cellspacing="0"
                  width="100%"
                  bgcolor="#E7EEF0"
                >
                  <tr>
                    <td>
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        width="600"
                        style="border-collapse: collapse;"
                      >
                        <tr>
                          <td
                            align="center"
                            bgcolor="#ffffff"
                            style="padding: 40px 0 30px 0;"
                          >
                            <img
                              src="https://uploads.codesandbox.io/uploads/user/ce79f30c-541c-437c-9d78-8f7844094ac3/3-sz-logoletras.png"
                              alt="med"
                              width="300"
                              height="350"
                              style="display: block;"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                              <tr>
                                <td
                                  align="center"
                                  style="font-size: 30px;font-weight: bold;font-family: monospace;"
                                >
                                  Sistema de Envio de Estudios
                                </td>
                              </tr>
            
                              <tr>
                                <td
                                  style="padding: 20px 5px 30px 5px;font-size: 20px;font-family: monospace;"
                                >
                                  Medicaltec Soluciones Envia este correo electronico para
                                  notificar que ya tiene acceso a el estudio de:<span style="font-weight: bold;"> ${modalidad} </span>
                                  del paciente:<span style="font-weight: bold;"> ${nombre} </span>haciendo click
                                  en el enlace inferior:
                                </td>
                              </tr>
            
                              <tr>
                                <td align="center">
                                  <a href="${datos}">
                                    <table width="100px">
                                      <tr>
                                        <td
                                          bgcolor="#C63D2D"
                                          align="center"
                                          style="color: white;padding: 10px 0px 10px 0px"
                                        >
                                          VER
                                        </td>
                                      </tr>
                                    </table>
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td
                            bgcolor="#C63D2D"
                            style="color: white;padding: 10px 10px 10px 10px"
                          >
                            ${datos}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </body>
            </html>
            `
)
}
module.exports.mail = mensaje