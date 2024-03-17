/**
 * Clase para gestionar los parámetros de calificación PRI (Plan Regulador Interior).
 * @memberof module:Frontend
 */
class Form_PARAMETROS_CALIFICACIONES_PRI {
  /**
   * Crea una instancia de Form_PARAMETROS_CALIFICACIONES_PRI.
   *
   * @param {object} entity - La entidad de datos.
   * @param {string} tipo_edificacion - El tipo de edificación.
   * @param {object} sigduMap - El mapa SIGDU.
   */
  constructor(entity, tipo_edificacion, sigduMap) {
    this.fid = entity.getFid();
    this.feature = entity.getFeature();
    this.ordenacion = this.feature.properties.codigo;
    this.tabla = entity.getTable();
    this.titulo_edif = "";
    this.tabla_parametros = "";
    this.tabla = entity.getTable();
    this.tipo_edificacion = tipo_edificacion;
    this.titulo_irp = "";
    this.info_parametros = ``;
    this.info_tipozona = ``;
    this.sigduMap = sigduMap;

    switch (this.tipo_edificacion) {
      case "D_PRI":
        this.titulo_edif = "RESIDENCIAL ENTRE MEDIANERAS";
        this.tabla_parametros = "parametros_residencial_entre_mitgeres";
        break;
      case "E_PRI":
        this.titulo_edif = "VIVIENDA EDIFICACION ABIERTA";
        this.tabla_parametros = "parametros_habitatge_edificacio_oberta";
        break;
      case "VT_PRI":
        this.titulo_edif = "VIVIENDA TRADICIONAL";
        this.tabla_parametros = "parametros_habitatge_tradicional";
        break;
      case "I_PRI":
        this.titulo_edif = "VIVIENDA UNIFAMILIAR AISLADA";
        this.tabla_parametros = "parametros_habitatge_unifamiliar_aillat";
        break;
      case "VA_PRI":
        this.titulo_edif = "VIVIENDA UNIFAMILIAR ADOSADA";
        this.tabla_parametros = "parametros_habitatge_unifamiliar_aillat";
        break;
      case "T_PRI":
        this.titulo_edif = "ZONA TURISTICA";
        this.tabla_parametros = "parametros_turistica";
        break;
      case "TH_PRI":
        this.titulo_edif = "ZONA TURISTICA HOTELERA";
        this.tabla_parametros = "parametros_turistica_hotelera";
        break;
      case "S_PRI":
        this.titulo_edif = "ZONA COMERCIAL SERVICIOS";
        this.tabla_parametros = "parametros_comercial_serveis";
        break;
    }

    this.html_DESCRIPCION = ``;
    this.html_CONDICIONES_EDIFICACION = ``;

    this.html_buttons = ``;
    this.html_TITULO = ``;
  }

  async initialize() {
    const reader = new DataReader();

    console.log(this.tabla_parametros + "," + this.ordenacion);
    // QUERY A PARAMETROS EDIF
    this.info_parametros = await reader.readDataFeature(
      this.tabla_parametros,
      "calificacion='" + this.ordenacion + "'"
    );
    console.log("info_parametros", this.info_parametros);

    // QUERY A tipo zonas
    this.info_tipozona = await reader.readDataFeature(
      "pri_tipos_zonas",
      "tipo_zona='" + this.feature.properties.tipo_zona + "'"
    );
    console.log("info_tipozona", this.info_tipozona);

    this.setHTML_TITLE();
    this.setHTML_DESCRIPCION();
    this.setHTML_CONDICIONES_EDIFICACION();
    this.setHTML_BUTTONS();

    let urlA = new URL(window.location.protocol+'//'+window.location.host+"/opg/write_data_user");
    const paramsA = {accion:"ficha_"+this.tipo_edificacion+":"+this.ordenacion};
        Object.keys(paramsA).forEach(key => urlA.searchParams.append(key, paramsA[key]));
        const dataRequestA = {
            method: 'POST'
        }; 
    fetch(urlA,dataRequestA);
  }

  setHTML_CONDICIONES_EDIFICACION() {
    if (this.titulo_edif == "RESIDENCIAL ENTRE MEDIANERAS")
      this.html_CONDICIONES_EDIFICACION = `
        <TABLE class="table-form">
          <tr class="table-form-tr-white">
            <td class="table-form-td">CALIFICACIÓN</td>
            <td><LABEL class="table-form-label-calific">${this.info_parametros.features[0].properties.calificacion}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">SUPERFICIE MINIMA PARCELA (M2)</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.superficie_minima_m2}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">ANCHO MINIMO PARCELA (M)</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.amplada_minima_m}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">NUM. DE PISOS MÀXIMO</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.num_pisos_maxim}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">ALTURA REGULADORA MÁXIMA (M)</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.alzada_reguladora_maxima_m}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">SEPARACIÓN MÍNIMA A VIAL O ESPACIO LIBRE (M)</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.separacio_minima_a_carrer}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">DENSIDAD RESID. (VIVIENDA / M2 CONSTRUIDOS)</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.densidad_residencial}</td>
      </TABLE>`;

    if (
      this.titulo_edif == "VIVIENDA EDIFICACION ABIERTA" ||
      this.titulo_edif == "VIVIENDA TRADICIONAL"
    )
      this.html_CONDICIONES_EDIFICACION = `
      <TABLE class="table-form">
          <tr class="table-form-tr-white">
            <td class="table-form-td">CALIFICACIÓN</td>
            <td><LABEL class="table-form-label-calific">${this.info_parametros.features[0].properties.calificacion}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">SUPERFICIE MINIMA PARCELA (M2)</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.superficie_minima_m2}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">ANCHO MINIMO PARCELA (M)</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.amplada_minima_m}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">NUM. DE PISOS MÀXIMO</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.num_pisos_maxim}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">ALTURA REGULADORA MÁXIMA (M)</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.alzada_reguladora_maxima_m}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">COEF. EDIFICABILIDAD (M2 c /M2 p)</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.coef_edificabilitat}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">OCUPACIÓN MÀXIMA (%)</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.ocupacio_maxima}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">SEPARACIÓN MÍNIMA A (LIMITES / VIALES)</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.separacion_minima_a_limits}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">INTENSIDAD RESID. (VIVIENDA / M2 PARCELA)</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.intensidad_residencial}</td>
          </tr>
        </TABLE>`;

    if (this.titulo_edif == "VIVIENDA UNIFAMILIAR AISLADA")
      this.html_CONDICIONES_EDIFICACION = `
      <TABLE class="table-form">
          <tr class="table-form-tr-white">
            <td class="table-form-td">CALIFICACIÓN</td>
            <td><LABEL class="table-form-label-calific">${this.info_parametros.features[0].properties.calificacion}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">SUPERFICIE MINIMA PARCELA (M2)</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.superficie_minima_m2}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">ANCHO MINIMO PARCELA (M)</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.amplada_minima_m}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">NUM. DE PISOS MÀXIMO</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.num_pisos_maxim}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">ALTURA REGULADORA MÀXIMA (M)</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.amplada_reguladora_maxima_m}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">COEF. EDIFICABILIDAD (M2 c /M2 p)</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.coef_edificabilitat}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">OCUPACIÓN MÀXIMA (%)</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.ocupacio_maxima}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">SEPARACIÓN MÍNIMA A VIALES Y POSTERIOR (M)</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.separacion_minima_vial}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">INTENSITAT RESID. (VIVIENDA / PARCELA)</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.intensidad_us_res}</td>
          </tr>
        </TABLE>`;

    if (this.titulo_edif == "ZONA TURISTICA")
      this.html_CONDICIONES_EDIFICACION = `
        <TABLE class="table-form">
          <tr class="table-form-tr-white">
            <td class="table-form-td">CALIFICACIÓN</td>
            <td><LABEL class="table-form-label-calific">${this.info_parametros.features[0].properties.calificacion}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">SUPERFICIE MINIMA PARCELA (M2)</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.superficie_minima_m2}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">ANCHO MINIMO PARCELA (M)</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.amplada_minima_m}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">NUM. DE PISOS MÀXIMO</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.num_pisos_maxim}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">ALTURA REGULADORA MÀXIMA (M)</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.alzada_reguladora_maxima_m}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">COEF. EDIFICABILIDAD</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.coef_edificabilitat}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">OCUPACIÓN MÀXIMA (%)</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.ocupacio_maxima}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">SEPARACIÓN MÍNIMA A VIALES Y POSTERIOR (M)</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.separacion_minima_a_limits}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">INTENSIDAD USO TURISTICO (PLAZA/ M2 PARCELA)</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.intensidad_us_turistic}</td>
          </tr>
        </TABLE>`;

    if (this.titulo_edif == "ZONA TURISTICA HOTELERA")
      this.html_CONDICIONES_EDIFICACION = `
        <TABLE class="table-form">
          <tr class="table-form-tr-white">
            <td class="table-form-td">CALIFICACIÓN</td>
            <td><LABEL class="table-form-label-calific">${this.info_parametros.features[0].properties.calificacion}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">SUPERFICIE MINIMA PARCELA (M2)</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.superficie_minima_m}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">ANCHO MINIMO PARCELA (M)</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.amplada_minima_m}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">NUM. DE PISOS MÀXIMO</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.num_pisos_maxim}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">ALTURA REGULADORA MÀXIMA (M)</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.alzada_reguladora_maxima_m}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">COEF. EDIFICABILIDAD</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.coef_edificabilitat}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">COEF. EDIFICABILIDAD 5* O SUP</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.coef_edificabilitat_5_sup}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">OCUPACIÓN MÀXIMA PLANTA PISO (%)</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.ocupacio_maxima_planta_pis}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">OCUPACIÓN MÀXIMA PLANTA BAJA (%)</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.ocupacio_maxima_planta_baixa}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">OCUPACIÓN MÀXIMA PLANTA SOTANO (%)</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.ocupacio_maxima_planta_soterrani}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">SEPARACIÓN MÍNIMA A LIMITES (M)</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.separacio_minima_limits_m}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">INTENSIDAD USO TURISTICO (PLAZA/ M2 PARCELA)</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.intensidad_us_turistic}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">OBSERVACIONES</LABEL></td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.observacions}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td colspan=2 class="table-form-td">(*)En cas de no estar modificada per la legislació vigent (article 101)</td>          
          </tr>
        </TABLE>`;

    if (this.titulo_edif == "ZONA COMERCIAL SERVICIOS")
      this.html_CONDICIONES_EDIFICACION = `
        <TABLE class="table-form">
          <tr class="table-form-tr-white">
            <td class="table-form-td">CALIFICACIÓN</td>
            <td><LABEL class="table-form-label-calific">${this.info_parametros.features[0].properties.calificacion}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">SUPERFICIE MINIMA PARCELA (M2)</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.superficie_minima_m2}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">ANCHO MINIMO PARCELA (M)</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.amplada_minima_m}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">NUM. DE PISOS MÀXIMO</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.num_pisos_maxim}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">ALTURA TOTAL MÀXIMA (M)</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.alzada_total_maxima_m}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">COEF. EDIFICABILIDAD (M2 c /M2 p)</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.coef_edificabilidad}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">OCUPACIÓN MÀXIMA (%)</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.ocupacio_maxima}</td>
          </tr>
          <tr class="table-form-tr-white">
            <td class="table-form-td">SEPARACIÓ MÍNIMA A LIMITS (M)</td>
            <td><LABEL class="table-form-label-style">${this.info_parametros.features[0].properties.separacio_minima_a_limits}</td>
          </tr>
    </TABLE>`;
  }

  setHTML_DESCRIPCION() {
    console.log(this.info_tipozona.features[0].properties);
    this.html_DESCRIPCION = `
      <TABLE class="table-form">
        <tr class="table-form-tr-white">
          <td class="table-form-td2">DEFINICIÓN</td>
          <td class="table-form-td4">${this.info_tipozona.features[0].properties.definicio}</td>
        </tr>
        <tr class="table-form-tr-white">
          <td class="table-form-td2">TIPO DE ORDENACIÓN</td>
          <td class="table-form-td4">${this.info_tipozona.features[0].properties.tipo_ordenacio}</td>
        </tr>
    </TABLE>`;
  }

  setHTML_TITLE() {
    this.html_TITULO = `<LABEL class="title-form">${this.titulo_edif} (${this.ordenacion})</LABEL>`;
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
      <button class="accordion">CONDICIONES DE EDIFICACIÓN</button>
      <div class="panelCaract" id="panelCaract">
          <BR>
          <div style='text-align: justify;padding:5px;font-size:8.7pt;font-family:Arial;color:#000000;'>${this.info_tipozona.features[0].properties.condicions_us}</div>
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

    console.lo;

    let html = "";
    html =
      html +
      `<div class="div-form">
        ${this.html_TITULO}
        <button  id="printParametersPRI" class="ui-button ui-widget ui-corner-all button-print" title="Imprimir Ficha"><i class="fa fa-print"></i></button> 
        <BR>
        <BR>
        ${this.html_buttons}
        <BR>   
      </div>`;

    const elem = document.getElementById("userinfo");
    elem.innerHTML = html;

    const self = this; // Almacena una referencia a 'this'

    document
      .getElementById("printParametersPRI")
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
