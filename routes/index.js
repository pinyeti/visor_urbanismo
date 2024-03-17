/**
 * Router de Express que maneja las rutas y controladores para las solicitudes.
 * @module Router
 * @requires express
 * @requires ../controllers/index.controller
 * @requires ../controllers/sedipualb.controller
 */

/*const webdavClient = require('webdav-client');
 
// Create the client object
const connection = new webdavClient.Connection({
  url : "http://localhost:8082/OpenKM/webdav/okm:root/EXPEDIENTES/PLANEAMIENTO/PA-MODIFICACIO_PG/PA-198600020000",
  //authenticator : Authenticator,
  username : "okmAdmin",
  password : "admin"
});

console.log(connection);

connection.getProperties('PA-198600020000_PORTADA.pdf', (e, content) => {
  if(e)
      throw e;
  
  console.log(content);
})*/



const { Router } = require("express");
const router = Router();

const {
  getFeatureByPoint,
  getGeojson,
  getIntersection,
  getSelect,
  checkURLAvailability,
  write_data_user
} = require("../controllers/index.controller");

const {
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
} = require("../controllers/sedipualb.controller");

/**
 * Rutas para los endpoints de Sedipualb.
 * @name Sedipualb
 * @memberof module:Router
 */
router.get("/opg/listMaterias", getListMaterias);
router.get("/opg/listSubmaterias", getListSubmaterias);
router.get("/opg/ListTiposProcedimiento", getListTiposProcedimiento);
router.get("/opg/ListSubtiposProcedimiento", getListSubtiposProcedimiento);
router.get("/opg/listExpedientes", getListExpedientes);
router.get("/opg/listarDocumentosV2", getListarDocumentosV2);
router.get("/opg/listarCarpetasV2", getListarCarpetasV2);
router.get("/opg/obtenerInfoDocumento", getInfoDocumento);
router.get("/opg/getUrlDetalleExpediente", getUrlDetalleExpediente);
router.post("/opg/setEntorno", setEntorno);
router.get("/opg/ListGeorreferenciasExpediente", ListGeorreferenciasExpediente);

/**
 * Rutas para los endpoints del Visor.
 * @name Visor
 * @memberof module:Router
 */
router.get("/opg/featureByPoint", getFeatureByPoint);
router.get("/opg/postgis_query_geojson", getGeojson);
router.get("/opg/postgis_select", getSelect);
router.get("/opg/postgis_intersection_query", getIntersection);
router.get("/opg/checkURLAvailability", checkURLAvailability);
router.post("/opg/write_data_user", write_data_user);

/**
 * Ruta para renderizar la vista Visor Urbanismo.<br><br>
 *
 * Endpoint: <strong>https://nombre_dominio/opg/visor_urbanismo</strong>
 *
 * @name Visor Urbanismo
 * @memberof module:Router
 * @function
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 * @param {Function} next - Función de siguiente middleware.
 */
router.get("/opg/visor_urbanismo", function (req, res) {
  res.render("visor_urbanismo", {
    title: "Visor Urbanismo v.2",
  });

  router.use(function (err, req, res, next) {
    console.log(err.stack); // Por ejemplo, nombre no válido
    return res.status(500).send("Internal Server Occured");
  });
});

router.get("/opg/analytics_browser", function (req, res) {
  res.render("analytics_browser", {
    title: "Analytics Browser",
  });

  router.use(function (err, req, res, next) {
    console.log(err.stack); // Por ejemplo, nombre no válido
    return res.status(500).send("Internal Server Occured");
  });
});



module.exports = router;
