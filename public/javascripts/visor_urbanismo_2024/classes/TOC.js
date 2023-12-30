/**
 * Clase para gestionar la tabla de contenidos (TOC) en un mapa.
 * @memberof module:Frontend
 */
class TOC {
  /**
   * Constructor de la clase TOC.
   * @constructor
   * @param {Object} mapLayers - Capas del mapa.
   * @param {Object} mapBaseActual - Capa base actual del mapa.
   * @param {Object} map - Instancia del mapa.
   */
  constructor(mapLayers, mapBaseActual, map) {
    this.mapBaseActual = mapBaseActual;
    this.map = map;
    this.mapLayers = mapLayers;
    this.dataOrdenacion = [];
    this.htmSliderOrdenacion = ``;
    this.htmSliderBaseMap = ``;
    this.htmSliderConsultas = ``;
    this.htmColorConsultas = ``;
    this.htmStyleOrdenacion = ``;
    this.htmStyleBaseMap = ``;
    this.htmStyleConsultas = ``;
    this.htmTreeOrdenacion = ``;
    this.htmTreeConsultas = ``;
    this.htmlTabsBase = ``;
    this.htmAccordion = ``;
  }

  async initialize() {
    this.createControls();
    this.createTreeOrdenacion();
    this.createSliderOrdenacion();
    this.createBaseMap();
    this.createSliderBaseMap();
    this.createTreeConsultas();
    this.createSliderConsultas();
    this.createControlPickerConsultas();
    this.createStyleConsultas();

    this._createAcoordion();
  }

  async setLayerAI() {
    await this.mapLayers.setLayer_PA_aprobacion_inial();
    //this.mapLayers.getMapLayerByName("layerPA_ai").getLayer().addTo(map);
    const layerPA_ai = this.mapLayers
      .getMapLayerByName("layerPA_ai")
      .getLayer();

    const self = this;

    // Agregar el evento zoomend para controlar la visibilidad
    this.map.on("zoomend", function () {
      var isChecked = $("#jstree_ord").jstree(true).is_checked(4);
      if (isChecked) {
        const currentZoom = self.map.getZoom();
        if (currentZoom >= 14 && currentZoom <= 22) {
          if (!self.map.hasLayer(layerPA_ai)) {
            self.map.addLayer(layerPA_ai);
          }
        } else {
          if (self.map.hasLayer(layerPA_ai)) {
            self.map.removeLayer(layerPA_ai);
          }
        }
      }
    });
  }

  /**
   * Obtiene el HTML de la tabla de contenidos.
   * @returns {string} - HTML generado para la tabla de contenidos.
   */
  getHTM_TOC() {
    return this.htmAccordion;
  }

  /**
   * Crea y configura un acordion para mostrar diferentes secciones de contenido.<br>
   * <strong>Private method</strong>
   * @returns {void}
   */
  _createAcoordion() {
    this.htmAccordion = `<div  id="accordion">		 
      <h3 id="toc_mapas_base">MAPAS BASE</h3>
        <div style='padding:0px'>
          ${this.htmStyleBaseMap}
          ${this.htmlTabsBase} 		
        </div>
      <h3 id="toc_ordenacion">ORDENACIÓN</h3>
        <div style='overflow: hidden;padding:0px'>
          ${this.htmStyleOrdenacion}
          ${this.htmTreeOrdenacion}
        </div>
      <h3 id="toc_consultas">CONSULTAS</h3>
        <div style='overflow: hidden;padding:0px'>
          <input style='font-size:7pt;height:20' class="ui-button ui-widget ui-corner-all" type="button" name="addLayersNormativa" value="BORRAR SELECCIONADOS" id="deleteSelectedConsultas"> </input> 
          <button style="padding-top:0px;padding-bottom:1px;" class="ui-button ui-widget ui-corner-all" title="Descarga en formato geojson"  id="download_select_consultas"><i class="fa fa-download"></i></button>
          
          ${this.htmlStyleConsultas}
          
          ${this.htmTreeConsultas}
        </div>
		</div>`;

    if (!this._isMobile()) {
      L.control
        .slideMenu(this.htmAccordion, {
          position: "topright",
          menuposition: "topright",
          width: "350px",
          height: "571px",
          //icon: "menu-icon",
        })
        .addTo(this.map);
    } else {
      L.control
        .slideMenu(this.htmAccordion, {
          position: "topright",
          menuposition: "topright",
          width: "295px",
          height: "571px",
          //icon: "menu-icon",
        })
        .addTo(this.map);
    }

    const self = this;
    document
      .getElementById("download_select_consultas")
      .addEventListener("click", function () {
        self.downloadSelectedConsultas();
      });
    document
      .getElementById("deleteSelectedConsultas")
      .addEventListener("click", function () {
        self.deleteSelectedConsultas();
      });
  }

  /**
   * Verifica si el dispositivo actual se encuentra en un viewport móvil<br>
   * <strong>Private method</strong>
   * @returns {boolean} Devuelve `true` si el ancho del viewport es como máximo 767 píxeles, lo que indica un dispositivo móvil.
   */
  _isMobile() {
    return window.matchMedia("(max-width: 767px)").matches;
  }

  /**
   * Crea y devuelve un conjunto de datos representando categorías de suelo PG2023.<br>
   * <strong>Private method</strong>
   * @returns {Object[]} Array de objetos representando categorías de suelo.
   */
  _createDataCategoriasSuelo2023() {
    const data = [
      {
        id: "1_1",
        text: '<Label id="tree_AANP" style="font-size:8pt"><i>(AANP) Areas naturales de especial interés de alto nivel de protección</i></Label>',
        icon: "images/legends/RV_AANP.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "1_2",
        text: '<Label style="font-size:8pt"><i>(ANEI) Áreas naturales de especial interés</i></Label>',
        icon: "images/legends/RV_ANEI.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "1_3",
        text: '<Label style="font-size:8pt"><i>((AIN-PG) Áreas de interés natural por planeamiento general</i></Label>',
        icon: "images/legends/RV_AIN.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "1_4",
        text: '<Label style="font-size:8pt"><i>(ZIP) Zonas de Interés pasajistico protegidas por planeamiento general</i></Label>',
        icon: "images/legends/RV_ZIP.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "1_5",
        text: '<Label style="font-size:8pt"><i>(ARIP) Áreas rurales de interés paisajístico</i></Label>',
        icon: "images/legends/RV_ARIP.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "1_6",
        text: '<Label style="font-size:8pt"><i>(SRG) Áreas de suelo rústico de régimen general</i></Label>',
        icon: "images/legends/RV_SRG.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "1_7",
        text: '<Label style="font-size:8pt"><i>(AIA) Áreas de interés agrario</i></Label>',
        icon: "images/legends/RV_AIA.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "1_8",
        text: '<Label style="font-size:8pt"><i>(AT-H) Áreas de transición, de armonización </i></Label>',
        icon: "images/legends/RV_AT-H.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "1_9",
        text: '<Label style="font-size:8pt"><i>(NR) Núcleo rural</i></Label>',
        icon: "images/legends/RV_NR.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
    ];

    return data;
  }

  /**
   * Crea y devuelve un conjunto de datos representando ámbitos PGOU98.<br>
   * <strong>Private method</strong>
   * @returns {Object[]} Array de objetos representando ámbitos PGOU98.
   */
  _createDataAmbitosPGOU98() {
    const data = [
      {
        id: "3_1_1",
        text: '<Label style="font-size:8pt"><i>(UE) Unidad de ejecución</i></Label>',
        icon: "images/legends/UE_PGV.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "3_1_2",
        text: '<Label style="font-size:8pt"><i>(API) Area Planeamiento Incorporado</i></Label>',
        icon: "images/legends/API_PGV.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "3_1_3",
        text: '<Label style="font-size:8pt"><i>(ARE) Area de régimen especial en SU</i></Label>',
        icon: "images/legends/ARE_PGV.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
    ];
    return data;
  }

  /**
   * Crea y devuelve un conjunto de datos representando sistemas PGOU98.<br>
   * <strong>Private method</strong>
   * @returns {Object[]} Array de objetos representando sistemas PGOU98.
   */
  _createDataSistemasDotacionalesPGOU98() {
    const data = [
      {
        id: "2_1_18_1",
        text: '<Label style="font-size:8pt"><i>(SLEC) Equipamiento Comunitario (S.Local)</i></Label>',
        icon: "images/legends/RV_SLEC.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "2_1_18_2",
        text: '<Label style="font-size:8pt"><i>(SLEL) Espacio Libre (S.Local)</i></Label>',
        icon: "images/legends/RV_SLEL.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "2_1_18_3",
        text: '<Label style="font-size:8pt"><i>(SLCI) Comunicaciones e infraestructuras (S.Local)</i></Label>',
        icon: "images/legends/RV_SGC.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "2_1_18_4",
        text: '<Label style="font-size:8pt"><i>(SGEC) Equipamiento Comunitario (S.General)</i></Label>',
        icon: "images/legends/RV_SGEC.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "2_1_18_5",
        text: '<Label style="font-size:8pt"><i>(SGEL) Espacio Libre (S.General)</i></Label>',
        icon: "images/legends/RV_SGEL.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "2_1_18_6",
        text: '<Label style="font-size:8pt"><i>(SGCI) Comunicaciones e infraestructiuas (S.General)</i></Label>',
        icon: "images/legends/RV_SGC.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
    ];
    return data;
  }

  /**
   * Crea y devuelve un conjunto de datos representando calificaciones PGOU98.<br>
   * <strong>Private method</strong>
   * @returns {Object[]} Array de objetos representando calificaciones PGOU98.
   */
  _createDataCalificacionesPGO98() {
    const data = [
      {
        id: "2_1_1",
        text: '<Label style="font-size:8pt"><i>(A) Residencial Plurifamiliar Ensanche. AV-MC.V.</i></Label>',
        icon: "images/legends/RV_A.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "2_1_2",
        text: '<Label style="font-size:8pt"><i>(B) Residencial Plurifamiliar Ensanche Periférico. AV-MC.V.</i></Label>',
        icon: "images/legends/RV_B.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "2_1_3",
        text: '<Label style="font-size:8pt"><i>(C) Residencial Plurifamiliar Ejes Cívicos. AV-MC.V.</i></Label>',
        icon: "images/legends/RV_C.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "2_1_4",
        text: '<Label style="font-size:8pt"><i>(D) Residencial Plurifamiliar en manzana cerrada retranqueada. AV-MC.R.</i></Label>',
        icon: "images/legends/RV_D.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "2_1_5",
        text: '<Label style="font-size:8pt"><i>(E) Residencial Plurifamiliar Ordenación Abierta. RP.A.</i></Label>',
        icon: "images/legends/RV_E.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "2_1_6",
        text: '<Label style="font-size:8pt"><i>(F) Ordenación volumétrica específica (residencial plurifamiliar o terciario. VE)</i></Label>',
        icon: "images/legends/RV_F.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "2_1_7",
        text: '<Label style="font-size:8pt"><i>(G) Residencial Plurifamiliar con tipologías mixtas. RP. S.</i></Label>',
        icon: "images/legends/RV_G.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "2_1_8",
        text: '<Label style="font-size:8pt"><i>(H) Residencial Plurifamiliar MC retranqueado con porches. AV-MC.R.</i></Label>',
        icon: "images/legends/RV_H.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "2_1_9",
        text: '<Label style="font-size:8pt"><i>(I) Residencial Unifamiliar aislada de baja densidad. RP.A.</i></Label>',
        icon: "images/legends/RV_I.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "2_1_10",
        text: '<Label style="font-size:8pt"><i>(J) Residencial Unifamiliar Suburbana. RP.S.</i></Label>',
        icon: "images/legends/RV_J.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "2_1_11",
        text: '<Label style="font-size:8pt"><i>(K) Residencial Unifamiliar entre medianeras. AV-MC.R.</i></Label>',
        icon: "images/legends/RV_K.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "2_1_12",
        text: '<Label style="font-size:8pt"><i>(L) Industrial. Uso productivo en trama residencial. RP.A.</i></Label>',
        icon: "images/legends/RV_L.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "2_1_13",
        text: '<Label style="font-size:8pt"><i>(M) Industrial. Uso productivo en polígonos industriales. RP.A.</i></Label>',
        icon: "images/legends/RV_M.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "2_1_14",
        text: '<Label style="font-size:8pt"><i>(N) Preservación ambiental N.</i></Label>',
        icon: "images/legends/RV_N.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "2_1_15",
        text: '<Label style="font-size:8pt"><i>(R) Preservación arquitectónica ambiental R.</i></Label>',
        icon: "images/legends/RV_R.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "2_1_16",
        text: '<Label style="font-size:8pt"><i>(S) Terciario en edificación aislada (Comercial/Administrativo). RP.A.</i></Label>',
        icon: "images/legends/RV_S.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "2_1_17",
        text: '<Label style="font-size:8pt"><i>(T) Turístico en edificación aislada. RP.A.</i></Label>',
        icon: "images/legends/RV_T.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "2_1_18",
        text: "Sistemas dotacionales",
        // 'data' : categorias_rustico,
        icon: "images/legends/RV_SISTEMAS.png",
        a_attr: { class: "no_checkbox" },
        state: { opened: true },
        children: this._createDataSistemasDotacionalesPGOU98(),
      },
      {
        id: "2_1_19",
        text: '<Label style="font-size:8pt"><i>(EL0) Espacio Libre Privado</i></Label>',
        icon: "images/legends/RV_EL0.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "2_1_20",
        text: '<Label style="font-size:8pt"><i>(CAT) Catálogos</i></Label>',
        icon: "images/legends/RV_CAT.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "2_1_21",
        text: '<Label style="font-size:8pt"><i>(r) Preservación</i></Label>',
        icon: "images/legends/RV_PRESERV_r.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "2_1_22",
        text: '<Label style="font-size:8pt"><i>Carencia de Infraestructuras</i></Label>',
        icon: "images/legends/RV_CARENCIA_IF.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "2_1_23",
        text: '<Label style="font-size:8pt"><i>Pasaje</i></Label>',
        icon: "images/legends/RV_PASAJE.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "2_1_24",
        text: '<Label style="font-size:8pt"><i>Nueva Alineación</i></Label>',
        icon: "images/legends/RV_NA.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "2_1_25",
        text: '<Label style="font-size:8pt"><i>Profundidad edificable</i></Label>',
        icon: "images/legends/RV_PROF_EDIF.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "2_1_26",
        text: '<Label style="font-size:8pt"><i>Separación calificación</i></Label>',
        icon: "images/legends/RV_SEPARACION_CALIFIC.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "2_1_27",
        text: '<Label style="font-size:8pt"><i>Separación altura</i></Label>',
        icon: "images/legends/RV_SEPARACION_ALTURAS.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
    ];

    return data;
  }

  createDataSistemasDotacionalesPRI() {
    const data = [
      {
        id: "2_2_9_1",
        text: '<Label style="font-size:8pt"><i>(EQ) Equipamientos comunitarios</i></Label>',
        icon: "images/legends/RV_SLEC.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "2_2_9_2",
        text: '<Label style="font-size:8pt"><i>(EL) Espacios libres</i></Label>',
        icon: "images/legends/RV_SLEL.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
    ];
    return data;
  }

  createDataCalificacionesPRI() {
    const data = [
      {
        id: "2_2_1",
        text: '<Label style="font-size:8pt"><i>(PRI_D) Edificación residencial entre medianeras</i></Label>',
        icon: "images/legends/RV_PL_D.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "2_2_2",
        text: '<Label style="font-size:8pt"><i>(PRI_E) Vivienda edificación abierta</i></Label>',
        icon: "images/legends/RV_PL_E.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "2_2_3",
        text: '<Label style="font-size:8pt"><i>(PRI_I) Vivienda Unifamiliar aislada</i></Label>',
        icon: "images/legends/RV_PL_I.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "2_2_4",
        text: '<Label style="font-size:8pt"><i>(PRI_VA) Vivienda adosada</i></Label>',
        icon: "images/legends/RV_PL_VA.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "2_2_5",
        text: '<Label style="font-size:8pt"><i>(PRI_VT) Vivienda Tradicional</i></Label>',
        icon: "images/legends/RV_PL_VT.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "2_2_6",
        text: '<Label style="font-size:8pt"><i>(PRI_S) Comercial / Servicios</i></Label>',
        icon: "images/legends/RV_PL_S.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "2_2_7",
        text: '<Label style="font-size:8pt"><i>(PRI_T) Turístico</i></Label>',
        icon: "images/legends/RV_PL_T.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "2_2_8",
        text: '<Label style="font-size:8pt"><i>(PRI_TH) Turístico hotelero</i></Label>',
        icon: "images/legends/RV_PL_TH.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "2_2_9",
        text: "Sistemas dotacionales",
        icon: "images/legends/RV_SISTEMAS.png",
        a_attr: { class: "no_checkbox" },
        state: { opened: true },
        children: this.createDataSistemasDotacionalesPRI(),
      },
      {
        id: "2_2_10",
        text: '<Label style="font-size:8pt"><i>(EL0) Espai Lliure Privat</i></Label>',
        icon: "images/legends/RV_EL0.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "2_2_11",
        text: '<Label style="font-size:8pt"><i>(CAT) Catalogos</i></Label>',
        icon: "images/legends/RV_CAT.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "2_2_12",
        text: '<Label style="font-size:8pt"><i>Profunditat edificable</i></Label>',
        icon: "images/legends/RV_PROF_EDIF.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "2_2_13",
        text: '<Label style="font-size:8pt"><i>Separació qualificació</i></Label>',
        icon: "images/legends/RV_SEPARACION_CALIFIC.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
    ];

    return data;
  }

  createDataSistemasDotacionalesPG2023() {
    const data = [
      {
        id: "2_3_1",
        text: '<Label style="font-size:8pt"><i>(SGEC) Equipamiento comunitario (S.General)</i></Label>',
        icon: "images/legends/RV_SGEC.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "2_3_2",
        text: '<Label style="font-size:8pt"><i>(SGEL) Espacio Libre (S.General)</i></Label>',
        icon: "images/legends/RV_SGEL.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "2_3_3",
        text: '<Label style="font-size:8pt"><i>(SGCM) Comunicaciones (S.General)</i></Label>',
        icon: "images/legends/RV_SGC.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "2_3_4",
        text: '<Label style="font-size:8pt"><i>(SGIF) Infraestructuras (S.General)</i></Label>',
        icon: "images/legends/RV_SGIF.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "2_3_5",
        text: '<Label style="font-size:8pt"><i>(SGSU) Servicios urbanos (S.General)</i></Label>',
        icon: "images/legends/RV_SGSU.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
    ];
    return data;
  }

  createDataAmbitosPG2023() {
    const data = [
      {
        id: "3_3_1",
        text: '<Label style="font-size:8pt"><i>(AA) Actuaciones aisladas</i></Label>',
        icon: "images/legends/RV_AA.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "3_3_2",
        text: '<Label style="font-size:8pt"><i>(ATU) Actuaciones de transformación</i></Label>',
        icon: "images/legends/RV_ATU.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
    ];
    return data;
  }

  createDataAmbitosPRI() {
    const data = [
      {
        id: "3_2_1",
        text: '<Label style="font-size:8pt"><i>(UA) Unidad de actuación</i></Label>',
        icon: "images/legends/UE_PGV.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
      {
        id: "3_2_2",
        text: '<Label style="font-size:8pt"><i>(CP) Corredor Paisagístico</i></Label>',
        icon: "images/legends/PRI_CP_PGV.png",
        a_attr: { class: "no_checkbox" },
        state: { selected: false },
      },
    ];
    return data;
  }

  createDataOrdenacion() {
    console.log("Creando datos de ordenación");
    this.dataOrdenacion = [
      {
        id: "root",
        text: "Plan General 2023 + POD(PGOU98+PRI)",
        state: {
          opened: true,
          selected: false,
          //selectable: false,
          checked: false,
        },
        children: [
          {
            id: 1,
            text: "Categorias rústico (PG2023)",
            data: this.mapLayers
              .getMapLayerByName("pg2023_categorias_rustico")
              .getLayer(),
            icon: "images/legends/RV_CATEG_SR.png",
            state: { checked: true, opened: true },
            //state: { checked: false, disabled: false },
            children: this._createDataCategoriasSuelo2023(),
          },
          {
            id: 2,
            text: "Calificaciones",
            icon: "images/legends/RV_CALIF_SU.png",
            state: { checked: true, disabled: false, opened: false },
            children: [
              {
                id: "2_1",
                text: "Plan General 1998",
                icon: "images/legends/carpeta_azul_16.png",
                data: this.mapLayers
                  .getMapLayerByName("pgou98_calificaciones")
                  .getLayer(),
                state: { checked: true, disabled: false },
                children: this._createDataCalificacionesPGO98(),
              },
              {
                id: "2_2",
                text: "(PRI) Playa de Palma",
                icon: "images/legends/carpeta_amarilla_16.png",
                data: this.mapLayers
                  .getMapLayerByName("pri_calificaciones")
                  .getLayer(),
                state: { checked: true, disabled: false },
                children: this.createDataCalificacionesPRI(),
              },
              {
                id: "2_3",
                text: "Plan General 2023",
                icon: "images/legends/carpeta_roja_16.png",
                data: this.mapLayers
                  .getMapLayerByName("pg2023_calificaciones")
                  .getLayer(),
                state: { checked: true, disabled: false },
                children: this.createDataSistemasDotacionalesPG2023(),
              },
            ],
          },
          {
            id: 3,
            text: "Ámbitos",
            icon: "images/legends/RV_SG_SR.png",
            state: { checked: true, disabled: false, opened: false },
            children: [
              {
                id: "3_1",
                text: "Plan General 1998",
                icon: "images/legends/carpeta_azul_16.png",
                data: this.mapLayers
                  .getMapLayerByName("pgou98_ambitos")
                  .getLayer(),
                state: { checked: true, disabled: false },
                children: this._createDataAmbitosPGOU98(),
              },
              {
                id: "3_2",
                text: "(PRI) Playa de Palma",
                icon: "images/legends/carpeta_amarilla_16.png",
                data: this.mapLayers
                  .getMapLayerByName("pri_ambitos")
                  .getLayer(),
                state: { checked: true, disabled: false },
                children: this.createDataAmbitosPRI(),
              },
              {
                id: "3_3",
                text: "Plan General 2023",
                icon: "images/legends/carpeta_roja_16.png",
                data: this.mapLayers
                  .getMapLayerByName("pg2023_ambitos")
                  .getLayer(),
                state: { checked: true, disabled: false },
                children: this.createDataAmbitosPG2023(),
              },
            ],
          },
          {
            id: 4,
            text: "Ultimas aprobaciones iniciales",
            icon: "fa-solid fa-file-signature",
            data: this.mapLayers.getMapLayerByName("layerPA_ai").getLayer(),
            state: { checked: true, disabled: false, opened: true },
          },
        ],
      },
    ];

    console.log(this.dataOrdenacion);

    return this.dataOrdenacion;
  }

  createControls() {
    $(function () {
      $("#accordion").accordion({ active: 1 });
    });
  }

  createSliderOrdenacion() {
    this.htmSliderOrdenacion = `<div title="canviar opacitat" id="sliderOrdenacion"></div>`;
    $(function () {
      $("#sliderOrdenacion").slider({
        orientation: "horizontal",
        range: "min",
        max: 100,
        value: 100,
        slide: refreshOrdenacion,
        change: refreshOrdenacion,
      });
      function refreshOrdenacion() {
        var value = $("#sliderOrdenacion").slider("value");
        var nodeid = $("#jstree_ord").jstree("get_selected");
        var node = $("#jstree_ord").jstree(true).get_node(nodeid);
        node.data.setOpacity(value / 100);
      }
    });
    this.htmStyleOrdenacion = `
        <TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
        
            <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
                <td style='width:90px'> <LABEL id='label_opacidad_ordenacion' style='width:120px;padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>OPACIDAD</label></td>
                <td>${this.htmSliderOrdenacion}</td>
            
            </tr> 
         
        </TABLE>`;
  }

  createTreeOrdenacion() {
    const self = this;

    this.htmTreeOrdenacion = `<div style='font-size:9pt;overflow:auto;padding:0px;height:417px' id="jstree_ord"></div>`;

    $(function () {
      $("#html1").jstree();
    });
    $(function () {
      $("#jstree_ord").jstree({
        core: {
          data: self.createDataOrdenacion(),
          check_callback: true,
          multiple: false, // Para permitir selección única,
        },
        checkbox: {
          three_state: true,
          whole_node: false,
          tie_selection: false,
          cascade: false,
        },

        plugins: ["checkbox"],
      });

      function traverseOrdenacionCheck(id) {
        var node = $("#jstree_ord").jstree(true).get_node(id);

        if (typeof node == "object") {
          if (node.data != null) node.data.addTo(self.map);

          const children = node.children;

          $.each(children, function (k, v) {
            traverseOrdenacionCheck(v);
          });
        }
      }

      function traverseOrdenacionUnCheck(id) {
        var node = $("#jstree_ord").jstree(true).get_node(id);

        if (typeof node == "object") {
          if (node.data != null) self.map.removeLayer(node.data);

          const children = node.children;

          $.each(children, function (k, v) {
            traverseOrdenacionUnCheck(v);
          });
        }
      }

      $("#jstree_ord").on("check_node.jstree", function (e, data) {
        const currentZoom = self.map.getZoom();
        if (currentZoom >= 14 && currentZoom <= 22 && data.node.id == 4)
          traverseOrdenacionCheck(data.node.id);
        else if (data.node.id != 4) traverseOrdenacionCheck(data.node.id);
      });

      $("#jstree_ord").on("uncheck_node.jstree", function (e, data) {
        traverseOrdenacionUnCheck(data.node.id);
      });

      $("#jstree_ord").on("select_node.jstree", function (e, data) {
        if (
          data.node.id != "root" &&
          data.node.id != 2 &&
          data.node.id != 3 &&
          data.node.id.substring(0, 4) != "2_1_"
        ) {
          $("#sliderOrdenacion").slider("enable");
          const opacityOrd = data.node.data.options.opacity;
          $("#sliderOrdenacion").slider("value", opacityOrd * 100);
        } else {
          $("#sliderOrdenacion").slider("disable");
          $("#jstree_ord").jstree(true).deselect_node(data.node);
        }
      });

      $("#jstree_ord").bind("loaded.jstree", function (event, data) {
        //$("#sliderOrdenacion").slider("disable");
        /*$("#jstree_ord").jstree(true).deselect_node("root");
				$("#jstree_ord").jstree(true).select_node(1);*/
      });
    });
  }

  // Base Map

  createSliderBaseMap() {
    self = this;
    this.htmSliderBaseMap = `<div title="canviar opacitat" id="sliderBM"></div>`;
    $(function () {
      $("#sliderBM").slider({
        orientation: "horizontal",
        range: "min",
        max: 100,
        value: self.mapBaseActual.options.opacity * 100,
        slide: refreshM,
        change: refreshM,
      });
      function refreshM() {
        var value = $("#sliderBM").slider("value");
        self.mapBaseActual.setOpacity(value / 100);
      }
    });

    this.htmStyleBaseMap = `
        <TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
        
            <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
                <td style='width:90px'> <LABEL  style='width:120px;padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>OPACITAT</label></td>
                <td>${this.htmSliderBaseMap}</td>
            
            </tr> 
         
        </TABLE>`;
  }

  createControlBaseMap() {
    const self = this;
    $(function () {
      $("input[type='radio']")
        .checkboxradio({
          icon: false,
        })
        .click(function () {
          //console.log(mapaBaseActual.options.opacity);
          const opacityS = self.mapBaseActual.options.opacity;

          if ($("input[id='topo_imi_grey']:checked").val()) {
            self.map.removeLayer(self.mapBaseActual);
            self.mapLayers
              .getMapLayerByName("cartografia_imi_grey")
              .getLayer()
              .addTo(self.map);
            self.mapBaseActual = self.mapLayers
              .getMapLayerByName("cartografia_imi_grey")
              .getLayer()
              .addTo(self.map);
          }
          if ($("input[id='topo_imi_color']:checked").val()) {
            self.map.removeLayer(self.mapBaseActual);
            self.mapLayers
              .getMapLayerByName("cartografia_imi_color")
              .getLayer()
              .addTo(self.map);
            self.mapBaseActual = self.mapLayers
              .getMapLayerByName("cartografia_imi_color")
              .getLayer()
              .addTo(self.map);
          }
          if ($("input[id='catastro']:checked").val()) {
            self.map.removeLayer(self.mapBaseActual);
            self.mapLayers
              .getMapLayerByName("catastro")
              .getLayer()
              .addTo(self.map);
            self.mapBaseActual = self.mapLayers
              .getMapLayerByName("catastro")
              .getLayer()
              .addTo(self.map);
          }
          if ($("input[id='orto_ams_1956']:checked").val()) {
            self.map.removeLayer(self.mapBaseActual);
            self.mapLayers
              .getMapLayerByName("ams_1956_1967")
              .getLayer()
              .addTo(self.map);
            self.mapBaseActual = self.mapLayers
              .getMapLayerByName("ams_1956_1967")
              .getLayer()
              .addTo(self.map);
          }
          if ($("input[id='pnoa_2008_10']:checked").val()) {
            self.map.removeLayer(self.mapBaseActual);
            self.mapLayers
              .getMapLayerByName("pnoa_2008_10")
              .getLayer()
              .addTo(self.map);
            self.mapBaseActual = self.mapLayers
              .getMapLayerByName("pnoa_2008_10")
              .getLayer()
              .addTo(self.map);
          }
          if ($("input[id='pnoa_2021']:checked").val()) {
            self.map.removeLayer(self.mapBaseActual);
            self.mapLayers
              .getMapLayerByName("pnoa_2021")
              .getLayer()
              .addTo(self.map);
            self.mapBaseActual = self.mapLayers
              .getMapLayerByName("pnoa_2021")
              .getLayer()
              .addTo(self.map);
          }
          if ($("input[id='pnoa_2018']:checked").val()) {
            self.map.removeLayer(self.mapBaseActual);
            self.mapLayers
              .getMapLayerByName("pnoa_2018")
              .getLayer()
              .addTo(self.map);
            self.mapBaseActual = self.mapLayers
              .getMapLayerByName("pnoa_2018")
              .getLayer()
              .addTo(self.map);
          }
          if ($("input[id='pnoa_2015']:checked").val()) {
            self.map.removeLayer(self.mapBaseActual);
            self.mapLayers
              .getMapLayerByName("pnoa_2015")
              .getLayer()
              .addTo(self.map);
            self.mapBaseActual = self.mapLayers
              .getMapLayerByName("pnoa_2015")
              .getLayer()
              .addTo(self.map);
          }
          if ($("input[id='pnoa_2012']:checked").val()) {
            self.map.removeLayer(self.mapBaseActual);
            self.mapLayers
              .getMapLayerByName("pnoa_2012")
              .getLayer()
              .addTo(self.map);
            self.mapBaseActual = self.mapLayers
              .getMapLayerByName("pnoa_2012")
              .getLayer()
              .addTo(self.map);
          }
          if ($("input[id='pnoa_2010']:checked").val()) {
            self.map.removeLayer(self.mapBaseActual);
            self.mapLayers
              .getMapLayerByName("pnoa_2010")
              .getLayer()
              .addTo(self.map);
            self.mapBaseActual = self.mapLayers
              .getMapLayerByName("pnoa_2010")
              .getLayer()
              .addTo(self.map);
          }
          /*if ($("input[id='orto_pnoa_2008_10']:checked").val()) {
            self.map.removeLayer(self.mapBaseActual);
            self.mapLayers
              .getMapLayerByName("pnoa_2008_10")
              .getLayer()
              .addTo(self.map);
            self.mapBaseActual = self.mapLayers
              .getMapLayerByName("pnoa_2008_10")
              .getLayer()
              .addTo(self.map);
          }*/
          if ($("input[id='pnoa_2008']:checked").val()) {
            self.map.removeLayer(self.mapBaseActual);
            self.mapLayers
              .getMapLayerByName("pnoa_2008")
              .getLayer()
              .addTo(self.map);
            self.mapBaseActual = self.mapLayers
              .getMapLayerByName("pnoa_2008")
              .getLayer()
              .addTo(self.map);
          }
          if ($("input[id='pnoa_2006']:checked").val()) {
            self.map.removeLayer(self.mapBaseActual);
            self.mapLayers
              .getMapLayerByName("pnoa_2006")
              .getLayer()
              .addTo(self.map);
            self.mapBaseActual = self.mapLayers
              .getMapLayerByName("pnoa_2006")
              .getLayer()
              .addTo(self.map);
          }
          if ($("input[id='olistat']:checked").val()) {
            self.map.removeLayer(self.mapBaseActual);
            self.mapLayers
              .getMapLayerByName("olistat")
              .getLayer()
              .addTo(self.map);
            self.mapBaseActual = self.mapLayers
              .getMapLayerByName("olistat")
              .getLayer()
              .addTo(self.map);
          }
          if ($("input[id='sigpac']:checked").val()) {
            self.map.removeLayer(self.mapBaseActual);
            self.mapLayers
              .getMapLayerByName("sigpac")
              .getLayer()
              .addTo(self.map);
            self.mapBaseActual = self.mapLayers
              .getMapLayerByName("sigpac")
              .getLayer()
              .addTo(self.map);
          }

          if ($("input[id='ib_2001']:checked").val()) {
            self.map.removeLayer(self.mapBaseActual);
            self.mapLayers
              .getMapLayerByName("ib_2001")
              .getLayer()
              .addTo(self.map);
            self.mapBaseActual = self.mapLayers
              .getMapLayerByName("ib_2001")
              .getLayer()
              .addTo(self.map);
          }
          if ($("input[id='mallorca_1995']:checked").val()) {
            self.map.removeLayer(self.mapBaseActual);
            self.mapLayers
              .getMapLayerByName("mallorca_1995")
              .getLayer()
              .addTo(self.map);
            self.mapBaseActual = self.mapLayers
              .getMapLayerByName("mallorca_1995")
              .getLayer()
              .addTo(self.map);
          }
          if ($("input[id='nacional_1981_1986']:checked").val()) {
            self.map.removeLayer(self.mapBaseActual);
            self.mapLayers
              .getMapLayerByName("nacional_1981_1986")
              .getLayer()
              .addTo(self.map);
            self.mapBaseActual = self.mapLayers
              .getMapLayerByName("nacional_1981_1986")
              .getLayer()
              .addTo(self.map);
          }
          if ($("input[id='orto_actual']:checked").val()) {
            self.map.removeLayer(self.mapBaseActual);
            self.mapLayers
              .getMapLayerByName("pnoa_actual")
              .getLayer()
              .addTo(self.map);
            self.mapBaseActual = self.mapLayers
              .getMapLayerByName("pnoa_actual")
              .getLayer()
              .addTo(self.map);
          }
          if ($("input[id='google_streets']:checked").val()) {
            self.map.removeLayer(self.mapBaseActual);
            self.mapLayers
              .getMapLayerByName("google_streets")
              .getLayer()
              .addTo(self.map);
            self.mapBaseActual = self.mapLayers
              .getMapLayerByName("google_streets")
              .getLayer()
              .addTo(self.map);
          }
          if ($("input[id='google_satellite']:checked").val()) {
            self.map.removeLayer(self.mapBaseActual);
            self.mapLayers
              .getMapLayerByName("google_satellite")
              .getLayer()
              .addTo(self.map);
            self.mapBaseActual = self.mapLayers
              .getMapLayerByName("google_satellite")
              .getLayer()
              .addTo(self.map);
          }
          if ($("input[id='google_hybrid']:checked").val()) {
            self.map.removeLayer(self.mapBaseActual);
            self.mapLayers
              .getMapLayerByName("google_hybrid")
              .getLayer()
              .addTo(self.map);
            self.mapBaseActual = self.mapLayers
              .getMapLayerByName("google_hybrid")
              .getLayer()
              .addTo(self.map);
          }
          if ($("input[id='google_terrain']:checked").val()) {
            self.map.removeLayer(self.mapBaseActual);
            self.mapLayers
              .getMapLayerByName("google_terrain")
              .getLayer()
              .addTo(self.map);
            self.mapBaseActual = self.mapLayers
              .getMapLayerByName("google_terrain")
              .getLayer()
              .addTo(self.map);
          }
          if ($("input[id='google_traffic']:checked").val()) {
            self.map.removeLayer(self.mapBaseActual);
            self.mapLayers
              .getMapLayerByName("google_traffic")
              .getLayer()
              .addTo(self.map);
            self.mapBaseActual = self.mapLayers
              .getMapLayerByName("google_traffic")
              .getLayer()
              .addTo(self.map);
          }
          if ($("input[id='cartodb_light_all']:checked").val()) {
            self.map.removeLayer(self.mapBaseActual);
            self.mapLayers
              .getMapLayerByName("cartodb_light_all")
              .getLayer()
              .addTo(self.map);
            self.mapBaseActual = self.mapLayers
              .getMapLayerByName("cartodb_light_all")
              .getLayer()
              .addTo(self.map);
          }
          if ($("input[id='openstreetmap']:checked").val()) {
            self.map.removeLayer(self.mapBaseActual);
            self.mapLayers
              .getMapLayerByName("openstreetmap")
              .getLayer()
              .addTo(self.map);
            self.mapBaseActual = self.mapLayers
              .getMapLayerByName("openstreetmap")
              .getLayer()
              .addTo(self.map);
          }
          if ($("input[id='openstreetmap_gray']:checked").val()) {
            self.map.removeLayer(self.mapBaseActual);
            self.mapLayers
              .getMapLayerByName("openstreetmap_gray")
              .getLayer()
              .addTo(self.map);
            self.mapBaseActual = self.mapLayers
              .getMapLayerByName("openstreetmap_gray")
              .getLayer()
              .addTo(self.map);
          }

          $("#sliderBM").slider("value", opacityS * 100);
          self.mapBaseActual.setOpacity(opacityS);
        });

      $(".controlgroup-vertical").controlgroup({
        direction: "vertical",
      });
    });
  }

  createBaseMap() {
    this.createControlBaseMap();

    const htmSelectADMIN = `<div style='width:100%' class='controlgroup-vertical'>
                            
        <input type="radio" name="mapa_base" id="topo_imi_grey" checked>
        <label for="topo_imi_grey">Topografia (Oficial) Escala grises</label>
        <input type="radio" name="mapa_base" id="topo_imi_color" >        
        <label for="topo_imi_color">Topografia (Oficial) Color</label>
        <input type="radio" name="mapa_base" id="catastro" >        
        <label for="catastro">Catastro (Oficina Virtual)</label>
        <input type="radio" name="mapa_base" id="orto_actual" >        
        <label for="orto_actual">(PNOA) OrtoImagen mas actual</label>
        <input type="radio" name="mapa_base" id="sigpac">        
        <label for="sigpac">SIGPAC (1997-2003)</label> 
        <input type="radio" name="mapa_base" id="ib_2001" >        
        <label for="ib_2001">Foto aerea IB (2001)</label>     
        <input type="radio" name="mapa_base" id="olistat" >        
        <label for="olistat">OLISTAT (1997-1998)</label> 
        <input type="radio" name="mapa_base" id="mallorca_1995" >        
        <label for="mallorca_1995">Foto aerea Mallorca (1995)</label>      
        <input type="radio" name="mapa_base" id="nacional_1981_1986" >        
        <label for="nacional_1981_1986">Vuelo Nacional (1981-1986)</label>    
        <input type="radio" name="mapa_base" id="orto_ams_1956" >        
        <label for="orto_ams_1956">Vuelo Americano Serie B (1956-1957)</label>                   
         
      </div>
   `;

    /*
    <input type="radio" name="mapa_base" id="orto_pnoa_2008_10" >        
        <label for="orto_pnoa_2008_10">(PNOA) OrtoImage 2008 (10cm)</label>  
  */

    const htmPNOA = `<div style='width:100%' class='controlgroup-vertical'>

        <input type="radio" name="mapa_base" id="pnoa_2021" >
        <label for="pnoa_2021">(PNOA) OrtoImage 2021 (25cm) </label>    
        <input type="radio" name="mapa_base" id="pnoa_2018" >
        <label for="pnoa_2018">(PNOA) OrtoImage 2018 (15cm) </label>      
        <input type="radio" name="mapa_base" id="pnoa_2015" >
        <label for="pnoa_2015">(PNOA) OrtoImage 2015 (25cm) </label>
        <input type="radio" name="mapa_base" id="pnoa_2012" >
        <label for="pnoa_2012">(PNOA) OrtoImage 2012 (25cm) </label>
        <input type="radio" name="mapa_base" id="pnoa_2010" >
        <label for="pnoa_2010">(PNOA) OrtoImage 2010 (25cm) </label>
        <input type="radio" name="mapa_base" id="pnoa_2008_10" >        
        <label for="pnoa_2008_10">(PNOA) OrtoImage 2008 (10cm)</label>  
        <input type="radio" name="mapa_base" id="pnoa_2008" >
        <label for="pnoa_2008">(PNOA) OrtoImage 2008 (50cm) </label>
        <input type="radio" name="mapa_base" id="pnoa_2006" >
        <label for="pnoa_2006">(PNOA) OrtoImage 2006 (50cm) </label>
          
      </div>  
      `;

    const htmSelectGoogle = `<div style='width:100%' class='controlgroup-vertical'>
                           
        <input type="radio" name="mapa_base" id="google_streets" >
        <label for="google_streets">Google Streets</label>
        <input type="radio" name="mapa_base" id="google_satellite" >        
        <label for="google_satellite">Google Satellite</label>
        <input type="radio" name="mapa_base" id="google_hybrid" >        
        <label for="google_hybrid">Google Hybrid</label>
        <input type="radio" name="mapa_base" id="google_terrain" >        
        <label for="google_terrain">Google Terrain</label>
        <input type="radio" name="mapa_base" id="google_traffic" >        
        <label for="google_traffic">Google Traffic</label>
        <input type="radio" name="mapa_base" id="cartodb_light_all" >        
        <label for="cartodb_light_all">Cartodb Light</label>
        <input type="radio" name="mapa_base" id="openstreetmap" >        
        <label for="openstreetmap">OpenStreetMap</label>
        <input type="radio" name="mapa_base" id="openstreetmap_gray" >        
        <label for="openstreetmap_gray">OpenStreetMap (Escala grises)</label>
         
      </div>
    `;

    $(function () {
      $("#tabsBase").tabs({
        activate: function (event, ui) {
          //
        },
      });
    });

    //this.createControlBaseMap();

    this.htmlTabsBase = `<div style='padding:0px' id="tabsBase">
        <ul>
          <li><a href="#admin">ADMIN</a></li>      
          <li><a href="#pnoa">PNOA</a></li>      
          <li><a href="#google">GOOGLE / OTROS</a></li>              
        </ul>
        <div id="admin">
          ${htmSelectADMIN}        
        </div>     
        <div id="pnoa">
          ${htmPNOA}               
        </div>   
        <div id="google">
          ${htmSelectGoogle}               
        </div>         
    </div>        
    `;
  }

  downloadSelectedConsultas() {
    const selectedNode = $("#jstree_consultas")
      .jstree(true)
      .get_selected(true)[0];
    const layer = this.mapLayers.getMapLayerByName(selectedNode.id).getLayer();
    //const nodes = $("#jstree_consultas").jstree("get_selected");
    //const layer = this.mapLayers.getMapLayerByName(nodes[0]).getLayer();
    //const name = this.mapLayers.getMapLayerByName(nodes[0]).getName();
    const geojson = layer.toGeoJSON();
    const jsonData = JSON.stringify(geojson);
    var a = document.createElement("a");
    var file = new Blob([jsonData], { type: "text/plain" });
    a.href = URL.createObjectURL(file);
    a.download = selectedNode.text + ".geojson";
    a.click();
  }

  deleteSelectedConsultas() {
    var nodes = $("#jstree_consultas").jstree("get_selected");

    for (var p = 0; p < nodes.length; p++) {
      if (nodes[p].id != "root") {
        console.log(nodes[p]);
        $("#jstree_consultas").jstree().delete_node(nodes[p]);
        const layer = this.mapLayers.getMapLayerByName(nodes[p]).getLayer();
        this.map.removeLayer(layer);
        console.log(nodes[p]);
        const index = this.mapLayers.getIndexByName(nodes[p]);
        this.mapLayers.layers.splice(index, 1);
      }
    }
  }

  createStyleConsultas() {
    this.htmlStyleConsultas = `
        <TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
        
            <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
                <td> <LABEL  style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>COLOR</label></td>
                <td>${this.htmColorConsultas}</td>
            
            </tr> 
            <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
                <td> <LABEL  style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>OPACITAT</label></td>
                <td>${this.htmSliderConsultas}</td>
            
            </tr> 
         
        </TABLE>`;
  }

  generateIcon(iconColor) {
    // Tamaño del icono cuadrado
    const iconSize = 16; // Puedes ajustar el tamaño según tus necesidades

    // Color del icono (en formato hexadecimal)
    //const iconColor = "#FF5733"; // Cambia esto al color que desees

    // Crea un elemento canvas para dibujar el icono
    const canvas = document.createElement("canvas");
    canvas.width = iconSize;
    canvas.height = iconSize;

    // Obtiene el contexto 2D del canvas
    const context = canvas.getContext("2d");

    // Dibuja un cuadrado relleno con el color especificado
    context.fillStyle = iconColor;
    context.fillRect(0, 0, iconSize, iconSize);
    context.strokeStyle = "black";
    context.strokeRect(0, 0, iconSize, iconSize);

    // Convierte el canvas a una imagen Data URL en formato PNG
    const iconDataUrl = canvas.toDataURL("image/png");

    // Ahora tienes el icono en forma de Data URL que puedes utilizar en tu jstree
    // Puedes asignarlo a un nodo jstree como su icono personalizado

    return iconDataUrl;
  }

  createControlPickerConsultas() {
    self = this;
    this.htmColorConsultas = `<input  title="canviar color" id='colorpicker' />`;
    $(function () {
      $("#colorpicker").spectrum({
        color: "#f00",
        change: function (color) {
          color.toHexString(); // #ff0000
          console.log("change=" + color);

          var valueS = color.toHexString();
          var node = $("#jstree_consultas").jstree("get_selected");
          const layer = self.mapLayers.getMapLayerByName(node[0]).getLayer();
          layer.setStyle({
            fillColor: valueS,
          });
          layer.options.fillColor = valueS;

          const jstree = $("#jstree_consultas").jstree(true);

          jstree.set_icon(node[0], self.generateIcon(valueS));
        },
      });
    });
  }

  createSliderConsultas() {
    self = this;
    this.htmSliderConsultas = `<div title="canviar opacitat" id="sliderConsultas"></div>`;
    $(function () {
      $("#sliderConsultas").slider({
        orientation: "horizontal",
        range: "min",
        max: 100,
        value: 100,
        slide: refreshConsultas,
        change: refreshConsultas,
      });
      function refreshConsultas() {
        const value = $("#sliderConsultas").slider("value");
        var node = $("#jstree_consultas").jstree("get_selected");
        const layer = self.mapLayers.getMapLayerByName(node[0]).getLayer();
        layer.setStyle({
          fillOpacity: value / 100,
          opacity: value / 100,
        });
        layer.options.fillOpacity = value / 100;
        layer.options.opacity = value / 100;
      }
    });
  }

  createTreeConsultas() {
    const self = this;
    this.htmTreeConsultas = `<div style='font-size:9pt;overflow:auto;padding:10px;height:347px' id="jstree_consultas"></div>`;
    $(function () {
      $("#jstree_consultas").jstree({
        core: {
          data: [
            {
              id: "root",
              text: "Consultas",
              state: {
                opened: true,
                selected: false,
                checked: true,
              },
            },
          ],
          //check_callback: true,
          check_callback: function (
            operation,
            node,
            node_parent,
            node_position,
            more
          ) {
            if (operation === "move_node") {
              if (node.id == "root") return false;
              return true;
            }
          },
        },
        checkbox: {
          three_state: true,
          whole_node: false, //Used to check/uncheck node only if clicked on checkbox icon, and not on the whole node including label
          tie_selection: false,
          cascade: false,
        },
        contextmenu: {
          items: function (node) {
            return {
              edit: {
                label: "Editar",
                action: function () {
                  // Habilitar la edición del nodo
                  $("#jstree_consultas").jstree("edit", node);
                },
              },
            };
          },
        },

        plugins: ["checkbox", "wholerow", "dnd"],
      });

      function traverseConsultasCheck(id) {
        var node = $("#jstree_consultas").jstree(true).get_node(id);

        if (typeof node == "object") {
          if (node.data != null) node.data.addTo(self.map);

          const children = node.children;

          $.each(children, function (k, v) {
            traverseConsultasCheck(v);
          });
        }
      }

      function traverseConsultasUnCheck(id) {
        var node = $("#jstree_consultas").jstree(true).get_node(id);

        if (typeof node == "object") {
          if (node.data != null) self.map.removeLayer(node.data);

          const children = node.children;

          $.each(children, function (k, v) {
            traverseConsultasUnCheck(v);
          });
        }
      }

      $("#jstree_consultas").on("check_node.jstree", function (e, data) {
        traverseConsultasCheck(data.node.id);
        console.log(data.node);
      });

      $("#jstree_consultas").on("uncheck_node.jstree", function (e, data) {
        traverseConsultasUnCheck(data.node.id);
        console.log(data.node);
      });

      $("#jstree_consultas").on("select_node.jstree", function (e, data) {
        if (data.node.id != "root") {
          $("#sliderConsultas").slider("enable");
          const opacity = data.node.data.options.opacity;
          $("#sliderConsultas").slider("value", opacity * 100);
          const colorFill = data.node.data.options.fillColor;
          console.log(data.node.data.options);
          $("#colorpicker").spectrum("set", colorFill);
        } else {
          $("#sliderConsultas").slider("disable");
          $("#jstree_consultas").jstree(true).deselect_node(data.node);
        }
      });

      // Escuchar el evento dblclick en el nodo
      $("#jstree_consultas").on("dblclick.jstree", function (e) {
        console.log(e);
        var tree = $.jstree.reference("#jstree_consultas");
        var nodeId = tree.get_node(e.target).id;
        console.log("ID del nodo: " + nodeId);
        $("#jstree_consultas").jstree("edit", nodeId);
        //var node = data.node;
        // Habilitar la edición del nodo
        //;
      });
    });
  }
}
