


async function queryByPoint(e) {
  map.spin(true);

  var x = e.latlng.utm().x;
  var y = e.latlng.utm().y;

  var arrayTablas = new Array(26);
  arrayTablas[0] = ["parcela_su_ru_calles"];
  arrayTablas[1] = ["zona_residencial_1"];
  arrayTablas[2] = ["zona_secundaria"];
  arrayTablas[3] = ["zona_terciaria"];
  arrayTablas[4] = ["zonasf"];
  arrayTablas[5] = ["zonas_centro_historico"];
  arrayTablas[6] = ["catalogos"];
  arrayTablas[7] = ["catalogos_actualizacion"];
  arrayTablas[8] = ["proteccion_arquitectonica"];
  arrayTablas[9] = ["slocal_equipamientos"];
  arrayTablas[10] = ["slocal_espacioslibres_publicos"];
  arrayTablas[11] = ["slocal_comunicaciones_infraestructuras"];
  arrayTablas[12] = ["pg_rustic"];
  arrayTablas[13] = ["sgeneral_equipamientos"];
  arrayTablas[14] = ["pg_dotac_sg_eq"];
  arrayTablas[15] = ["sgeneral_espacioslibres"];
  arrayTablas[16] = ["pg_dotac_sg_el"];
  arrayTablas[17] = ["sgeneral_comunicaciones_infraestructuras"];
  arrayTablas[18] = ["pg_dotac_sg_cm"];
  arrayTablas[19] = ["pg_dotac_sg_su"];
  arrayTablas[20] = ["pg_dotac_sg_if"];
  arrayTablas[21] = ["pri_sistema_espais_lliures_publics"];
  arrayTablas[22] = ["unidad_ejecucion"];
  arrayTablas[23] = ["pb_pla_especial"];
  arrayTablas[24] = ["pc_pla_parcial"];
  arrayTablas[25] = ["pe_estudi_detall"];

  var html = "";

  num_exp = 0;

  for (var p = 0; p < arrayTablas.length; p++) {
    var tabla = arrayTablas[p];
    console.log("paix" + tabla);

    let url = new URL(
      window.location.protocol +
        "//" +
        window.location.host +
        "/opg/featureByPoint"
    );
    const params = { tabla: tabla, x: x, y: y };
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );
    const dataRequest = {
      method: "GET",
    };
    var response = await fetch(url, dataRequest);
    var geojsonRES = await response.json();

    if (geojsonRES.features != null) {
      if (tabla == "parcela_su_ru_calles") {
        html_PE = await createHTML_situacion(geojsonRES);
        html = html + html_PE;
      }
      if (tabla == "zona_residencial_1") {
        html_ZR = await createHTML_zona_residencial(geojsonRES);
        html = html + html_ZR;
      }
      if (tabla == "zona_secundaria") {
        html_ZS = await createHTML_zona_secundaria(geojsonRES);
        html = html + html_ZS;
      }
      if (tabla == "zona_terciaria") {
        html_ZT = await createHTML_zona_terciaria(geojsonRES);
        html = html + html_ZT;
      }
      if (tabla == "zonasf") {
        html_ZVE = await createHTML_zona_volumetria_especifica(geojsonRES);
        html = html + html_ZVE;
      }
      if (tabla == "zonas_centro_historico") {
        html_ZCH = await createHTML_zona_centro_historico(geojsonRES);
        html = html + html_ZCH;
      }
      if (tabla == "catalogos") {
        html_CAT = await createHTML_catalogos(geojsonRES);
        html = html + html_CAT;
      }
      if (tabla == "catalogos_actualizacion") {
        html_CAT_ACT = await createHTML_catalogos_actualizacion(geojsonRES);
        html = html + html_CAT_ACT;
      }
      if (tabla == "proteccion_arquitectonica") {
        html_r = await createHTML_preservacion_r(geojsonRES);
        html = html + html_r;
      }
      if (tabla == "slocal_equipamientos") {
        html_SLEC = await createHTML_sistema_local_equipamientos(geojsonRES);
        html = html + html_SLEC;
      }
      if (tabla == "slocal_espacioslibres_publicos") {
        html_SLEL = await createHTML_sistema_local_espacios_libres(geojsonRES);
        html = html + html_SLEL;
      }
      if (tabla == "slocal_comunicaciones_infraestructuras") {
        html_SLCI =
          await createHTML_sistema_local_comunicaciones_infraestructuras(
            geojsonRES
          );
        html = html + html_SLCI;
      }
      if (tabla == "pg_rustic") {
        html_SR = await createHTML_categorias_rustico_PG2023(geojsonRES);
        html = html + html_SR;
      }
      if (tabla == "sgeneral_equipamientos") {
        html_SGEC = await createHTML_sistema_general_equipamientos(geojsonRES);
        html = html + html_SGEC;
      }
      if (tabla == "pg_dotac_sg_eq") {
        html_SGEC = await createHTML_sistema_general_equipamientos_PG2023(
          geojsonRES
        );
        html = html + html_SGEC;
      }
      if (tabla == "sgeneral_espacioslibres") {
        html_SGEL = await createHTML_sistema_general_espacios_libres(
          geojsonRES
        );
        html = html + html_SGEL;
      }
      if (tabla == "pg_dotac_sg_el") {
        html_SGEL = await createHTML_sistema_general_espacios_libres_PG2023(
          geojsonRES
        );
        html = html + html_SGEL;
      }

      if (tabla == "sgeneral_comunicaciones_infraestructuras") {
        html_SGCI =
          await createHTML_sistema_general_comunicaciones_infraestructuras(
            geojsonRES
          );
        html = html + html_SGCI;
      }
      if (tabla == "pg_dotac_sg_cm") {
        html_SGCM = await createHTML_sistema_general_comunicaciones_PG2023(
          geojsonRES
        );
        html = html + html_SGCM;
      }
      if (tabla == "pg_dotac_sg_su") {
        html_SGSU = await createHTML_sistema_general_servicios_urbanos_PG2023(
          geojsonRES
        );
        html = html + html_SGSU;
      }
      if (tabla == "pg_dotac_sg_if") {
        html_SGIF = await createHTML_sistema_general_infraestructuras_PG2023(
          geojsonRES
        );
        html = html + html_SGIF;
      }
      if (tabla == "pri_sistema_espais_lliures_publics") {
        html_EL_PRI = await createHTML_sistema_espacios_libres_PRI(geojsonRES);
        html = html + html_EL_PRI;
      }
      if (tabla == "unidad_ejecucion") {
        html_UE = await createHTML_unidad_ejecucion(geojsonRES);
        html = html + html_UE;
      }
      if (tabla == "pc_pla_parcial") {
        html_PC = await createHTML_plan_parcial(geojsonRES, num_exp);
        html = html + html_PC;
      }
      if (tabla == "pb_pla_especial") {
        html_PB = await createHTML_plan_especial(geojsonRES, num_exp);
        html = html + html_PB;
      }

      if (tabla == "pe_estudi_detall") {
        html_PE = await createHTML_estudio_detalle(geojsonRES);
        html = html + html_PE;
      }
    }
  }

  console.log(html);

  var htmlTableVIG = "";

  if (html != "")
    htmlTableVIG = `<div align="center" style='padding:0px;font-size:8pt;font-family:Arial;color:#000000;'>${html}
            </div>
            `;

  var tabs = $(function () {
    $("#tabsInfo").tabs({
      activate: function (event, ui) {
        // console.log(ui.newTab.index());
        if (ui.newTab.index()) {
        }
      },
    });
  });

  var htmlTabsInfo = `<div style='padding:0px;min-width:250px' id="tabsInfo">
                    <ul>
                        <li><a href="#vigente">PG2023 + POD (PGOU98 + PRI)</a></li>
                    </ul>

                    <div  id="vigente">
                        ${htmlTableVIG}
                    </div>
                </div>
        
        `;

  console.log("termina for");
  //console.log("html=*"+htmlF+"*");
  if (htmlTableVIG != "") {
    L.popup({ className: "custom-popup" })
      .setLatLng(e.latlng)
      .setContent(htmlTabsInfo)
      .openOn(map);
  }

  map.spin(false);
}

// Creación HTML de Espacios libres PRI

async function createHTML_categorias_rustico_PG2023(geojson) {
  var htmlr = "";

  for (var r = 0; r < geojson.features.length; r++) {
    var back_color = "213,180,60,0.5";
    var calificacion = geojson.features[r].properties.subcategoria;
    var calif_desc = geojson.features[r].properties.subcategoria_es;
    var descr = "";
    var color = "#4d4d4d";
    switch (geojson.features[r].properties.categoria) {
      case "AANP":
        back_color = "0,117,33,0.75";
        color = "white";
        descr = "Sòl Rústic Protegit";
        break;
      case "ANEI":
        back_color = "73,105,52,0.75";
        color = "white";
        descr = "Sòl Rústic Protegit";
        break;
      case "AIN":
        back_color = "151,176,74,0.75";
        descr = "Sòl Rústic Protegit";
        break;
      case "ARIP":
        back_color = "128,166,108,0.75";
        descr = "Sòl Rústic Protegit";
        calificacion = geojson.features[r].properties.zona;
        calif_desc = geojson.features[r].properties.zona_es;
        break;
      case "ZIP":
        back_color = "222,248,222,1";
        descr = "Sòl Rústic Protegit";
        break;
      case "APR":
        back_color = "255,185,120,0.9";
        descr = "Sòl Rústic Protegit (subjacent)";
        break;
      case "APT-C":
        back_color = "224,219,159,0.75";
        descr = "Sòl Rústic Protegit (subjacent)";
        break;
      case "AIA":
        back_color = "228,224,171,1";
        descr = "Sòl Rústic Comú";
        break;
      case "AT":
        back_color = "232,232,215,1";
        descr = "Sòl Rústic Comú";
        calificacion = geojson.features[r].properties.subcategoria;
        calif_desc = geojson.features[r].properties.subcategoria_;
        break;
      case "SRG":
        back_color = "242,242,194,0.75";
        descr = "Sòl Rústic Comú";
        calificacion = geojson.features[r].properties.categoria;
        calif_desc = geojson.features[r].properties.categoria_es;
        break;
      case "NR":
        back_color = "115,101,77,0.75";
        calificacion = geojson.features[r].properties.nom;
        calif_desc = geojson.features[r].properties.nom_;
        color = "white";
        descr = "Nucli Rural";
        break;
      default:
        back_color = "213,180,60,0.5";
        break;
    }

    htmlr =
      htmlr +
      `<TABLE style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
        <tr  align="center"  style='background-color:rgb(${back_color});color:${color};padding:3px;font-size:8.5pt;font-family:Arial Black;height:22px'>
            <td colspan="2">(${geojson.features[r].properties.categoria}) ${geojson.features[r].properties.categoria_es} (PG2023)</td>                   
        </tr >
        <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>
            <td colspan="2">${geojson.features[r].properties.calificacion_}</td>                   
        </tr>`;

    if (
      geojson.features[r].properties.nom_ != "-" &&
      geojson.features[r].properties.nom_ != null
    ) {
      htmlr =
        htmlr +
        `<tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
                   
            <td  colspan="2"><LABEL style='font-size:8pt;font-family:Arial black;color:GREY'>${geojson.features[r].properties.nom_}</td>                  
        </tr>

        `;
    }

    if (
      geojson.features[r].properties.tipo_es != "-" &&
      geojson.features[r].properties.tipo_es != null
    ) {
      htmlr =
        htmlr +
        `<tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
                   
            <td  colspan="2"><LABEL style='font-size:8pt;font-family:Arial black;color:GREY'>(${geojsonRES.features[r].properties.tipo_es})</td>                  
        </tr>

        `;
    }

    htmlr =
      htmlr +
      `
          <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
              <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>CALIFICACIÓN</LABEL></td>  
              <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${calificacion}</td>                  
          </tr>
          <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
              <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>DESCRIPCIÓN</LABEL></td>  
              <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${calif_desc}</td>                  
          </tr>
          <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>
              <td colspan="2"> <button style="padding:3px;font-size:9pt;font-family:Arial Black" class="ui-button ui-widget ui-corner-all" title="Información normativa asociada" OnClick="normativa_revision('suelo_rustico','${geojson.features[r].properties.fid}')"><i class="fa fa-info-circle"></i> Normativa</button></td>  
          </tr>
          
      `;
  }
  htmlr = htmlr + `</TABLE><BR>`;

  return htmlr;
}

// Creación HTML de Situacion

async function createHTML_situacion(geojson) {
  var htmlr = "";
  htmlr =
    htmlr +
    `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
        <tr  align="center"  style='background-color:rgb(26,77,26,1);padding:3px;font-size:8.5pt;font-family:Arial BLACK;color:white;height:22px'>
            <td colspan="2">SITUACIÓN</td>                   
        </tr >`;

  for (var r = 0; r < geojson.features.length; r++) {
    var centroid = turf.centroid(geojson.features[r].geometry);
    var coord = turf.getCoord(centroid.geometry);
    var urlG =
      "http://maps.google.com/?cbll=" +
      coord[1] +
      "," +
      coord[0] +
      "&cbp=12,90,0,0,5&layer=c";

    var calle="-";
    if(geojson.features[r].properties.tipo=='U'){
    calle =
      geojson.features[r].properties.tipo_via +
      " " +
      geojson.features[r].properties.calle +
      " " +
      geojson.features[r].properties.numero;
    }

    htmlr =
      htmlr +
        ` 
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td> 
                <a target="_blank" title="Ir Sede electronica catastro" href="https://www1.sedecatastro.gob.es/cycbieninmueble/OVCListaBienes.aspx?RC1=${geojson.features[r].properties.pcat1}&RC2=${geojson.features[r].properties.pcat2}"><img src="${window.location.protocol}//${window.location.host}/opg/images/sede_catastro1.png"></a>
            </td> 
            <td> 
                <a target="_blank" title="Ir a Street view" href="${urlG}}"><img src="${window.location.protocol}//${window.location.host}/opg/images/streetview.png"></a>
            </td>  
            
        </tr>
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>REF. CATASTRAL</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.refcat}</LABEL></td>  
        </tr>
       
        
      `;
      if(calle!='-'){
        htmlr = htmlr + `
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            
            <td COLSPAN="2"><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${calle}</td>                  
        </tr>`

      }
  }
  htmlr = htmlr + `</TABLE><br>`;

  return htmlr;
}

// Creación HTML de Espacios libres PRI

async function createHTML_sistema_espacios_libres_PRI(geojson) {
  var html = "";

  html =
    html +
    `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
  <tr  align="center"  style='background-color:rgb(128,219,103,1);padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
      <td colspan="2">ESPACIO LIBRE (PRI)</td>                   
  </tr >`;

  for (var r = 0; r < geojson.features.length; r++) {
    tipo_sistema = "";
    if (geojson.features[r].properties.tipo_sistema == "SL")
      tipo_sistema = "(SISTEMA LOCAL)";
    if (geojson.features[r].properties.tipo_sistema == "SG")
      tipo_sistema = "(SISTEMA GENERAL)";

    html =
      html +
      ` <tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'> 
                      <td COLSPAN="2"><LABEL style='font-size:7.5pt;font-family:Arial Black;color:#660000'>${tipo_sistema}</td>                  
                  </tr>
                  <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
                      <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>CODIGO</LABEL></td>  
                      <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.codigo}</td>                  
                  </tr>
                  <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
                      <td colspan="2"> 
                          <button style="padding:3px;font-size:9pt;font-family:Arial Black" class="ui-button ui-widget ui-corner-all" title="Ficha parametros y condiciones de edificación" value=${geojson.features[r].properties.codigo} OnClick="fichaEQ_PRI(this,'EL','${geojson.features[r].properties.fid}')"><i class="fa fa-info-circle"></i> Ficha</button>
                          <button style="padding:3px;font-size:9pt;font-family:Arial Black" class="ui-button ui-widget ui-corner-all" title="Información normativa asociada" OnClick="normativaPRI('pri_sistema_espais_lliures_publics','${geojson.features[r].properties.fid}')"><i class="fa fa-info-circle"></i> Normativa</button>
                      </td>      
                  </tr>
                  `;
  }
  html = html + `</TABLE><br>`;

  return html;
}

// Creación HTML de UnidadeS de ejecición

async function createHTML_unidad_ejecucion(geojson) {
  var html = "";

  html =
    html +
    `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
        <tr  align="center"  style='background-color:rgb(153,8,8,0.85);padding:3px;font-size:8.5pt;font-family:Arial BLACK;color:white;height:22px'>
            <td colspan="2">(UE) UNIDAD DE EJECUCIÓN (PGOU98)</td>                   
        </tr >`;

  for (var r = 0; r < geojson.features.length; r++) {
    html =
      html +
      ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>NOMBRE</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.titulo}</td>                  
        </tr> 
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>CODIGO</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.codigo}</td>                  
        </tr>
        <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
            <td colspan="2"> 
                <button style="padding:3px;font-size:9pt;font-family:Arial Black" class="ui-button ui-widget ui-corner-all" title="Ficha del elemento" value=${geojson.features[r].properties.codigo} OnClick="fichaUE(this)"><i class="fa fa-info-circle"></i> Ficha</button> 
                <button style="padding:3px;font-size:9pt;font-family:Arial Black" class="ui-button ui-widget ui-corner-all" title="Información normativa asociada" OnClick="normativa('unidad_ejecucion','${geojson.features[r].properties.fid}')"><i class="fa fa-info-circle"></i> Normativa</button>
            </td>      
        </tr>
    `;
  }
  html = html + `</TABLE><br>`;

  return html;
}

// Creación HTML de Preservación r

async function createHTML_preservacion_r(geojson) {
  var htmlr = "";

  htmlr =
    htmlr +
    `<TABLE  style='margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
        <tr  align="center"  style='background-color:rgb(204,128,51,0.4);padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
            <td colspan="2">PRESERVACIÓN (r) (PGOU98)</td>                   
        </tr >`;

  for (var r = 0; r < geojson.features.length; r++) {
    var area = turf.area(geojson.features[r].geometry);
    area = area.toFixed(2) + " m2";

    codigo = geojson.features[r].properties.codigo;

    if (r > 0)
      html =
        html +
        ` <tr style='height:2px'>                 
          </tr>`;

    htmlr =
      htmlr +
      `                         
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>CODIGO</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${codigo} </td>                  
        </tr>
        <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
            <td colspan="2"> 
                  <button style="padding:3px;font-size:9pt;font-family:Arial Black" class="ui-button ui-widget ui-corner-all" title="Información normativa asociada" OnClick="normativa_revision('preservacion','${geojson.features[r].properties.fid}')"><i class="fa fa-info-circle"></i> Normativa</button>
            </td>      
        </tr>
        `;
  }
  htmlr = htmlr + `</TABLE><br>`;

  return htmlr;
}

// Creación HTML de Catalogos actualización

async function createHTML_catalogos_actualizacion(geojson) {
  var html = "";

  html =
    html +
    `<TABLE  style='margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
                                <tr  align="center"  style='background-color:rgb(230,143,230,1);padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
                                    <td colspan="2">CATALOGO (PGOU98)</td>                   
                                </tr >`;

  for (var r = 0; r < geojson.features.length; r++) {
    codigo =
      geojson.features[r].properties.proteccion +
      "/" +
      geojson.features[r].properties.codigo;

    if (r > 0)
      html =
        html +
        ` <tr style='height:2px'>                 
          </tr>`;

    html =
      html +
      ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>NOMBRE</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.denominacion}</td>                  
        </tr>
        
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>CODIGO</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${codigo}</td>                  
        </tr>
        <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
            <td colspan="2"> 
                <button style="padding:3px;font-size:9pt;font-family:Arial Black" class="ui-button ui-widget ui-corner-all" title="Ficha del elemento" value=${geojson.features[r].properties.codigo} OnClick="fichaCAT_ACT(this)"><i class="fa fa-info-circle"></i> Ficha</button>
                <button style="padding:3px;font-size:9pt;font-family:Arial Black" class="ui-button ui-widget ui-corner-all" title="Información normativa asociada" OnClick="normativa('catalogos','${geojson.features[r].properties.fid}')"><i class="fa fa-info-circle"></i> Normativa</button>
            </td>      
        </tr>
        `;
  }
  html = html + `</TABLE><br>`;

  return html;
}

// Creación HTML de Catalogos

async function createHTML_catalogos(geojson) {
  var html = "";

  html =
    html +
    `<TABLE  style='margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
                                <tr  align="center"  style='background-color:rgb(230,143,230,1);padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
                                    <td colspan="2">CATALOGO (PGOU98)</td>                   
                                </tr >`;

  for (var r = 0; r < geojson.features.length; r++) {
    var area = turf.area(geojson.features[r].geometry);
    area = area.toFixed(2) + " m2";

    codigo =
      geojson.features[r].properties.proteccion +
      "/" +
      geojson.features[r].properties.codigo;

    if (r > 0)
      html =
        html +
        ` <tr style='height:2px'>                 
          </tr>`;

    html =
      html +
      ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>NOMBRE</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.denominacion}</td>                  
        </tr>
        
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>CODIGO</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${codigo}   (${area})</td>                  
        </tr>
        <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
            <td colspan="2"> 
                <button style="padding:3px;font-size:9pt;font-family:Arial Black" class="ui-button ui-widget ui-corner-all" title="Ficha del elemento" value=${geojson.features[r].properties.codigo} OnClick="fichaCAT(this)"><i class="fa fa-info-circle"></i> Fitxa</button>
                <button style="padding:3px;font-size:9pt;font-family:Arial Black" class="ui-button ui-widget ui-corner-all" title="Información normativa asociada" OnClick="normativa('catalogos','${geojson.features[r].properties.fid}')"><i class="fa fa-info-circle"></i> Normativa</button>
            </td>      
        </tr>
        `;
  }
  html = html + `</TABLE><br>`;

  return html;
}

// Creación HTML de Sistema General de infraestructuras PG2023

async function createHTML_sistema_general_infraestructuras_PG2023(geojson) {
  var html = "";

  html =
    html +
    `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
        <tr  align="center"  style='background-color:rgb(230,230,230,1);padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
            <td colspan="2">INFRAESTRUCTURAS (PG2023)</td>                   
        </tr >
        <tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td colspan="2">(SISTEMA GENERAL)</td>                   
        </tr>`;

  for (var r = 0; r < geojson.features.length; r++) {
    html =
      html +
      ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>NOMBRE</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.nom}</td>                  
        </tr>
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>IDENTIFICANTE</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.identificant}</td>                  
        </tr>
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>CODIGO</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.codi}</td>                  
        </tr>
        <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
            <td colspan="2"> 
                <button style="padding:3px;font-size:9pt;font-family:Arial Black" class="ui-button ui-widget ui-corner-all" title="Ficha del elemento" value=${geojson.features[r].properties.codi} OnClick="fichaSISTEMAS_PG(this,'SGCI')"><i class="fa fa-info-circle"></i> Ficha</button>
                <button style="padding:3px;font-size:9pt;font-family:Arial Black" class="ui-button ui-widget ui-corner-all" title="Información normativa asociada" OnClick="normativa('sgeneral_comunicaciones_infraestructuras','${geojson.features[r].properties.fid}')"><i class="fa fa-info-circle"></i> Normativa</button>
            </td>      
        </tr>
        `;
  }
  html = html + `</TABLE><br>`;

  return html;
}

// Creación HTML de Sistema General de servicios urbanos PG2023

async function createHTML_sistema_general_servicios_urbanos_PG2023(geojson) {
  var html = "";

  html =
    html +
    `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
        <tr  align="center"  style='background-color:rgb(230,230,230,1);padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
            <td colspan="2">SERVICIOS URBANOS (PG2023)</td>                   
        </tr >
        <tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td colspan="2">(SISTEMA GENERAL)</td>                   
        </tr>`;

  for (var r = 0; r < geojson.features.length; r++) {
    html =
      html +
      ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>NOMBRE</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.nom}</td>                  
        </tr>
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>IDENTIFICANTE</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.identificant}</td>                  
        </tr>
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>CODIGO</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.codi}</td>                  
        </tr>
        <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
            <td colspan="2"> 
                <button style="padding:3px;font-size:9pt;font-family:Arial Black" class="ui-button ui-widget ui-corner-all" title="Ficha del elemento" value=${geojson.features[r].properties.codi} OnClick="fichaSISTEMAS_PG(this,'SGCI')"><i class="fa fa-info-circle"></i> Ficha</button>
                <button style="padding:3px;font-size:9pt;font-family:Arial Black" class="ui-button ui-widget ui-corner-all" title="Información normativa asociada" OnClick="normativa('sgeneral_comunicaciones_infraestructuras','${geojson.features[r].properties.fid}')"><i class="fa fa-info-circle"></i> Normativa</button>
            </td>      
        </tr>
        `;
  }
  html = html + `</TABLE><br>`;

  return html;
}

// Creación HTML de Sistema General de comunicaciones PG2023

async function createHTML_sistema_general_comunicaciones_PG2023(geojson) {
  var html = "";

  html =
    html +
    `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
        <tr  align="center"  style='background-color:rgb(230,230,230,1);padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
            <td colspan="2">COMUNICACIONES (PG2023)</td>                   
        </tr >
        <tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td colspan="2">(SISTEMA GENERAL)</td>                   
        </tr>`;

  for (var r = 0; r < geojson.features.length; r++) {
    html =
      html +
      ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>NOMBRE</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.nom}</td>                  
        </tr>
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>IDENTIFICANTE</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.identificant}</td>                  
        </tr>
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>CODIGO</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.codi}</td>                  
        </tr>
        <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
            <td colspan="2"> 
                <button style="padding:3px;font-size:9pt;font-family:Arial Black" class="ui-button ui-widget ui-corner-all" title="Ficha del elemento" value=${geojson.features[r].properties.codi} OnClick="fichaSISTEMAS_PG(this,'SGCI')"><i class="fa fa-info-circle"></i> Ficha</button>
                <button style="padding:3px;font-size:9pt;font-family:Arial Black" class="ui-button ui-widget ui-corner-all" title="Información normativa asociada" OnClick="normativa('sgeneral_comunicaciones_infraestructuras','${geojson.features[r].properties.fid}')"><i class="fa fa-info-circle"></i> Normativa</button>
            </td>      
        </tr>
        `;
  }
  html = html + `</TABLE><br>`;

  return html;
}

// Creación HTML de Sistema General de comunicaciones e infraestruturas

async function createHTML_sistema_general_comunicaciones_infraestructuras(
  geojson
) {
  var html = "";

  html =
    html +
    `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
        <tr  align="center"  style='background-color:rgb(230,230,230,1);padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
            <td colspan="2">COMUNICACIONES E INFRAESTRUCTURAS (PGOU98)</td>                   
        </tr >
        <tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td colspan="2">(SISTEMA GENERAL)</td>                   
        </tr>`;

  for (var r = 0; r < geojson.features.length; r++) {
    html =
      html +
      ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>NOMBRE</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.denominaci}</td>                  
        </tr>
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>IDENTIFICANTE</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.identif}</td>                  
        </tr>
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>CODIGO</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.codigo}</td>                  
        </tr>
        <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
            <td colspan="2"> 
                <button style="padding:3px;font-size:9pt;font-family:Arial Black" class="ui-button ui-widget ui-corner-all" title="Ficha del elemento" value=${geojson.features[r].properties.codigo} OnClick="fichaSISTEMAS_PG(this,'SGCI')"><i class="fa fa-info-circle"></i> Ficha</button>
                <button style="padding:3px;font-size:9pt;font-family:Arial Black" class="ui-button ui-widget ui-corner-all" title="Información normativa asociada" OnClick="normativa('sgeneral_comunicaciones_infraestructuras','${geojson.features[r].properties.fid}')"><i class="fa fa-info-circle"></i> Normativa</button>
            </td>      
        </tr>
        `;
  }
  html = html + `</TABLE><br>`;

  return html;
}

// Creación HTML de Sistema General de espacios libres

async function createHTML_sistema_general_espacios_libres(geojson) {
  var html = "";

  html =
    html +
    `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
        <tr  align="center"  style='background-color:rgb(128,219,123,1);padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
            <td colspan="2">ESPACIOS LIBRES (PGOU98)</td>                   
        </tr >
        <tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td colspan="2">(SISTEMA GENERAL)</td>                   
        </tr>`;

  for (var r = 0; r < geojson.features.length; r++) {
    html =
      html +
      ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>NOMBRE</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.denominaci}</td>                  
        </tr>
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>IDENTIFICANTE</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.identif}</td>                  
        </tr>
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>CODIGO</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.codigo}</td>                  
        </tr>
        <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
            <td colspan="2"> 
                <button style="padding:3px;font-size:9pt;font-family:Arial Black" class="ui-button ui-widget ui-corner-all" title="Ficha del elemento" value=${geojson.features[r].properties.codigo} OnClick="fichaSISTEMAS_PG(this,'SGEL')"><i class="fa fa-info-circle"></i> Ficha</button>
                <button style="padding:3px;font-size:9pt;font-family:Arial Black" class="ui-button ui-widget ui-corner-all" title="Información normativa asociada" OnClick="normativa('sgeneral_espacioslibres','${geojson.features[r].properties.fid}')"><i class="fa fa-info-circle"></i> Normativa</button>
            </td>      
        </tr>
        `;
  }
  html = html + `</TABLE><br>`;

  return html;
}

// Creación HTML de Sistema General de espacios libres PG2023

async function createHTML_sistema_general_espacios_libres_PG2023(geojson) {
  var html = "";

  html =
    html +
    `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
        <tr  align="center"  style='background-color:rgb(128,219,123,1);padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
            <td colspan="2">ESPACIOS LIBRES (PG2023)</td>                   
        </tr >
        <tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td colspan="2">(SISTEMA GENERAL)</td>                   
        </tr>`;

  for (var r = 0; r < geojson.features.length; r++) {
    html =
      html +
      ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>NOMBRE</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.nom}</td>                  
        </tr>
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>IDENTIFICANTE</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.identificant}</td>                  
        </tr>
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>CODIGO</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.codi}</td>                  
        </tr>
        <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
            <td colspan="2"> 
                <button style="padding:3px;font-size:9pt;font-family:Arial Black" class="ui-button ui-widget ui-corner-all" title="Ficha del elemento" value=${geojson.features[r].properties.codi} OnClick="fichaSISTEMAS_PG(this,'SGEL')"><i class="fa fa-info-circle"></i> Ficha</button>
                <button style="padding:3px;font-size:9pt;font-family:Arial Black" class="ui-button ui-widget ui-corner-all" title="Información normativa asociada" OnClick="normativa('sgeneral_espacioslibres','${geojson.features[r].properties.fid}')"><i class="fa fa-info-circle"></i> Normativa</button>
            </td>      
        </tr>
        `;
  }
  html = html + `</TABLE><br>`;

  return html;
}

// Creación HTML de Sistema General de equipamientos PG2023

async function createHTML_sistema_general_equipamientos_PG2023(geojson) {
  var html = "";

  html =
    html +
    `<TABLE  style='margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
        <tr  align="center"  style='background-color:rgb(169,203,215,1);padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
            <td colspan="2"> EQUIPAMIENTO COMUNITARIO (PG2023)</td>                   
        </tr >
        <tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td colspan="2">(SISTEMA GENERAL)</td>                   
        </tr>`;

  for (var r = 0; r < geojson.features.length; r++) {
    html =
      html +
      ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>NOMBRE</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.nom}</td>                  
        </tr>
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>IDENTIFICANTE</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.identificant}</td>                  
        </tr>
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>CODIGO</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.codi}</td>                  
        </tr>
        <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
            <td colspan="2"> 
                <button style="padding:3px;font-size:9pt;font-family:Arial Black" class="ui-button ui-widget ui-corner-all" title="Ficha del elemento" value=${geojson.features[r].properties.codi} OnClick="fichaSISTEMAS_PG(this,'SGEQ')"><i class="fa fa-info-circle"></i> Ficha</button>
                <button style="padding:3px;font-size:9pt;font-family:Arial Black" class="ui-button ui-widget ui-corner-all" title="Información normativa asociada" OnClick="normativa('sgeneral_equipamientos','${geojson.features[r].properties.fid}')"><i class="fa fa-info-circle"></i> Normativa</button>
            </td>      
        </tr>
    `;
  }
  html = html + `</TABLE><br>`;

  return html;
}

// Creación HTML de Sistema General de equipamientos

async function createHTML_sistema_general_equipamientos(geojson) {
  var html = "";

  html =
    html +
    `<TABLE  style='margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
        <tr  align="center"  style='background-color:rgb(169,203,215,1);padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
            <td colspan="2"> EQUIPAMIENTO COMUNITARIO (PGOU98)</td>                   
        </tr >
        <tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td colspan="2">(SISTEMA GENERAL)</td>                   
        </tr>`;

  for (var r = 0; r < geojson.features.length; r++) {
    html =
      html +
      ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>NOMBRE</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.denominaci}</td>                  
        </tr>
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>IDENTIFICANTE</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.identif}</td>                  
        </tr>
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>CODIGO</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.codigo}</td>                  
        </tr>
        <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
            <td colspan="2"> 
                <button style="padding:3px;font-size:9pt;font-family:Arial Black" class="ui-button ui-widget ui-corner-all" title="Ficha del elemento" value=${geojson.features[r].properties.codigo} OnClick="fichaSISTEMAS_PG(this,'SGEQ')"><i class="fa fa-info-circle"></i> Ficha</button>
                <button style="padding:3px;font-size:9pt;font-family:Arial Black" class="ui-button ui-widget ui-corner-all" title="Información normativa asociada" OnClick="normativa('sgeneral_equipamientos','${geojson.features[r].properties.fid}')"><i class="fa fa-info-circle"></i> Normativa</button>
            </td>      
        </tr>
    `;
  }
  html = html + `</TABLE><br>`;

  return html;
}

// Creación HTML de Sistema local de comunicaciones e infreatructuras

async function createHTML_sistema_local_comunicaciones_infraestructuras(
  geojson
) {
  var html = "";

  html =
    html +
    `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
        <tr  align="center"  style='background-color:rgb(230,230,230,1);padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
            <td colspan="2">COMUNICACIONES/INFRAESTRUCTURES (PGOU98)</td>                   
        </tr >
        <tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td colspan="2">(SISTEMA LOCAL)</td>                   
        </tr>`;

  for (var r = 0; r < geojson.features.length; r++) {
    html =
      html +
      ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>NOMBRE</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.denominaci}</td>                  
        </tr>
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>IDENTIFICANTE</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.identif}</td>                  
        </tr>
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>CODIGO</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.codigo}</td>                  
        </tr>
        <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
            <td colspan="2"> 
                <button style="padding:3px;font-size:9pt;font-family:Arial Black" class="ui-button ui-widget ui-corner-all" title="Fitcha del elemento" value=${geojson.features[r].properties.codigo} OnClick="fichaSISTEMAS_PG(this,'SLCI')"><i class="fa fa-info-circle"></i> Ficha</button>
                <button style="padding:3px;font-size:9pt;font-family:Arial Black" class="ui-button ui-widget ui-corner-all" title="Información normativa asociada" OnClick="normativa('slocal_comunicaciones_infraestructuras','${geojson.features[r].properties.fid}')"><i class="fa fa-info-circle"></i> Normativa</button>
            </td>      
        </tr>
        `;
  }
  html = html + `</TABLE><br>`;

  return html;
}

// Creación HTML de Sistema local de espacios libres

async function createHTML_sistema_local_espacios_libres(geojson) {
  var html = "";
  html =
    html +
    `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
        <tr  align="center"  style='background-color:rgb(128,219,123,1);padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
            <td colspan="2">ESPACIO LIBRE PÚBLICO (PGOU98)</td>                   
        </tr >
        <tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td colspan="2">(SISTEMA LOCAL)</td>                   
        </tr>`;

  for (var r = 0; r < geojson.features.length; r++) {
    html =
      html +
      ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>NOMBRE</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.denominaci}</td>                  
        </tr>
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>IDENTIFICANTE</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.identif}</td>                  
        </tr>
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>CODIGO</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.codigo}</td>                  
        </tr>
        <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
            <td colspan="2"> 
                <button style="padding:3px;font-size:9pt;font-family:Arial Black" class="ui-button ui-widget ui-corner-all" title="Ficha del elemento" value=${geojson.features[r].properties.codigo} OnClick="fichaSISTEMAS_PG(this,'SLEL')"><i class="fa fa-info-circle"></i> Fitxa</button>
                <button style="padding:3px;font-size:9pt;font-family:Arial Black" class="ui-button ui-widget ui-corner-all" title="Información normativa asociada" OnClick="normativa('slocal_espacioslibres_publicos','${geojson.features[r].properties.fid}')"><i class="fa fa-info-circle"></i> Normativa</button>
            </td>      
        </tr>
        `;
  }
  html = html + `</TABLE><br>`;

  return html;
}

// Creación HTML de Sistema local de equipamientos

async function createHTML_sistema_local_equipamientos(geojson) {
  var html = "";

  const formCreator = new UrbanisticFormCreator(fid, clase);


  html =
    html +
    `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
          <tr  align="center"  style='background-color:rgb(169,203,215,1);padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
              <td colspan="2"> EQUIPAMIENTO COMUNITARIO (PGOU98)</td>                   
          </tr >
          <tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
              <td colspan="2">(SISTEMA LOCAL)</td>                   
          </tr>`;

  for (var r = 0; r < geojson.features.length; r++) {
    html =
      html +
      ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
                        <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>NOMBRE</LABEL></td>  
                        <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.denominaci}</td>                  
          </tr>
          <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
              <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>IDENTIFICANTE</LABEL></td>  
              <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.identif}</td>                  
          </tr>
          <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
              <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>CODIGO</LABEL></td>  
              <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.codigo}</td>                  
          </tr>
          <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
             
              <td colspan="2"> 
                <button style="padding:3px;font-size:9pt;font-family:Arial Black" class="ui-button ui-widget ui-corner-all" title="Fitxa del elemento" value=${geojson.features[r].properties.codigo} OnClick="createForm('${geojson.features[r].properties.fid}','SLEQ_PGOU98')"><i class="fa fa-info-circle"></i> Ficha</button>
								<button style="padding:3px;font-size:9pt;font-family:Arial Black" class="ui-button ui-widget ui-corner-all" title="Información normativa assciada" OnClick="normativa('slocal_equipamientos','${geojson.features[r].properties.fid}')"><i class="fa fa-info-circle"></i> Normativa</button>
						</td>     
          </tr>
          `;
  }
  html = html + `</TABLE><br>`;

  return html;
}

// Creación HTML de Zona Centro historico

async function createHTML_zona_centro_historico(geojson) {
  var htmlr = "";
  for (var r = 0; r < geojson.features.length; r++) {
    var back_color = "255,230,204,0.9";
    var tipo_zona = "";

    var tipo = geojson.features[r].properties.codigo.substring(0, 1);

    switch (tipo) {
      case "N":
        back_color = "255,230,204,0.9";
        tipo_zona = "PRESERVACIÓN AMBIENTAL N (PGOU98)";
        break;
      case "R":
        back_color = "255,230,204,0.9";
        tipo_zona = "PRESERVACIÓN ARQUITECTÓNICA AMBIENTAL R (PGOU98)";
        break;
    }

    htmlr =
      htmlr +
      `<TABLE style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
	 
		<thead  align="center"  style='background-color:rgb(${back_color});padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
				<td colspan="2">${tipo_zona}</td>                   
		</thead >`;

    htmlr =
      htmlr +
      `
				<tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
						<td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>CALIFICACIÓN</LABEL></td>  
						<td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.codigo}</td>                  
				</tr>
				
				<tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>
				
						<td colspan="2"> 
								
								<button style="padding:3px;font-size:9pt;font-family:Arial Black" class="ui-button ui-widget ui-corner-all" title="Información normativa asociada" OnClick="normativa_revision('calific_zonas','${geojson.features[r].properties.fid}')"><i class="fa fa-info-circle"></i> Normativa</button>
						</td>  
				</tr>
				
		`;
  }
  htmlr = htmlr + `</TABLE><BR>`;

  return htmlr;
}

// Creación HTML de Zona Volumetria especifica

async function createHTML_zona_volumetria_especifica(geojson) {
  var htmlr = "";
  for (var r = 0; r < geojson.features.length; r++) {
    var back_color = "230,204,255,1";
    var tipo_zona = "VOLUMETRIA ESPECIFICA (PGOU98)";

    var tipo = geojson.features[r].properties.codigo.substring(0, 1);

    switch (tipo) {
      case "F":
        back_color = "rgb(215,239,239,1)";
        tipo_zona = "RESIDENCIAL/TERCIARIO (VE) (PGOU98)";
        break;
      case "E":
        back_color = "234,207,195,0.9";
        tipo_zona = "RESIDENCIAL (VE) (PGOU98)";
        break;
      case "S":
        back_color = "230,204,255,1";
        tipo_zona = "TERCIARIO (VE) (PGO98)";
        break;
    }

    botonFicha = `<button style="padding:3px;font-size:9pt;font-family:Arial Black" class="ui-button ui-widget ui-corner-all" title="Ficha parametros y condiciones de edificación" value=${geojson.features[r].properties.codigo} OnClick="fichaCALIFICACION_RPG('${geojson.features[r].properties.fid}')"><i class="fa fa-info-circle"></i> Ficha</button>
				`;

    htmlr =
      htmlr +
      `<TABLE style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
	 
		<thead  align="center"  style='background-color:rgb(${back_color});padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
				<td colspan="2">${tipo_zona}</td>                   
		</thead >`;

    htmlr =
      htmlr +
      `
				<tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
						<td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>CALIFICACIÓN</LABEL></td>  
						<td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.codigo}</td>                  
				</tr>
				
				<tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>
				
						<td colspan="2"> 
								${botonFicha}
								<button style="padding:3px;font-size:9pt;font-family:Arial Black" class="ui-button ui-widget ui-corner-all" title="Información normativa asociada" OnClick="normativa_revision('calific_zonas','${geojson.features[r].properties.fid}')"><i class="fa fa-info-circle"></i> Normativa</button>
						</td>  
				</tr>
				
		`;
  }
  htmlr = htmlr + `</TABLE><BR>`;

  return htmlr;
}

// Creación HTML de Zona Terciaria

async function createHTML_zona_terciaria(geojson) {
  var htmlr = "";
  for (var r = 0; r < geojson.features.length; r++) {
    var back_color = "230,204,255,1";
    var tipo_zona = "";

    var tipo = geojson.features[r].properties.codigo.substring(0, 1);

    switch (tipo) {
      case "S":
        back_color = "230,204,255,1";
        tipo_zona = "TERCIARIO (COMERCIAL/ADMINISTRATIU) (PGO98)";
        break;
      case "T":
        back_color = "193,217,248,1";
        tipo_zona = "TURISTIC (PGOU98)";
        break;
    }

    botonFicha = `<button style="padding:3px;font-size:9pt;font-family:Arial Black" class="ui-button ui-widget ui-corner-all" title="Ficha parametros y condiciones de edificación" value=${geojson.features[r].properties.codigo} OnClick="fichaCALIFICACION_RPG('${geojson.features[r].properties.fid}')"><i class="fa fa-info-circle"></i> Ficha</button>
				`;

    htmlr =
      htmlr +
      `<TABLE style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
	 
		<thead  align="center"  style='background-color:rgb(${back_color});padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
				<td colspan="2">${tipo_zona}</td>                   
		</thead >`;

    htmlr =
      htmlr +
      `
				<tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
						<td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>CALIFICACIÓN</LABEL></td>  
						<td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.codigo}</td>                  
				</tr>
				
				<tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>
				
						<td colspan="2"> 
								${botonFicha}
								<button style="padding:3px;font-size:9pt;font-family:Arial Black" class="ui-button ui-widget ui-corner-all" title="Información normativa asociada" OnClick="normativa_revision('calific_zonas','${geojson.features[r].properties.fid}')"><i class="fa fa-info-circle"></i> Normativa</button>
						</td>  
				</tr>
				
		`;
  }
  htmlr = htmlr + `</TABLE><BR>`;

  return htmlr;
}

// Creación HTML de Zona Secundaria

async function createHTML_zona_secundaria(geojson) {
  var htmlr = "";
  for (var r = 0; r < geojson.features.length; r++) {
    var back_color = "217,208,233,1";
    var tipo_zona = "INDUSTRIAL (PGOU98)";

    var tipo = geojson.features[r].properties.codigo.substring(0, 1);

    /*switch (tipo) {
      case "L":
      case "M":
        back_color = "217,208,233,1";
        tipo_zona = "INDUSTRIAL (PGOU98)";
        break;
      default:
        back_color = "213,180,60,0.3";
        break;
    }*/

    botonFicha = `<button style="padding:3px;font-size:9pt;font-family:Arial Black" class="ui-button ui-widget ui-corner-all" title="Ficha parametros y condiciones de edificación" value=${geojson.features[r].properties.codigo} OnClick="fichaCALIFICACION_RPG('${geojson.features[r].properties.fid}')"><i class="fa fa-info-circle"></i> Ficha</button>
				`;

    htmlr =
      htmlr +
      `<TABLE style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
	 
		<thead  align="center"  style='background-color:rgb(${back_color});padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
				<td colspan="2">${tipo_zona}</td>                   
		</thead >`;

    htmlr =
      htmlr +
      `
				<tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
						<td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>CALIFICACIÓN</LABEL></td>  
						<td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.codigo}</td>                  
				</tr>
				
				<tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>
				
						<td colspan="2"> 
								${botonFicha}
								<button style="padding:3px;font-size:9pt;font-family:Arial Black" class="ui-button ui-widget ui-corner-all" title="Información normativa asociada" OnClick="normativa_revision('calific_zonas','${geojson.features[r].properties.fid}')"><i class="fa fa-info-circle"></i> Normativa</button>
						</td>  
				</tr>
				
		`;
  }
  htmlr = htmlr + `</TABLE><BR>`;

  return htmlr;
}

// Creación HTML de Zona Residencial

async function createHTML_zona_residencial(geojson) {
  var htmlr = "";
  for (var r = 0; r < geojson.features.length; r++) {
    var back_color = "213,180,60,0.5";
    var tipo_zona = "RESIDENCIAL";

    switch (geojson.features[r].properties.agrupacion) {
      case "A":
      case "B":
      case "C":
      case "D":
      case "E":
      case "G":
      case "H":
      case "K":
        back_color = "234,207,195,0.9";
        tipo_zona = "RESIDENCIAL PLURIFAMILIAR (PGOU98)";
        break;
      case "I":
      case "J":
        back_color = "255,255,204,1";
        tipo_zona = "RESIDENCIAL UNIFAMILIAR (PGOU98)";
        break;
      default:
        back_color = "213,180,60,0.3";
        break;
    }

    botonFicha = `<button style="padding:3px;font-size:9pt;font-family:Arial Black" class="ui-button ui-widget ui-corner-all" title="Ficha parametros y condiciones de edificación" value=${geojson.features[r].properties.codigo} OnClick="fichaCALIFICACION_RPG('${geojson.features[r].properties.fid}')"><i class="fa fa-info-circle"></i> Ficha</button>
				`;

    htmlr =
      htmlr +
      `<TABLE style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
	 
		<thead  align="center"  style='background-color:rgb(${back_color});padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
				<td colspan="2">${tipo_zona}</td>                   
		</thead >`;

    htmlr =
      htmlr +
      `
				<tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
						<td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>CALIFICACIÓN</LABEL></td>  
						<td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.codigo}</td>                  
				</tr>
				
				<tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>
				
						<td colspan="2"> 
								${botonFicha}
								<button style="padding:3px;font-size:9pt;font-family:Arial Black" class="ui-button ui-widget ui-corner-all" title="Información normativa asociada" OnClick="normativa_revision('calific_zonas','${geojson.features[r].properties.fid}')"><i class="fa fa-info-circle"></i> Normativa</button>
						</td>  
				</tr>
				
		`;
  }
  htmlr = htmlr + `</TABLE><BR>`;

  return htmlr;
}

// Creación HTML de Expediente PC Plan Parcial

async function createHTML_plan_parcial(geojsonRES, num_exp) {
  var html = "";

  if (num_exp == 0) {
    html =
      html +
      `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
						<tr  align="center"  style='background-color:rgb(102,102,102,1);padding:3px;font-size:8.5pt;font-family:Arial BLACK;color:white;height:22px'>
								<td colspan="2">PLANES PARCIALES</td>                   
						</tr >`;

    num_exp++;
  } else {
    html =
      html +
      ` <tr style='height:2px'>                 
											</tr>`;
  }

  for (var r = 0; r < geojsonRES.features.length; r++) {
    if (r > 0)
      html =
        html +
        ` <tr style='height:2px'>                 
											</tr>`;

    var ruta =
      "https://modeldeciutatgis-dev.palma.cat/images/guia_expedientes/Images Arxiu/PC-PLA_PARCIAL/PC-" +
      geojsonRES.features[r].properties.codigo +
      "/PC-" +
      geojsonRES.features[r].properties.codigo +
      "_PORTADA.pdf";

    var colorAplicable = "GREEN";
    var msgAplicable = "";
    if (geojsonRES.features[r].properties.aplicable == "SI") {
      colorAplicable = "#1a4d1a";
      msgAplicable = "ES DE APLICACIÓN";
    }
    if (geojsonRES.features[r].properties.aplicable == "NO") {
      colorAplicable = "#990000";
      msgAplicable = "NO ES DE APLICACIÓN";
    }
    if (geojsonRES.features[r].properties.aplicable == "D") {
      colorAplicable = "GREY";
      msgAplicable = "-----------------------";
    }

    html =
      html +
      ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
											<td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>PC - PLAN PARCIAL</LABEL></td>  
											<td align="center"><a href="${ruta}"  target="_blank" title="Información del expediente" style='color:blue;font-family:Arial;font-size:8.5pt'>${geojsonRES.features[r].properties.codigo}</a></td>                  
									</tr> 
									<tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
									<td colspan="2"> 
											<LABEL style='text-align: justify;font-size:8.5pt;font-family:Arial;color:grey'>${geojsonRES.features[r].properties.descripcio}</LABEL></td>      
									</tr>
									<tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
                      <td COLSPAN="2"><LABEL style='font-size:8.4pt;font-family:Arial;color:WHITE;background-color:${colorAplicable}'>${msgAplicable}</LABEL>
                      </td>            
                  </tr>`;
  }
  return html;
}

// Creación HTML de Expediente PC Plan Espceial

async function createHTML_plan_especial(geojsonRES, num_exp) {
  var html = "";
  if (num_exp == 0) {
    html =
      html +
      `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
          <tr  align="center"  style='background-color:rgb(102,102,102,1);padding:3px;font-size:8.5pt;font-family:Arial BLACK;color:white;height:22px'>
              <td colspan="2">PLANES ESPECIALES</td>                   
          </tr >`;

    num_exp++;
  } else {
    html =
      html +
      ` <tr style='height:2px'>                 
        </tr>`;
  }

  for (var r = 0; r < geojsonRES.features.length; r++) {
    if (r > 0)
      html =
        html +
        ` <tr style='height:2px'>                 
                                  </tr>`;

    var ruta =
      "https://modeldeciutatgis-dev.palma.cat//images/guia_expedientes/Images Arxiu/PB-PLA_ESPECIAL/PB-" +
      geojsonRES.features[r].properties.codigo +
      "/PB-" +
      geojsonRES.features[r].properties.codigo +
      "_PORTADA.pdf";

    var colorAplicable = "GREEN";
    var msgAplicable = "";
    if (geojsonRES.features[r].properties.aplicable == "SI") {
      colorAplicable = "#1a4d1a";
      msgAplicable = "DE APLICACIÓN";
    }
    if (geojsonRES.features[r].properties.aplicable == "NO") {
      colorAplicable = "#990000";
      msgAplicable = "NO ES DE APLICACIÓN";
    }
    if (geojsonRES.features[r].properties.aplicable == "D") {
      colorAplicable = "GREY";
      msgAplicable = "-----------------------";
    }

    html =
      html +
      ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>PB - PLA ESPECIAL</LABEL></td>  
            <td align="center"><a href="${ruta}"  target="_blank" title="Informació del expedient" style='color:blue;font-family:Arial;font-size:8.5pt'>${geojsonRES.features[r].properties.codigo}</a></td>                  
        </tr> 
        <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
        <td colspan="2"> 
            <LABEL style='text-align: justify;font-size:8.5pt;font-family:Arial;color:grey'>${geojsonRES.features[r].properties.descripcio}</LABEL></td>      
        </tr>
       <tr align="center"  style='background-color:white;padding:3px;font-size:8.4pt;font-family:Arial Black;color:#660000;height:22px'>
         <td COLSPAN="2"><LABEL style='font-size:8.4pt;font-family:Arial;color:WHITE;background-color:${colorAplicable}'>${msgAplicable}</LABEL></td>
       </tr>`;
  }

  return html;
}

// Creación HTML de Expediente PC Plan Espceial

async function createHTML_estudio_detalle(geojsonRES) {
  var num_exp = 0;
  var html = "";
  if (num_exp == 0) {
    html =
      html +
      `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
        <tr  align="center"  style='background-color:rgb(102,102,102,1);padding:3px;font-size:8.5pt;font-family:Arial BLACK;color:white;height:22px'>
            <td colspan="2">ESTUDIOS DE DETALLE</td>                   
        </tr >`;

    num_exp++;
  } else {
    html =
      html +
      ` <tr style='height:2px'>                 
        </tr>`;
  }

  for (var r = 0; r < geojsonRES.features.length; r++) {
    if (r > 0)
      html =
        html +
        ` <tr style='height:2px'>                 
          </tr>`;

    var ruta =
      "https://modeldeciutatgis-dev.palma.cat/images/guia_expedientes/Images Arxiu/PE-ESTUDI_DETALL/PE-" +
      geojsonRES.features[r].properties.codigo +
      "/PE-" +
      geojsonRES.features[r].properties.codigo +
      "_PORTADA.pdf";

    var colorAplicable = "GREEN";
    var msgAplicable = "";
    if (geojsonRES.features[r].properties.aplicable == "SI") {
      colorAplicable = "#1a4d1a";
      msgAplicable = "ACTUALMENT APLICABLE";
    }
    if (geojsonRES.features[r].properties.aplicable == "NO") {
      colorAplicable = "#990000";
      msgAplicable = "ACTUALMENT NO APLICABLE";
    }
    if (geojsonRES.features[r].properties.aplicable == "D") {
      colorAplicable = "GREY";
      msgAplicable = "-----------------------";
    }

    html =
      html +
      ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>PE - ESTUDI DETALL</LABEL></td>  
            <td align="center"><a href="${ruta}"  target="_blank" title="Informació del expedient" style='color:blue;font-family:Arial;font-size:8.5pt'>${geojsonRES.features[r].properties.codigo}</a></td>                  
        </tr> 
        <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
            <td colspan="2"><LABEL style='text-align: justify;font-size:8.5pt;font-family:Arial;color:grey'>${geojsonRES.features[r].properties.descripcio}</LABEL></td>      
        </tr>`;
    //<tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
    //<td COLSPAN="2"><LABEL style='font-size:8.4pt;font-family:Arial;color:WHITE;background-color:${colorAplicable}'>${msgAplicable}</LABEL></td>
    //</tr>
  }
  return html;
}


