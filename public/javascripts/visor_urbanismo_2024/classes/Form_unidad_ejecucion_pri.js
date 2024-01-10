/**
 * Clase para gestionar unidades de ejecución en el Plan de Reforma Interior (PRI).
 * @memberof module:Frontend
 */
class Form_UNIDAD_EJECUCION_PRI {
  /**
   * Crea una instancia de Form_UNIDAD_EJECUCION_PRI.
   *
   * @param {object} entity - La entidad que contiene la información.
   * @param {object} sigduMap - El mapa SIGDU.
   */
  constructor(entity, sigduMap) {
    this.sigduMap = sigduMap;
    this.geojson = entity.getGeojson();
    this.feature = entity.getFeature();
    this.codigo = entity.getFeature().properties.codigo;
    this.denominacion =
      entity.getFeature().properties.denominacio.toUpperCase() || "-";

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
    this.html_PARAMETROS = ``;
    this.html_buttons = ``;
    this.html_TITULO = ``;
    

    this.mapManager = null;

    this.setHTML_IDENTIFICACION();
    this.setHTML_PARAMETROS();
    this.setHTML_TITLE();
    this.setHTML_BUTTONS();
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
        <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
        <td><LABEL style='padding:10px;font-size:8pt;font-family:Arial;color:black' align="right">DESCRIPCIÓ</LABEL></td>
            <td style='text-align: justify;padding:10px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.descripcion.replace(
              /\n/g,
              "<br>"
            )}}</td>
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

    console.log("===============================");
  }

  setHTML_PARAMETROS() {
    this.html_PARAMETROS=`
    <TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
        <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
            <td style='text-align: justify;padding:5px;font-size:8pt;font-family:Arial;color:black' align="right">SUPERFICIE TOTAL</td>
            <td style='text-align: justify;padding:5px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.superficie_total}</td>
        </tr>
        <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
            <td style='text-align: justify;padding:5px;font-size:8pt;font-family:Arial;color:black' align="right">SUPERFICIE APROFITAMENT PRIVAT</td>
            <td style='text-align: justify;padding:5px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.superficie_aprofitament_privat}</td>
        </tr>
        <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
            <td style='text-align: justify;padding:5px;font-size:8pt;font-family:Arial;color:black' align="right">SUPERFICIE CESSIÓ E. LLIURES</td>
            <td style='text-align: justify;padding:5px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.superficie_cesion_elibres}</LABEL></td>
        </tr>
        <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
            <td style='text-align: justify;padding:5px;font-size:8pt;font-family:Arial;color:black' align="right">SUPERFICIE CESSIÓ EQUIPAMENTS</td>
            <td style='text-align: justify;padding:5px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.superficie_cesion_equipaments}</td>
        </tr>
        <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
            <td style='text-align: justify;padding:5px;font-size:8pt;font-family:Arial;color:black' align="right">SUPERFICIE CESSIÓ VIALS</td>
            <td style='text-align: justify;padding:5px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.superficie_cesion_vials}</td>
        </tr>
        <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
            <td style='text-align: justify;padding:5px;font-size:8pt;font-family:Arial;color:black' align="right">COMENTARIS CESSIÓ </td>
            <td style='text-align: justify;padding:5px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.comentaris_cesion}</td>
        </tr>
        <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
            <td style='text-align: justify;padding:5px;font-size:8pt;font-family:Arial;color:black' align="right">EDIFICABILITAT ÙS RESIDENCIAL</td>
            <td style='text-align: justify;padding:5px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.superficie_edificabilitat_residencial}</td>
        </tr>
        <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
            <td style='text-align: justify;padding:5px;font-size:8pt;font-family:Arial;color:black' align="right">EDIFICABILITAT PER APARCAMENTS</td>
            <td style='text-align: justify;padding:5px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.superficie_edificabilitat_aparcament}</td>
        </tr>
        <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
            <td style='text-align: justify;padding:5px;font-size:8pt;font-family:Arial;color:black' align="right">EDIFICABILITAT TOTAL</td>
            <td style='text-align: justify;padding:5px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.edificabilitat_total}</td>
        </tr>
        <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
            <td style='text-align: justify;padding:5px;font-size:8pt;font-family:Arial;color:black' align="right">USOS</td>
            <td style='text-align: justify;padding:5px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.usos}</td>
        </tr>
        <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
            <td style='text-align: justify;padding:5px;font-size:8pt;font-family:Arial;color:black' align="right">OBLIGACIONS</td>
            <td style='text-align: justify;padding:5px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.obligacions}</td>
        </tr>
        <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
            <td style='text-align: justify;padding:5px;font-size:8pt;font-family:Arial;color:black' align="right">SISTEMES D'ACTUACIÓ I PROGRAMACIÓ</td>
            <td style='text-align: justify;padding:5px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.sistema_actuacio_programacio}</td>
        </tr>
       
       
    </TABLE>`;
  }

 
  setHTML_BUTTONS() {
    this.html_buttons = `<button id="buttons" class="accordion">IDENTIFICACIÓN</button>
      <div class="panelIDENTIF id="panelIDENTIF">
        <BR>
        ${this.html_IDENTIFICACION}
        <div id='map2'></div>
        <BR>      
      </div>
      <button id="buttons" class="accordion">PARAMETROS DE EDIFICACIÓN</button>
      <div class="panelPARAMETROS id="panelPARAMETROS">
        <BR>
        ${this.html_PARAMETROS}
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

    const tit_parametros= `<DIV style='padding:3px;font-size:8.5pt;font-family:Arial Black;background-color:rgba(85, 140, 212, 1);color:white;border-style: solid;border-width:0.1pt;border-color:RGB(12,1,73);width:99%;height:14px;'>2. PARAMETROS DE EDIFICACIÓN</DIV>`;
    ventana.document.write(tit_parametros);
    ventana.document.write(this.html_PARAMETROS);


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
    this.html_TITULO = ` <LABEL style='padding:5px;font-size:8.5pt;font-family:Arial Black;background-color:#fdfde0;color:#1a4d1a;box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);border-style: solid;border-width:0.1pt;border-color:black;width:380px;height:20px;'>FICHA DE ${this.title}  (${this.tipoPlan})</LABEL>`;
  }

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

    this.sigduMap.sidebar.open("userinfo");
    this.sigduMap.map.spin(false);
  }
}
