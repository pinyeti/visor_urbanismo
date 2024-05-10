/**
 * Clase para gestionar los parámetros de volumetría específica del PGOU de 1998.
 * @memberof module:Frontend
 */
class Form_PARAMETROS_VE_PGOU98 {
  /**
   * Crea una instancia de Form_PARAMETROS_VE_PGOU98.
   *
   * @param {object} entity - La entidad que contiene la información.
   * @param {object} sigduMap - El mapa SIGDU.
   */
  constructor(entity, sigduMap) {
    this.sigduMap=sigduMap;
    this.fid = entity.getFid();
    this.feature = entity.getFeature();
    this.ordenacion = entity.getFeature().properties.codigo;
    this.titulo_edif = "VOLUMETRIA ESPECIFICA";
    this.tabla = entity.getTable();
    this.tipo_edificacion = this.ordenacion.substring(0, 1);
    this.info_tipozona = ``;
    this.info_volumetrias = ``;
    this.edificabilidad = 0;
    this.num_viv = 0;

    this.html_DESCRIPCION = ``;
    this.html_CONDICIONES_EDIFICACION = ``;
    this.html_VOLUMETRIAS = ``;

    this.html_buttons = ``;
    this.html_TITULO = ``;
  }

  async initialize() {
    const reader = new DataReader();

    // QUERY A tipo zonas
    this.info_tipozona = await reader.readDataFeature(
      "tipos_zonas",
      "tipo_zona='F'"
    );
    console.log("info_tipozona", this.info_tipozona);

    console.log(this.tabla + ", " + this.fid);

    // read cross volumetrias
    this.info_volumetrias = await reader.crossTablesFilter(
      "volumetries",
      this.tabla,
      "fid>0",
      "fid=" + this.fid
    );
    console.log("info_volumetrias", this.info_volumetrias);

    this.setHTML_TITLE();
    this.setHTML_DESCRIPCION();
    this.setHTML_VOLUMETRIAS();
    this.setHTML_CONDICIONES_EDIFICACION();
    this.setHTML_BUTTONS();
  }

  setHTML_VOLUMETRIAS() {
    
    this.html_VOLUMETRIAS = 
      `<TABLE class="table-form">
        <tr align="left" bgcolor="#e5f1fc" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
          <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black' align="right">PLANTA</LABEL></td>
          <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black' align="right">SUPERFICIE M2</LABEL></td>       
          <!--<td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black' align="right">EDIFICABILIDAD M2</LABEL></td>-->          
        </tr>`;

    if (this.info_volumetrias.features)
      for (var n = 0; n < this.info_volumetrias.features.length; n++) {
        var superficie = turf.area(this.info_volumetrias.features[n].geometry);

        superficie = superficie.toFixed(2);

        this.edificabilidad =
          this.edificabilidad +
          superficie * this.info_volumetrias.features[n].properties.altura;

        console.log(this.info_volumetrias.features[n].properties.plantas);

        if (turf.area(this.info_volumetrias.features[n].geometry) > 10)
          this.html_VOLUMETRIAS =
            this.html_VOLUMETRIAS +
              `<tr class="table-form-tr-white">
                <td class="table-form-td">${this.info_volumetrias.features[n].properties.plantas}</td>
                <td class="table-form-td">${superficie}</td>
                <!--<td class="table-form-td">${superficie * this.info_volumetrias.features[n].properties.altura}</td>-->        
            </tr>`;
      }
    this.html_VOLUMETRIAS = this.html_VOLUMETRIAS + `</TABLE>`;

    this.edificabilidad = this.edificabilidad.toFixed(2);

    if(this.ordenacion=="F0a")
      this.num_viv = Math.round(this.edificabilidad / 90);
    else if(this.ordenacion=="F0b")
      this.num_viv = Math.round(this.edificabilidad / 80);
   
      
    
  }

  setHTML_CONDICIONES_EDIFICACION() {
    var condiciones = "";

    var calificacion_plan = "";

    if (
      this.ordenacion == "F0a" ||
      this.ordenacion == "F0b" ||
      this.ordenacion == "F0pb" ||
      this.ordenacion == "F0pc"
    ) {
      condiciones = this.info_tipozona.features[0].properties.condicions_us;
      calificacion_plan = this.ordenacion;
    } else {
      condiciones = this.feature.properties.condiciones.replace(/\n/g, "<br>");
      this.edificabilidad = this.feature.properties.edificabilidad;
      this.num_viv = this.feature.properties.num_viv;
      calificacion_plan = this.feature.properties.calificacion_plan;
    }

    this.html_CONDICIONES_EDIFICACION = `
      <TABLE class="table-form">
        <tr class="table-form-tr-white">
          <td class="table-form-td">CALIFICACIÓN</td>
          <td><LABEL class="table-form-label-style">${this.ordenacion}</td>
        </tr>
        <!--<tr class="table-form-tr-white">
          <td class="table-form-td">CALIFICACIÓ PLAN</td>
          <td><LABEL class="table-form-label-style">${calificacion_plan}</td>
        </tr>-->
        <!--<tr class="table-form-tr-white">
          <td class="table-form-td">EDIFICABILIDAD M2</td>
          <td><LABEL class="table-form-label-style">${this.edificabilidad}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td">Nº VIVIENDAS</td>
          <td><LABEL class="table-form-label-style">${this.num_viv}</td>
        </tr>-->
        <tr  class="table-form-tr-white">
          <td colspan=2 class="table-form-td4">${condiciones}</td>
        </tr>  
      </TABLE>`;
  }

  setHTML_DESCRIPCION() {
    this.html_DESCRIPCION = `
      <TABLE class="table-form">
        <tr class="table-form-tr-white">
          <td class="table-form-td4">${this.info_tipozona.features[0].properties.definicio}</td>
        </tr>       
      </TABLE>`;
  }

  setHTML_TITLE() {
    this.html_TITULO = `<LABEL class="title-form">${this.titulo_edif} (${this.ordenacion})</LABEL>`;
  }


  setHTML_BUTTONS() {
    let buttonVolumetrias = "";
    if (
      this.ordenacion == "F0a" ||
      this.ordenacion == "F0b" ||
      this.ordenacion == "F0pb" ||
      this.ordenacion == "F0pc"
    )
      buttonVolumetrias = `<button class="accordion">VOLUMETRIAS</button>
      <div class="panelCaract" id="panelCaract">
          <BR>
        ${this.html_VOLUMETRIAS}
        <BR>
      </div>`;
    this.html_buttons = `<button id="buttons" class="accordion">DESCRIPCIÓN</button>
        <div class="panelDESCRIPCION" id="panelDESCRIPCION">
          <BR>
          ${this.html_DESCRIPCION}
          <BR>      
        </div>
        
        ${buttonVolumetrias}
          
        <button class="accordion">CONDICIONES DE EDIFICACIÓN</button>
        <div class="panelCaract" id="panelCaract">
            <BR>
          ${this.html_CONDICIONES_EDIFICACION}
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
      `<title>vol_esp_${this.clase}_${this.codigo}</title>`
    );
    const linkElement = ventana.document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.type = 'text/css';
    linkElement.href = '../stylesheets/style.css';

    ventana.document.innerHTML = "";

    ventana.document.write("<BR>");
    ventana.document.write(this.html_TITULO);
    ventana.document.write("<BR><BR>");
    const tit_descripcion = `<DIV class="title-section-print">DESCRIPCIÓN</DIV>`;
    ventana.document.write(tit_descripcion);
    ventana.document.write(this.html_DESCRIPCION);

    const tit_condiciones_edificacion = `<DIV class="title-section-print">CONDICIONES DE EDIFICACIÓN</DIV>`;
    ventana.document.write(tit_condiciones_edificacion);
    ventana.document.write(this.html_CONDICIONES_EDIFICACION);

    const tit_condiciones_uso = `<DIV class="title-section-print">CONDICIONES DE USO</DIV>`;
    ventana.document.write(tit_condiciones_uso);
    ventana.document.write(`<BR>`);
    ventana.document.write(
      `<div style='text-align: justify;padding:10px;font-size:8.7pt;font-family:Arial;color:#000000;'>${this.info_tipozona.features[0].properties.condicions_us}</div>`
    );

    linkElement.onload = () => {
      ventana.print();
      ventana.close();
    };
    
    ventana.document.head.appendChild(linkElement);
  }

  async createForm() {
    this.sigduMap.map.spin(true);

    let html = "";
    html =
      html +
      `<div class="div-form">
        ${this.html_TITULO}
        <button  id="printParametersVOL" class="ui-button ui-widget ui-corner-all button-print" title="Imprimir Ficha"><i class="fa fa-print"></i></button> 
        <BR>
        <BR>
        ${this.html_buttons}
        <BR>   
      </div>`;

    const elem = document.getElementById("userinfo");
    elem.innerHTML = html;

    const self = this; // Almacena una referencia a 'this'

    document
      .getElementById("printParametersVOL")
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
        var panel = this.nextElementSibling;
        if (panel.style.display === "block") {
          panel.style.display = "none";
        } else {
          panel.style.display = "block";
        }
      });
    }

    this.sigduMap.sidebar.open("userinfo");
    this.sigduMap.map.spin(false);
  }
}


