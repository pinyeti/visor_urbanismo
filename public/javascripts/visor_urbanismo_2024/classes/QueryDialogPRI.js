/**
 * Clase para gestionar los diálogos de consulta relacionados con el Plan de Reforma Interior (PRI).
 * @memberof module:Frontend
 */
class QueryDialogPRI {
  /**
   * Crea una instancia de QueryDialogPRI.
   * @param {object} map - El objeto que representa el mapa.
   * @param {object} mapLayers - Las capas del mapa.
   * @param {object} toc - La tabla de contenido del mapa.
   * @param {object} sigduMap - El objeto SIGDU personalizado para el mapa.
   */
  constructor(map, mapLayers, toc, sigduMap) {
    this.sigduMap = sigduMap;
    this.toc = toc;
    this.map = map;
    this.mapLayers = mapLayers;
  }

  createHTML() {
    const divQUERY = `<div id="divQUERY_PRI" style='background-color:#f2f2f2;width:100%;height:60%'></div`;
    const divOptionsQUERY = `<div id="divOptionsQUERY_PRI" style='background-color:#f2f2f2;width:100%'></div`;
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

  async doActionRow(table, fid) {
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

  async formatQuery() {
    $(document).ready(function () {
      $("#table_queryPRI")
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

      //$("#table_queryPRI td").css("padding", "5px");
    });
  }

  async queryCP(name, table, filter) {
    const reader = new DataReader();
    const info_geojson = await reader.readDataFeature(table, filter);

    let html_QUERY_HEAD = `
          <button style="padding-top:4px;padding-bottom:4px;" class="ui-button ui-widget ui-corner-all" title="Descàrrega en format geojson"  id="download_pri"><i class="fa fa-download"></i></button>
          <button style="padding-top:4px;padding-bottom:4px;" class="ui-button ui-widget ui-corner-all" title="Afegeix consulta a taula de contingut" id="add_layer_toc_pri"><i class="fa fa-plus-circle"></i></button>
    
          <TABLE id="table_queryPRI"   class="stripe row-border order-column" style="padding:3px;font-size:8pt;font-family:Arial;width:100%">
         
          <thead style="background-color:#e1eefb;">
            <tr>
						  <th>FID</td>
							<th>CODIGO</td> 
              <th>DENOMINACIÓN</th>          
            </tr>
          </thead>`;

    let html_QUERY_ROWS = "<tbody>";

    if (info_geojson.features != null)
      for (var n = 0; n < info_geojson.features.length; n++) {
        html_QUERY_ROWS =
          html_QUERY_ROWS +
          `
          <tr id="queryCP_PRI_${info_geojson.features[n].properties.fid}" 
            data-table="${table}" 
            data-fid="${info_geojson.features[n].properties.fid}"
            data-accion="doActionRowPRI">

            <td>${info_geojson.features[n].properties.fid}</td>
            <td>${info_geojson.features[n].properties.codigo}</td>   
            <td>${info_geojson.features[n].properties.denominacion}</td>     
                        
          </tr>`;
      }

    html_QUERY_ROWS = html_QUERY_ROWS + "</tbody>";

    const html_QUERY = html_QUERY_HEAD + html_QUERY_ROWS + `</TABLE>`;

    this.formatQuery();

    var elem = document.getElementById("divQUERY_PRI");
    elem.style.height = "70%";
    elem.innerHTML = html_QUERY;

    const self = this;

    var elementos = document.querySelectorAll(
      'tr[data-accion="doActionRowPRI"]'
    );
    for (var i = 0; i < elementos.length; i++) {
      const tr = elementos[i];

      if (tr) {
        tr.addEventListener("click", async function () {
          var fid = tr.getAttribute("data-fid");
          var table = tr.getAttribute("data-table");

          self.doActionRow(table, fid);
        });
      }
    }

    document
      .getElementById("download_pri")
      .addEventListener("click", function () {
        self.download(name, info_geojson);
      });
    document
      .getElementById("add_layer_toc_pri")
      .addEventListener("click", function () {
        self.addLayerTOC(name, info_geojson, filter);
      });
  }


  async queryUE(name, table, filter) {
    const reader = new DataReader();
    const info_geojson = await reader.readDataFeature(table, filter);

    let html_QUERY_HEAD = `
          <button style="padding-top:4px;padding-bottom:4px;" class="ui-button ui-widget ui-corner-all" title="Descàrrega en format geojson"  id="download_pri"><i class="fa fa-download"></i></button>
          <button style="padding-top:4px;padding-bottom:4px;" class="ui-button ui-widget ui-corner-all" title="Afegeix consulta a taula de contingut" id="add_layer_toc_pri"><i class="fa fa-plus-circle"></i></button>
    
          <TABLE id="table_queryPRI"   class="stripe row-border order-column" style="padding:3px;font-size:8pt;font-family:Arial;width:100%">
         
          <thead style="background-color:#e1eefb;">
            <tr>
						  <th>FID</td>
							<th>CODIGO</td> 
              <th>DENOMINACIÓN</th>          
            </tr>
          </thead>`;

    let html_QUERY_ROWS = "<tbody>";

    if (info_geojson.features != null)
      for (var n = 0; n < info_geojson.features.length; n++) {
        html_QUERY_ROWS =
          html_QUERY_ROWS +
          `
          <tr id="queryUE_PRI_${info_geojson.features[n].properties.fid}" 
            data-table="${table}" 
            data-fid="${info_geojson.features[n].properties.fid}"
            data-accion="doActionRowPRI">

            <td>${info_geojson.features[n].properties.fid}</td>
            <td>${info_geojson.features[n].properties.codigo}</td>   
            <td>${info_geojson.features[n].properties.denominacio}</td>     
                        
          </tr>`;
      }

    html_QUERY_ROWS = html_QUERY_ROWS + "</tbody>";

    const html_QUERY = html_QUERY_HEAD + html_QUERY_ROWS + `</TABLE>`;

    this.formatQuery();

    var elem = document.getElementById("divQUERY_PRI");
    elem.style.height = "70%";
    elem.innerHTML = html_QUERY;

    const self = this;

    var elementos = document.querySelectorAll(
      'tr[data-accion="doActionRowPRI"]'
    );
    for (var i = 0; i < elementos.length; i++) {
      const tr = elementos[i];

      if (tr) {
        tr.addEventListener("click", async function () {
          var fid = tr.getAttribute("data-fid");
          var table = tr.getAttribute("data-table");

          self.doActionRow(table, fid);
        });
      }
    }

    document
      .getElementById("download_pri")
      .addEventListener("click", function () {
        self.download(name, info_geojson);
      });
    document
      .getElementById("add_layer_toc_pri")
      .addEventListener("click", function () {
        self.addLayerTOC(name, info_geojson, filter);
      });
  }

  async queryCAT(name, table, filter) {
    const reader = new DataReader();
    const info_geojson = await reader.readDataFeature(table, filter);

    let html_QUERY_HEAD = `
          <button style="padding-top:2px;padding-bottom:4px;" class="ui-button ui-widget ui-corner-all" title="Descàrrega en format geojson"  id="download_pri"><i class="fa fa-download"></i></button>
          <button style="padding-top:2px;padding-bottom:4px;" class="ui-button ui-widget ui-corner-all" title="Afegeix consulta a taula de contingut" id="add_layer_toc_pri"><i class="fa fa-plus-circle"></i></button>
    
          <TABLE id="table_queryPRI"   class="stripe row-border order-column" style="padding:2px;font-size:8pt;font-family:Arial;width:100%">
         
          <thead style="background-color:#e1eefb;">
            <tr>
              <th>FID</td>
              <th>CODI</td>   
              <th>DENOMINACIÓ</td>    
              <th>PRoTECCIÓ</td> 
              <th>TIPOLOGIA</td>   
            </tr>
          </thead>`;

    let html_QUERY_ROWS = "<tbody>";

    if (info_geojson.features != null)
      for (var n = 0; n < info_geojson.features.length; n++) {
        let infoPROT = await reader.selectSQL(
          `SELECT descripcion from pri_catalogo_proteccion where nivel='${info_geojson.features[n].properties.proteccion}'`
        );
        let infoTIP = await reader.selectSQL(
          `SELECT sigla,descripcion from pri_catalogos_tipologias where sigla='${info_geojson.features[n].properties.tipologia}'`
        );

        html_QUERY_ROWS =
          html_QUERY_ROWS +
          `
          <tr id="queryCAT_PRI_${info_geojson.features[n].properties.fid}" 
            data-table="${table}" 
            data-fid="${info_geojson.features[n].properties.fid}"
            data-accion="doActionRowPRI">
            
            <td>${info_geojson.features[n].properties.fid}</td>
            <td>${info_geojson.features[n].properties.codigo}</td>    
            <td>${info_geojson.features[n].properties.denominacion}</td>    
            <td>${infoPROT[0].descripcion}</td>  
            <td>${infoTIP[0].sigla} - ${
            infoTIP[0].descripcion.charAt(0).toUpperCase() +
            infoTIP[0].descripcion.slice(1).toLowerCase()
            }</td>    			             
          </tr>`;
      }

    html_QUERY_ROWS = html_QUERY_ROWS + "</tbody>";

    const html_QUERY = html_QUERY_HEAD + html_QUERY_ROWS + `</TABLE>`;

    this.formatQuery();

    var elem = document.getElementById("divQUERY_PRI");
    elem.style.height = "70%";
    elem.innerHTML = html_QUERY;

    const self = this;

    var elementos = document.querySelectorAll(
      'tr[data-accion="doActionRowPRI"]'
    );
    for (var i = 0; i < elementos.length; i++) {
      const tr = elementos[i];

      if (tr) {
        tr.addEventListener("click", async function () {
          var fid = tr.getAttribute("data-fid");
          var table = tr.getAttribute("data-table");

          self.doActionRow(table, fid);
        });
      }
    }

    document
      .getElementById("download_pri")
      .addEventListener("click", function () {
        self.download(name, info_geojson);
      });
    document
      .getElementById("add_layer_toc_pri")
      .addEventListener("click", function () {
        self.addLayerTOC(name, info_geojson, filter);
      });
  }

  async queryEL(name, table, filter) {
    const reader = new DataReader();
    const info_geojson = await reader.readDataFeature(table, filter);

    let html_QUERY_HEAD = `
          <button style="padding-top:2px;padding-bottom:4px;" class="ui-button ui-widget ui-corner-all" title="Descàrrega en format geojson"  id="download_pri"><i class="fa fa-download"></i></button>
          <button style="padding-top:2px;padding-bottom:4px;" class="ui-button ui-widget ui-corner-all" title="Afegeix consulta a taula de contingut" id="add_layer_toc_pri"><i class="fa fa-plus-circle"></i></button>
    
          <TABLE id="table_queryPRI"   class="stripe row-border order-column" style="padding:2px;font-size:8pt;font-family:Arial;width:100%">
         
          <thead style="background-color:#e1eefb;">
            <tr>
              <th>FID</td>
              <th>CODI</td>    
              <th>SUPERFICIE</td> 
              <th>CLASE</td>      
            </tr>
          </thead>`;

    let html_QUERY_ROWS = "<tbody>";

    if (info_geojson.features != null)
      for (var n = 0; n < info_geojson.features.length; n++) {
        var clase = "-";
        if (info_geojson.features[n].properties.tipo_sistema == "SL")
          clase = "S. LOCAL";
        if (info_geojson.features[n].properties.tipo_sistema == "SG")
          clase = "S. GENERAL";
        html_QUERY_ROWS =
          html_QUERY_ROWS +
          `
          <tr id="queryEL_PRI_${info_geojson.features[n].properties.fid}" 
            data-table="${table}" 
            data-fid="${info_geojson.features[n].properties.fid}"
            data-accion="doActionRowPRI">

            <td>${info_geojson.features[n].properties.fid}</td>
            <td>${info_geojson.features[n].properties.codigo}</td>    
            <td>${info_geojson.features[n].properties.superficie_oficial}</td>  
            <td>${clase}</td>       			             
          </tr>`;
      }

    html_QUERY_ROWS = html_QUERY_ROWS + "</tbody>";

    const html_QUERY = html_QUERY_HEAD + html_QUERY_ROWS + `</TABLE>`;

    this.formatQuery();

    var elem = document.getElementById("divQUERY_PRI");
    elem.style.height = "70%";
    elem.innerHTML = html_QUERY;

    const self = this;

    var elementos = document.querySelectorAll(
      'tr[data-accion="doActionRowPRI"]'
    );
    for (var i = 0; i < elementos.length; i++) {
      const tr = elementos[i];

      if (tr) {
        tr.addEventListener("click", async function () {
          var fid = tr.getAttribute("data-fid");
          var table = tr.getAttribute("data-table");

          self.doActionRow(table, fid);
        });
      }
    }

    document
      .getElementById("download_pri")
      .addEventListener("click", function () {
        self.download(name, info_geojson);
      });
    document
      .getElementById("add_layer_toc_pri")
      .addEventListener("click", function () {
        self.addLayerTOC(name, info_geojson, filter);
      });
  }

  async queryEQ(name, table, filter) {
    const reader = new DataReader();
    const info_geojson = await reader.readDataFeature(table, filter);

    let html_QUERY_HEAD = `
          <button style="padding-top:2px;padding-bottom:4px;" class="ui-button ui-widget ui-corner-all" title="Descàrrega en format geojson"  id="download_pri"><i class="fa fa-download"></i></button>
          <button style="padding-top:2px;padding-bottom:4px;" class="ui-button ui-widget ui-corner-all" title="Afegeix consulta a taula de contingut" id="add_layer_toc_pri"><i class="fa fa-plus-circle"></i></button>
    
          <TABLE id="table_queryPRI"   class="stripe row-border order-column" style="padding:2px;font-size:8pt;font-family:Arial;width:100%">
         
          <thead style="background-color:#e1eefb;">
            <tr>
              <th>FID</td>
              <th>CODI</td>    
              <th>DENOMINACIÓ</td> 
              <th>SUPERFICIE</td> 
              <th>DOTACION</td> 
              <th>DOMINI</td> 
              <th>CLASE</td>        
            </tr>
          </thead>`;

    let html_QUERY_ROWS = "<tbody>";

    if (info_geojson.features != null)
      for (var n = 0; n < info_geojson.features.length; n++) {
        var dominio = "-";
        var clase = "-";
        if (info_geojson.features[n].properties.dominio == "PBL")
          dominio = "PÚBLIC";
        if (info_geojson.features[n].properties.dominio == "PRV")
          dominio = "PRIVAT";
        if (info_geojson.features[n].properties.tipo_sistema == "SL")
          clase = "S. LOCAL";
        if (info_geojson.features[n].properties.tipo_sistema == "SG")
          clase = "S. GENERAL";
        html_QUERY_ROWS =
          html_QUERY_ROWS +
          `
          <tr id="queryEQ_PRI_${info_geojson.features[n].properties.fid}" 
            data-table="${table}" 
            data-fid="${info_geojson.features[n].properties.fid}"
            data-accion="doActionRowPRI">

            <td>${info_geojson.features[n].properties.fid}</td>
            <td>${info_geojson.features[n].properties.codigo}</td>    
            <td>${info_geojson.features[n].properties.denominacion}</td>   
            <td>${info_geojson.features[n].properties.superficie}</td>  
            <td>${info_geojson.features[n].properties.uso_dotacional}</td>  
            <td>${dominio}</td>   
            <td>${clase}</td>    			             
          </tr>`;
      }

    html_QUERY_ROWS = html_QUERY_ROWS + "</tbody>";

    const html_QUERY = html_QUERY_HEAD + html_QUERY_ROWS + `</TABLE>`;

    this.formatQuery();

    var elem = document.getElementById("divQUERY_PRI");
    elem.style.height = "70%";
    elem.innerHTML = html_QUERY;

    const self = this;

    var elementos = document.querySelectorAll(
      'tr[data-accion="doActionRowPRI"]'
    );
    for (var i = 0; i < elementos.length; i++) {
      const tr = elementos[i];

      if (tr) {
        tr.addEventListener("click", async function () {
          var fid = tr.getAttribute("data-fid");
          var table = tr.getAttribute("data-table");

          self.doActionRow(table, fid);
        });
      }
    }

    document
      .getElementById("download_pri")
      .addEventListener("click", function () {
        self.download(name, info_geojson);
      });
    document
      .getElementById("add_layer_toc_pri")
      .addEventListener("click", function () {
        self.addLayerTOC(name, info_geojson, filter);
      });
  }

  async queryZO_SU(name, table, filter) {
    const reader = new DataReader();
    const info_geojson = await reader.readDataFeature(table, filter);

    let html_QUERY_HEAD = `
          <button style="padding-top:4px;padding-bottom:4px;" class="ui-button ui-widget ui-corner-all" title="Descàrrega en format geojson"  id="download_pri"><i class="fa fa-download"></i></button>
          <button style="padding-top:4px;padding-bottom:4px;" class="ui-button ui-widget ui-corner-all" title="Afegeix consulta a taula de contingut" id="add_layer_toc_pri"><i class="fa fa-plus-circle"></i></button>
    
          <TABLE id="table_queryPRI"   class="stripe row-border order-column" style="padding:3px;font-size:8pt;font-family:Arial;width:100%">
         
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
          `
          <tr id="queryZO_PRI_${info_geojson.features[n].properties.fid}" 
            data-table="${table}" 
            data-fid="${info_geojson.features[n].properties.fid}"
            data-accion="doActionRowPRI">
        
            <td>${info_geojson.features[n].properties.fid}</td>
            <td>${info_geojson.features[n].properties.codigo}</td>    
                        
          </tr>`;
      }

    html_QUERY_ROWS = html_QUERY_ROWS + "</tbody>";

    const html_QUERY = html_QUERY_HEAD + html_QUERY_ROWS + `</TABLE>`;

    this.formatQuery();

    var elem = document.getElementById("divQUERY_PRI");
    elem.style.height = "70%";
    elem.innerHTML = html_QUERY;

    const self = this;

    var elementos = document.querySelectorAll(
      'tr[data-accion="doActionRowPRI"]'
    );
    for (var i = 0; i < elementos.length; i++) {
      const tr = elementos[i];

      if (tr) {
        tr.addEventListener("click", async function () {
          var fid = tr.getAttribute("data-fid");
          var table = tr.getAttribute("data-table");

          self.doActionRow(table, fid);
        });
      }
    }

    document
      .getElementById("download_pri")
      .addEventListener("click", function () {
        self.download(name, info_geojson);
      });
    document
      .getElementById("add_layer_toc_pri")
      .addEventListener("click", function () {
        self.addLayerTOC(name, info_geojson, filter);
      });
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

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

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

  download(name, geojson) {
    const jsonData = JSON.stringify(geojson);
    var a = document.createElement("a");
    var file = new Blob([jsonData], { type: "text/plain" });
    a.href = URL.createObjectURL(file);
    a.download = name + ".geojson";
    a.click();
  }

  createSelectTABLE() {
    const strOptionsTables = `
        <option value="NADA" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optNADA">-</option>
				<optgroup label="Zonas ordinarias del Suelo Urbano" style='background-color:white;font-size:7.5pt.5pt;font-family:Arial Black;color:black'>
						<option value="REM" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optREM">(REM) Zona Residencial entre medianeras</option>   
						<option value="VEA" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optVEA">(VEA) Zona Vivienda edificación abierta</option>             
						<option value="VT" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optVT">(VT) Zona Vivienda Tradicional</option>            
						<option value="VUA" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optVUA">(VUA) Zona Vivienda Unifamiliar aislada</option>     
            <option value="VA" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optVUA">(VA) Zona Vivienda Adosada</option> 
            <option value="CO" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optVUA">(CO) Zona Comerial / Servicios</option>     
            <option value="T" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optVUA">(T) Zona Turistca</option>      
            <option value="TH" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optVUA">(TH) Zona Turistica-Hotelera</option>                               
				</optgroup>   
        <optgroup label="Sistemas" style='background-color:white;font-size:7.5pt.5pt;font-family:Arial Black;color:black'>
						<option value="EQ" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optEQ">(EQ) Equipamientos comunitarios</option>            
						<option value="EL" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optEL">(EL) Espacios libres públicos</option>                               				
        </optgroup>
				<optgroup label="Protección i Preservación" style='background-color:white;font-size:7.5pt.5pt;font-family:Arial Black;color:black'>
						<option value="CAT" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optCAT">(CAT) Catalogos</option>                    
				</optgroup>  
				<optgroup label="Ambitos de gestión" style='background-color:white;font-size:7.5pt.5pt;font-family:Arial Black;color:black'>
						<option value="UE" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optUE">(UE) Unidad de ejecución</option>
						<option value="CP" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optAPI">(CP) Corredor Paisajistico</option>
				</optgroup>    
        `;

    const strSelectTABLE = `    
          <select style='background-color:#5b9ec1;color:white;padding:2px;font-size:9pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="selectTablesPRI" id="selectTablesPRI" >
          
              ${strOptionsTables}
          </select>
          `;

    return strSelectTABLE;
  }

  changeQUERY() {
    let tipo;
    let filter = "fid>0";
    const elem = document.getElementById("selectTablesPRI");

    if (elem != null) {
      tipo = elem.value;
    }

    if (tipo == "NADA") {
      const elemOptions = document.getElementById("divOptionsQUERY_PRI");
      elemOptions.innerHTML = "";
      const elemQuery = document.getElementById("divQUERY_PRI");
      elemQuery.innerHTML = "";
    }

    if (tipo == "REM") {
      const div = document.getElementById("divOptionsQUERY_PRI");
      const calificacion = div.querySelector("#selectCALIF").value;
      const alturaFirst = div.querySelector("#alturaFirst").value;
      const alturaEnd = div.querySelector("#alturaEnd").value;

      if (calificacion !== "TOTS")
        filter += ` AND codigo like '${calificacion}%'`;
      if (alturaFirst != "") filter += ` AND num_plantas>='${alturaFirst}'`;
      if (alturaEnd != "") filter += ` AND num_plantas<='${alturaEnd}'`;

      this.queryZO_SU(
        "Residencial entre medianeras (PRI)",
        "pri_zona_residencial_entre_mitgeres",
        filter
      );
    }

    if (tipo == "VEA") {
      const div = document.getElementById("divOptionsQUERY_PRI");
      const calificacion = div.querySelector("#selectCALIF").value;
      const alturaFirst = div.querySelector("#alturaFirst").value;
      const alturaEnd = div.querySelector("#alturaEnd").value;

      if (calificacion !== "TOTS")
        filter += ` AND codigo like '${calificacion}%'`;
      if (alturaFirst != "") filter += ` AND num_plantas>='${alturaFirst}'`;
      if (alturaEnd != "") filter += ` AND num_plantas<='${alturaEnd}'`;

      this.queryZO_SU(
        "Vivienda edificación abierta (PRI)",
        "pri_zona_habitatge_edificacio_oberta",
        filter
      );
    }

    if (tipo == "VT") {
      const div = document.getElementById("divOptionsQUERY_PRI");
      const calificacion = div.querySelector("#selectCALIF").value;
      const alturaFirst = div.querySelector("#alturaFirst").value;
      const alturaEnd = div.querySelector("#alturaEnd").value;

      if (calificacion !== "TOTS")
        filter += ` AND codigo like '${calificacion}%'`;
      if (alturaFirst != "") filter += ` AND num_plantas>='${alturaFirst}'`;
      if (alturaEnd != "") filter += ` AND num_plantas<='${alturaEnd}'`;

      this.queryZO_SU(
        "Vivienda tradicional (PRI)",
        "pri_zona_habitatge_tradicional",
        filter
      );
    }

    if (tipo == "VUA") {
      const div = document.getElementById("divOptionsQUERY_PRI");
      const calificacion = div.querySelector("#selectCALIF").value;
      const alturaFirst = div.querySelector("#alturaFirst").value;
      const alturaEnd = div.querySelector("#alturaEnd").value;

      if (calificacion !== "TOTS")
        filter += ` AND codigo like '${calificacion}%'`;
      if (alturaFirst != "") filter += ` AND num_plantas>='${alturaFirst}'`;
      if (alturaEnd != "") filter += ` AND num_plantas<='${alturaEnd}'`;

      this.queryZO_SU(
        "Vivienda unifamiliar aislada (PRI)",
        "pri_zona_habitatge_unifamiliar_aillat",
        filter
      );
    }

    if (tipo == "VA") {
      const div = document.getElementById("divOptionsQUERY_PRI");
      const calificacion = div.querySelector("#selectCALIF").value;
      const alturaFirst = div.querySelector("#alturaFirst").value;
      const alturaEnd = div.querySelector("#alturaEnd").value;

      if (calificacion !== "TOTS")
        filter += ` AND codigo like '${calificacion}%'`;
      if (alturaFirst != "") filter += ` AND num_plantas>='${alturaFirst}'`;
      if (alturaEnd != "") filter += ` AND num_plantas<='${alturaEnd}'`;

      this.queryZO_SU(
        "Vivienda adosada (PRI)",
        "pri_zona_habitatges_adossats",
        filter
      );
    }

    if (tipo == "CO") {
      const div = document.getElementById("divOptionsQUERY_PRI");
      const calificacion = div.querySelector("#selectCALIF").value;
      const alturaFirst = div.querySelector("#alturaFirst").value;
      const alturaEnd = div.querySelector("#alturaEnd").value;

      if (calificacion !== "TOTS")
        filter += ` AND codigo like '${calificacion}%'`;
      if (alturaFirst != "") filter += ` AND num_plantas>='${alturaFirst}'`;
      if (alturaEnd != "") filter += ` AND num_plantas<='${alturaEnd}'`;

      this.queryZO_SU(
        "Comercial Servicios (PRI)",
        "pri_zona_comercial_serveis",
        filter
      );
    }

    if (tipo == "T") {
      const div = document.getElementById("divOptionsQUERY_PRI");
      const calificacion = div.querySelector("#selectCALIF").value;
      const alturaFirst = div.querySelector("#alturaFirst").value;
      const alturaEnd = div.querySelector("#alturaEnd").value;

      if (calificacion !== "TOTS")
        filter += ` AND codigo like '${calificacion}%'`;
      if (alturaFirst != "") filter += ` AND num_plantas>='${alturaFirst}'`;
      if (alturaEnd != "") filter += ` AND num_plantas<='${alturaEnd}'`;

      this.queryZO_SU("Turistico (PRI)", "pri_zona_turistica", filter);
    }

    if (tipo == "TH") {
      const div = document.getElementById("divOptionsQUERY_PRI");
      const calificacion = div.querySelector("#selectCALIF").value;
      const alturaFirst = div.querySelector("#alturaFirst").value;
      const alturaEnd = div.querySelector("#alturaEnd").value;

      if (calificacion !== "TOTS")
        filter += ` AND codigo like '${calificacion}%'`;
      if (alturaFirst != "") filter += ` AND num_plantas>='${alturaFirst}'`;
      if (alturaEnd != "") filter += ` AND num_plantas<='${alturaEnd}'`;

      this.queryZO_SU(
        "Turistico Hotelero (PRI)",
        "pri_zona_turistica_hotelera",
        filter
      );
    }

    if (tipo == "EQ") {
      const div = document.getElementById("divOptionsQUERY_PRI");
      const ext_prop = div.querySelector("#selectEP").value;
      const dominio = div.querySelector("#selectDOM").value;
      const uso_dot = div.querySelector("#selectDOT").value;
      const clase = div.querySelector("#selectCLAS").value;

      if (ext_prop !== "TOTS") filter += ` AND estado_actual='${ext_prop}'`;
      if (dominio !== "TOTS") filter += ` AND dominio='${dominio}'`;
      if (uso_dot !== "TOTS") filter += ` AND uso_dotacional='${uso_dot}'`;
      if (clase !== "TOTS") filter += ` AND tipo_sistema='${clase}'`;

      this.queryEQ("Equipamientos (PRI)", "pri_equipamientos", filter);
    }

    if (tipo == "EL") {
      const div = document.getElementById("divOptionsQUERY_PRI");
      const ext_prop = div.querySelector("#selectEP").value;
      const clase = div.querySelector("#selectCLAS").value;

      if (ext_prop !== "TOTS") filter += ` AND estado_actual='${ext_prop}'`;
      if (clase !== "TOTS") filter += ` AND tipo_sistema='${clase}'`;

      this.queryEL(
        "Espacio libre (PRI)",
        "pri_sistema_espais_lliures_publics",
        filter
      );
    }

    if (tipo == "CAT") {
      const div = document.getElementById("divOptionsQUERY_PRI");
      const prot = div.querySelector("#selectPROT").value;
      const tipologia = div.querySelector("#selectTIP").value;

      if (prot !== "TOTS") filter += ` AND proteccion='${prot}'`;
      if (tipologia !== "TOTS") filter += ` AND tipologia='${tipologia}'`;

      this.queryCAT("Catalogos (PRI)", "pri_catalogos", filter);
    }

    if (tipo == "UE") {
      this.queryUE("Unidad de actuación (PRI)", "pri_unitat_actuacio", filter);
    }

    if (tipo == "CP") {
      this.queryCP("Corredor paisajistico (PRI)", "pri_corredor_paisajistic", filter);
    }
  }

  async setOptionsQUERY() {
    const elemTables = document.getElementById("selectTablesPRI");
    const tipo = elemTables.value;

    console.log(tipo);

    switch (tipo) {
      case "NADA":
        this.changeQUERY();
        break;
      case "REM":
        await this.setOptionsZO_SU("pri_zona_residencial_entre_mitgeres");
        break;
      case "VEA":
        await this.setOptionsZO_SU("pri_zona_habitatge_edificacio_oberta");
        break;
      case "VT":
        await this.setOptionsZO_SU("pri_zona_habitatge_tradicional");
        break;
      case "VUA":
        await this.setOptionsZO_SU("pri_zona_habitatge_unifamiliar_aillat");
        break;
      case "VA":
        await this.setOptionsZO_SU("pri_zona_habitatges_adossats");
        break;
      case "CO":
        await this.setOptionsZO_SU("pri_zona_comercial_serveis");
        break;
      case "T":
        await this.setOptionsZO_SU("pri_zona_turistica");
        break;
      case "TH":
        await this.setOptionsZO_SU("pri_zona_turistica_hotelera");
        break;
      case "EQ":
        await this.setOptionsEQ();
        break;
      case "EL":
        await this.setOptionsEL();
        break;
      case "CAT":
        await this.setOptionsCAT();
        break;
      case "UE":
        this.changeQUERY();
        break;
      case "CP":
        this.changeQUERY();
        break;
    }
    this.changeQUERY();
  }

  async setOptionsCAT() {
    let strOptionsPROT = `<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_ORD">TOTS</option>`;
    const reader = new DataReader();
    let infoPROT = await reader.selectSQL(
      `SELECT nivel,descripcion from pri_catalogo_proteccion order by nivel`
    );
    infoPROT.forEach((item) => {
      strOptionsPROT += `<option value="${item.nivel}" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="opt${item.nivel}">${item.descripcion}</option>`;
    });

    let strOptionsTIP = `<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_ORD">TOTS</option>`;
    let infoTIP = await reader.selectSQL(
      `SELECT sigla,descripcion from pri_catalogos_tipologias order by sigla`
    );
    infoTIP.forEach((item) => {
      strOptionsTIP += `<option value="${
        item.sigla
      }" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="opt${
        item.sigla
      }">${item.sigla} - ${
        item.descripcion.charAt(0).toUpperCase() +
        item.descripcion.slice(1).toLowerCase()
      }</option>`;
    });

    const strSelectPROT = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectPROT" >
            ${strOptionsPROT}
        </select>`;
    const strSelectTIP = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectTIP" >
            ${strOptionsTIP}
        </select>`;

    const html = `
		<TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
		
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>PROTECCIÓN</label></td>
						<td>${strSelectPROT}</td>			
				</tr>  
        <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>TIPOLOGIA</label></td>
						<td>${strSelectTIP}</td>			
				</tr>  
			
		</TABLE>`;

    var elemOptions = document.getElementById("divOptionsQUERY_PRI");
    elemOptions.innerHTML = html;

    const self = this;
    const elem = elemOptions.querySelectorAll("select[name='select']");
    for (const select of elem) {
      select.onchange = function () {
        self.changeQUERY();
      };
    }
  }

  async setOptionsEL() {
    const strOptionsEP = `
      <option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_EP">TOTS</option>
      <option value="E" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optE">EXISTENT</option>
      <option value="P" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optP">PROPOST</option>
      `;

    const strOptionsCLAS = `
      <option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_DM">TOTS</option>
      <option value="SL" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optSL">S. LOCAL</option>
      <option value="SG" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optSG">S. GENERAL</option>
      `;

    const strSelectEP = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectEP" >
            ${strOptionsEP}
        </select>`;
    const strSelectCLAS = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectCLAS" >
            ${strOptionsCLAS}
        </select>`;

    const html = `
		<TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
		
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>EXISTENTE/PROPUESTO</label></td>
						<td>${strSelectEP}</td>			
				</tr>  
        <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
            <td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>CLASE</label></td>
            <td>${strSelectCLAS}</td>			
        </tr>  
				
		</TABLE>`;

    var elemOptions = document.getElementById("divOptionsQUERY_PRI");
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

  async setOptionsEQ() {
    const strOptionsEP = `
      <option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_EP">TOTS</option>
      <option value="E" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optE">EXISTENT</option>
      <option value="P" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optP">PROPOST</option>
      `;

    const strOptionsDOM = `
      <option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_DM">TOTS</option>
      <option value="PBL" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optPBL">PÚBLIC</option>
      <option value="PRV" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optPRV">PRIVAT</option>
      `;

    const strOptionsCLAS = `
      <option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_DM">TOTS</option>
      <option value="SL" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optSL">S. LOCAL</option>
      <option value="SG" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optSG">S. GENERAL</option>
      `;

    let strOptionsDOT = `<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_ORD">TOTS</option>`;
    const reader = new DataReader();
    let infoDOT = await reader.selectSQL(
      `SELECT siglas,nombre from pri_tipo_dotacional order by siglas`
    );
    infoDOT.forEach((item) => {
      strOptionsDOT += `<option value="${item.siglas}" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="opt${item.siglas}">${item.nombre}</option>`;
    });

    const strSelectEP = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectEP" >
            ${strOptionsEP}
        </select>`;
    const strSelectDOM = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectDOM" >
            ${strOptionsDOM}
        </select>`;
    const strSelectCLAS = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectCLAS" >
            ${strOptionsCLAS}
        </select>`;
    const strSelectDOT = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectDOT" >
        ${strOptionsDOT}
    </select>`;

    const html = `
		<TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
		
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>EXISTENTE/PROPUESTO</label></td>
						<td>${strSelectEP}</td>			
				</tr>  
        <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>DOMINIO</label></td>
						<td>${strSelectDOM}</td>			
				</tr>  
        <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
            <td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>CLASE</label></td>
            <td>${strSelectDOT}</td>			
        </tr>  
        <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
            <td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>CLASE</label></td>
            <td>${strSelectCLAS}</td>			
        </tr>  
				
		</TABLE>`;

    var elemOptions = document.getElementById("divOptionsQUERY_PRI");
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

  async setOptionsZO_SU(table) {
    let strOptionsCALIF = `<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_ORD">TOTS</option>`;
    const reader = new DataReader();
    let infoCALIF = await reader.selectSQL(
      `SELECT codigo from ${table} group by codigo  order by codigo`
    );
    infoCALIF.forEach((item) => {
      strOptionsCALIF += `<option value="${item.codigo}" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="opt${item.codigo}">${item.codigo}</option>`;
    });

    const strSelectCALIF = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectCALIF" >
            ${strOptionsCALIF}
        </select>`;

    const html = `
		<TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
		
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>CALIFICACIÓN</label></td>
						<td>${strSelectCALIF}</td>			
				</tr>  
				
		</TABLE>`;

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

    var elemOptions = document.getElementById("divOptionsQUERY_PRI");
    elemOptions.innerHTML = html + html_altura;

    const self = this;
    const elem = elemOptions.querySelectorAll(
      "input[name='select'], select[name='select']"
    );
    for (const select of elem) {
      select.onchange = function () {
        console.log("change option");
        self.changeQUERY();
      };
    }
  }
}
