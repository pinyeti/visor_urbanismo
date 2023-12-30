/**
 * Clase para realizar lecturas de datos desde el servicio Sedipualb.
 * @memberof module:Frontend
 */
class DataReaderSedipualb {

  /**
   * Lista las materias disponibles.
   * @param {string} wsseg_user - Nombre de usuario.
   * @param {string} clearPassword - Contraseña.
   * @param {string} idEntidad - Identificador de entidad.
   * @returns {Promise<object>} - Objeto JSON con información de las materias.
   */
  async listMaterias(wsseg_user, clearPassword, idEntidad) {
    const baseUrl = `${window.location.protocol}//${window.location.host}/opg/listMaterias`;
    const params = new URLSearchParams({
      wsseg_user: wsseg_user,
      clearPassword: clearPassword,
      idEntidad: idEntidad,
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
   * Lista las submaterias disponibles para una materia específica.
   * @param {string} wsseg_user - Nombre de usuario.
   * @param {string} clearPassword - Contraseña.
   * @param {string} idEntidad - Identificador de entidad.
   * @param {string} idMateria - Identificador de materia.
   * @returns {Promise<object>} - Objeto JSON con información de las submaterias.
   */
  async listSubmaterias(wsseg_user, clearPassword, idEntidad, idMateria) {
    const baseUrl = `${window.location.protocol}//${window.location.host}/opg/listSubmaterias`;
    const params = new URLSearchParams({
      wsseg_user: wsseg_user,
      clearPassword: clearPassword,
      idEntidad: idEntidad,
      idMateria: idMateria,
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
   * Lista los tipos de procedimiento disponibles para una submateria específica.
   *
   * @param {string} wsseg_user - Nombre de usuario.
   * @param {string} clearPassword - Contraseña.
   * @param {string} idEntidad - Identificador de entidad.
   * @param {string} idSubmateria - Identificador de submateria.
   * @returns {Promise<object>} - Objeto JSON con información de los tipos de procedimiento.
   * @throws {Error} - Lanza un error si hay problemas en la solicitud o procesamiento.
   */
  async listTiposProcedimiento(
    wsseg_user,
    clearPassword,
    idEntidad,
    idSubmateria
  ) {
    const baseUrl = `${window.location.protocol}//${window.location.host}/opg/listTiposProcedimiento`;
    const params = new URLSearchParams({
      wsseg_user: wsseg_user,
      clearPassword: clearPassword,
      idEntidad: idEntidad,
      idSubmateria: idSubmateria,
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
   * Lista los subtipos de procedimiento disponibles para un tipo de procedimiento específico.
   *
   * @param {string} wsseg_user - Nombre de usuario.
   * @param {string} clearPassword - Contraseña.
   * @param {string} idEntidad - Identificador de entidad.
   * @param {string} idProcedimiento - Identificador de tipo de procedimiento.
   * @returns {Promise<object>} - Objeto JSON con información de los subtipos de procedimiento.
   * @throws {Error} - Lanza un error si hay problemas en la solicitud o procesamiento.
   */
  async listSubtiposProcedimiento(
    wsseg_user,
    clearPassword,
    idEntidad,
    idProcedimiento
  ) {
    const baseUrl = `${window.location.protocol}//${window.location.host}/opg/listSubtiposProcedimiento`;
    const params = new URLSearchParams({
      wsseg_user: wsseg_user,
      clearPassword: clearPassword,
      idEntidad: idEntidad,
      idProcedimiento: idProcedimiento,
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
   * Lista los expedientes disponibles en una página específica.
   *
   * @param {string} clearPassword - Contraseña.
   * @param {number} numPage - Número de la página de expedientes a recuperar.
   * @returns {Promise<object>} - Objeto JSON con información de los expedientes.
   * @throws {Error} - Lanza un error si hay problemas en la solicitud o procesamiento.
   */
  async listExpedientes(clearPassword, numPage) {
    const baseUrl = `${window.location.protocol}//${window.location.host}/opg/listExpedientes`;
    const params = new URLSearchParams({
      clearPassword: clearPassword,
      numPage: numPage,
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
   * Lista documentos relacionados con un expediente y una carpeta específicos.
   *
   * @param {string} clearPassword - Contraseña.
   * @param {string} pkEntidad - Clave primaria de la entidad.
   * @param {string} codigoExpediente - Código del expediente.
   * @param {string} pkCarpetaPadre - Clave primaria de la carpeta padre.
   * @param {string} nifUsuario - Número de identificación fiscal del usuario.
   * @returns {Promise<object>} - Objeto JSON con información de los documentos.
   * @throws {Error} - Lanza un error si hay problemas en la solicitud o procesamiento.
   */
  async listarDocumentosV2(
    clearPassword,
    pkEntidad,
    codigoExpediente,
    pkCarpetaPadre,
    nifUsuario
  ) {
    const baseUrl = `${window.location.protocol}//${window.location.host}/opg/listarDocumentosV2`;
    const params = new URLSearchParams({
      clearPassword: clearPassword,
      pkEntidad: pkEntidad,
      codigoExpediente: codigoExpediente,
      pkCarpetaPadre: pkCarpetaPadre,
      nifUsuario: nifUsuario,
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
   * Lista carpetas relacionadas con un expediente y una carpeta padre específicos.
   *
   * @param {string} wsseg_user - Usuario de seguridad.
   * @param {string} clearPassword - Contraseña.
   * @param {string} pkEntidad - Clave primaria de la entidad.
   * @param {string} codigoExpediente - Código del expediente.
   * @param {string} pkCarpetaPadre - Clave primaria de la carpeta padre.
   * @returns {Promise<object>} - Objeto JSON con información de las carpetas.
   * @throws {Error} - Lanza un error si hay problemas en la solicitud o procesamiento.
   */
  async listarCarpetasV2(
    wsseg_user,
    clearPassword,
    pkEntidad,
    codigoExpediente,
    pkCarpetaPadre,
  ) {
    const baseUrl = `${window.location.protocol}//${window.location.host}/opg/listarCarpetasV2`;
    const params = new URLSearchParams({
      wsseg_user: wsseg_user,
      clearPassword: clearPassword,
      pkEntidad: pkEntidad,
      codigoExpediente: codigoExpediente,
      pkCarpetaPadre: pkCarpetaPadre,
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
   * Obtiene información sobre un documento específico.
   *
   * @param {string} wsseg_user - Usuario de seguridad.
   * @param {string} clearPassword - Contraseña.
   * @param {string} pk_entidad - Clave primaria de la entidad.
   * @param {string} pkDocumento - Clave primaria del documento.
   * @returns {Promise<object>} - Objeto JSON con información del documento.
   * @throws {Error} - Lanza un error si hay problemas en la solicitud o procesamiento.
   */
  async obtenerInfoDocumento(
    wsseg_user,
    clearPassword,
    pk_entidad,
    pkDocumento,
  ) {
    const baseUrl = `${window.location.protocol}//${window.location.host}/opg/obtenerInfoDocumento`;
    const params = new URLSearchParams({
      wsseg_user: wsseg_user,
      clearPassword: clearPassword,
      pk_entidad: pk_entidad,
      pkDocumento: pkDocumento,
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

  /*
   async listEntites(hashedPassword) {
    const baseUrl = `${window.location.protocol}//${window.location.host}/opg/listEntities`;
    const params = new URLSearchParams({
      hashedPassword: hashedPassword,
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
  */
}
