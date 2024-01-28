/**
 * Clase que define una entidad urbanística y sus metodos
 * @memberof module:Frontend
 */
class FeatureUrbanistic {
  /**
   * Crea una instancia de la clase FeatureUrbanistic.
   * @param {string} clase - La clase de la característica urbanística.
   * @param {number} fid - El identificador único de la característica urbanística.
   */
  constructor(clase, fid) {
    this.title = "";
    this.subtitle = "";
    this.tipo_plan = "";
    this.clase = clase;
    this.table = "";
    this.feature = null;
    this.geojson = null;
    this.fid = fid;
    this.refcatString = "";
    this.zonaEstadisticaString = "";
    this.callesString = "";
    this.fillColor = "#3d869a";
    this.color = "#3d869a";

    // Configura propiedades basadas en la clase
    this.initializeBasedOnClass();
  }

  /**
   * Inicializa las propiedades de la instancia basadas en la clase proporcionada.
   */
  initializeBasedOnClass() {
    switch (this.clase) {
      case "VE_PGOU98":
        this.title = "VOLUMETRIA ESPECIFICA";
        this.subtitle = "-";
        this.tipo_plan = "PGOU98";
        this.table = "zonasf";
        this.fillColor = "#3d869a";
        this.color = "blue";
        break;
      case "TER_PGOU98":
        this.title = "TERCIARIO";
        this.subtitle = "-";
        this.tipo_plan = "PGOU98";
        this.table = "zona_terciaria";
        this.fillColor = "#3d869a";
        this.color = "blue";
        break;
      case "SEC_PGOU98":
        this.title = "INDUSTRIAL";
        this.subtitle = "-";
        this.tipo_plan = "PGOU98";
        this.table = "zona_secundaria";
        this.fillColor = "#3d869a";
        this.color = "blue";
        break;
      case "RSD_PGOU98":
        this.title = "RESIDENCIAL";
        this.subtitle = "-";
        this.tipo_plan = "PGOU98";
        this.table = "zona_residencial_1";
        this.fillColor = "#3d869a";
        this.color = "blue";
        break;
      case "SLEQ_PGOU98":
        this.title = "EQUIPAMIENTO COMUNITARIO";
        this.subtitle = "SISTEMA LOCAL";
        this.tipo_plan = "PGOU98";
        this.table = "slocal_equipamientos";
        this.fillColor = "#3d869a";
        this.color = "blue";
        break;
      case "SGEQ_PGOU98":
        this.title = "EQUIPAMIENTO COMUNITARIO";
        this.subtitle = "SISTEMA GENERAL";
        this.tipo_plan = "PGOU98";
        this.table = "sgeneral_equipamientos";
        this.fillColor = "#3d869a";
        this.color = "blue";
        break;
      case "SLEL_PGOU98":
        this.title = "ESPACIO LIBRE PÚBLICO";
        this.subtitle = "SISTEMA LOCAL";
        this.tipo_plan = "PGOU98";
        this.table = "slocal_espacioslibres_publicos";
        this.fillColor = "#0dac30";
        this.color = "green";

        break;
      case "SGEL_PGOU98":
        this.title = "ESPACIO LIBRE";
        this.subtitle = "SISTEMA GENERAL";
        this.tipo_plan = "PGOU98";
        this.table = "sgeneral_espacioslibres";
        this.fillColor = "#0dac30";
        this.color = "black";
        break;
      case "SLCI_PGOU98":
        this.title = "COMUNICACIONES E INFRAESTRUCTURAS";
        this.subtitle = "SISTEMA LOCAL";
        this.tipo_plan = "PGOU98";
        this.table = "slocal_comunicaciones_infraestructuras";
        this.fillColor = "#959088";
        this.color = "black";
        break;
      case "SGCI_PGOU98":
        this.title = "COMUNICACIONES E INFRAESTRUCTURAS";
        this.subtitle = "SISTEMA GENERAL";
        this.tipo_plan = "PGOU98";
        this.table = "sgeneral_comunicaciones_infraestructuras";
        this.fillColor = "#959088";
        this.color = "black";
        break;
      case "SGEQ_PG2023":
        this.title = "EQUIPAMIENTO COMUNITARIO";
        this.subtitle = "SISTEMA GENERAL";
        this.tipo_plan = "PG2023";
        this.table = "pg_dotac_sg_eq";
        this.fillColor = "#3d869a";
        this.color = "black";
        break;
      case "SGEL_PG2023":
        this.title = "ESPACIO LIBRE";
        this.subtitle = "SISTEMA GENERAL";
        this.tipo_plan = "PG2023";
        this.table = "pg_dotac_sg_el";
        this.fillColor = "#0dac30";
        this.color = "black";
        break;
      case "SGCM_PG2023":
        this.title = "COMUNICACIONES";
        this.subtitle = "SISTEMA GENERAL";
        this.tipo_plan = "PG2023";
        this.table = "pg_dotac_sg_cm";
        this.fillColor = "#959088";
        this.color = "black";
        break;
      case "SGSU_PG2023":
        this.title = "SERVICIOS URBANOS";
        this.subtitle = "SISTEMA GENERAL";
        this.tipo_plan = "PG2023";
        this.table = "pg_dotac_sg_su";
        this.fillColor = "#959088";
        this.color = "black";
        break;
      case "SGIF_PG2023":
        this.title = "INFRAESTRUCTURAS";
        this.subtitle = "SISTEMA GENERAL";
        this.tipo_plan = "PG2023";
        this.table = "pg_dotac_sg_if";
        this.fillColor = "#959088";
        this.color = "black";
        break;
      case "EL_PRI":
        this.title = "ESPACIOS LIBRES";
        this.subtitle = "-";
        this.tipo_plan = "PRI";
        this.table = "pri_sistema_espais_lliures_publics";
        this.fillColor = "#0dac30";
        this.color = "black";
        break;
      case "EQ_PRI":
        this.title = "EQUIPAMIENTO COMUNITARIO";
        this.subtitle = "-";
        this.tipo_plan = "PRI";
        this.table = "pri_equipamientos";
        this.fillColor = "#3d869a";
        this.color = "black";
        break;
      case "S_PRI":
        this.title = "COMERCIAL SERVICIOS";
        this.subtitle = "-";
        this.tipo_plan = "PRI";
        this.table = "pri_zona_comercial_serveis";
        this.fillColor = "#3d869a";
        this.color = "black";
        break;
      case "TH_PRI":
        this.title = "TURISTICO HOTELERO";
        this.subtitle = "-";
        this.tipo_plan = "PRI";
        this.table = "pri_zona_turistica_hotelera";
        this.fillColor = "#3d869a";
        this.color = "black";
        break;
      case "T_PRI":
        this.title = "TURISTICO";
        this.subtitle = "-";
        this.tipo_plan = "PRI";
        this.table = "pri_zona_turistica";
        this.fillColor = "#3d869a";
        this.color = "black";
        break;
      case "D_PRI":
        this.title = "RESIDENCIAL ENTRE MEDIANERAS";
        this.subtitle = "-";
        this.tipo_plan = "PRI";
        this.table = "pri_zona_residencial_entre_mitgeres";
        this.fillColor = "#3d869a";
        this.color = "black";
        break;
      case "E_PRI":
        this.title = "VIVIENDA EDIFICACION ABIERTA";
        this.subtitle = "-";
        this.tipo_plan = "PRI";
        this.table = "pri_zona_habitatge_edificacio_oberta";
        this.fillColor = "#3d869a";
        this.color = "black";
        break;
      case "I_PRI":
        this.title = "VIVIENDA UNIFAMILIAR AISLADA";
        this.subtitle = "-";
        this.tipo_plan = "PRI";
        this.table = "pri_zona_habitatge_unifamiliar_aillat";
        this.fillColor = "#3d869a";
        this.color = "black";
        break;
      case "VT_PRI":
        this.title = "VIVIENDA TRADICIONAL";
        this.subtitle = "-";
        this.tipo_plan = "PRI";
        this.table = "pri_zona_habitatge_tradicional";
        this.fillColor = "#3d869a";
        this.color = "black";
        break;
      case "VA_PRI":
        this.title = "VIVIENDA ADOSADA";
        this.subtitle = "-";
        this.tipo_plan = "PRI";
        this.table = "pri_zona_habitatges_adossats";
        this.fillColor = "#3d869a";
        this.color = "black";
        break;
      case "UE_PGOU98":
        this.title = "UNIDAD DE EJECUCIÓN";
        this.subtitle = "-";
        this.tipo_plan = "PGOU98";
        this.table = "unidad_ejecucion";
        this.fillColor = "RED";
        this.color = "black";
        break;
      case "UA_PRI":
        this.title = "UNIDAD DE ACTUACIÓN";
        this.subtitle = "-";
        this.tipo_plan = "PRI";
        this.table = "pri_unitat_actuacio";
        this.fillColor = "RED";
        this.color = "black";
        break;
      case "CAT_PGOU98":
        this.title = "CATALOGO";
        this.subtitle = "-";
        this.tipo_plan = "PGOU98";
        this.table = "catalogos";
        this.fillColor = "MAGENTA";
        this.color = "black";
        break;
      case "CAT_ACTUALIZACION":
        this.title = "CATALOGO";
        this.subtitle = "-";
        this.tipo_plan = "PGOU98";
        this.table = "catalogos_actualizacion";
        this.fillColor = "MAGENTA";
        this.color = "black";
        break;
      case "CAT_PRI":
        this.title = "CATALOGO";
        this.subtitle = "-";
        this.tipo_plan = "PRI";
        this.table = "pri_catalogos";
        this.fillColor = "MAGENTA";
        this.color = "black";
        break;
    }

    console.log(
      "Clase creada: " +
        this.title +
        ", " +
        this.subtitle +
        ", " +
        this.tipo_plan
    );
  }

  async initialize() {
    console.log("initializing");
    await this.readFeature();
    console.log(this.geojson);
    await this.setRefcatString();
    await this.setZonaEstadisticaString();
    await this.setCallesString();
    console.log("initializing end");
  }

  /**
   * Crea una cadena de texto concatenando los valores del campo especificado
   * de las características que cumplen con el criterio de área en relación
   * a la característica de referencia.
   *
   * @param {object} info - Objeto GeoJSON con características.
   * @param {string} fieldName - Nombre del campo a extraer.
   * @returns {string} - Cadena de texto con los valores del campo separados por comas y espacios.
   */
  createStringCross(info, fieldName) {
    let cadena = "";
    const featureGeometryArea = turf.area(this.getFeature().geometry);

    if (info.features) {
      // Filtra las características que cumplen con el criterio de área
      // y mapea los valores del campo especificado
      cadena = info.features
        .filter((feature) => {
          const featureGeometry = feature.geometry;
          const featureArea = turf.area(featureGeometry);
          return featureArea > (featureGeometryArea * 10) / 100;
        })
        .map((feature) => feature.properties[fieldName])
        .join(", "); // Une los valores con comas y espacios
    }

    return cadena;
  }

  /**
   * Crea una cadena compuesta a partir de las propiedades de características que cumplen con cierto criterio.
   * @param {object} info - El objeto que contiene las características a procesar.
   * @param {string[]} fieldName - Un array de nombres de campos que se utilizarán en la cadena compuesta.
   * @returns {string} - Una cadena compuesta que contiene los valores de los campos especificados de las características elegibles.
   */
  createCompostStringCross(info, fieldName) {
    // Calcula el umbral en función del área de la característica actual
    const threshold = (turf.area(this.getFeature().geometry) * 10) / 100;

    // Filtra las características elegibles según el umbral
    const eligibleFeatures = info.features
      .filter((feature) => turf.area(feature.geometry) > threshold)
      .map((feature) =>
        fieldName.map((field) => feature.properties[field]).join(" ")
      );

    // Une las cadenas de las características elegibles con comas
    return eligibleFeatures.join(", ");
  }

  /**
   * Realiza una solicitud para leer una característica y la almacena en la propiedad `feature`.
   * La URL de la solicitud se construye a partir de la ubicación actual y los parámetros de la tabla y el filtro.
   */
  async readFeature() {
    const reader = new DataReader();
    console.log(this.table);
    console.log(this.fid);
    const info_geojson = await reader.readDataFeature(
      this.table,
      `fid=${this.fid}`
    );
    this.feature = info_geojson.features[0];
    this.geojson = info_geojson;
  }

  /**
   * Realiza una operación para establecer la propiedad `callesString` con una cadena compuesta de datos de calles filtrados.
   * @async
   * @returns {Promise<void>}
   */
  async setCallesString() {
    try {
      // Obtiene las características de calles filtradas mediante la función `crossTablesFilter`
      const callesFeatures = await this.crossTablesFilter(
        "parcela_su_ru_calles",
        "fid>0"
      );

      // Nombres de los campos que se utilizarán para construir la cadena compuesta
      const fieldNames = ["tipo_via", "calle", "numero", "numerodup"];

      // Establece la propiedad `callesString` utilizando la función `createCompostStringCross`
      this.callesString = this.createCompostStringCross(
        callesFeatures,
        fieldNames
      );
    } catch (error) {
      console.error("Error al establecer callesString:", error);
      // Puedes agregar aquí tu lógica personalizada para manejar el error.
    }
  }

  /**
   * Obtiene la propiedad `clase`.
   * @returns {string} - Cadena compuesta de datos de la clase urbanística.
   */
  getClase() {
    return this.clase || ""; // Devuelve una cadena vacía si clase no está definida.
  }

  /**
   * Obtiene la propiedad `callesString`, que es una cadena compuesta de datos de calles.
   * @returns {string} - Cadena compuesta de datos de calles.
   */
  getCallesString() {
    return this.callesString || ""; // Devuelve una cadena vacía si callesString no está definida.
  }

  /**
   * Realiza una operación para establecer la propiedad `zonaEstadisticaString` con una cadena compuesta de zonas estadísticas filtradas.
   * @async
   * @returns {Promise<void>}
   */
  async setZonaEstadisticaString() {
    try {
      // Obtiene las características de zonas estadísticas filtradas mediante la función `crossTablesFilter`
      const zonasFeatures = await this.crossTablesFilter(
        "zonas_estadisticas2",
        "fid>0"
      );

      // Establece la propiedad `zonaEstadisticaString` utilizando la función `createStringCross`
      this.zonaEstadisticaString = this.createStringCross(
        zonasFeatures,
        "descr_zona"
      );
    } catch (error) {
      console.error("Error al establecer zonaEstadisticaString:", error);
      // Puedes agregar aquí tu lógica personalizada para manejar el error.
    }
  }

  /**
   * Obtiene la propiedad `zonaEstadisticaString`, que es una cadena compuesta de datos de zonas estadísticas.
   * @returns {string} - Cadena compuesta de datos de zonas estadísticas.
   */
  getZonaEstadisticaString() {
    return this.zonaEstadisticaString || ""; // Devuelve una cadena vacía si zonaEstadisticaString no está definida.
  }

  /**
   * Realiza una solicitud para establecer la propiedad `refcatString` con una cadena compuesta de datos de referencia catastral.
   * @async
   * @returns {Promise<void>}
   */
  async setRefcatString() {
    try {
      const refcatFeatures = await this.crossTablesFilter(
        "parcela_su_ru",
        "fid>0"
      );
      this.refcatString = this.createStringCross(refcatFeatures, "refcat");
    } catch (error) {
      console.error("Error al establecer refcatString:", error);
      // Puedes agregar aquí tu lógica personalizada para manejar el error.
    }
  }

  /**
   * Obtiene la propiedad `refcatString`, que es una cadena compuesta de datos de referencia catastral.
   * @returns {string} - Cadena compuesta de datos de referencia catastral.
   */
  getRefcatString() {
    return this.refcatString || ""; // Devuelve una cadena vacía si refcatString no está definida.
  }

  /**
   * Obtiene la característica (feature) actual.
   * @returns {Object} - La característica actual.
   */
  getFeature() {
    return this.feature;
  }

  /**
   * Obtiene la característica (geojson) actual.
   * @returns {Object} - La característica actual.
   */
  getGeojson() {
    return this.geojson;
  }

  /**
   * Establece el filtro.
   * @param {string} filter - El filtro a establecer.
   */
  setFilter(filter) {
    this.filter = filter;
  }

  /**
   * Obtiene la tabla.
   * @returns {string} - La tabla actual.
   */
  getTable() {
    return this.table;
  }

  /**
   * Obtiene el fid.
   * @returns {number} - El valor del fid.
   */
  getFid() {
    return this.fid;
  }

  /**
   * Realiza una solicitud para cruzar características de otra tabla y devuelve el resultado en formato GeoJSON.
   * @async
   * @param {string} tableSource - La tabla de origen para el filtro.
   * @param {string} filtroSource - El filtro a aplicar en la tabla de origen.
   * @returns {Promise<Object>} - Un objeto GeoJSON que contiene las características filtradas.
   */
  async crossTablesFilter(tableSource, filtroSource) {
    // Obtener la tabla de destino y el filtro de destino desde la instancia actual
    const tableTarget = this.getTable();
    const filtroTarget = "fid=" + this.getFid();

    const reader = new DataReader();
    const info_geojson = await reader.crossTablesFilter(
      tableSource, 
      tableTarget,
      filtroSource,
      filtroTarget
    );
    console.log("pasa por cross", info_geojson);
    return info_geojson;
  }
}
