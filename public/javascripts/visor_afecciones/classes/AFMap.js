/**
 * Clase AFMap para la gestión y visualización de affecciones en termino Palma.
 * Utiliza la biblioteca Leaflet para la manipulación de mapas y capas.
 *
 * @memberof module:Frontend
 */
class AFMap {
  /**
   * Crea una instancia de AFMap.
   * @constructor
   * @param {string} contenedorMapa - El ID del contenedor del mapa en el DOM.
   * @param {Object} opciones - Configuraciones opcionales para el mapa.
   */
  constructor(contenedorMapa, opciones, parametro) {
    /*$("#dialog-message").html(
      
        "- El present visor és merament orientatiu atès que recull exigències d’altres administracions/organismes.<br>- Les possibles errades i omissions es corregiran tal qual la administració/òrgan responsable publiqui o ens faci arribar les dades en format vectorial." +
        
        '<h1><img src="https://sigdu-urbanismo.net/opg/SIGDU_VISOR.jpg" alt="Logo del Servicio de Innovación y Gestión de Datos de Urbanismo Ajuntament de Palma" class="logo_SIGDU" ></h1>' +
        "</div>"
    );*/

    $("#dialog-message").html(
      '<br><div style="padding:0px; text-align:center; font-family: \'Roboto\', sans-serif; font-weight: 700; font-size: 14px;  margin-left: auto; margin-right: auto;"><b><u>VISOR D’AFECCIONS SECTORIALS</u></b></div>' +
      '<div style="padding:8px; text-align:center; font-family: \'Roboto\', sans-serif; font-weight: 700; font-size: 14px;  margin-left: auto; margin-right: auto;"><b><u>VINCULADES A LLICÈNCIES URBANÍSTIQUES</u></b></div>' +
      // Lista justificada con fuente Roboto y tamaño menor, incluyendo espaciado entre ítems
      '<ul style="text-align:left; font-family: \'Roboto\', sans-serif; font-weight: 400; font-size: 13px; padding-left: 20px; padding-right: 20px;">' + 
          '<li style="margin-bottom: 10px;">El present visor es publica en estreta col·laboració amb el departament d’Obres i és merament orientatiu atès que recull afeccions exigides des d’altres administracions/organismes.</li>' + // Primer ítem de la lista con margen en la parte inferior
          '<li>Les possibles errades i omissions es corregiran tal qual la administració/òrgan responsable publiqui o ens faci arribar les dades en format vectorial.</li>' + // Segundo ítem de la lista
      '</ul>' +
      '<div style="text-align:center;"><img src="https://sigdu-urbanismo.net/opg/SIGDU_VISOR.jpg" alt="Logo del Servicio de Innovación y Gestión de Datos de Urbanismo Ajuntament de Palma" class="logo_SIGDU"></div>'
  );
  
  
  
  
  
  

    if (parametro == null) parametro = "smoothness";

    $("#estilos").attr(
      "href",
      `https://code.jquery.com/ui/1.12.1/themes/${parametro}/jquery-ui.css`
    );

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

    this.setCursorHelp();
    this.setGraphicScale();
    this.setMouseCoordinates();
    this.setFullScreenControl();

    this.puntos = null;
    this.setDeselectionControl();

    this.mapQuery = new AFMapQuery(this);
    const self=this;
    this.map.on("click", function (e) {
      //var popLocation = e.latlng;
      var x = e.latlng.utm().x;
      var y = e.latlng.utm().y;

      //if (self.infoButton._currentState.stateName == "activado")
        self.mapQuery.queryByPoint(e);
      //var estadoActual = self.infoButton.options.stateName;
      //console.log("estadoActual", self.infoButton._currentState.stateName);
    });

    this.createQuerySEARCH();

    $(function () {
      $("#dialog-message").dialog({
        //title: "VISOR AFECCIONS - PALMA",
        modal: true,
        width: 530, // Establece el ancho a 500px
        height: 480, // Establece la altura a 400px
        buttons: {
          Aceptar: function () {
            $(this).dialog("close");
          },
        },
      });
    });
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
   * Crea un diálogo de busqueda por dirección/ref. catastral.
   */
  createQuerySEARCH() {
    new QuerySearch(this.map, this.mapLayers, this.toc, this);
  }

  /**
   * Agrega capas específicas desde el objeto `mapLayers` al mapa actual.
   * @param {MapLayerManager} mapLayers - El administrador de capas del mapa.
   */
  setLayers(mapLayers) {
    mapLayers
      .getMapLayerByName("cartodb_light_all")
      .getLayer()
    .addTo(this.map);
    mapLayers
      .getMapLayerByName("cartografia_imi_grey")
      .getLayer()
      .addTo(this.map);
   
    
    mapLayers
      .getMapLayerByName("af_rustico")
      .getLayer()
      .addTo(this.map);
    mapLayers.getMapLayerByName("af_porn_serra_tramuntana").getLayer().addTo(this.map);
    mapLayers.getMapLayerByName("af_red_natura_2000").getLayer().addTo(this.map);
    mapLayers.getMapLayerByName("af_espacio_natural_protegido").getLayer().addTo(this.map);
    mapLayers.getMapLayerByName("af_abc_fontanelles").getLayer().addTo(this.map);
    mapLayers.getMapLayerByName("af_zar_palma").getLayer().addTo(this.map);
    //mapLayers.getMapLayerByName("af_apr_cn").getLayer().addTo(this.map);
    mapLayers
      .getMapLayerByName("af_aip")
      .getLayer()
      .addTo(this.map);
    mapLayers
      .getMapLayerByName("af_flujo_preferente")
      .getLayer()
      .addTo(this.map);
    mapLayers
      .getMapLayerByName("af_inundables_t500")
      .getLayer()
      .addTo(this.map);
    mapLayers
      .getMapLayerByName("af_inundables_freatico")
      .getLayer()
      .addTo(this.map);
    mapLayers
      .getMapLayerByName("af_potencialmente_inundable")
      .getLayer()
      .addTo(this.map);
    mapLayers
      .getMapLayerByName("af_zona_servitud")
      .getLayer()
      .addTo(this.map);
    mapLayers
      .getMapLayerByName("af_zona_policia")
      .getLayer()
      .addTo(this.map);
    mapLayers
      .getMapLayerByName("af_zona_humeda")
      .getLayer()
      .addTo(this.map);
    mapLayers
      .getMapLayerByName("af_zona_pot_humeda")
      .getLayer()
      .addTo(this.map);
    mapLayers
      .getMapLayerByName("af_protecc_pous_proveim")
      .getLayer()
      .addTo(this.map);
    mapLayers.getMapLayerByName("af_costas_zsp").getLayer().addTo(this.map);
    mapLayers.getMapLayerByName("af_costas_tr").getLayer().addTo(this.map);
    mapLayers.getMapLayerByName("af_costas_zdpmt").getLayer().addTo(this.map);
    mapLayers.getMapLayerByName("af_apt_carreteras").getLayer().addTo(this.map);
    mapLayers.getMapLayerByName("af_apt_litoral").getLayer().addTo(this.map);
    mapLayers.getMapLayerByName("af_via_ferrea_sfm").getLayer().addTo(this.map);
    mapLayers.getMapLayerByName("af_via_ferrea_soller").getLayer().addTo(this.map);
    mapLayers
    .getMapLayerByName("af_zonas_n_r_parq")
    .getLayer()
    .addTo(this.map);
    mapLayers.getMapLayerByName("af_bic_bc_cic").getLayer().addTo(this.map);
    mapLayers
      .getMapLayerByName("af_catalogos_molinos_entorno")
      .getLayer()
      .addTo(this.map);
    mapLayers
      .getMapLayerByName("af_centro_historico")
      .getLayer()
      .addTo(this.map);
    mapLayers
      .getMapLayerByName("af_nucleos_tradicionales")
      .getLayer()
      .addTo(this.map);
    mapLayers
      .getMapLayerByName("af_zona_ports")
      .getLayer()
      .addTo(this.map);
    mapLayers
      .getMapLayerByName("af_zona_aerop")
      .getLayer()
      .addTo(this.map);
    mapLayers
      .getMapLayerByName("af_zpzm")
      .getLayer()
      .addTo(this.map);
    mapLayers
      .getMapLayerByName("af_emerg")
      .getLayer()
      .addTo(this.map);
    mapLayers
      .getMapLayerByName("af_parcbit")
      .getLayer()
      .addTo(this.map);
    mapLayers
      .getMapLayerByName("af_poliducto")
      .getLayer()
      .addTo(this.map);
    mapLayers
      .getMapLayerByName("af_gasoducto")
      .getLayer()
      .addTo(this.map);
    mapLayers
      .getMapLayerByName("af_parc_nacional")
      .getLayer()
      .addTo(this.map);
    
    /*mapLayers
      .getMapLayerByName("af_servitud_aeronautica")
      .getLayer()
      .addTo(this.map);*/
    /*mapLayers
      .getMapLayerByName("pg2023_suelo_urbano")
      .getLayer()
      .addTo(this.map);*/
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
          "<LABEL style='font-size:8pt;font-family:Arial Black;color:black'><U>AFECCIONES</U></LABEL>",
        selectAllCheckbox: "Un/select all",
        children: [
          {
            layer: this.mapLayers.getMapLayerByName("pnoa_2021").getLayer(),
          },
          {
            layer: this.mapLayers.getMapLayerByName("pnoa_2018").getLayer(),
          },
          {
            layer: this.mapLayers.getMapLayerByName("pnoa_2015").getLayer(),
          },
          {
            layer: this.mapLayers.getMapLayerByName("pnoa_2012").getLayer(),
          },
          {
            layer: this.mapLayers.getMapLayerByName("pnoa_2010").getLayer(),
          },
          {
            layer: this.mapLayers.getMapLayerByName("pnoa_2008_10").getLayer(),
          },
          {
            layer: this.mapLayers.getMapLayerByName("pnoa_2006").getLayer(),
          },
          {
            layer: this.mapLayers.getMapLayerByName("sigpac").getLayer(),
          },
          {
            layer: this.mapLayers.getMapLayerByName("ib_2001").getLayer(),
          },
          {
            layer: this.mapLayers.getMapLayerByName("olistat").getLayer(),
          },
          {
            layer: this.mapLayers.getMapLayerByName("olistat").getLayer(),
          },
          {
            layer: this.mapLayers.getMapLayerByName("mallorca_1995").getLayer(),
          },
          {
            layer: this.mapLayers
              .getMapLayerByName("nacional_1981_1986")
              .getLayer(),
          },
          {
            layer: this.mapLayers.getMapLayerByName("ams_1956_1967").getLayer(),
          },
          {
            layer: this.mapLayers.getMapLayerByName("catastro").getLayer(),
          },
          {
            layer: this.mapLayers.getMapLayerByName("cartografia_imi_grey").getLayer(),
          },
          {
            layer: this.mapLayers.getMapLayerByName("cartografia_imi_color").getLayer(),
          },
          {
            layer: this.mapLayers
              .getMapLayerByName("pg2023_pgou98_pri")
              .getLayer(),
          },
          {
            layer: this.mapLayers.getMapLayerByName("af_rustico").getLayer(),
          },
          {
            layer: this.mapLayers.getMapLayerByName("af_zar_palma").getLayer(),
          },
          {
            layer: this.mapLayers.getMapLayerByName("af_apr_cn").getLayer(),
          },
          {
            layer: this.mapLayers.getMapLayerByName("af_apr_er").getLayer(),
          },
          {
            layer: this.mapLayers.getMapLayerByName("af_apr_es").getLayer(),
          },
          {
            layer: this.mapLayers
              .getMapLayerByName("af_aip")
              .getLayer(),
          },
          {
            layer: this.mapLayers.getMapLayerByName("af_porn_serra_tramuntana").getLayer(),
          },
          {
            layer: this.mapLayers.getMapLayerByName("af_red_natura_2000").getLayer(),
          },
          {
            layer: this.mapLayers.getMapLayerByName("af_espacio_natural_protegido").getLayer(),
          },
          {
            layer: this.mapLayers.getMapLayerByName("af_abc_fontanelles").getLayer(),
          },
          {
            layer: this.mapLayers
              .getMapLayerByName("af_flujo_preferente")
              .getLayer(),
          },
          {
            layer: this.mapLayers
              .getMapLayerByName("af_inundables_t500")
              .getLayer(),
          },
          {
            layer: this.mapLayers
              .getMapLayerByName("af_inundables_freatico")
              .getLayer(),
          },
          {
            layer: this.mapLayers
              .getMapLayerByName("af_potencialmente_inundable")
              .getLayer(),
          },
          {
            layer: this.mapLayers
              .getMapLayerByName("af_zona_servitud")
              .getLayer(),
          },
          {
            layer: this.mapLayers
              .getMapLayerByName("af_zona_policia")
              .getLayer(),
          },
          {
            layer: this.mapLayers
              .getMapLayerByName("af_zona_humeda")
              .getLayer(),
          },
          {
            layer: this.mapLayers
              .getMapLayerByName("af_zona_pot_humeda")
              .getLayer(),
          },
          {
            layer: this.mapLayers
              .getMapLayerByName("af_protecc_pous_proveim")
              .getLayer(),
          },
          {
            layer: this.mapLayers.getMapLayerByName("af_costas_zsp").getLayer(),
          },
          {
            layer: this.mapLayers.getMapLayerByName("af_costas_tr").getLayer(),
          },
          {
            layer: this.mapLayers.getMapLayerByName("af_costas_zdpmt").getLayer(),
          },
          {
            layer: this.mapLayers
              .getMapLayerByName("af_apt_carreteras")
              .getLayer(),
          },
          {
            layer: this.mapLayers
              .getMapLayerByName("af_apt_litoral")
              .getLayer(),
          },
          {
            layer: this.mapLayers
              .getMapLayerByName("af_via_ferrea_sfm")
              .getLayer(),
          },
          {
            layer: this.mapLayers
              .getMapLayerByName("af_via_ferrea_soller")
              .getLayer(),
          },
          {
            layer: this.mapLayers.getMapLayerByName("af_zonas_n_r_parq").getLayer(),
          },
          {
            layer: this.mapLayers.getMapLayerByName("af_bic_bc_cic").getLayer(),
          },
          {
            layer: this.mapLayers
              .getMapLayerByName("af_catalogos_molinos_entorno")
              .getLayer(),
          },
          {
            layer: this.mapLayers
              .getMapLayerByName("af_centro_historico")
              .getLayer(),
          },
          {
            layer: this.mapLayers
              .getMapLayerByName("af_nucleos_tradicionales")
              .getLayer(),
          },
          {
            layer: this.mapLayers
              .getMapLayerByName("af_zona_ports")
              .getLayer(),
          },
          {
            layer: this.mapLayers
              .getMapLayerByName("af_zona_aerop")
              .getLayer(),
          },
          {
            layer: this.mapLayers
              .getMapLayerByName("af_zpzm")
              .getLayer(),
          },
          {
            layer: this.mapLayers
              .getMapLayerByName("af_emerg")
              .getLayer(),
          },
          {
            layer: this.mapLayers
              .getMapLayerByName("af_parcbit")
              .getLayer(),
          },
          {
            layer: this.mapLayers
              .getMapLayerByName("af_poliducto")
              .getLayer(),
          },
          {
            layer: this.mapLayers
              .getMapLayerByName("af_gasoducto")
              .getLayer(),
          },
          {
            layer: this.mapLayers
              .getMapLayerByName("af_servitud_aeronautica")
              .getLayer(),
          },
          {
            layer: this.mapLayers
              .getMapLayerByName("af_parc_nacional")
              .getLayer(),
          },
          
          /*{
            layer: this.mapLayers
              .getMapLayerByName("pg2023_suelo_urbano")
              .getLayer(),
          },*/

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
          {
            label: "APR (Plan General 2023)",
            layer: this.mapLayers
              .getMapLayerByName("pg2023_rustico_apr")
              .getLayer(),
            name: "APR (Plan General 2023)",
          },
          {
            label: "APT (Plan General 2023)",
            layer: this.mapLayers
              .getMapLayerByName("pg2023_rustico_apt")
              .getLayer(),
            name: "APT (Plan General 2023)",
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
      title: "Informació de dades", // Título opcional del panel
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
   * Crea y configura una tabla de contenido (TOC) para gestionar las capas del mapa.
   * @returns {TOC} La instancia de la tabla de contenido configurada.
   * @throws {Error} Si ocurre un error durante la inicialización de la TOC.
   */
  async createTOC() {
    const toc = new AFTOC(this.mapLayers, this.mapBaseActual, this.map);
    await toc.initialize();


    return toc;
  }

  
}
