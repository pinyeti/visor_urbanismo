/**
 * Clase que representa un cuadro de diálogo de consultas para diversas capas geoespaciales.
 * @memberof module:Frontend
 */
class QueryDialog {
  /**
   * Constructor de la clase QueryDialog.
   * @param {L.Map} map - Objeto de mapa Leaflet.
   * @param {MapLayerManager} mapLayers - Administrador de capas del mapa.
   * @param {TOC} toc - Tabla de contenido para gestionar capas.
   * @param {SIGDUMap} sigduMap - Instancia de SIGDUMap.
   */
  constructor(map, mapLayers, toc, sigduMap) {
    this.sigduMap = sigduMap;
    this.toc = toc;
    this.map = map;
    this.mapLayers = mapLayers;

    // Inicializa instancias de QueryDialog para capas específicas
    this.queryDialogPG2023 = new QueryDialogPG2023(
      this.map,
      this.mapLayers,
      this.toc,
      this.sigduMap
    );
    this.queryDialogPGOU98 = new QueryDialogPGOU98(
      this.map,
      this.mapLayers,
      this.toc,
      this.sigduMap
    );
    this.queryDialogPRI = new QueryDialogPRI(
      this.map,
      this.mapLayers,
      this.toc,
      this.sigduMap
    );

    // Inicializa las pestañas y crea el contenido HTML
    this.initTabs();
    this.createHTML();
  }

  /**
   * Inicializa las pestañas de consulta.
   */
  initTabs() {
    $(function () {
      $("#tabsQuery").tabs({
        activate: function (event, ui) {
          // Código de activación de pestaña
        },
      });
    });
  }

  /**
   * Crea el contenido HTML del cuadro de diálogo de consulta.
   */
  createHTML() {
    // Crea el contenido HTML para cada consulta específica (PG2023, PGOU98, PRI)
    const htmlPG2023 = this.queryDialogPG2023.createHTML();
    const htmlPGOU98 = this.queryDialogPGOU98.createHTML();
    const htmlPRI = this.queryDialogPRI.createHTML();

    // Crea el contenido HTML de las pestañas de consulta
    const htmlTabsQuery = `<div style='overflow: auto;margin-top: 0px;margin-bottom: 0px; height:98%;padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px;font-size:7.8pt' id="tabsQuery">
				<ul>
					<li title="Consultas Plan General 2023"><a href="#tabQueryPG2023">PLAN GENERAL 2023</a></li>
					<li title="Consultas Plan General de ordenación urbana 1998"><a href="#tabQueryPGOU98">POD (PGOU98)</a></li>
					<li title="Consultes PRI Playa de Palma"><a href="#tabQueryPRI">POD (PRI)</a></li>
				</ul>
		
				<div style='overflow: auto;padding-top: 5px; padding-right: 5px; padding-bottom: 5px; padding-left: 5px' id="tabQueryPG2023"> 
					${htmlPG2023}
				</div>
				<div style='overflow: auto;padding-top: 5px; padding-right: 5px; padding-bottom: 5px; padding-left: 5px' id="tabQueryPGOU98">
          ${htmlPGOU98}
				</div>
				<div style='overflow: auto;padding-top: 5px; padding-right: 5px; padding-bottom: 5px; padding-left: 5px' id="tabQueryPRI">
          ${htmlPRI}
				</div>
			</div>`;

    // Agrega el contenido HTML al elemento con ID "queryTables"
    const elem = document.getElementById("queryTables");
    elem.innerHTML = `<div style='overflow:auto;padding:20px;background-color:#f2f2f2;border-style: solid;border-width:0pt;border-color:black;box-shadow: 3px 3px 3px 3px rgba(0, 0, 0, 0.2);position:absolute;width:90%;height:90%;top:10px;left:10px'>  
        ${htmlTabsQuery}
      </div>`;

    // Maneja eventos

    const self = this;
    const selectElement = document.getElementById("selectTablesPG2023");
    selectElement.onchange = function () {
      console.log("selectTablesPG2023 cahnge");
      self.queryDialogPG2023.setOptionsQUERY();
    };
    const selectElementPGOU98 = document.getElementById("selectTablesPGOU98");
    selectElementPGOU98.onchange = function () {
      self.queryDialogPGOU98.setOptionsQUERY();
    };
    const selectElementPRI = document.getElementById("selectTablesPRI");
    selectElementPRI.onchange = function () {
      console.log("selectTablesPRI cahnge");
      self.queryDialogPRI.setOptionsQUERY();
    };
  }
}
