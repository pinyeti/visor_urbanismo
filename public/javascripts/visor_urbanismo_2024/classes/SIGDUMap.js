/**
 * Clase SIGDUMap para la gestión y visualización de mapas interactivos.
 * Utiliza la biblioteca Leaflet para la manipulación de mapas y capas.
 *
 * @memberof module:Frontend
 */
class SIGDUMap {
  /**
   * Crea una instancia de SIGDUMap.
   * @constructor
   * @param {string} contenedorMapa - El ID del contenedor del mapa en el DOM.
   * @param {Object} opciones - Configuraciones opcionales para el mapa.
   */
  constructor(contenedorMapa, opciones) {
    this.map = L.map(contenedorMapa, {
      zoomControl: opciones && opciones.zoomControl ? false : true,
      center: [39.57951, 2.68745],
      zoom: 12,
      minZoom: 10,
      maxZoom: 22,
    });
    if (opciones) {
      if (opciones.zoomControl) {
        L.control.zoom({ position: opciones.zoomControl }).addTo(this.map);
      }
    }
    this.mapLayers = new MapLayersVisor();
    this.setLayers(this.mapLayers);
    this.mapBaseActual = this.mapLayers
      .getMapLayerByName("cartografia_imi_grey")
      .getLayer();
    this.setLayerControl();
    this.toc = this.createTOC();
    this.sidebarStatus = "cerrado";
    this.sidebar = this.createSidebar();

    // variable para seleccion de objeto
    this.puntos = null;

    this.measureAction = null;

    this.i18nHandler = new I18nHandler();

    this.setCursorHelp();

    this.setGraphicScale();
    this.setMouseCoordinates();
    this.setFullScreenControl();
    this.setbrowserPrintControl();
    this.setDeselectionControl();
    this.setLocateControl();
    this.infoButton = this.setInfoControl();
    this.setMeasuredControl();
    this.languageControl = this.setLanguageControl();

    //this.mapQuery = new MapQuery(this.map, this.i18nHandler, this.languageControl,this);
    this.mapQuery = new MapQuery(this);

    this.createQueryPG();
    this.createQueryEXP();
    //this.createQueryEXP_Sedipualba();
    this.createQuerySEARCH();

    const self = this;

    this.map.on("click", function (e) {
      //var popLocation = e.latlng;
      var x = e.latlng.utm().x;
      var y = e.latlng.utm().y;

      if (self.infoButton._currentState.stateName == "activado")
        self.mapQuery.queryByPoint(e);
      var estadoActual = self.infoButton.options.stateName;
      console.log("estadoActual", self.infoButton._currentState.stateName);
    });

    this.btnMapPDF = L.easyButton(
      '<i class="fa fa-map" style="color:#6680e6;" ></i>',
      async function (btn, map) {
        let find = await self.findCentroHistorico(this.map);
        console.log("find", find);
        if (!find) find = await self.findSueloUrbano98(this.map);
        if (!find) find = await self.findDOT5000(this.map);

        if (self.map.getZoom() >= 15) console.log("activar");
      },
      "Abrir Plano original PGOU 1998 (que conté el punt central del mapa)"
    );
    this.map.on("zoomend", function () {
      self.testInPage();

      console.log("termina zoom");
    });
    this.map.on("dragend", function () {
      self.testInPage();
      console.log("termina drag");
    });

    /*Toastify({
      text: "Bienvenido! Aquí tienes información importante sobre el mapa.",
      duration: 3000 // Duración en pantalla
    }).showToast();*/

    $("#dialog-message").html(
      '<div class="dialog-center">' +
        "<h5>La información mostrada por este visor urbanístico carece de valor legal, no reemplazando el contenido de los expedientes administrativos tramitados.</h5>" +
        "<p>AREA D´URBANISME, HABITATGE I PROJECTES ESTRATEGICS</p>" +
        "<p>Servei d´Innovació i Gestió de Dades Urbanistics</p>" +
        '<img src="https://sigdu-urbanismo.net/opg/SIGDU_logo_H3.png" alt="Logo del Servicio de Innovación y Gestión de Datos de Urbanismo Ajuntament de Palma" class="logo_SIGDU">' +
        '<br><img src="https://sigdu-urbanismo.net/opg/escudo.jpg" alt="Ajuntament de Palma" class="logo_AJT"><br>' +
        '<!--<label><input type="checkbox" id="dont-show-again"> No mostrar este mensaje de nuevo</label>-->' +
        "</div>"
    );

    $(function () {
      $("#dialog-message").dialog({
        modal: true,
        width: 500, // Establece el ancho a 500px
        height: 425, // Establece la altura a 400px
        buttons: {
          Aceptar: function () {
            $(this).dialog("close");
          },
        },
      });
    });

    //localStorage.removeItem('showDialog');

    /*$(function() {
      // Comprobar si el usuario ya eligió no volver a mostrar el diálogo
      if (localStorage.getItem('showDialog') === 'false') {
        $('#dialog-message').hide();
      } else {
        $('#dialog-message').dialog({
          modal: true,
          width: 500, // Establece el ancho a 500px
          height: 450, // Establece la altura a 400px
          buttons: {
            Ok: function() {
              // Verificar si la casilla está marcada
              if ($('#dont-show-again').is(':checked')) {
                // Guardar la elección en localStorage
                localStorage.setItem('showDialog', 'false');
              }
              $(this).dialog("close");
            }
          }
        });
      }
    });*/

    this.write_data_user();
  }

  async write_data_user() {
    let urlA = new URL(
      window.location.protocol +
        "//" +
        window.location.host +
        "/opg/write_data_user"
    );
    const paramsA = { accion: "acceso_vigente" };
    Object.keys(paramsA).forEach((keyA) =>
      urlA.searchParams.append(keyA, paramsA[keyA])
    );
    const dataRequestA = {
      method: "POST",
    };
    fetch(urlA, dataRequestA);
  }

  async testInPage() {
    var x = this.map.getCenter().utm().x;
    var y = this.map.getCenter().utm().y;
    const tabla = "limite_termino_municipal";
    console.log(x + "," + y);

    const url = new URL(
      `${window.location.protocol}//${window.location.host}/opg/featureByPoint`
    );

    const params = { tabla, x, y };
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );

    const dataRequest = {
      method: "GET",
    };

    const response = await fetch(url, dataRequest);
    const geojsonRES = await response.json();

    console.log(geojsonRES.features);

    if (geojsonRES.features !== null && this.map.getZoom() >= 15)
      this.map.addControl(this.btnMapPDF);
    else this.map.removeControl(this.btnMapPDF);
  }

  async findDOT5000(map) {
    let find = false;
    var x = this.map.getCenter().utm().x;
    var y = this.map.getCenter().utm().y;

    const tabla = "hojas5000_pgou98";
    console.log(x + "," + y);

    const url = new URL(
      `${window.location.protocol}//${window.location.host}/opg/featureByPoint`
    );

    const params = { tabla, x, y };
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );

    const dataRequest = {
      method: "GET",
    };

    const response = await fetch(url, dataRequest);
    const geojsonRES = await response.json();

    if (geojsonRES.features !== null && this.map.getZoom() >= 15) {
      find = true;
      console.log(geojsonRES.features);
      window.open(
        "https://sigdu-urbanismo.net/opg/pgou98_pdf/DOT5000/" +
          geojsonRES.features[0].properties.hoja_pgou +
          ".pdf",
        "_blank"
      );
    }
    return find;
  }

  async findCentroHistorico(map) {
    let find = false;
    var x = this.map.getCenter().utm().x;
    var y = this.map.getCenter().utm().y;
    const tabla = "limite_centro_historico";
    console.log(x + "," + y);

    const url = new URL(
      `${window.location.protocol}//${window.location.host}/opg/featureByPoint`
    );

    const params = { tabla, x, y };
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );

    const dataRequest = {
      method: "GET",
    };

    const response = await fetch(url, dataRequest);
    const geojsonRES = await response.json();

    if (geojsonRES.features !== null && this.map.getZoom() >= 15) {
      const tabla = "hojas500";
      console.log(x + "," + y);

      const url = new URL(
        `${window.location.protocol}//${window.location.host}/opg/featureByPoint`
      );

      const params = { tabla, x, y };
      Object.keys(params).forEach((key) =>
        url.searchParams.append(key, params[key])
      );

      const dataRequest = {
        method: "GET",
      };

      const response = await fetch(url, dataRequest);
      const geojsonRES = await response.json();

      if (geojsonRES.features !== null && this.map.getZoom() >= 15) {
        find = true;
        console.log(geojsonRES.features);
        window.open(
          "https://sigdu-urbanismo.net/opg/pgou98_pdf/500/" +
            geojsonRES.features[0].properties.hoja_pgou +
            ".pdf",
          "_blank"
        );
      }
    }
    return find;
  }

  async findSueloUrbano98(map) {
    let find = false;
    var x = this.map.getCenter().utm().x;
    var y = this.map.getCenter().utm().y;
    const tabla = "limite_suelo_urbano98";
    console.log(x + "," + y);

    const url = new URL(
      `${window.location.protocol}//${window.location.host}/opg/featureByPoint`
    );

    const params = { tabla, x, y };
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );

    const dataRequest = {
      method: "GET",
    };

    const response = await fetch(url, dataRequest);
    const geojsonRES = await response.json();

    if (geojsonRES.features !== null && this.map.getZoom() >= 15) {
      const tabla = "hojas1000";
      console.log(x + "," + y);

      const url = new URL(
        `${window.location.protocol}//${window.location.host}/opg/featureByPoint`
      );

      const params = { tabla, x, y };
      Object.keys(params).forEach((key) =>
        url.searchParams.append(key, params[key])
      );

      const dataRequest = {
        method: "GET",
      };

      const response = await fetch(url, dataRequest);
      const geojsonRES = await response.json();

      if (geojsonRES.features !== null && this.map.getZoom() >= 15) {
        find = true;
        console.log(geojsonRES.features);
        window.open(
          "https://sigdu-urbanismo.net/opg/pgou98_pdf/" +
            geojsonRES.features[0].properties.hojasCordenadas +
            ".pdf",
          "_blank"
        );
      }
    }

    return find;
  }

  async findHoja(map) {
    var x = this.map.getCenter().utm().x;
    var y = this.map.getCenter().utm().y;
    const tabla = "hojas1000";
    console.log(x + "," + y);

    const url = new URL(
      `${window.location.protocol}//${window.location.host}/opg/featureByPoint`
    );

    const params = { tabla, x, y };
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );

    const dataRequest = {
      method: "GET",
    };

    const response = await fetch(url, dataRequest);
    const geojsonRES = await response.json();

    if (geojsonRES.features !== null && this.map.getZoom() >= 17) {
      console.log(geojsonRES.features);
      //window.open(window.location.protocol+'//'+window.location.host+'/opg/pgou98_pdf/'+geojsonRES.features[0].properties.hojasCordenadas+".pdf", '_blank');
      window.open(
        "https://sigdu-urbanismo.net/opg/pgou98_pdf/" +
          geojsonRES.features[0].properties.hojasCoordenadas +
          ".pdf",
        "_blank"
      );
    }
  }

  /**
   * Comprueba si el dispositivo es móvil.
   * @returns {boolean} Retorna true si el dispositivo es móvil, de lo contrario false.
   */
  isMobile() {
    return window.matchMedia("(max-width: 767px)").matches;
  }

  /**
   * Establece el cursor con un ícono de ayuda en el mapa.
   */
  setCursorHelp() {
    document.getElementById("map").style.cursor = "help";
  }

  /**
   * Crea un diálogo de consulta de Planeamiento para el mapa.
   */
  createQueryPG() {
    new QueryDialog(this.map, this.mapLayers, this.toc, this);
  }

  /**
   * Crea un diálogo de consulta de Expedientes para el mapa.
   */
  createQueryEXP() {
    new QueryDialogEXP(this.map, this.mapLayers, this.toc, this);
  }

  /**
   * Crea un diálogo de consulta de Expedientes Sedipualba para el mapa.
   */
  createQueryEXP_Sedipualba() {
    new QueryDialogEXP_Sedipualba(this.map, this.mapLayers, this.toc, this);
  }

  /**
   * Crea un diálogo de busqueda por dirección/ref. catastral.
   */
  createQuerySEARCH() {
    new QuerySearch(this.map, this.mapLayers, this.toc, this);
  }

  /**
   * Establece un control de cambio de idioma en el mapa.
   * @returns {Object} El control de idioma agregado al mapa.
   */
  setLanguageControl() {
    const selfthis = this;
    // Agrega un control de cambio de idioma
    var languageControl = L.Control.extend({
      options: {
        currentLanguage: "es", // Establece el idioma predeterminado
      },
      onAdd: function (map) {
        var language = "es";
        var container = L.DomUtil.create(
          "div",
          "leaflet-bar leaflet-control"
          //"custom-control-paix"
        );
        var button = L.DomUtil.create(
          "button",
          "change-language-button",
          container
        );
        //button.textContent = i18next.t("buttonText");
        //button.textContent = "ES";
        button.innerHTML =
          '<img src="/opg/images/español.png" alt="Español" title="Cambiar a idioma catalán" />';

        const self = this;

        // Agrega un manejador de eventos para prevenir la propagación del clic al mapa
        L.DomEvent.addListener(button, "click", function (e) {
          L.DomEvent.stopPropagation(e);
          if (language === "es") {
            //if (i18next.language === "es") {
            //changeLanguage("ca");
            language = "ca";
            self.options.currentLanguage = "ca";
            //button.textContent = "CA";
            button.innerHTML =
              '<img src="/opg/images/catalan.png" alt="Catalan" title="canviar a idioma espanyol" />';
            selfthis.i18nHandler.changeLanguage("ca");
          } else {
            //changeLanguage("es");
            language = "es";
            self.options.currentLanguage = "es";
            button.innerHTML =
              '<img src="/opg/images/español.png" alt="Español" title="Cambiar a idioma catalán" />';
            selfthis.i18nHandler.changeLanguage("es");
          }
          // Agrega aquí la lógica para cambiar el idioma
        });
        return container;
      },
    });
    var languageControl = new languageControl({ position: "bottomright" });
    //map.addControl(new languageControl({ position: "bottomleft" }));
    //var languageControl = new languageControl();
    //languageControl.addTo(this.map);

    return languageControl;
  }

  /**
   * Establece el control de medida en el mapa.
   */
  setMeasuredControl() {
    const self = this;
    var ImmediateSubAction = L.Toolbar2.Action.extend({
      initialize: function (map, myAction) {
        this.map = map;
        this.myAction = myAction;
        L.Toolbar2.Action.prototype.initialize.call(this);
      },
      addHooks: function () {
        this.myAction.disable();
      },
    });
    var measureLine = ImmediateSubAction.extend({
      options: {
        toolbarIcon: {
          html: "Distancia",
          tooltip: "Medir distancia",
        },
      },
      addHooks: function () {
        self.measureAction = new L.MeasureAction(self.map, {
          model: "distance", // 'area' or 'distance', default is 'distance',
        });
        self.measureAction.setModel("distance");
        self.measureAction.enable();

        self.infoButton.state("desactivado");
        self.infoButton.button.style.backgroundColor = "white";
        self.infoButton.button.style.color = "grey";
        document.getElementById("map").style.cursor = "move";

        ImmediateSubAction.prototype.addHooks.call(this);
      },
    });
    var measureArea = ImmediateSubAction.extend({
      options: {
        toolbarIcon: {
          html: "Area",
          tooltip: "Medir area",
        },
      },
      addHooks: function () {
        self.measureAction = new L.MeasureAction(self.map, {
          model: "area", // 'area' or 'distance', default is 'distance',
        });
        self.measureAction.setModel("area");
        self.measureAction.enable();

        self.infoButton.state("desactivado");
        self.infoButton.button.style.backgroundColor = "white";
        self.infoButton.button.style.color = "grey";
        document.getElementById("map").style.cursor = "move";

        ImmediateSubAction.prototype.addHooks.call(this);
      },
    });
    var Cancel = ImmediateSubAction.extend({
      options: {
        toolbarIcon: {
          html: '<i class="fa fa-times"></i>',
          tooltip: "Cancel",
        },
      },
      addHooks: function () {
        console.log("Cancelled");
        ImmediateSubAction.prototype.addHooks.call(this);
      },
    });

    var MyCustomAction = L.Toolbar2.Action.extend({
      options: {
        toolbarIcon: {
          className: "fa-solid fa-ruler-combined fa-lg",
        },

        subToolbar: new L.Toolbar2({
          actions: [measureLine, measureArea, Cancel],
        }),
      },
      addHooks: function () {
        console.log("Click");
      },
    });

    if (!this.isMobile())
      new L.Toolbar2.Control({
        position: "topleft",
        actions: [MyCustomAction],
      }).addTo(this.map);
  }

  /**
   * Establece el control de información en el mapa.
   * @returns {object} El botón de información.
   */
  setInfoControl() {
    let infoButton = L.easyButton({
      states: [
        {
          stateName: "desactivado", // name the state
          icon: "fa-solid fa-circle-info fa-lg", // and define its properties
          title: "Activar información de elementos", // like its title
          onClick: function (btn, map) {
            // and its callback
            btn.button.style.backgroundColor = "#990000";
            btn.button.style.color = "white";
            btn.state("activado"); // change state on click!
            document.getElementById("map").style.cursor = "help";
          },
        },
        {
          stateName: "activado",
          icon: "fa-solid fa-circle-info fa-lg",
          title: "Desactivar información de elementos",
          onClick: function (btn, map) {
            btn.button.style.backgroundColor = "white";
            btn.button.style.color = "grey";
            btn.state("desactivado");
            document.getElementById("map").style.cursor = "move";
          },
        },
      ],
    });
    infoButton.state("activado");
    infoButton.button.style.backgroundColor = "#990000";
    infoButton.button.style.color = "white";

    if (!this.isMobile()) infoButton.addTo(this.map);

    return infoButton;
  }

  /**
   * Agrega un control de ubicación al mapa.
   */
  setLocateControl() {
    L.control.locate().addTo(this.map);
  }

  /**
   * Agrega un control para deseleccionar elementos en el mapa.
   * Este control elimina las capas de elementos seleccionados o realiza acciones de deselección.
   */
  setDeselectionControl() {
    const self = this;
    var actionInfo = L.easyButton(
      '<i class="fa fa-object-ungroup fa-lg"></i>',
      function (btn, map) {
        console.log(self.puntos);
        console.log("pasa click deselect");
        if (self.puntos != null) map.removeLayer(self.puntos);
        //if (selectSearch != null) map.removeLayer(selectSearch);
        //deleteQuerys();
      },
      "Deseleccionar els elements"
    );
    actionInfo.addTo(this.map);
  }

  /**
   * Agrega un control de impresión de mapa en el navegador (browserPrint) al mapa.
   * Este control permite a los usuarios imprimir el contenido del mapa en su navegador web.
   */
  setbrowserPrintControl() {
    if (!this.isMobile()) L.control.browserPrint().addTo(this.map);
  }

  /**
   * Agrega un control de pantalla completa al mapa.
   * Los usuarios pueden usar este control para cambiar entre el modo de pantalla completa y el modo normal.
   */
  setFullScreenControl() {
    this.map.addControl(new L.Control.Fullscreen());
  }

  /**
   * Agrega un control de coordenadas del mouse al mapa.
   * Este control muestra las coordenadas del mouse en el mapa, con opciones para utilizar coordenadas UTM o GPS.
   */
  setMouseCoordinates() {
    L.control
      .mouseCoordinate({ utm: true, gps: false, gpsLong: false })
      .addTo(this.map);
  }

  /**
   * Agrega una escala gráfica al mapa.
   * Esta escala gráfica muestra la relación entre las unidades en el mapa y la distancia real en el terreno.
   */
  setGraphicScale() {
    const graphicScale = L.control
      .graphicScale({ fill: "hollow", doubleLine: false })
      .addTo(this.map);
  }

  /**
   * Crea y configura una barra lateral (sidebar) con paneles personalizados para mostrar información y realizar consultas.
   * @returns {L.Control.Sidebar} La barra lateral configurada.
   */
  createSidebar() {
    // Crea una instancia de L.Control.Sidebar y configura sus opciones.
    const sidebar = L.control
      .sidebar({
        autopan: true, // Mantener el punto central del mapa al abrir la barra lateral
        closeButton: true, // Agregar un botón de cierre a los paneles
        container: "sidebar", // Contenedor DOM o #ID de un contenedor de barra lateral predefinido
        position: "left", // Posición de la barra lateral (izquierda o derecha)
      })
      .addTo(this.map);

    /* Agrega paneles personalizados */
    const panelContent = {
      id: "userinfo", // Identificador único para acceder al panel
      tab: '<i class="fa fa-info"></i>', // Contenido del botón de pestaña como cadena HTML
      pane: "-", // Elementos DOM que se pueden pasar
      title: "Información de datos", // Título opcional del panel
      // position: 'bottom' // Alineación vertical opcional, predeterminada a 'top'
    };

    const panelQuery = {
      id: "queryTables", // Identificador único para acceder al panel
      tab: '<i class="fa fa-table"></i>', // Contenido del botón de pestaña como cadena HTML
      pane: "-", // Elementos DOM que se pueden pasar
      title: "Consulta entidades urbanísticas", // Título opcional del panel
      // position: 'bottom' // Alineación vertical opcional, predeterminada a 'top'
    };

    const panelQueryEXP = {
      id: "queryTablesEXP", // Identificador único para acceder al panel
      tab: '<i class="fa-solid fa-file-signature"></i>', // Contenido del botón de pestaña como cadena HTML
      pane: "-", // Elementos DOM que se pueden pasar
      title: "Consulta expedientes urbanísticos", // Título opcional del panel
      // position: 'bottom' // Alineación vertical opcional, predeterminada a 'top'
    };

    const panelQuerySedipualba = {
      id: "queryTablesSedipualba", // Identificador único para acceder al panel
      tab: '<i class="fa-solid fa-file-shield"></i>', // Contenido del botón de pestaña como cadena HTML
      pane: "-", // Elementos DOM que se pueden pasar
      title: "Consulta expedientes Sedipualba", // Título opcional del panel
      // position: 'bottom' // Alineación vertical opcional, predeterminada a 'top'
    };

    const panelSearch = {
      id: "searchDir", // UID, used to access the panel
      tab: '<i class="fa fa-search"></i>', // content can be passed as HTML string,
      pane: "-", // DOM elements can be passed, too
      title: "Buscar por dirección/ref.catastral", // an optional pane header
      // position: 'bottom'                  // optional vertical alignment, defaults to 'top'
    };

    // Agrega los paneles personalizados a la barra lateral.
    sidebar.addPanel(panelContent);
    sidebar.addPanel(panelQuery);
    sidebar.addPanel(panelQueryEXP);
    //sidebar.addPanel(panelQuerySedipualba);
    sidebar.addPanel(panelSearch);

    const self = this;
    // Maneja eventos de apertura y cierre de la barra lateral.
    sidebar.on("opening", function (e) {
      // e.id contiene el ID del panel abierto
      console.log("Abriendo la barra lateral");
      self.sidebarStatus = "abierto";
      console.log(self.sidebarStatus);
    });

    sidebar.on("closing", function (e) {
      // e.id contiene el ID del panel abierto
      console.log("Cerrando la barra lateral");
      self.sidebarStatus = "cerrado";
    });

    return sidebar;
  }

  /**
   * Configura y agrega un control de capas (layer control) al mapa, que permite al usuario
   * seleccionar y deseleccionar capas base y capas superpuestas de manera jerárquica.
   */
  setLayerControl() {
    // Define la estructura de capas base y capas superpuestas en forma de árbol.
    const baseTree = [
      {
        label:
          "<LABEL style='font-size:8pt;font-family:Arial Black;color:black'><U>INFORMACIÓN BASE</U></LABEL>",
        children: [
          {
            label: "Topografico IMI (oficial) Escala grises",
            layer: this.mapLayers
              .getMapLayerByName("cartografia_imi_grey")
              .getLayer(),
            name: "Topografico IMI (oficial) Escala grises",
          },
        ],
      },
    ];

    const overlayTree = [
      {
        label:
          "<LABEL style='font-size:8pt;font-family:Arial Black;color:black'><U>PG2023 + POD(PGOU+PRI)</U></LABEL>",
        selectAllCheckbox: "Un/select all",
        children: [
          {
            label: "Categorias de rústico (Plan General 2023)",
            layer: this.mapLayers
              .getMapLayerByName("pg2023_categorias_rustico")
              .getLayer(),
            name: "Categorias de rústico (Plan General 2023)",
          },
          {
            label:
              "<LABEL style='font-size:8pt;font-family:Arial Black;color:black'><U>Calificaciones</U></LABEL>",
            name: "Calificaciones",
            selectAllCheckbox: "Un/select all",
            children: [
              {
                label: "(PGOU98) Calificaciones",
                layer: this.mapLayers
                  .getMapLayerByName("pgou98_calificaciones")
                  .getLayer(),
                name: "(PGOU98) Calificaciones",
              },
              {
                label: "(PRI) Calificaciones",
                layer: this.mapLayers
                  .getMapLayerByName("pri_calificaciones")
                  .getLayer(),
                name: "(PRI) Calificaciones",
              },
              {
                label: "(PG2023) Calificaciones",
                layer: this.mapLayers
                  .getMapLayerByName("pg2023_calificaciones")
                  .getLayer(),
                name: "(PG2023) Calificaciones",
              },
            ],
          },
          {
            label:
              "<LABEL style='font-size:8pt;font-family:Arial Black;color:black'><U>Ámbitos</U></LABEL>",
            name: "Ambitos",
            selectAllCheckbox: "Un/select all",
            children: [
              {
                label: "(PGOU98) Ámbitos",
                layer: this.mapLayers
                  .getMapLayerByName("pgou98_ambitos")
                  .getLayer(),
                name: "(PGOU98) Ámbitos",
              },
              {
                label: "(PRI) Ámbitos",
                layer: this.mapLayers
                  .getMapLayerByName("pri_ambitos")
                  .getLayer(),
                name: "(PRI) Ámbitos",
              },
              {
                label: "(PG2023) Ámbitos",
                layer: this.mapLayers
                  .getMapLayerByName("pg2023_ambitos")
                  .getLayer(),
                name: "(PG2023) Ámbitos",
              },
            ],
          },
        ],
      },
    ];

    // Crea y agrega el control de capas al mapa.
    const layerControl = L.control.layers
      .tree(baseTree, overlayTree)
      .addTo(this.map);

    // Oculta el botón del control de capas.
    layerControl.getContainer().style.display = "none";
  }

  /**
   * Crea y configura una tabla de contenido (TOC) para gestionar las capas del mapa.
   * @returns {TOC} La instancia de la tabla de contenido configurada.
   * @throws {Error} Si ocurre un error durante la inicialización de la TOC.
   */
  async createTOC() {
    const toc = new TOC(this.mapLayers, this.mapBaseActual, this.map);
    await toc.setLayerAI();
    await toc.initialize();

    return toc;
  }

  /**
   * Agrega capas específicas desde el objeto `mapLayers` al mapa actual.
   * @param {MapLayerManager} mapLayers - El administrador de capas del mapa.
   */
  setLayers(mapLayers) {
    mapLayers
      .getMapLayerByName("cartografia_imi_grey")
      .getLayer()
      .addTo(this.map);
    mapLayers
      .getMapLayerByName("pg2023_categorias_rustico")
      .getLayer()
      .addTo(this.map);
    mapLayers
      .getMapLayerByName("pg2023_calificaciones")
      .getLayer()
      .addTo(this.map);
    mapLayers
      .getMapLayerByName("pgou98_calificaciones")
      .getLayer()
      .addTo(this.map);
    mapLayers
      .getMapLayerByName("pri_calificaciones")
      .getLayer()
      .addTo(this.map);
    mapLayers.getMapLayerByName("pg2023_ambitos").getLayer().addTo(this.map);
    mapLayers.getMapLayerByName("pgou98_ambitos").getLayer().addTo(this.map);
    mapLayers.getMapLayerByName("pri_ambitos").getLayer().addTo(this.map);
  }

  /**
   * Añade un marcador al mapa en una ubicación específica.
   * @param {number} latitud - Latitud del marcador.
   * @param {number} longitud - Longitud del marcador.
   * @param {string} mensaje - Mensaje para mostrar en el popup del marcador.
   */
  addMarker(latitud, longitud, mensaje) {
    L.marker([latitud, longitud])
      .addTo(this.map)
      .bindPopup(mensaje)
      .openPopup();
  }

  /**
   * Cambia la vista del mapa a una ubicación y zoom específicos.
   * @param {number} latitud - Latitud del centro de la nueva vista.
   * @param {number} longitud - Longitud del centro de la nueva vista.
   * @param {number} zoom - Nivel de zoom para la nueva vista.
   */
  changeView(latitud, longitud, zoom) {
    this.map.setView([latitud, longitud], zoom);
  }
}
