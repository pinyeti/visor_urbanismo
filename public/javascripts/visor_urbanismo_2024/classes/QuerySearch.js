/**
 * Clase que representa un cuadro de diálogo de busquedas en el mapa por dirección o referencia catastral.
 * @memberof module:Frontend
 */
class QuerySearch {
  /**
   * Constructor de la clase QuerySearch.
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

    this.createHTML();
  }

  createHTML() {
    const divSEARCH = `<div id="divSEARCH" style='background-color:#f2f2f2;width:100%;height:70%'></div`;

    const divOptionsSEARCH = `<div id="divOptionsSEARCH" style='background-color:#f2f2f2;width:100%'></div`;

    // Diseño SEARCH DIALOG
    let html = "";
    html =
      html +
      `<div style='overflow: auto;padding:20px;background-color:#f2f2f2;border-style: solid;border-width:0pt;border-color:black;box-shadow: 3px 3px 3px 3px rgba(0, 0, 0, 0.2);position:absolute;width:90%;height:90%;top:10px;left:10px'>
				<LABEL style='padding:5px;font-size:8.5pt;font-family:Arial Black;background-color:#fdfde0;color:#1a4d1a;box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);border-style: solid;border-width:0.1pt;border-color:black;width:380px;height:20px;'>BUSQUEDA POR DIRECCIÓN / REF. CATASTRAL</LABEL><BR><BR>   
						
				${divOptionsSEARCH}
				<BR><BR> 
				${divSEARCH}
				<BR>   
			</div>`;

    const elem = document.getElementById("searchDir");
    elem.innerHTML = html;
    this.setOptionsSEARCH();
  }

  setOptionsSEARCH() {
    const html = `
    <TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>        
       
        <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
            <td><LABEL  style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>NOMBRE</label></td>
            <td><input type="text" style="width:96%" id="nameSearch" name="nameSearch" ></td>      
        </tr>
        <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
            <td><LABEL  style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>NUMERO</label></td>
            <td><input type="text" style="width:96%" id="numSearch" name="numSearch" ></td>      
        </tr>
        <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
            <td><LABEL  style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>REF. CATASTRAL</label></td>
            <td><input type="text" style="width:96%" id="refSearch" name="refSearch" ></td>      
        </tr>
        <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
            <td><LABEL  style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>MANZANA / POLIGONO (URBANO=5 DIGITOS, RÚSTICO=3 DIGITOS)</label></td>
            <td><input type="text" style="width:96%" id="manzanaSearch" name="manzanaSearch" ></td>      
        </tr>
        <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
            <td><LABEL  style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>PARCELA (URBANO=2 DIGITOS, RÚSTICO=5 DIGITOS)</label></td>
            <td><input type="text" style="width:96%" id="parcelaSearch" name="parcelaSearch" ></td>      
        </tr>
           
    </TABLE>`;

    var elem = document.getElementById("divOptionsSEARCH");

    elem.innerHTML = html;

    const self = this;
    document
      .getElementById("nameSearch")
      .addEventListener("keyup", function () {
        self.changeSEARCH();
      });
    document.getElementById("numSearch").addEventListener("keyup", function () {
      self.changeSEARCH();
    });
    document.getElementById("refSearch").addEventListener("keyup", function () {
      self.changeSEARCH();
    });
    document
      .getElementById("manzanaSearch")
      .addEventListener("keyup", function () {
        self.changeSEARCH();
      });
    document
      .getElementById("parcelaSearch")
      .addEventListener("keyup", function () {
        self.changeSEARCH();
      });

    this.changeSEARCH();
  }

  changeSEARCH() {
    let manzana = "";
    let parcela = "";
    let name = "";
    let num = "";
    let ref = "";

    let elem = document.getElementById("nameSearch");
    if (elem != null) name = elem.value;
    elem = document.getElementById("numSearch");
    if (elem != null) num = elem.value;
    elem = document.getElementById("refSearch");
    if (elem != null) ref = elem.value;
    elem = document.getElementById("manzanaSearch");
    if (elem != null) manzana = elem.value;
    elem = document.getElementById("parcelaSearch");
    if (elem != null) parcela = elem.value;
    console.log(name);

    const table = "parcela_su_ru_calles";
    let filter = "fid>0";

    name = name.toUpperCase();

    if (name != "") {
      filter = filter + " and (upper(calle) like '%" + name + "%')";
    }

    if (name != "" && num != "") filter = filter + " and numero=" + num;

    if (ref != "") filter = filter + " and refcat like'" + ref + "%'";

    if (manzana != "") filter = filter + " and masa like'" + manzana + "%'";

    if (parcela != "") filter = filter + " and parcela like'" + parcela + "%'";

    filter = filter + " limit 200";

    if (name == "" && num == "" && ref == "" && manzana == "" && parcela == "")
      filter = "fid=0";

    this.querySEARCH(table, filter);
  }

  async querySEARCH(table, filter) {
    // QUERY A ordenacion

    console.log("filter pasa!!!!!!", filter);

    const reader = new DataReader();
    const info_geojson = await reader.readDataFeature(table, filter);
    console.log("filter pasa2!!!!!!");
    console.log("info_geojson", info_geojson);
    const html_QUERY_HEAD = `
			
			 <TABLE id="table_queryS"  class="display" style="padding:3px;font-size:8pt;font-family:Arial;width:100%">
					<thead style="background-color:#e1eefb">
					<tr>
							<th>TIPO VIA</td>
							<th>NOMBRE</td>
							<th>NUMERO</td>
							
							<th>REF. CADASTRAL</td>
							
					</tr>
					</thead>`;

    let html_QUERY_ROWS = "<tbody>";

    if (info_geojson.features != null)
      for (let n = 0; n < info_geojson.features.length; n++) {
        html_QUERY_ROWS =
          html_QUERY_ROWS +
          `
					<tr 
							data-ref="${info_geojson.features[n].properties.refcat}"
							data-accion="doActionRowSearch">

							<td>${info_geojson.features[n].properties.tipo_via}</td>
							<td>${info_geojson.features[n].properties.calle}</td>
							<td>${info_geojson.features[n].properties.numero}</td>
							
							<td>${info_geojson.features[n].properties.refcat}</td>
										
					</tr>`;
      }

    html_QUERY_ROWS = html_QUERY_ROWS + "</tbody>";

    const html_QUERY = html_QUERY_HEAD + html_QUERY_ROWS + `</TABLE>`;

    this.formatQueryS();

    const elemS = document.getElementById("divSEARCH");
    console.log(elemS.style.height);
    elemS.style.height = "70%";
    elemS.innerHTML = html_QUERY;

		const self=this;

		const elementos = document.querySelectorAll(
      'tr[data-accion="doActionRowSearch"]'
    );
    console.log("elementos", elementos);
    for (var i = 0; i < elementos.length; i++) {
      const tr = elementos[i];

      if (tr) {
        tr.addEventListener("click", async function () {
        	const ref = tr.getAttribute("data-ref");

          self.doActionRowSearch(ref);
        });
      }
    }
  }

  async formatQueryS() {
    $(document).ready(function () {
      $("#table_queryS")
        .removeAttr("width")
        .DataTable({
          scrollY: "50vh",
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
    });
  }

  /**
   * Realiza una acción en respuesta a una fila seleccionada en el visor de tablas.
   * @param {string} ref - Identificador único del elemento seleccionado.
   * @returns {Promise<void>} Promesa que se resuelve cuando la acción está completa.
   */
  async doActionRowSearch(ref) {
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

    let reader = new DataReader();
    let info_geojson = await reader.readDataFeature(
      "parcela_su_ru",
      "refcat='" + ref + "'"
    );

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
}


