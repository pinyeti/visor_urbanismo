/**
 * Clase para gestionar acceso BD.
 * @memberof module:Frontend
 */
class DataReader {
  /**
   * Crea una instancia de la clase DataReader.
   */
  constructor() {}

  /**
   * Lee datos de características geográficas mediante una solicitud GET a un endpoint específico.
   *
   * @param {string} tableSource - Nombre de la tabla de origen de los datos geográficos.
   * @param {string} filtroSQL - Filtro SQL aplicado a la consulta de datos geográficos (opcional).
   * @returns {Promise} Una promesa que resuelve con los datos geográficos en formato GeoJSON o registra un error en la consola.
   */
  async readDataFeature(tableSource, filtroSQL) {
    // Construye la URL para la solicitud GET
    const baseUrl = `${window.location.protocol}//${window.location.host}/opg/postgis_query_geojson`;
    const params = new URLSearchParams({
      table: tableSource,
      filter: filtroSQL,
    });
    const url = new URL(baseUrl);
    url.search = params.toString();

    // Configura los detalles de la solicitud GET
    const dataRequest = { method: "GET" };

    try {
      // Realiza la solicitud fetch para obtener los datos geográficos
      const response = await fetch(url, dataRequest);

      // Procesa la respuesta para obtener los datos en formato GeoJSON
      const info_geojson = await response.json();

      return info_geojson;
    } catch (error) {
      // Manejo de errores: registra el error en la consola
      console.error("Error al leer la característica:", error);
    }
  }

  /**
   * Método para ejecutar una consulta SQL sobre datos geográficos.
   *
   * @param {string} selectSQL - Consulta SQL a ejecutar para recuperar datos geográficos.
   * @returns {Promise} Una promesa que resuelve con los datos geográficos en formato GeoJSON o registra un error en la consola.
   */
  async selectSQL(selectSQL) {
    const baseUrl = `${window.location.protocol}//${window.location.host}/opg/postgis_select`;
    const params = new URLSearchParams({
      select: selectSQL,
    });

    const url = new URL(baseUrl);
    url.search = params.toString();

    const dataRequest = { method: "GET" };

    try {
      const response = await fetch(url, dataRequest);
      const info_geojson = await response.json();
      return info_geojson;
    } catch (error) {
      console.error("Error al leer la característica:", error);
    }
  }

  /**
   * Método para filtrar características geográficas entre tablas.
   *
   * @param {string} tableSource - Tabla de origen para la consulta de filtrado.
   * @param {string} tableTarget - Tabla de destino para la consulta de filtrado.
   * @param {string} filtroSource - Filtro de origen para la consulta de filtrado.
   * @param {string} filtroTarget - Filtro de destino para la consulta de filtrado.
   * @returns {Promise} Una promesa que resuelve con los datos filtrados en formato GeoJSON o registra un error en la consola.
   */
  async crossTablesFilter(
    tableSource,
    tableTarget,
    filtroSource,
    filtroTarget
  ) {
    try {
      const url = new URL(
        `${window.location.protocol}//${window.location.host}/opg/postgis_intersection_query`
      );

      const params = {
        tablaSOURCE: tableSource,
        tablaTARGET: tableTarget,
        filtroSOURCE: filtroSource,
        filtroTARGET: filtroTarget,
      };

      Object.keys(params).forEach((key) => {
        url.searchParams.append(key, params[key]);
      });

      const dataRequest = { method: "GET" };

      const response = await fetch(url, dataRequest);

      if (!response.ok) {
        throw new Error(`Error de red: ${response.status}`);
      }

      const info_geojson = await response.json();

      return info_geojson;
    } catch (error) {
      console.error("Error en crossTablesFilter:", error);
      return null;
    }
  }

  /**
   * Comprueba la disponibilidad de una URL mediante una solicitud GET y devuelve la información obtenida.
   *
   * @param {string} urlPDF - La URL que se va a comprobar.
   * @returns {object | null} La información obtenida de la URL o null en caso de error.
   */
  async checkURLAvailability(urlPDF) {
    try {
      const url = new URL(
        `${window.location.protocol}//${window.location.host}/opg/checkURLAvailability`
      );

      const params = {
        url: urlPDF,
      };

      Object.keys(params).forEach((key) => {
        url.searchParams.append(key, params[key]);
      });

      const dataRequest = { method: "GET" };

      const response = await fetch(url, dataRequest);
      console.log(response);

      if (!response.ok) {
        throw new Error(`Error de red: ${response.status}`);
      }

      const info_geojson = await response.json();
      console.log(info_geojson);

      return info_geojson;
    } catch (error) {
      console.error("Error en checkURLAvailability:", error);
      return null;
    }
  }
}
