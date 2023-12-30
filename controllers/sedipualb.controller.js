/**
 * Controlador para los Servicios Sedipualb.
 * @namespace SedipualbaController
 */

const crypto = require("crypto");
const soap = require("soap");

let clientSoap = null;

soap.createClient(
  "https://pre-07040.sedipualba.es/segex/wssegex.asmx?wsdl",
  (err, client) => {
    if (err) {
      console.error(err);
      return;
    }

    clientSoap = client;
  }
);

console.log(clientSoap);

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

  console.log(hashedPassword);
  console.log(pkEntidad);
  console.log(codigoExpediente);
  console.log(pkCarpetaPadre);
  console.log(nifUsuario);

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

const getListExpedientes = async (req, res) => {
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
};

const getListMaterias = async (req, res) => {
  const clearPassword = req.query.clearPassword;
  const idEntidad = req.query.idEntidad;
  const wsseg_user = req.query.wsseg_user;

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
  const clearPassword = req.query.clearPassword;
  const idEntidad = req.query.idEntidad;
  const wsseg_user = req.query.wsseg_user;
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
  const clearPassword = req.query.clearPassword;
  const idEntidad = req.query.idEntidad;
  const wsseg_user = req.query.wsseg_user;
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
  const clearPassword = req.query.clearPassword;
  const idEntidad = req.query.idEntidad;
  const wsseg_user = req.query.wsseg_user;
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
};
