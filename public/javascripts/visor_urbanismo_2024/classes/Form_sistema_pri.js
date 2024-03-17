/**
 * Clase para gestionar sistemas en el Plan de Reforma Interior (PRI).
 * @memberof module:Frontend
 */
class Form_SISTEMAS_PRI {
  /**
   * Crea una instancia de Form_SISTEMAS_PRI.
   *
   * @param {object} entity - La entidad que contiene la información.
   * @param {object} sigduMap - El mapa SIGDU.
   */
  constructor(entity, sigduMap) {
    this.sigduMap = sigduMap;
    this.geojson = entity.getGeojson();
    this.feature = entity.getFeature();
    this.codigo = entity.getFeature().properties.codigo;
    this.denominacion = entity.getFeature().properties.denominacion || "-";
    this.denominacion = this.denominacion.toUpperCase();
    this.tipo_sistema = entity.getFeature().properties.tipo_sistema;
    if (this.tipo_sistema == "SL") this.tipo_sistema = "SISTEMA LOCAL";
    else this.tipo_sistema = "SISTEMA GENERAL";
    this.uso_dotacional = entity.getFeature().properties.uso_dotacional || "-";
    this.clas_suelo = entity.getFeature().properties.tipo_suelo;
    if (this.clas_suelo == "SU") this.clas_suelo = "SUELO URBANO";
    else this.clas_suelo = "SUELO URBANIZABLE";
    this.dominio = entity.getFeature().properties.dominio;
    if (this.dominio == null) this.dominio = "PÚBLICO";
    if (this.dominio == "PBL") this.clas_suelo = "PÚBLICO";
    if (this.dominio == "PRV") this.clas_suelo = "PRIVADO";
    this.estado_actual = entity.getFeature().properties.estado_actual;
    if (this.estado_actual == "E") this.estado_actual = "EXISTENTE";
    else this.estado_actual = "PROPUESTO";
    this.ambito_gestion = entity.getFeature().properties.ambito_gestion;
    this.cadenaCatalogos = "";

    this.cadenaZonaEst = entity.getZonaEstadisticaString();
    this.cadenaParcelas = entity.getRefcatString();
    this.cadenaCalles = entity.getCallesString();
    this.title = entity.title;
    this.subtitle = this.tipo_sistema;
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
    this.html_CARACTERISTICAS = ``;
    this.html_buttons = ``;
    this.html_TITULO = ``;

    this.mapManager = null;

    this.setHTML_IDENTIFICACION();
    this.setHTML_CARACTERISTICAS();
    this.setHTML_BUTTONS();
    this.setHTML_TITLE();

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
        <tr class="table-form-tr-white">
          <td class="table-form-td">TIPO DE SISTEMA</td>
          <td><LABEL class="table-form-label-style">${this.tipo_sistema}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td">USO DOTACIONAL</td>
          <td><LABEL class="table-form-label-style">${this.uso_dotacional}</td>
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

  setHTML_CARACTERISTICAS() {
    this.html_CARACTERISTICAS = `
		  <TABLE class="table-form">
        <tr class="table-form-tr-white">
          <td class="table-form-td2">SUPERFICIE</td>
          <td class="table-form-td3">${this.area}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">CLASIFICACION SUELO</td>
          <td class="table-form-td3">${this.clas_suelo}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">DOMINIO</td>
          <td class="table-form-td3">${this.dominio}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">ESTADO ACTUAL</td>
          <td class="table-form-td3">${this.estado_actual}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">AMBITO GESTIÓN</td>
          <td class="table-form-td3">${this.ambito_gestion}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">CATALOGOS</td>
          <td class="table-form-td3">${this.cadenaCatalogos}</td>
        </tr>	
		  </TABLE>`;
  }

  setHTML_BUTTONS() {
    this.html_buttons = `<button id="buttons" class="accordion">IDENTIFICACIÓN</button>
        <div class="panelIDENTIF" id="panelIDENTIF">
          <BR>
          ${this.html_IDENTIFICACION}
          <div id='map2'></div>
          <BR>      
        </div>
        <button class="accordion">CARACTERISTICAS FUNCIONALES</button>
        <div class="panelCaract" id="panelCaract">
            <BR>
          ${this.html_CARACTERISTICAS}
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

    const tit_caracteristicas = `<DIV class="title-section-print">2. CARACTERITICAS FUNCIONALES</DIV>`;
    ventana.document.write(tit_caracteristicas);
    ventana.document.write(this.html_CARACTERISTICAS);

    await leafletImage(this.mapManager.map2, async function (err, canvas) {
      // Convierte el canvas en un blob

      // Redimensiona el canvas antes de convertirlo en un blob
      const resizedCanvas = document.createElement("canvas");
      const ctx = resizedCanvas.getContext("2d");
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
    this.html_TITULO = `<LABEL class="title-form">FICHA DE ${this.title} (${this.subtitle}) (${this.tipoPlan})</LABEL>`;
  }

  async createForm() {
    this.sigduMap.map.spin(true);

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
        <button  id="printFichaSistemaPRI" class="ui-button ui-widget ui-corner-all button-print" title="Imprimir Ficha"><i class="fa fa-print"></i></button> 
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
      .getElementById("printFichaSistemaPRI")
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
