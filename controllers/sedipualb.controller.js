/**
 * Controlador para los Servicios Sedipualb.
 * @namespace SedipualbaController
 */

const crypto = require("crypto");
const soap = require("soap");
const { Pool } = require("pg");
const con = require("./connectionString.js");
const { clear } = require("console");

const pool = new Pool({
  user: con.username,
  password: con.password,
  host: con.host,
  database: con.database,
  port: con.port,
});

let entorno="DEV";
let idEntidad="";
let wsseg_user="";
let clearPassword="";
let url_sedipualba="";
let clientSoap = null;

(async () => {
  try {
    const select = `select * from pass_sedipualba where entorno='${entorno}'`;
    const response = await pool.query(select);
   
    wsseg_user=response.rows[0].user;
    clearPassword=response.rows[0].clear_password;
    url_sedipualba=response.rows[0].url;
    idEntidad=response.rows[0].id_entidad;

    soap.createClient(
      url_sedipualba,
      (err, client) => {
        if (err) {
          console.error(err);
          return;
        }
    
        clientSoap = client;
      }
    );
    
  } catch (error) {
    console.error("Error en servicio postgis/soap:", error);
    res.status(500).send("Error en el servidor");
  }
})();


const getHashedPassword = async (clearPassword) => {
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace("T", "")
    .split(".")[0];

  const hashInputString = timestamp + clearPassword;

  const hash = crypto
    .createHash("sha256")
    .update(hashInputString, "utf8")
    .digest("base64");

  return timestamp + hash;
};

const setEntorno = async (req, res) => {

  const entorno = req.query.entorno;
  try {
    const select = `select * from pass_sedipualba where entorno='${entorno}'`;
    const response = await pool.query(select);
   
    wsseg_user=response.rows[0].user;
    clearPassword=response.rows[0].clear_password;
    url_sedipualba=response.rows[0].url;
    idEntidad=response.rows[0].id_entidad;

    soap.createClient(
      url_sedipualba,
      (err, client) => {
        if (err) {
          console.error(err);
          return;
        }
    
        clientSoap = client;
        res.send(200);
      }
    );
    
  } catch (error) {
    console.error("Error en servicio SetEntono:", error);
    res.status(500).send("Error en el servidor");
  }
}

const ListGeorreferenciasExpediente = async (req, res) => {
 
  const codigoExpediente = req.query.codigoExpediente;

  const hashedPassword = await getHashedPassword(clearPassword);

  const args1 = {
    idEntidad: idEntidad,
    wsSegUser: wsseg_user,
    wsSegPass: hashedPassword,
    codigoExpediente: codigoExpediente,
  };

  clientSoap.ListGeorreferenciasExpediente(args1, async (err, result) => {
    if (err) {
      console.error(err);
      return;
    }
    res.send(result);
  });
};

/**
 * Obtiene url del expediente como usuario segex utilizando un servicio SOAP.<br>
 *
 * Endpoint: <strong>https://nombre_dominio/opg/obtenerInfoDocumento</strong>
 *
 * @memberof SedipualbaController
 * @param {object} req - Objeto de solicitud HTTP.
 * @param {string} req.query.wsseg_user - Usuario del servicio web.
 * @param {string} req.query.clearPassword - Contraseña sin cifrar.
 * @param {string} req.query.pk_entidad - Clave primaria de la entidad.
 * @param {string} req.query.codigoExpediente - Clave primaria del documento.
 * @param {object} res - Objeto de respuesta HTTP.
 * @returns {Promise} La respuesta se envía al cliente HTTP.
 * @throws {Error} Si hay un error en la solicitud SOAP, se registra y se devuelve un mensaje de error.
 */
const getUrlDetalleExpediente = async (req, res) => {
  try {
    // Obtiene los parámetros de la solicitud
    //const wsseg_user = req.query.wsseg_user;
    //const clearPassword = req.query.clearPassword;
    //const pk_entidad = req.query.pk_entidad;
    const codigoExpediente = req.query.codigoExpediente;

    // Obtiene la contraseña encriptada
    const hashedPassword = await getHashedPassword(clearPassword);

    const args1 = {
      wsseg_user: wsseg_user,
      wsseg_pass: hashedPassword,
      pk_entidad: idEntidad,
      codigoExpediente: codigoExpediente,
    };

    // Llama al servicio SOAP para obtener la información del expediente
    clientSoap.ObtenerUrlDetalleExpedienteComoUsuarioSegexConCertificado(args1, async (err, result) => {
      if (err) {
        // Manejo de errores: registra el error y envía un mensaje de error al cliente
        console.error(err);
        return;
      }
      // Envía la información del documento como respuesta al cliente
      res.send(result);
    });
  } catch (error) {
    // Manejo de errores: registra el error y envía un mensaje de error al cliente
    console.error("Error en la solicitud SOAP:", error);
    res.status(500).send("Error en el servidor");
  }
};

/**
 * Obtiene información del documento utilizando un servicio SOAP.<br>
 *
 * Endpoint: <strong>https://nombre_dominio/opg/obtenerInfoDocumento</strong>
 *
 * @memberof SedipualbaController
 * @param {object} req - Objeto de solicitud HTTP.
 * @param {string} req.query.wsseg_user - Usuario del servicio web.
 * @param {string} req.query.clearPassword - Contraseña sin cifrar.
 * @param {string} req.query.pk_entidad - Clave primaria de la entidad.
 * @param {string} req.query.pkDocumento - Clave primaria del documento.
 * @param {object} res - Objeto de respuesta HTTP.
 * @returns {Promise} La respuesta se envía al cliente HTTP.
 * @throws {Error} Si hay un error en la solicitud SOAP, se registra y se devuelve un mensaje de error.
 */
const getInfoDocumento = async (req, res) => {
  try {
    // Obtiene los parámetros de la solicitud
    const wsseg_user = req.query.wsseg_user;
    const clearPassword = req.query.clearPassword;
    const pk_entidad = req.query.pk_entidad;
    const pkDocumento = req.query.pkDocumento;

    // Obtiene la contraseña encriptada
    const hashedPassword = await getHashedPassword(clearPassword);

    const args1 = {
      wsseg_user: wsseg_user,
      wsseg_pass: hashedPassword,
      pk_entidad: pk_entidad,
      pkDocumento: pkDocumento,
    };

    // Llama al servicio SOAP para obtener la información del documento
    clientSoap.ObtenerInfoDocumento(args1, async (err, result) => {
      if (err) {
        // Manejo de errores: registra el error y envía un mensaje de error al cliente
        console.error(err);
        return;
      }
      // Envía la información del documento como respuesta al cliente
      res.send(result);
    });
  } catch (error) {
    // Manejo de errores: registra el error y envía un mensaje de error al cliente
    console.error("Error en la solicitud SOAP:", error);
    res.status(500).send("Error en el servidor");
  }
};

/**
 * Obtiene una lista de carpetas versión 2 utilizando un servicio SOAP.<br>
 *
 * Endpoint: <strong>https://nombre_dominio/opg/listarCarpetasV2</strong>
 *
 * @memberof SedipualbaController
 * @param {Object} req - El objeto de solicitud.
 * @param {string} req.query.wsseg_user - Nombre de usuario para el servicio.
 * @param {string} req.query.clearPassword - Contraseña en texto claro.
 * @param {string} req.query.pkEntidad - Clave primaria de la entidad.
 * @param {string} req.query.codigoExpediente - Código del expediente.
 * @param {string} req.query.pkCarpetaPadre - Clave primaria de la carpeta padre.
 * @param {Object} res - El objeto de respuesta.
 * @returns {Promise} Una promesa que resuelve con la lista de carpetas o un mensaje de error.
 * @throws {Error} Si hay un error en la solicitud SOAP, se registra y se devuelve un mensaje de error.
 */
const getListarCarpetasV2 = async (req, res) => {
  try {
    // Obtiene los parámetros de la solicitud
    const wsseg_user = req.query.wsseg_user;
    const clearPassword = req.query.clearPassword;
    const pkEntidad = req.query.pkEntidad;
    const codigoExpediente = req.query.codigoExpediente;
    const pkCarpetaPadre = req.query.pkCarpetaPadre;

    // Obtiene la contraseña encriptada
    const hashedPassword = await getHashedPassword(clearPassword);

    // Configura los argumentos para la solicitud SOAP
    const args1 = {
      wsseg_user: wsseg_user,
      wsseg_pass: hashedPassword,
      pkEntidad: pkEntidad,
      codigoExpediente: codigoExpediente,
      pkCarpetaPadre: pkCarpetaPadre,
    };

    // Llama al servicio SOAP para obtener la lista de carpetas
    clientSoap.ListarCarpetasV2(args1, async (err, result) => {
      if (err) {
        // Manejo de errores: registra el error y envía un mensaje de error al cliente
        console.error(err);
        return;
      }
      // Envía la lista de carpetas como respuesta al cliente
      res.send(result);
    });
  } catch (error) {
    // Manejo de errores: registra el error y envía un mensaje de error al cliente
    console.error("Error en la solicitud SOAP:", error);
    res.status(500).send("Error en el servidor");
  }
};

const getListarDocumentosV2 = async (req, res) => {
  const clearPassword = req.query.clearPassword;
  const pkEntidad = req.query.pkEntidad;
  const codigoExpediente = req.query.codigoExpediente;
  const pkCarpetaPadre = req.query.pkCarpetaPadre;
  const nifUsuario = req.query.nifUsuario;

  const hashedPassword = await getHashedPassword(clearPassword);

  const args1 = {
    wsseg_user: "07040_SIGDU",
    wsseg_pass: hashedPassword,
    pkEntidad: pkEntidad,
    codigoExpediente: codigoExpediente,
    pkCarpetaPadre: pkCarpetaPadre,
    nifUsuario: nifUsuario,
  };

  clientSoap.ListarDocumentosV2(args1, async (err, result) => {
    if (err) {
      console.error(err);
      return;
    }
    res.send(result);
  });
};

/*const getListExpedientes = async (req, res) => {
  const clearPassword = req.query.clearPassword;
  const numPage = req.query.numPage;
  const estado = req.query.estado;
  const cdiInteresado = req.query.cdiInteresado;
  const nombreInteresado = req.query.nombreInteresado;
  const idNodoContenedorTramitador = req.query.idNodoContenedorTramitador;

  const hashedPassword = await getHashedPassword(clearPassword);
  console.log(hashedPassword);

  const args = {
    idEntidad: "07040",
    wsSegUser: "07040_SIGDU",
    wsSegPass: hashedPassword,
    numPagina: numPage,
    estado: estado,
    cdiInteresado: cdiInteresado,
    nombreInteresado: nombreInteresado,
    idNodoContenedorTramitador: idNodoContenedorTramitador,
  };

  clientSoap.ListExpedientes(args, async (err, result) => {
    if (err) {
      console.error(err);
      return;
    }
    res.send(result);
  });
};*/

const getListExpedientes = async (req, res) => {
  //console.log(clearPassword);
  //const clearPassword = req.query.clearPassword;

  let estado = req.query.estado || null;
  const cdiInteresado = req.query.cdiInteresado;
  const nombreInteresado = req.query.nombreInteresado;
  const materia = req.query.materia;
  const submateria = req.query.submateria;
  const tipoProcedimiento = req.query.tipoProcedimiento;
  const subtipoProcedimiento = req.query.subtipoProcedimiento;
  let idNodoContenedorTramitador = req.query.idNodoContenedorTramitador || null;

  const hashedPassword = await getHashedPassword(clearPassword);
  console.log(hashedPassword);

  let expedientes = [];
  let numPage = 0; // Se cambió a let para permitir reasignaciones
  let morePages = true;

  const fetchPage = async (page) => {
    return new Promise((resolve, reject) => {
      const args = {
        idEntidad: idEntidad,
        wsSegUser: wsseg_user,
        wsSegPass: hashedPassword,
        numPagina: page,
        estado: estado,
        cdiInteresado: cdiInteresado,
        nombreInteresado: nombreInteresado,
        idNodoContenedorTramitador: idNodoContenedorTramitador,
        //idNodoContenedorTramitador: "44689", // CONTENEDOR URBANISMO???
      };

      clientSoap.ListExpedientes(args, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  };

  try {
    while (morePages) {
      const result = await fetchPage(numPage);

      if (
        result.ListExpedientesResult &&
        result.ListExpedientesResult.InfoExpedienteV2.length > 0
      ) {
        result.ListExpedientesResult.InfoExpedienteV2.forEach((expediente) => {
          
          if (
            (expediente.CodigoSubmateria.substring(0, 2) == materia || materia == "TODAS") &&
            (expediente.CodigoSubmateria== submateria || submateria == "TODAS") &&
            (expediente.CodigoProcedimiento == tipoProcedimiento || tipoProcedimiento == "TODAS") &&
            (expediente.CodigoSubprocedimiento == subtipoProcedimiento || subtipoProcedimiento == "TODAS")
          ) {
            expedientes.push(expediente);
          }
        });
       
        console.log(`Página ${numPage} procesada`);
        numPage++;
      } else {
        morePages = false;
      }
    }
    res.send(expedientes);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener los expedientes");
  }
};

const getListMaterias = async (req, res) => {

  const hashedPassword = await getHashedPassword(clearPassword);
  console.log(hashedPassword);

  const args = {
    idEntidad: idEntidad,
    wsseg_user: wsseg_user,
    wsseg_pass: hashedPassword,
  };

  clientSoap.ListMaterias(args, async (err, result) => {
    if (err) {
      console.error(err);
      return;
    }
    res.send(result);
  });
};

const getListSubmaterias = async (req, res) => {

  const idMateria = req.query.idMateria;

  const hashedPassword = await getHashedPassword(clearPassword);
  console.log(hashedPassword);

  const args = {
    wsseg_user: wsseg_user,
    wsseg_pass: hashedPassword,
    idEntidad: idEntidad,
    idMateria: idMateria,
  };

  clientSoap.ListSubmaterias(args, async (err, result) => {
    if (err) {
      console.error(err);
      return;
    }
    res.send(result);
  });
};

const getListTiposProcedimiento = async (req, res) => {
 
  const idSubmateria = req.query.idSubmateria;

  const hashedPassword = await getHashedPassword(clearPassword);
  console.log(hashedPassword);

  const args = {
    wsseg_user: wsseg_user,
    wsseg_pass: hashedPassword,
    idEntidad: idEntidad,
    idSubmateria: idSubmateria,
  };

  clientSoap.ListTiposProcedimiento(args, async (err, result) => {
    if (err) {
      console.error(err);
      return;
    }
    res.send(result);
  });
};

const getListSubtiposProcedimiento = async (req, res) => {
 
  const idProcedimiento = req.query.idProcedimiento;

  const hashedPassword = await getHashedPassword(clearPassword);
  console.log(hashedPassword);

  const args = {
    wsseg_user: wsseg_user,
    wsseg_pass: hashedPassword,
    idEntidad: idEntidad,
    idProcedimiento: idProcedimiento,
  };

  clientSoap.ListSubtiposProcedimiento(args, async (err, result) => {
    if (err) {
      console.error(err);
      return;
    }
    res.send(result);
  });
};

module.exports = {
  getListMaterias,
  getListSubmaterias,
  getListTiposProcedimiento,
  getListSubtiposProcedimiento,
  getListExpedientes,
  getListarDocumentosV2,
  getListarCarpetasV2,
  getInfoDocumento,
  getUrlDetalleExpediente,
  setEntorno,
  ListGeorreferenciasExpediente,
};
