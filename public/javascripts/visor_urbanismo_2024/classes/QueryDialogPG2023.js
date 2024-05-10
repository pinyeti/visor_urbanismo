/**
 * Clase que representa un cuadro de diálogo de consultas específicas para Plan General 2023.
 * @memberof module:Frontend
 */
class QueryDialogPG2023 {
  /**
   * Constructor de la clase QueryDialogPG2023.
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
  }

  /**
   * Crea y devuelve el contenido HTML del cuadro de diálogo de consultas específicas para Plan General 2023.
   * @returns {string} El contenido HTML generado.
   */
  createHTML() {
    const divQUERY_PG2023 = `<div id="divQUERY_PG2023" style='background-color:#f2f2f2;width:100%;height:60%'></div`;
    const divOptionsQUERY_PG2023 = `<div id="divOptionsQUERY_PG2023" style='background-color:#f2f2f2;width:100%'></div`;
    const strSelectTABLE_PG2023 = this.createSelectTABLE();

    const htmlRevision = `
        <BR>
        ${strSelectTABLE_PG2023}
        <BR><BR>          
        ${divOptionsQUERY_PG2023}
        <BR><BR> 
        ${divQUERY_PG2023}
        <BR>
      `;
    return htmlRevision;
  }

  /**
   * Realiza una acción en respuesta a una fila seleccionada en el visor de tablas.
   * @param {string} table - Nombre de la tabla.
   * @param {string} fid - Identificador único del elemento seleccionado.
   * @returns {Promise<void>} Promesa que se resuelve cuando la acción está completa.
   */
  async doActionRowVisor(table, fid) {
    /**
     * Devuelve un objeto de estilo para la capa.
     * @returns {Object} Objeto de estilo.
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
   * Formatea y configura una tabla HTML como un DataTable utilizando la biblioteca DataTables.
   * @returns {void} No devuelve ningún valor.
   */
  async formatQuery() {
    $(document).ready(function () {
      $("#table_queryPG2023")
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

      //$("#table_queryPG2023 td").css("padding", "5px");
    });
  }

  /**
   * Realiza una consulta de urbanizables y muestra los resultados en una tabla.
   * @param {string} name - Nombre de la consulta.
   * @param {string} table - Nombre de la tabla de consulta.
   * @param {string} filter - Filtro de consulta.
   * @returns {Promise<void>} Promesa que se resuelve cuando la consulta y la presentación de resultados están completas.
   */
  async queryURBANIZABLE(name, table, filter) {

    let urlA = new URL(window.location.protocol+'//'+window.location.host+"/opg/write_data_user");
    const paramsA = {accion:"consulta:"+table+":"+filter};
    Object.keys(paramsA).forEach(key => urlA.searchParams.append(key, paramsA[key]));
    const dataRequestA = {
        method: 'POST'
    }; 
    await fetch(urlA,dataRequestA);

    const reader = new DataReader();
    const info_geojson = await reader.readDataFeature(table, filter);

    console.log(info_geojson);

    //jsonData = JSON.stringify(info_geojson);

    let html_QUERY_HEAD = `
          <button style="padding-top:4px;padding-bottom:4px;display: none;" class="ui-button ui-widget ui-corner-all" title="Descàrrega en format geojson"  id="download"><i class="fa fa-download"></i></button>
          <button style="padding-top:4px;padding-bottom:4px;" class="ui-button ui-widget ui-corner-all" title="Afegeix consulta a taula de contingut" id="add_layer_toc"><i class="fa fa-plus-circle"></i></button>
    
          <TABLE id="table_queryPG2023"   class="stripe row-border order-column" style="padding:3px;font-size:8pt;font-family:Arial;width:100%">
         
          <thead style="background-color:#e1eefb;">
            <tr>
						  <th>FID</td>
							<th>CODIGO</td>   
							<th>DENOMINACIÓN</td>  
							<th>USO</td>            
            </tr>
          </thead>`;

    let html_QUERY_ROWS = "<tbody>";

    if (info_geojson.features != null)
      for (var n = 0; n < info_geojson.features.length; n++) {
        var area = info_geojson.features[n].properties.superficie;
        if (area == 0 || area == null)
          area = turf.area(info_geojson.features[n].geometry);
        if (area != null) area = area.toFixed(2);

        html_QUERY_ROWS =
          html_QUERY_ROWS +
          `
            <tr class="querySUBPG2023_${
              info_geojson.features[n].properties.fid
            }" 
              data-table="${table}" 
              data-fid="${info_geojson.features[n].properties.fid}"
              data-accion="doActionRowVisor">

              <td>${info_geojson.features[n].properties.fid}</td>
              <td>${info_geojson.features[n].properties.codi}</td>    
              <td>${info_geojson.features[
                n
              ].properties.nom.toUpperCase()}</td>       
              <td>${info_geojson.features[
                n
              ].properties.uso_.toUpperCase()}</td>                  
            </tr>`;
      }

    html_QUERY_ROWS = html_QUERY_ROWS + "</tbody>";

    const html_QUERY = html_QUERY_HEAD + html_QUERY_ROWS + `</TABLE>`;

    this.formatQuery();

    var elem = document.getElementById("divQUERY_PG2023");
    elem.style.height = "70%";
    elem.innerHTML = html_QUERY;

    const self = this;

    var elementos = document.querySelectorAll(
      'tr[data-accion="doActionRowVisor"]'
    );
    console.log("elementos", elementos);
    for (var i = 0; i < elementos.length; i++) {
      const tr = elementos[i];

      if (tr) {
        tr.addEventListener("click", async function () {
          var fid = tr.getAttribute("data-fid");
          var table = tr.getAttribute("data-table");

          console.log("click", fid, table);

          self.doActionRowVisor(table, fid);
        });
      }
    }

    document.getElementById("download").addEventListener("click", function () {
      self.download(name, info_geojson);
    });
    document
      .getElementById("add_layer_toc")
      .addEventListener("click", function () {
        self.addLayerTOC(name, info_geojson, filter);
      });
  }

  /**
   * Realiza una consulta de núcleos rurales y muestra los resultados en una tabla.
   * @param {string} name - Nombre de la consulta.
   * @param {string} table - Nombre de la tabla de consulta.
   * @param {string} filter - Filtro de consulta.
   * @returns {Promise<void>} Promesa que se resuelve cuando la consulta y la presentación de resultados están completas.
   */
  async queryNUCLEO_RURAL(name, table, filter) {

    let urlA = new URL(window.location.protocol+'//'+window.location.host+"/opg/write_data_user");
    const paramsA = {accion:"consulta:"+table+":"+filter};
    Object.keys(paramsA).forEach(key => urlA.searchParams.append(key, paramsA[key]));
    const dataRequestA = {
        method: 'POST'
    }; 
    await fetch(urlA,dataRequestA);

    const reader = new DataReader();
    const info_geojson = await reader.readDataFeature(table, filter);

    console.log(info_geojson);

    //jsonData = JSON.stringify(info_geojson);

    let html_QUERY_HEAD = `
          <button style="padding-top:4px;padding-bottom:4px;display: none;" class="ui-button ui-widget ui-corner-all" title="Descàrrega en format geojson"  id="download"><i class="fa fa-download"></i></button>
          <button style="padding-top:4px;padding-bottom:4px;" class="ui-button ui-widget ui-corner-all" title="Afegeix consulta a taula de contingut" id="add_layer_toc"><i class="fa fa-plus-circle"></i></button>
    
          <TABLE id="table_queryPG2023"   class="stripe row-border order-column" style="padding:3px;font-size:8pt;font-family:Arial;width:100%">
         
          <thead style="background-color:#e1eefb;">
            <tr>
						  <th>FID</td>
							<th>CATEGORIA</td>   
							<th>DESCRIPCIÓN_CATEG.</td>  
							<th>CODIGO</td>   
							<th>DENOMINACIÓN</td>  
                    
            </tr>
          </thead>`;

    let html_QUERY_ROWS = "<tbody>";

    if (info_geojson.features != null)
      for (var n = 0; n < info_geojson.features.length; n++) {
        var area = info_geojson.features[n].properties.superficie;
        if (area == 0 || area == null)
          area = turf.area(info_geojson.features[n].geometry);
        if (area != null) area = area.toFixed(2);

        html_QUERY_ROWS =
          html_QUERY_ROWS +
          `
          <tr class="queryNR2023_${info_geojson.features[n].properties.fid}" 
            data-table="${table}" 
            data-fid="${info_geojson.features[n].properties.fid}"
            data-accion="doActionRowVisor">

            <td>${info_geojson.features[n].properties.fid}</td>
            <td>${info_geojson.features[n].properties.categoria}</td>    
            <td>${info_geojson.features[n].properties.categoria_es}</td>       
            <td>${info_geojson.features[n].properties.nom}</td>    
            <td>${info_geojson.features[n].properties.nom_}</td>                     
          </tr>`;
      }

    html_QUERY_ROWS = html_QUERY_ROWS + "</tbody>";

    const html_QUERY = html_QUERY_HEAD + html_QUERY_ROWS + `</TABLE>`;

    this.formatQuery();

    var elem = document.getElementById("divQUERY_PG2023");
    elem.style.height = "70%";
    elem.innerHTML = html_QUERY;

    const self = this;

    var elementos = document.querySelectorAll(
      'tr[data-accion="doActionRowVisor"]'
    );
    console.log("elementos", elementos);
    for (var i = 0; i < elementos.length; i++) {
      const tr = elementos[i];

      if (tr) {
        tr.addEventListener("click", async function () {
          var fid = tr.getAttribute("data-fid");
          var table = tr.getAttribute("data-table");

          console.log("click", fid, table);

          self.doActionRowVisor(table, fid);
        });
      }
    }

    document.getElementById("download").addEventListener("click", function () {
      self.download(name, info_geojson);
    });
    document
      .getElementById("add_layer_toc")
      .addEventListener("click", function () {
        self.addLayerTOC(name, info_geojson, filter);
      });
  }

  /**
   * Realiza una consulta de suelo rústco comune y muestra los resultados en una tabla.
   *
   * @param {string} name - Nombre de la consulta.
   * @param {string} table - Nombre de la tabla de consulta.
   * @param {string} filter - Filtro de consulta.
   * @returns {Promise<void>} Una promesa que se resuelve cuando la consulta y la presentación de resultados están completas.
   */
  async queryRUSTICO_COMUN(name, table, filter) {

    let urlA = new URL(window.location.protocol+'//'+window.location.host+"/opg/write_data_user");
    const paramsA = {accion:"consulta:"+table+":"+filter};
    Object.keys(paramsA).forEach(key => urlA.searchParams.append(key, paramsA[key]));
    const dataRequestA = {
        method: 'POST'
    }; 
    await fetch(urlA,dataRequestA);

    const reader = new DataReader();
    const info_geojson = await reader.readDataFeature(table, filter);

    console.log(info_geojson);

    //jsonData = JSON.stringify(info_geojson);

    let html_QUERY_HEAD = `
          <button style="padding-top:4px;padding-bottom:4px;display: none;" class="ui-button ui-widget ui-corner-all" title="Descàrrega en format geojson"  id="download"><i class="fa fa-download"></i></button>
          <button style="padding-top:4px;padding-bottom:4px;" class="ui-button ui-widget ui-corner-all" title="Afegeix consulta a taula de contingut" id="add_layer_toc"><i class="fa fa-plus-circle"></i></button>
    
          <TABLE id="table_queryPG2023"   class="stripe row-border order-column" style="padding:3px;font-size:8pt;font-family:Arial;width:100%">
         
          <thead style="background-color:#e1eefb;">
            <tr>
						  <th>FID</td>
							<th>CATEGORIA</td>   
							<th>DESCRIPCIÓN_CATEG.</td>  
							<th>SUBCATEGORIA</td>   
							<th>DESCRIPCIÓN_SUBCATEG.</td>  
                    
            </tr>
          </thead>`;

    let html_QUERY_ROWS = "<tbody>";

    if (info_geojson.features != null)
      for (var n = 0; n < info_geojson.features.length; n++) {
        var area = info_geojson.features[n].properties.superficie;
        if (area == 0 || area == null)
          area = turf.area(info_geojson.features[n].geometry);
        if (area != null) area = area.toFixed(2);

        html_QUERY_ROWS =
          html_QUERY_ROWS +
          `
          <tr class="querySRC2023_${info_geojson.features[n].properties.fid}" 
            data-table="${table}" 
            data-fid="${info_geojson.features[n].properties.fid}"
            data-accion="doActionRowVisor">

            <td>${info_geojson.features[n].properties.fid}</td>
            <td>${info_geojson.features[n].properties.categoria}</td>    
            <td>${info_geojson.features[n].properties.categoria_es}</td>       
            <td>${info_geojson.features[n].properties.subcategoria}</td>    
            <td>${info_geojson.features[n].properties.subcategoria_es}</td>                     
          </tr>`;
      }

    html_QUERY_ROWS = html_QUERY_ROWS + "</tbody>";

    const html_QUERY = html_QUERY_HEAD + html_QUERY_ROWS + `</TABLE>`;

    this.formatQuery();

    var elem = document.getElementById("divQUERY_PG2023");
    elem.style.height = "70%";
    elem.innerHTML = html_QUERY;

    const self = this;

    var elementos = document.querySelectorAll(
      'tr[data-accion="doActionRowVisor"]'
    );
    console.log("elementos", elementos);
    for (var i = 0; i < elementos.length; i++) {
      const tr = elementos[i];

      if (tr) {
        tr.addEventListener("click", async function () {
          var fid = tr.getAttribute("data-fid");
          var table = tr.getAttribute("data-table");

          self.doActionRowVisor(table, fid);
        });
      }
    }

    document.getElementById("download").addEventListener("click", function () {
      self.download(name, info_geojson);
    });
    document
      .getElementById("add_layer_toc")
      .addEventListener("click", function () {
        self.addLayerTOC(name, info_geojson, filter);
      });
  }

  /**
   * Realiza una consulta de rústico protegido y muestra los resultados en una tabla.
   *
   * @param {string} name - Nombre de la consulta.
   * @param {string} table - Nombre de la tabla de consulta.
   * @param {string} filter - Filtro de consulta.
   * @returns {Promise<void>} Una promesa que se resuelve cuando la consulta y la presentación de resultados están completas.
   */
  async queryRUSTICO(name, table, filter) {

    let urlA = new URL(window.location.protocol+'//'+window.location.host+"/opg/write_data_user");
    const paramsA = {accion:"consulta:"+table+":"+filter};
    Object.keys(paramsA).forEach(key => urlA.searchParams.append(key, paramsA[key]));
    const dataRequestA = {
        method: 'POST'
    }; 
    await fetch(urlA,dataRequestA);

    const reader = new DataReader();
    const info_geojson = await reader.readDataFeature(table, filter);

    console.log(info_geojson);

    //jsonData = JSON.stringify(info_geojson);

    let html_QUERY_HEAD = `
          <button style="padding-top:4px;padding-bottom:4px;display: none;" class="ui-button ui-widget ui-corner-all" title="Descàrrega en format geojson"  id="download"><i class="fa fa-download"></i></button>
          <button style="padding-top:4px;padding-bottom:4px;" class="ui-button ui-widget ui-corner-all" title="Afegeix consulta a taula de contingut" id="add_layer_toc"><i class="fa fa-plus-circle"></i></button>
    
          <TABLE id="table_queryPG2023"   class="stripe row-border order-column" style="padding:3px;font-size:8pt;font-family:Arial;width:100%">
         
          <thead style="background-color:#e1eefb;">
            <tr>
							<th>FID</td>
							<th>DENOMINACIÓN</td>
							<th>ZONA</td>
							<th>DESCRIPCION_ZONA</td>
							<th>SUBCATEGORIA</td>   
							<th>DESCRIPCIÓN_SUBCATEG.</td>  
							<th>PLAN_PROTECCIÓN</td>   
							<th>DESCRIPCIÓN_PLAN_PROT.</td>
							<th>PROTECCIÓN</td>   
							<th>PROT_DESCRIPCIÓN</td>
							<th>TIPO</td>    
                    
            </tr>
          </thead>`;

    let html_QUERY_ROWS = "<tbody>";

    if (info_geojson.features != null)
      for (var n = 0; n < info_geojson.features.length; n++) {
        var area = info_geojson.features[n].properties.superficie;
        if (area == 0 || area == null)
          area = turf.area(info_geojson.features[n].geometry);
        if (area != null) area = area.toFixed(2);

        html_QUERY_ROWS =
          html_QUERY_ROWS +
          `
          <tr class="querySRP2023_${info_geojson.features[n].properties.fid}" 
            data-table="${table}" 
            data-fid="${info_geojson.features[n].properties.fid}"
            data-accion="doActionRowVisor">

            <td>${info_geojson.features[n].properties.fid}</td>
            <td>${info_geojson.features[n].properties.nom_}</td>
            <td>${info_geojson.features[n].properties.zona}</td>
            <td>${info_geojson.features[n].properties.zona_es}</td>
            <td>${info_geojson.features[n].properties.subcategoria}</td>    
            <td>${info_geojson.features[n].properties.subcategoria_es}</td>    
            <td>${info_geojson.features[n].properties.pla_proteccio}</td>   
            <td>${info_geojson.features[n].properties.pla_proteccio_}</td>
            <td>${info_geojson.features[n].properties.proteccio}</td>   
            <td>${info_geojson.features[n].properties.proteccio_}</td>
            <td>${info_geojson.features[n].properties.tipo_}</td>                     
          </tr>`;
      }

    html_QUERY_ROWS = html_QUERY_ROWS + "</tbody>";

    const html_QUERY = html_QUERY_HEAD + html_QUERY_ROWS + `</TABLE>`;

    this.formatQuery();

    var elem = document.getElementById("divQUERY_PG2023");
    elem.style.height = "70%";
    elem.innerHTML = html_QUERY;

    const self = this;

    var elementos = document.querySelectorAll(
      'tr[data-accion="doActionRowVisor"]'
    );
    console.log("elementos", elementos);
    for (var i = 0; i < elementos.length; i++) {
      const tr = elementos[i];

      if (tr) {
        tr.addEventListener("click", async function () {
          var fid = tr.getAttribute("data-fid");
          var table = tr.getAttribute("data-table");

          self.doActionRowVisor(table, fid);
        });
      }
    }

    document.getElementById("download").addEventListener("click", function () {
      self.download(name, info_geojson);
    });
    document
      .getElementById("add_layer_toc")
      .addEventListener("click", function () {
        self.addLayerTOC(name, info_geojson, filter);
      });
  }

  /**
   * Realiza una consulta de S.General de Servicios urbanos y muestra los resultados en una tabla.
   *
   * @param {string} name - Nombre de la consulta.
   * @param {string} table - Nombre de la tabla de consulta.
   * @param {string} filter - Filtro de consulta.
   * @returns {Promise<void>} Una promesa que se resuelve cuando la consulta y la presentación de resultados están completas.
   */
  async querySGSU(name, table, filter) {

    let urlA = new URL(window.location.protocol+'//'+window.location.host+"/opg/write_data_user");
    const paramsA = {accion:"consulta:"+table+":"+filter};
    Object.keys(paramsA).forEach(key => urlA.searchParams.append(key, paramsA[key]));
    const dataRequestA = {
        method: 'POST'
    }; 
    await fetch(urlA,dataRequestA);

    const reader = new DataReader();
    const info_geojson = await reader.readDataFeature(table, filter);

    console.log(info_geojson);

    //jsonData = JSON.stringify(info_geojson);

    let html_QUERY_HEAD = `
          <button style="padding-top:4px;padding-bottom:4px;display: none;" class="ui-button ui-widget ui-corner-all" title="Descàrrega en format geojson"  id="download"><i class="fa fa-download"></i></button>
          <button style="padding-top:4px;padding-bottom:4px;" class="ui-button ui-widget ui-corner-all" title="Afegeix consulta a taula de contingut" id="add_layer_toc"><i class="fa fa-plus-circle"></i></button>
    
          <TABLE id="table_queryPG2023"   class="stripe row-border order-column" style="padding:3px;font-size:8pt;font-family:Arial;width:100%">
         
          <thead style="background-color:#e1eefb;">
            <tr>
                <th>FID</td>
                <th>CODI</td>
                <th>IDENTIFICANT</td>
                <th>DENOMINACIÓ</td>
                <th>SUPERFICIE</td>
                <th>ORDENACIÓ</td>
                <th>DOMINI</td>
                <th>ÚS</td>
                <th>Nº INVENTARI</LABEL></td>
                <th>CLASIF. SÒL</LABEL></td>
                    
            </tr>
          </thead>`;

    let html_QUERY_ROWS = "<tbody>";

    if (info_geojson.features != null)
      for (var n = 0; n < info_geojson.features.length; n++) {
        var area = info_geojson.features[n].properties.superficie;
        if (area == 0 || area == null)
          area = turf.area(info_geojson.features[n].geometry);
        if (area != null) area = area.toFixed(2);

        html_QUERY_ROWS =
          html_QUERY_ROWS +
          `
          <tr class="querySGSU2023_${info_geojson.features[n].properties.fid}" 
            data-table="${table}" 
            data-fid="${info_geojson.features[n].properties.fid}"
            data-accion="doActionRowVisor">

            <td >${info_geojson.features[n].properties.fid}</td>
            <td>${info_geojson.features[n].properties.codi}</td>
            <td>${info_geojson.features[n].properties.identificant}</td>
            <td>${info_geojson.features[n].properties.nom}</td>
            <td>${area}</td>
            <td>${info_geojson.features[n].properties.ordenacio}</td>
            <td>${info_geojson.features[n].properties.dominio}</td>
            <td>${info_geojson.features[n].properties.uso}</td>
            <td>${info_geojson.features[n].properties.inventari}</td>
            <td>${info_geojson.features[n].properties.clasificacion}</td>
                    
          </tr>`;
      }

    html_QUERY_ROWS = html_QUERY_ROWS + "</tbody>";

    const html_QUERY = html_QUERY_HEAD + html_QUERY_ROWS + `</TABLE>`;

    this.formatQuery();

    var elem = document.getElementById("divQUERY_PG2023");
    elem.style.height = "70%";
    elem.innerHTML = html_QUERY;

    const self = this;

    var elementos = document.querySelectorAll(
      'tr[data-accion="doActionRowVisor"]'
    );
    console.log("elementos", elementos);
    for (var i = 0; i < elementos.length; i++) {
      const tr = elementos[i];

      if (tr) {
        tr.addEventListener("click", async function () {
          var fid = tr.getAttribute("data-fid");
          var table = tr.getAttribute("data-table");

          self.doActionRowVisor(table, fid);
        });
      }
    }

    document.getElementById("download").addEventListener("click", function () {
      self.download(name, info_geojson);
    });
    document
      .getElementById("add_layer_toc")
      .addEventListener("click", function () {
        self.addLayerTOC(name, info_geojson, filter);
      });
  }

  /**
   * Realiza una consulta de S.General de Infraestructuras y muestra los resultados en una tabla.
   *
   * @param {string} name - Nombre de la consulta.
   * @param {string} table - Nombre de la tabla de consulta.
   * @param {string} filter - Filtro de consulta.
   * @returns {Promise<void>} Una promesa que se resuelve cuando la consulta y la presentación de resultados están completas.
   */
  async querySGIF(name, table, filter) {

    let urlA = new URL(window.location.protocol+'//'+window.location.host+"/opg/write_data_user");
    const paramsA = {accion:"consulta:"+table+":"+filter};
    Object.keys(paramsA).forEach(key => urlA.searchParams.append(key, paramsA[key]));
    const dataRequestA = {
        method: 'POST'
    }; 
    await fetch(urlA,dataRequestA);

    const reader = new DataReader();
    const info_geojson = await reader.readDataFeature(
      table,
      filter + " order by codi"
    );

    console.log(info_geojson);

    //jsonData = JSON.stringify(info_geojson);

    let html_QUERY_HEAD = `
          <button style="padding-top:4px;padding-bottom:4px;display: none;" class="ui-button ui-widget ui-corner-all" title="Descàrrega en format geojson"  id="download"><i class="fa fa-download"></i></button>
          <button style="padding-top:4px;padding-bottom:4px;" class="ui-button ui-widget ui-corner-all" title="Afegeix consulta a taula de contingut" id="add_layer_toc"><i class="fa fa-plus-circle"></i></button>
    
          <TABLE id="table_queryPG2023"   class="stripe row-border order-column" style="padding:3px;font-size:8pt;font-family:Arial;width:100%">
         
          <thead style="background-color:#e1eefb;">
            <tr>
                <th>FID</td>
                <th>CODI</td>
                <th>IDENTIFICANT</td>
                <th>DENOMINACIÓ</td>
                <th>SUPERFICIE</td>
                <th>ORDENACIÓ</td>
                <th>DOMINI</td>
                <th>ÚS</td>
                <th>Nº INVENTARI</LABEL></td>
                <th>CLASIF. SÒL</LABEL></td>
                    
            </tr>
          </thead>`;

    let html_QUERY_ROWS = "<tbody>";

    if (info_geojson.features != null)
      for (var n = 0; n < info_geojson.features.length; n++) {
        var area = info_geojson.features[n].properties.superficie;
        if (area == 0 || area == null)
          area = turf.area(info_geojson.features[n].geometry);
        if (area != null) area = area.toFixed(2);

        html_QUERY_ROWS =
          html_QUERY_ROWS +
          `
          <tr class="querySGIF2023_${info_geojson.features[n].properties.fid}" 
            data-table="${table}" 
            data-fid="${info_geojson.features[n].properties.fid}"
            data-accion="doActionRowVisor">

            <td >${info_geojson.features[n].properties.fid}</td>
            <td>${info_geojson.features[n].properties.codi}</td>
            <td>${info_geojson.features[n].properties.identificant}</td>
            <td>${info_geojson.features[n].properties.nom}</td>
            <td>${area}</td>
            <td>${info_geojson.features[n].properties.ordenacio}</td>
            <td>${info_geojson.features[n].properties.dominio}</td>
            <td>${info_geojson.features[n].properties.uso}</td>
            <td>${info_geojson.features[n].properties.inventari}</td>
            <td>${info_geojson.features[n].properties.clasificacion}</td>
                    
          </tr>`;
      }

    html_QUERY_ROWS = html_QUERY_ROWS + "</tbody>";

    const html_QUERY = html_QUERY_HEAD + html_QUERY_ROWS + `</TABLE>`;

    this.formatQuery();

    var elem = document.getElementById("divQUERY_PG2023");
    elem.style.height = "70%";
    elem.innerHTML = html_QUERY;

    const self = this;

    var elementos = document.querySelectorAll(
      'tr[data-accion="doActionRowVisor"]'
    );
    console.log("elementos", elementos);
    for (var i = 0; i < elementos.length; i++) {
      const tr = elementos[i];

      if (tr) {
        tr.addEventListener("click", async function () {
          var fid = tr.getAttribute("data-fid");
          var table = tr.getAttribute("data-table");

          self.doActionRowVisor(table, fid);
        });
      }
    }

    document.getElementById("download").addEventListener("click", function () {
      self.download(name, info_geojson);
    });
    document
      .getElementById("add_layer_toc")
      .addEventListener("click", function () {
        self.addLayerTOC(name, info_geojson, filter);
      });
  }

  async querySGCM(name, table, filter) {

    let urlA = new URL(window.location.protocol+'//'+window.location.host+"/opg/write_data_user");
    const paramsA = {accion:"consulta:"+table+":"+filter};
    Object.keys(paramsA).forEach(key => urlA.searchParams.append(key, paramsA[key]));
    const dataRequestA = {
        method: 'POST'
    }; 
    await fetch(urlA,dataRequestA);

    const reader = new DataReader();
    const info_geojson = await reader.readDataFeature(table, filter);

    console.log(info_geojson);

    //jsonData = JSON.stringify(info_geojson);

    let html_QUERY_HEAD = `
          <button style="padding-top:4px;padding-bottom:4px;display: none;" class="ui-button ui-widget ui-corner-all" title="Descàrrega en format geojson"  id="download"><i class="fa fa-download"></i></button>
          <button style="padding-top:4px;padding-bottom:4px;" class="ui-button ui-widget ui-corner-all" title="Afegeix consulta a taula de contingut" id="add_layer_toc"><i class="fa fa-plus-circle"></i></button>
    
          <TABLE id="table_queryPG2023"   class="stripe row-border order-column" style="padding:3px;font-size:8pt;font-family:Arial;width:100%">
         
          <thead style="background-color:#e1eefb;">
            <tr>
                <th>FID</td>
                <th>CODI</td>
                <th>IDENTIFICANT</td>
                <th>DENOMINACIÓ</td>
                <th>SUPERFICIE</td>
                <th>ORDENACIÓ</td>
                <th>DOMINI</td>
                <th>ÚS</td>
                <th>Nº INVENTARI</LABEL></td>
                <th>CLASIF. SÒL</LABEL></td>
                    
            </tr>
          </thead>`;

    let html_QUERY_ROWS = "<tbody>";

    if (info_geojson.features != null)
      for (var n = 0; n < info_geojson.features.length; n++) {
        var area = info_geojson.features[n].properties.superficie;
        if (area == 0 || area == null)
          area = turf.area(info_geojson.features[n].geometry);
        if (area != null) area = area.toFixed(2);

        html_QUERY_ROWS =
          html_QUERY_ROWS +
          `
          <tr class="querySGCM2023_${info_geojson.features[n].properties.fid}" 
            data-table="${table}" 
            data-fid="${info_geojson.features[n].properties.fid}"
            data-accion="doActionRowVisor">

            <td >${info_geojson.features[n].properties.fid}</td>
            <td>${info_geojson.features[n].properties.codi}</td>
            <td>${info_geojson.features[n].properties.identificant}</td>
            <td>${info_geojson.features[n].properties.nom}</td>
            <td>${area}</td>
            <td>${info_geojson.features[n].properties.ordenacion}</td>
            <td>${info_geojson.features[n].properties.dominio}</td>
            <td>${info_geojson.features[n].properties.uso}</td>
            <td>${info_geojson.features[n].properties.inventari}</td>
            <td>${info_geojson.features[n].properties.clasificacion}</td>
                    
          </tr>`;
      }

    html_QUERY_ROWS = html_QUERY_ROWS + "</tbody>";

    const html_QUERY = html_QUERY_HEAD + html_QUERY_ROWS + `</TABLE>`;

    this.formatQuery();

    var elem = document.getElementById("divQUERY_PG2023");
    elem.style.height = "70%";
    elem.innerHTML = html_QUERY;

    const self = this;

    var elementos = document.querySelectorAll(
      'tr[data-accion="doActionRowVisor"]'
    );
    console.log("elementos", elementos);
    for (var i = 0; i < elementos.length; i++) {
      const tr = elementos[i];

      if (tr) {
        tr.addEventListener("click", async function () {
          var fid = tr.getAttribute("data-fid");
          var table = tr.getAttribute("data-table");

          self.doActionRowVisor(table, fid);
        });
      }
    }

    document.getElementById("download").addEventListener("click", function () {
      self.download(name, info_geojson);
    });
    document
      .getElementById("add_layer_toc")
      .addEventListener("click", function () {
        self.addLayerTOC(name, info_geojson, filter);
      });
  }

  /**
   * Realiza una consulta de S.General de Espacios libres y muestra los resultados en una tabla.
   *
   * @param {string} name - Nombre de la consulta.
   * @param {string} table - Nombre de la tabla de consulta.
   * @param {string} filter - Filtro de consulta.
   * @returns {Promise<void>} Una promesa que se resuelve cuando la consulta y la presentación de resultados están completas.
   */
  async querySGEL(name, table, filter) {

    let urlA = new URL(window.location.protocol+'//'+window.location.host+"/opg/write_data_user");
    const paramsA = {accion:"consulta:"+table+":"+filter};
    Object.keys(paramsA).forEach(key => urlA.searchParams.append(key, paramsA[key]));
    const dataRequestA = {
        method: 'POST'
    }; 
    await fetch(urlA,dataRequestA);

    const reader = new DataReader();
    const info_geojson = await reader.readDataFeature(
      table,
      filter + " order by codi"
    );

    console.log(info_geojson);

    //jsonData = JSON.stringify(info_geojson);

    let html_QUERY_HEAD = `
          <button style="padding-top:4px;padding-bottom:4px;display: none;" class="ui-button ui-widget ui-corner-all" title="Descàrrega en format geojson"  id="download"><i class="fa fa-download"></i></button>
          <button style="padding-top:4px;padding-bottom:4px;" class="ui-button ui-widget ui-corner-all" title="Afegeix consulta a taula de contingut" id="add_layer_toc"><i class="fa fa-plus-circle"></i></button>
    
          <TABLE id="table_queryPG2023"   class="stripe row-border order-column" style="padding:3px;font-size:8pt;font-family:Arial;width:100%">
         
          <thead style="background-color:#e1eefb;">
            <tr>
                <th>FID</td>
                <th>CODI</td>
                <th>IDENTIFICANT</td>
                <th>DENOMINACIÓ</td>
                <th>SUPERFICIE</td>
                <th>ORDENACIÓ</td>
                <th>DOMINI</td>
                <th>ÚS</td>
                <th>Nº INVENTARI</LABEL></td>
                <th>CLASIF. SÒL</LABEL></td>
                    
            </tr>
          </thead>`;

    let html_QUERY_ROWS = "<tbody>";

    if (info_geojson.features != null)
      for (var n = 0; n < info_geojson.features.length; n++) {
        var area = info_geojson.features[n].properties.superficie;
        if (area == 0 || area == null)
          area = turf.area(info_geojson.features[n].geometry);
        if (area != null) area = area.toFixed(2);

        html_QUERY_ROWS =
          html_QUERY_ROWS +
          `
          <tr class="querySGEL2023_${info_geojson.features[n].properties.fid}" 
            data-table="${table}" 
            data-fid="${info_geojson.features[n].properties.fid}"
            data-accion="doActionRowVisor">

            <td >${info_geojson.features[n].properties.fid}</td>
            <td>${info_geojson.features[n].properties.codi}</td>
            <td>${info_geojson.features[n].properties.identificant}</td>
            <td>${info_geojson.features[n].properties.nom}</td>
            <td>${area}</td>
            <td>${info_geojson.features[n].properties.ordenacion}</td>
            <td>${info_geojson.features[n].properties.dominio}</td>
            <td>${info_geojson.features[n].properties.uso}</td>
            <td>${info_geojson.features[n].properties.inventari}</td>
            <td>${info_geojson.features[n].properties.clasificacion_}</td>
                    
          </tr>`;
      }

    html_QUERY_ROWS = html_QUERY_ROWS + "</tbody>";

    const html_QUERY = html_QUERY_HEAD + html_QUERY_ROWS + `</TABLE>`;

    this.formatQuery();

    var elem = document.getElementById("divQUERY_PG2023");
    elem.style.height = "70%";
    elem.innerHTML = html_QUERY;

    const self = this;

    var elementos = document.querySelectorAll(
      'tr[data-accion="doActionRowVisor"]'
    );
    console.log("elementos", elementos);
    for (var i = 0; i < elementos.length; i++) {
      const tr = elementos[i];

      if (tr) {
        tr.addEventListener("click", async function () {
          var fid = tr.getAttribute("data-fid");
          var table = tr.getAttribute("data-table");

          self.doActionRowVisor(table, fid);
        });
      }
    }

    document.getElementById("download").addEventListener("click", function () {
      self.download(name, info_geojson);
    });
    document
      .getElementById("add_layer_toc")
      .addEventListener("click", function () {
        self.addLayerTOC(name, info_geojson, filter);
      });
  }

  /**
   * Realiza una consulta de S.General de Equipamientos y muestra los resultados en una tabla.
   *
   * @param {string} name - Nombre de la consulta.
   * @param {string} table - Nombre de la tabla de consulta.
   * @param {string} filter - Filtro de consulta.
   * @returns {Promise<void>} Una promesa que se resuelve cuando la consulta y la presentación de resultados están completas.
   */
  async querySGEQ(name, table, filter) {

    let urlA = new URL(window.location.protocol+'//'+window.location.host+"/opg/write_data_user");
    const paramsA = {accion:"consulta:"+table+":"+filter};
    Object.keys(paramsA).forEach(key => urlA.searchParams.append(key, paramsA[key]));
    const dataRequestA = {
        method: 'POST'
    }; 
    await fetch(urlA,dataRequestA);

    const reader = new DataReader();
    const info_geojson = await reader.readDataFeature(table, filter);

    console.log(info_geojson);

    //jsonData = JSON.stringify(info_geojson);

    let html_QUERY_HEAD = `
          <button style="padding-top:4px;padding-bottom:4px;display:none;" class="ui-button ui-widget ui-corner-all" title="Descàrrega en format geojson"  id="download"><i class="fa fa-download"></i></button>
          <button style="padding-top:4px;padding-bottom:4px;" class="ui-button ui-widget ui-corner-all" title="Afegeix consulta a taula de contingut" id="add_layer_toc"><i class="fa fa-plus-circle"></i></button>
    
          <TABLE id="table_queryPG2023"   class="stripe row-border order-column" style="padding:3px;font-size:8pt;font-family:Arial;width:100%">
         
          <thead style="background-color:#e1eefb;">
            <tr>
                <th>FID</td>
                <th>CODI</td>
                <th>IDENTIFICANT</td>
                <th>DENOMINACIÓ</td>
                <th>SUPERFICIE</td>
                <th>ORDENACIÓ</td>
                <th>DOMINI</td>
                <th>ÚS</td>
                <th>Nº INVENTARI</LABEL></td>
                <th>CLASIF. SÒL</LABEL></td>
                    
            </tr>
          </thead>`;

    let html_QUERY_ROWS = "<tbody>";

    if (info_geojson.features != null)
      for (var n = 0; n < info_geojson.features.length; n++) {
        var area = info_geojson.features[n].properties.superficie;
        if (area == 0 || area == null)
          area = turf.area(info_geojson.features[n].geometry);
        if (area != null) area = area.toFixed(2);

        html_QUERY_ROWS =
          html_QUERY_ROWS +
          `
          <tr class="querySGEQ2023_${info_geojson.features[n].properties.fid}" 
            data-table="${table}" 
            data-fid="${info_geojson.features[n].properties.fid}"
            data-accion="doActionRowVisor">

            <td >${info_geojson.features[n].properties.fid}</td>
            <td>${info_geojson.features[n].properties.codi}</td>
            <td>${info_geojson.features[n].properties.identificant}</td>
            <td>${info_geojson.features[n].properties.nom}</td>
            <td>${area}</td>
            <td>${info_geojson.features[n].properties.ordenacion}</td>
            <td>${info_geojson.features[n].properties.dominio}</td>
            <td>${info_geojson.features[n].properties.uso}</td>
            <td>${info_geojson.features[n].properties.inventari}</td>
            <td>${info_geojson.features[n].properties.clasificacion_}</td>
                    
          </tr>`;
      }

    html_QUERY_ROWS = html_QUERY_ROWS + "</tbody>";

    const html_QUERY = html_QUERY_HEAD + html_QUERY_ROWS + `</TABLE>`;

    this.formatQuery();

    var elem = document.getElementById("divQUERY_PG2023");
    elem.style.height = "70%";
    elem.innerHTML = html_QUERY;

    const self = this;

    var elementos = document.querySelectorAll(
      'tr[data-accion="doActionRowVisor"]'
    );
    console.log("elementos", elementos);
    for (var i = 0; i < elementos.length; i++) {
      const tr = elementos[i];

      if (tr) {
        tr.addEventListener("click", async function () {
          var fid = tr.getAttribute("data-fid");
          var table = tr.getAttribute("data-table");

          self.doActionRowVisor(table, fid);
        });
      }
    }

    document.getElementById("download").addEventListener("click", function () {
      self.download(name, info_geojson);
    });
    document
      .getElementById("add_layer_toc")
      .addEventListener("click", function () {
        self.addLayerTOC(name, info_geojson, filter);
      });
  }

  /**
   * Genera un icono cuadrado en formato Data URL a partir del color especificado.
   *
   * @param {string} iconColor - Color del icono en formato hexadecimal (#RRGGBB).
   * @returns {string} Un Data URL que representa el icono generado.
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
   * Genera un nuevo ID único basado en el ID base, asegurándose de que no exista ya en el jstree.
   *
   * @param {Object} jstree - Objeto jstree en el que se verificará la existencia del nuevo ID.
   * @param {string} idBase - ID base a partir del cual se generará el nuevo ID.
   * @returns {string} Un nuevo ID único que no existe en el jstree.
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
   *
   * @returns {string} Un color hexadecimal aleatorio en formato "#RRGGBB".
   */
  getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  /**
   * Agrega una capa de consulta al Table of Contents (TOC) y al mapa.
   *
   * @param {string} name - Nombre de la consulta.
   * @param {Object} geojson - Datos GeoJSON de la capa de consulta.
   * @param {string} filter - Filtro de consulta.
   * @returns {void}
   */
  addLayerTOC(name, geojson, filter) {
    // Genera un color aleatorio para la capa
    const color = this.getRandomColor();

    // Crea una capa Leaflet con los datos GeoJSON y estilos
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
    this.mapLayers.pushMapLayer(id, layerQuery);
    layerQuery.addTo(this.map);

    // Crea un nuevo nodo para el TOC
    var node = {
      id: id,
      data: layerQuery,
      text: name + " - " + filter,
      icon: this.generateIcon(color),
    };

    // Obtiene el nodo padre en el TOC
    var nodeP = $("#jstree_consultas").jstree().get_node("root");
    // Crea el nuevo nodo en el TOC
    $("#jstree_consultas").jstree().create_node(nodeP, node, "last");
    // Marca el nodo como seleccionado en el TOC
    $("#jstree_consultas").jstree().check_node(node);
  }

  /**
   * Descarga un archivo GeoJSON con los datos especificados.
   *
   * @param {string} name - Nombre del archivo a descargar.
   * @param {Object} geojson - Datos GeoJSON que se descargarán.
   * @returns {void}
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
   * Realiza una consulta específica según el tipo seleccionado y muestra los resultados en el mapa y en una tabla.
   *
   * @returns {void}
   */
  changeQUERY() {
    let tipo;
    let filter = "fid>0";
    const elem = document.getElementById("selectTablesPG2023");

    if (elem != null) {
      tipo = elem.value;
    }

    if (tipo == "SGEC") {
      const div = document.getElementById("divOptionsQUERY_PG2023");
      const ext_prop = div.querySelector("#selectEP").value;
      const dominio = div.querySelector("#selectDOM").value;
      const dotacional = div.querySelector("#selectDOT").value;
      const ordenacion = div.querySelector("#selectORD").value;

      if (ext_prop !== "TOTS") filter += ` AND ext_prop='${ext_prop}'`;
      if (dominio !== "TOTS") filter += ` AND dominio='${dominio}'`;
      if (dotacional !== "TOTS") filter += ` AND identificacio='${dotacional}'`;
      if (ordenacion !== "TOTS") filter += ` AND ordenacion='${ordenacion}'`;

      this.querySGEQ(
        "Sistema General equipamientos (PG2023)",
        "pg_dotac_sg_eq",
        filter
      );
    }

    if (tipo == "SGEL") {
      const div = document.getElementById("divOptionsQUERY_PG2023");
      const ext_prop = div.querySelector("#selectEP").value;
      const ordenacion = div.querySelector("#selectORD").value;

      if (ext_prop !== "TOTS") filter += ` AND ext_prop='${ext_prop}'`;
      if (ordenacion !== "TOTS") filter += ` AND ordenacion='${ordenacion}'`;

      this.querySGEL(
        "Sistema General espacios libres (PG2023)",
        "pg_dotac_sg_el",
        filter
      );
    }

    if (tipo == "SGCM") {
      const div = document.getElementById("divOptionsQUERY_PG2023");
      const ext_prop = div.querySelector("#selectEP").value;
      const dominio = div.querySelector("#selectDOM").value;
      const dotacional = div.querySelector("#selectDOT").value;
      const ordenacion = div.querySelector("#selectORD").value;

      if (ext_prop !== "TOTS") filter += ` AND ext_prop='${ext_prop}'`;
      if (dominio !== "TOTS") filter += ` AND dominio='${dominio}'`;
      if (dotacional !== "TOTS")
        filter += ` AND identificacio_='${dotacional}'`;
      if (ordenacion !== "TOTS") filter += ` AND ordenacion='${ordenacion}'`;

      this.querySGCM(
        "Sistema General comunicaciones (PG2023)",
        "pg_dotac_sg_cm",
        filter
      );
    }

    if (tipo == "SGIF") {
      const div = document.getElementById("divOptionsQUERY_PG2023");
      const ext_prop = div.querySelector("#selectEP").value;
      const dominio = div.querySelector("#selectDOM").value;
      const dotacional = div.querySelector("#selectDOT").value;
      const ordenacion = div.querySelector("#selectORD").value;

      if (ext_prop !== "TOTS") filter += ` AND ext_prop='${ext_prop}'`;
      if (dominio !== "TOTS") filter += ` AND dominio='${dominio}'`;
      if (dotacional !== "TOTS")
        filter += ` AND identificacio_='${dotacional}'`;
      if (ordenacion !== "TOTS") filter += ` AND ordenacio='${ordenacion}'`;

      this.querySGIF(
        "Sistema General InfraestructUras (PG2023)",
        "pg_dotac_sg_if",
        filter
      );
    }

    if (tipo == "SGSU") {
      const div = document.getElementById("divOptionsQUERY_PG2023");
      const ext_prop = div.querySelector("#selectEP").value;
      const dominio = div.querySelector("#selectDOM").value;
      const dotacional = div.querySelector("#selectDOT").value;
      const ordenacion = div.querySelector("#selectORD").value;

      if (ext_prop !== "TOTS") filter += ` AND ext_prop='${ext_prop}'`;
      if (dominio !== "TOTS") filter += ` AND dominio='${dominio}'`;
      if (dotacional !== "TOTS")
        filter += ` AND identificacio_='${dotacional}'`;
      if (ordenacion !== "TOTS") filter += ` AND ordenacio='${ordenacion}'`;

      this.querySGSU(
        "Sistema General Servicios urbanos (PG2023)",
        "pg_dotac_sg_su",
        filter
      );
    }

    if (tipo == "AANP") {
      const div = document.getElementById("divOptionsQUERY_PG2023");
      const subcategoria = div.querySelector("#selectSUBCATE").value;
      const zona = div.querySelector("#selectZONA").value;
      const prot = div.querySelector("#selectPROT").value;
      const fprot = div.querySelector("#selectFPROT").value;
      const tipo = div.querySelector("#selectAANPTIPO").value;

      filter = "categoria='AANP'";

      if (subcategoria !== "TOTS")
        filter += ` AND subcategoria='${subcategoria}'`;
      if (zona !== "TOTS") filter += ` AND zona='${zona}'`;
      if (prot !== "TOTS") filter += ` AND pla_proteccio like '%${prot}%'`;
      if (fprot !== "TOTS") filter += ` AND proteccio like '%${fprot}%'`;
      if (tipo !== "TOTS") filter += ` AND tipus='${tipo}'`;

      this.queryRUSTICO(
        "Categoria rústico (AANP) (PG2023)",
        "pg_rustic",
        filter
      );
    }

    if (tipo == "ANEI") {
      const div = document.getElementById("divOptionsQUERY_PG2023");
      const subcategoria = div.querySelector("#selectSUBCATE").value;
      const zona = div.querySelector("#selectZONA").value;
      const prot = div.querySelector("#selectPROT").value;
      const fprot = div.querySelector("#selectFPROT").value;

      filter = "categoria='ANEI'";

      if (subcategoria !== "TOTS")
        filter += ` AND subcategoria='${subcategoria}'`;
      if (zona !== "TOTS") filter += ` AND zona='${zona}'`;
      if (prot !== "TOTS") filter += ` AND pla_proteccio like '%${prot}%'`;
      if (fprot !== "TOTS") filter += ` AND proteccio like '%${fprot}%'`;

      this.queryRUSTICO(
        "Categoria rústico (ANEI) (PG2023)",
        "pg_rustic",
        filter
      );
    }

    if (tipo == "AIN") {
      const div = document.getElementById("divOptionsQUERY_PG2023");
      const subcategoria = div.querySelector("#selectSUBCATE").value;
      const zona = div.querySelector("#selectZONA").value;
      const prot = div.querySelector("#selectPROT").value;
      const fprot = div.querySelector("#selectFPROT").value;
      const tipo = div.querySelector("#selectAINTIPO").value;

      filter = "categoria='AIN'";

      if (subcategoria !== "TOTS")
        filter += ` AND subcategoria='${subcategoria}'`;
      if (zona !== "TOTS") filter += ` AND zona='${zona}'`;
      if (prot !== "TOTS") filter += ` AND pla_proteccio like '%${prot}%'`;
      if (fprot !== "TOTS") filter += ` AND proteccio like '%${fprot}%'`;
      if (tipo !== "TOTS") filter += ` AND tipus='${tipo}'`;

      this.queryRUSTICO(
        "Categoria rústico (AIN) (PG2023)",
        "pg_rustic",
        filter
      );
    }

    if (tipo == "ARIP") {
      const div = document.getElementById("divOptionsQUERY_PG2023");
      const zona = div.querySelector("#selectZONA").value;

      filter = "categoria='ARIP'";

      if (zona !== "TOTS") filter += ` AND zona='${zona}'`;

      this.queryRUSTICO(
        "Categoria rústico (ARIP) (PG2023)",
        "pg_rustic",
        filter
      );
    }

    if (tipo == "ZIP") {
      const div = document.getElementById("divOptionsQUERY_PG2023");
      const subcategoria = div.querySelector("#selectSUBCATE").value;

      filter = "categoria='ZIP'";

      if (subcategoria !== "TOTS")
        filter += ` AND subcategoria='${subcategoria}'`;

      this.queryRUSTICO(
        "Categoria rústico (ZIP) (PG2023)",
        "pg_rustic",
        filter
      );
    }

    if (tipo == "AIA") {
      const div = document.getElementById("divOptionsQUERY_PG2023");
      const subcategoria = div.querySelector("#selectSUBCATE").value;

      filter = "categoria='AIA'";

      if (subcategoria !== "TOTS")
        filter += ` AND subcategoria='${subcategoria}'`;

      this.queryRUSTICO_COMUN(
        "Categoria rústico (AIA) (PG2023)",
        "pg_rustic",
        filter
      );
    }

    if (tipo == "AT") {
      const div = document.getElementById("divOptionsQUERY_PG2023");
      const subcategoria = div.querySelector("#selectSUBCATE").value;

      filter = "categoria='AT'";

      if (subcategoria !== "TOTS")
        filter += ` AND subcategoria='${subcategoria}'`;

      this.queryRUSTICO_COMUN(
        "Categoria rústico (AT) (PG2023)",
        "pg_rustic",
        filter
      );
    }

    if (tipo == "SRG") {
      const elemOptions = document.getElementById("divOptionsQUERY_PG2023");
      elemOptions.innerHTML = "";

      filter = "categoria='SRG'";

      this.queryRUSTICO_COMUN(
        "Categoria rústico (SRG) (PG2023)",
        "pg_rustic",
        filter
      );
    }

    if (tipo == "NR") {
      const elemOptions = document.getElementById("divOptionsQUERY_PG2023");
      elemOptions.innerHTML = "";

      filter = "categoria='NR'";

      this.queryNUCLEO_RURAL(
        "Categoria rústico (NR) (PG2023)",
        "pg_rustic",
        filter
      );
    }

    if (tipo == "SUB") {
      const div = document.getElementById("divOptionsQUERY_PG2023");
      const uso = div.querySelector("#selectUSOS").value;

      filter = "codi<>'-'";

      if (uso !== "TOTS") filter += ` AND us='${uso}'`;

      this.queryURBANIZABLE(
        "Urbanizables (PG2023)",
        "pg_urbanitzable",
        filter
      );
    }

    if (tipo == "NADA") {
      const elemOptions = document.getElementById("divOptionsQUERY_PG2023");
      elemOptions.innerHTML = "";
      const elemQuery = document.getElementById("divQUERY_PG2023");
      elemQuery.innerHTML = "";
    }

    console.log(filter);
  }

  createSelectTABLE() {
    const strOptionsTables = `
        <option value="NADA" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optNADA">-</option>
        <optgroup label="Sistemas Generales" style='background-color:white;font-size:7.5pt.5pt;font-family:Arial Black;color:black'>
            <option value="SGEC" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black'
            id="optSGEC" name="(SGEC) Equipamientos Comunitarios">(SGEC) Equipamientos Comunitarios</option>
            <option value="SGEL" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optSGEL">(SGEL) Espacios Libres</option>
            <option value="SGCM" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optSGCM">(SGCM) Comunicaciones</option>
            <option value="SGIF" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optSGIF">(SGIF) Infraestructuras</option>
            <option value="SGSU" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optSGSU">(SGSU) Servicios Urbanos </option>
        </optgroup>
        <optgroup label="(SRP) Suelo Rústico Protegido" style='background-color:white;font-size:7.5pt.5pt;font-family:Arial Black;color:black'>
            <option value="AANP" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optAANP">(AANP) Áreas naturales de especial interés de alto nivel de protección</option>
            <option value="ANEI" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optANEI">(ANEI) Áreas naturales de especial interés</option>
            <option value="AIN" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optAIN-PG">(AIN) Áreas de Interés Natural para planeamiento general</option>
            <option value="ARIP" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optARIP">(ARIP) Áreas Rurales de Interés Paisajístico</option>
            <option value="ZIP" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optZIP">(ZIP) Zonas de Interés Paisajístico protegidas por planeamiento general.</option>
        </optgroup>
        <optgroup label="(SRC) Suelo Rústico Común" style='background-color:white;font-size:7.5pt.5pt;font-family:Arial Black;color:black'>
            <option value="AIA" style='font-size:7.5pt.5pt;font-family:Arial;Arial;background-color:white;color:black' id="optAIA">(AIA) Áreas de Interés Agrario.</option>
            <option value="AT" style='font-size:7.5pt.5pt;font-family:Arial;Arial;background-color:white;color:black' id="optAT-H">(AT) Áreas de transición</option>
            <option value="SRG" style='font-size:7.5pt.5pt;font-family:Arial;Arial;background-color:white;color:black' id="optSRG">(SRG) Áreas de suelo rústico de régimen general.</option>
        </optgroup>
        <option value="NR" style='font-size:7.5pt.5pt;font-family:Arial Black;Arial;background-color:white;color:black' id="optNR">(NR) Suelo Rústico categoría de Núcleo Rural</option>
        <option value="SUB" style='font-size:7.5pt.5pt;font-family:Arial Black;Arial;background-color:white;color:black' id="optSUB">(SUB) Suelo Urbanizable</option>
        `;

    const strSelectTABLE_RPG = `    
          <select style='background-color:#5b9ec1;color:white;padding:2px;font-size:9pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="selectTablesPG2023" id="selectTablesPG2023" >
          
              ${strOptionsTables}
          </select>
          `;

    return strSelectTABLE_RPG;
  }

  /**
   * Crea y devuelve una cadena HTML que representa un elemento de selección (select) con opciones de tablas para consulta.
   *
   * @returns {string} Cadena HTML que representa el elemento de selección (select).
   */
  async setOptionsQUERY() {
    const elemTables = document.getElementById("selectTablesPG2023");
    const tipo = elemTables.value;

    console.log(tipo);

    switch (tipo) {
      case "NADA":
        this.changeQUERY();
        break;
      case "SGEC":
        await this.setOptionsSGEC();
        break;
      case "SGEL":
        await this.setOptionsSGEL();
        break;
      case "SGCM":
        await this.setOptionsSGCM();
        break;
      case "SGIF":
        await this.setOptionsSGIF();
        break;
      case "SGSU":
        await this.setOptionsSGSU();
        break;
      case "AANP":
        await this.setOptionsAANP();
        break;
      case "ANEI":
        await this.setOptionsANEI();
        break;
      case "AIN":
        await this.setOptionsAIN();
        break;
      case "ARIP":
        await this.setOptionsARIP();
        break;
      case "ZIP":
        await this.setOptionsZIP();
        break;
      case "AIA":
        await this.setOptionsAIA();
        break;
      case "AT":
        await this.setOptionsAT();
        break;
      case "SRG":
        this.changeQUERY();
        break;
      case "NR":
        this.changeQUERY();
        break;
      case "SUB":
        await this.setOptionsSUB();
        break;
    }

    this.changeQUERY();
  }

  /**
   * Configura las opciones para la subcategoría de SUB y establece un controlador de eventos de cambio.
   */
  async setOptionsSUB() {
    // Definición de las opciones de subcategoría
    const strOptionsUSOS = `
			<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_USOS">TOTS</option>
			<option value="RES" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optRES">RESIDENCIAL</option>
			<option value="TER" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTER">TERCIARIO</option>
		
		 `;

    // Creación del elemento select para subcategoría
    const strSelectUSOS = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectUSOS" >
			${strOptionsUSOS}
			</select>`;

    // Creación de la tabla de opciones
    const html = `
		<TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
		
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>SUBCATEGORIA</label></td>
						<td>${strSelectUSOS}</td>
				
				</tr>  
		
		</TABLE>`;

    // Obtención del elemento contenedor de opciones
    var elemOptions = document.getElementById("divOptionsQUERY_PG2023");
    elemOptions.innerHTML = html;

    const self = this;
    const elem = elemOptions.querySelectorAll("select[name='select']");
    for (const select of elem) {
      // Configuración del controlador de eventos de cambio
      select.onchange = function () {
        self.changeQUERY();
      };
    }
  }

  /**
   * Configura las opciones para la subcategoría (AT) de consulta y establece un controlador de eventos de cambio.
   */
  async setOptionsAT() {
    // Definición de las opciones de subcategoría (AT)
    const strOptionsSUBCATE = `
			<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_SUBCAT">TOTS</option>
			<option value="-" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="opt_">-</option>
			<option value="AT-C" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optAT-C">(AT-C) Crecimiento</option>
			<option value="AT-H" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optAT-H">(AT-H) Armonización</option>
			`;

    // Creación del elemento select para subcategoría (AT)
    const strSelectSUBCATE = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectSUBCATE" >
			${strOptionsSUBCATE}
			</select>`;

    // Creación de la tabla de opciones
    const html = `
		<TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
		
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>SUBCATEGORIA</label></td>
						<td>${strSelectSUBCATE}</td>
				
				</tr>  
		
		</TABLE>`;

    // Obtención del elemento contenedor de opciones
    var elemOptions = document.getElementById("divOptionsQUERY_PG2023");
    elemOptions.innerHTML = html;

    const self = this;
    const elem = elemOptions.querySelectorAll("select[name='select']");
    for (const select of elem) {
      // Configuración del controlador de eventos de cambio
      select.onchange = function () {
        self.changeQUERY();
      };
    }
  }

  /**
   * Configura las opciones para la subcategoría (AIA) de consulta y establece un controlador de eventos de cambio.
   */
  async setOptionsAIA() {
    // Definición de las opciones de subcategoría (AIA)
    const strOptionsSUBCATE = `
			<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_SUBCAT">TOTS</option>
			<option value="AIA-I_40" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optAIA-40">(AIA-40) Zones d'alt valor edafològic,</option>
			<option value="AIA-I_100" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optAIA-100">(AIA-100) zones d'interès agrari de terrenys de secà</option>
			`;

    // Creación del elemento select para subcategoría (AIA)
    const strSelectSUBCATE = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectSUBCATE" >
			${strOptionsSUBCATE}
			</select>`;

    // Creación de la tabla de opciones
    const html = `
		<TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
		
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>SUBCATEGORIA</label></td>
						<td>${strSelectSUBCATE}</td>
				
				</tr>  
		
		</TABLE>`;

    // Obtención del elemento contenedor de opciones
    var elemOptions = document.getElementById("divOptionsQUERY_PG2023");
    elemOptions.innerHTML = html;

    const self = this;
    const elem = elemOptions.querySelectorAll("select[name='select']");
    for (const select of elem) {
      // Configuración del controlador de eventos de cambio
      select.onchange = function () {
        self.changeQUERY();
      };
    }
  }

  /**
   * Configura las opciones para la subcategoría (ZIP) de consulta y establece un controlador de eventos de cambio.
   */
  async setOptionsZIP() {
    // Definición de las opciones de subcategoría (ZIP)
    const strOptionsSUBCATE = `
			<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_SUBCAT">TOTS</option>
			<option value="ZIP-EM" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optZIP-EM">(ZIP-EM) Zona Rural el Molinar</option>
			<option value="ZIP-EMR" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optZIP-EMR">(ZIP-EMR) Entorno Monasterio Real</option>
			<option value="ZIP-PV" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optZIP-PV">(ZIP-PV) Zona Rural Son Rapinya-Puigdorfila Vell</option>
			`;

    // Creación del elemento select para subcategoría (ZIP)
    const strSelectSUBCATE = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectSUBCATE" >
			${strOptionsSUBCATE}
			</select>`;

    // Creación de la tabla de opciones
    const html = `
		<TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
		
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>SUBCATEGORIA</label></td>
						<td>${strSelectSUBCATE}</td>
				
				</tr>  
		
		</TABLE>`;

    // Obtención del elemento contenedor de opciones
    var elemOptions = document.getElementById("divOptionsQUERY_PG2023");
    elemOptions.innerHTML = html;

    const self = this;
    const elem = elemOptions.querySelectorAll("select[name='select']");
    for (const select of elem) {
      // Configuración del controlador de eventos de cambio
      select.onchange = function () {
        self.changeQUERY();
      };
    }
  }

  /**
   * Configura las opciones para la zona (ARIP) de consulta y establece un controlador de eventos de cambio.
   */
  async setOptionsARIP() {
    // Definición de las opciones de zona (ARIP)
    const strOptionsZONA = `
			<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_SUBCAT">TOTS</option>
			<option value="ZL" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optZL">(ZL) Zona de Levante</option>
			<option value="ZP" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optZP">(ZP) Zona de Poniente</option>
			`;

    // Creación del elemento select para zona (ARIP)
    const strSelectZONA = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectZONA" >
			${strOptionsZONA}
			</select>`;

    // Creación de la tabla de opciones
    const html = `
		<TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
		
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>ZONA</label></td>
						<td>${strSelectZONA}</td>
				
				</tr>  
		
		</TABLE>`;

    // Obtención del elemento contenedor de opciones
    var elemOptions = document.getElementById("divOptionsQUERY_PG2023");
    elemOptions.innerHTML = html;

    const self = this;
    const elem = elemOptions.querySelectorAll("select[name='select']");
    for (const select of elem) {
      // Configuración del controlador de eventos de cambio
      select.onchange = function () {
        self.changeQUERY();
      };
    }
  }

  /**
   * Configura las opciones para la subcategoría (AIN) de consulta y establece controladores de eventos de cambio.
   */
  async setOptionsAIN() {
    // Definición de las opciones de subcategoría (AIN)
    const strOptionsSUBCATE = `
			<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_SUBCAT">TOTS</option>
			<option value="AIN-AA" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optAA">(AIN-AA) Zones agràries d'interès ambiental</option>
			<option value="AIN-FO_PP" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optAIN-FO_PP">(AIN-FO_PP) Forestal qualificades de Parc Públic Periurbà </option>
			<option value="AIN-FO_ZB" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optAIN-FO_ZB">(AIN-FO_ZB) Forestal altres zones boscosas</option>
			<option value="AIN-RM" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optAIN-RM">(AIN-RM) Domini públic natural de la ribera de la mar</option>
			<option value="AIN-XT" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optAIN-XF_T">(AIN-XT) Zona de Servitud més part de Policia</option>
			<option value="AIN-ZH" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optAIN-XF_T">(AIN-ZH) Humedal</option>
			`;

    // Creación del elemento select para subcategoría (AIN)
    const strSelectSUBCATE = `<select style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectSUBCATE" >
			${strOptionsSUBCATE}
			</select>`;

    // Definición de las opciones de zona
    const strOptionsZONA = `
			<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_PROT">TOTS</option>
			<option value="-" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optNO">-</option>
			<option value="BV" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optZona_BV">(BV) Bellver</option>
			<option value="CO" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optZona_CO">(CO) Costa</option>  
			<option value="LV" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optZona_LV">(LV) Zona de Levante</option>  
			<option value="PP" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optZona_PP">(PP) Humedal del Prat des Pil-Lari</option>  
			<option value="PU" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optZona_PU">(PU) Puntiró</option>
			<option value="SF" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optZona_SF">(SF) Humedal de Ses Fontanelles</option>
			<option value="SG" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optZona_SG">(SG) Son Gual</option>  
			<option value="ZP" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optZona_ZP">(ZP) Zona de Poniente</option>  
			`;

    // Creación del elemento select para zona
    const strSelectZONA = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectZONA" >
			${strOptionsZONA}
			</select>`;

    const strOptionsPROT = `
			<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_PROT">TOTS</option>
			<option value="-" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optNO">-</option>
			<option value="PHDIB-MAM727" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optPHDIB-MAM727">(PHDIB-MAM727) Plan Hidrologico de la demarcación Hidrográfica de las Islas Baleares</option>
			<option value="PHDIB-MAZH26" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optPHDIB-MAZH26">(PHDIB-MAZH26) Plan Hidrologico de la demarcación Hidrográfica de las Islas Baleares</option>
			`;

    const strSelectPROT = `<select style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectPROT" >
			${strOptionsPROT}
			</select>`;

    const strOptionsFPROT = `
			<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_PROT">TOTS</option>
			<option value="-" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optNO">-</option>
			<option value="Legislación de Costas " style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optLEG_COSTAS">Ley 22/1988, de 20 de Julio de Costas</option>
				`;

    const strSelectFPROT = `<select style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectFPROT" >
			${strOptionsFPROT}
			</select>`;

    const strOptionsTIPO = `
			<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_PROT">TOTS</option>
			<option value="AL" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optAG">(AL) Encinares</option>
			<option value="F" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optF">(F) Terreno con características Forestales y Ecológicas</option>
			<option value="LE" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optSA">(LE) Lentisco</option>
			<option value="PI" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optSA">(PI) Pinar</option>
			<option value="ULL" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optBA">(ULL) Acebuchales</option>
			<option value="ZH" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optZAL">(ZH) Humedal</option>
			`;

    const strSelectTIPO = `<select style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectAINTIPO" >
			${strOptionsTIPO}
			</select>`;

    const html = `
		<TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
		
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>SUBCATEGORIA</label></td>
						<td>${strSelectSUBCATE}</td>
				
				</tr>
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>ZONA</label></td>
						<td>${strSelectZONA}</td>
				
				</tr>  
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>PLAN PROTECCIÓN</label></td>
						<td>${strSelectPROT}</td>
				
				</tr>
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>PROTECCIÓN</label></td>
						<td>${strSelectFPROT}</td>
				
				</tr>  
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>TIPO</label></td>
						<td>${strSelectTIPO}</td>
				
				</tr>  
				
				
			
		</TABLE>`;

    var elemOptions = document.getElementById("divOptionsQUERY_PG2023");
    elemOptions.innerHTML = html;

    const self = this;
    const elem = elemOptions.querySelectorAll("select[name='select']");
    for (const select of elem) {
      select.onchange = function () {
        self.changeQUERY();
      };
    }
  }

  /**
   * Configura las opciones para la subcategoría (ANEI) de consulta y establece controladores de eventos de cambio.
   */
  async setOptionsANEI() {
    // Definición de las opciones de subcategoría (ANEI)
    const strOptionsSUBCATE = `
			<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_SUBCAT">TOTS</option>
			<option value="ANEI-PN" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optANEI-PN">(ANEI-PN) ANEI localitzats en Paratge Natural.</option>
			<option value="ANEI-GE" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optANEI-SGIXO">(ANEI-GE) ANEI General, localitzats fora de Paratge Natural. </option>
			`;

    // Creación del elemento select para subcategoría (ANEI)
    const strSelectSUBCATE = `<select style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectSUBCATE" >
			${strOptionsSUBCATE}
			</select>`;

    // Definición de las opciones de zona
    const strOptionsZONA = `
			<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_PROT">TOTS</option>
			<option value="BX" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optZona_BX">(BX) Barrancos de Son Gual y Xorrigo</option>
			<option value="ST" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optZona_ST">(ST) Sierra de Tramuntana</option>  
			`;

    // Creación del elemento select para zona
    const strSelectZONA = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectZONA" >
			${strOptionsZONA}
			</select>`;

    // Definición de las opciones de plan de protección
    const strOptionsPROT = `
			<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_PROT">TOTS</option>
			<option value="-" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optNO">-</option>
			<option value="PORNST" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optPORNST">(PORNST) Pla d ´Ordenació de Recursos Naturals Serra de Tramuntana</option>
			`;

    // Creación del elemento select para plan de protección
    const strSelectPROT = `<select style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectPROT" >
			${strOptionsPROT}
			</select>`;

    // Definición de las opciones de protección
    const strOptionsFPROT = `
			<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_PROT">TOTS</option>
			<option value="No" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optNO">No</option>
			<option value="PNST" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optPNST">(PNST) Paraje Natural Sierra de Tramuntana</option>
			`;

    // Creación del elemento select para protección
    const strSelectFPROT = `<select style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectFPROT" >
			${strOptionsFPROT}
			</select>`;

    // Creación de la estructura HTML para las opciones de consulta
    const html = `
		<TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
		
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>SUBCATEGORIA</label></td>
						<td>${strSelectSUBCATE}</td>
				
				</tr>
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>ZONA</label></td>
						<td>${strSelectZONA}</td>
				
				</tr>  
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>PLÀ PROTECCIÓ</label></td>
						<td>${strSelectPROT}</td>
				
				</tr>
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>PROTECCIÓ</label></td>
						<td>${strSelectFPROT}</td>
				
				</tr>  
				
			
		</TABLE>`;

    var elemOptions = document.getElementById("divOptionsQUERY_PG2023");
    elemOptions.innerHTML = html;

    const self = this;
    const elem = elemOptions.querySelectorAll("select[name='select']");
    for (const select of elem) {
      select.onchange = function () {
        console.log("pasa para change");
        self.changeQUERY();
      };
    }
  }

  /**
   * Configura las opciones para la subcategoría (AANP) de consulta y establece controladores de eventos de cambio.
   */
  async setOptionsAANP() {
    const strOptionsSUBCATE = `
			<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_SUBCAT">TOTS</option>
			<option value="AANP-AC" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optAANP-AC">(AANP-AC) Parc Nacional Marítim-Terrestre de l'Arxipèlag de Cabrera</option>
			<option value="AANP-AV" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optAANP-AV">(AANP-AV) ZEC ES5310042 Avenc d’a Corbera (AV)</option>
			<option value="AANP-GE" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optAANP-GE">(AANP-GE)  Subcategoria AANP de règim general</option>
			<option value="AANP-PN" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optAANP-PN">(AANP-PN) Hàbitats i formacions geològiques, ANEI 47 Paratge Natural Serra Tramuntana</option>
			<option value="AANP-PU" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optAANP-PU">(AANP-PU) ZEC ES5310080 de Puigpunyent (PU)</option>
			<option value="AANP-XO" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optAANP-XO">(AANP-XO) ZEC  ES5310102 Xorrigo</option>
			`;
    const strSelectSUBCATE = `<select style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectSUBCATE" >
			${strOptionsSUBCATE}
			</select>`;

    const strOptionsZONA = `
			<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_PROT">TOTS</option>
			<option value="AC" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optZona_AC">(AC) Archipielago de Cabrera</option>
			<option value="BX" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optZona_BX">(BX) Barrancos de Son Gual y Xorrigo</option>
			<option value="CO" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optZona_CO">(CO) Costa</option>
			<option value="ST" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optZona_ST">(ST) Sierra de Tramuntana</option>  
			`;

    const strSelectZONA = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectZONA" >
			${strOptionsZONA}
			</select>`;

    const strOptionsPROT = `
			<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_PROT">TOTS</option>
			<option value="-" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optNO">Sense plà protecció</option>
			<option value="PGXN2000BMM" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optPGXN2000BMM">(PGXN2000BMM) Pla de Gestió  Xarxa Natura 2000 Barrancs i montes de Mallorca</option>
			<option value="PGXN2000C" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optPGXN2000C">(PGXN2000C) Pla de Gestió Xarxa Natura 2000 Coves</option>
			<option value="PGXN2000ST" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optPGXN2000ST">(PGXN2000ST) Pla de Gestió Xarxa natura 2000  Serra de Tramuntana</option>
			<option value="PORNST" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optPORNST">(PORNST) Pla d ´Ordenació de Recursos Naturals Serra de Tramuntana</option>
			<option value="PRUGAC" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optPRUGAC">(PRUGAC) Pla Rector d'Usos i Gestió Arxipielag de Cabrera</option>
			<option value="PGXN2000AC" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optPGXN2000AC">(PGXN2000AC) Pla de Gestió Xarxa Natura 2000 Arxipielag de Cabrera</option>  
			`;

    const strSelectPROT = `<select style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectPROT" >
			${strOptionsPROT}
			</select>`;

    const strOptionsFPROT = `
			<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_PROT">TOTS</option>
			<option value="-" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optNO_">-</option>
			<option value="No" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optNO">No</option>
			<option value="PNMTAC" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optPNMTAC">(PNMTAC) Parque Nacional Marí­timo Terrestre del Archipielago de Cabrera</option>
			<option value="ZEC ES/000083" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optPZEC_ES000083">(ZEC ES/000083) ZEC Archipielago de Cabrera, Zona de Especial Conservación ZEC ES/000083</option>
			<option value="PNST" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optPNST">(PNST) Paraje Natural Sierra de Tramuntana</option>
			<option value="ZEC/ES5310042" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optZEC_ES5310042">(ZEC/ES5310042) Zona de Especial conservación ZEC/ES5310042 Avenc d´en Corbera</option>
			<option value="ZEC/ES5310080" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optZEC_ES5310080">(ZEC/ES5310080 Puigpunyent) Zona Especial de Conservación ZEC/ES5310080 Puigpunyent,</option>
			<option value="ZEC/ES5310102" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optZEC_ES5310102">(ZEC/ES5310102 Xorrigo) Zona Especial de Conservación ZEC/ES5310102 Xorrigo</option>  
			`;

    const strSelectFPROT = `<select style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectFPROT" >
			${strOptionsFPROT}
			</select>`;

    const strOptionsTIPO = `
			<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_PROT">TOTS</option>
			<option value="AC" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optAC">(AC) Archipielago</option>
			<option value="AL" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optAL">(AL) Encinares</option>
			<option value="AV" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optAV">(AV) Avenc</option>
			<option value="BA" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optBA">(BA) Barrancos</option>
			<option value="CI" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optCI">(CI) Cimas y Peñascos más significativos </option>
			<option value="CV" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optCV">(CV) Comunidades Vegetales de Litoral Rocoso</option>
			<option value="FG" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optFG">(FG) Formaciones Geomorfológicas</option>
			<option value="ILL" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optILL">(ILL) Islote</option>
			<option value="ULL" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optULL">(ULL) Acebuchales</option> 
			`;

    const strSelectTIPO = `<select style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectAANPTIPO" >
			${strOptionsTIPO}
			</select>`;

    const html = `
		<TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
		
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>SUBCATEGORIA</label></td>
						<td>${strSelectSUBCATE}</td>
				
				</tr>
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>ZONA</label></td>
						<td>${strSelectZONA}</td>
				
				</tr>  
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>PLÀ PROTECCIÓ</label></td>
						<td>${strSelectPROT}</td>
				
				</tr>
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>PROTECCIÓ</label></td>
						<td>${strSelectFPROT}</td>
				
				</tr>
				<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>TIPUS</label></td>
						<td>${strSelectTIPO}</td>
				
				</tr>          
				
			
		</TABLE>`;

    var elemOptions = document.getElementById("divOptionsQUERY_PG2023");
    elemOptions.innerHTML = html;

    const self = this;
    const elem = elemOptions.querySelectorAll("select[name='select']");
    for (const select of elem) {
      select.onchange = function () {
        console.log("pasa para change");
        self.changeQUERY();
      };
    }
  }

  /**
   * Configura las opciones para la consulta de SGSU y establece controladores de eventos de cambio.
   */
  async setOptionsSGSU() {
    // Definición de las opciones de existente/propuesto (EP)
    const strOptionsEP = `
				<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_EP">TOTS</option>
				<option value="Existente" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optE">EXISTENTE</option>
				<option value="Propuesto" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optP">PROPUESTO</option>
				`;

    // Definición de las opciones de dominio (DOMINIO)
    const strOptionsDOMINIO = `
				<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_DM">TOTS</option>
				<option value="Público" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optPBL">PÚBLICO</option>
				<option value="Privado" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optPRV">PRIVADO</option>
				`;

    // Definición de las opciones de uso dotacional (DOTACIONAL)
    const strOptionsDOTACIONAL = `
				<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS">TOTS</option>;
				<option value="AC" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optAC">OTROS CENTROS MUNICIPALES</option>
				<option value="CE" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optCE">CEMENTERIO</option>
				<option value="CP" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optCP">CENTRO PENITENCIARIO</option>
				<option value="GR" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optGR">CENTRO GESTIÓN RESIDUOS</option>
				<option value="IT" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optIT">INSPECCIÓN TÉCNICA DE VEHICULOS</option>
				<option value="MA" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optMA">CENTRO ABASTECIMIENTO GENERAL ALIMENTARIO</option>
				<option value="SE" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optSE">SEGURIDAD Y DEFENSA</option>
				`;

    // Consulta para obtener las opciones de ordenación (ORD)
    const reader = new DataReader();
    let info_ordenacion = await reader.selectSQL(
      "SELECT ordenacio from pg_dotac_sg_su group by ordenacio  order by ordenacio"
    );

    // Construcción de las opciones de ordenación (ORD) a partir de los resultados de la consulta
    let strOptionsORD = `<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_ORD">TOTS</option>`;

    info_ordenacion.forEach((item) => {
      strOptionsORD += `
              <option value="${item.ordenacio}" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="opt${item.ordenacio}">
                ${item.ordenacio}
              </option>`;
    });

    // Creación de los elementos select para EP, DOMINIO, DOTACIONAL y ORD
    const strSelectEP = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectEP" >
                    ${strOptionsEP}
                    </select>`;
    const strSelectDOMINIO = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectDOM" >
                    ${strOptionsDOMINIO}
                    </select>`;
    const strSelectDOTACIONAL = `<select style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectDOT" >
                    ${strOptionsDOTACIONAL}
                    </select>`;
    const strSelectORD = `<select style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectORD" >
          ${strOptionsORD}
          </select>`;

    // Creación del HTML para la tabla de opciones
    const html = `
          <TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
          
              <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
                  <td> <LABEL  style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>EXISTENT/PROPOST</label></td>
                  <td>${strSelectEP}</td>       
              </tr>    
              <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
                  <td><LABEL  style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>DOMINI</label></td>
                  <td>${strSelectDOMINIO}</td>         
              </tr> 
              <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
                  <td><LABEL  style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>USO DOTACIONAL</label></td>
                  <td>${strSelectDOTACIONAL}</td>         
              </tr> 
              <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
                  <td><LABEL  style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>ORDENACIÓN</label></td>
                  <td>${strSelectORD}</td>         
              </tr> 
             
           
          </TABLE>`;

    console.log("crear html sgif");
    var elemOptions = document.getElementById("divOptionsQUERY_PG2023");
    elemOptions.innerHTML = html;

    const self = this;
    const elem = elemOptions.querySelectorAll("select[name='select']");
    for (const select of elem) {
      select.onchange = function () {
        console.log("pasa para change");
        self.changeQUERY();
      };
    }
  }

  /**
   * Configura las opciones para la consulta de SGIF y establece controladores de eventos de cambio.
   */
  async setOptionsSGIF() {
    // Definición de las opciones de existente/proposed (EP)
    const strOptionsEP = `
				<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_EP">TOTS</option>
				<option value="Existente" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optE">EXISTENTE</option>
				<option value="Propuesto" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optP">PROPUESTO</option>
				`;

    // Definición de las opciones de dominio (DOMINIO)
    const strOptionsDOMINIO = `
				<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_DM">TOTS</option>
				<option value="Público" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optPBL">PÚBLICO</option>
				<option value="Privado" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optPRV">PRIVADO</option>
				`;

    // Definición de las opciones de uso dotacional (DOTACIONAL)
    const strOptionsDOTACIONAL = `
				<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS">TOTS</option>;
				<option value="AG" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optAG">ABASTECIMIENTO</option>
				<option value="HG" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optHG">HIDROCARBUROS Y GAS</option>
				<option value="IE" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optIE">ELECTRICA</option>
				<option value="SA" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optSA">SANEAMIENTO</option>
				<option value="TC" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTC">INSTALACIÓN COMUNICACIONES</option>
				`;

    // Consulta para obtener las opciones de ordenación (ORD)
    const reader = new DataReader();
    let info_ordenacion = await reader.selectSQL(
      "SELECT ordenacio from pg_dotac_sg_if group by ordenacio  order by ordenacio"
    );

    // Construcción de las opciones de ordenación (ORD) a partir de los resultados de la consulta
    let strOptionsORD = `<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_ORD">TOTS</option>`;

    info_ordenacion.forEach((item) => {
      strOptionsORD += `
              <option value="${item.ordenacio}" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="opt${item.ordenacio}">
                ${item.ordenacio}
              </option>`;
    });

    // Creación de los elementos select para EP, DOMINIO, DOTACIONAL y ORD
    const strSelectEP = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectEP" >
                    ${strOptionsEP}
                    </select>`;
    const strSelectDOMINIO = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectDOM" >
                    ${strOptionsDOMINIO}
                    </select>`;
    const strSelectDOTACIONAL = `<select style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectDOT" >
                    ${strOptionsDOTACIONAL}
                    </select>`;
    const strSelectORD = `<select style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectORD" >
          ${strOptionsORD}
          </select>`;

    // Creación del HTML para la tabla de opciones
    const html = `
          <TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
          
              <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
                  <td> <LABEL  style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>EXISTENT/PROPOST</label></td>
                  <td>${strSelectEP}</td>       
              </tr>    
              <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
                  <td><LABEL  style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>DOMINI</label></td>
                  <td>${strSelectDOMINIO}</td>         
              </tr> 
              <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
                  <td><LABEL  style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>USO DOTACIONAL</label></td>
                  <td>${strSelectDOTACIONAL}</td>         
              </tr> 
              <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
                  <td><LABEL  style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>ORDENACIÓN</label></td>
                  <td>${strSelectORD}</td>         
              </tr> 
             
           
          </TABLE>`;

    console.log("crear html sgif");
    var elemOptions = document.getElementById("divOptionsQUERY_PG2023");
    elemOptions.innerHTML = html;

    const self = this;
    const elem = elemOptions.querySelectorAll("select[name='select']");
    for (const select of elem) {
      select.onchange = function () {
        console.log("pasa para change");
        self.changeQUERY();
      };
    }
  }

  /**
   * Configura las opciones para la consulta de SGCM y establece controladores de eventos de cambio.
   */
  async setOptionsSGCM() {
    // Definición de las opciones de existente/proposed (EP)
    const strOptionsEP = `
				<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_EP">TOTS</option>
				<option value="Existente" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optE">EXISTENTE</option>
				<option value="Propuesto" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optP">PROPUESTO</option>
				`;

    // Definición de las opciones de dominio (DOMINIO)
    const strOptionsDOMINIO = `
				<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_DM">TOTS</option>
				<option value="Público" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optPBL">PÚBLICO</option>
				<option value="Privado" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optPRV">PRIVADO</option>
				`;

    // Definición de las opciones de uso dotacional (DOTACIONAL)
    const strOptionsDOTACIONAL = `
				<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS">TOTS</option>;
				<option value="AP" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optAP">APARCAMIENTO DE VEHICULOS</option>
				<option value="RV" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optRV">RED VIARIA</option>
				<option value="TP_A" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTP_A">AEROPUERTO</option>
				<option value="TP_F" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTP_F">FERROVIARIO</option>
				<option value="TP-IT" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTP-IT">INTERCAMBIADORES DE TRANSPORTES</option>
				<option value="TP-P" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTP-P">PORTUARIO</option>
				<option value="TP-T" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTP-T">TRANVIARIO</option>
				`;

    // Consulta para obtener las opciones de ordenación (ORD)
    const reader = new DataReader();
    let info_ordenacion = await reader.selectSQL(
      "SELECT ordenacion from pg_dotac_sg_cm group by ordenacion  order by ordenacion"
    );

    // Construcción de las opciones de ordenación (ORD) a partir de los resultados de la consulta
    let strOptionsORD = `<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_ORD">TOTS</option>`;

    info_ordenacion.forEach((item) => {
      strOptionsORD += `
              <option value="${item.ordenacion}" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="opt${item.ordenacion}">
                ${item.ordenacion}
              </option>`;
    });

    // Creación de los elementos select para EP, DOMINIO, DOTACIONAL y ORD
    const strSelectEP = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectEP" >
                    ${strOptionsEP}
                    </select>`;
    const strSelectDOMINIO = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectDOM" >
                    ${strOptionsDOMINIO}
                    </select>`;
    const strSelectDOTACIONAL = `<select style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectDOT" >
                    ${strOptionsDOTACIONAL}
                    </select>`;
    const strSelectORD = `<select style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectORD" >
          ${strOptionsORD}
          </select>`;

    // Creación del HTML para la tabla de opciones
    const html = `
          <TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
          
              <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
                  <td> <LABEL  style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>EXISTENT/PROPOST</label></td>
                  <td>${strSelectEP}</td>       
              </tr>    
              <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
                  <td><LABEL  style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>DOMINI</label></td>
                  <td>${strSelectDOMINIO}</td>         
              </tr> 
              <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
                  <td><LABEL  style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>USO DOTACIONAL</label></td>
                  <td>${strSelectDOTACIONAL}</td>         
              </tr> 
              <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
                  <td><LABEL  style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>ORDENACIÓN</label></td>
                  <td>${strSelectORD}</td>         
              </tr> 
             
           
          </TABLE>`;

    var elemOptions = document.getElementById("divOptionsQUERY_PG2023");
    elemOptions.innerHTML = html;

    const self = this;
    const elem = elemOptions.querySelectorAll("select[name='select']");
    for (const select of elem) {
      select.onchange = function () {
        self.changeQUERY();
      };
    }
  }

  /**
   * Configura las opciones para la consulta de SG/EL y establece controladores de eventos de cambio.
   */
  async setOptionsSGEL() {
    // Definición de las opciones de existente/proposed (EP)
    const strOptionsEP = `
				<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_EP">TOTS</option>
				<option value="Existente" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optE">EXISTENTE</option>
				<option value="Propuesto" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optP">PROPUESTO</option>
				`;

    // Consulta para obtener las opciones de ordenación (ORD)
    const reader = new DataReader();
    let info_ordenacion = await reader.selectSQL(
      "SELECT ordenacion from pg_dotac_sg_eL group by ordenacion  order by ordenacion"
    );

    // Construcción de las opciones de ordenación (ORD) a partir de los resultados de la consulta
    let strOptionsORD = `<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_ORD">TOTS</option>`;

    info_ordenacion.forEach((item) => {
      strOptionsORD += `
				<option value="${item.ordenacion}" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="opt${item.ordenacion}">
					${item.ordenacion}
				</option>`;
    });

    // Creación de los elementos select para EP y ORD
    const strSelectEP = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectEP" >
				${strOptionsEP}
				</select>`;
    const strSelectORD = `<select style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectORD" >
				${strOptionsORD}
				</select>`;

    // Creación del HTML para la tabla de opciones
    const html = `
			<TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
			
					<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
							<td> <LABEL  style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>EXISTENT/PROPOST</label></td>
							<td>${strSelectEP}</td>       
					</tr>    
					<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
							<td><LABEL  style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>ORDENACIÓN</label></td>
							<td>${strSelectORD}</td>         
					</tr> 
				
			</TABLE>`;

    var elemOptions = document.getElementById("divOptionsQUERY_PG2023");
    elemOptions.innerHTML = html;

    const self = this;
    const elem = elemOptions.querySelectorAll("select[name='select']");
    for (const select of elem) {
      select.onchange = function () {
        self.changeQUERY();
      };
    }
  }

  /**
   * Configura las opciones para la consulta de SGEC y establece controladores de eventos de cambio.
   */
  async setOptionsSGEC() {
     // Definición de las opciones de existente/proposed (EP)
    const strOptionsEP = `
				<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_EP">TOTS</option>
				<option value="Existente" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optE">EXISTENTE</option>
				<option value="Propuesto" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optP">PROPUESTO</option>
				`;

    // Definición de las opciones de dominio (DOMINIO)
    const strOptionsDOMINIO = `
				<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_DM">TOTS</option>
				<option value="Público" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optPBL">PÚBLICO</option>
				<option value="Privado" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optPRV">PRIVADO</option>
				`;

    // Definición de las opciones de uso dotacional (DOTACIONAL)
    const strOptionsDOTACIONAL = `
				<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS">TOTS</option>;
				<option value="SC" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optSC">SOCIO ‐ CULTURAL</option>
				<option value="DO" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optDO">DOCENTE</option>
				<option value="SA" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optSA">SANITARIO</option>
				<option value="AS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optAS">ASISTENCIAL</option>
				<option value="DE" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optDE">DEPORTIVO</option>
				<option value="AI" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optAI">ADMINISTRATIVO - INSTITUCIONAL</option>
				<option value="AD" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optAD">ALOJAMIENTO DOTACIONAL</option>
				<option value="MM" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optMM">MERCADOS MUNICIPALES</option>
				<option value="ES" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optES">EQUIPAMIENTO DE ECONOMÍA SOCIAL</option>
				<option value="MF" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optMF">MULTIFUNCIONAL</option>
				`;

    // Consulta para obtener las opciones de ordenación (ORD)
    const reader = new DataReader();
    let info_ordenacion = await reader.selectSQL(
      "SELECT ordenacion from pg_dotac_sg_eq group by ordenacion  order by ordenacion"
    );

     // Construcción de las opciones de ordenación (ORD) a partir de los resultados de la consulta
    let strOptionsORD = `<option value="TOTS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTOTS_ORD">TOTS</option>`;

    info_ordenacion.forEach((item) => {
      strOptionsORD += `
              <option value="${item.ordenacion}" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="opt${item.ordenacion}">
                ${item.ordenacion}
              </option>`;
    });

    // Creación de los elementos select para EP, DOMINIO ORD y DOTACIONAL
    const strSelectEP = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectEP" >
                    ${strOptionsEP}
                    </select>`;
    const strSelectDOMINIO = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectDOM" >
                    ${strOptionsDOMINIO}
                    </select>`;
    const strSelectDOTACIONAL = `<select style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectDOT" >
                    ${strOptionsDOTACIONAL}
                    </select>`;
    const strSelectORD = `<select style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="select" id="selectORD" >
          ${strOptionsORD}
          </select>`;

    // Creación del HTML para la tabla de opciones
    const html = `
          <TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
          
              <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
                  <td> <LABEL  style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>EXISTENT/PROPOST</label></td>
                  <td>${strSelectEP}</td>       
              </tr>    
              <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
                  <td><LABEL  style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>DOMINI</label></td>
                  <td>${strSelectDOMINIO}</td>         
              </tr> 
              <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
                  <td><LABEL  style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>USO DOTACIONAL</label></td>
                  <td>${strSelectDOTACIONAL}</td>         
              </tr> 
              <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
                  <td><LABEL  style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>ORDENACIÓN</label></td>
                  <td>${strSelectORD}</td>         
              </tr> 
             
           
          </TABLE>`;

    console.log("pasa final option quer SLEQ");

    var elemOptions = document.getElementById("divOptionsQUERY_PG2023"); 
    elemOptions.innerHTML = html;

    const self = this;
    //const elem = document.getElementsByName("select");
    const elem = elemOptions.querySelectorAll("select[name='select']");
    for (const select of elem) {
      select.onchange = function () {
        self.changeQUERY();
      };
    }
  }
}
