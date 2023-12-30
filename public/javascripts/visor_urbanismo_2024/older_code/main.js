function main() {
  function isMobile() {
    return window.matchMedia("(max-width: 767px)").matches;
  }

  map = L.map("map", {
    center: [39.57951, 2.68745],
    zoom: 12,
    minZoom: 10,
    maxZoom: 22,
    zoomControl: false,
  });

  // añadir mapas

  const mapLayers = new MapLayersVisor();

  mapLayers.getMapLayerByName("cartografia_imi_grey").getLayer().addTo(map);

  mapLayers
    .getMapLayerByName("pg2023_categorias_rustico")
    .getLayer()
    .addTo(map);
  mapLayers.getMapLayerByName("pg2023_calificaciones").getLayer().addTo(map);
  mapLayers.getMapLayerByName("pgou98_calificaciones").getLayer().addTo(map);
  mapLayers.getMapLayerByName("pri_calificaciones").getLayer().addTo(map);
  mapLayers.getMapLayerByName("pg2023_ambitos").getLayer().addTo(map);
  mapLayers.getMapLayerByName("pgou98_ambitos").getLayer().addTo(map);
  mapLayers.getMapLayerByName("pri_ambitos").getLayer().addTo(map);

  const baseTree = [
    {
      label:
        "<LABEL style='font-size:8pt;font-family:Arial Black;color:black'><U>INFORMACIÓN BASE</U></LABEL>",
      children: [
        {
          label: "Topografico IMI (oficial) Escala grises",
          layer: mapLayers.getMapLayerByName("cartografia_imi_grey").getLayer(),
          name: "Topografico IMI (oficial) Escala grises",
        },
        {
          label: "Topografico IMI (oficial) Color",
          layer: mapLayers
            .getMapLayerByName("cartografia_imi_color")
            .getLayer(),
          name: "Topografico IMI (oficial  Color)",
        },
        {
          label: "Catastro (OVC)",
          layer: mapLayers.getMapLayerByName("catastro").getLayer(),
          name: "Catastro (OVC)",
        },
        {
          label: "Google Streets",
          layer: mapLayers.getMapLayerByName("google_streets").getLayer(),
          name: "Google Streets",
        },
        {
          label: "Google Satellite",
          layer: mapLayers.getMapLayerByName("google_satellite").getLayer(),
          name: "Google Satellite",
        },
        {
          label: "Google Hybrid",
          layer: mapLayers.getMapLayerByName("google_hybrid").getLayer(),
          name: "Google Hybrid",
        },
        {
          label: "Google Terrain",
          layer: mapLayers.getMapLayerByName("google_terrain").getLayer(),
          name: "Google Terrain",
        },
        {
          label: "Google Traffic",
          layer: mapLayers.getMapLayerByName("google_traffic").getLayer(),
          name: "Google Traffic",
        },
        {
          label: "CartoDB (Light)",
          layer: mapLayers.getMapLayerByName("cartodb_light_all").getLayer(),
          name: "CartoDB (Light)",
        },
        {
          label: "Orthoimage PNOA (Actual)",
          layer: mapLayers.getMapLayerByName("pnoa_actual").getLayer(),
          name: "Orthoimage PNOA (Actual)",
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
          layer: mapLayers
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
              layer: mapLayers
                .getMapLayerByName("pgou98_calificaciones")
                .getLayer(),
              name: "(PGOU98) Calificaciones",
            },
            {
              label: "(PRI) Calificaciones",
              layer: mapLayers
                .getMapLayerByName("pri_calificaciones")
                .getLayer(),
              name: "(PRI) Calificaciones",
            },
            {
              label: "(PG2023) Calificaciones",
              layer: mapLayers
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
              layer: mapLayers.getMapLayerByName("pgou98_ambitos").getLayer(),
              name: "(PGOU98) Ámbitos",
            },
            {
              label: "(PRI) Ámbitos",
              layer: mapLayers.getMapLayerByName("pri_ambitos").getLayer(),
              name: "(PRI) Ámbitos",
            },
            {
              label: "(PG2023) Ámbitos",
              layer: mapLayers.getMapLayerByName("pg2023_ambitos").getLayer(),
              name: "(PG2023) Ámbitos",
            },
          ],
        },
      ],
    },
  ];

  // CLASE i18n
  const i18nHandler = new I18nHandler();

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
          i18nHandler.changeLanguage("ca");
        } else {
          //changeLanguage("es");
          language = "es";
          self.options.currentLanguage = "es";
          button.innerHTML =
            '<img src="/opg/images/español.png" alt="Español" title="Cambiar a idioma catalán" />';
          i18nHandler.changeLanguage("es");
        }
        // Agrega aquí la lógica para cambiar el idioma
      });
      return container;
    },
  });
  var languageControl = new languageControl({ position: "bottomright" });
  //map.addControl(new languageControl({ position: "bottomleft" }));
  //var languageControl = new languageControl();
  languageControl.addTo(map);

  const layerControl = L.control.layers.tree(baseTree, overlayTree).addTo(map);
  layerControl.getContainer().style.display = "none"; // Para ocultar el botón
  //layerControl.getContainer().style.display = 'block'; // Para mostrar el botón

  // Crear una instancia de MapQuery pasando el objeto 'map' como argumento
  const mapQuery = new MapQuery(map, i18nHandler, languageControl);

  document.getElementById("map").style.cursor = "help";

  //map_configuration();

  sidebar = L.control
    .sidebar({
      autopan: true, // whether to maintain the centered map point when opening the sidebar
      closeButton: true, // whether t add a close button to the panes
      container: "sidebar", // the DOM container or #ID of a predefined sidebar container that should be used
      position: "left", // left or right
    })
    .addTo(map);

  /* add a new panel */
  panelContent = {
    id: "userinfo", // UID, used to access the panel
    tab: '<i class="fa fa-info"></i>', // content can be passed as HTML string,
    pane: "-", // DOM elements can be passed, too
    title: "Informació de dades", // an optional pane header
    // position: 'bottom'                  // optional vertical alignment, defaults to 'top'
  };

  panelQuery = {
    id: "queryTables", // UID, used to access the panel
    tab: '<i class="fa fa-table"></i>', // content can be passed as HTML string,
    pane: "-", // DOM elements can be passed, too
    title: "Consulta entidades urbanísticas", // an optional pane header
    // position: 'bottom'                  // optional vertical alignment, defaults to 'top'
  };
  panelQueryEXP = {
    id: "queryTablesEXP", // UID, used to access the panel
    tab: '<i class="fa-solid fa-file-signature"></i>', // content can be passed as HTML string,
    pane: "-", // DOM elements can be passed, too
    title: "Consulta expedientes urbanísticos", // an optional pane header
    // position: 'bottom'                  // optional vertical alignment, defaults to 'top'
  };
  sidebar.addPanel(panelContent);
  sidebar.addPanel(panelQuery);
  sidebar.addPanel(panelQueryEXP);

  sidebarStatus = "cerrado";

  sidebar.on("opening", function (e) {
    // e.id contains the id of the opened panel

    console.log("abriendo");
    sidebarStatus = "abierto";
  });

  sidebar.on("closing", function (e) {
    // e.id contains the id of the opened panel

    console.log("cerrando");
    sidebarStatus = "cerrado";
  });

  graphicScale = L.control
    .graphicScale({ fill: "hollow", doubleLine: false })
    .addTo(map);
  L.control
    .mouseCoordinate({ utm: true, gps: false, gpsLong: false })
    .addTo(map);

  map.addControl(new L.Control.Fullscreen());

  if (!isMobile()) L.control.browserPrint().addTo(map);

  // Frontend
  window.addEventListener("DOMContentLoaded", (event) => {
    // Analiza la URL para extraer el parámetro
    const urlParams = new URLSearchParams(window.location.search);
    const parametro = urlParams.get("parametro");

    if (parametro) {
      // Llama a la función y pasa el parámetro

      console.log(parametro);
      //ejecutarFuncionEnFrontend(parametro);
    }
  });

  //if (!isMobile())
  /*$(function () {
      $(document).tooltip({
        //show: { effect: "blind", duration: 400 },
        //show: { effect: "explode", duration: 400 }
        //hide: { effect: "explode", duration: 1000 }
        show: { effect: "slideDown", delay: 200, duration: 250 },
        hide: { effect: "slideDown", delay: 200, duration: 250 },
      });
    });*/

  // variable global
  puntos = null;

  var actionInfo = L.easyButton(
    '<i class="fa fa-object-ungroup fa-lg"></i>',
    function (btn, map) {
      if (puntos != null) map.removeLayer(puntos);
      //if (selectSearch != null) map.removeLayer(selectSearch);
      //deleteQuerys();
    },
    "Deseleccionar els elements"
  );
  actionInfo.addTo(map);

  /*const measure = (L.Measure = {
    linearMeasurement: "Distance measurement",
    areaMeasurement: "Area measurement",
    start: "开始",
    meter: "m",
    kilometer: "km",
    squareMeter: "m²",
    squareKilometers: "km²",
  });*/

  //const measureControl = L.control.measure({ position: "topleft" }).addTo(map);
  /*var measureAction = new L.MeasureAction(map, {
    model: "distance", // 'area' or 'distance', default is 'distance',
  });*/

  lc = L.control.locate().addTo(map);

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
        },
      },
    ],
  });
  infoButton.state("activado");
  infoButton.button.style.backgroundColor = "#990000";
  infoButton.button.style.color = "white";

  if (!isMobile()) infoButton.addTo(map);

  let measureAction = null;

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
      measureAction = new L.MeasureAction(map, {
        model: "distance", // 'area' or 'distance', default is 'distance',
      });
      measureAction.setModel("distance");
      measureAction.enable();

      infoButton.state("desactivado");
      infoButton.button.style.backgroundColor = "white";
      infoButton.button.style.color = "grey";

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
      measureAction = new L.MeasureAction(map, {
        model: "area", // 'area' or 'distance', default is 'distance',
      });
      measureAction.setModel("area");
      measureAction.enable();

      infoButton.state("desactivado");
      infoButton.button.style.backgroundColor = "white";
      infoButton.button.style.color = "grey";

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

  if (!isMobile())
    new L.Toolbar2.Control({
      position: "topleft",
      actions: [MyCustomAction],
    }).addTo(map);

  // create TOC

  const mapBaseActual = mapLayers
    .getMapLayerByName("cartografia_imi_grey")
    .getLayer();

  let toc = null;

  async function createTOC() {
    const toc = new TOC(mapLayers, mapBaseActual, map);
    await toc.setLayerAI();
    await toc.initialize();
  }

  createTOC();

  // Para usar la clase
  const queryDialog = new QueryDialog(map, mapLayers, toc);
  const queryDialogEXP = new QueryDialogEXP(map, mapLayers, toc);

  map.on("click", function (e) {
    var popLocation = e.latlng;
    var x = e.latlng.utm().x;
    var y = e.latlng.utm().y;

    if (infoButton._currentState.stateName == "activado")
      mapQuery.queryByPoint(e);
    var estadoActual = infoButton.options.stateName;
    console.log("estadoActual", infoButton._currentState.stateName);
  });

  const annyangButton = L.easyButton({
    states: [
      {
        stateName: "asistente_desactivado", // name the state
        icon: "fa-microphone fa-lg", // and define its properties
        title: "Activar asistente", // like its title
        onClick: function (btn, map) {
          // and its callback
          btn.button.style.backgroundColor = "#990000";
          btn.button.style.color = "white";
          annyang.start();
          // map.setView([46.25,-121.8],10);
          btn.state("asistente_activado"); // change state on click!
        },
      },
      {
        stateName: "asistente_activado",
        icon: "fa-microphone fa-lg",
        title: "Desactivar asistente",
        onClick: function (btn, map) {
          btn.button.style.backgroundColor = "white";
          btn.button.style.color = "black";
          annyang.abort();
          // map.setView([42.3748204,-71.1161913],16);
          btn.state("asistente_desactivado");
        },
      },
    ],
  });

  //annyangButton.addTo(map);

  let layerPA_ai = null;

  async function data_ai() {
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
          className: "text-label",
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
            className: "text-label",
          }
        );

        // Retornar un grupo que contiene el círculo y el texto
        return L.layerGroup([circleMarker]);
      },
    });

    layerPA_ai = L.layerGroup([polyLayer, pointsLayer]);
  }

  async function data_ad() {
    const reader = new DataReader();

    const geojson = await reader.readDataFeature(
      "pa_modificacion_pgou",
      "DATE_PART('year', CURRENT_DATE) - DATE_PART('year', TO_DATE(a_def, 'YYYY-MM-DD'))<2"
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

    const polyLayer = L.geoJSON(geojson, { style: style }).addTo(map);
    const pointsLayer = L.geoJSON(pointGeoJSON, {
      pointToLayer: function (feature, latlng) {
        // Crear un círculo
        const circleMarker = L.circleMarker(latlng, {
          radius: 6,
          fillColor: "#ff7800",
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8,
        });

        // Crear un texto
        const text = L.divIcon({
          className: "text-label",
          html: `<div style="padding:3px">${feature.properties.text}</div>`,
        });

        console.log(feature);
        // Agregar el texto al círculo
        circleMarker.bindTooltip(feature.properties.expediente, {
          permanent: true,
          direction: "center",
          opacity: 0.8,
          offset: [0, -20],
          className: "text-label",
        });

        // Retornar un grupo que contiene el círculo y el texto
        return L.layerGroup([circleMarker]);
      },
    }).addTo(map);
  }

  //data_ai();

  //data_ad();

  //new Asistente();

  //new Sedipualb();
}
