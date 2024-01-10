/**
 * Clase para administrar un mapa de situación.
 * @memberof module:Frontend
 */
class MapManager {
  /**
   * Crea un nuevo MapManager.
   * @constructor
   * @param {string} container - El ID del contenedor HTML donde se mostrará el mapa.
   */
  constructor(container) {
    this.map2 = null;
    this.container = container;

    if (document.getElementById(container)) {
      this.createMap();
    } else {
      console.error(`Container with id "${container}" not found.`);
    }
    //this.createMap();
  }

  /**
   * Obtiene el objeto de mapa.
   * @returns {Object} - Objeto de mapa Leaflet.
   */
  getMap() {
    return this.map2;
  }

  /**
   * Crea un elemento en el mapa con un geojson y colores específicos.
   * @param {Object} geojson - Datos geojson para crear el elemento.
   * @param {string} color - Color del borde del elemento.
   * @param {string} fillColor - Color de relleno del elemento.
   */
  createElement(geojson, color, fillColor) {
    var bbox = turf.bbox(geojson.features[0].geometry);
    var polyBBOX = turf.bboxPolygon(bbox);

    var coordsB = turf.getCoords(polyBBOX);
    var coords = [];
    coords[0] = [coordsB[0][0][1], coordsB[0][0][0]];
    coords[1] = [coordsB[0][1][1], coordsB[0][1][0]];
    coords[2] = [coordsB[0][2][1], coordsB[0][2][0]];
    coords[3] = [coordsB[0][3][1], coordsB[0][3][0]];

    var poly = L.polygon(coords);

    
    this.map2.fitBounds(poly.getBounds());

    //if (puntos != null) this.map2.removeLayer(puntos);
    const layerGeojson = L.geoJSON(geojson, {
      weight: 3,
      opacity: 1,
      color: "black",
      fillColor: fillColor,
      //dashArray: "2,7",
      fillOpacity: 0.5,
    });

    this.map2.addLayer(layerGeojson);
  }

  /**
   * Crea un nuevo mapa Leaflet en el contenedor especificado.
   * Destruye el mapa existente si ya existe.
   * @async
   */
  async createMap() {
    /*if (this.map2) {
      // Si el mapa ya existe, lo destruimos antes de crear uno nuevo
      this.destroyMap();
    }*/

    try {
     
        this.map2 = L.map(this.container, {
          zoomControl: false,
          preferCanvas: true,
        });
      

      L.tileLayer(
        "https://cartografia.palma.cat/geoserver/gwc/service/tms/1.0.0/BTUP%3Acomplet@GoogleMapsCompatible@png/{z}/{x}/{y}.png?flipY=true",
        {
          //pane: 'pane_Base',
          maxZoom: 21,
          opacity: 1,
          //attribution: autoria,
        }
      ).addTo(this.map2);

      MapManager.instances[this.container] = this;

      console.log("Map2 creado", this.map2);
    } catch (e) {
      console.log(e);
     
    }
  }

  /**
   * Destruye el mapa existente si lo hay.
   */
  destroyMap() {
    if (this.map2) {
      this.map2.remove();
      this.map2 = null;
    }
  }
}
