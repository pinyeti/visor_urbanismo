/**
 * Clase para gestionar los sistemas del Plan General del 2023.
 * @memberof module:Frontend
 */
class Form_SISTEMAS_PG2023 {
  /**
   * Crea una instancia de Form_SISTEMAS_PG2023.
   *
   * @param {object} entity - La entidad que contiene la información.
   * @param {object} sigduMap - El mapa SIGDU.
   */
  constructor(entity, sigduMap) {
    this.sigduMap=sigduMap;
    this.geojson = entity.getGeojson();
    this.feature = entity.getFeature();
    this.codigo = entity.getFeature().properties.codi;
    this.identif = entity.getFeature().properties.identificant;
    this.denominacion = entity.getFeature().properties.nom.toUpperCase();
    this.num_inventario = entity.getFeature().properties.inventari;
    this.dominio = entity.getFeature().properties.dominio.toUpperCase();
    this.uso = entity.getFeature().properties.uso.toUpperCase();
    this.ordenacion = entity.getFeature().properties.ordenacio;
    this.clas_suelo = entity
      .getFeature()
      .properties.clasificacion_.toUpperCase();
    this.cadenaCatalogos = "";
    this.ambito = entity.getFeature().properties.ambit.toUpperCase();
    this.obtencion = entity.getFeature().properties.gestion.toUpperCase();
    this.estado = entity.getFeature().properties.estado.toUpperCase();
    this.prioridad = entity.getFeature().properties.programacion.toUpperCase();
    this.observaciones = entity.getFeature().properties.observaciones;
    this.medidas_ambientales = entity.getFeature().properties.med_ambiental;

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
    this.html_ORDENACION_GESTION = ``;
    this.html_GESTION = ``;
    this.html_OBSERVACIONES = ``;
    this.html_MEDIDAS_AMBIENTALES = ``;
    this.html_buttons = ``;
    this.html_TITULO = ``;

    this.mapManager = null;

    this.setHTML_IDENTIFICACION();
    this.setHTML_CARACTERISTICAS();
    this.setHTML_ORDENACION_GESTION();
    this.setHTML_OBSERVACIONES();
    this.setHTML_MEDIDAS_AMBIENTALES();
    this.setHTML_BUTTONS();
    this.setHTML_TITLE();
  }

  setHTML_IDENTIFICACION() {
    this.html_IDENTIFICACION = `
    <table class="table-form">
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

  setHTML_ORDENACION_GESTION() {
    let buttonORD = this.ordenacion;
    if (this.clase == "SLEQ_PG2023" || this.clase == "SGEQ_PG2023")
      buttonORD = `<input type="button" value=${this.ordenacion} name="buttonSistemaOrdenacion" id="buttonSistemaOrdenacion">`;
    this.html_ORDENACION_GESTION = `
      <TABLE class="table-form">
        <tr class="table-form-tr-white">
          <td class="table-form-td2">ORDENACION</td>
          <td class="table-form-td3">${buttonORD}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">CATALOGOS</td>
          <td class="table-form-td3">${this.cadenaCatalogos}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">CLASIFICACIÓN DEL SUELO</td>
          <td class="table-form-td3">${this.clas_suelo}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">ÁMBITO</td>
          <td class="table-form-td3">${this.ambito}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">OBTENCIÓN</td>
          <td class="table-form-td3">${this.obtencion}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">ESTADO</td>
          <td class="table-form-td3">${this.estado}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">PRIORIDAD</td>
          <td class="table-form-td3">${this.prioridad}</td>
        </tr>
      </TABLE>`;
  }

  setHTML_OBSERVACIONES() {
    let regulacion = "";
    switch (this.clase) {
      case "SGEQ_PG2023":
        regulacion = "Su regulación se establece en la Norma 4.3.4 del PG";
        break;
      case "SGEL_PG2023":
        regulacion = "Su regulación se establece en la Norma 4.3.6 del PG";
        break;
    }
    this.html_OBSERVACIONES = `
      <TABLE class="table-form">
        <tr class="table-form-tr-white">
          <td class="table-form-td3">${this.observaciones.replace(
            /\n/g,
            "<br>"
          )}<br>${regulacion}</td>
        </tr>
      </TABLE>`;
  }

  setHTML_MEDIDAS_AMBIENTALES() {
    this.html_MEDIDAS_AMBIENTALES = `
      <TABLE class="table-form">
        <tr class="table-form-tr-white">
          <td class="table-form-td3">${this.medidas_ambientales.replace(
            /\n/g,
            "<br>"
          )}</td>
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
        <button class="accordion">CONDICIONES DE ORDENACION Y GESTIÓN DEL SUELO</button>
        <div class="panelNormativa">
            <BR>
            ${this.html_ORDENACION_GESTION}
            <BR>            
        </div>  
        <button class="accordion">MEDIDAS AMBIENTALES</button>
        <div class="panelNormativa">
            <BR>
            ${this.html_MEDIDAS_AMBIENTALES}
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
    ventana.document.write(`<link rel="stylesheet" type="text/css" href="../stylesheets/style.css">`);
    ventana.document.innerHTML = "";

    // identificacion=`<DIV style="padding:50px">${html_IDENTIFICACION}</DIV>`

    ventana.document.write("<BR>");
    ventana.document.write(this.html_TITULO);
    ventana.document.write("<BR><BR>");
    const tit_identificacion = `<DIV class="title-section-print">1. IDENTIFICACIÓN</DIV>`;
    ventana.document.write(tit_identificacion);
    ventana.document.write(this.html_IDENTIFICACION);
    //ventana.document.write("<BR>");
    //ventana.document.write('<img src="blob:http://localhost/115e5ee6-a3d2-47e9-9d21-4fe34b70ab75">' );
    ventana.document.write(
      '<div  id="image" style="width:100%;text-align: center"> </div>'
    );
    //ventana.document.write("<BR>");
    const tit_caracteristicas = `<DIV class="title-section-print">2. CARACTERISTICAS FUNCIONALES</DIV>`;
    ventana.document.write(tit_caracteristicas);
    ventana.document.write(this.html_CARACTERISTICAS);
    //ventana.document.write("<BR>");
    const tit_normativa = `<DIV class="title-section-print">3. NORMATIVA DE APLICACIÓN</DIV>`;
    ventana.document.write(tit_normativa);
    ventana.document.write(this.html_ORDENACION_GESTION);
    //ventana.document.write("<BR>");

    const tit_medidas_ambientales = `<DIV class="title-section-print">5. MEDIDAS AMBIENTALES</DIV>`;
    ventana.document.write(tit_medidas_ambientales);
    ventana.document.write(this.html_MEDIDAS_AMBIENTALES);

    const tit_observaciones = `<DIV class="title-section-print">5. OBSERVACIONES</DIV>`;
    ventana.document.write(tit_observaciones);
    ventana.document.write(this.html_OBSERVACIONES);
    //ventana.document.write("<BR>");

    //const mapManager = new MapManager("map3");
    //await mapManager.createMap(this.latlng, this.geojson, 17);

    //console.log(mapManager.map2);

    //ventana.print();

    
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
    this.html_TITULO = `<LABEL class="title-form">FICHA DE ${this.title} (${this.subtitle}) (${this.tipoPlan})</LABEL>`
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
        <button  id="printFichaSistemaPG2023" class="ui-button ui-widget ui-corner-all button-print" title="Imprimir Ficha"><i class="fa fa-print"></i></button> 
        <a target="_blank" title="Ir a Street view" href="${urlG}}"><img src="${window.location.protocol}//${window.location.host}/opg/images/streetview.png"></a>
        <BR>
        <BR>
        ${this.html_buttons}
        <BR>   
      </div>`;

    const elem = document.getElementById("userinfo");
    elem.innerHTML = html;

    const self = this; // Almacena una referencia a 'this'

    if (this.clase == "SGEQ_PG2023") {
      document
        .getElementById("buttonSistemaOrdenacion")
        .addEventListener("click", async function () {
          const formParam = new Form_PARAMETROS_EQ_PGOU98(self.ordenacion, self.sigduMap);
          await formParam.initialize();
          await formParam.createForm();
        });
    }

    document
      .getElementById("printFichaSistemaPG2023")
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
