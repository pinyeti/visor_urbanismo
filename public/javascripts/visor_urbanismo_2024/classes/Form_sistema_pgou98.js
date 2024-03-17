/**
 * Clase para gestionar los sistemas del Plan General del 1998.
 * @memberof module:Frontend
 */
class Form_SISTEMAS_PGOU98 {
  /**
   * Crea una instancia de Form_SISTEMAS_PGOU98.
   *
   * @param {object} entity - La entidad que contiene la información.
   * @param {object} sigduMap - El mapa SIGDU.
   */
  constructor(entity, sigduMap) {
    this.sigduMap = sigduMap;
    this.geojson = entity.getGeojson();
    this.feature = entity.getFeature();
    this.codigo = entity.getFeature().properties.codigo;
    this.identif = entity.getFeature().properties.identif;
    this.denominacion = entity.getFeature().properties.denominaci;
    this.num_inventario = entity.getFeature().properties.num_inv;
    this.dominio = entity.getFeature().properties.domini;
    this.uso = entity.getFeature().properties.us;
    this.ordenacion = entity.getFeature().properties.ordenacion;
    this.plan_aprov = entity.getFeature().properties.plan_aprov;
    this.planejam = entity.getFeature().properties.planejam;
    this.otros = entity.getFeature().properties.otros;
    this.clas_suelo = entity.getFeature().properties.clas_suelo;
    this.cadenaCatalogos = "";
    this.asignacion = entity.getFeature().properties.asignacio;
    this.ambit = entity.getFeature().properties.ambit;
    this.codigo_ue = entity.getFeature().properties.codigo_ue;
    this.sistema = entity.getFeature().properties.sistema;
    this.etapes = entity.getFeature().properties.etapes;
    this.observaciones = entity.getFeature().properties.observac;

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
    this.html_CARACTERISTICAS = ``;
    this.html_NORMATIVA = ``;
    this.html_GESTION = ``;
    this.html_OBSERVACIONES = ``;
    this.html_buttons = ``;
    this.html_TITULO = ``;

    this.mapManager = null;

    this.setHTML_IDENTIFICACION();
    this.setHTML_CARACTERISTICAS();
    this.setHTML_NORMATIVA();
    this.setHTML_GESTION();
    this.setHTML_OBSERVACIONES();
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

  
  /**
   * Establece el contenido HTML para la sección de identificación.
   */
  setHTML_IDENTIFICACION() {
    this.html_IDENTIFICACION = `
      <TABLE class="table-form">
        <tr class="table-form-tr-white">
          <td class="table-form-td">CODIGO</td>
          <td><LABEL class="table-form-label-style">${this.codigo}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td">IDENTIFICANTE</td>
          <td><LABEL class="table-form-label-style">${this.identif}</td>
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

  setHTML_CARACTERISTICAS() {
    this.html_CARACTERISTICAS = `
      <TABLE class="table-form">
        <tr class="table-form-tr-white">
          <td class="table-form-td2">SUPERFICIE</td>
          <td class="table-form-td3">${this.area}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">NUM. INVENTARIO</td>
          <td class="table-form-td3">${this.num_inventario}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">DOMINIO</td>
          <td class="table-form-td3">${this.dominio}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">USO</td>
          <td class="table-form-td3">${this.uso}</td>
        </tr>        
      </TABLE>`;
  }

  setHTML_NORMATIVA() {
    let buttonORD = this.ordenacion;
    if (this.clase == "SLEQ_PGOU98" || this.clase == "SGEQ_PGOU98")
      //buttonORD = `<input type="button" name="Boton1" value=${this.ordenacion} OnClick="this.fichaEDIFICACION_EQ_PG(this)">`;
      buttonORD = `<input type="button" value=${this.ordenacion} name="buttonSistemaOrdenacion" id="buttonSistemaOrdenacion">`;
    this.html_NORMATIVA = `
      <TABLE class="table-form">
        <tr class="table-form-tr-white">
          <td class="table-form-td2">ORDENACION</td>
          <td class="table-form-td3">${buttonORD}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">PLAN. APROV.</td>
          <td class="table-form-td3">${this.plan_aprov}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">PLANEAMIENTO</td>
          <td class="table-form-td3">${this.planejam}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">OTROS</td>
          <td class="table-form-td3">${this.otros}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">CLASIF. SUELO</td>
          <td class="table-form-td3">${this.clas_suelo}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">CATALOGOS</td>
          <td class="table-form-td3">${this.cadenaCatalogos}</td>
        </tr>
      </TABLE>`;
  }

  setHTML_GESTION() {
    this.html_GESTION = `
      <TABLE class="table-form">
        <tr class="table-form-tr-white">
          <td class="table-form-td2">ASIGNACIÓN</td>
          <td class="table-form-td3">${this.asignacion}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">AMBITO</td>
          <td class="table-form-td3">${this.ambit} ${this.codigo_ue}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">SISTEMA</td>
          <td class="table-form-td3">${this.sistema}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">ETAPAS</td>
          <td class="table-form-td3">${this.etapes}</td>
        </tr>    
      </TABLE>`;
  }

  setHTML_OBSERVACIONES() {
    this.html_OBSERVACIONES = `
      <TABLE class="table-form">
        <tr class="table-form-tr-white">
          <td class="table-form-td3">${this.observaciones}</td>
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
      <button class="accordion">CARACTERISTTCAS FUNCIONALES</button>
      <div class="panelCaract" id="panelCaract">
          <BR>
        ${this.html_CARACTERISTICAS}
        <BR>
      </div>
      <button class="accordion">NORMATIVA DE APLICACIÓN</button>
      <div class="panelNormativa">
          <BR>
          ${this.html_NORMATIVA}
          <BR>            
      </div>  
      <button class="accordion">GESTIÓN DEL SUELO</button>
      <div class="paneGestion">
          <BR>
          ${this.html_GESTION}
          <BR>            
      </div>  
      <button class="accordion">OBSERVACIONES</button>
      <div class="paneObservaciones">
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
    const tit_normativa = `<DIV class="title-section-print">3. NORMATIVA DE APLICACIÓN</DIV>`;
    ventana.document.write(tit_normativa);
    ventana.document.write(this.html_NORMATIVA);
    const tit_gestion = `<DIV class="title-section-print">4. GESTÓN DEL SUELO</DIV>`;
    ventana.document.write(tit_gestion);
    ventana.document.write(this.html_GESTION);
    const tit_observaciones = `<DIV class="title-section-print">5. OBSERVACIONES</DIV>`;
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
        <button  id="printFichaSistemaPGOU98" class="ui-button ui-widget ui-corner-all button-print" title="Imprimir Ficha"><i class="fa fa-print"></i></button> 
        <a target="_blank" title="Ir a Street view" href="${urlG}}"><img src="${window.location.protocol}//${window.location.host}/opg/images/streetview.png"></a>
        <BR>
        <BR>
        ${this.html_buttons}
        <BR>   
      </div>`;

    const elem = document.getElementById("userinfo");
    elem.innerHTML = html;

    const self = this; // Almacena una referencia a 'this'

    if (this.clase == "SLEQ_PGOU98" || this.clase == "SGEQ_PGOU98") {
      document
        .getElementById("buttonSistemaOrdenacion")
        .addEventListener("click", async function () {
          const formParam = new Form_PARAMETROS_EQ_PGOU98(
            self.ordenacion,
            self.sigduMap
          );
          await formParam.initialize();
          await formParam.createForm();
        });
    }

    document
      .getElementById("printFichaSistemaPGOU98")
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
      this.sigduMap.sidebar.open("userinfo");
      window.setTimeout(function () {
        self.mapManager = new MapManager("map2");
        self.mapManager.createElement(self.geojson, self.color, self.fillColor);
      }, 500);
    } else {
      this.mapManager = new MapManager("map2");
      this.mapManager.createElement(this.geojson, this.color, this.fillColor);
    }

    //this.sigduMap.sidebar.open("userinfo");
    this.sigduMap.map.spin(false);
  }
}
