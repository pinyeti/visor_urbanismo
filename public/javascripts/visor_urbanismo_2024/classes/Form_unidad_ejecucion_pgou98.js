/**
 * Clase para gestionar unidades de ejecución del Plan General de Ordenación Urbana de 1998 (PGOU98).
 * @memberof module:Frontend
 */
class Form_UNIDAD_EJECUCION_PGOU98 {
  /**
   * Crea una instancia de Form_UNIDAD_EJECUCION_PGOU98.
   *
   * @param {object} entity - La entidad que contiene la información.
   * @param {object} sigduMap - El mapa SIGDU.
   */
  constructor(entity, sigduMap) {
    this.sigduMap=sigduMap;
    this.map=sigduMap.map;
    this.geojson = entity.getGeojson();
    this.feature = entity.getFeature();
    this.codigo = entity.getFeature().properties.codigo;
    this.denominacion =
      entity.getFeature().properties.titulo.toUpperCase() || "-";

    this.cadenaZonaEst = entity.getZonaEstadisticaString();
    this.cadenaParcelas = entity.getRefcatString();
    this.cadenaCalles = entity.getCallesString();
    this.title = entity.title;
    this.subtitle = entity.subtitle;
    this.tipoPlan = entity.tipo_plan;
    this.clase = entity.clase;

    this.area = turf.area(entity.getFeature().geometry);
    this.area = this.area.toFixed(2) + " m2";
    this.centroid = turf.centroid(entity.getFeature().geometry);
    this.coord = turf.getCoord(this.centroid.geometry);
    this.latlng = L.latLng(this.coord[1], this.coord[0]);
    this.bbox = turf.bbox(entity.getFeature().geometry);

    this.fillColor = entity.fillColor;
    this.color = entity.color;

    this.html_IDENTIFICACION = ``;
    this.html_SISTEMAS_CESION = ``;
    this.html_SUPERFICIES = ``;
    this.html_ORDENACION = ``;
    this.html_ESTANDARES_URBANISTICOS=``;
    this.html_GESTION=``;
    this.html_OBSERVACIONES=``;
    this.html_buttons = ``;
    this.html_TITULO = ``;
    this.html_SUPERFICIE_EDIF = ``;

    this.mapManager = null;

    this.setHTML_IDENTIFICACION();
    this.setHTML_SISTEMAS_CESION();
    this.setHTML_SUPERFICIES();
    this.setHTML_ORDENACION();
    this.setHTML_SUPERFICIE_EDIF();
    this.setHTML_GESTION();
    this.setHTML_OBSERVACIONES();
    this.setHTML_ESTANDARES_URBANISTICOS();
    this.setHTML_TITLE();
    this.setHTML_BUTTONS();

    let urlA = new URL(window.location.protocol+'//'+window.location.host+"/opg/write_data_user");
    const paramsA = {accion:"ficha_"+this.clase+":"+this.codigo};
        Object.keys(paramsA).forEach(key => urlA.searchParams.append(key, paramsA[key]));
        const dataRequestA = {
            method: 'POST'
        }; 
    fetch(urlA,dataRequestA);
  }

  setHTML_IDENTIFICACION() {
    this.html_IDENTIFICACION = `
      <TABLE class="table-form">
        <tr class="table-form-tr-white">
          <td class="table-form-td">CODIGO</td>
          <td><LABEL class="table-form-label-style">${this.codigo}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td">DENOMINACIÓN</td>
          <td><LABEL class="table-form-label-style">${this.denominacion}</td>
        </tr>
        <tr class="table-form-tr-bluegrey">
          <td class="table-form-td">ZONA ESTADISTICA</td>
          <td class="table-form-td">${this.cadenaZonaEst}</td>
        </tr>
        <tr class="table-form-tr-bluegrey">
          <td class="table-form-td">REF. CATASTRAL</td>
          <td class="table-form-td">${this.cadenaParcelas}</td>
        </tr>
        <tr class="table-form-tr-bluegrey">
          <td class="table-form-td">CALLES</td>
          <td class="table-form-td">${this.cadenaCalles}</td>
        </tr>  
      </TABLE>`;
  }

  setHTML_SISTEMAS_CESION() {
    this.html_SISTEMAS_CESION = `
      <TABLE class="table-form">
        <tr class="table-form-tr-white">
          <td class="table-form-td2">ESPACIOS LIBRES</td>
          <td class="table-form-td3">${this.feature.properties.totlibres}</td>
          <td class="table-form-td3">${this.feature.properties.elibres}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">EQUIPAMIENTOS</td>
          <td class="table-form-td3">${this.feature.properties.totequipam}</td>
          <td class="table-form-td3">${this.feature.properties.equipam}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">VIALES I INF.</td>
          <td class="table-form-td3">${this.feature.properties.totvial}</td>
          <td class="table-form-td3">-</td>
        </tr>    
      </TABLE>`;
  }

  setHTML_SUPERFICIES() {
    this.html_SUPERFICIES = `
      <TABLE class="table-form">
        <tr class="table-form-tr-white">
          <td class="table-form-td2">SUP. SUELO NO LUCRATIVO</td>
          <td class="table-form-td3">${this.feature.properties.totcesion}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">SUP. SUELO LUCRATIVO</td>
          <td class="table-form-td3">${this.feature.properties.totlucrat}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">TOTAL</td>
          <td class="table-form-td3">${this.feature.properties.totue}</td>
        </tr>
      </TABLE>`;
  }

  setHTML_ORDENACION() {
    this.html_ORDENACION = `
      <TABLE class="table-form">           
        <tr align="left" bgcolor="#eaf5ff" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
          <td bgcolor="grey"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:white' align="right">USOS</LABEL></td>
          <td bgcolor="grey"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:white' align="right">TIPOLOGIA</LABEL></td>
          <td bgcolor="grey"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:white' align="right">ORDENANZA</LABEL></td>
          <td bgcolor="grey"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:white' align="right">COEF. EDIFICABILITAD MITJA</LABEL></td>
          <td bgcolor="grey"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:white' align="right">SUP. SUELO</LABEL></td>
          <td bgcolor="grey"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:white' align="right">EDIFICABILIDAD</LABEL></td>
        </tr>
        <tr class="table-form-tr-white">
          <td rowspan=2 class="table-form-td2">RESID. UNIFAMILIAR</LABEL></td>
          <td class="table-form-td2">CONTINUA</LABEL></td>
          <td class="table-form-td3">${this.feature.properties.orden_ruc}</td>
          <td class="table-form-td3">${this.feature.properties.edif_ruc}</td>
          <td class="table-form-td3">${this.feature.properties.supsol_ruc}</td>
          <td class="table-form-td3">${this.feature.properties.suptot_ruc}</td>
        </tr>
        <tr class="table-form-tr-white">   
          <td class="table-form-td2">AISLADA</LABEL></td>
          <td class="table-form-td3">${this.feature.properties.orden_rua}</td>
          <td class="table-form-td3">${this.feature.properties.edif_rua}</td>
          <td class="table-form-td3">${this.feature.properties.supsol_rua}</td>
          <td class="table-form-td3">${this.feature.properties.suptot_rua}</td>
        </tr>
        <tr class="table-form-tr-white"> 
          <td rowspan=3 class="table-form-td2">RESID. PLURIFAMILIAR</LABEL></td>
          <td class="table-form-td2">CONTINUA</LABEL></td>
          <td class="table-form-td3">${this.feature.properties.orden_rpc}</td>
          <td class="table-form-td3">${this.feature.properties.edif_rpc}</td>
          <td class="table-form-td3">${this.feature.properties.supsol_rpc}</td>
          <td class="table-form-td3">${this.feature.properties.suptot_rpc}</td>
        </tr>
        <tr class="table-form-tr-white">          
          <td class="table-form-td2">AISLADA</LABEL></td>
          <td class="table-form-td3">${this.feature.properties.orden_rpa}</td>
          <td class="table-form-td3">${this.feature.properties.edif_rpa}</td>
          <td class="table-form-td3">${this.feature.properties.supsol_rpa}</td>
          <td class="table-form-td3">${this.feature.properties.suptot_rpa}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">VOL. ESP.</LABEL></td>
          <td class="table-form-td3">${this.feature.properties.orden_vol}</td>
          <td class="table-form-td3">${this.feature.properties.edif_vol}</td>
          <td class="table-form-td3">${this.feature.properties.supsol_vol}</td>
          <td class="table-form-td3">${this.feature.properties.suptot_vol}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">SECUNDARIO</LABEL></td>
          <td class="table-form-td2">TOTES</LABEL></td>
          <td class="table-form-td3">${this.feature.properties.orden_sec}</td>
          <td class="table-form-td3">${this.feature.properties.edif_sec}</td>
          <td class="table-form-td3">${this.feature.properties.supsol_sec}</td>
          <td class="table-form-td3">${this.feature.properties.suptot_sec}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">TERCIARIO</LABEL></td>
          <td class="table-form-td2">TOTES</LABEL></td>
          <td class="table-form-td3">${this.feature.properties.orden_ter}</td>
          <td class="table-form-td3">${this.feature.properties.edif_ter}</td>
          <td class="table-form-td3">${this.feature.properties.supsol_ter}</td>
          <td class="table-form-td3">${this.feature.properties.suptot_ter}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">EQUIPAMIENTOS</LABEL></td>
          <td class="table-form-td2">TOTES</LABEL></td>
          <td class="table-form-td3">${this.feature.properties.orden_eqp}</td>
          <td class="table-form-td3">${this.feature.properties.edif_eqp}</td>
          <td class="table-form-td3">${this.feature.properties.supsol_eqp}</td>
          <td class="table-form-td3">${this.feature.properties.suptot_eqp}</td>
        </tr>            
      </TABLE>`;
  }

  setHTML_SUPERFICIE_EDIF(){
    this.html_SUPERFICIE_EDIF=`
      <TABLE class="table-form">
        <tr class="table-form-tr-white">
          <td class="table-form-td2">EDIFICABILIDAD MAX. (m2t)</td>
          <td class="table-form-td3">${this.feature.properties.aprofitn}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">COEF. EDIFICABILIDAD MAX. (m2t/m2)</td>
          <td class="table-form-td3">${this.feature.properties.edifglob_1}</td>
          </tr>
      </TABLE>`; 
  }

  setHTML_ESTANDARES_URBANISTICOS(){
    this.html_ESTANDARES_URBANISTICOS=`
      <TABLE class="table-form">
        <tr class="table-form-tr-white">
          <td class="table-form-td2">DENSIDAD MAX. VIVIENDAS (viv/ha)</td>
          <td class="table-form-td3">${this.feature.properties.densvivm_1}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">DENSIDAD POBLACIÓN MAX. (hab/ha)</td>
          <td class="table-form-td3">${this.feature.properties.denspobm_1}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">NUM. VIV. MAX. (viv)</td>
          <td class="table-form-td3">${this.feature.properties.numvivn}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">NUM. HAB. MAX. (hab)</td>
          <td class="table-form-td3">${this.feature.properties.numhabmaxn}</td>
        </tr>
      </TABLE>`; 
  }

  setHTML_GESTION(){
    this.html_GESTION=`
      <TABLE class="table-form">
        <tr class="table-form-tr-white">
          <td class="table-form-td2">PLANEAMIENTO APROVADO</td>
          <td class="table-form-td3">${this.feature.properties.plana_apro}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">PLANEAMIENTO A DESARROLLAR</td>
          <td class="table-form-td3">${this.feature.properties.plana_a_d}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">SISTEMA DE ACTUACIÓN</td>
          <td class="table-form-td3">${this.feature.properties.sistema_ac}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">PLAN DE ETAPAS</td>
          <td class="table-form-td3">${this.feature.properties.plan_etapa}</td>
        </tr>
    </TABLE>`; 
  }

  setHTML_OBSERVACIONES(){
    this.html_OBSERVACIONES = `
      <TABLE class="table-form">
        <tr class="table-form-tr-white">
          <td class="table-form-td3">${this.feature.properties.observacio.replace(
            /\n/g,
            "<br>"
          )}</td>
        </tr>       
      </TABLE>`;
  }

  setHTML_BUTTONS() {
    this.html_buttons = `<button id="buttons" class="accordion">IDENTIFICACIÓN</button>
      <div class="panelIDENTIF id="panelIDENTIF">
        <BR>
        ${this.html_IDENTIFICACION}
        <div id='map2'></div>
        <BR>      
      </div>
      <button id="buttons" class="accordion">SISTEMAS LOCALES DE CESIÓN</button>
      <div class="panelCESION id="panelCESION">
        <BR>
        ${this.html_SISTEMAS_CESION}
        <BR>      
      </div>
      <button id="buttons" class="accordion">SUPERFICIES</button>
      <div class="panelSUPERFICIES id="panelSUPERFCIES">
        <BR>
        ${this.html_SUPERFICIES}
        <BR>      
      </div>
      <button id="buttons" class="accordion">ORDENACION</button>
      <div class="panelORDENACION id="panelORDENACION">
        <BR>
        ${this.html_ORDENACION}
        <BR>      
      </div>
      <button id="buttons" class="accordion">SUPERFICIE EDIFICABLE</button>
      <div class="panelSUPERFICIE_EDIF id="panelSUPERFICIE_EDIF">
        <BR>
        ${this.html_SUPERFICIE_EDIF}
        <BR>      
      </div>
      <button id="buttons" class="accordion">ESTANDARES URBANISTICOS</button>
      <div class="panelESTANDARES_URBANISTICOS id="panelESTANDARES_URBANISTICOS">
        <BR>
        ${this.html_ESTANDARES_URBANISTICOS}
        <BR>      
      </div>
      <button id="buttons" class="accordion">GESTIÓN, PROGRAMACIÓN Y PLANEAMIENTO</button>
      <div class="panelGESTION id="panelGESTION">
        <BR>
        ${this.html_GESTION}
        <BR>      
      </div>
      <button id="buttons" class="accordion">OBSERVACIONES</button>
      <div class="panelOBSERVACIONES id="panelOBSERVACIONES">
        <BR>
        ${this.html_OBSERVACIONES}
        <BR>      
      </div>
      `;
  }

  async printForm() {
    console.log("print ficha");
    const ventana = window.open(
      "",
      "",
      "top=100,left=100,height=600,width=800"
    );
    ventana.hidden = true;
    ventana.document.write(
      `<title>sistemas_${this.clase}_${this.codigo}</title>`
    );
    ventana.document.write(
      `<link rel="stylesheet" type="text/css" href="../stylesheets/style.css">`
    );
    ventana.document.innerHTML = "";

    // identificacion=`<DIV style="padding:50px">${html_IDENTIFICACION}</DIV>`

    ventana.document.write("<BR>");
    ventana.document.write(this.html_TITULO);
    ventana.document.write("<BR><BR>");
    const tit_identificacion = `<DIV class="title-section-print">1. IDENTIFICACIÓN</DIV>`;
    ventana.document.write(tit_identificacion);
    ventana.document.write(this.html_IDENTIFICACION);

    ventana.document.write(
      '<div  id="image" style="width:100%;text-align: center"> </div>'
    );

    const tit_sistemas_cesion = `<DIV class="title-section-print">2. SISTEMAS LOCALES DE CESIÓN</DIV>`;
    ventana.document.write(tit_sistemas_cesion);
    ventana.document.write(this.html_SISTEMAS_CESION);
    const tit_superficies = `<DIV class="title-section-print">3. SUPERFICIES</DIV>`;
    ventana.document.write(tit_superficies);
    ventana.document.write(this.html_SUPERFICIES);
    const tit_ordenacion = `<DIV class="title-section-print">4. ORDENACIÓN</DIV>`;
    ventana.document.write(tit_ordenacion);
    ventana.document.write(this.html_ORDENACION);
    const tit_superficIe_edif = `<DIV class="title-section-print">5. SUPERFICIE EDIFICABLE</DIV>`;
    ventana.document.write(tit_superficIe_edif);
    ventana.document.write(this.html_SUPERFICIE_EDIF);
    const tit_estandares = `<DIV class="title-section-print">6. ESTANDARES URBANISTICOS</DIV>`;
    ventana.document.write(tit_estandares);
    ventana.document.write(this.html_ESTANDARES_URBANISTICOS);
    const tit_gestion = `<DIV class="title-section-print">7. GESTION</DIV>`;
    ventana.document.write(tit_gestion);
    ventana.document.write(this.html_GESTION);
    const tit_observaciones = `<DIV class="title-section-print">8. OBSERVACIONES</DIV>`;
    ventana.document.write(tit_observaciones);
    ventana.document.write(this.html_OBSERVACIONES);

    await leafletImage(this.mapManager.map2, async function (err, canvas) {
      // Convierte el canvas en un blob

      // Redimensiona el canvas antes de convertirlo en un blob
      const resizedCanvas = document.createElement('canvas');
      const ctx = resizedCanvas.getContext('2d');
      resizedCanvas.width = 800; // Establece la nueva anchura
      resizedCanvas.height = 450; // Establece la nueva altura
      ctx.drawImage(canvas, 0, 0, 800, 450); // Dibuja el canvas original en el canvas redimensionado

      resizedCanvas.toBlob(function (blob) {
        // 'blob' contiene la imagen en formato Blob
        // Puedes manipularlo o mostrarlo como desees
        var image = new Image();
        image.src = URL.createObjectURL(blob);

        var imageContainer = ventana.document.getElementById("image");

        // Agrega la imagen al contenedor en el DOM
        imageContainer.appendChild(resizedCanvas);

        ventana.print();
        ventana.close();

      });
    });
  }

  setHTML_TITLE() {
    this.html_TITULO = `<LABEL class="title-form">FICHA DE ${this.title}  (${this.tipoPlan})</LABEL>`;
  }

  async createForm() {
    this.sigduMap.map.spin(true);

    //console.log(this.html_IDENTIFICACION);
    console.log(this.html_buttons);

    const urlG =
      "http://maps.google.com/?cbll=" +
      this.coord[1] +
      "," +
      this.coord[0] +
      "&cbp=12,90,0,0,5&layer=c";

    let html = "";
    html =
    html +
    `<div class="div-form">
      ${this.html_TITULO}
      <button  id="printFichaUE" class="ui-button ui-widget ui-corner-all button-print" title="Imprimir Ficha"><i class="fa fa-print"></i></button> 
      <a target="_blank" title="Ir a Street view" href="${urlG}}"><img src="${window.location.protocol}//${window.location.host}/opg/images/streetview.png"></a>
      <BR>
      <BR>
      ${this.html_buttons}
      <BR>   
    </div>`;

    const elem = document.getElementById("userinfo");
    elem.innerHTML = html;

    const self = this; // Almacena una referencia a 'this'

    document
      .getElementById("printFichaUE")
      .addEventListener("click", function () {
        self.printForm();
      });

    const acc = document.getElementsByClassName("accordion");
    var i;

    for (i = 0; i < acc.length; i++) {
      acc[i].classList.toggle("activeB");
      var panel = acc[i].nextElementSibling;
      panel.style.display = "block";
      acc[i].addEventListener("click", function () {
        this.classList.toggle("activeB");
        // console.log(this);
        var panel = this.nextElementSibling;
        if (panel.style.display === "block") {
          panel.style.display = "none";
        } else {
          panel.style.display = "block";
        }
      });
    }

    if (this.sigduMap.sidebarStatus == "cerrado") {
      const self = this; // Almacena una referencia a 'this'
      window.setTimeout(function () {
        self.mapManager = new MapManager("map2");
        self.mapManager.createElement(self.geojson, self.color, self.fillColor);
      }, 500);
    } else {
      this.mapManager = new MapManager("map2");
      this.mapManager.createElement(this.geojson, this.color, this.fillColor);
    }

    this.sigduMap.sidebar.open("userinfo");
    this.sigduMap.map.spin(false);
  }
}
