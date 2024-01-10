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
  }

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
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black' align="right">TIPO DE SISTEMA</LABEL></td>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;background-color:white;color:#000000;box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);border-style: solid;border-width:0.1pt;border-color:black;width:120px;height:15px'>${this.tipo_sistema}</LABEL></td>
          </tr>
					<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black' align="right">USO DOTACIONAL</LABEL></td>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;background-color:white;color:#000000;box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);border-style: solid;border-width:0.1pt;border-color:black;width:120px;height:15px'>${this.uso_dotacional}</LABEL></td>
          </tr>
          <tr align="left" bgcolor="#eaf5ff" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black' align="right">ZONA ESTADISTICA</LABEL></td>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>${this.cadenaZonaEst}</LABEL></td>
          </tr>
          <tr align="left" bgcolor="#eaf5ff" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black' align="right">REF. CATASTRAL</LABEL></td>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>${this.cadenaParcelas}</LABEL></td>
          </tr>
          <tr align="left" bgcolor="#eaf5ff" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black' align="right">CALLES</LABEL></td>
              <td><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>${this.cadenaCalles}</LABEL></td>
          </tr>
          
        </TABLE>`;
  }

  setHTML_CARACTERISTICAS() {
    this.html_CARACTERISTICAS = `
		<TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
				<tr align="left" bgcolor="white" style='padding:5px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td bgcolor="#edf1f5"><LABEL style='padding:5px;font-size:8pt;font-family:Arial;color:black' align="right">SUPERFICIE</LABEL></td>
						<td><LABEL style='padding:5px;font-size:8pt;font-family:Arial;color:#000000;'>${this.area}</LABEL></td>
				</tr>
				<tr align="left" bgcolor="white" style='padding:5px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td bgcolor="#edf1f5"><LABEL style='padding:5px;font-size:8pt;font-family:Arial;color:black' align="right">CLASIFICACION SUELO</LABEL></td>
						<td><LABEL style='padding:5px;font-size:8pt;font-family:Arial;color:#000000;'>${this.clas_suelo}</LABEL></td>
				</tr>
				<tr align="left" bgcolor="white" style='padding:5px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td bgcolor="#edf1f5"><LABEL style='padding:5px;font-size:8pt;font-family:Arial;color:black' align="right">DOMINIO</LABEL></td>
						<td><LABEL style='padding:5px;font-size:8pt;font-family:Arial;color:#000000;'>${this.dominio}</LABEL></td>
				</tr>
				<tr align="left" bgcolor="white" style='padding:5px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td bgcolor="#edf1f5"><LABEL style='padding:5px;font-size:8pt;font-family:Arial;color:black' align="right">ESTADO ACTUAL</LABEL></td>
						<td><LABEL style='padding:5px;font-size:8pt;font-family:Arial;color:#000000;'>${this.estado_actual}</LABEL></td>
				</tr>
				<tr align="left" bgcolor="white" style='padding:5px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td bgcolor="#edf1f5"><LABEL style='padding:5px;font-size:8pt;font-family:Arial;color:black' align="right">AMBITO GESTIÓN</LABEL></td>
						<td><LABEL style='padding:5px;font-size:8pt;font-family:Arial;color:#000000;'>${this.ambito_gestion}</LABEL></td>
				</tr>
				<tr align="left" bgcolor="white" style='padding:5px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
						<td bgcolor="#edf1f5"><LABEL style='padding:5px;font-size:8pt;font-family:Arial;color:black' align="right">CATALOGOS</LABEL></td>
						<td><LABEL style='padding:5px;font-size:8pt;font-family:Arial;color:#000000;'>${this.cadenaCatalogos}</LABEL></td>
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

    const tit_caracteristicas = `<DIV style='padding:3px;font-size:8.5pt;font-family:Arial Black;background-color:rgba(85, 140, 212, 1);color:white;border-style: solid;border-width:0.1pt;border-color:RGB(12,1,73);width:99%;height:14px;'>2. CARACTERITICAS FUNCIONALES</DIV>`;
    ventana.document.write(tit_caracteristicas);
    ventana.document.write(this.html_CARACTERISTICAS);

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

  setHTML_TITLE() {
    this.html_TITULO = ` <LABEL style='padding:5px;font-size:8.5pt;font-family:Arial Black;background-color:#fdfde0;color:#1a4d1a;box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);border-style: solid;border-width:0.1pt;border-color:black;width:380px;height:20px;'>FICHA DE ${this.title} (${this.subtitle}) (${this.tipoPlan})</LABEL>`;
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
      `<div style='overflow: auto;padding:20px;background-color:#f2f2f2;border-style: solid;border-width:0pt;border-color:black;box-shadow: 3px 3px 3px 3px rgba(0, 0, 0, 0.2);position:absolute;width:90%;height:90%;top:10px;left:10px'>
          ${this.html_TITULO}
          <button  id="printFichaSistema" style="padding-top:4px;padding-bottom:4px;" class="ui-button ui-widget ui-corner-all" title="Imprimir Ficha"><i class="fa fa-print"></i></button> 
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
      .getElementById("printFichaSistema")
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

    this.sigduMap.sidebar.open("userinfo");
    this.sigduMap.map.spin(false);
  }
}
