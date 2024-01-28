/**
 * Clase para gestionar los parámetros de equipamientos del PGOU de 1998.
 * @memberof module:Frontend
 */
class Form_PARAMETROS_EQ_PGOU98 {
  /**
   * Crea una instancia de Form_PARAMETROS_EQ_PGOU98.
   *
   * @param {number} ordenacion - El valor de ordenación.
   * @param {object} sigduMap - El mapa SIGDU.
   */
  constructor(ordenacion, sigduMap) {
    this.sigduMap = sigduMap;
    this.ordenacion = ordenacion;

    this.info_parametros = null;
    this.info_tipozona = null;

    this.html_DESCRIPCION = ``;
    this.html_CONDICIONES_EDIFICACION = ``;
   

    this.html_buttons = ``;
    this.html_TITULO = ``;
  }

  async initialize() {
    const reader = new DataReader();
    // QUERY A PARAMETROS EDIF
    this.info_parametros = await reader.readDataFeature(
      "calificacion_eq_visor",
      "codigo='" + this.ordenacion + "'"
    ); 
    console.log("info_parametros", this.info_parametros);

    // QUERY A tipo zonas
    this.info_tipozona = await reader.readDataFeature(
      "tipos_zonas",
      "tipo_zona='" + this.ordenacion + "'"
    );
    console.log("info_tipozona", this.info_tipozona);

    this.setHTML_TITLE();
    this.setHTML_DESCRIPCION();
    this.setHTML_CONDICIONES_EDIFICACION();
    this.setHTML_BUTTONS();
  }

  setHTML_CONDICIONES_EDIFICACION() {
    if (this.info_parametros.features != null)
      this.html_CONDICIONES_EDIFICACION = `
        <TABLE class="table-form">
          <tr class="table-form-tr-white">
            <td class="table-form-td">CALIFICACIÓN</td>
            <td><LABEL class="table-form-label-calific">${this.info_parametros.features[0].properties.codigo}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">ALTURA EN NÚMERO DE PLANTAS</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.h}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">ALTURA MÁXIMA EN METROS</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.hmax}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">ALTURA TOTAL EN METROS</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.htot}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">OCUPACIÓN %</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.oc}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">EDIFICABILIDAD m2/m2.</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.e_p}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">SEPARACIÓ MÍNIMA A ALINEACIONES EN METROS</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.ra}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">SEPARACIÓ MÍNIMA A MEDIANERAS EN METROS</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.rm}</td>
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

  setHTML_BUTTONS() {
    this.html_buttons = `<button id="buttons" class="accordion">DESCRIPCIÓN</button>
      <div class="panelIDENTIF" id="panelIDENTIF">
        <BR>
        ${this.html_DESCRIPCION}
        <BR>      
      </div>
      <button class="accordion">CONDICIONES DE EDIFICACIÓN</button>
      <div class="panelCaract" id="panelCaract">
          <BR>
        ${this.html_CONDICIONES_EDIFICACION}
        <BR>
      </div>
      <button class="accordion">CONDICIONES DE USO</button>
      <div class="panelCaract" id="panelCaract" style='text-align: justify;padding:10px;font-size:9pt;font-family:Arial;color:#000000;'>
          <BR>
          <div style='text-align: justify'>${this.info_tipozona.features[0].properties.condicions_us}</div>  
        
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
    ventana.document.write(`<div style='text-align: justify;padding:10px;font-size:8.7pt;font-family:Arial;color:#000000;'>${this.info_tipozona.features[0].properties.condicions_us}</div>`);

    linkElement.onload = () => {
      ventana.print();
      ventana.close();
    };
    
    ventana.document.head.appendChild(linkElement);
  }

  setHTML_TITLE() {
    this.html_TITULO = `<LABEL class="title-form">EQUIPAMIENTO COMUNITARIO (${this.ordenacion})</LABEL>`;
  }

  async createForm() {
    this.sigduMap.map.spin(true);

    let html = "";
    html =
      html +
      `<div class="div-form">
        ${this.html_TITULO}
        <button  id="printParametersEQ" class="ui-button ui-widget ui-corner-all button-print" title="Imprimir Ficha"><i class="fa fa-print"></i></button> 
        <BR>
        <BR>
        ${this.html_buttons}
        <BR>   
      </div>`;

    const elem = document.getElementById("userinfo");
    elem.innerHTML = html;

    const self = this; // Almacena una referencia a 'this'

    document
    .getElementById("printParametersEQ")
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
