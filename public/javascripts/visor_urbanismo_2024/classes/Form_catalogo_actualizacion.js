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
      <TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
  
        <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
            <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black' align="right">CODIGO</LABEL></td>
            <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;background-color:white;color:#000000;box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);border-style: solid;border-width:0.1pt;border-color:black;width:120px;height:15px'>${this.codigo}</LABEL></td>
        </tr>
       
        <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
            <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black' align="right">DENOMINACIÓN</LABEL></td>
            <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;background-color:white;color:#000000;box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);border-style: solid;border-width:0.1pt;border-color:black;width:120px;height:15px'>${this.denominacion}</LABEL></td>
        </tr>
        <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
        <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black'>PROTECCIÓ</LABEL></td>
        <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;background-color:white;color:#000000;box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);border-style: solid;border-width:0.1pt;border-color:black;width:120px;height:15px'>${this.feature.properties.proteccion}</LABEL></td>
      </tr>
      <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
          <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black'>CATEGORIA</LABEL></td>
          <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;background-color:white;color:#000000;box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);border-style: solid;border-width:0.1pt;border-color:black;width:120px;height:15px'>${this.feature.properties.categoria}</LABEL></td>
      </tr>
      <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
          <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black'>TIPOLOGÍA</LABEL></td>
          <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;background-color:white;color:#000000;box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);border-style: solid;border-width:0.1pt;border-color:black;width:120px;height:15px'>${this.feature.properties.tipologia}</LABEL></td>
      </tr>
      <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
          <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black'>USO ACTUAL</LABEL></td>
          <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;background-color:white;color:#000000;box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);border-style: solid;border-width:0.1pt;border-color:black;width:120px;height:15px'>${this.feature.properties.us_actual}</LABEL></td>
      </tr>
      <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
          <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black'>CRONOLOGÍA</LABEL></td>
          <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;background-color:white;color:#000000;box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);border-style: solid;border-width:0.1pt;border-color:black;width:120px;height:15px'>${this.feature.properties.cronologia}</LABEL></td>
      </tr>
      <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
          <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black'>AUTORÍA</LABEL></td>
          <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;background-color:white;color:#000000;box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);border-style: solid;border-width:0.1pt;border-color:black;width:120px;height:15px'>${this.feature.properties.autoria}</LABEL></td>
      </tr>
      <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
          <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black'>ADSCRIPCIÓn/ESTILO</LABEL></td>
          <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;background-color:white;color:#000000;box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);border-style: solid;border-width:0.1pt;border-color:black;width:120px;height:15px'>${this.feature.properties.adscripcio_estil}</LABEL></td>
      </tr>
      <tr align="left" bgcolor="#eaf5ff" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
          <td style='text-align: justify;padding:3px;font-size:8pt;font-family:Arial;color:black' align="right">ZONA ESTADISTICA</td>
          <td style='text-align: justify;padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>${this.cadenaZonaEst}</td>
      </tr>
      <tr align="left" bgcolor="#eaf5ff" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
          <td style='text-align: justify;padding:3px;font-size:8pt;font-family:Arial;color:black' align="right">REF. CATASTRAL</td>
          <td style='text-align: justify;padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>${this.cadenaParcelas}</td>
      </tr>
      <tr align="left" bgcolor="#eaf5ff" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
          <td style='text-align: justify;padding:3px;font-size:8pt;font-family:Arial;color:black' align="right">CALLES</td>
          <td style='text-align: justify;padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>${this.cadenaCalles}</td>
      </tr>
        
      </TABLE>`;
  }

  /**
   * Método para establecer la sección de descripción en HTML.
   * @returns {void}
   */
  setHTML_DESCRIPCION() {
    this.html_DESCRIPCION = `
        <TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
            <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
                <td style='text-align: justify;padding:8px;font-size:8pt;font-family:Arial;color:black' align="right">DESCRIPCIÓN</td>
                <td style='text-align: justify;padding:8px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.descripcio_element}</td>
            </tr>
            <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
                <td style='text-align: justify;padding:8px;font-size:8pt;font-family:Arial;color:black' align="right">INTERVENCIONES</td>
                <td style='text-align: justify;padding:8px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.intervencions}</td>
            </tr>
            <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
                <td style='text-align: justify;padding:8px;font-size:8pt;font-family:Arial;color:black' align="right">ESTADO DE CONSERVACIÓN</td>
                <td style='text-align: justify;padding:8px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.estat_conservacio}</td>
            </tr>
            <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
                <td style='text-align: justify;padding:8px;font-size:8pt;font-family:Arial;color:black' align="right">REGIMEN JURÍDICO I DE PROPIEDAD</td>
                <td style='text-align: justify;padding:8px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.regim_juridic_propietat}</td>
            </tr>
            <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
                <td style='text-align: justify;padding:8px;font-size:8pt;font-family:Arial;color:black' align="right">OTRAS PROTECCIONES</td>
                <td style='text-align: justify;padding:8px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.altres_proteccions}</td>
            </tr>
            <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
                <td style='text-align: justify;padding:8px;font-size:8pt;font-family:Arial;color:black' align="right">BIBLIOGRAFÍA I DOCUMENTACIÓN</td>
                <td style='text-align: justify;padding:8px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.bibliografia_documentacion}</td>
            </tr>  
        </TABLE>`;
  }

  /**
   * Método para establecer la sección de protección y directrices de intervención en HTML.
   * @returns {void}
   */
  setHTML_PROT_DIR() {
    this.html_PROT_DIR = `
        <TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
            <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
                <td style='text-align: justify;padding:8px;font-size:8pt;font-family:Arial;color:black' align="right">USOS PERMITIDOS</td>
                <td style='text-align: justify;padding:8px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.usos_permesos}</td>
            </tr>
            <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
                <td style='text-align: justify;padding:8px;font-size:8pt;font-family:Arial;color:black' align="right">CONJUNTO</td>
                <td style='text-align: justify;padding:8px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.conjunt}</td>
            </tr>
            <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
                <td style='text-align: justify;padding:8px;font-size:8pt;font-family:Arial;color:black' align="right">COMPOSICIÓN VOLUMETRICA</td>
                <td style='text-align: justify;padding:8px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.composicio_volumetrica}</td>
            </tr>
            <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
                <td style='text-align: justify;padding:8px;font-size:8pt;font-family:Arial;color:black' align="right">ESTRUCTURA</td>
                <td style='text-align: justify;padding:8px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.estructura}</td>
            </tr>
            <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
                <td style='text-align: justify;padding:8px;font-size:8pt;font-family:Arial;color:black' align="right">FACHADAS</td>
                <td style='text-align: justify;padding:8px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.facanes}</td>
            </tr>
            <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
                <td style='text-align: justify;padding:8px;font-size:8pt;font-family:Arial;color:black' align="right">CUBIERTAS</td>
                <td style='text-align: justify;padding:8px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.cobertes}</td>
            </tr>  
            <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
                <td style='text-align: justify;padding:8px;font-size:8pt;font-family:Arial;color:black' align="right">INTERIORES</td>
                <td style='text-align: justify;padding:8px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.interiors}</td>
            </tr>  
            <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
                <td style='text-align: justify;padding:8px;font-size:8pt;font-family:Arial;color:black' align="right">ESPACIOS COMUNES</td>
                <td style='text-align: justify;padding:8px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.espais_comuns}</td>
            </tr>  
            <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
                <td style='text-align: justify;padding:8px;font-size:8pt;font-family:Arial;color:black' align="right">OTROS ELEMENTOS</td>
                <td style='text-align: justify;padding:8px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.altres_elements}</td>
            </tr>  
            <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
                <td style='text-align: justify;padding:8px;font-size:8pt;font-family:Arial;color:black' align="right">ORDENACZAS DE APLICACIÓN</td>
                <td style='text-align: justify;padding:8px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.ordenaces_aplicacions}</td>
            </tr>  
        </TABLE>`;
  }

  /**
   * Método para establecer la sección de entorno de protección en HTML.
   * @returns {void}
   */
  setHTML_ENTORNO() {
    this.html_ENTORNO = `
        <TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
          <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
        
            <td style='text-align: justify;padding:8px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.entorn_proteccio}</td>
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
    this.html_TITULO = ` <LABEL style='padding:5px;font-size:8.5pt;font-family:Arial Black;background-color:#fdfde0;color:#1a4d1a;box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);border-style: solid;border-width:0.1pt;border-color:black;width:380px;height:20px;'>FICHA DE ${this.title}  (${this.tipoPlan})</LABEL>`;
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
    ventana.document.innerHTML = "";

    // identificacion=`<DIV style="padding:50px">${html_IDENTIFICACION}</DIV>`

    ventana.document.write("<BR>");
    ventana.document.write(this.html_TITULO);
    ventana.document.write("<BR><BR>");
    const tit_identificacion = `<DIV style='padding:3px;font-size:8.5pt;font-family:Arial Black;background-color:rgba(85, 140, 212, 1);color:white;border-style: solid;border-width:0.1pt;border-color:RGB(12,1,73);width:99%;height:14px;'>1. IDENTIFICACIÓN</DIV>`;
    ventana.document.write(tit_identificacion);
    ventana.document.write(this.html_IDENTIFICACION);

    ventana.document.write(
      '<div  id="image" style="width:100%;text-align: center"> </div>'
    );
    const tit_descripcion = `<DIV style='padding:3px;font-size:8.5pt;font-family:Arial Black;background-color:rgba(85, 140, 212, 1);color:white;border-style: solid;border-width:0.1pt;border-color:RGB(12,1,73);width:99%;height:14px;'>2. DESCRIPCIÓN</DIV>`;
    ventana.document.write(tit_descripcion);
    ventana.document.write(this.html_DESCRIPCION);
    const tit_prot_dir = `<DIV style='padding:3px;font-size:8.5pt;font-family:Arial Black;background-color:rgba(85, 140, 212, 1);color:white;border-style: solid;border-width:0.1pt;border-color:RGB(12,1,73);width:99%;height:14px;'>3. PROTECCIÓN Y DIRECTRICES DE INTERVENCIÓN</DIV>`;
    ventana.document.write(tit_prot_dir);
    ventana.document.write(this.html_PROT_DIR);
    const tit_entorno = `<DIV style='padding:3px;font-size:8.5pt;font-family:Arial Black;background-color:rgba(85, 140, 212, 1);color:white;border-style: solid;border-width:0.1pt;border-color:RGB(12,1,73);width:99%;height:14px;'>4. ENTORNO DE PROTECCIÓN</DIV>`;
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
      `<div style='overflow: auto;padding:20px;background-color:#f2f2f2;border-style: solid;border-width:0pt;border-color:black;box-shadow: 3px 3px 3px 3px rgba(0, 0, 0, 0.2);position:absolute;width:90%;height:90%;top:10px;left:10px'>
        ${this.html_TITULO}
        <button  id="printFichaUE" style="padding-top:4px;padding-bottom:4px;" class="ui-button ui-widget ui-corner-all" title="Imprimir Ficha"><i class="fa fa-print"></i></button> 
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
        this.mapManager = new MapManager("map2");
        this.mapManager.createElement(self.geojson, self.color, self.fillColor);
      }, 500);
    } else {
      this.mapManager = new MapManager("map2");
      this.mapManager.createElement(this.geojson, this.color, this.fillColor);
    }

    await this.sigduMap.sidebar.open("userinfo");

    this.sigduMap.map.spin(false);
  }

}
