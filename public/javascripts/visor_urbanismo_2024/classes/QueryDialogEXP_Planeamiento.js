/**
 * Clase para gestionar el diálogo de consultas relacionadas con el planeamiento urbanístico.
 * @memberof module:Frontend
 */
class QueryDialogEXP_Planeamiento {
  /**
   * Crea una instancia de QueryDialogEXP_Planeamiento.
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
  }

  createHTML() {
    const divQUERY_EXP_PLANEAMIENTO = `<div id="divQUERY_EXP_PLANEAMIENTO" style='background-color:#f2f2f2;width:100%;height:60%'></div`;
    const divOptionsQUERY_EXP_PLANEAMIENTO = `<div id="divOptionsQUERY_EXP_PLANEAMIENTO" style='background-color:#f2f2f2;width:100%'></div`;
    const strSelectTABLE_EXP_PLANEAMIENTO = this.createSelectTABLE();

    const htmlRevision = `
        <BR>
        ${strSelectTABLE_EXP_PLANEAMIENTO}
        <BR><BR>          
        ${divOptionsQUERY_EXP_PLANEAMIENTO}
        <BR><BR> 
        ${divQUERY_EXP_PLANEAMIENTO}
        <BR>
      `;
    return htmlRevision;
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

    console.log("info_geojson=" , info_geojson);

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

    console.log(this.sigduMap.map);

    this.sigduMap.map.fitBounds(poly.getBounds());

    if (this.sigduMap.puntos != null)
      this.sigduMap.map.removeLayer(this.sigduMap.puntos);
    this.sigduMap.puntos = L.geoJSON(info_geojson, { style: style });

    this.sigduMap.map.addLayer(this.sigduMap.puntos);
  }

  async formatQuery() {
    $(document).ready(function () {
      $("#table_queryEXP_PLANEAMIENTO")
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
          scrollY: "32vh",
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
          order: [[1, "asc"]], // Ordenar por la tercera columna (índice 2) de forma ascendente
        });

      //$("#table_queryEXP_PLANEAMIENTO td").css("padding", "5px");
    });
  }

  async queryEXP(name, table, filter) {
    const reader = new DataReader();
    const info_geojson = await reader.readDataFeature(table, filter);

    //info_geojson.features.sort((a, b) => a.properties.codigo - b.properties.codigo);

    let html_QUERY_HEAD = `
          <button style="padding-top:4px;padding-bottom:4px;" class="ui-button ui-widget ui-corner-all" title="Descàrrega en format geojson"  id="download_exp_PL"><i class="fa fa-download"></i></button>
          <button style="padding-top:4px;padding-bottom:4px;" class="ui-button ui-widget ui-corner-all" title="Afegeix consulta a taula de contingut" id="add_layer_toc_exp_PL"><i class="fa fa-plus-circle"></i></button>
    
          <TABLE id="table_queryEXP_PLANEAMIENTO" class="stripe row-border order-column" style="padding:3px;font-size:8pt;font-family:Arial;width:100%">
         
          <thead style="background-color:#e1eefb;">
            <tr>
							<th>FID</td>            
							<th>CODIGO</td>
							<th>DESCRIPCIÓN_EXPEDIENTE</th>
							<th>AVANCE</td>
							<th>BOIB AVANCE</td>
							<th>APROBACIÓN INICIAL</td>
							<th>BOIB A. INICIAL.</td>
							<th>APROBACIÓN PROVISIONAL.</td>
							<th>APROBACIÓN DEFINITIVA.</td>
							<th>BOIB A. DEFINITIVA.</td>        
            </tr>
          </thead>`;

    let html_QUERY_ROWS = "<tbody>";

    if (info_geojson.features != null)
      for (var n = 0; n < info_geojson.features.length; n++) {
        const avanc = info_geojson.features[n].properties.avanc || "-";
        const boib_avanc =
          info_geojson.features[n].properties.boib_avanc || "-";
        const a_ini = info_geojson.features[n].properties.a_ini || "-";
        const boib_ai = info_geojson.features[n].properties.boib_ai || "-";
        const a_prov = info_geojson.features[n].properties.a_prov || "-";
        const a_def = info_geojson.features[n].properties.a_def || "-";
        const boib_ad = info_geojson.features[n].properties.boib_ad || "-";

        html_QUERY_ROWS =
          html_QUERY_ROWS +
          `
					<tr id="queryEXP_${info_geojson.features[n].properties.fid}" 
            data-table="${table}" 
            data-fid="${info_geojson.features[n].properties.fid}"
            data-accion="doActionRowEXP">

						<td>${info_geojson.features[n].properties.fid}</td>                                   
						<td>${info_geojson.features[n].properties.codigo}</td>
						<td>${info_geojson.features[n].properties.descripcio}</td>
						<td>${avanc}</td>
						<td>${boib_avanc}</td>
						<td>${a_ini}</td>
						<td>${boib_ai}</td>
						<td>${a_prov}</td>
						<td>${a_def}</td>
						<td>${boib_ad}</td>             
					</tr>`;
      }

    html_QUERY_ROWS = html_QUERY_ROWS + "</tbody>";

    const html_QUERY = html_QUERY_HEAD + html_QUERY_ROWS + `</TABLE>`;

    this.formatQuery();

    var elem = document.getElementById("divQUERY_EXP_PLANEAMIENTO");
    elem.style.height = "70%";
    elem.innerHTML = html_QUERY;

    const self = this;

    var elementos = document.querySelectorAll(
      'tr[data-accion="doActionRowEXP"]'
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
      .getElementById("download_exp_PL")
      .addEventListener("click", function () {
        self.download(name, info_geojson);
      });
    document
      .getElementById("add_layer_toc_exp_PL")
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
    var letters = "0123456789ABCDEF";
    var color = "#";
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
				<option value="PA" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optPA">PA - MODIFICACIÓ PG</option>
				<option value="PB" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optPB">PB - PLÁ ESPECIAL</option>
				<option value="PBX" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optPBX">PBX - PLÁ ESPECIAL REFORMA INTERIOR</option>
				<option value="PC" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optPC">PC - PLÁ PARCIAL</option>
				<option value="PD" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optPD">PD - PROJ. URBANITZACIÓ</option>
				<option value="PE" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optPE">PE - ESTUDI DETALL</option>
				<option value="PF" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optPF">PF - DOTACIÓ SERVEIS</option>
				<option value="PG" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optPG">PG - RECEPCIÓ OBRES</option>
				<option value="PH" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optPH">PH - PARCELACIONS</option>
				<option value="PI" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optPI">PI - INTERES GENERAL</option>
				<option value="PJ" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optPJ">PJ - DELIMTACIÓ UA</option>
				<option value="PK" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optPK">PK - SEGREGACIÓ RÚSTIC</option>
				`;

    const strSelectTABLE = `    
          <select style='background-color:#5b9ec1;color:white;padding:2px;font-size:9pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="selectTablesEXP_PLANEAMIENTO" id="selectTablesEXP_PLANEAMIENTO" >
          
              ${strOptionsTables}
          </select>
          `;

    return strSelectTABLE;
  }

  async setOptionsQUERY() {
    const html = `
    <TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
           
        <thead style="background-color:#e1eefb">
            <tr>
                <th align="left"></th>            
                <th align="left" style="text-align:center;padding:5px;font-size:9.5px;font-family:Arial black;color:#000000">MAJOR O IGUAL</th>
                <th align="left" style="text-align:center;padding:5px;font-size:9.5px;font-family:Arial black;color:#000000">MENOR O IGUAL</th>                    
            </tr>
        </thead> 

        <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
            <td  style='padding:5px;font-size:8pt;font-family:Arial;color:#000000;'>FECHA INICIO EXPEDIENTE</td>
            <td><input type="text" style="width:96%" id="inicioExpFirst" name="select"></td>
            <td><input type="text" style="width:96%" id="inicioExpEnd" name="select" id="inicioExpEnd"></td>
        </tr>
        <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
            <td style='padding:5px;font-size:8pt;font-family:Arial;color:#000000;'>FECHA APROBACIÓN AVANCE</td>
            <td><input type="text" style="width:96%" id="avanceExpFirst" name="select" ></td>
            <td><input type="text" style="width:96%" id="avanceExpEnd" name="select"></td>
        </tr>
        <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
            <td style='padding:5px;font-size:8pt;font-family:Arial;color:#000000;'>FECHA BOIB AVANCE</label></td>
            <td><input type="text" style="width:96%" id="boib_avanceExpFirst" name="select"></td>
            <td><input type="text" style="width:96%" id="boib_avanceExpEnd" name="select"></td>
        </tr>
        <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
            <td style='padding:5px;font-size:8pt;font-family:Arial;color:#000000;'>FECHA APROVACIÓN INICIAL</td>
            <td><input type="text" style="width:96%" id="AI_ExpFirst" name="select"></td>
            <td><input type="text" style="width:96%" id="AI_ExpEnd" name="select"></td>
        </tr>
        <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
            <td style='padding:5px;font-size:8pt;font-family:Arial;color:#000000;'>FECHA BOIB APROVACIÓN INICIAL</td>
            <td><input type="text" style="width:96%" id="boib_AI_ExpFirst" name="select"></td>
            <td><input type="text" style="width:96%" id="boib_AI_ExpEnd" name="select"></td>
        </tr>
        <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
            <td style='padding:5px;font-size:8pt;font-family:Arial;color:#000000;'>FECHA APROVACIÓN PROVISIONAL</td>
            <td><input type="text" style="width:96%" id="AP_ExpFirst" name="select"></td>
            <td><input type="text" style="width:96%" id="AP_ExpEnd" name="select"></td>
        </tr>
        <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
            <td  style='padding:5px;font-size:8pt;font-family:Arial;color:#000000;'>FECHA APROVACIÓN DEFINITIVA</td>
            <td><input type="text" style="width:96%" id="AD_ExpFirst" name="select"></td>
            <td><input type="text" style="width:96%" id="AD_ExpEnd" name="select"></td>
        </tr>
        <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
            <td style='padding:5px;font-size:8pt;font-family:Arial;color:#000000;'>FECHA BOIB APROVACIÓN DEFINITIVA</td>
            <td><input type="text" style="width:96%" id="boib_AD_ExpFirst" name="select"></td>
            <td><input type="text" style="width:96%" id="boib_AD_ExpEnd" name="select"></td>
        </tr>
       
            
    </TABLE>`;

    var elemOptions = document.getElementById(
      "divOptionsQUERY_EXP_PLANEAMIENTO"
    );
    elemOptions.innerHTML = html;

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

    this.changeQUERY();
  }

  changeQUERY() {
    let tipo;
    let filter = "fid>0";
    const elem = document.getElementById("selectTablesEXP_PLANEAMIENTO");
    if (elem != null) {
      tipo = elem.value;
    }

    const div = document.getElementById("divOptionsQUERY_EXP_PLANEAMIENTO");
    const inicioExpFirst = div.querySelector("#inicioExpFirst").value;
    const inicioExpEnd = div.querySelector("#inicioExpEnd").value;
    const avanceExpFirst = div.querySelector("#avanceExpFirst").value;
    const avanceExpEnd = div.querySelector("#avanceExpEnd").value;
    const boib_avanceExpFirst = div.querySelector("#boib_avanceExpFirst").value;
    const boib_avanceExpEnd = div.querySelector("#boib_avanceExpEnd").value;
    const ai_ExpFirst = div.querySelector("#AI_ExpFirst").value;
    const ai_ExpEnd = div.querySelector("#AI_ExpEnd").value;
    const boib_ai_ExpFirst = div.querySelector("#boib_AI_ExpFirst").value;
    const boib_ai_ExpEnd = div.querySelector("#boib_AI_ExpEnd").value;
    const ap_ExpFirst = div.querySelector("#AP_ExpFirst").value;
    const ap_ExpEnd = div.querySelector("#AP_ExpEnd").value;
    const ad_ExpFirst = div.querySelector("#AD_ExpFirst").value;
    const ad_ExpEnd = div.querySelector("#AD_ExpEnd").value;
    const boib_ad_ExpFirst = div.querySelector("#boib_AD_ExpFirst").value;
    const boib_ad_ExpEnd = div.querySelector("#boib_AD_ExpEnd").value;

    filter =
      inicioExpFirst !== ""
        ? `${filter} AND codigo>='${inicioExpFirst}'`
        : filter;
    filter =
      inicioExpEnd !== "" ? `${filter} AND codigo<='${inicioExpEnd}'` : filter;

    filter =
      avanceExpFirst !== ""
        ? `${filter} AND avanc>='${avanceExpFirst}'`
        : filter;
    filter =
      avanceExpEnd !== "" ? `${filter} AND avanc<='${avanceExpEnd}'` : filter;

    filter =
      boib_avanceExpFirst !== ""
        ? `${filter} AND boib_avanc>='${boib_avanceExpFirst}'`
        : filter;
    filter =
      boib_avanceExpEnd !== ""
        ? `${filter} AND boib_avanc<='${boib_avanceExpEnd}'`
        : filter;

    filter =
      ai_ExpFirst !== "" ? `${filter} AND a_ini>='${ai_ExpFirst}'` : filter;
    filter = ai_ExpEnd !== "" ? `${filter} AND a_ini<='${ai_ExpEnd}'` : filter;

    filter =
      boib_ai_ExpFirst !== ""
        ? `${filter} AND boib_ai>='${boib_ai_ExpFirst}'`
        : filter;
    filter =
      boib_ai_ExpEnd !== ""
        ? `${filter} AND boib_ai<='${boib_ai_ExpEnd}'`
        : filter;

    filter =
      ap_ExpFirst !== "" ? `${filter} AND a_prov>='${ap_ExpFirst}'` : filter;
    filter = ap_ExpEnd !== "" ? `${filter} AND a_prov<='${ap_ExpEnd}'` : filter;

    filter =
      ad_ExpFirst !== "" ? `${filter} AND a_def>='${ad_ExpFirst}'` : filter;
    filter = ad_ExpEnd !== "" ? `${filter} AND a_def<='${ad_ExpEnd}'` : filter;

    filter =
      boib_ad_ExpFirst !== ""
        ? `${filter} AND boib_ad>='${boib_ad_ExpFirst}'`
        : filter;
    filter =
      boib_ad_ExpEnd !== ""
        ? `${filter} AND boib_ad<='${boib_ad_ExpEnd}'`
        : filter;

    console.log(tipo);

    switch (tipo) {
      case "PA":
        this.queryEXP(
          "PA - Modificacion del Plan general",
          "pa_modificacion_pgou",
          filter
        );
        break;
      case "PB":
        this.queryEXP("PB - Plan especial", "pb_pla_especial", filter);
        break;
      case "PBX":
        this.queryEXP(
          "PBX - Plan especialde refoma interior",
          "pbx_pla_especial_ri",
          filter
        );
        break;
      case "PC":
        this.queryEXP("PC - Plan parcial", "pc_pla_parcial", filter);
        break;
      case "PD":
        this.queryEXP("PD - Urbanización", "pd_urbanizacion", filter);
        break;
      case "PE":
        this.queryEXP("PE - Estudio de detalle", "pe_estudi_detall", filter);
        break;
      case "PF":
        this.queryEXP(
          "PF - Dotacion de servicios",
          "pf_dotacio_serveis",
          filter
        );
        break;
      case "PG":
        this.queryEXP("PG - rececpcion de obras", "pg_recepcio_obres", filter);
        break;
      case "PH":
        this.queryEXP("PH - Parcelaciones", "ph_parcelacions", filter);
        break;
      case "PI":
        this.queryEXP("PI - Interes general", "pi_interes_general", filter);
        break;
      case "PJ":
        this.queryEXP("PJ - delimitacion UA", "pj_delimitacio_ua", filter);
        break;
      case "PK":
        this.queryEXP(
          "PK - Segregación de rústico",
          "pk_segregacion_rustic",
          filter
        );
        break;
    }
  }
}
