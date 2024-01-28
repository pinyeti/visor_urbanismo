/**
 * Clase para generar ficha del catalogo del PRI.
 * @memberof module:Frontend
 */
class Form_CATALOGO_PRI {
  /**
   * Constructor de la clase.
   *
   * @param {object} entity - La entidad geoespacial.
   * @param {object} sigduMap - El mapa SIGDU.
   */
  constructor(entity, sigduMap) {
    this.sigduMap = sigduMap;
    this.fid = entity.getFid();
    this.feature = entity.getFeature();
		this.geojson = entity.getGeojson();
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
    this.html_PROT_DIREC = ``;
		this.html_INTERVENCION = ``;

    this.mapManager = null;

    this.setHTML_IDENTIFICACION();
    this.setHTML_DESCRIPCION();
    this.setHTML_PROT_DIREC();
		this.setHTML_INTERVENCION();
    this.setHTML_TITLE();
    this.setHTML_BUTTONS();
  }

	/**
   * Método para establecer la sección de identificación en HTML.
   * @returns {void}
   */
	setHTML_IDENTIFICACION() {
		this.html_IDENTIFICACION = `
      <TABLE class="table-form">
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
          <td class="table-form-td">USO ACTUAL</td>
          <td><LABEL class="table-form-label-style">${this.feature.properties.uso_actual}</td>
        </tr>
				<tr class="table-form-tr-white">
          <td class="table-form-td">TIPOLOGÍA</td>
          <td><LABEL class="table-form-label-style">${this.feature.properties.tipologia}</td>
        </tr>
				<tr class="table-form-tr-white">
          <td class="table-form-td">ESTILO</td>
          <td><LABEL class="table-form-label-style">${this.feature.properties.estilo}</td>
        </tr>
				<tr class="table-form-tr-white">
          <td class="table-form-td">FECHA DE REGISTRO</td>
          <td><LABEL class="table-form-label-style">${this.feature.properties.fecha_registro}</td>
        </tr>
				<tr class="table-form-tr-white">
          <td class="table-form-td">AUTOR</td>
          <td><LABEL class="table-form-label-style">${this.feature.properties.autor}</td>
        </tr>
				<tr class="table-form-tr-white">
          <td class="table-form-td">CRONOLOGÍA</td>
          <td><LABEL class="table-form-label-style">${this.feature.properties.cronologia}</td>
        </tr>
				<tr class="table-form-tr-white">
          <td class="table-form-td">PROTECCIÓN LEGAL ESPECIFICA</td>
          <td><LABEL class="table-form-label-style">${this.feature.properties.proteccion_legal_especifica}</td>
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
	setHTML_DESCRIPCION(){
		this.html_DESCRIPCION =`
			<TABLE class="table-form">
				<tr class="table-form-tr-white">
					<td class="table-form-td2">DESCRIPCIÓN</td>
					<td class="table-form-td3">${this.feature.properties.descripcion.replace(
            /\n/g,
            "<br>"
          )}</td>
				</tr>
				<tr class="table-form-tr-white">
					<td class="table-form-td2">CONTEXTO</td>
					<td class="table-form-td3">${this.feature.properties.contexto}</td>
				</tr>
				<tr class="table-form-tr-white">
					<td class="table-form-td2">BIBLIOGRAFIA</td>
					<td class="table-form-td3">${this.feature.properties.bibliografia.replace(
            /\n/g,
            "<br>"
          )}</td>
				</tr>
      </TABLE>`;
	}

	setHTML_PROT_DIREC(){
		this.html_PROT_DIREC =`
			<TABLE class="table-form">
				<tr class="table-form-tr-white">
					<td class="table-form-td2">PROTECCIÓN PROPUESTA</td>
					<td class="table-form-td3">${this.feature.properties.proteccion_propuesta}</td>
				</tr>
				<tr class="table-form-tr-white">
					<td class="table-form-td2">CONJUNTO</td>
					<td class="table-form-td3">${this.feature.properties.directprot_conjunto}</td>
				</tr>
				<tr class="table-form-tr-white">
					<td class="table-form-td2">ENTORNO DE PROTECCIÓN</td>
					<td class="table-form-td3">${this.feature.properties.directprot_entornoprot}</td>
				</tr>
				<tr class="table-form-tr-white">
					<td class="table-form-td2">VOLUMETRIA</td>
					<td class="table-form-td3">${this.feature.properties.directprot_volumetria}</td>
				</tr>
				<tr class="table-form-tr-white">
					<td class="table-form-td2">ESTRUCTURA</td>
					<td class="table-form-td3">${this.feature.properties.directprot_estructura}</td>
				</tr>
				<tr class="table-form-tr-white">
					<td class="table-form-td2">FACHADA PRINCIPAL</td>
					<td class="table-form-td3">${this.feature.properties.directprot_facahada}</td>
				</tr>
				<tr class="table-form-tr-white">
					<td class="table-form-td2">CUBIERTAS</td>
					<td class="table-form-td3">${this.feature.properties.directprot_cubiertas}</td>
				</tr>
				<tr class="table-form-tr-white">
					<td class="table-form-td2">INTERIORES</td>
					<td class="table-form-td3">${this.feature.properties.directprot_interiores}</td>
				</tr>
				<tr class="table-form-tr-white">
					<td class="table-form-td2">JARDINES / PATIOS</td>
					<td class="table-form-td3">${this.feature.properties.directprot_jardines_patios}</td>
				</tr>
				<tr class="table-form-tr-white">
					<td class="table-form-td2">USOS</td>
					<td class="table-form-td3">${this.feature.properties.directprot_usos}</td>
				</tr>
				<tr class="table-form-tr-white">
					<td class="table-form-td2">OTROS</td>
					<td class="table-form-td3">${this.feature.properties.directprot_otros}</td>
				</tr>
      </TABLE>`;
	}

	setHTML_INTERVENCION(){
		this.html_INTERVENCION =`
			<TABLE class="table-form">
				<tr class="table-form-tr-white">
					<td class="table-form-td3">${this.feature.properties.directrices_intervencion}</td>
				</tr>
			</TABLE>`;

	}

	/**
   * Método para establecer el título en HTML.
   *  @returns {void}
   */
  setHTML_TITLE() {
    this.html_TITULO = `<LABEL class="title-form">FICHA DE ${this.title}  (${this.tipoPlan})</LABEL>` 
  }

	/**
   * Método para establecer la secciones en la clase accordion de la ficha.
   * @returns {void}
   */
  setHTML_BUTTONS() {
    this.html_buttons = `
			<button id="buttons" class="accordion">IDENTIFICACIÓN</button>
				<div class="panelIDENTIF" id="panelIDENTIF">
					<BR>
					${this.html_IDENTIFICACION}
					<div id='map2'></div>
					<BR>      
				</div>
			<button id="buttons" class="accordion">DESCRIPCIÓN</button>
				<div class="panelDESCRIPCION" id="panelDESCRIPCION">
					<BR>
					${this.html_DESCRIPCION}
					<BR>      
				</div>
			<button id="buttons" class="accordion">DIRECTRICES DE PROTECCIÓN</button>
			<div class="panelPROT_DIREC" id="panelPROT_DIREC">
				<BR>
				${this.html_PROT_DIREC}
				<BR>      
			</div>
			<button id="buttons" class="accordion">DIRECTRICES DE INTERVENCIÓN</button>
			<div class="panelINTERVENCION" id="panelINTERVENCION">
				<BR>
				${this.html_INTERVENCION}
				<BR>      
			</div>
      
      `;
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
    const tit_prot = `<DIV class="title-section-print">3. DIRECTRICES DE PROTECCIÓN</DIV>`;
    ventana.document.write(tit_prot);
    ventana.document.write(this.html_PROT_DIREC);
		const tit_intervencion = `<DIV class="title-section-print">4. DIRECTRICES DE INTERVENCIÓN</DIV>`;
    ventana.document.write(tit_intervencion);
    ventana.document.write(this.html_INTERVENCION);

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
        <button  id="printFichaCAT" class="ui-button ui-widget ui-corner-all button-print" title="Imprimir Ficha"><i class="fa fa-print"></i></button> 
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
      .getElementById("printFichaCAT")
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
			await this.sigduMap.sidebar.open("userinfo");
      window.setTimeout(function () {
				console.log(self.geojson, self.color, self.fillColor);
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
