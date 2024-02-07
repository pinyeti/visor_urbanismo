/**
 * Controlador para la gestión del visor.
 * @namespace VisorController
 */

const { Pool } = require("pg");
const con = require("./connectionString.js");
const fetch = require("cross-fetch");
const xml2js = require("xml2js");
const crypto = require("crypto");
const soap = require("soap");


const https = require('https');

console.log("fetch=" + fetch);
console.log(crypto);


const pool = new Pool({
  user: con.username,
  password: con.password,
  host: con.host,
  database: con.database,
  port: con.port,
});


const checkURLAvailability = async (req, res) => {
  const maxRetries = 3 // Número máximo de intentos
  let retryCount = 0;
  let url = req.query.url;

  const tryRequest = () => {
    https.get(url, (res2) => {
      const { statusCode } = res2;
      if (statusCode != 404) {
        console.log('El recurso está disponible.');
        res.send("true");
      } else {
        console.log(`El recurso no está disponible. Código de estado: ${statusCode}`);
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Reintentando (${retryCount}/${maxRetries})...`);
          tryRequest(); // Intentar nuevamente
        } else {
          console.log(`Se alcanzó el número máximo de intentos (${maxRetries}).`);
          res.send("false");
        }
      }
    }).on('error', (err) => {
      console.error('Error al intentar acceder al recurso:', err.message);
      if (retryCount < maxRetries) {
        retryCount++;
        console.log(`Reintentando (${retryCount}/${maxRetries})...`);
        tryRequest(); // Intentar nuevamente
      } else {
        console.log(`Se alcanzó el número máximo de intentos (${maxRetries}).`);
        res.send("false");
      }
    });
  };

  tryRequest(); // Iniciar el primer intento
};





/**
 * Realiza una consulta SELECT a la base de datos utilizando un parámetro proporcionado.<br><br>
 *
 * Endpoint: <strong>https://nombre_dominio/opg/postgis_select</strong>
 *
 * @memberof VisorController
 * @param {Object} req - El objeto de solicitud.
 * @param {string} req.query.select - La sentencia SELECT a ejecutar.
 * @param {Object} res - El objeto de respuesta.
 * @returns {Promise} Una promesa que resuelve con los resultados de la consulta.
 * @throws {Error} Si hay un error en el servicio, devuelve un mensaje de error del servidor.
 */
const getSelect = async (req, res) => {
  try {
    // Obtiene la sentencia SELECT de la solicitud
    const select = req.query.select;

    // Ejecuta la sentencia SELECT utilizando el pool de conexiones
    const response = await pool.query(select);

    // Envía los resultados de la consulta como respuesta
    res.send(response.rows);
  } catch (error) {
    // Manejo de errores: registra el error y envía un mensaje de error al cliente
    console.error("Error en servicio postgis_select:", error);
    res.status(500).send("Error en el servidor");
  }
};

/**
 * Realiza una consulta para obtener la intersección entre dos tablas espaciales y devuelve un objeto GeoJSON.<br><br>
 * 
 * Endpoint: <strong>https://nombre_dominio/opg/postgis_intersection_query</strong>
 *
 * @memberof VisorController
 * @param {Object} req - El objeto de solicitud.
 * @param {string} req.query.tablaSOURCE - Nombre de la tabla fuente para la intersección.
 * @param {string} req.query.tablaTARGET - Nombre de la tabla objetivo para la intersección.
 * @param {string} req.query.filtroSOURCE - Filtro para la tabla fuente (condición de la consulta).
 * @param {string} req.query.filtroTARGET - Filtro para la tabla objetivo (condición de la consulta).
 * @param {Object} res - El objeto de respuesta.
 * @returns {Promise} Una promesa que resuelve con el objeto GeoJSON de la intersección.
 * @throws {Error} Si hay un error en el servicio, se registra y se envía un mensaje de error al cliente.
 */
const getIntersection = async (req, res) => {
  try {
    // Obtiene los parámetros de la solicitud
    var tablaSOURCE = req.query.tablaSOURCE;
    var tablaTARGET = req.query.tablaTARGET;
    var filtroSOURCE = req.query.filtroSOURCE;
    var filtroTARGET = req.query.filtroTARGET;

    // Construye la consulta SQL para obtener la intersección
    var intersection_query =
      `SELECT row_to_json(fc) FROM 
    (SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features 
      FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lp.geometria,4326))::json As geometry , row_to_json(lp) As properties FROM ` +
      tablaSOURCE +
      ` As lg INNER JOIN 
         (SELECT ` +
      tablaSOURCE +
      `.*,ST_INTERSECTION(` +
      tablaSOURCE +
      `.the_geom,` +
      tablaTARGET +
      `.the_geom) AS geometria from ` +
      tablaSOURCE +
      `,` +
      tablaTARGET +
      ` 
        WHERE ST_INTERSECTS(` +
      tablaSOURCE +
      `.the_geom, ` +
      tablaTARGET +
      `.the_geom) AND ` +
      tablaTARGET +
      `.` +
      filtroTARGET +
      ` AND ` +
      tablaSOURCE +
      `.` +
      filtroSOURCE +
      `) As lp ON lg.fid = lp.fid ) As f ) As fc`;

    // Ejecuta la consulta utilizando el pool de conexiones
    const { rows } = await pool.query(intersection_query);

    // Envía el objeto GeoJSON de la intersección como respuesta
    res.send(rows[0].row_to_json);
  } catch (err) {
    // Manejo de errores: registra el error y envía un mensaje de error al cliente
    console.error("Error en servicio featureByPoint:", err);
    res.status(500).send("Error en el servidor");
  }
};



/**
 * Obtiene un objeto GeoJSON a partir de una tabla.<br><br>
 *
 * Endpoint: <strong>https://nombre_dominio/opg/postgis_query_geojson</strong>
 *
 * @memberof VisorController
 * @param {Object} req - El objeto de solicitud.
 * @param {string} req.query.table - El nombre de la tabla.
 * @param {string} [req.query.filter] - El filtro para la consulta SQL (opcional).
 * @param {string} [req.query.fields] - Los campos a seleccionar en la tabla (opcional).
 * @param {string} [req.query.crs] - El sistema de referencia de coordenadas (opcional).
 * @param {Object} res - El objeto de respuesta.
 * @returns {Promise} Una promesa que resuelve con el objeto GeoJSON.
 * @throws {Error} Si hay un error en el servicio.
 */
const getGeojson = async (req, res) => {
  // Recupera los parámetros de la solicitud HTTP
  table = req.query.table;
  filter = req.query.filter;
  fields = req.query.fields;
  crs = req.query.crs;

  // Lógica para construir la consulta SQL
  if (filter != null) filter = " where " + filter;
  else filter = "";

  if (fields == null) fields = "*";
  else {
    fields_array = fields.split(",");

    if (!fields_array.includes("fid")) fields = "fid," + fields;
  }

  if (crs == null) crs = "4326";

  var s_query =
    "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom," +
    crs +
    "))::json As geometry , row_to_json(lp) As properties FROM " +
    table +
    "  As lg INNER JOIN (SELECT " +
    fields +
    " FROM " +
    table +
    filter +
    " ) As lp ON lg.fid = lp.fid ) As f ) As fc";

  // Ejecuta la consulta utilizando el pool de conexiones a la base de datos
  const { rows } = await pool.query(s_query);

  // Envía la respuesta al cliente en formato GeoJSON
  res.send(rows[0].row_to_json);
};

/**
 * Obtiene características geográficas en un punto específico.<br><br>
 *
 * Endpoint: <strong>https://nombre_dominio/opg/featureByPoint</strong>
 *
 * @memberof VisorController
 * @param {Object} req - El objeto de solicitud.
 * @param {string} req.query.tabla - El nombre de la tabla.
 * @param {number} req.query.x - Coordenada X del punto.
 * @param {number} req.query.y - Coordenada Y del punto.
 * @param {Object} res - El objeto de respuesta.
 * @returns {Promise} Una promesa que resuelve con las características geográficas.
 * @throws {Error} Si hay un error en el servicio.
 */
const getFeatureByPoint = async (req, res) => {
  try {
    // Obtener los parámetros del objeto de solicitud
    var tabla = req.query.tabla; // Nombre de la tabla
    var x = req.query.x; // Coordenada X del punto
    var y = req.query.y; // Coordenada Y del punto

    // Consulta SQL para obtener las características geográficas en el punto dado
    var queryXY =
      "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM " +
      tabla +
      " As lg INNER JOIN (SELECT * FROM " +
      tabla +
      " where ST_CONTAINS(the_geom,ST_GeomFromText('POINT(" +
      x +
      " " +
      y +
      ")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc";

    // Ejecutar la consulta utilizando el pool de conexiones
    const { rows } = await pool.query(queryXY);

    // Enviar las características geográficas como respuesta al cliente
    res.send(rows[0].row_to_json);
  } catch (err) {
    // Manejo de errores y respuesta en caso de error
    console.error("Error en servicio featureByPoint:", err);
    res.status(500).send("Error en el servidor");
  }
};

// Cierra el pool cuando la aplicación se detiene
process.on("SIGINT", () => {
  pool.end().then(() => {
    console.log("Conexiones al pool cerradas.");
    process.exit(0);
  });
});

module.exports = {
  getFeatureByPoint,
  getGeojson,
  getIntersection,
  getSelect,
  checkURLAvailability
};
