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
    this.setLayer_blankLayer();
    this.setLayer_cartografia_imi_color();
    this.setLayer_cartografia_imi_grey();
    this.setLayer_cartografia98();
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
    this.setLayer_pg2023_APR();
    this.setLayer_pg2023_APT();
    this.setLayer_pg2023_ambitos();
    this.setLayer_PG2023_PGOU98_PRI();
    this.setLayer_AF_PORN_ST();
    this.setLayer_AF_NATURA2000();
    this.setLayer_AF_espacio_natural_protegido();
    this.setLayer_AF_af_abc_fontanelles();
    this.setLayer_AF_ZAR_PALMA();
    this.setLayer_AF_Costas();
    this.setLayer_AF_ZDPMT_agua();
    this.setLayer_AF_APT_carreteras();
    this.setLayer_AF_APT_litoral();
    this.setLayer_AF_Via_Ferrea_SFM();
    this.setLayer_AF_Via_Ferrea_SOLLER();
    this.setLayer_AF_bic_bc_cic();
    this.setLayer_AF_NT();
    this.setLayer_AF_Inundables_T500();
    this.setLayer_AF_Inundables_freatico();
    this.setLayer_AF_potencialmente_inundable();
    this.setLayer_AF_flujo_preferente();
    this.setLayer_AF_zona_servitud();
    this.setLayer_AF_zona_policia();
    this.setLayer_AF_zona_humeda();
    this.setLayer_AF_zona_pot_humeda();
    this.setLayer_AF_protecc_pous_proveim();
    this.setLayer_AF_catalogos_molinos_entorno();
    this.setLayer_pg2023_suelo_urbano();
    this.setLayer_AF_zona_ports();
    this.setLayer_AF_zona_aerop();
    this.setLayer_AF_zpzm();
    this.setLayer_AF_emerg();
    this.setLayer_AF_parcbit();
    this.setLayer_AF_poliducto();
    this.setLayer_AF_gasoducto();
    this.setLayer_AF_servitud_aeronautica();
    this.setLayer_AF_parc_nacional();
    this.setLayer_AF_aip();
    this.setLayer_AF_zonas_n_r_parq();
    this.setLayer_AF_centro_historico();
    this.setLayer_AF_costas_zsp();
    this.setLayer_AF_costas_tr();
    this.setLayer_AF_costas_zdpmt();
    this.setLayer_AF_rustico();
    this.setLayer_AF_apr_cn();
    this.setLayer_AF_apr_er();
    this.setLayer_AF_apr_es();
    this.setLayer_base_ideib();

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
   * Establece una capa en blanco.
   * @returns {void}
   */
  setLayer_blankLayer() {
    const blankLayer = L.tileLayer(
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
      {
        minZoom: 12,
        maxZoom: 22,
        edgeBufferTiles: 1,
      }
    );
    this.pushMapLayer("blank_layer", blankLayer);
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
        maxZoom: 22,
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
        minZoom: 10,
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
      opacity: 0.8,
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
        opacity: 0.7,
      }
    );
    this.pushMapLayer("openstreetmap_gray", osm_gray);
  }

  /**
   * Establece la capa del Catastro utilizando WMS para obtener datos cartográficos.
   * @returns {void}
   */
  setLayer_catastro() {
    const catastro = L.nonTiledLayer.wms(
      "https://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?",
      {
        layers: "catastro",
        format: "image/png",
        noWrap: false,
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

    /*const cartografia_imi_color = new L.nonTiledLayer.wms("https://cartografia.palma.cat/geoserver/BTUP/wms?version=1.1.0&layers=BTUP%3Acomplet&bbox=462467.2602623855%2C4372637.595690957%2C486893.416067546%2C4389962.359308018&width=768&height=544&srs=EPSG%3A25831&styles=", {
      maxZoom: 22,
      minZoom: 10,
      //opacity: 1.0,
      noWrap: false,
      layers: 'BTUP_complet',
      format: 'image/png',
      transparent: true,
      //attribution: xMapAttribution,
      //zIndex: 1
    });
    this.pushMapLayer("cartografia_imi_color", cartografia_imi_color);*/

    /*const cartografia_imi_color = new L.nonTiledLayer.wms(
      "https://cartografia.palma.cat/geoserver/ows?authkey=null&",
      {
        layers: "BTUP:complet",
        format: "image/png",
        noWrap: false,
        transparent: true,
        minZoom: 10,
        maxZoom: 22,
        opacity: 0.8,
        //tileSize: 512,
      }
    );
    this.pushMapLayer("cartografia_imi_color", cartografia_imi_color);*/
  }

  /**
   * Establece la capa de cartografía IMI en escala de grises como una capa de teselas.
   * @returns {void}
   */
  setLayer_cartografia_imi_grey() {
    const cartografia_imi_grey = L.tileLayer.grayscale(
      "https://cartografia.palma.cat/geoserver/gwc/service/tms/1.0.0/BTUP%3Acomplet@GoogleMapsCompatible@png/{z}/{x}/{y}.png?flipY=true",

      //"https://cartografia.palma.cat/geoserver/gwc/service/tms/1.0.0/BTUP%3Amapa_base@GoogleMapsCompatible@png/{z}/{x}/{y}.png?flipY=true",
      {
        minZoom: 10,
        maxZoom: 22,
        opacity: 0.8,
        transparent: true,
        //tileSize: 512,
        edgeBufferTiles: 0,
      }
    );

    this.pushMapLayer("cartografia_imi_grey", cartografia_imi_grey);

    /*const cartografia_imi_grey = new L.nonTiledLayer.wms(
      "https://cartografia.palma.cat/geoserver/ows?authkey=null&",
      {
        layers:
          "BTUP:complet",
        format: "image/png",
        noWrap: false,
        transparent: true,
        minZoom: 10,
        maxZoom: 22,
        opacity: 0.8,
        //tileSize: 512,
      }
    );
    this.pushMapLayer("cartografia_imi_grey", cartografia_imi_grey);*/
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
    /*const pgou98_calificaciones = L.tileLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        layers:
          "SIGDU:calificaciones_pgou98", 
        format: "image/png",
        transparent: true,
        minZoom: 10,
        maxZoom: 22,
        tileSize: 512,
      }
    );*/

    const pgou98_calificaciones = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        //opacity: 1.0,
        noWrap: false,
        layers: "SIGDU:calificaciones_pgou98",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
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
    /*const pgou98_ambitos = L.tileLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        layers:
          "SIGDU:pgou98_ambitos",
        format: "image/png",
        transparent: true,
        minZoom: 10,
        maxZoom: 22,
        tileSize: 512,
      }
    );*/
    const pgou98_ambitos = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 0,
        opacity: 1.0,
        noWrap: false,
        layers: "SIGDU:pgou98_ambitos",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
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
    /*  const pri_calificaciones = L.tileLayer.wms(
        "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
        {
          layers:
            "SIGDU:pri_calificaciones",
          format: "image/png",
          transparent: true,
          minZoom: 10,
          maxZoom: 22,
          tileSize: 512,
        }
    );*/

    const pri_calificaciones = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        //opacity: 1.0,
        noWrap: false,
        layers: "SIGDU:pri_calificaciones",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
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
    /*const pri_ambitos = L.tileLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        layers:
          "SIGDU:pri_ambitos",
        format: "image/png",
        transparent: true,
        minZoom: 10,
        maxZoom: 22,
        tileSize: 512,
      }
    );*/
    const pri_ambitos = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        //opacity: 1.0,
        noWrap: false,
        layers: "SIGDU:pri_ambitos",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
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
    /*const pg2023_calificaciones = L.tileLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        layers:
          "SIGDU:pg2023_calificaciones",
        format: "image/png",
        transparent: true,
        minZoom: 10,
        maxZoom: 22,
        tileSize: 512,
      }
    );*/
    const pg2023_calificaciones = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        //opacity: 1.0,
        noWrap: false,
        layers: "SIGDU:pg2023_calificaciones",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
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
    /*const pg2023_categorias_rustico = L.tileLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        layers: "SIGDU:pg2023_categorias_suelo_rustico",
        format: "image/png",
        transparent: true,
        minZoom: 10,
        maxZoom: 22,
        tileSize: 512,
      }
    );*/
    const pg2023_categorias_rustico = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        //opacity: 1.0,
        noWrap: false,
        layers: "SIGDU:pg2023_categorias_suelo_rustico",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );

    this.pushMapLayer("pg2023_categorias_rustico", pg2023_categorias_rustico);
  }

  /**
   * Establece capas WMS correspondientes a las APT del PG2023.
   * @returns {void}
   */
  setLayer_pg2023_APT() {
    const pg2023_rustico_apt = L.tileLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        layers: "SIGDU:pg_rustico_apt",
        format: "image/png",
        transparent: true,
        minZoom: 10,
        maxZoom: 22,
        tileSize: 1024,
      }
    );

    this.pushMapLayer("pg2023_rustico_apt", pg2023_rustico_apt);
  }

  /**
   * Establece capas WMS correspondientes a las APR del PG2023.
   * @returns {void}
   */
  setLayer_pg2023_APR() {
    const pg2023_rustico_riesgos = L.tileLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        layers: "SIGDU:pg_rustico_riesgos",
        format: "image/png",
        transparent: true,
        minZoom: 10,
        maxZoom: 22,
        tileSize: 1024,
      }
    );

    this.pushMapLayer("pg2023_rustico_apr", pg2023_rustico_riesgos);
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
    /*const pg2023_ambitos = L.tileLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        layers:
          "SIGDU:pg2023_ambitos",
        format: "image/png",
        transparent: true,
        minZoom: 10,
        maxZoom: 22,
        tileSize: 512,
      }
    );*/
    const pg2023_ambitos = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        //opacity: 1.0,
        noWrap: false,
        layers: "SIGDU:pg2023_ambitos",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );
    this.pushMapLayer("pg2023_ambitos", pg2023_ambitos);
  }

  /**
   * Establece capas WMS correspondientes a los topografia oficial PGOU98.
   * @returns {void}
   */
  setLayer_cartografia98() {
    const cartografia98 = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        opacity: 0.8,
        noWrap: false,
        layers: "SIGDU:Cartografia98",
        format: "image/png",
        //transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );
    this.pushMapLayer("cartografia98", cartografia98);
  }

  /**
   * Establece capas WMS correspondientes a las afecciones de costas.
   * @returns {void}
   */
  setLayer_PG2023_PGOU98_PRI() {
    const pg2023_pgou98_pri = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        opacity: 0.8,
        noWrap: false,
        layers: "SIGDU:pg2023_pgou98_pri",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );
    this.pushMapLayer("pg2023_pgou98_pri", pg2023_pgou98_pri);
  }

  /**
   * Establece capas WMS correspondientes a las afecciones de PORN Serra Tramuntana.
   * @returns {void}
   */
  setLayer_AF_PORN_ST() {
    const af_porn_serra_tramuntana = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        opacity: 1,
        noWrap: false,
        layers: "SIGDU:af_porn_serra_tramuntana",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );
    this.pushMapLayer("af_porn_serra_tramuntana", af_porn_serra_tramuntana);
  }

  /**
   * Establece capas WMS correspondientes a las afecciones de RED NATURA 2000.
   * @returns {void}
   */
  setLayer_AF_NATURA2000() {
    const af_red_natura_2000 = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        opacity: 1,
        noWrap: false,
        layers: "SIGDU:af_red_natura_2000",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );
    this.pushMapLayer("af_red_natura_2000", af_red_natura_2000);
  }

  /**
   * Establece capas WMS correspondientes a las afecciones de Espacio natural protegido.
   * @returns {void}
   */
  setLayer_AF_espacio_natural_protegido() {
    const af_espacio_natural_protegido = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        opacity: 1,
        noWrap: false,
        layers: "SIGDU:af_espacio_natural_protegido",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );
    this.pushMapLayer(
      "af_espacio_natural_protegido",
      af_espacio_natural_protegido
    );
  }

  /**
   * Establece capas WMS correspondientes a las afecciones de Espacio af abc fontanelles.
   * @returns {void}
   */
  setLayer_AF_af_abc_fontanelles() {
    const af_abc_fontanelles = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        opacity: 1,
        noWrap: false,
        layers: "SIGDU:af_abc_fontanelles",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );
    this.pushMapLayer("af_abc_fontanelles", af_abc_fontanelles);
  }

  /**
   * Establece capas WMS correspondientes a las afecciones de costas.
   * @returns {void}
   */
  setLayer_AF_Costas() {
    const af_costas = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        opacity: 1,
        noWrap: false,
        layers: "SIGDU:af_costas",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );
    this.pushMapLayer("af_costas", af_costas);
  }

  /**
   * Establece capas WMS correspondientes a las afecciones de ZDPMT (AGUA).
   * @returns {void}
   */
  setLayer_AF_ZDPMT_agua() {
    const af_zdpmt_agua = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        opacity: 1,
        noWrap: false,
        layers: "SIGDU:af_zdpmt_agua",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );
    this.pushMapLayer("af_zdpmt_agua", af_zdpmt_agua);
  }

  /**
   * Establece capas WMS correspondientes a las afecciones de APT carreteras.
   * @returns {void}
   */
  setLayer_AF_APT_carreteras() {
    const af_apt_carreteras = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        opacity: 1,
        noWrap: false,
        layers: "SIGDU:af_apt_carreteras",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );
    this.pushMapLayer("af_apt_carreteras", af_apt_carreteras);
  }

  /**
   * Establece capas WMS correspondientes a las afecciones de APT litoral.
   * @returns {void}
   */
  setLayer_AF_APT_litoral() {
    const af_apt_litoral = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        opacity: 1,
        noWrap: false,
        layers: "SIGDU:af_apt_litoral",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );
    this.pushMapLayer("af_apt_litoral", af_apt_litoral);
  }

  /**
   * Establece capas WMS correspondientes a las afecciones de Via Ferrea SFM.
   * @returns {void}
   */
  setLayer_AF_Via_Ferrea_SFM() {
    const af_via_ferrea_sfm = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        opacity: 1,
        noWrap: false,
        layers: "SIGDU:af_via_ferrea_sfm",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );
    this.pushMapLayer("af_via_ferrea_sfm", af_via_ferrea_sfm);
  }

  /**
   * Establece capas WMS correspondientes a las afecciones de Via Ferrea SOLLER.
   * @returns {void}
   */
  setLayer_AF_Via_Ferrea_SOLLER() {
    const af_via_ferrea_soller = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        opacity: 1,
        noWrap: false,
        layers: "SIGDU:af_via_ferrea_soller",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );
    this.pushMapLayer("af_via_ferrea_soller", af_via_ferrea_soller);
  }

  /**
   * Establece capas WMS correspondientes a las afecciones de (BIC/BC/CIC).
   * @returns {void}
   */
  setLayer_AF_bic_bc_cic() {
    const af_bic_bc_cic = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        opacity: 1,
        noWrap: false,
        layers: "SIGDU:af_bic_bc_cic",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );
    this.pushMapLayer("af_bic_bc_cic", af_bic_bc_cic);
  }

  /**
   * Establece capas WMS correspondientes a las afecciones de ZAR Palma.
   * @returns {void}
   */
  setLayer_AF_ZAR_PALMA() {
    const af_zar_palma = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        opacity: 1,
        noWrap: false,
        layers: "SIGDU:af_zar_palma",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );
    this.pushMapLayer("af_zar_palma", af_zar_palma);
  }

  /**
   * Establece capas WMS correspondientes a las afecciones de Nucleos tradicionales.
   * @returns {void}
   */
  setLayer_AF_NT() {
    const af_nucleos_tradicionales = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        opacity: 1,
        noWrap: false,
        layers: "SIGDU:af_nucleos_tradicionales",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );
    this.pushMapLayer("af_nucleos_tradicionales", af_nucleos_tradicionales);
  }

  /**
   * Establece capas WMS correspondientes a las afecciones de Zonas inundables T500.
   * @returns {void}
   */
  setLayer_AF_Inundables_T500() {
    const af_inundables_t500 = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        opacity: 1,
        noWrap: false,
        layers: "SIGDU:af_inundables_t500",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );
    this.pushMapLayer("af_inundables_t500", af_inundables_t500);
  }

  /**
   * Establece capas WMS correspondientes a las afecciones de Zonas inundables freatico.
   * @returns {void}
   */
  setLayer_AF_Inundables_freatico() {
    const af_inundables_freatico = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        opacity: 1,
        noWrap: false,
        layers: "SIGDU:af_inundables_freatico",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );
    this.pushMapLayer("af_inundables_freatico", af_inundables_freatico);
  }

  /**
   * Establece capas WMS correspondientes a las afecciones de Zonas potencialmente inundable.
   * @returns {void}
   */
  setLayer_AF_potencialmente_inundable() {
    const af_potencialmente_inundable = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        opacity: 1,
        noWrap: false,
        layers: "SIGDU:af_potencialmente_inundable",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );
    this.pushMapLayer(
      "af_potencialmente_inundable",
      af_potencialmente_inundable
    );
  }

  /**
   * Establece capas WMS correspondientes a las afecciones de Zonas flujo preferente.
   * @returns {void}
   */
  setLayer_AF_flujo_preferente() {
    const af_flujo_preferente = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        opacity: 1,
        noWrap: false,
        layers: "SIGDU:af_flujo_preferente",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );
    this.pushMapLayer("af_flujo_preferente", af_flujo_preferente);
  }

  /**
   * Establece capas WMS correspondientes a las afecciones de Zonas servitud.
   * @returns {void}
   */
  setLayer_AF_zona_servitud() {
    const af_zona_servitud = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        opacity: 1,
        noWrap: false,
        layers: "SIGDU:af_zona_servitud",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );
    this.pushMapLayer("af_zona_servitud", af_zona_servitud);
  }

  /**
   * Establece capas WMS correspondientes a las afecciones de Zonas policia.
   * @returns {void}
   */
  setLayer_AF_zona_policia() {
    const af_zona_policia = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        opacity: 1,
        noWrap: false,
        layers: "SIGDU:af_zona_policia",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );
    this.pushMapLayer("af_zona_policia", af_zona_policia);
  }

  /**
   * Establece capas WMS correspondientes a las afecciones de Zonas humedas.
   * @returns {void}
   */
  setLayer_AF_zona_humeda() {
    const af_zona_humeda = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        opacity: 1,
        noWrap: false,
        layers: "SIGDU:af_zona_humeda",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );
    this.pushMapLayer("af_zona_humeda", af_zona_humeda);
  }

  /**
   * Establece capas WMS correspondientes a las afecciones de Zonas potencialmente humedas.
   * @returns {void}
   */
  setLayer_AF_zona_pot_humeda() {
    const af_zona_pot_humeda = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        opacity: 1,
        noWrap: false,
        layers: "SIGDU:af_zona_pot_humeda",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );
    this.pushMapLayer("af_zona_pot_humeda", af_zona_pot_humeda);
  }

  /**
   * Establece capas WMS correspondientes a las afecciones de Perímetre de protecció de captació de proveïment a població.
   * @returns {void}
   */
  setLayer_AF_protecc_pous_proveim() {
    const af_protecc_pous_proveim = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        opacity: 1,
        noWrap: false,
        layers: "SIGDU:af_protecc_pous_proveim",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );
    this.pushMapLayer("af_protecc_pous_proveim", af_protecc_pous_proveim);
  }

  /**
   * Establece capas WMS correspondientes a las afecciones de catalogos/molinos/entorno.
   * @returns {void}
   */
  setLayer_AF_catalogos_molinos_entorno() {
    const af_catalogos_molinos_entorno = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        opacity: 1,
        noWrap: false,
        layers: "SIGDU:af_catalogos_molinos_entorno",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );
    this.pushMapLayer(
      "af_catalogos_molinos_entorno",
      af_catalogos_molinos_entorno
    );
  }

  /**
   * Establece capas WMS correspondientes a las afecciones de zona puertos.
   * @returns {void}
   */
  setLayer_AF_zona_ports() {
    const af_zona_ports = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        opacity: 1,
        noWrap: false,
        layers: "SIGDU:af_zona_ports",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );
    this.pushMapLayer("af_zona_ports", af_zona_ports);
  }

  /**
   * Establece capas WMS correspondientes a las afecciones de zona aeropuerto.
   * @returns {void}
   */
  setLayer_AF_zona_aerop() {
    const af_zona_aerop = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        opacity: 1,
        noWrap: false,
        layers: "SIGDU:af_zona_aerop",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );
    this.pushMapLayer("af_zona_aerop", af_zona_aerop);
  }

  /**
   * Establece capas WMS correspondientes a las afecciones de zona protección zonas militares.
   * @returns {void}
   */
  setLayer_AF_zpzm() {
    const af_zpzm = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        opacity: 1,
        noWrap: false,
        layers: "SIGDU:af_zpzm",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );
    this.pushMapLayer("af_zpzm", af_zpzm);
  }

  /**
   * Establece capas WMS correspondientes a las afecciones de zona seguridad emergencias.
   * @returns {void}
   */
  setLayer_AF_emerg() {
    const af_emerg = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        opacity: 1,
        noWrap: false,
        layers: "SIGDU:af_emerg",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );
    this.pushMapLayer("af_emerg", af_emerg);
  }

  /**
   * Establece capas WMS correspondientes a las afecciones de Parcbit.
   * @returns {void}
   */
  setLayer_AF_parcbit() {
    const af_parcbit = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        opacity: 1,
        noWrap: false,
        layers: "SIGDU:af_parcbit",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );
    this.pushMapLayer("af_parcbit", af_parcbit);
  }

  /**
   * Establece capas WMS correspondientes a las afecciones de zona poliducto.
   * @returns {void}
   */
  setLayer_AF_poliducto() {
    const af_poliducto = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        opacity: 1,
        noWrap: false,
        layers: "SIGDU:af_poliducto",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );
    this.pushMapLayer("af_poliducto", af_poliducto);
  }

  /**
   * Establece capas WMS correspondientes a las afecciones de zona gasoducto.
   * @returns {void}
   */
  setLayer_AF_gasoducto() {
    const af_gasoducto = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        opacity: 1,
        noWrap: false,
        layers: "SIGDU:af_gasoducto",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );
    this.pushMapLayer("af_gasoducto", af_gasoducto);
  }

  /**
   * Establece capas WMS correspondientes a las afecciones de servitud aeronautica.
   * @returns {void}
   */
  setLayer_AF_servitud_aeronautica() {
    const af_servitud_aeronautica = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        opacity: 1,
        noWrap: false,
        layers: "SIGDU:af_servitud_aeronautica",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );
    this.pushMapLayer("af_servitud_aeronautica", af_servitud_aeronautica);
  }

  /**
   * Establece capas WMS correspondientes a las afecciones de Parc Nacional Cabrera.
   * @returns {void}
   */
  setLayer_AF_parc_nacional() {
    const af_parc_nacional = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        opacity: 1,
        noWrap: false,
        layers: "SIGDU:af_parc_nacional",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );
    this.pushMapLayer("af_parc_nacional", af_parc_nacional);
  }

  /**
   * Establece capas WMS correspondientes a las afecciones de AIP.
   * @returns {void}
   */
  setLayer_AF_aip() {
    const af_aip = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        opacity: 1,
        noWrap: false,
        layers: "SIGDU:af_aip",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );
    this.pushMapLayer("af_aip", af_aip);
  }

  /**
   * Establece capas WMS correspondientes a las afecciones dde zonas N,R,r.
   * @returns {void}
   */
  setLayer_AF_zonas_n_r_parq() {
    const af_zonas_n_r_parq = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        opacity: 1,
        noWrap: false,
        layers: "SIGDU:af_zonas_n_r_parq",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );
    this.pushMapLayer("af_zonas_n_r_parq", af_zonas_n_r_parq);
  }

  /**
   * Establece capas WMS correspondientes a las afecciones de zona
   * @returns {void}
   */
  setLayer_AF_centro_historico() {
    const af_centro_historico = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        opacity: 1,
        noWrap: false,
        layers: "SIGDU:af_centro_historico",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );
    this.pushMapLayer("af_centro_historico", af_centro_historico);
  }

  /**
   * Establece capas WMS correspondientes a las afecciones de zona costas ZSP
   * @returns {void}
   */
  setLayer_AF_costas_zsp() {
    const af_costas_zsp = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        opacity: 1,
        noWrap: false,
        layers: "SIGDU:af_costas_zsp",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );
    this.pushMapLayer("af_costas_zsp", af_costas_zsp);
  }

  /**
   * Establece capas WMS correspondientes a las afecciones de zona costas TR
   * @returns {void}
   */
  setLayer_AF_costas_tr() {
    const af_costas_tr = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        opacity: 1,
        noWrap: false,
        layers: "SIGDU:af_costas_tr",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );
    this.pushMapLayer("af_costas_tr", af_costas_tr);
  }

  /**
   * Establece capas WMS correspondientes a las afecciones de zona costas TR
   * @returns {void}
   */
  setLayer_AF_costas_zdpmt() {
    const af_costas_zdpmt = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        opacity: 1,
        noWrap: false,
        layers: "SIGDU:af_costas_zd,SIGDU:af_zdpmt_agua",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );
    this.pushMapLayer("af_costas_zdpmt", af_costas_zdpmt);
  }

  /**
   * Establece capas WMS correspondientes a las afecciones de zona costas TR
   * @returns {void}
   */
  setLayer_AF_rustico() {
    const af_rustico = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        opacity: 1,
        noWrap: false,
        layers: "SIGDU:af_rustico",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );
    this.pushMapLayer("af_rustico", af_rustico);
  }

  /**
   * Establece capas WMS correspondientes a las afecciones de zona APR-CN
   * @returns {void}
   */
  setLayer_AF_apr_cn() {
    const af_apr_cn = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        opacity: 1,
        noWrap: false,
        layers: "SIGDU:af_apr_cn",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );
    this.pushMapLayer("af_apr_cn", af_apr_cn);
  }

  /**
   * Establece capas WMS correspondientes a las afecciones de zona APR-ER
   * @returns {void}
   */
  setLayer_AF_apr_er() {
    const af_apr_er = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        opacity: 1,
        noWrap: false,
        layers: "SIGDU:af_apr_er",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );
    this.pushMapLayer("af_apr_er", af_apr_er);
  }

  /**
   * Establece capas WMS correspondientes a las afecciones de zona APR-ES
   * @returns {void}
   */
  setLayer_AF_apr_es() {
    const af_apr_es = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        opacity: 1,
        noWrap: false,
        layers: "SIGDU:af_apr_es",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );
    this.pushMapLayer("af_apr_es", af_apr_es);
  }

  /**
   * Establece capas WMS correspondientes a delimitación del Suelo Urbano.
   * @returns {void}
   */
  setLayer_pg2023_suelo_urbano() {
    const pg2023_suelo_urbano = new L.nonTiledLayer.wms(
      "https://sigdu-urbanismo.net/geoserver/ows?authkey=null&",
      {
        maxZoom: 22,
        minZoom: 10,
        opacity: 1,
        noWrap: false,
        layers: "SIGDU:pg2023_suelo_urbano",
        format: "image/png",
        transparent: true,
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );
    this.pushMapLayer("pg2023_suelo_urbano", pg2023_suelo_urbano);
  }

  /**
   * Establece la capa base IDEIB basada en teselas
   * @returns {void}
   */
  setLayer_base_ideib() {
    var paramServeisWMTS =
      //"?SERVICE: WMTS&VERSION=1.0.0&REQUEST=GetTile&STYLE=default&TILEMATRIXSET=default028mm&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}";
      "?";
    const base_ideib = L.tileLayer(
      "https://ideib.caib.es/geoserveis/rest/services/public/GOIB_MapaBase_IB/MapServer/WMTS" +
        paramServeisWMTS,
      {
        layer: "public_GOIB_MapaBase_IB",
        crs: "EPSG:25831&dpiMode=7&format=image/jpgpng&layers=public_GOIB_MapaBase_IB&styles=default&tileMatrixSet=default028mm&url=https://ideib.caib.es/geoserveis/rest/services/public/GOIB_MapaBase_IB/MapServer/WMTS",
        attribution: '<a href="https://ideib.caib.es">SITIBSA-GOIB</a>',
        format: "image/png",
      }
    );
    this.pushMapLayer("base_ideib", base_ideib);
  }

  /*setLayer_base_ideib() {
    
    const base_ideib = new L.nonTiledLayer.wms(
      "https://ideib.caib.es/geoserveis/services/public/GOIB_MapaBase_IB/MapServer/WMSServer?",
      {
        maxZoom: 22,
        minZoom: 10,
        opacity: 1,
        noWrap: false,
        layers: "public_GOIB_MapaBase_IB",
        format: "image/png",
        transparent: true,
        //crs: "EPSG:25831",
        //attribution: xMapAttribution,
        //zIndex: 1
      }
    );
    this.pushMapLayer("base_ideib", base_ideib);
  }*/
}
