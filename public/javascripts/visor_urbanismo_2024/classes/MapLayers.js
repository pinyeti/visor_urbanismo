/**
 * Clase para crear una capa generíca de un mapa.
 * @memberof module:Frontend
 */
class MapLayer {
  /**
   * Constructor de la clase MapLayer.
   *
   * @param {string} name - Nombre de la capa.
   * @param {Object} layer - Capa de mapa.
   */
  constructor(name, layer) {
    this.name = name;
    this.layer = layer;
  }

  /**
   * Establece la capa del mapa.
   *
   * @param {Object} layer - Capa de mapa a establecer.
   */
  setLayer(layer) {
    this.layer = layer;
  }

  /**
   * Obtiene la capa del mapa.
   *
   * @returns {Object} Capa de mapa.
   */
  getLayer() {
    return this.layer;
  }

  /**
   * Establece el nombre de la capa.
   *
   * @param {string} name - Nombre de la capa a establecer.
   */
  setName(name) {
    this.name = name;
  }

  /**
   * Obtiene el nombre de la capa.
   *
   * @returns {string} Nombre de la capa.
   */
  getName() {
    return this.name;
  }
}

/**
 * Clase para gestionar un arreglo de capas en el mapa.
 * @memberof module:Frontend
 */
class MapLayers {
  /**
   * Constructor de la clase MapLayers.
   * Inicializa un arreglo vacío para almacenar las capas de mapa.
   */
  constructor() {
    this.layers = [];
  }

  /**
   * Reemplaza todas las capas actuales con un nuevo conjunto de capas.
   *
   * @param {Array} layers - Nuevo conjunto de capas de mapa.
   */
  pushMapLayers(layers) {
    this.layers.splice(0, this.layers.length); // Elimina todos los elementos actuales
    this.layers.push(...layers); // Agrega los elementos del nuevo arreglo
  }

  /**
   * Agrega una capa de mapa al arreglo de capas.
   *
   * @param {Object} mapLayer - Capa de mapa a agregar.
   */
  pushMapLayer(mapLayer) {
    this.layers.push(mapLayer);
  }

  /**
   * Crea una nueva capa de mapa con el nombre y la capa proporcionados y la agrega al arreglo de capas.
   *
   * @param {string} name - Nombre de la capa de mapa.
   * @param {Object} layer - Capa de mapa a agregar.
   */
  pushMapLayer(name, layer) {
    const mapLayer = new MapLayer(name, layer);
    this.layers.push(mapLayer);
  }

  /**
   * Obtiene una capa de mapa del arreglo por su nombre.
   *
   * @param {string} name - Nombre de la capa de mapa a buscar.
   * @returns {Object} Capa de mapa encontrada o undefined si no se encuentra.
   */
  getMapLayerByName(name) {
    return this.layers.find(function (mapLayer) {
      return mapLayer.name === name;
    });
  }

  /**
   * Obtiene el índice de una capa de mapa en el arreglo por su nombre.
   *
   * @param {string} name - Nombre de la capa de mapa a buscar.
   * @returns {number} Índice de la capa de mapa encontrada o -1 si no se encuentra.
   */
  getIndexByName(name) {
    const index = this.layers.findIndex((elemento) => elemento.name === name);
    return index;
  }
}

/**
 * Clase que extiende MapLayers para manejar las capas de un visor de mapas.
 * @memberof module:Frontend
 * @extends MapLayers
 */
class MapLayersVisor extends MapLayers {
  constructor() {
    super();
    this.setLayer_cartografia_imi_color();
    this.setLayer_cartografia_imi_grey();
    this.setLayer_wmsPNOA_ACTUAL();
    this.setLayer_wmsPNOA_2021();
    this.setLayer_wmsPNOA_2018();
    this.setLayer_wmsPNOA_2015();
    this.setLayer_wmsPNOA_2012();
    this.setLayer_wmsPNOA_2010();
    this.setLayer_wmsPNOA_2008_10();
    this.setLayer_wmsPNOA_2008();
    this.setLayer_wmsPNOA_2006();
    this.setLayer_wmsSIGPAC();
    this.setLayer_wmsIB_2002();
    this.setLayer_wmsIB_2001();
    this.setLayer_wmsOLISTAT();
    this.setLayer_wmsMallorca_1995();
    this.setLayer_wmsNacional_1981_1986();
    this.setLayer_wmsAMS_1956();
    this.setLayer_catastro();
    this.setLayer_google_streets();
    this.setLayer_google_satellite();
    this.setLayer_google_hybrid();
    this.setLayer_google_terrain();
    this.setLayer_google_traffic();
    this.setLayer_cartodb_light_all();
    this.setLayer_osm();
    this.setLayer_osm_gray();
    this.setLayer_pgou98_calificaciones();
    this.setLayer_pgou98_ambitos();
    this.setLayer_pri_calificaciones();
    this.setLayer_pri_ambitos();
    this.setLayer_pg2023_calificaciones();
    this.setLayer_pg2023_categorias_rustico();
    this.setLayer_pg2023_ambitos();
    //this.setLayer_PA_aprobacion_inial();
  }

  /**
   * Establece la capa de expediente PA con aprobacion inicial con vigencia < 2 años
   * @returns {void}
   */
  async setLayer_PA_aprobacion_inial() {
    const reader = new DataReader();

    const geojson = await reader.readDataFeature(
      "pa_modificacion_pgou",
      "DATE_PART('year', CURRENT_DATE) - DATE_PART('year', TO_DATE(a_ini, 'YYYY-MM-DD'))<2 and a_def is null"
    );

    console.log(geojson);

    // Crear una nueva colección de puntos
    const pointFeatures = geojson.features.map((feature) => {
      // Obtener el centroide de cada polígono
      const centroid = turf.centroid(feature);

      // Crear un nuevo punto a partir del centroide
      const point = turf.point([
        centroid.geometry.coordinates[0],
        centroid.geometry.coordinates[1],
      ]);

      point.properties = {
        expediente: feature.properties.expedient,
        a_ini: feature.properties.a_ini,

        // Agrega aquí más propiedades si es necesario
      };

      return point;
    });

    // Crear un nuevo GeoJSON con los puntos
    const pointGeoJSON = {
      type: "FeatureCollection",
      features: pointFeatures,
    };

    const style = () => {
      return {
        fillColor: "blue",
        weight: 6,
        opacity: 1,
        color: "blue",
        dashArray: "2,8",
        fillOpacity: 0,
      };
    };

    const polyLayer = L.geoJSON(geojson, { style: style });

    const pointsLayer = L.geoJSON(pointGeoJSON, {
      minZoom: 18,
      maxZoom: 22,
      pointToLayer: function (feature, latlng) {
        // Crear un círculo
        const circleMarker = L.circleMarker(latlng, {
          radius: 6,
          fillColor: "red",
          color: "yellow",
          weight: 4,
          opacity: 1,
          fillOpacity: 0.8,
        });

        // Crear un texto
        const text = L.divIcon({
          className: "text-label-sedipualba",
          html: `<div style="padding:3px">${feature.properties.expediente}</div>`,
        });

        console.log(feature);
        // Agregar el texto al círculo
        circleMarker.bindTooltip(
          feature.properties.expediente + "<br>" + feature.properties.a_ini,
          {
            permanent: true,
            direction: "center",
            opacity: 0.8,
            offset: [0, -30],
            className: "text-label-sedipualba",
          }
        );

        // Retornar un grupo que contiene el círculo y el texto
        return L.layerGroup([circleMarker]);
      },
    });
  

    const layerPA_ai = L.layerGroup([pointsLayer]);
    //const layerPA_ai = L.layerGroup([polyLayer,pointsLayer]);

    console.log("añadiendo......layer=", layerPA_ai);
  
    this.pushMapLayer("layerPA_ai", layerPA_ai);
   

  }


  /**
   * Establece la capa de tráfico de Google Maps.
   * @returns {void}
   */
  setLayer_google_traffic() {
    const google_traffic = L.tileLayer(
      "https://{s}.google.com/vt/lyrs=m@221097413,traffic&x={x}&y={y}&z={z}",
      {
        minZoom: 10,
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
      }
    );
    this.pushMapLayer("google_traffic", google_traffic);
  }

  /**
   * Establece la capa de terreno de Google Maps.
   * @returns {void}
   */
  setLayer_google_terrain() {
    const google_terrain = L.tileLayer(
      "http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
      {
        minZoom: 10,
        maxZoom: 22,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
      }
    );
    this.pushMapLayer("google_terrain", google_terrain);
  }

  /**
   * Establece la capa híbrida de Google Maps.
   * @returns {void}
   */
  setLayer_google_hybrid() {
    const google_hybrid = L.tileLayer(
      "http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}",
      {
        minZoom: 10,
        maxZoom: 22,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
      }
    );
    this.pushMapLayer("google_hybrid", google_hybrid);
  }

  /**
   * Establece la capa de satélite de Google Maps.
   * @returns {void}
   */
  setLayer_google_satellite() {
    const google_satellite = L.tileLayer(
      "http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
      {
        minZoom: 10,
        maxZoom: 22,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
      }
    );
    this.pushMapLayer("google_satellite", google_satellite);
  }

  /**
   * Establece la capa de calles de Google Maps.
   * @returns {void}
   */
  setLayer_google_streets() {
    const google_streets = L.tileLayer(
      "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
      {
        minZoom: 10,
        maxZoom: 22,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
      }
    );
    this.pushMapLayer("google_streets", google_streets);
  }

  /**
   * Establece la capa CartoDB Light basada en teselas para mostrar un mapa con un estilo claro.
   * @returns {void}
   */
  setLayer_cartodb_light_all() {
    const cartodb_light_all = L.tileLayer(
      "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
      {
        minZoom: 12,
        maxZoom: 22,
        edgeBufferTiles: 1,
      }
    );
    this.pushMapLayer("cartodb_light_all", cartodb_light_all);
  }

  /**
   * Establece la capa OpenStreetMap como una capa de teselas en color.
   * @returns {void}
   */
  setLayer_osm() {
    const osm = L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
      minZoom: 12,
      maxZoom: 22,
      edgeBufferTiles: 1,
    });
    this.pushMapLayer("openstreetmap", osm);
  }

  /**
   * Establece la capa OpenStreetMap como una capa de teselas en escala de grises.
   * @returns {void}
   */
  setLayer_osm_gray() {
    const osm_gray = L.tileLayer.grayscale(
      "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      {
        minZoom: 12,
        maxZoom: 22,
        edgeBufferTiles: 1,
      }
    );
    this.pushMapLayer("openstreetmap_gray", osm_gray);
  }

  /**
   * Establece la capa del Catastro utilizando WMS para obtener datos cartográficos.
   * @returns {void}
   */
  setLayer_catastro() {
    const catastro = L.tileLayer.wms(
      "https://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?",
      {
        layers: "catastro",
        format: "image/png",
        transparent: true,
        minZoom: 10,
        maxZoom: 22,
        // tileSize: 1024,
      }
    );
    this.pushMapLayer("catastro", catastro);
  }

  /**
   * Establece la capa de cartografía IMI en color como una capa de teselas.
   * @returns {void}
   */
  setLayer_cartografia_imi_color() {
    const cartografia_imi_color = L.tileLayer(
      "https://cartografia.palma.cat/geoserver/gwc/service/tms/1.0.0/BTUP%3Acomplet@GoogleMapsCompatible@png/{z}/{x}/{y}.png?flipY=true",
      {
        minZoom: 10,
        maxZoom: 22,
        opacity: 0.8,
        edgeBufferTiles: 1,
      }
    );
    this.pushMapLayer("cartografia_imi_color", cartografia_imi_color);
  }

  /**
   * Establece la capa de cartografía IMI en escala de grises como una capa de teselas.
   * @returns {void}
   */
  setLayer_cartografia_imi_grey() {
    const cartografia_imi_grey = L.tileLayer.grayscale(
      "https://cartografia.palma.cat/geoserver/gwc/service/tms/1.0.0/BTUP%3Acomplet@GoogleMapsCompatible@png/{z}/{x}/{y}.png?flipY=true",
      {
        minZoom: 10,
        maxZoom: 22,
        opacity: 0.8,
        edgeBufferTiles: 1,
      }
    );
    this.pushMapLayer("cartografia_imi_grey", cartografia_imi_grey);
  }

  /**
   * Establece la capa WMS del Plan Nacional de Ortofotografía Aérea actual.
   * @returns {void}
   */
  setLayer_wmsPNOA_ACTUAL() {
    const wmsPNOA_ACTUAL = L.tileLayer.wms(
      "http://www.ign.es/wms-inspire/pnoa-ma",
      {
        layers: "OI.OrthoimageCoverage", //nombre de la capa (ver get capabilities)
        format: "image/png",
        transparent: true,
        version: "1.3.0", //wms version (ver get capabilities)
        //attribution: "PNOA WMS. Cedido por © Instituto Geográfico Nacional de España",
        maxZoom: 22,
        edgeBufferTiles: 0,
      }
    );
    this.pushMapLayer("pnoa_actual", wmsPNOA_ACTUAL);
  }

  /**
   * Establece la capa WMS del Plan Nacional de Ortofotografía Aérea de 2021.
   * @returns {void}
   */
  setLayer_wmsPNOA_2021() {
    const wmsPNOA_2021 = L.tileLayer.wms(
      "https://www.ign.es/wms/pnoa-historico",
      {
        layers: "PNOA2021",
        format: "image/png",
        transparent: true,
        version: "1.3.0",
        maxZoom: 22,
        edgeBufferTiles: 0,
      }
    );
    this.pushMapLayer("pnoa_2021", wmsPNOA_2021);
  }

  /**
   * Establece la capa WMS del Plan Nacional de Ortofotografía Aérea de 2018.
   * @returns {void}
   */
  setLayer_wmsPNOA_2018() {
    const wmsPNOA_2018 = L.tileLayer.wms(
      "https://www.ign.es/wms/pnoa-historico",
      {
        layers: "PNOA2018",
        format: "image/png",
        transparent: true,
        version: "1.3.0",
        maxZoom: 22,
        edgeBufferTiles: 0,
      }
    );
    this.pushMapLayer("pnoa_2018", wmsPNOA_2018);
  }

  /**
   * Establece la capa WMS del Plan Nacional de Ortofotografía Aérea de 2015.
   * @returns {void}
   */
  setLayer_wmsPNOA_2015() {
    const wmsPNOA_2015 = L.tileLayer.wms(
      "https://www.ign.es/wms/pnoa-historico",
      {
        layers: "PNOA2015",
        format: "image/png",
        transparent: true,
        version: "1.3.0",
        maxZoom: 22,
        edgeBufferTiles: 0,
      }
    );
    this.pushMapLayer("pnoa_2015", wmsPNOA_2015);
  }

  /**
   * Establece la capa WMS del Plan Nacional de Ortofotografía Aérea de 2012.
   * @returns {void}
   */
  setLayer_wmsPNOA_2012() {
    const wmsPNOA_2012 = L.tileLayer.wms(
      "https://www.ign.es/wms/pnoa-historico",
      {
        layers: "PNOA2012",
        format: "image/png",
        transparent: true,
        version: "1.3.0",
        maxZoom: 22,
        edgeBufferTiles: 0,
      }
    );
    this.pushMapLayer("pnoa_2012", wmsPNOA_2012);
  }

  /**
   * Establece la capa WMS del Plan Nacional de Ortofotografía Aérea de 2010.
   * @returns {void}
   */
  setLayer_wmsPNOA_2010() {
    const wmsPNOA_2010 = L.tileLayer.wms(
      "https://www.ign.es/wms/pnoa-historico",
      {
        layers: "PNOA2010",
        format: "image/png",
        transparent: true,
        version: "1.3.0",
        maxZoom: 22,
        edgeBufferTiles: 0,
      }
    );
    this.pushMapLayer("pnoa_2010", wmsPNOA_2010);
  }

  /**
   * Establece la capa WMS del Plan Nacional de Ortofotografía Aérea de 2008 (10 cm).
   * @returns {void}
   */
  setLayer_wmsPNOA_2008_10() {
    const wmsPNOA_2008_10 = L.tileLayer.wms(
      "https://www.ign.es/wms/pnoa-historico",
      {
        layers: "pnoa10_2008",
        format: "image/png",
        transparent: true,
        version: "1.3.0",
        maxZoom: 22,
        edgeBufferTiles: 0,
      }
    );
    this.pushMapLayer("pnoa_2008_10", wmsPNOA_2008_10);
  }

  /**
   * Establece la capa WMS del Plan Nacional de Ortofotografía Aérea de 2008.
   * @returns {void}
   */
  setLayer_wmsPNOA_2008() {
    const wmsPNOA_2008 = L.tileLayer.wms(
      "https://www.ign.es/wms/pnoa-historico",
      {
        layers: "PNOA2008",
        format: "image/png",
        transparent: true,
        version: "1.3.0",
        maxZoom: 22,
        edgeBufferTiles: 0,
      }
    );
    this.pushMapLayer("pnoa_2008", wmsPNOA_2008);
  }

  /**
   * Establece la capa WMS del Plan Nacional de Ortofotografía Aérea de 2006.
   * @returns {void}
   */
  setLayer_wmsPNOA_2006() {
    const wmsPNOA_2006 = L.tileLayer.wms(
      "https://www.ign.es/wms/pnoa-historico",
      {
        layers: "PNOA2006",
        format: "image/png",
        transparent: true,
        version: "1.3.0",
        maxZoom: 22,
        edgeBufferTiles: 0,
      }
    );
    this.pushMapLayer("pnoa_2006", wmsPNOA_2006);
  }

  /**
   * Establece la capa WMS de la Ortofotografía Aérea de las Islas Baleares de 2002.
   * @returns {void}
   */
  setLayer_wmsIB_2002() {
    const wmsIB_2002 = L.tileLayer.wms(
      "https://ideib.caib.es/geoserveis/services/imatges/GOIB_Ortofoto_2002_IB/MapServer/WMSServer",
      {
        layers: "0",
        format: "image/png",
        transparent: true,
        version: "1.3.0",
        maxZoom: 22,
        edgeBufferTiles: 0,
      }
    );
    this.pushMapLayer("ib_2002", wmsIB_2002);
  }

  /**
   * Establece la capa WMS de la Ortofotografía Aérea de las Islas Baleares de 2001.
   * @returns {void}
   */
  setLayer_wmsIB_2001() {
    const wmsIB_2001 = L.tileLayer.wms(
      "https://ideib.caib.es/geoserveis/services/imatges/GOIB_Foto_2001_IB/MapServer/WMSServer",
      {
        layers: "0",
        format: "image/png",
        transparent: true,
        version: "1.3.0",
        maxZoom: 22,
        edgeBufferTiles: 0,
      }
    );
    this.pushMapLayer("ib_2001", wmsIB_2001);
  }

  /**
   * Establece la capa WMS de la Base Topográfica Nacional OLISTAT (1981-1986).
   * @returns {void}
   */
  setLayer_wmsOLISTAT() {
    const wmsNacional_1981_1986 = L.tileLayer.wms(
      "https://www.ign.es/wms/pnoa-historico",
      {
        layers: "OLISTAT",
        format: "image/png",
        transparent: true,
        version: "1.3.0",
        maxZoom: 22,
        edgeBufferTiles: 0,
      }
    );
    this.pushMapLayer("olistat", wmsNacional_1981_1986);
  }

  /**
   * Establece la capa WMS para SIGPAC.
   * @returns {void}
   */
  setLayer_wmsSIGPAC() {
    const wmsSIGPAC = L.tileLayer.wms("https://www.ign.es/wms/pnoa-historico", {
      layers: "SIGPAC",
      format: "image/png",
      transparent: true,
      version: "1.3.0",
      maxZoom: 22,
      edgeBufferTiles: 0,
    });
    this.pushMapLayer("sigpac", wmsSIGPAC);
  }

  /**
   * Establece la capa WMS para Mallorca en 1995.
   * @returns {void}
   */
  setLayer_wmsMallorca_1995() {
    const wmsMallorca_1995 = L.tileLayer.wms(
      "https://ideib.caib.es/geoserveis/services/imatges/GOIB_Foto_1995_Ma/MapServer/WMSServer?",
      {
        layers: "0",
        format: "image/png",
        transparent: true,
        version: "1.3.0",
        maxZoom: 22,
        edgeBufferTiles: 0,
      }
    );
    this.pushMapLayer("mallorca_1995", wmsMallorca_1995);
  }

  /**
   * Establece la capa vuelo nacional 1981-1986
   * @returns {void}
   */
  setLayer_wmsNacional_1981_1986() {
    const wmsNacional_1981_1986 = L.tileLayer.wms(
      "https://www.ign.es/wms/pnoa-historico",
      {
        layers: "Nacional_1981-1986",
        format: "image/png",
        transparent: true,
        version: "1.3.0",
        maxZoom: 22,
        edgeBufferTiles: 0,
      }
    );
    this.pushMapLayer("nacional_1981_1986", wmsNacional_1981_1986);
  }

  /**
   * Establece la capa WMS AMS (1956-1957).
   * @returns {void}
   */
  setLayer_wmsAMS_1956() {
    const wmsAMS_1956 = L.tileLayer.wms(
      "https://www.ign.es/wms/pnoa-historico",
      {
        layers: "AMS_1956-1957",
        format: "image/png",
        transparent: true,
        version: "1.3.0",
        maxZoom: 22,
        edgeBufferTiles: 0,
      }
    );
    this.pushMapLayer("ams_1956_1967", wmsAMS_1956);
  }

  /**
   * Establece capas WMS correspondientes a las calificaciones del PGOU98.
   * @returns {void}
   */
  setLayer_pgou98_calificaciones() {
    /*const pgou98_calificaciones = L.tileLayer.wms(
      "https://geoportal.palma.cat/geoserver/ows?authkey=null&",
      {
        layers:
          "urbanismo:pgou98_zona_residencial," +
          "urbanismo:pgou98_zona_residencial_no_edificable," +
          "urbanismo:pgou98_zona_secundaria," +
          "urbanismo:pgou98_zona_terciaria," +
          "urbanismo:pgou98_volumetria_especifica," +
          "urbanismo:pgou98_volumetrias," +
          "urbanismo:pgou98_espacios_libres_privados," +
          "urbanismo:pgou98_lineas_separacion_calificaciones," +
          "urbanismo:pgou98_lineas_profundidad_edificable," +
          "urbanismo:pgou98_texto_profundidad_edificable," +
          "urbanismo:pgou_preservacion_arquitectonica_ambiental_nr," +
          "urbanismo:pgou98_sistema_local_equipamientos," +
          "urbanismo:pgou98_sistema_general_equipamientos," +
          "urbanismo:pgou98_sistema_local_espacios_libres," +
          "urbanismo:pgou98_sistema_general_espacios_libres," +
          "urbanismo:pgou98_sistema_local_comunicaciones_infraestructuras," +
          "urbanismo:pgou98_sistema_general_comunicaciones_infraestructuras," +
          "urbanismo:pgou98_catalogos," +
          "urbanismo:pgou98_catalogos_actualizacion," +
          "urbanismo:pgou98_preservacion_r," +
          "urbanismo:pgou98_manzana_urbanistica",
        format: "image/png",
        transparent: true,
        minZoom: 10,
        maxZoom: 22,
        tileSize: 1024,
      }
    );*/
    /*const pgou98_calificaciones = L.tileLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        layers:
          "SIGDU:pgou98_zona_residencial," +
          "SIGDU:pgou98_zona_residencial_no_edificable," +
          "SIGDU:pgou98_zona_secundaria," +
          "SIGDU:pgou98_zona_terciaria," +
          "SIGDU:pgou98_volumetria_especifica," +
          "SIGDU:pgou98_volumetrias," +
          "SIGDU:pgou98_espacios_libres_privados," +
          "SIGDU:pgou98_lineas_separacion_calificaciones," +
          "SIGDU:pgou98_lineas_profundidad_edificable," +
          "SIGDU:pgou98_texto_profundidad_edificable," +
          "SIGDU:pgou98_preservacion_arquitectonica_ambiental_nr," +
          "SIGDU:pgou98_sistema_local_equipamientos," +
          "SIGDU:pgou98_sistema_general_equipamientos," +
          "SIGDU:pgou98_sistema_local_espacios_libres," +
          "SIGDU:pgou98_sistema_general_espacios_libres," +
          "SIGDU:pgou98_sistema_local_comunicaciones_infraestructuras," +
          "SIGDU:pgou98_sistema_general_comunicaciones_infraestructuras," +
          "SIGDU:pgou98_catalogos," +
          "SIGDU:pgou98_catalogos_actualizacion," +
          "SIGDU:pgou98_preservacion_r," +
          "SIGDU:pgou98_manzana_urbanistica",
        format: "image/png",
        transparent: true,
        minZoom: 10,
        maxZoom: 22,
        tileSize: 1024,
      }
    );*/
    const pgou98_calificaciones = L.tileLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        layers:
          "SIGDU:calificaciones_pgou98", 
        format: "image/png",
        transparent: true,
        minZoom: 10,
        maxZoom: 22,
        tileSize: 1024,
      }
    );
    this.pushMapLayer("pgou98_calificaciones", pgou98_calificaciones);
  }

  /**
   * Establece la capa WMS para los ámbitos del PGOU98.
   * @returns {void}
   */
  setLayer_pgou98_ambitos() {
    //const pgou98_ambitos = L.WMS.tileLayer(
    /*const pgou98_ambitos = L.tileLayer.wms(
      "https://geoportal.palma.cat/geoserver/ows?authkey=null&",
      {
        layers:
          "urbanismo:pgou98_area_planeamiento_incorporado," +
          "urbanismo:pgou98_area_regimen_especial," +
          "urbanismo:pgou98_manzana_urbanistica," +
          "urbanismo:pgou98_unidad_ejecucion," +
          "urbanismo:pgou98_suelo_urbano_por_ejecucion",
        format: "image/png",
        transparent: true,
        minZoom: 10,
        maxZoom: 22,
        tileSize: 1024,
      }
    );*/
    /*const pgou98_ambitos = L.tileLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        layers:
          "SIGDU:pgou98_area_planeamiento_incorporado," +
          "SIGDU:pgou98_area_regimen_especial," +
          "SIGDU:pgou98_manzana_urbanistica," +
          "SIGDU:pgou98_unidad_ejecucion," +
          "SIGDU:pgou98_suelo_urbano_por_ejecucion",
        format: "image/png",
        transparent: true,
        minZoom: 10,
        maxZoom: 22,
        tileSize: 1024,
      }
    );*/
    const pgou98_ambitos = L.tileLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        layers:
          "SIGDU:pgou98_ambitos",
        format: "image/png",
        transparent: true,
        minZoom: 10,
        maxZoom: 22,
        tileSize: 1024,
      }
    );
    this.pushMapLayer("pgou98_ambitos", pgou98_ambitos);
  }

  /**
   * Establece capas WMS correspondientes a las calificaciones del (PRI) Playa de Palma.
   * @returns {void}
   */
  setLayer_pri_calificaciones() {
    /*const pri_calificaciones = L.tileLayer.wms(
      "https://geoportal.palma.cat/geoserver/ows?authkey=null&",
      {
        layers:
          "urbanismo:pri_vivienda_edificacion_abierta," +
          "urbanismo:pri_zona_vivienda_unifamiliar_aislada," +
          "urbanismo:pri_zona_residencial_entre_mitgeres," +
          "urbanismo:pri_zona_residencial_entre_medianeras_edificacion," +
          "urbanismo:pri_zona_vivienda_tradicional," +
          "urbanismo:pri_zona_vivienda_tradicional_edificacion," +
          "urbanismo:pri_zona_viviendas_adosadas," +
          "urbanismo:pri_zona_comercial_servicios," +
          "urbanismo:pri_zona_comercial_servei_pe," +
          "urbanismo:pri_zona_turistica," +
          "urbanismo:pri_zona_turistica_hotelera," +
          "urbanismo:pri_equipamientos," +
          "urbanismo:pri_espacios_libres_publicos," +
          "urbanismo:pri_espacios_libres_privados," +
          "urbanismo:pri_catalogos",
        format: "image/png",
        transparent: true,
        minZoom: 10,
        maxZoom: 22,
        tileSize: 1024,
      }
    );*/
    /*const pri_calificaciones = L.tileLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        layers:
          "SIGDU:pri_vivienda_edificacion_abierta," +
          "SIGDU:pri_zona_vivienda_unifamiliar_aislada," +
          "SIGDU:pri_zona_residencial_entre_mitgeres," +
          "SIGDU:pri_zona_residencial_entre_medianeras_edificacion," +
          "SIGDU:pri_zona_vivienda_tradicional," +
          "SIGDU:pri_zona_vivienda_tradicional_edificacion," +
          "SIGDU:pri_zona_viviendas_adosadas," +
          "SIGDU:pri_zona_comercial_servicios," +
          "SIGDU:pri_zona_comercial_servei_pe," +
          "SIGDU:pri_zona_turistica," +
          "SIGDU:pri_zona_turistica_hotelera," +
          "SIGDU:pri_equipamientos," +
          "SIGDU:pri_espacios_libres_publicos," +
          "SIGDU:pri_espacios_libres_privados," +
          "SIGDU:pri_catalogos",
        format: "image/png",
        transparent: true,
        minZoom: 10,
        maxZoom: 22,
        tileSize: 1024,
      }*/
      const pri_calificaciones = L.tileLayer.wms(
        "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
        {
          layers:
            "SIGDU:pri_calificaciones",
          format: "image/png",
          transparent: true,
          minZoom: 10,
          maxZoom: 22,
          tileSize: 1024,
        }
    );
    this.pushMapLayer("pri_calificaciones", pri_calificaciones);
  }

  /**
   * Establece capas WMS correspondientes a los ámbitos del Plan del (PRI) Playa de Palma.
   * @returns {void}
   */
  setLayer_pri_ambitos() {
    /*const pri_ambitos = L.tileLayer.wms(
      "https://geoportal.palma.cat/geoserver/ows?authkey=null&",
      {
        layers:
          "urbanismo:pri_unidad_actuacion," +
          "urbanismo:pri_corredor_paisajistico",
        format: "image/png",
        transparent: true,
        minZoom: 10,
        maxZoom: 22,
        tileSize: 1024,
      }
    );*/
    /*const pri_ambitos = L.tileLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        layers:
          "SIGDU:pri_unidad_actuacion," +
          "SIGDU:pri_corredor_paisajistico",
        format: "image/png",
        transparent: true,
        minZoom: 10,
        maxZoom: 22,
        tileSize: 1024,
      }
    );*/
    const pri_ambitos = L.tileLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        layers:
          "SIGDU:pri_ambitos",
        format: "image/png",
        transparent: true,
        minZoom: 10,
        maxZoom: 22,
        tileSize: 1024,
      }
    );
    this.pushMapLayer("pri_ambitos", pri_ambitos);
  }

  /**
   * Establece capas WMS correspondientes a las calificaciones del PG2023.
   * @returns {void}
   */
  setLayer_pg2023_calificaciones() {
    /*const pg2023_calificaciones = L.tileLayer.wms(
      "https://geoportal.palma.cat/geoserver/ows?authkey=null&",
      {
        layers:
          "urbanismo:pg2023_sistema_general_equipamientos," +
          "urbanismo:pg2023_sistema_general_espacios_libres," +
          "urbanismo:pg2023_sistema_general_comunicaciones," +
          "urbanismo:pg2023_sistema_general_infraestructuras," +
          "urbanismo:pg2023_sistema_general_servicios_urbanos",
        format: "image/png",
        transparent: true,
        minZoom: 10,
        maxZoom: 22,
        tileSize: 1024,
      }
    );*/
    /*const pg2023_calificaciones = L.tileLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        layers:
          "SIGDU:pg2023_sistema_general_equipamientos," +
          "SIGDU:pg2023_sistema_general_espacios_libres," +
          "SIGDU:pg2023_sistema_general_comunicaciones," +
          "SIGDU:pg2023_sistema_general_infraestructuras," +
          "SIGDU:pg2023_sistema_general_servicios_urbanos",
        format: "image/png",
        transparent: true,
        minZoom: 10,
        maxZoom: 22,
        tileSize: 1024,
      }
    );*/
    const pg2023_calificaciones = L.tileLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        layers:
          "SIGDU:pg2023_calificaciones",
        format: "image/png",
        transparent: true,
        minZoom: 10,
        maxZoom: 22,
        tileSize: 1024,
      }
    );
    this.pushMapLayer("pg2023_calificaciones", pg2023_calificaciones);
  }

  /**
   * Establece capas WMS correspondientes a las categorías del suelo rústico del PG2023.
   * @returns {void}
   */
  setLayer_pg2023_categorias_rustico() {
    /*const pg2023_categorias_rustico = L.tileLayer.wms(
      "https://geoportal.palma.cat/geoserver/ows?authkey=null&",
      {
        layers: "urbanismo:pg2023_categorias_suelo_rustico",
        format: "image/png",
        transparent: true,
        minZoom: 10,
        maxZoom: 22,
        tileSize: 1024,
      }
    );*/
    const pg2023_categorias_rustico = L.tileLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        layers: "SIGDU:pg2023_categorias_suelo_rustico",
        format: "image/png",
        transparent: true,
        minZoom: 10,
        maxZoom: 22,
        tileSize: 1024,
      }
    );
    this.pushMapLayer("pg2023_categorias_rustico", pg2023_categorias_rustico);
  }

  /**
   * Establece capas WMS correspondientes a los ámbitos del PG2023.
   * @returns {void}
   */
  setLayer_pg2023_ambitos() {
    /*const pg2023_ambitos = L.tileLayer.wms(
      "https://geoportal.palma.cat/geoserver/ows?authkey=null&",
      {
        layers:
          "urbanismo:pg2023_suelo_urbano," +
          "urbanismo:pg2023_suelo_urbanizable," +
          "urbanismo:pg2023_actuaciones_aisladas," +
          "urbanismo:pg2023_actuaciones_suelo_urbano",
        format: "image/png",
        transparent: true,
        minZoom: 10,
        maxZoom: 22,
        tileSize: 1024,
      }
    );*/
    /*const pg2023_ambitos = L.tileLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        layers:
          "SIGDU:pg2023_suelo_urbano," +
          "SIGDU:pg2023_suelo_urbanizable," +
          "SIGDU:pg2023_actuaciones_aisladas," +
          "SIGDU:pg2023_actuaciones_suelo_urbano",
        format: "image/png",
        transparent: true,
        minZoom: 10,
        maxZoom: 22,
        tileSize: 1024,
      }
    );*/
    const pg2023_ambitos = L.tileLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        layers:
          "SIGDU:pg2023_ambitos",
        format: "image/png",
        transparent: true,
        minZoom: 10,
        maxZoom: 22,
        tileSize: 1024,
      }
    );
    this.pushMapLayer("pg2023_ambitos", pg2023_ambitos);
   
  }
}
