/**
 * Clase para gestionar el diálogo de normativa.
 * @memberof module:Frontend
 */
class NormativaDialog {
  /**
   * Crea una instancia de NormativaDialog.
   * 
   * @param {Element} table - La tabla que se utilizará en el diálogo.
   * @param {string} fid - El identificador de característica (fid).
   * @param {SigduMap} sigduMap - La instancia del mapa SigduMap.
   */
  constructor(table, fid, sigduMap) {
    this.sigduMap = sigduMap;
    this.table = table;
    this.fid = fid;
    this.arrayArticulosPGOU98 = [];
    this.arrayArticulosPRI = [];

		this.htmTreeArticulos_normasPG2023 = ``;
    this.htmTreeArticulos_normasPGOU98 = ``;
    this.htmTreeArticulos_normasPRI = ``;

    this.primerFeatureHigh = null;

    this.htmlTabsArticulos = ``;

    this.titleArticulo = "";
    this.contentArticulo = "";
  }

  async initialize() {
		this.arrayArticulosPG2023 = await this.setArticulos("v_articulos_pg2023");
    this.arrayArticulosPGOU98 = await this.setArticulos("articulos_vigente");
    this.arrayArticulosPRI = await this.setArticulos("articulos_pri");
  }

  async setArticulos(tableArticulo) {
    const reader = new DataReader();
    const arrayArticulos = [];

    try {
      let info_geojson = await reader.readDataFeature(
        tableArticulo,
        "tabla='" + this.table + "'"
      );
      console.log(info_geojson);

      if (info_geojson.features)
        for (const feature of info_geojson.features) {
          let filtroSQL = "";
          if (
            feature.properties.filtro != "" &&
            feature.properties.filtro != null
          )
            filtroSQL =
              "fid=" + this.fid + " and (" + feature.properties.filtro + ")";
          else filtroSQL = "fid=" + this.fid;

          const geojson_articulos = await reader.readDataFeature(
            this.table,
            filtroSQL
          );

          if (geojson_articulos.features) {
            arrayArticulos.push(feature);
          }
        }
      console.log(arrayArticulos);
    } catch (error) {
      console.error("Error initializing:", error);
    }

    return arrayArticulos;
  }

  async show() {
		if (this.arrayArticulosPG2023.length > 0) {
      this.htmTreeArticulos_normasPG2023 = await this.create_articulos_normas(
        this.arrayArticulosPG2023,"PG2023"
      );
			console.log(this.htmTreeArticulos_normasPG2023);
      this.primerFeatureHigh = this.arrayArticulosPG2023[0];
      var find = false;
      for (var n = 0; n < this.arrayArticulosPG2023.length && !find; n++) {
        const feature = this.arrayArticulosPG2023[n];

        if (feature.properties.relevancia == "High") {
          find = true;
          this.primerFeatureHigh = feature;
        }
      }
    }
    if (this.arrayArticulosPGOU98.length > 0) {
      this.htmTreeArticulos_normasPGOU98 = await this.create_articulos_normas(
        this.arrayArticulosPGOU98,"PGOU98"
      );
			console.log(this.htmTreeArticulos_normasPGOU98);
      this.primerFeatureHigh = this.arrayArticulosPGOU98[0];
      var find = false;
      for (var n = 0; n < this.arrayArticulosPGOU98.length && !find; n++) {
        const feature = this.arrayArticulosPGOU98[n];

        if (feature.properties.relevancia == "High") {
          find = true;
          this.primerFeatureHigh = feature;
        }
      }
    }
    if (this.arrayArticulosPRI.length > 0) {
      this.htmTreeArticulos_normasPRI = await this.create_articulos_normas(
        this.arrayArticulosPRI,"PRI"
      );
      this.primerFeatureHigh = this.arrayArticulosPRI[0];
      var find = false;
      for (var n = 0; n < this.arrayArticulosPRI.length && !find; n++) {
        const feature = this.arrayArticulosPRI[n];

        if (feature.properties.relevancia == "High") {
          find = true;
          this.primerFeatureHigh = feature;
        }
      }
    }
		await this.createTabs()
    await this.create_content();
  }

  async createTabs() {
    //---------- tabs normes

    var tabs = $(function () {
      $("#tabsArticulos").tabs({
        activate: function (event, ui) {
          //
        },
      });
    });

		let htmTabPG2023 = "";
    let htmTabPG2023_content = "";
    let htmTabPGOU98 = "";
    let htmTabPGOU98_content = "";
    let htmTabPRI = "";
    let htmTabPRI_content = "";

		if (this.htmTreeArticulos_normasPG2023 != "") {
      htmTabPG2023 = `<li><a href="#tabPG2023">PLAN GENERAL 2023</a></li>`;
      htmTabPG2023_content = `<div style='overflow: auto;padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px' id="tabPG2023">
				<div style='padding:3px;background-color:#fdfde0;border-style: solid;border-width:1pt;border-color:#78c4f0'>
						<label class="icon"><i class="fa fa-search"></i></label>
						<input id="search-art_PG2023" class="search-art_PG2023" />   
						<button id="printNormaPG2023" style="padding-top:4px;padding-bottom:4px;" class="ui-button ui-widget ui-corner-all" title="Imprimeix norma seleccionada"><i class="fa fa-print"></i></button>
				</div>
				${this.htmTreeArticulos_normasPG2023}
			</div>`;
    }

    if (this.htmTreeArticulos_normasPGOU98 != "") {
      htmTabPGOU98 = `<li><a href="#tabPGOU98">POD (PGOU98)</a></li>`;
      htmTabPGOU98_content = `<div style='overflow: auto;padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px' id="tabPGOU98">
				<div style='padding:3px;background-color:#fdfde0;border-style: solid;border-width:1pt;border-color:#78c4f0'>
						<label class="icon"><i class="fa fa-search"></i></label>
						<input id="search-art_PGOU98" class="search-art_PGOU98" />   
						<button id="printNormaPGOU98" style="padding-top:4px;padding-bottom:4px;" class="ui-button ui-widget ui-corner-all" title="Imprimeix norma seleccionada" ><i class="fa fa-print"></i></button>
				</div>
				${this.htmTreeArticulos_normasPGOU98}
			</div>`;
    }

    if (this.htmTreeArticulos_normasPRI != "") {
			htmTabPRI = `<li><a href="#tabPRI">POD (PRI)</a></li>`;
      htmTabPRI_content = `<div style='overflow: auto;padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px' id="tabPRI">
				<div style='padding:3px;background-color:#fdfde0;border-style: solid;border-width:1pt;border-color:#78c4f0'>
						<label class="icon"><i class="fa fa-search"></i></label>
						<input id="search-art_PRI" class="search-art_PRI" />   
						<button id="printNormaPRI" style="padding-top:4px;padding-bottom:4px;" class="ui-button ui-widget ui-corner-all" title="Imprimeix norma seleccionada"><i class="fa fa-print"></i></button>
				</div>
				${this.htmTreeArticulos_normasPRI}
			</div>`;
    }

		this.htmlTabsArticulos=`<div  style='margin-top: -20px;margin-bottom: -20px; height:350px;padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px;font-size:8pt' id="tabsArticulos">
				<ul>
					${htmTabPG2023}
					${htmTabPGOU98}
					${htmTabPRI}
				</ul>
				${htmTabPG2023_content}
				${htmTabPGOU98_content}
				${htmTabPRI_content}

		</div>
		`;


  }

  async create_content() {
    this.titleArticulo = this.primerFeatureHigh.properties.titulo;
    this.contentArticulo = this.primerFeatureHigh.properties.contenido;
    var strDivArt =
      `<div  id="divContentArt">` +
      this.primerFeatureHigh.properties.contenido +
      `</div>\n`;

    const html_buttons = `
			<button class="accordion">ARTICLES ASSOCIATS</button>
					<div  class="panel" style='padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px;height:350px'>
						
							<BR>
							${this.htmlTabsArticulos}
							<BR>

					</div>

			<button id="tituloArt" class="accordion">${this.primerFeatureHigh.properties.titulo}</button>
					<div class="panelContertArticulo">
							<BR>
							${strDivArt}
							<BR>       
					</div>`;

    // Diseño
    let html = "";
    html =
      html +
      `<div style='overflow: auto;padding:20px;background-color:#f2f2f2;border-style: solid;border-width:0pt;border-color:black;box-shadow: 3px 3px 3px 3px rgba(0, 0, 0, 0.2);position:absolute;width:90%;height:90%;top:10px;left:10px'>

			${html_buttons}

			<BR>   
			</div>`;

    var elem = document.getElementById("userinfo");
    elem.innerHTML = html;

    self=this;

    try{
    document
      .getElementById("printNormaPG2023")
      .addEventListener("click", function () {
        console.log("printNormativaPG2023")
        self.printForm();
      });
    }catch(e){
      console.log(e)
    }
    try{
    document
      .getElementById("printNormaPGOU98")
      .addEventListener("click", function () {
        console.log("printNormativaPGOU98") 
        self.printForm();
      });
    }catch(e){
      console.log(e)
    }
    try{
    document
      .getElementById("printNormaPRI")
      .addEventListener("click", function () {
        console.log("printNormativaPRI") 
        self.printForm();
      });
    }catch(e){
      console.log(e)
    }

    // ens add

    this.sigduMap.sidebar.open("userinfo");

    var acc = document.getElementsByClassName("accordion");
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
      `<title>${this.titleArticulo}</title>`
    );
    ventana.document.write(
      `<link rel="stylesheet" type="text/css" href="../stylesheets/style.css">`
    );
    ventana.document.innerHTML = "";

   
    ventana.document.write("<strong>" + this.titleArticulo + "</strong>");
    ventana.document.write("<BR>");
    ventana.document.write(this.contentArticulo);

    ventana.print();
    ventana.close();
    
  

  }

  async create_articulos_normas(arrayArticulos,tipoNorma) {
    const self = this;
    $(function () {
      $(`#jstree_articulos_normas_${tipoNorma}`).jstree({
        core: {
          data: [
            {
              id: "root",
              text: `NORMATIVA (${tipoNorma})`,
              state: {
                opened: true,
                selected: true,
                //'checked' : true
              },
            },
          ],
          check_callback: true,
        },

        plugins: ["search"],
        search: {
          show_only_matches_children: true,
          show_only_matches: true,
        },
      });

      var to = false;
      $(`#search-art_${tipoNorma}`).keyup(function () {
       
        if (to) {
          clearTimeout(to);
        }
        to = setTimeout(function () {
          var v = $(`#search-art_${tipoNorma}`).val();
          $(`#jstree_articulos_normas_${tipoNorma}`).jstree(true).search(v);
        }, 250);
      });

      $(`#jstree_articulos_normas_${tipoNorma}`).on(
        "select_node.jstree",
        function (e, data) {
          var elem = document.getElementById("divContentArt");
          elem.innerHTML = data.node.data;
          var elem = document.getElementById("tituloArt");
          elem.innerHTML = data.node.text;
          self.titleArticulo = data.node.text;
          self.contentArticulo = data.node.data;
         
         
        }
      );

      $(`#jstree_articulos_normas_${tipoNorma}`).bind(
        "loaded.jstree",
        function (event, data) {
          $(`#jstree_articulos_normas_${tipoNorma}`).jstree().get_selected();
          var nodeRoot = $(`#jstree_articulos_normas_${tipoNorma}`)
            .jstree()
            .get_node("root");

          var articuloID = arrayArticulos[0].properties.articulo;
          var articuloNode;

          if (arrayArticulos)
            arrayArticulos.forEach((feature) => {
							let tit=``;

							if(feature.properties.tipo == "Article")
              	tit = `Articulo ${feature.properties.articulo} ${feature.properties.titulo}`;
							else if(feature.properties.tipo == "Paragraph" || feature.properties.tipo == "SArticle")
              	tit = feature.properties.titulo;

              if (feature.properties.relevancia == "High")
                tit = `<Label style='font-size:8pt;font-family:Arial Black;color:#540707'>${tit}</Label>`;
              else if (feature.properties.relevancia == "Medium")
                tit = `<Label style='text-decoration:underline;font-size:9pt;font-family:Arial;color:#003366'>${tit}</Label>`;

              let nodeArt = {
								id: feature.properties.orden,
                text: tit,
                data: feature.properties.contenido,
                icon: `images/documentmanager/${
                  feature.properties.tipo === "Article" || "SArticle"
                    ? "Article" 
                    : "Paragraph"
                }16.png`,
              };

              if (feature.properties.tipo == "Article" || feature.properties.tipo == "SArticle") { 
                articuloID = feature.properties.orden;

                articuloNode = $(`#jstree_articulos_normas_${tipoNorma}`)
                  .jstree(true)
                  .create_node(nodeRoot, nodeArt, "last");
              } else if (feature.properties.tipo == "Paragraph") {
                const node = $(`#jstree_articulos_normas_${tipoNorma}`)
                  .jstree(true)
                  .create_node(articuloNode, nodeArt, "last");

                if (node == false)
                  $(`#jstree_articulos_normas_${tipoNorma}`)
                    .jstree(true)
                    .create_node(nodeRoot, nodeArt, "last");

                $(this).jstree("open_node", articuloID);
              }
            });

          const highRelevanciaFeature = arrayArticulos.find(
            (feature) => feature.properties.relevancia === "High"
          );

					console.log(highRelevanciaFeature)

          if (highRelevanciaFeature) {
            $(`#jstree_articulos_normas_${tipoNorma}`).jstree(
              "select_node",
              highRelevanciaFeature.properties.orden
            );
          } else {
            $(`#jstree_articulos_normas_${tipoNorma}`).jstree(
              "select_node",
              arrayArticulos[0].properties.orden
            );
          }
        }
      );
    });

    const htmTreeArticulos_normas = `<div style='font-size:9pt;font-family:Arial;height:280px;overflow: auto;padding-top: 2px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px' id="jstree_articulos_normas_${tipoNorma}"></div>`;

		return htmTreeArticulos_normas;
  }
}
