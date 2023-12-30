/**
 * Clase para gestionar el diálogo de consultas relacionadas con expedientes.
 * @memberof module:Frontend
 */
class QueryDialogEXP {
  /**
   * Crea una instancia de QueryDialogEXP.
   * @param {L.Map} map - Instancia del mapa Leaflet.
   * @param {MapLayers} mapLayers - Capas del mapa.
   * @param {TOC} toc - Controlador de la tabla de contenido (TOC).
   * @param {SigduMap} sigduMap - Instancia de SigduMap.
   */
  constructor(map, mapLayers, toc, sigduMap) {
    this.sigduMap = sigduMap;
    this.toc = toc;
    this.map = map;
    this.mapLayers = mapLayers;
    this.queryDialogEXP_Planeamiento = new QueryDialogEXP_Planeamiento(
      this.map,
      this.mapLayers,
      this.toc,
      this.sigduMap
    );
    console.log("pasa por aqui");
    this.initTabs();
    this.createHTML();
    console.log("pasa por aqui 2");
  }

  initTabs() {
    $(function () {
      $("#tabsQueryEXP").tabs({
        activate: function (event, ui) {
          // Código de activación de pestaña
        },
      });
    });
  }

  createHTML() {
    console.log("pasa por aqui");
    const htmlEXP_Planeamiento = this.queryDialogEXP_Planeamiento.createHTML();

    const htmlTabsQueryEXP = `<div style='overflow: auto;margin-top: 0px;margin-bottom: 0px; height:98%;padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px;font-size:7.8pt' id="tabsQueryEXP">
				<ul>
					<li title="Consultas Expedientes Planeamiento"><a href="#tabQueryPG2023">PLANEAMIENTO / GESTIÓN</a></li>
				</ul>
		
				<div style='overflow: auto;padding-top: 5px; padding-right: 5px; padding-bottom: 5px; padding-left: 5px' id="tabQueryPG2023"> 
					${htmlEXP_Planeamiento}
				</div>
			</div>`;

    const elem = document.getElementById("queryTablesEXP");
    elem.innerHTML = `<div style='overflow:auto;padding:20px;background-color:#f2f2f2;border-style: solid;border-width:0pt;border-color:black;box-shadow: 3px 3px 3px 3px rgba(0, 0, 0, 0.2);position:absolute;width:90%;height:90%;top:10px;left:10px'>  
        ${htmlTabsQueryEXP}
      </div>`;

    console.log(htmlEXP_Planeamiento);

    // events

    const self = this;
    const selectElement = document.getElementById(
      "selectTablesEXP_PLANEAMIENTO"
    );
    selectElement.onchange = function () {
      console.log("selectTablesEXP_Planeamiento");
      self.queryDialogEXP_Planeamiento.setOptionsQUERY();
    };
  }
}


