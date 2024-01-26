/**
 * Clase para generar ficha del catalogo del PGOU98.
 * @memberof module:Frontend
 */
class Form_CATALOGO_ACTUALIZACION {
  /**
   * Constructor de la clase.
   * @param {object} entity - La entidad geoespacial.
   */
  constructor(entity, sigduMap) {
    this.self=this;
    console.log("creating form");
    this.sigduMap = sigduMap;
    this.geojson = entity.getGeojson();
    this.feature = entity.getFeature();
    this.codigo = entity.getFeature().properties.codigo;
    this.denominacion =
      entity.getFeature().properties.denominacion.toUpperCase() || "-";

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
    this.html_DESCRIPCION = ``;
    this.html_PROT_DIR = ``;
    this.html_ENTORNO = ``;

    this.mapManager = null;

    console.log("creating form end")

    this.setHTML_IDENTIFICACION();
    this.setHTML_DESCRIPCION();
    this.setHTML_PROT_DIR();
    this.setHTML_ENTORNO();
    this.setHTML_TITLE();
    this.setHTML_BUTTONS();
  }

  /**
   * Método para establecer la sección de identificación en HTML.
   * @returns {void}
   */
  setHTML_IDENTIFICACION() {
    this.html_IDENTIFICACION = `
      <table class="table-form">
        <tr class="table-form-tr-white">
          <td class="table-form-td">CODIGO</td>
          <td><LABEL class="table-form-label-style">${this.codigo}</td>
        </tr>   
        <tr class="table-form-tr-white">
          <td class="table-form-td">DENOMINACIÓN</td>
          <td><LABEL class="table-form-label-style">${this.denominacion}</td>
        </tr>  
        <tr class="table-form-tr-white">
          <td class="table-form-td">PROTECCIÓN</td>
          <td><LABEL class="table-form-label-style">${this.feature.properties.proteccion}</td>
        </tr>   
        <tr class="table-form-tr-white">
          <td class="table-form-td">CATEGORIA</td>
          <td><LABEL class="table-form-label-style">${this.feature.properties.categoria}</td>
        </tr>  
        <tr class="table-form-tr-white">
          <td class="table-form-td">TIPOLOGÍA</td>
          <td><LABEL class="table-form-label-style">${this.feature.properties.tipologia}</td>
        </tr> 
        <tr class="table-form-tr-white">
          <td class="table-form-td">USO ACTUAL</td>
          <td><LABEL class="table-form-label-style">${this.feature.properties.us_actual}</td> 
        </tr> 
        <tr class="table-form-tr-white">
          <td class="table-form-td">CRONOLOGÍA</td>
          <td><LABEL class="table-form-label-style">${this.feature.properties.cronologia}</td> 
        </tr>  
        <tr class="table-form-tr-white">
          <td class="table-form-td">AUTORÍA</td>
          <td><LABEL class="table-form-label-style">${this.feature.properties.autoria}</td> 
        </tr>  
        <tr class="table-form-tr-white">
          <td class="table-form-td">ADSCRIPCIÓN/ESTILO</td>
          <td><LABEL class="table-form-label-style">${this.feature.properties.adscripcio_estil}</td> 
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

  /**
   * Método para establecer la sección de descripción en HTML.
   * @returns {void}
   */
  setHTML_DESCRIPCION() {
    this.html_DESCRIPCION = `
      <table class="table-form">
        <tr class="table-form-tr-white">
          <td class="table-form-td2">DESCRIPCIÓN</td>
          <td class="table-form-td3">${this.feature.properties.descripcio_element}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">INTERVENCIONES</td>
          <td class="table-form-td3">${this.feature.properties.intervencions}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">ESTADO DE CONSERVACIÓN</td>
          <td class="table-form-td3">${this.feature.properties.estat_conservacio}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">REGIMEN JURÍDICO I DE PROPIEDAD</td>
          <td class="table-form-td3">${this.feature.properties.regim_juridic_propietat}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">OTRAS PROTECCIONES</td>
          <td class="table-form-td3">${this.feature.properties.altres_proteccions}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">BIBLIOGRAFÍA I DOCUMENTACIÓN</td>
          <td class="table-form-td3">${this.feature.properties.bibliografia_documentacion}</td>
        </tr>
      </TABLE>`;
  }

  /**
   * Método para establecer la sección de protección y directrices de intervención en HTML.
   * @returns {void}
   */
  setHTML_PROT_DIR() {
    this.html_PROT_DIR = `
      <table class="table-form">
        <tr class="table-form-tr-white">
          <td class="table-form-td2">USOS PERMITIDOS</td>
          <td class="table-form-td3">${this.feature.properties.usos_permesos}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">CONJUNTO</td>
          <td class="table-form-td3">${this.feature.properties.conjunt}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">COMPOSICIÓN VOLUMETRICA</td>
          <td class="table-form-td3">${this.feature.properties.composicio_volumetrica}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">ESTRUCTURA</td>
          <td class="table-form-td3">${this.feature.properties.estructura}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">FACHADAS</td>
          <td class="table-form-td3">${this.feature.properties.facanes}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">CUBIERTAS</td>
          <td class="table-form-td3">${this.feature.properties.cobertes}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">INTERIORES</td>
          <td class="table-form-td3">${this.feature.properties.interiors}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">ESPACIOS COMUNES</td>
          <td class="table-form-td3">${this.feature.properties.espais_comuns}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">OTROS ELEMENTOS</td>
          <td class="table-form-td3">${this.feature.properties.altres_elements}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">ORDENACZAS DE APLICACIÓN</td>
          <td class="table-form-td3">${this.feature.properties.ordenaces_aplicacions}</td>
        </tr>
      </TABLE>`;
  }

  /**
   * Método para establecer la sección de entorno de protección en HTML.
   * @returns {void}
   */
  setHTML_ENTORNO() {
    this.html_ENTORNO = `
      <table class="table-form">
        <tr class="table-form-tr-white">
           <td class="table-form-td3">${this.feature.properties.entorn_proteccio}</td>
        </tr>
      </TABLE>`;
  }

  /**
   * Método para establecer la secciones en la clase accordion de la ficha.
   * @returns {void}
   */
  setHTML_BUTTONS() {
    this.html_buttons = `<button id="buttons" class="accordion">IDENTIFICACIÓN</button>
      <div class="panelIDENTIF id="panelIDENTIF">
        <BR>
        ${this.html_IDENTIFICACION}
        <div id='map2'></div>
        <BR>      
      </div>
      <button id="buttons" class="accordion">DESCRIPCIÓN</button>
      <div class="panelDESCRIPCION id="panelDESCRIPCION">
        <BR>
        ${this.html_DESCRIPCION}
        <BR>      
      </div>
      <button id="buttons" class="accordion">PROTECCIÓN Y DIRECTRICES DE INTERVENCIÓN</button>
      <div class="panelPROT_DIR id="panelPROT_DIR">
        <BR>
        ${this.html_PROT_DIR}
        <BR>      
      </div>
      <button id="buttons" class="accordion">ENTORNO DE PROTECCIÓN</button>
      <div class="panelPROT id="panelPROT">
        <BR>
        ${this.html_ENTORNO}
        <BR>      
      </div>
      
      
      `;
  }

  /**
   * Método para establecer el título en HTML.
   *  @returns {void}
   */
  setHTML_TITLE() {
    this.html_TITULO = `<LABEL class="title-form">FICHA DE ${this.title}  (${this.tipoPlan})</LABEL>` 
  }
 
  /**
   * Método para imprimir el formulario.
   * @async
   * @returns {void}
   */
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

    ventana.document.write("<BR>");
    ventana.document.write(this.html_TITULO);
    ventana.document.write("<BR><BR>");
    const tit_identificacion = `<DIV class="title-section-print">1. IDENTIFICACIÓN</DIV>`;
    ventana.document.write(tit_identificacion);
    ventana.document.write(this.html_IDENTIFICACION);
    ventana.document.write(
      '<div  id="image" style="width:100%;text-align: center"> </div>'
    ); 
    const tit_descripcion = `<DIV class="title-section-print">2. DESCRIPCIÓN</DIV>`;
    ventana.document.write(tit_descripcion);
    ventana.document.write(this.html_DESCRIPCION);
    const tit_prot_dir = `<DIV class="title-section-print">3. PROTECCIÓN Y DIRECTRICES DE INTERVENCIÓN</DIV>`;
    ventana.document.write(tit_prot_dir);
    ventana.document.write(this.html_PROT_DIR);
    const tit_entorno = `<DIV class="title-section-print">4. ENTORNO DE PROTECCIÓN</DIV>`;
    ventana.document.write(tit_entorno);
    ventana.document.write(this.html_ENTORNO);

    await leafletImage(this.mapManager.map2, async function (err, canvas) {
      // Convierte el canvas en un blob

      canvas.toBlob(function (blob) {
        // 'blob' contiene la imagen en formato Blob
        // Puedes manipularlo o mostrarlo como desees
        var image = new Image();
        image.src = URL.createObjectURL(blob);

        var imageContainer = ventana.document.getElementById("image");
        image.width = 700;
        image.height = 400;

        // Agrega la imagen al contenedor en el DOM
        imageContainer.appendChild(canvas);

        ventana.print();

        // Ahora puedes acceder a la imagen a través de 'image.src'
        // Puedes agregar 'image' al DOM o hacer cualquier otra cosa que desees
      });

      //ventana.close();
    });
  }

  /**
   * Método para crear el formulario.
   * @async
   * @returns {void}
   */
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
        <button  id="printFichaCAT_ACT" class="ui-button ui-widget ui-corner-all button-print" title="Imprimir Ficha"><i class="fa fa-print"></i></button> 
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
      .getElementById("printFichaCAT_ACT")
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
        this.mapManager = new MapManager("map2");
        this.mapManager.createElement(self.geojson, self.color, self.fillColor);
      }, 500);
    } else {
      this.mapManager = new MapManager("map2");
      this.mapManager.createElement(this.geojson, this.color, this.fillColor);
    }

    //await this.sigduMap.sidebar.open("userinfo");

    this.sigduMap.map.spin(false);
  }

}
