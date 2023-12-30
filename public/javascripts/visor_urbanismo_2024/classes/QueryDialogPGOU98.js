/**
 * Clase para gestionar los diálogos de consulta relacionados con el Plan General de Ordenación Urbana de 1998 (PGOU98).
 * @memberof module:Frontend
 */
class QueryDialogPGOU98 {
  /**
   * Crea una instancia de QueryDialogPGOU98.
   * @param {object} map - Objeto que representa el mapa.
   * @param {object} mapLayers - Capas del mapa.
   * @param {object} toc - Tabla de contenido del mapa.
   * @param {object} sigduMap - Objeto de mapa SIGDU personalizado.
   */
  constructor(map, mapLayers, toc, sigduMap) {
    this.sigduMap = sigduMap;
    this.toc = toc;
    this.map = map;
    this.mapLayers = mapLayers;
  }

  /**
   * Crea y devuelve el HTML necesario para el diálogo de consulta relacionado con el Plan General de Ordenación Urbana de 1998 (PGOU98).
   * @returns {string} HTML generado para el diálogo de consulta PGOU98.
   */
  createHTML() {
    const divQUERY = `<div id="divQUERY_PGOU98" style='background-color:#f2f2f2;width:100%;height:60%'></div`;
    const divOptionsQUERY = `<div id="divOptionsQUERY_PGOU98" style='background-color:#f2f2f2;width:100%'></div`;
    const strSelectTABLE = this.createSelectTABLE();

    const html = `
        <BR>
        ${strSelectTABLE}
        <BR><BR>          
        ${divOptionsQUERY}
        <BR><BR> 
        ${divQUERY}
        <BR>
      `;
    return html;
  }

  /**
   * Realiza una acción en una fila de la tabla.
   * @param {string} table - Nombre de la tabla.
   * @param {string} fid - Identificador único de la fila.
   * @returns {Promise<void>} Promesa que se resuelve cuando se completa la acción.
   */
  async doActionRow(table, fid) {
    /**
     * Define el estilo del objeto geográfico.
     * @returns {object} Objeto con las propiedades de estilo.
     */
    const style = () => {
      return {
        fillColor: "yellow",
        weight: 6,
        opacity: 1,
        color: "yellow",
        dashArray: "2,8",
        fillOpacity: 0,
      };
    };

    console.log("tabla=" + table + ", " + fid);
    let reader = new DataReader();
    let info_geojson = await reader.readDataFeature(table, "fid=" + fid);

    var bbox = turf.bbox(info_geojson.features[0].geometry);
    var polyBBOX = turf.bboxPolygon(bbox);

    var coordsB = turf.getCoords(polyBBOX);
    var coords = [];
    coords[0] = [coordsB[0][0][1], coordsB[0][0][0]];
    coords[1] = [coordsB[0][1][1], coordsB[0][1][0]];
    coords[2] = [coordsB[0][2][1], coordsB[0][2][0]];
    coords[3] = [coordsB[0][3][1], coordsB[0][3][0]];

    var poly = L.polygon(coords);

    /*if(isMobile())
        sidebar.close('queryTables');*/

    this.sigduMap.map.fitBounds(poly.getBounds());

    if (this.sigduMap.puntos != null)
      this.sigduMap.map.removeLayer(this.sigduMap.puntos);
    this.sigduMap.puntos = L.geoJSON(info_geojson, { style: style });

    this.sigduMap.map.addLayer(this.sigduMap.puntos);
  }

  /**
   * Formatea la tabla de consulta y agrega funcionalidad a los botones de la tabla.
   * Utiliza DataTables para habilitar funciones como copiar, exportar a Excel, exportar a PDF, e imprimir.
   * @returns {void}
   */
  async formatQuery() {
    $(document).ready(function () {
      $("#table_queryPGOU98")
        .removeAttr("width")
        .DataTable({
          dom: "Bfrtip",
          buttons: [
            "copy",
            "excel",
            //'csv',
            "pdf",
            "print",
          ],
          scrollY: "43vh",
          scrollCollapse: true,
          scrollX: true,
          paging: false,
          padding: "3px",
          language: {
            decimal: "",
            emptyTable: "No hay información",
            info: "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
            infoEmpty: "Mostrando 0 to 0 of 0 Entradas",
            infoFiltered: "(Filtrado de _MAX_ total entradas)",
            infoPostFix: "",
            thousands: ",",
            lengthMenu: "Mostrar _MENU_ Entradas",
            loadingRecords: "Cargando...",
            processing: "Procesando...",
            search: "Buscar:",
            zeroRecords: "Sin resultados encontrados",
            paginate: {
              first: "Primero",
              last: "Ultimo",
              next: "Siguiente",
              previous: "Anterior",
            },
          },
        });

        //$("#table_queryPGOU98 td").css("padding", "5px");
    });
  }

  /**
   * Realiza una consulta y muestra los resultados en una tabla para una Unidad de Ejecución (UE) en el Plan General de Ordenación Urbana de 1998 (PGOU98).
   * @param {string} name - Nombre de la consulta.
   * @param {string} table - Nombre de la tabla de consulta.
   * @param {string} filter - Filtro de consulta.
   * @returns {void}
   */
  async queryUE(name, table, filter) {
    const reader = new DataReader();
    const info_geojson = await reader.readDataFeature(table, filter);

    console.log(info_geojson);

    //jsonData = JSON.stringify(info_geojson);

    let html_QUERY_HEAD = `
          <button style="padding-top:4px;padding-bottom:4px;" class="ui-button ui-widget ui-corner-all" title="Descàrrega en format geojson"  id="download_pgou98"><i class="fa fa-download"></i></button>
          <button style="padding-top:4px;padding-bottom:4px;" class="ui-button ui-widget ui-corner-all" title="Afegeix consulta a taula de contingut" id="add_layer_toc_pgou98"><i class="fa fa-plus-circle"></i></button>
    
          <TABLE id="table_queryPGOU98"   class="stripe row-border order-column" style="padding:3px;font-size:8pt;font-family:Arial;width:100%">
         
          <thead style="background-color:#e1eefb;">
            <tr>
						  <th>FID</td>
							<th>CODIGO</td>   
              <th>DENOMINACION</td>           
            </tr>
          </thead>`;

    let html_QUERY_ROWS = "<tbody>";

    if (info_geojson.features != null)
      for (var n = 0; n < info_geojson.features.length; n++) {
        html_QUERY_ROWS =
          html_QUERY_ROWS +
          `
          <tr id="queryUE_PG998_${info_geojson.features[n].properties.fid}" 
            data-table="${table}" 
            data-fid="${info_geojson.features[n].properties.fid}"
            data-accion="doActionRowPGOU98">

            <td>${info_geojson.features[n].properties.fid}</td>
            <td>${info_geojson.features[n].properties.codigo}</td>    
            <td>${info_geojson.features[n].properties.titulo ? info_geojson.features[n].properties.titulo.toUpperCase() : "-"}</td>  						             
          </tr>`;
      }

    html_QUERY_ROWS = html_QUERY_ROWS + "</tbody>";

    const html_QUERY = html_QUERY_HEAD + html_QUERY_ROWS + `</TABLE>`;

    this.formatQuery();

    var elem = document.getElementById("divQUERY_PGOU98");
    elem.style.height = "70%";
    elem.innerHTML = html_QUERY;

    const self = this;

    var elementos = document.querySelectorAll(
      'tr[data-accion="doActionRowPGOU98"]'
    );
    for (var i = 0; i < elementos.length; i++) {
      const tr = elementos[i];

      if (tr) {
        tr.addEventListener("click", async function () {
          var fid = tr.getAttribute("data-fid");
          var table = tr.getAttribute("data-table");

          console.log("click", fid, table);

          self.doActionRow(table, fid);
        });
      }
    }

    document
      .getElementById("download_pgou98")
      .addEventListener("click", function () {
        self.download(name, info_geojson);
      });
    document
      .getElementById("add_layer_toc_pgou98")
      .addEventListener("click", function () {
        self.addLayerTOC(name, info_geojson, filter);
      });
  }

  /**
   * Realiza una consulta y muestra los resultados en una tabla para los catalogos actualizados en el Plan General de Ordenación Urbana de 1998 (PGOU98).
   * @param {string} name - Nombre de la consulta.
   * @param {string} table - Nombre de la tabla de consulta.
   * @param {string} filter - Filtro de consulta.
   * @returns {void}
   */
  async queryCAT_ACT(name, table, filter) {
    const reader = new DataReader();
    const info_geojson = await reader.readDataFeature(table, filter);

    console.log(info_geojson);

    //jsonData = JSON.stringify(info_geojson);

    let html_QUERY_HEAD = `
          <button style="padding-top:4px;padding-bottom:4px;" class="ui-button ui-widget ui-corner-all" title="Descàrrega en format geojson"  id="download_pgou98"><i class="fa fa-download"></i></button>
          <button style="padding-top:4px;padding-bottom:4px;" class="ui-button ui-widget ui-corner-all" title="Afegeix consulta a taula de contingut" id="add_layer_toc_pgou98"><i class="fa fa-plus-circle"></i></button>
    
          <TABLE id="table_queryPGOU98"   class="stripe row-border order-column" style="padding:3px;font-size:8pt;font-family:Arial;width:100%">
         
          <thead style="background-color:#e1eefb;">
            <tr>
							<th>FID</td>
							<th>CODI</td>
							<th>PROT.</td>
							<th>DENOMINACIÓ</td>  
							<th>CATEGORIA</td> 
							<th>TIPOLOGIA</td> 
							<th>USO ACTUAL</td>                   
            </tr>
          </thead>`;

    let html_QUERY_ROWS = "<tbody>";

    if (info_geojson.features != null)
      for (var n = 0; n < info_geojson.features.length; n++) {
        var area = info_geojson.features[n].properties.superfreal;
        if (area == 0 || area == null)
          area = turf.area(info_geojson.features[n].geometry);
        if (area != null) area = area.toFixed(2);
        html_QUERY_ROWS =
          html_QUERY_ROWS +
          `
					<tr id="queryCAT_ACT_PG998_${info_geojson.features[n].properties.fid}" 
            data-table="${table}" 
            data-fid="${info_geojson.features[n].properties.fid}"
            data-accion="doActionRowPGOU98">

            <td>${info_geojson.features[n].properties.fid}</td>
            <td>${info_geojson.features[n].properties.codigo}</td>
            <td>${info_geojson.features[n].properties.proteccion}</td>
            <td>${
              info_geojson.features[n].properties.denominacion
                ? info_geojson.features[
                    n
                  ].properties.denominacion.toUpperCase()
                : "-"
            }</td>
            <td>${info_geojson.features[n].properties.categoria}</td>
            <td>${info_geojson.features[n].properties.tipologia}</td>
            <td>${info_geojson.features[n].properties.us_actual}</td>         
          </tr>`;
      }

    html_QUERY_ROWS = html_QUERY_ROWS + "</tbody>";

    const html_QUERY = html_QUERY_HEAD + html_QUERY_ROWS + `</TABLE>`;

    this.formatQuery();

    var elem = document.getElementById("divQUERY_PGOU98");
    elem.style.height = "70%";
    elem.innerHTML = html_QUERY;

    const self = this;

    var elementos = document.querySelectorAll(
      'tr[data-accion="doActionRowPGOU98"]'
    );
    for (var i = 0; i < elementos.length; i++) {
      const tr = elementos[i];

      if (tr) {
        tr.addEventListener("click", async function () {
          var fid = tr.getAttribute("data-fid");
          var table = tr.getAttribute("data-table");

          console.log("click", fid, table);

          self.doActionRow(table, fid);
        });
      }
    }

    document
      .getElementById("download_pgou98")
      .addEventListener("click", function () {
        self.download(name, info_geojson);
      });
    document
      .getElementById("add_layer_toc_pgou98")
      .addEventListener("click", function () {
        self.addLayerTOC(name, info_geojson, filter);
      });
  }

  /**
   * Realiza una consulta y muestra los resultados en una tabla para los catalogos en el Plan General de Ordenación Urbana de 1998 (PGOU98).
   * @param {string} name - Nombre de la consulta.
   * @param {string} table - Nombre de la tabla de consulta.
   * @param {string} filter - Filtro de consulta.
   * @returns {void}
   */
  async queryCAT(name, table, filter) {
    const reader = new DataReader();
    const info_geojson = await reader.readDataFeature(table, filter);

    console.log(info_geojson);

    //jsonData = JSON.stringify(info_geojson);

    let html_QUERY_HEAD = `
          <button style="padding-top:4px;padding-bottom:4px;" class="ui-button ui-widget ui-corner-all" title="Descàrrega en format geojson"  id="download_pgou98"><i class="fa fa-download"></i></button>
          <button style="padding-top:4px;padding-bottom:4px;" class="ui-button ui-widget ui-corner-all" title="Afegeix consulta a taula de contingut" id="add_layer_toc_pgou98"><i class="fa fa-plus-circle"></i></button>
    
          <TABLE id="table_queryPGOU98"   class="stripe row-border order-column" style="padding:3px;font-size:8pt;font-family:Arial;width:100%">
         
          <thead style="background-color:#e1eefb;">
            <tr>
							<th>FID</td>
							<th>CODI</td>
							<th>PROT.</td>
							<th>DENOMINACIÓ</td> 
							<th>DECLARACIÓ</td>   
							<th>CATEGORIA</td> 
							<th>TIPOLOGIA</td> 
							<th>CLASIFICACIÓ</td>                   
            </tr>
          </thead>`;

    let html_QUERY_ROWS = "<tbody>";

    if (info_geojson.features != null)
      for (var n = 0; n < info_geojson.features.length; n++) {
        var area = info_geojson.features[n].properties.superfreal;
        if (area == 0 || area == null)
          area = turf.area(info_geojson.features[n].geometry);
        if (area != null) area = area.toFixed(2);
        html_QUERY_ROWS =
          html_QUERY_ROWS +
          `
          <tr id="queryCAT_PG998_${info_geojson.features[n].properties.fid}" 
            data-table="${table}" 
            data-fid="${info_geojson.features[n].properties.fid}"
            data-accion="doActionRowPGOU98">

            <td>${info_geojson.features[n].properties.fid}</td>
            <td>${info_geojson.features[n].properties.codigo}</td>
            <td>${info_geojson.features[n].properties.proteccion}</td>
            <td>${info_geojson.features[n].properties.denominacion}</td>
            <td>${info_geojson.features[n].properties.declaracion}</td>
            <td>${info_geojson.features[n].properties.categoria}</td>
            <td>${info_geojson.features[n].properties.tipologia}</td>
            <td>${info_geojson.features[n].properties.clasificacion}</td>             
          </tr>`;
      }

    html_QUERY_ROWS = html_QUERY_ROWS + "</tbody>";

    const html_QUERY = html_QUERY_HEAD + html_QUERY_ROWS + `</TABLE>`;

    this.formatQuery();

    var elem = document.getElementById("divQUERY_PGOU98");
    elem.style.height = "70%";
    elem.innerHTML = html_QUERY;

    const self = this;

    var elementos = document.querySelectorAll(
      'tr[data-accion="doActionRowPGOU98"]'
    );
    for (var i = 0; i < elementos.length; i++) {
      const tr = elementos[i];

      if (tr) {
        tr.addEventListener("click", async function () {
          var fid = tr.getAttribute("data-fid");
          var table = tr.getAttribute("data-table");

          console.log("click", fid, table);

          self.doActionRow(table, fid);
        });
      }
    }

    document
      .getElementById("download_pgou98")
      .addEventListener("click", function () {
        self.download(name, info_geojson);
      });
    document
      .getElementById("add_layer_toc_pgou98")
      .addEventListener("click", function () {
        self.addLayerTOC(name, info_geojson, filter);
      });
  }

  /**
   * Realiza una consulta y muestra los resultados en una tabla para sistemas en el Plan General de Ordenación Urbana de 1998 (PGOU98).
   * @param {string} name - Nombre de la consulta.
   * @param {string} table - Nombre de la tabla de consulta.
   * @param {string} filter - Filtro de consulta.
   * @returns {void}
   */
  async querySistemas(name, table, filter) {
    const reader = new DataReader();
    const info_geojson = await reader.readDataFeature(table, filter);

    console.log(info_geojson);

    //jsonData = JSON.stringify(info_geojson);

    let html_QUERY_HEAD = `
          <button style="padding-top:4px;padding-bottom:4px;" class="ui-button ui-widget ui-corner-all" title="Descàrrega en format geojson"  id="download_pgou98"><i class="fa fa-download"></i></button>
          <button style="padding-top:4px;padding-bottom:4px;" class="ui-button ui-widget ui-corner-all" title="Afegeix consulta a taula de contingut" id="add_layer_toc_pgou98"><i class="fa fa-plus-circle"></i></button>
    
          <TABLE id="table_queryPGOU98"   class="stripe row-border order-column" style="padding:3px;font-size:8pt;font-family:Arial;width:100%">
         
          <thead style="background-color:#e1eefb;">
            <tr>
						<th>FID</td>
						<th>CODI</td>
						<th>IDENTIFICANT</td>
						<th>DENOMINACIÓ</td>
						<th>SUPERFICIE</td>
						<th>DOTACION</td>
						<th>ORDENACIÓ</td>
						<th>DOMINI</td>
						<th>ÚS</td>
						<th>Nº INVENTARI</LABEL></td>
						<th>CLASIF. SÒL</LABEL></td>
						<th>SISTEMA</LABEL></td>
						<th>ETAPES</LABEL></td>                
            </tr>
          </thead>`;

    let html_QUERY_ROWS = "<tbody>";

    if (info_geojson.features != null)
      for (var n = 0; n < info_geojson.features.length; n++) {
        var area = info_geojson.features[n].properties.superfreal;
        if (area == 0 || area == null)
          area = turf.area(info_geojson.features[n].geometry);
        if (area != null) area = area.toFixed(2);
        html_QUERY_ROWS =
          html_QUERY_ROWS +
          `
          <tr id="querySISTEMA_PG998_${info_geojson.features[n].properties.fid}" 
            data-table="${table}" 
            data-fid="${info_geojson.features[n].properties.fid}"
            data-accion="doActionRowPGOU98">

            <td >${info_geojson.features[n].properties.fid}</td>
            <td>${info_geojson.features[n].properties.codigo}</td>
            <td>${info_geojson.features[n].properties.identif}</td>
            <td>${info_geojson.features[n].properties.denominaci}</td>
            <td>${area}</td>
            <td>${info_geojson.features[n].properties.uso2}</td>
            <td>${info_geojson.features[n].properties.ordenacion}</td>
            <td>${info_geojson.features[n].properties.domini}</td>
            <td>${info_geojson.features[n].properties.us}</td>
            <td>${info_geojson.features[n].properties.num_inv}</td>
            <td>${info_geojson.features[n].properties.clas_suelo}</td>
            <td>${info_geojson.features[n].properties.sistema}</td>
            <td>${info_geojson.features[n].properties.etapes}</td>             
          </tr>`;
      }

    html_QUERY_ROWS = html_QUERY_ROWS + "</tbody>";

    const html_QUERY = html_QUERY_HEAD + html_QUERY_ROWS + `</TABLE>`;

    this.formatQuery();

    var elem = document.getElementById("divQUERY_PGOU98");
    elem.style.height = "70%";
    elem.innerHTML = html_QUERY;

    const self = this;

    var elementos = document.querySelectorAll(
      'tr[data-accion="doActionRowPGOU98"]'
    );
    for (var i = 0; i < elementos.length; i++) {
      const tr = elementos[i];

      if (tr) {
        tr.addEventListener("click", async function () {
          var fid = tr.getAttribute("data-fid");
          var table = tr.getAttribute("data-table");

          console.log("click", fid, table);

          self.doActionRow(table, fid);
        });
      }
    }

    document
      .getElementById("download_pgou98")
      .addEventListener("click", function () {
        self.download(name, info_geojson);
      });
    document
      .getElementById("add_layer_toc_pgou98")
      .addEventListener("click", function () {
        self.addLayerTOC(name, info_geojson, filter);
      });
  }

  /**
   * Realiza una consulta y muestra los resultados en una tabla para calificaciónes en el Plan General de Ordenación Urbana de 1998 (PGOU98).
   * @param {string} name - Nombre de la consulta.
   * @param {string} table - Nombre de la tabla de consulta.
   * @param {string} filter - Filtro de consulta.
   * @returns {void}
   */
  async queryRSD(name, table, filter) {
    const reader = new DataReader();
    const info_geojson = await reader.readDataFeature(table, filter);

    console.log(info_geojson);

    //jsonData = JSON.stringify(info_geojson);

    let html_QUERY_HEAD = `
          <button style="padding-top:4px;padding-bottom:4px;" class="ui-button ui-widget ui-corner-all" title="Descàrrega en format geojson"  id="download_pgou98"><i class="fa fa-download"></i></button>
          <button style="padding-top:4px;padding-bottom:4px;" class="ui-button ui-widget ui-corner-all" title="Afegeix consulta a taula de contingut" id="add_layer_toc_pgou98"><i class="fa fa-plus-circle"></i></button>
    
          <TABLE id="table_queryPGOU98"   class="stripe row-border order-column" style="padding:3px;font-size:8pt;font-family:Arial;width:100%">
         
          <thead style="background-color:#e1eefb;">
            <tr>
						  <th>FID</td>
							<th>CODIGO</td>           
            </tr>
          </thead>`;

    let html_QUERY_ROWS = "<tbody>";

    if (info_geojson.features != null)
      for (var n = 0; n < info_geojson.features.length; n++) {
        html_QUERY_ROWS =
          html_QUERY_ROWS +
          `<tr id="queryRSD_PG998_${info_geojson.features[n].properties.fid}" 
            data-table="${table}" 
            data-fid="${info_geojson.features[n].properties.fid}"
            data-accion="doActionRowPGOU98">

            <td>${info_geojson.features[n].properties.fid}</td>
            <td>${info_geojson.features[n].properties.codigo}</td>    
                        
          </tr>`;
      }

    html_QUERY_ROWS = html_QUERY_ROWS + "</tbody>";

    const html_QUERY = html_QUERY_HEAD + html_QUERY_ROWS + `</TABLE>`;

    this.formatQuery();

    var elem = document.getElementById("divQUERY_PGOU98");
    elem.style.height = "70%";
    elem.innerHTML = html_QUERY;

    const self = this;

    var elementos = document.querySelectorAll(
      'tr[data-accion="doActionRowPGOU98"]'
    );
    for (var i = 0; i < elementos.length; i++) {
      const tr = elementos[i];

      if (tr) {
        tr.addEventListener("click", async function () {
          var fid = tr.getAttribute("data-fid");
          var table = tr.getAttribute("data-table");

          console.log("click", fid, table);

          self.doActionRow(table, fid);
        });
      }
    }

    document
      .getElementById("download_pgou98")
      .addEventListener("click", function () {
        self.download(name, info_geojson);
      });
    document
      .getElementById("add_layer_toc_pgou98")
      .addEventListener("click", function () {
        self.addLayerTOC(name, info_geojson, filter);
      });
  }

  /**
   * Genera un icono cuadrado en formato Data URL con un color especificado.
   * @param {string} iconColor - Color del icono en formato hexadecimal (#RRGGBB).
   * @returns {string} - Un Data URL que representa el icono en formato PNG.
   */
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

  /**
   * Genera un nuevo ID único basado en el ID base.
   * @param {Object} jstree - Objeto jstree que contiene los nodos.
   * @param {string} idBase - El ID base a partir del cual se generará el nuevo ID único.
   * @returns {string} - El nuevo ID único generado.
   */
  generateNewID(jstree, idBase) {
    // Genera un nuevo ID único basado en el ID base
    let nuevoID = idBase;
    let contador = 1;
    while (jstree.get_node(nuevoID)) {
      nuevoID = idBase + "_" + contador;
      contador++;
    }
    return nuevoID;
  }

  /**
   * Genera un color hexadecimal aleatorio.
   * @returns {string} - El color hexadecimal aleatorio generado.
   */
  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  /**
   * Agrega una capa al Table of Contents (TOC) y al mapa.
   * @param {string} name - El nombre de la capa.
   * @param {object} geojson - Datos GeoJSON de la capa.
   * @param {string} filter - Filtro de la capa.
   */
  addLayerTOC(name, geojson, filter) {
    const color = this.getRandomColor();

    const layerQuery = L.geoJSON(geojson, {
      // weight:1,
      fillColor: color,
      weight: 0.5,
      opacity: 1,
      color: "black",
      //  dashArray: '2,8',
      fillOpacity: 0.8,
    });

    const newID = "query";
    // Obtén una referencia al jstree
    const jstree = $("#jstree_consultas").jstree(true);
    const id = this.generateNewID(jstree, newID);
    console.log("id=", id);
    this.mapLayers.pushMapLayer(id, layerQuery);
    layerQuery.addTo(this.map);

    var node = {
      id: id,
      data: layerQuery,
      text: name + " - " + filter,
      icon: this.generateIcon(color),
    };
    var nodeP = $("#jstree_consultas").jstree().get_node("root");
    $("#jstree_consultas").jstree().create_node(nodeP, node, "last");
    $("#jstree_consultas").jstree().check_node(node);
  }

  /**
   * Descarga datos GeoJSON como un archivo .geojson.
   * @param {string} name - El nombre del archivo sin la extensión.
   * @param {object} geojson - Datos GeoJSON a descargar.
   */
  download(name, geojson) {
    const jsonData = JSON.stringify(geojson);
    var a = document.createElement("a");
    var file = new Blob([jsonData], { type: "text/plain" });
    a.href = URL.createObjectURL(file);
    a.download = name + ".geojson";
    a.click();
  }

  /**
   * Crea y devuelve un elemento de selección HTML con opciones para seleccionar tablas o categorías de datos.
   * @return {string} - Una cadena HTML que representa el elemento de selección.
   */
  createSelectTABLE() {
    const strOptionsTables = `
        <option value="NADA" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optNADA">-</option>
				<optgroup label="Zones ordinaries del Sòl Urbà" style='background-color:white;font-size:7.5pt.5pt;font-family:Arial Black;color:black'>
						<option value="RSD" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optRSD">(RSD) Zona Uso Residencial</option>   
						<option value="RSD_NE" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optRSD_NE">(RSD) Zona Uso Residencial (Zona no edificable)</option>             
						<option value="SEC" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optSEC">(SEC) Zona Uso Secundario</option>            
						<option value="TER" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optTER">(TER) Zona Uso Terciario</option>                                  
				</optgroup>   
        <optgroup label="Sistemas" style='background-color:white;font-size:7.5pt.5pt;font-family:Arial Black;color:black'>
						<option value="SLEC" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optSLEQ">(SLEC) Equipaments Comunitaris (S.Local)</option>            
						<option value="SLEL" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optSLEL">(SLEL) Espais Lliures Publics (S.Local)</option>            
						<option value="SLCI" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optSLC">(SLCI) Comunicacions e Infraestructuras (S.Local)</option>               
						<option value="SGEC" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black'
            id="optSGEC" name="(SGEC) Equipamientos Comunitarios" >(SGEC) Equipamientos Comunitarios (S.General)</option>       
						<option value="SGEL" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optSGEL">(SGEL) Espais Lliures (S.General)</option>                          	           
						<option value="SGCI" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optSGIF">(SGCI) comunicaciones e Infraestructures (S.General)</option>                          				
        </optgroup>
				<optgroup label="Protección i Preservación" style='background-color:white;font-size:7.5pt.5pt;font-family:Arial Black;color:black'>
						<option value="CAT" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optCAT">(CAT) Catalogos</option>    
						<option value="CAT_ACT" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optCAT_ACT">(CAT_ACT) Catalogos actualización</option>      
						<option value="CH" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optCH">(CH) Zones Centre Historic (N/R)</option>   
						<option value="r" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optPV">(r) Preservació arquitectònica ambiental</option>                     
				</optgroup>  
				<optgroup label="Ambitos de gestión" style='background-color:white;font-size:7.5pt.5pt;font-family:Arial Black;color:black'>
						<option value="UE" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optUE">(UE) Unididad de ejecución</option>
						<option value="API" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optAPI">(API) Area Planeamienot Incorporado</option>
						<option value="ARE" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optARE">(ARE) Area régimen especial en suelo urbano</option>  
				</optgroup>    
        `;

    const strSelectTABLE = `    
          <select style='background-color:#5b9ec1;color:white;padding:2px;font-size:9pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="selectTablesPG2023" id="selectTablesPGOU98" >
          
              ${strOptionsTables}
          </select>
          `;

    return strSelectTABLE;
  }

  /**
   * Función para cambiar la consulta basada en el tipo seleccionado.
   * @returns {void}
   */
  changeQUERY() {
    let tipo;
    let filter = "fid>0";
    const elem = document.getElementById("selectTablesPGOU98");

    if (elem != null) {
      tipo = elem.value;
    }

    if (tipo == "RSD") {
      const div = document.getElementById("divOptionsQUERY_PGOU98");
      const  tipo_ord = div.querySelector("#selectTIPO_ORD").value;
			const  tipoCalif = div.querySelector("#selectTIPO").value;
      const  calificacion = div.querySelector("#selectCALIF").value;
      const  alturaFirst = div.querySelector("#alturaFirst").value;
      const   alturaEnd = div.querySelector("#alturaEnd").value;

      if (tipo_ord != "TOTS") {
        if (tipo_ord == "RES_AVMCV")
          filter =
            filter +
            " AND (codigo like 'A%' OR  codigo like 'B%' OR codigo like 'C%')";
        if (tipo_ord == "RES_AVMCR")
          filter = filter + " AND (codigo like 'D%' OR  codigo like 'H%')";
        if (tipo_ord == "RES_P_RP")
          filter = filter + " AND (codigo like 'E%' OR codigo like 'G%')";
        if (tipo_ord == "RES_U_RPA")
          filter = filter + " AND (codigo like 'I%')";
        if (tipo_ord == "RES_U_RPS")
          filter = filter + " AND (codigo like 'J%')";
      }

      if (tipoCalif !== "TOTS") filter += ` AND codigo like '${tipoCalif}%'`;
      if (calificacion !== "TOTS")
        filter += ` AND codigo like '${calificacion}%'`;
      if (alturaFirst != "") filter += ` AND alturas>='${alturaFirst}'`;
      if (alturaEnd != "") filter += ` AND alturas<='${alturaEnd}'`;

      console.log(filter);
      this.queryRSD("Residencial (PGOU98)", "zona_residencial_1", filter);
    }

    if (tipo == "RSD_NE") {
      const tipo_ord = document.getElementById("selectTIPO_ORD").value;
      const tipoCalif = document.getElementById("selectTIPO").value;
      const calificacion = document.getElementById("selectCALIF").value;

      if (tipo_ord != "TOTS") {
        if (tipo_ord == "RES_AVMCV")
          filter =
            filter +
            " AND (codigo like 'A%' OR  codigo like 'B%' OR codigo like 'C%')";
        if (tipo_ord == "RES_AVMCR")
          filter = filter + " AND (codigo like 'D%' OR  codigo like 'H%')";
        if (tipo_ord == "RES_P_RP")
          filter = filter + " AND (codigo like 'E%' OR codigo like 'G%')";
        if (tipo_ord == "RES_U_RPA")
          filter = filter + " AND (codigo like 'I%')";
        if (tipo_ord == "RES_U_RPS")
          filter = filter + " AND (codigo like 'J%')";
      }

      if (tipoCalif !== "TOTS") filter += ` AND codigo like '${tipoCalif}%'`;
      if (calificacion !== "TOTS")
        filter += ` AND codigo like '${calificacion}%'`;

      this.queryRSD(
        "Residencial (PGOU98) No edificable",
        "zona_residencial_ne",
        filter
      );
    }

    if (tipo == "SEC") {
      const div = document.getElementById("divOptionsQUERY_PGOU98");
			const  tipoCalif = div.querySelector("#selectTIPO").value;
      const  calificacion = div.querySelector("#selectCALIF").value;

      if (tipoCalif !== "TOTS") filter += ` AND codigo like '${tipoCalif}%'`;
      if (calificacion !== "TOTS")
        filter += ` AND codigo like '${calificacion}%'`;

      this.queryRSD("Secundario (PGOU98)", "zona_secundaria", filter);
    }

    if (tipo == "TER") {
      const div = document.getElementById("divOptionsQUERY_PGOU98");
			const  tipoCalif = div.querySelector("#selectTIPO").value;
      const  calificacion = div.querySelector("#selectCALIF").value;

      if (tipoCalif !== "TOTS") filter += ` AND codigo like '${tipoCalif}%'`;
      if (calificacion !== "TOTS")
        filter += ` AND codigo like '${calificacion}%'`;

      this.queryRSD("Terciario (PGOU98)", "zona_terciaria", filter);
    }

    if (tipo == "SLEC") {
			const div = document.getElementById("divOptionsQUERY_PGOU98");
			const ext_prop = div.querySelector("#selectEP").value;
			const dominio = div.querySelector("#selectDOMINIO").value;
			const uso_dot = div.querySelector("#selectUSO_DOT").value;
			const calificacion = div.querySelector("#selectCALIFIC").value;


      if (ext_prop !== "TOTS") filter += ` AND ext_prop='${ext_prop}'`;
      if (dominio !== "TOTS") filter += ` AND domini='${dominio}'`;
      if (uso_dot !== "TOTS") filter += ` AND uso2='${uso_dot}'`;
      if (calificacion !== "TOTS")
        filter += ` AND ordenacion='${calificacion}'`;

      this.querySistemas(
        "Equipamiento (Sistema local) (PGOU98)",
        "slocal_equipamientos",
        filter
      );
    }
    if (tipo == "SGEC") {
      const div = document.getElementById("divOptionsQUERY_PGOU98");
			const ext_prop = div.querySelector("#selectEP").value;
			const dominio = div.querySelector("#selectDOMINIO").value;
			const uso_dot = div.querySelector("#selectUSO_DOT").value;
			const calificacion = div.querySelector("#selectCALIFIC").value;

      if (ext_prop !== "TOTS") filter += ` AND ext_prop='${ext_prop}'`;
      if (dominio !== "TOTS") filter += ` AND domini='${dominio}'`;
      if (uso_dot !== "TOTS") filter += ` AND uso2='${uso_dot}'`;
      if (calificacion !== "TOTS")
        filter += ` AND ordenacion='${calificacion}'`;

      this.querySistemas(
        "Equipamiento (Sistema General) (PGOU98)",
        "sgeneral_equipamientos",
        filter
      );
    }

    if (tipo == "SLEL") {
			const div = document.getElementById("divOptionsQUERY_PGOU98");
			const ext_prop = div.querySelector("#selectEP").value;
			const calificacion = div.querySelector("#selectCALIFIC").value;

      if (ext_prop !== "TOTS") filter += ` AND ext_prop='${ext_prop}'`;
      if (calificacion !== "TOTS")
        filter += ` AND ordenacion='${calificacion}'`;

      this.querySistemas(
        "Espacio libre (Sistema Local) (PGOU98)",
        "slocal_espacioslibres_publicos",
        filter
      );
    }

    if (tipo == "SGEL") {
			const div = document.getElementById("divOptionsQUERY_PGOU98");
			const ext_prop = div.querySelector("#selectEP").value;
			const calificacion = div.querySelector("#selectCALIFIC").value;

      if (ext_prop !== "TOTS") filter += ` AND ext_prop='${ext_prop}'`;
      if (calificacion !== "TOTS")
        filter += ` AND ordenacion='${calificacion}'`;

      this.querySistemas(
        "Espacio libre (Sistema General) (PGOU98)",
        "sgeneral_espacioslibres",
        filter
      );
    }

    if (tipo == "SLCI") {
			const div = document.getElementById("divOptionsQUERY_PGOU98");
			const ext_prop = div.querySelector("#selectEP").value;
			const dominio = div.querySelector("#selectDOMINIO").value;
			const uso_dot = div.querySelector("#selectUSO_DOT").value;

      if (ext_prop !== "TOTS") filter += ` AND ext_prop='${ext_prop}'`;
      if (dominio !== "TOTS") filter += ` AND domini='${dominio}'`;
      if (uso_dot !== "TOTS") filter += ` AND uso2='${uso_dot}'`;

      this.querySistemas(
        "Comunicaciones e Infraestructuras (Sistema Local) (PGOU98)",
        "slocal_comunicaciones_infraestructuras",
        filter
      );
    }

    if (tipo == "SGCI") {
      const div = document.getElementById("divOptionsQUERY_PGOU98");
			const ext_prop = div.querySelector("#selectEP").value;
			const dominio = div.querySelector("#selectDOMINIO").value;
			const uso_dot = div.querySelector("#selectUSO_DOT").value;

      if (ext_prop !== "TOTS") filter += ` AND ext_prop='${ext_prop}'`;
      if (dominio !== "TOTS") filter += ` AND domini='${dominio}'`;
      if (uso_dot !== "TOTS") filter += ` AND uso2='${uso_dot}'`;

      this.querySistemas(
        "Comunicaciones e Infraestructuras (Sistema General) (PGOU98)",
        "sgeneral_comunicaciones_infraestructuras",
        filter
      );
    }

    if (tipo == "CAT") {
      const div = document.getElementById("divOptionsQUERY_PGOU98");
			const proteccion = div.querySelector("#selectPROT").value;
			const declaracion = div.querySelector("#selectDEC").value;
			const categoria = div.querySelector("#selectCATEG").value;
      const tipologia = div.querySelector("#selectTIP").value;
			const clasificacion = div.querySelector("#selectCLAS").value;

      if (proteccion !== "TOTS") filter += ` AND proteccion='${proteccion}'`;
      if (declaracion !== "TOTS") filter += ` AND declaracion='${declaracion}'`;
      if (categoria !== "TOTS") filter += ` AND categoria='${categoria}'`;
      if (tipologia !== "TOTS") filter += ` AND tipologia='${tipologia}'`;
      if (clasificacion !== "TOTS")
        filter += ` AND clasificacion='${clasificacion}'`;

      this.queryCAT("Catalogos (PGOU98)", "catalogos", filter);
    }

    if (tipo == "CAT_ACT") {
      const div = document.getElementById("divOptionsQUERY_PGOU98");
			const proteccion = div.querySelector("#selectPROT").value;
			const categoria = div.querySelector("#selectCATEG").value;
      const us_acual = div.querySelector("#selectUS").value;

      if (proteccion !== "TOTS") filter += ` AND proteccion='${proteccion}'`;
      if (categoria !== "TOTS") filter += ` AND categoria='${categoria}'`;
      if (us_acual !== "TOTS") filter += ` AND us_actual='${us_acual}'`;

      this.queryCAT_ACT(
        "Catalogos (actualización)(PGOU98)",
        "catalogos_actualizacion",
        filter
      );
    }

    if (tipo == "CH") {
      const div = document.getElementById("divOptionsQUERY_PGOU98");
			const proteccion = div.querySelector("#selectCALIF").value;

      if (proteccion !== "TOTS") filter += ` AND codigo like '${proteccion}%'`;

      this.queryRSD(
        "Zonas centro historico (N/R) (PGOU98)",
        "zonas_centro_historico",
        filter
      );
    }

    if (tipo == "r") {
			const elemOptions = document.getElementById("divOptionsQUERY_PGOU98");
    	elemOptions.innerHTML = "";
			
      this.queryRSD(
        "Preservacion (r) (PGOU98)",
        "proteccion_arquitectonica",
        filter
      );
    }

		if (tipo == "UE") {
			const elemOptions = document.getElementById("divOptionsQUERY_PGOU98");
    	elemOptions.innerHTML = "";

      this.queryUE(
        "Unidad de ejecución (PGOU98)",
        "unidad_ejecucion",
        filter
      );
    }

		if (tipo == "API") {
			const elemOptions = document.getElementById("divOptionsQUERY_PGOU98");
    	elemOptions.innerHTML = "";

      this.queryRSD(
        "Area de planeamiento incorporado (PGOU98)",
        "api",
        filter
      );
    }

		if (tipo == "ARE") {
			const elemOptions = document.getElementById("divOptionsQUERY_PGOU98");
    	elemOptions.innerHTML = "";

      this.queryRSD(
        "Area de régimen especial (PGOU98)",
        "area_regimen_especial",
        filter
      );
    }

    if (tipo == "NADA") {
			const elemOptions = document.getElementById("divOptionsQUERY_PGOU98");
    	elemOptions.innerHTML = "";
      const elemQuery = document.getElementById("divQUERY_PGOU98");
    	elemQuery.innerHTML = "";
      
    }
  }

  /**
   * Establece las opciones de consulta según el tipo seleccionado.
   * @async
   * @returns {Promise<void>}
   */
  async setOptionsQUERY() {
    const elemTables = document.getElementById("selectTablesPGOU98");
    const tipo = elemTables.value;

    console.log(tipo);

    switch (tipo) {
      case "NADA":
        this.changeQUERY();
        break;
      case "RSD":
        await this.setOptionsRSD();
        break;
      case "RSD_NE":
        await this.setOptionsRSD_NE();
        break;
      case "SEC":
        await this.setOptionsSEC();
        break;
      case "TER":
        await this.setOptionsTER();
        break;
      case "SLEC":
      case "SGEC":
        await this.setOptionsEQ();
        break;
      case "SLEL":
      case "SGEL":
        await this.setOptionsEL();
        break;
      case "SLCI":
      case "SGCI":
        await this.setOptionsCI();
        break;
      case "CAT":
        await this.setOptionsCAT();
        break;
      case "CAT_ACT":
        await this.setOptionsCAT_ACT();
        break;
      case "CH":
        await this.setOptionsCH();
        break;
      case "r":
        this.changeQUERY();
        break;
      case "UE":
        this.changeQUERY();
        break;
      case "API":
        this.changeQUERY();
        break;
      case "ARE":
        this.changeQUERY();
        break;
    }

    this.changeQUERY();
  }

  /**
   * Establece las opciones de consulta para la zona de Centro Historico (CH).
   * 
   * @returns {Promise<void>}
   */
  async setOptionsCH() {
    const strOptionsCALIF = `
        <option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_CH">TOTS</option>
        <option value="R" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optR">(R) Preservació arquitectònica ambiental</option>
        <option value="N" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optN">(N) Preservació ambiental</option>
         
        `;

    const strSelectCALIF = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectCALIF" >
            ${strOptionsCALIF}
        </select>`;

    const html = `
		<TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
		
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>PROTECCIÓN</label></td>
						<td>${strSelectCALIF}</td>			
				</tr>  
				
		</TABLE>`;

    var elemOptions = document.getElementById("divOptionsQUERY_PGOU98");
    elemOptions.innerHTML = html;

    const self = this;
    const elem = elemOptions.querySelectorAll("select[name='select']");
    for (const select of elem) {
      select.onchange = function () {
        console.log("change option");
        self.changeQUERY();
      };
    }
  }

  /**
   * Establece las opciones de consulta para la zona de Catalogos Actualización (CAT_ACT).
   * 
   * @returns {Promise<void>}
   */
  async setOptionsCAT_ACT() {
    let strOptionsPROT = `<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_ORD">TOTS</option>`;
    const reader = new DataReader();
    let infoPROT = await reader.selectSQL(
      "SELECT proteccion from catalogos_act_proteccion order by proteccion"
    );
    infoPROT.forEach((item) => {
      strOptionsPROT += `<option value="${item.proteccion}" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="opt${item.proteccion}">${item.proteccion}</option>`;
    });

    let strOptionsCATEG = `<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_ORD">TOTS</option>`;
    let infoCATEG = await reader.selectSQL(
      "SELECT categoria from catalogos_act_categoria order by categoria"
    );
    infoCATEG.forEach((item) => {
      strOptionsCATEG += `<option value="${item.categoria}" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="opt${item.categoria}">${item.categoria}</option>`;
    });

    let infoUS = await reader.selectSQL(
      "SELECT us_actual from catalogos_actualizacion group by us_actual  order by us_actual"
    );
    let strOptionsUS = `<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_US">TOTS</option>`;

    infoUS.forEach((item) => {
      strOptionsUS += `
              <option value="${item.us_actual}" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="opt${item.us_actual}">
                ${item.us_actual}
              </option>`;
    });

    //console.log(infoPROT);
    //console.log(infoCATEG);

    const strSelectPROT = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectPROT" >
            ${strOptionsPROT}
        </select>`;
    const strSelectCATEG = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectCATEG" >
						${strOptionsCATEG}
				</select>`;
    const strSelectUS = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectUS" >
						${strOptionsUS}
				</select>`;

    const html = `
		<TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
		
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>PROTECCIÓN</label></td>
						<td>${strSelectPROT}</td>			
				</tr>  
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>CATEGORÍA</label></td>
						<td>${strSelectCATEG}</td>			
				</tr>  
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>USO ACTUAL</label></td>
						<td>${strSelectUS}</td>			
				</tr>  
		
		</TABLE>`;

    var elemOptions = document.getElementById("divOptionsQUERY_PGOU98");
    elemOptions.innerHTML = html;

    const self = this;
    const elem = elemOptions.querySelectorAll("select[name='select']");
    for (const select of elem) {
      select.onchange = function () {
        console.log("change option");
        self.changeQUERY();
      };
    }
  }

    /**
   * Establece las opciones de consulta para Catálogos (CAT).
   * @async
   * @returns {Promise<void>}
   */
  async setOptionsCAT() {
    let strOptionsPROT = `<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_ORD">TOTS</option>`;
    const reader = new DataReader();
    let infoPROT = await reader.selectSQL(
      "SELECT proteccio,descripcio from catalogo_proteccio order by proteccio"
    );
    infoPROT.forEach((item) => {
      strOptionsPROT += `<option value="${item.proteccio}" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="opt${item.proteccio}">${item.descripcio}</option>`;
    });

    let strOptionsDEC = `<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_ORD">TOTS</option>`;
    //reader = new DataReader();
    let infoDEC = await reader.selectSQL(
      "SELECT valor from catalogo_declaracio order by valor"
    );
    infoDEC.forEach((item) => {
      strOptionsDEC += `<option value="${item.valor}" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="opt${item.valor}">${item.valor}</option>`;
    });

    let strOptionsCATEG = `<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_ORD">TOTS</option>`;
    let infoCATEG = await reader.selectSQL(
      "SELECT valor from catalogo_categ order by valor"
    );
    infoCATEG.forEach((item) => {
      strOptionsCATEG += `<option value="${item.valor}" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="opt${item.valor}">${item.valor}</option>`;
    });

    let strOptionsTIP = `<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_ORD">TOTS</option>`;
    let infoTIP = await reader.selectSQL(
      "SELECT valor from catalogo_tipologia order by valor"
    );
    infoTIP.forEach((item) => {
      strOptionsTIP += `<option value="${item.valor}" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="opt${item.valor}">${item.valor}</option>`;
    });

    let strOptionsCLAS = `<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_ORD">TOTS</option>`;
    let infoCLAS = await reader.selectSQL(
      "SELECT valor from catalogo_clasificacion order by valor"
    );
    infoCLAS.forEach((item) => {
      strOptionsCLAS += `<option value="${item.valor}" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="opt${item.valor}">${item.valor}</option>`;
    });

    const strSelectPROT = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectPROT" >
            ${strOptionsPROT}
        </select>`;
    const strSelectDEC = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectDEC" >
						${strOptionsDEC}
				</select>`;
    const strSelectTIP = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectTIP" >
						${strOptionsTIP}
				</select>`;
    const strSelectCATEG = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectCATEG" >
						${strOptionsCATEG}
				</select>`;
    const strSelectCLAS = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectCLAS" >
						${strOptionsCLAS}
				</select>`;

    const html = `
		<TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
		
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>PROTECCIÓN</label></td>
						<td>${strSelectPROT}</td>			
				</tr>  
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>DECLARACIÓN</label></td>
						<td>${strSelectDEC}</td>			
				</tr>  
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>CATEGORÍA</label></td>
						<td>${strSelectCATEG}</td>			
				</tr>  
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>TIPOLOGÍA</label></td>
						<td>${strSelectTIP}</td>			
				</tr> 
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>CLASIFICACIÓN</label></td>
						<td>${strSelectCLAS}</td>			
				</tr>  	
		
		</TABLE>`;

    var elemOptions = document.getElementById("divOptionsQUERY_PGOU98");
    elemOptions.innerHTML = html;

    const self = this;
    const elem = elemOptions.querySelectorAll("select[name='select']");
    for (const select of elem) {
      select.onchange = function () {
        console.log("change option");
        self.changeQUERY();
      };
    }
  }

  /**
   * Establece las opciones de consulta para la zona de Comunicacion e infraestructuras (CI).
   * 
   * @returns {Promise<void>}
   */
  async setOptionsCI() {
    const strOptionsEP = `
		<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_EP">TOTS</option>
		<option value="E" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optE">EXISTENTE</option>
		<option value="P" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optP">PROPUESTO</option>
		`;

    const strOptionsDOMINIO = `
		<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_DM">TOTS</option>
		<option value="PÚBLIC" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optPBL">PÚBLICO</option>
		<option value="PRIVAT" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optPRV">PRIVADO</option>
		`;

    const strOptionsDOTACIONAL = `
		<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_DM">TOTS</option>
		<option value="TC" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTC">TC - COMUNICACIONES</option>
		<option value="IS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optIS">IS - INSTALACIONES Y SERVICIOS</option>
		`;

    const strSelectEP = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectEP" >
            ${strOptionsEP}
        </select>`;
    const strSelectDOMINIO = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectDOMINIO" >
						${strOptionsDOMINIO}
				</select>`;

    const strSelectDOTACIONAL = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectUSO_DOT" >
						${strOptionsDOTACIONAL}
				</select>`;

    const html = `
		<TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
		
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>EXISTENTE/PROPUESTO</label></td>
						<td>${strSelectEP}</td>			
				</tr>  
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>DOMINIO</label></td>
						<td>${strSelectDOMINIO}</td>			
				</tr>  
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>USO DOTACIONAL</label></td>
						<td>${strSelectDOTACIONAL}</td>			
				</tr>  
		
		</TABLE>`;

    var elemOptions = document.getElementById("divOptionsQUERY_PGOU98");
    elemOptions.innerHTML = html;

    const self = this;
    const elem = elemOptions.querySelectorAll("select[name='select']");
    for (const select of elem) {
      select.onchange = function () {
        console.log("change option");
        self.changeQUERY();
      };
    }
  }

  /**
   * Establece las opciones de consulta para la zona de Espacios Libres (EL).
   * 
   * @returns {Promise<void>}
   */
  async setOptionsEL() {
    const strOptionsEP = `
		<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_EP">TOTS</option>
		<option value="E" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optE">EXISTENT</option>
		<option value="P" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optP">PROPOST</option>
		`;

    let strOptionsCALIFIC = `<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_DOT">TOTS</option>`;
    const reader2 = new DataReader();
    let info2 = await reader2.selectSQL(
      "SELECT tipo,descripcion from calificacion_el_visor order by tipo"
    );
    info2.forEach((item) => {
      strOptionsCALIFIC += `<option value="${item.tipo}" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="opt${item.tipo}">${item.descripcion}</option>`;
    });

    const strSelectEP = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectEP" >
            ${strOptionsEP}
        </select>`;

    const strSelectCALIFIC = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectCALIFIC" >
		${strOptionsCALIFIC}
</select>`;

    const html = `
		<TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
		
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>EXISTENTE/PROPUESTO</label></td>
						<td>${strSelectEP}</td>			
				</tr>  
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>CALIFICACIÓN</label></td>
						<td>${strSelectCALIFIC}</td>			
				</tr>  
		
		</TABLE>`;

    var elemOptions = document.getElementById("divOptionsQUERY_PGOU98");
    elemOptions.innerHTML = html;

    const self = this;
    const elem = elemOptions.querySelectorAll("select[name='select']");
    for (const select of elem) {
      select.onchange = function () {
        console.log("change option");
        self.changeQUERY();
      };
    }
  }

  /**
   * Establece las opciones de consulta para la zona de Equipamientos (EQ).
   * 
   * @returns {Promise<void>}
   */
  async setOptionsEQ() {
    const strOptionsEP = `
		<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_EP">TOTS</option>
		<option value="E" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optE">EXISTENT</option>
		<option value="P" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optP">PROPOST</option>
		`;

    const strOptionsDOMINIO = `
		<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_DM">TOTS</option>
		<option value="PÚBLIC" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optPBL">PÚBLIC</option>
		<option value="PRIVAT" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optPRV">PRIVAT</option>
		`;

    let strOptionsDOTACIONAL = `<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_DOT">TOTS</option>`;
    const reader = new DataReader();
    let info = await reader.selectSQL(
      "SELECT uso,descripcion_uso from usodot_eq_visor order by descripcion_uso"
    );
    info.forEach((item) => {
      strOptionsDOTACIONAL += `<option value="${item.uso}" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="opt${item.uso}">${item.descripcion_uso}</option>`;
    });

    let strOptionsCALIFIC = `<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_DOT">TOTS</option>`;
    const reader2 = new DataReader();
    let info2 = await reader2.selectSQL(
      "SELECT codigo from calificacion_eq_visor order by codigo"
    );
    info2.forEach((item) => {
      strOptionsCALIFIC += `<option value="${item.codigo}" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="opt${item.codigo}">${item.codigo}</option>`;
    });

    const strSelectEP = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectEP" >
            ${strOptionsEP}
        </select>`;
    const strSelectDOMINIO = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectDOMINIO" >
						${strOptionsDOMINIO}
				</select>`;
    const strSelectDOTACIONAL = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectUSO_DOT" >
				${strOptionsDOTACIONAL}
		</select>`;
    const strSelectCALIFIC = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectCALIFIC" >
		${strOptionsCALIFIC}
</select>`;

    const html = `
		<TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
		
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>EXISTENTE/PROPUESTO</label></td>
						<td>${strSelectEP}</td>			
				</tr>  
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>DOMINIO</label></td>
						<td>${strSelectDOMINIO}</td>			
				</tr> 
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>USO DOTACIONAL</label></td>
						<td>${strSelectDOTACIONAL}</td>			
				</tr>  
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>CALIFICACIÓN</label></td>
						<td>${strSelectCALIFIC}</td>			
				</tr>  
		
		</TABLE>`;

    var elemOptions = document.getElementById("divOptionsQUERY_PGOU98");
    elemOptions.innerHTML = html;

    const self = this;
		const elem = elemOptions.querySelectorAll("select[name='select']");
		console.log("select:",elem);
    for (const select of elem) {
      select.onchange = function () {
        console.log("change option");
        self.changeQUERY();
      };
    }
  }

  /**
   * Establece las opciones de consulta para la zona de Terciario (TER).
   * 
   * @returns {Promise<void>}
   */
  async setOptionsTER() {
    let strOptionsTIPO = `<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_ORD">TOTS</option>`;
    const reader = new DataReader();
    let info = await reader.selectSQL(
      "SELECT tipo_zona from tipos_zonas where entidad='TER' order by tipo_zona"
    );
    info.forEach((item) => {
      strOptionsTIPO += `<option value="${item.tipo_zona}" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="opt${item.tipo_zona}">${item.tipo_zona}</option>`;
    });

    let strOptionsCALIF = `<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_CALIF">TOTS</option>`;
    const reader2 = new DataReader();
    info = await reader2.selectSQL(
      "SELECT codigo from calificacion_terciario_visor  order by codigo"
    );
    info.forEach((item) => {
      strOptionsCALIF += `<option value="${item.codigo}" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="opt${item.codigo}">${item.codigo}</option>`;
    });

    const strSelectTIPO = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectTIPO" >
            ${strOptionsTIPO}
        </select>`;
    const strSelectCALIF = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectCALIF" >
						${strOptionsCALIF}
				</select>`;

    const html = `
		<TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
		
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>TIPO CALIFICACIÓN</label></td>
						<td>${strSelectTIPO}</td>			
				</tr>  
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>CALIFICACIÓN</label></td>
						<td>${strSelectCALIF}</td>			
				</tr>  
		
		</TABLE>`;

    var elemOptions = document.getElementById("divOptionsQUERY_PGOU98");
    elemOptions.innerHTML = html;

    const self = this;
    const elem = elemOptions.querySelectorAll("select[name='select']");
    for (const select of elem) {
      select.onchange = function () {
        console.log("change option");
        self.changeQUERY();
      };
    }
  }

  async setOptionsSEC() {
    let strOptionsTIPO = `<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_ORD">TOTS</option>`;
    const reader = new DataReader();
    let info = await reader.selectSQL(
      "SELECT tipo_zona from tipos_zonas where entidad='SEC' order by tipo_zona"
    );
    info.forEach((item) => {
      strOptionsTIPO += `<option value="${item.tipo_zona}" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="opt${item.tipo_zona}">${item.tipo_zona}</option>`;
    });

    let strOptionsCALIF = `<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_CALIF">TOTS</option>`;
    const reader2 = new DataReader();
    info = await reader2.selectSQL(
      "SELECT codigo from calificacion_secundario_visor  order by codigo"
    );
    info.forEach((item) => {
      strOptionsCALIF += `<option value="${item.codigo}" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="opt${item.codigo}">${item.codigo}</option>`;
    });

    const strSelectTIPO = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectTIPO" >
            ${strOptionsTIPO}
        </select>`;
    const strSelectCALIF = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectCALIF" >
						${strOptionsCALIF}
				</select>`;

    const html = `
		<TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
		
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>TIPO CALIFICACIÓN</label></td>
						<td>${strSelectTIPO}</td>			
				</tr>  
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>CALIFICACIÓN</label></td>
						<td>${strSelectCALIF}</td>			
				</tr>  
		
		</TABLE>`;

    var elemOptions = document.getElementById("divOptionsQUERY_PGOU98");
    elemOptions.innerHTML = html;

    const self = this;
    const elem = elemOptions.querySelectorAll("select[name='select']");
    for (const select of elem) {
      select.onchange = function () {
        console.log("change option");
        self.changeQUERY();
      };
    }
  }

  async setOptionsRSD_NE() {
    let strOptionsTIPO = `<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_ORD">TOTS</option>`;
    const reader = new DataReader();
    let info = await reader.selectSQL(
      "SELECT tipo_zona from tipos_zonas where entidad='RES' order by tipo_zona"
    );
    info.forEach((item) => {
      strOptionsTIPO += `<option value="${item.tipo_zona}" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="opt${item.tipo_zona}">${item.tipo_zona}</option>`;
    });

    let strOptionsCALIF = `<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_CALIF">TOTS</option>`;
    const reader2 = new DataReader();
    info = await reader2.selectSQL(
      "SELECT codigo from calificacion_residencial_visor  order by codigo"
    );
    info.forEach((item) => {
      strOptionsCALIF += `<option value="${item.codigo}" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="opt${item.codigo}">${item.codigo}</option>`;
    });

    const strOptionsTIPO_ORD = `
            <option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_TIPO_ORD">TOTS</option>
            <option value="RES_AVMCV" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optRES_AVMCV">RESID. PLURIFAMILIAR AV-MC.V. (A.B.C)</option>
            <option value="RES_AVMCR" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optRES_AVMCR">RESID. PLURIFAMILIAR AV-MC.R. (D,H)</option>
            <option value="RES_P_RP" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optRES_P_RP">RESID. PLURIFAMILIAR RP. (E,G)</option>
            <option value="RES_U_RPA" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optRES_U_RPA">RESID. UNIFAMILIAR RP. A. (I)</option>
            <option value="RES_U_RPS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optRES_U_RPS">RESID. UNIFAMILIAR RP. S. (J)</option>
        
            `;

    const strSelectTIPO = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectTIPO" >
            ${strOptionsTIPO}
        </select>`;
    const strSelectTIPO_ORD = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectTIPO_ORD" >
						${strOptionsTIPO_ORD}
				</select>`;
    const strSelectCALIF = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectCALIF" >
						${strOptionsCALIF}
				</select>`;

    const html = `
		<TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
		
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>TIPO ORDENACIÓN</label></td>
						<td>${strSelectTIPO_ORD}</td>			
				</tr>  
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>TIPO CALIFICACIÓN</label></td>
						<td>${strSelectTIPO}</td>			
				</tr>  
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>CALIFICACIÓN</label></td>
						<td>${strSelectCALIF}</td>			
				</tr>  
		
		</TABLE>`;

    var elemOptions = document.getElementById("divOptionsQUERY_PGOU98");
    elemOptions.innerHTML = html;

    const self = this;
    const elem = elemOptions.querySelectorAll("select[name='select']");
    for (const select of elem) {
      select.onchange = function () {
        console.log("change option");
        self.changeQUERY();
      };
    }
  }

  async setOptionsRSD() {
    let strOptionsTIPO = `<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_ORD">TOTS</option>`;
    const reader = new DataReader();
    let info = await reader.selectSQL(
      "SELECT tipo_zona from tipos_zonas where entidad='RES' order by tipo_zona"
    );
    info.forEach((item) => {
      strOptionsTIPO += `<option value="${item.tipo_zona}" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="opt${item.tipo_zona}">${item.tipo_zona}</option>`;
    });

    let strOptionsCALIF = `<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_CALIF">TOTS</option>`;
    const reader2 = new DataReader();
    info = await reader2.selectSQL(
      "SELECT codigo from calificacion_residencial_visor  order by codigo"
    );
    info.forEach((item) => {
      strOptionsCALIF += `<option value="${item.codigo}" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="opt${item.codigo}">${item.codigo}</option>`;
    });

    const strOptionsTIPO_ORD = `
            <option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_TIPO_ORD">TOTS</option>
            <option value="RES_AVMCV" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optRES_AVMCV">RESID. PLURIFAMILIAR AV-MC.V. (A.B.C)</option>
            <option value="RES_AVMCR" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optRES_AVMCR">RESID. PLURIFAMILIAR AV-MC.R. (D,H)</option>
            <option value="RES_P_RP" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optRES_P_RP">RESID. PLURIFAMILIAR RP. (E,G)</option>
            <option value="RES_U_RPA" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optRES_U_RPA">RESID. UNIFAMILIAR RP. A. (I)</option>
            <option value="RES_U_RPS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optRES_U_RPS">RESID. UNIFAMILIAR RP. S. (J)</option>
        
            `;

    const html_altura = `
			<TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
					
				<thead style="background-color:#e1eefb">
					<tr>
							<th align="left"></td>            
							<th align="left" style="padding:3px;font-size:9.5px;font-family:Arial black;color:#000000">MAJOR O IGUAL</td>
							<th align="left" style="padding:3px;font-size:9.5px;font-family:Arial black;color:#000000">MENOR O IGUAL</td>                    
					</tr>
				</thead> 

				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>ALTURAS</label></td>
						<td><input type="text" style="width:96%" id="alturaFirst" name="select"></td>
						<td><input type="text" style="width:96%" id="alturaEnd" name="select"></td>
				</tr>
					
			</TABLE>`;

    const strSelectTIPO = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectTIPO" >
            ${strOptionsTIPO}
        </select>`;
    const strSelectTIPO_ORD = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectTIPO_ORD" >
						${strOptionsTIPO_ORD}
				</select>`;
    const strSelectCALIF = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectCALIF" >
						${strOptionsCALIF}
				</select>`;

    const html = `
		<TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
		
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>TIPO ORDENACIÓN</label></td>
						<td>${strSelectTIPO_ORD}</td>			
				</tr>  
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>TIPO CALIFICACIÓN</label></td>
						<td>${strSelectTIPO}</td>			
				</tr>  
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>CALIFICACIÓN</label></td>
						<td>${strSelectCALIF}</td>			
				</tr>  
		
		</TABLE>`;

    var elemOptions = document.getElementById("divOptionsQUERY_PGOU98");
    elemOptions.innerHTML = html + html_altura;

    const self = this;
   //const elem = elemOptions.querySelectorAll("select[name='select']");
    const elem = elemOptions.querySelectorAll("input[name='select'], select[name='select']");
    for (const select of elem) {
      select.onchange = function () {
        console.log("change option");
        self.changeQUERY();
      };
    }
  }
}
