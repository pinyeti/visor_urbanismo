/**
 * Clase para gestionar los parámetros de calificación secundaria del PGOU de 1998.
 * @memberof module:Frontend
 */
class Form_PARAMETROS_SEC_PGOU98 {
  /**
   * Crea una instancia de Form_PARAMETROS_SEC_PGOU98.
   *
   * @param {number} ordenacion - El valor de ordenación.
   * @param {string} tabla - La tabla de datos.
   * @param {object} sigduMap - El mapa SIGDU.
   */
  constructor(ordenacion, tabla, sigduMap) {
    this.sigduMap=sigduMap;
    this.ordenacion = ordenacion;
    this.titulo_edif = "INDUSTRIAL RP.A.";
    this.tabla_parametros = "calificacion_secundario_visor";
    this.tabla = tabla;
    this.tipo_edificacion = ordenacion.substring(0, 1);
    this.titulo_irp = "";
    this.info_parametros = ``;
    this.info_tipozona = ``;
 
    this.html_DESCRIPCION = ``;
    this.html_CONDICIONES_EDIFICACION = ``;

    this.html_buttons = ``;
    this.html_TITULO = ``;
  }

  async initialize() {
    const reader = new DataReader();
    // QUERY A PARAMETROS EDIF
    this.info_parametros = await reader.readDataFeature(
      this.tabla_parametros,
      "codigo='" + this.ordenacion + "'"
    );
    console.log("info_parametros", this.info_parametros);

    // QUERY A tipo zonas
    this.info_tipozona = await reader.readDataFeature(
      "tipos_zonas",
      "tipo_zona='" + this.tipo_edificacion + "'"
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
        <TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
           
          <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black' align="right">CALIFICACIÓ</LABEL></td>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial Black;background-color:#fdfde0;color:#000000;box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);border-style: solid;border-width:0.1pt;border-color:black;width:120px;height:15px'>${this.info_parametros.features[0].properties.codigo}</LABEL></td>
          </tr>
          <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black' align="right">SUPERFICIE MÍNIMA DE PARCEL·LA EN METRES</LABEL></td>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;background-color:white;color:#000000;box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);border-style: solid;border-width:0.1pt;border-color:black;width:120px;height:15px'>${this.info_parametros.features[0].properties.s_m}</LABEL></td>
          </tr>
          <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black' align="right">AMPLADA MÍNIMA DE PARCEL·LA EN METRES</LABEL></td>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;background-color:white;color:#000000;box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);border-style: solid;border-width:0.1pt;border-color:black;width:120px;height:15px'>${this.info_parametros.features[0].properties.b}</LABEL></td>
          </tr>
          <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black' align="right">ALTURA EN NOMBRE DE PLANTES</LABEL></td>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;background-color:white;color:#000000;box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);border-style: solid;border-width:0.1pt;border-color:black;width:120px;height:15px'>${this.info_parametros.features[0].properties.h}</LABEL></td>
          </tr>
          <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black' align="right">ALTURA MÁXIMA EN METRES</LABEL></td>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;background-color:white;color:#000000;box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);border-style: solid;border-width:0.1pt;border-color:black;width:120px;height:15px'>${this.info_parametros.features[0].properties.hmax}</LABEL></td>
          </tr>
          <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black' align="right">ALTURA TOTAL EN METRES</LABEL></td>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;background-color:white;color:#000000;box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);border-style: solid;border-width:0.1pt;border-color:black;width:120px;height:15px'>${this.info_parametros.features[0].properties.htot}</LABEL></td>
          </tr>
          <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black' align="right">OCUPACIÓ % </LABEL></td>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;background-color:white;color:#000000;box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);border-style: solid;border-width:0.1pt;border-color:black;width:120px;height:15px'>${this.info_parametros.features[0].properties.oc}</LABEL></td>
          </tr>
          <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black' align="right">OCUPACIÓ DE LES PLANTES PIS EN %</LABEL></td>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;background-color:white;color:#000000;box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);border-style: solid;border-width:0.1pt;border-color:black;width:120px;height:15px'>${this.info_parametros.features[0].properties.opp}</LABEL></td>
          </tr>
          <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black' align="right">EDIFICABILITAT m2/m2.</LABEL></td>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;background-color:white;color:#000000;box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);border-style: solid;border-width:0.1pt;border-color:black;width:120px;height:15px'>${this.info_parametros.features[0].properties.e_p}</LABEL></td>
          </tr>
          <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black' align="right">SEPARACIÓ MÍNIMA A CONFRONTES DE LA PLANTA BAIXA EN METRES</LABEL></td>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;background-color:white;color:#000000;box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);border-style: solid;border-width:0.1pt;border-color:black;width:120px;height:15px'>${this.info_parametros.features[0].properties.rpb}</LABEL></td>
          </tr>
          <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black' align="right">SEPARACIÓ MÍNIMA A CONFRONTES DE LA PLANTA PIS EN METRES</LABEL></td>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;background-color:white;color:#000000;box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);border-style: solid;border-width:0.1pt;border-color:black;width:120px;height:15px'>${this.info_parametros.features[0].properties.rpp}</LABEL></td>
          </tr>
          <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black' align="right">SEPARACIÓ MÍNIMA A ALINEACIONS EN METRES</LABEL></td>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;background-color:white;color:#000000;box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);border-style: solid;border-width:0.1pt;border-color:black;width:120px;height:15px'>${this.info_parametros.features[0].properties.ra}</LABEL></td>
          </tr>
          <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black' align="right">SEPARACIÓ MÍNIMA A MITGERES EN METRES</LABEL></td>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;background-color:white;color:#000000;box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);border-style: solid;border-width:0.1pt;border-color:black;width:120px;height:15px'>${this.info_parametros.features[0].properties.rm}</LABEL></td>
          </tr>
          <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black' align="right">SEPARACIÓ MÍNIMA A MITGERES DE LA PLANTA BAIXA EN METRES</LABEL></td>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;background-color:white;color:#000000;box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);border-style: solid;border-width:0.1pt;border-color:black;width:120px;height:15px'>${this.info_parametros.features[0].properties.rmpb}</LABEL></td>
          </tr>
          <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black' align="right">SEPARACIÓ MÍNIMA A VIALS I ESPAIS LLIURES PÚBLICS DE LA PLANTA BAIXA EN METRES</LABEL></td>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;background-color:white;color:#000000;box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);border-style: solid;border-width:0.1pt;border-color:black;width:120px;height:15px'>${this.info_parametros.features[0].properties.rapb}</LABEL></td>
          </tr>
          <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black' align="right">SEPARACIÓ MÍNIMA A MITGERES DE LA PLANTA PIS EN METRES</LABEL></td>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;background-color:white;color:#000000;box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);border-style: solid;border-width:0.1pt;border-color:black;width:120px;height:15px'>${this.info_parametros.features[0].properties.rmpp}</LABEL></td>
          </tr>
          <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black' align="right">SEPARACIÓ MÍNIMA A VIAS I ESPAIS LLIURES PÚBLIC DE PLANTES PIS EN METRES</LABEL></td>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;background-color:white;color:#000000;box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);border-style: solid;border-width:0.1pt;border-color:black;width:120px;height:15px'>${this.info_parametros.features[0].properties.rapp}</LABEL></td>
          </tr>
          <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black' align="right">SEPARACIONS ENTRE EDIFICIS EN METRES</LABEL></td>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;background-color:white;color:#000000;box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);border-style: solid;border-width:0.1pt;border-color:black;width:120px;height:15px'>${this.info_parametros.features[0].properties.se}</LABEL></td>
          </tr>
          <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black' align="right">SUPERFICIE MÀXIMA EDIFICABLE PER EDIFICI EN M2</LABEL></td>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;background-color:white;color:#000000;box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);border-style: solid;border-width:0.1pt;border-color:black;width:120px;height:15px'>${this.info_parametros.features[0].properties.smax}</LABEL></td>
          </tr>
          <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black' align="right">ÍNDEX D’INTESITAT D’ÚS RESIDENCIAL (NOMBRE DE HABITATGES / M2)</LABEL></td>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;background-color:white;color:#000000;box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);border-style: solid;border-width:0.1pt;border-color:black;width:120px;height:15px'>${this.info_parametros.features[0].properties.irp}</LABEL></td>
          </tr>
          
      
        </TABLE>`;
  }

  setHTML_DESCRIPCION() {
    this.html_DESCRIPCION = `<TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
        <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
            
            <td style='text-align: justify;padding:10px;font-size:9pt;font-family:Arial;color:#000000;'>${this.info_tipozona.features[0].properties.definicio}</LABEL></td>
        </tr>
      
    </TABLE>`;
  }

  setHTML_TITLE() {
    this.html_TITULO = ` <LABEL style='padding:5px;font-size:8.5pt;font-family:Arial Black;background-color:#fdfde0;color:#1a4d1a;box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);border-style: solid;border-width:0.1pt;border-color:black;width:380px;height:20px;'>${this.titulo_edif} (${this.ordenacion})</LABEL>`;
  }

  setHTML_BUTTONS() {
    this.html_buttons = `<button id="buttons" class="accordion">DESCRIPCIÓN</button>
            <div class="panelDESCRIPCION" id="panelDESCRIPCION">
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
            <div class="panelCONDICIONES" id="panelCONDICIONES" style='text-align: justify;padding:10px;font-size:9pt;font-family:Arial;color:#000000;'>
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
    ventana.document.innerHTML = "";

    ventana.document.write("<BR>");
    ventana.document.write(this.html_TITULO);
    ventana.document.write("<BR><BR>");
    const tit_descripcion = `<DIV style='padding:3px;font-size:8.5pt;font-family:Arial Black;background-color:rgba(85, 140, 212, 1);color:white;border-style: solid;border-width:0.1pt;border-color:RGB(12,1,73);width:99%;height:14px;'>DESCRIPCIÓN</DIV>`;
    ventana.document.write(tit_descripcion);
    ventana.document.write(this.html_DESCRIPCION);

    const tit_condiciones_edificacion = `<DIV style='padding:3px;font-size:8.5pt;font-family:Arial Black;background-color:rgba(85, 140, 212, 1);color:white;border-style: solid;border-width:0.1pt;border-color:RGB(12,1,73);width:99%;height:14px;'>CONDICIONES DE EDIFICACIÓN</DIV>`;
    ventana.document.write(tit_condiciones_edificacion);
    ventana.document.write(this.html_CONDICIONES_EDIFICACION);

    const tit_condiciones_uso = `<DIV style='padding:3px;font-size:8.5pt;font-family:Arial Black;background-color:rgba(85, 140, 212, 1);color:white;border-style: solid;border-width:0.1pt;border-color:RGB(12,1,73);width:99%;height:14px;'>CONDICIONES DE USO</DIV>`;
    ventana.document.write(tit_condiciones_uso);
    ventana.document.write(`<BR>`);
    ventana.document.write(
      `<div style='text-align: justify;padding:10px;font-size:8.7pt;font-family:Arial;color:#000000;'>${this.info_tipozona.features[0].properties.condicions_us}</div>`
    );

    ventana.print();
  }

  async createForm() {
    this.sigduMap.map.spin(true);

    let html = "";
    html =
      html +
      `<div style='overflow: auto;padding:20px;background-color:#f2f2f2;border-style: solid;border-width:0pt;border-color:black;box-shadow: 3px 3px 3px 3px rgba(0, 0, 0, 0.2);position:absolute;width:90%;height:90%;top:10px;left:10px'>
              ${this.html_TITULO}
              <button  id="printParametersRSD" style="padding-top:4px;padding-bottom:4px;" class="ui-button ui-widget ui-corner-all" title="Imprimir Ficha"><i class="fa fa-print"></i></button> 
              <BR>
              <BR>
              ${this.html_buttons}
              <BR>   
            </div>`;

    const elem = document.getElementById("userinfo");
    elem.innerHTML = html;

    const self = this; // Almacena una referencia a 'this'

    document
      .getElementById("printParametersRSD")
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
