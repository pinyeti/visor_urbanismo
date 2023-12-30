/**
 * Clase para gestionar consultas y operaciones en el mapa.
 * @memberof module:Frontend
 */
class MapQuery {
  /**
   * Crea una instancia de MapQuery.
   * @param {SigduMap} sigduMap - Instancia del mapa SigduMap.
   */
  constructor(sigduMap) {
    this.sigduMap = sigduMap;
    this.map = sigduMap.map;
    this.i18nHandler = sigduMap.i18nHandler;
    this.languageControl = sigduMap.languageControl;
    this.normativa=null;
    this.popup = null;
    this.htmlTabsInfo = ``;
    this.htmlTableVIG = ``;
    this.num_exp_PA = 0;
    this.num_exp_PB = 0;
    this.num_exp_PBX = 0;
    this.num_exp_PC = 0;
    this.num_exp_PD = 0;
    this.num_exp_PE = 0;
    this.num_exp_PF = 0;
    this.num_exp_PG = 0;
    this.num_exp_PH = 0;
    this.num_exp_PJ = 0;
    this.ruta_exp =
      "https://urbanisme.palmademallorca.es/IMI/URBANISME/PRD/Planejament_urbanistic_pdf/Images Arxiu";
    //this.ruta_exp="http://localhost:8081/OpenKM/webdav/okm%3Aroot/expedientes";
  }

  /**
   * Realiza una consulta en el mapa utilizando las coordenadas proporcionadas y muestra los resultados en un popup.
   *
   * @param {Object} e - El objeto de eventos que contiene las coordenadas latlng en formato UTM.
   * @returns {Promise<void>} - Una promesa que resuelve cuando se completan todas las consultas y se muestra el popup.
   */
  async queryByPoint(e) {
    // Activa un spinner de carga en el mapa.
    this.map.spin(true);

     // Inicializa variables para contar el número de expedientes en diferentes categorías.
    this.num_exp = 0;
    this.num_exp_PA = 0;
    this.num_exp_PB = 0;
    this.num_exp_PBX = 0;
    this.num_exp_PC = 0;
    this.num_exp_PD = 0;
    this.num_exp_PE = 0;
    this.num_exp_PF = 0;
    this.num_exp_PG = 0;
    this.num_exp_PH = 0;
    this.num_exp_PJ = 0;

    // Cierra el popup si ya está abierto.
    if (this.popup != null) {
      this.popup.close();
      console.log("close popup");
    }

    // Obtiene las coordenadas x e y de e.latlng.utm().
    const { x, y } = e.latlng.utm();

     // Define una matriz arrayTablas con nombres de tablas para las consultas.
    const arrayTablas = [
      "parcela_su_ru_calles",
      "pg_rustic",
      "suelo_rustico",
      "pg_zou",
      "unidad_ejecucion",
      "pri_unitat_actuacio",
      "pg_actuaciones_suelo_urbano",
      "pg_actuaciones_aisladas",
      "zona_residencial_1",
      "zona_secundaria",
      "zona_terciaria",
      "zonasf",
      "zonas_centro_historico",
      "catalogos",
      "catalogos_actualizacion",
      "proteccion_arquitectonica",
      "slocal_equipamientos",
      "slocal_espacioslibres_publicos",
      "slocal_comunicaciones_infraestructuras",
      "sgeneral_equipamientos",
      "pg_dotac_sg_eq",
      "sgeneral_espacioslibres",
      "pg_dotac_sg_el",
      "sgeneral_comunicaciones_infraestructuras",
      "pg_dotac_sg_cm",
      "pg_dotac_sg_su",
      "pg_dotac_sg_if",
      "pri_zona_residencial_entre_mitgeres",
      "pri_zona_habitatge_edificacio_oberta",
      "pri_zona_habitatge_tradicional",
      "pri_zona_habitatges_adossats",
      "pri_zona_habitatge_unifamiliar_aillat",
      "pri_zona_comercial_serveis",
      "pri_zona_turistica_hotelera",
      "pri_zona_turistica",
      "pri_sistema_espais_lliures_publics",
      "pri_equipamientos",
      "pri_catalogos",
      "api",
      "area_regimen_especial",
      "pg_urbanitzable",
      "pg_urba",
      "pa_modificacion_pgou",
      "pb_pla_especial",
      "pbx_pla_especial_ri",
      "pc_pla_parcial",
      "pd_urbanizacion",
      "pe_estudi_detall",
      "pf_dotacio_serveis",
      "pg_recepcio_obres",
      "ph_parcelacions",
      "pj_delimitacio_ua",
    ];

    // Inicializa variables para almacenar HTML relacionado con las tablas y los expedientes.
    let html = `<div style="background: linear-gradient(to bottom, #88cc88, #448844); border: 1px solid #355c35; border-radius: 5px; padding: 7px 14px; color: white; font-family: Arial BLACK;font-size: 12px;box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.5);">PG2023 + POD(PGOU98+PRI)</div><br>
    `;
    let num_exp = 0;

    let html_tables = ``;
    let html_expedientes = ``;

    for (const tabla of arrayTablas) {
      console.log("Tabla: " + tabla);

      const url = new URL(
        `${window.location.protocol}//${window.location.host}/opg/featureByPoint`
      );

      const params = { tabla, x, y };
      Object.keys(params).forEach((key) =>
        url.searchParams.append(key, params[key])
      );

      const dataRequest = {
        method: "GET",
      };

      const response = await fetch(url, dataRequest);
      const geojsonRES = await response.json();

      if (geojsonRES.features !== null) {
        html_tables += await this.createHTMLForTabla(
          tabla,
          geojsonRES,
          num_exp
        );
        html_expedientes += await this.createHTMLexpedientesForTabla(
          tabla,
          geojsonRES,
          num_exp
        );
      }
    }

    //console.log(html_tables);

    if (html_expedientes !== "") {
      html_expedientes =
        `<div id="popup_historico_exp" style="background: linear-gradient(to bottom, #c44f39, #660000); border: 1px solid #355c35; border-radius: 5px;  padding: 7px 14px; color: white; font-family: Arial BLACK;font-size: 12px;box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.5);">HISTORICO EXPEDIENTES</div><br>` +
        html_expedientes;
    }

    if (html !== "") {
      html += html_tables;
      this.htmlTableVIG = `
          <div align="center" style='padding: 10px; font-size: 8pt; font-family: Arial;background-color:white; color: #000000;border: 1px solid #679bbf;'>${html}${html_expedientes}</div>
        `;
    }

    $(function () {
      $("#tabsInfoPopup").tabs({
        activate: function (event, ui) {
          if (ui.newTab.index()) {
          }
        },
      });
    });

    this.htmlTabsInfo = `
        <div style='padding: 0px; min-width: 250px' id="tabsInfoPopup">
          <ul>
            <li><a href="#vigente">PG2023 + POD(PGOU98+PRI)</a></li>
          </ul>
          <div id="vigente" >${this.htmlTableVIG}</div>
        </div>
      `;

    console.log("Termina for");

    const self = this; // Almacena una referencia a 'this'

    this.map.spin(false);
    this.i18nHandler.changeLanguage(
      this.languageControl.options.currentLanguage
    );

   /**
   * Gestiona eventos y configuraciones adicionales.
   */
    this.eventsManager();

    if (this.htmlTableVIG !== "") {
      self.popup = L.popup({ className: "custom-popup" })
        .setLatLng(e.latlng)
        .setContent(this.htmlTableVIG)
        .openOn(this.map);
    }
  }

  /**
   * Gestiona los eventos asociados a la apertura de un popup en el mapa.
   */
  eventsManager() {
    const self = this;

    this.map.on("popupopen", async function () {
      // Ficha SLEQ_PGOU98
      var btFicha_SLEQ_PGOU98 = document.getElementById("btFicha_SLEQ_PGOU98");
      if (btFicha_SLEQ_PGOU98) {
        btFicha_SLEQ_PGOU98.addEventListener("click", async function () {
          var fid = btFicha_SLEQ_PGOU98.getAttribute("data-fid");
          var clase = btFicha_SLEQ_PGOU98.getAttribute("data-clase");
          const entidad = new FeatureUrbanistic(clase, fid);
          await entidad.initialize();
          const formSLEQ = new Form_SISTEMAS_PGOU98(entidad, self.sigduMap);
          formSLEQ.createForm();
        });
      }

      // Ficha SGEQ_PGOU98
      var btFicha_SGEQ_PGOU98 = document.getElementById("btFicha_SGEQ_PGOU98");
      if (btFicha_SGEQ_PGOU98) {
        btFicha_SGEQ_PGOU98.addEventListener("click", async function () {
          var fid = btFicha_SGEQ_PGOU98.getAttribute("data-fid");
          var clase = btFicha_SGEQ_PGOU98.getAttribute("data-clase");

          const entidad = new FeatureUrbanistic(clase, fid);
          await entidad.initialize();
          const formSGEQ = new Form_SISTEMAS_PGOU98(entidad, self.sigduMap);
          formSGEQ.createForm();
        });
      }

      // Ficha SLEL_PGOU98
      var btFicha_SLEL_PGOU98 = document.getElementById("btFicha_SLEL_PGOU98");
      if (btFicha_SLEL_PGOU98) {
        btFicha_SLEL_PGOU98.addEventListener("click", async function () {
          var fid = btFicha_SLEL_PGOU98.getAttribute("data-fid");

          var clase = btFicha_SLEL_PGOU98.getAttribute("data-clase");
          const entidad = new FeatureUrbanistic(clase, fid);
          await entidad.initialize();
          const formSLEL = new Form_SISTEMAS_PGOU98(entidad, self.sigduMap);
          formSLEL.createForm();
        });
      }

      // Ficha SGEL_PGOU98
      var btFicha_SGEL_PGOU98 = document.getElementById("btFicha_SGEL_PGOU98");
      if (btFicha_SGEL_PGOU98) {
        btFicha_SGEL_PGOU98.addEventListener("click", async function () {
          var fid = btFicha_SGEL_PGOU98.getAttribute("data-fid");
          var clase = btFicha_SGEL_PGOU98.getAttribute("data-clase");

          const entidad = new FeatureUrbanistic(clase, fid);
          await entidad.initialize();
          const formSGEL = new Form_SISTEMAS_PGOU98(entidad, self.sigduMap);
          formSGEL.createForm();
        });
      }

      // Ficha SLCI_PGOU98
      var btFicha_SLCI_PGOU98 = document.getElementById("btFicha_SLCI_PGOU98");
      if (btFicha_SLCI_PGOU98) {
        btFicha_SLCI_PGOU98.addEventListener("click", async function () {
          var fid = btFicha_SLCI_PGOU98.getAttribute("data-fid");
          var clase = btFicha_SLCI_PGOU98.getAttribute("data-clase");

          const entidad = new FeatureUrbanistic(clase, fid);
          await entidad.initialize();
          const formSGEL = new Form_SISTEMAS_PGOU98(entidad, self.sigduMap);
          formSGEL.createForm();
        });
      }

      // Ficha SGCI_PGOU98
      var btFicha_SGCI_PGOU98 = document.getElementById("btFicha_SGCI_PGOU98");
      if (btFicha_SGCI_PGOU98) {
        btFicha_SGCI_PGOU98.addEventListener("click", async function () {
          var fid = btFicha_SGCI_PGOU98.getAttribute("data-fid");
          var clase = btFicha_SGCI_PGOU98.getAttribute("data-clase");

          const entidad = new FeatureUrbanistic(clase, fid);
          await entidad.initialize();
          const formSGEL = new Form_SISTEMAS_PGOU98(entidad, self.sigduMap);
          formSGEL.createForm();
        });
      }

      // Ficha SGEQ_PG2023
      var btFicha_SGEQ_PG2023 = document.getElementById("btFicha_SGEQ_PG2023");
      if (btFicha_SGEQ_PG2023) {
        btFicha_SGEQ_PG2023.addEventListener("click", async function () {
          var fid = btFicha_SGEQ_PG2023.getAttribute("data-fid");
          var clase = btFicha_SGEQ_PG2023.getAttribute("data-clase");

          const entidad = new FeatureUrbanistic(clase, fid);
          await entidad.initialize();
          const formSGEQ_PG2023 = new Form_SISTEMAS_PG2023(
            entidad,
            self.sigduMap
          );
          formSGEQ_PG2023.createForm();
        });
      }

      // Ficha SGEL_PG2023
      var btFicha_SGEL_PG2023 = document.getElementById("btFicha_SGEL_PG2023");
      if (btFicha_SGEL_PG2023) {
        btFicha_SGEL_PG2023.addEventListener("click", async function () {
          var fid = btFicha_SGEL_PG2023.getAttribute("data-fid");
          var clase = btFicha_SGEL_PG2023.getAttribute("data-clase");

          const entidad = new FeatureUrbanistic(clase, fid);
          await entidad.initialize();
          const formSGEL_PG2023 = new Form_SISTEMAS_PG2023(
            entidad,
            self.sigduMap
          );
          formSGEL_PG2023.createForm();
        });
      }

      // Ficha SGCM_PG2023
      var btFicha_SGCM_PG2023 = document.getElementById("btFicha_SGCM_PG2023");
      if (btFicha_SGCM_PG2023) {
        btFicha_SGCM_PG2023.addEventListener("click", async function () {
          var fid = btFicha_SGCM_PG2023.getAttribute("data-fid");
          var clase = btFicha_SGCM_PG2023.getAttribute("data-clase");

          const entidad = new FeatureUrbanistic(clase, fid);
          await entidad.initialize();
          const formSGCM_PG2023 = new Form_SISTEMAS_PG2023(
            entidad,
            self.sigduMap
          );
          formSGCM_PG2023.createForm();
        });
      }

      // Ficha SGSU_PG2023
      var btFicha_SGSU_PG2023 = document.getElementById("btFicha_SGSU_PG2023");
      if (btFicha_SGSU_PG2023) {
        btFicha_SGSU_PG2023.addEventListener("click", async function () {
          var fid = btFicha_SGSU_PG2023.getAttribute("data-fid");
          var clase = btFicha_SGSU_PG2023.getAttribute("data-clase");

          const entidad = new FeatureUrbanistic(clase, fid);
          await entidad.initialize();
          const formSGSU_PG2023 = new Form_SISTEMAS_PG2023(
            entidad,
            self.sigduMap
          );
          formSGSU_PG2023.createForm();
        });
      }

      // Ficha SGIF_PG2023
      var btFicha_SGIF_PG2023 = document.getElementById("btFicha_SGIF_PG2023");
      if (btFicha_SGIF_PG2023) {
        btFicha_SGIF_PG2023.addEventListener("click", async function () {
          var fid = btFicha_SGIF_PG2023.getAttribute("data-fid");
          var clase = btFicha_SGIF_PG2023.getAttribute("data-clase");

          const entidad = new FeatureUrbanistic(clase, fid);
          await entidad.initialize();
          const formSGIF_PG2023 = new Form_SISTEMAS_PG2023(
            entidad,
            self.sigduMap
          );
          formSGIF_PG2023.createForm();
        });
      }

      // Ficha EL_PRI
      var btFicha_EL_PRI = document.getElementById("btFicha_EL_PRI");
      if (btFicha_EL_PRI) {
        btFicha_EL_PRI.addEventListener("click", async function () {
          var fid = btFicha_EL_PRI.getAttribute("data-fid");
          var clase = btFicha_EL_PRI.getAttribute("data-clase");

          const entidad = new FeatureUrbanistic(clase, fid);
          await entidad.initialize();
          const formEL_PRI = new Form_SISTEMAS_PRI(entidad, self.sigduMap);
          formEL_PRI.createForm();
        });
      }

      // Ficha EQ_PRI
      var btFicha_EQ_PRI = document.getElementById("btFicha_EQ_PRI");
      if (btFicha_EQ_PRI) {
        btFicha_EQ_PRI.addEventListener("click", async function () {
          var fid = btFicha_EQ_PRI.getAttribute("data-fid");
          var clase = btFicha_EQ_PRI.getAttribute("data-clase");

          const entidad = new FeatureUrbanistic(clase, fid);
          await entidad.initialize();
          const formEQ_PRI = new Form_SISTEMAS_PRI(entidad, self.sigduMap);
          formEQ_PRI.createForm();
        });
      }

      // Ficha RSD_PGOU98
      var btFicha_RSD_PGOU98 = document.getElementById("btFicha_RSD_PGOU98");
      if (btFicha_RSD_PGOU98) {
        btFicha_RSD_PGOU98.addEventListener("click", async function () {
          var fid = btFicha_RSD_PGOU98.getAttribute("data-fid");
          var clase = btFicha_RSD_PGOU98.getAttribute("data-clase");

          const entidad = new FeatureUrbanistic(clase, fid);
          await entidad.initialize();
          const formParamRSD = new Form_PARAMETROS_RSD_PGOU98(
            entidad.getFeature().properties.codigo,
            entidad.getTable(),
            self.sigduMap
          );
          await formParamRSD.initialize();
          await formParamRSD.createForm();
        });
      }

      // Ficha SEC_PGOU98
      var btFicha_SEC_PGOU98 = document.getElementById("btFicha_SEC_PGOU98");
      if (btFicha_SEC_PGOU98) {
        btFicha_SEC_PGOU98.addEventListener("click", async function () {
          var fid = btFicha_SEC_PGOU98.getAttribute("data-fid");
          var clase = btFicha_SEC_PGOU98.getAttribute("data-clase");

          const entidad = new FeatureUrbanistic(clase, fid);
          await entidad.initialize();
          const formParamSEC_PGOU98 = new Form_PARAMETROS_SEC_PGOU98(
            entidad.getFeature().properties.codigo,
            entidad.getTable(),
            self.sigduMap
          );
          await formParamSEC_PGOU98.initialize();
          await formParamSEC_PGOU98.createForm();
        });
      }

      // Ficha TER_PGOU98
      var btFicha_TER_PGOU98 = document.getElementById("btFicha_TER_PGOU98");
      if (btFicha_TER_PGOU98) {
        btFicha_TER_PGOU98.addEventListener("click", async function () {
          var fid = btFicha_TER_PGOU98.getAttribute("data-fid");
          var clase = btFicha_TER_PGOU98.getAttribute("data-clase");

          const entidad = new FeatureUrbanistic(clase, fid);
          await entidad.initialize();
          const formParamTER_PGOU98 = new Form_PARAMETROS_TER_PGOU98(
            entidad.getFeature().properties.codigo,
            entidad.getTable(),
            self.sigduMap
          );
          await formParamTER_PGOU98.initialize();
          await formParamTER_PGOU98.createForm();
        });
      }

      // Ficha VE_PGOU98
      var btFicha_VE_PGOU98 = document.getElementById("btFicha_VE_PGOU98");
      if (btFicha_VE_PGOU98) {
        btFicha_VE_PGOU98.addEventListener("click", async function () {
          var fid = btFicha_VE_PGOU98.getAttribute("data-fid");
          var clase = btFicha_VE_PGOU98.getAttribute("data-clase");

          const entidad = new FeatureUrbanistic(clase, fid);
          await entidad.initialize();
          const formParamVE_PGOU98 = new Form_PARAMETROS_VE_PGOU98(
            entidad,
            self.sigduMap
          );
          await formParamVE_PGOU98.initialize();
          await formParamVE_PGOU98.createForm();
        });
      }

      // Ficha T_PRI
      var btFicha_T_PRI = document.getElementById("btFicha_T_PRI");
      if (btFicha_T_PRI) {
        btFicha_T_PRI.addEventListener("click", async function () {
          var fid = btFicha_T_PRI.getAttribute("data-fid");
          var clase = btFicha_T_PRI.getAttribute("data-clase");

          const entidad = new FeatureUrbanistic(clase, fid);
          await entidad.initialize();
          const formParamT_PRI = new Form_PARAMETROS_CALIFICACIONES_PRI(
            entidad,
            "T_PRI",
            self.sigduMap
          );
          await formParamT_PRI.initialize();
          await formParamT_PRI.createForm();
        });
      }

      // Ficha TH_PRI
      var btFicha_TH_PRI = document.getElementById("btFicha_TH_PRI");
      if (btFicha_TH_PRI) {
        btFicha_TH_PRI.addEventListener("click", async function () {
          var fid = btFicha_TH_PRI.getAttribute("data-fid");
          var clase = btFicha_TH_PRI.getAttribute("data-clase");

          const entidad = new FeatureUrbanistic(clase, fid);
          await entidad.initialize();
          const formParamTH_PRI = new Form_PARAMETROS_CALIFICACIONES_PRI(
            entidad,
            "TH_PRI",
            self.sigduMap
          );
          await formParamTH_PRI.initialize();
          await formParamTH_PRI.createForm();
        });
      }

      // Ficha S_PRI
      var btFicha_S_PRI = document.getElementById("btFicha_S_PRI");
      if (btFicha_S_PRI) {
        btFicha_S_PRI.addEventListener("click", async function () {
          var fid = btFicha_S_PRI.getAttribute("data-fid");
          var clase = btFicha_S_PRI.getAttribute("data-clase");

          const entidad = new FeatureUrbanistic(clase, fid);
          await entidad.initialize();
          const formParamS_PRI = new Form_PARAMETROS_CALIFICACIONES_PRI(
            entidad,
            "S_PRI",
            self.sigduMap
          );
          await formParamS_PRI.initialize();
          await formParamS_PRI.createForm();
        });
      }

      // Ficha I_PRI
      var btFicha_I_PRI = document.getElementById("btFicha_I_PRI");
      if (btFicha_I_PRI) {
        btFicha_I_PRI.addEventListener("click", async function () {
          var fid = btFicha_I_PRI.getAttribute("data-fid");
          var clase = btFicha_I_PRI.getAttribute("data-clase");

          const entidad = new FeatureUrbanistic(clase, fid);
          await entidad.initialize();
          const formParamI_PRI = new Form_PARAMETROS_CALIFICACIONES_PRI(
            entidad,
            "I_PRI",
            self.sigduMap
          );
          await formParamI_PRI.initialize();
          await formParamI_PRI.createForm();
        });
      }

      // Ficha VA_PRI
      var btFicha_VA_PRI = document.getElementById("btFicha_VA_PRI");
      if (btFicha_VA_PRI) {
        btFicha_VA_PRI.addEventListener("click", async function () {
          var fid = btFicha_VA_PRI.getAttribute("data-fid");
          var clase = btFicha_VA_PRI.getAttribute("data-clase");

          const entidad = new FeatureUrbanistic(clase, fid);
          await entidad.initialize();
          const formParamVA_PRI = new Form_PARAMETROS_CALIFICACIONES_PRI(
            entidad,
            "VA_PRI",
            self.sigduMap
          );
          await formParamVA_PRI.initialize();
          await formParamVA_PRI.createForm();
        });
      }

      // Ficha VT_PRI
      var btFicha_VT_PRI = document.getElementById("btFicha_VT_PRI");
      if (btFicha_VT_PRI) {
        btFicha_VT_PRI.addEventListener("click", async function () {
          var fid = btFicha_VT_PRI.getAttribute("data-fid");
          var clase = btFicha_VT_PRI.getAttribute("data-clase");

          const entidad = new FeatureUrbanistic(clase, fid);
          await entidad.initialize();
          const formParamVT_PRI = new Form_PARAMETROS_CALIFICACIONES_PRI(
            entidad,
            "VT_PRI",
            self.sigduMap
          );
          await formParamVT_PRI.initialize();
          await formParamVT_PRI.createForm();
        });
      }

      // Ficha E_PRI
      var btFicha_E_PRI = document.getElementById("btFicha_E_PRI");
      if (btFicha_E_PRI) {
        btFicha_E_PRI.addEventListener("click", async function () {
          var fid = btFicha_E_PRI.getAttribute("data-fid");
          var clase = btFicha_E_PRI.getAttribute("data-clase");

          const entidad = new FeatureUrbanistic(clase, fid);
          await entidad.initialize();
          const formParamE_PRI = new Form_PARAMETROS_CALIFICACIONES_PRI(
            entidad,
            "E_PRI",
            self.sigduMap
          );
          await formParamE_PRI.initialize();
          await formParamE_PRI.createForm();
        });
      }

      // Ficha D_PRI
      var btFicha_D_PRI = document.getElementById("btFicha_D_PRI");
      if (btFicha_D_PRI) {
        btFicha_D_PRI.addEventListener("click", async function () {
          var fid = btFicha_D_PRI.getAttribute("data-fid");
          var clase = btFicha_D_PRI.getAttribute("data-clase");

          const entidad = new FeatureUrbanistic(clase, fid);
          await entidad.initialize();
          const formParamD_PRI = new Form_PARAMETROS_CALIFICACIONES_PRI(
            entidad,
            "D_PRI",
            self.sigduMap
          );
          await formParamD_PRI.initialize();
          await formParamD_PRI.createForm();
        });
      }

      // Ficha UE_PGOU98
      var btFicha_UE_PGOU98 = document.getElementById("btFicha_UE_PGOU98");
      if (btFicha_UE_PGOU98) {
        btFicha_UE_PGOU98.addEventListener("click", async function () {
          var fid = btFicha_UE_PGOU98.getAttribute("data-fid");
          var clase = btFicha_UE_PGOU98.getAttribute("data-clase");

          const entidad = new FeatureUrbanistic(clase, fid);
          await entidad.initialize();
          const formParamUE_PGOU98 = new Form_UNIDAD_EJECUCION_PGOU98(
            entidad,
            self.sigduMap
          );
          await formParamUE_PGOU98.createForm();
        });
      }

      // Ficha UA_PRI
      var btFicha_UA_PRI = document.getElementById("btFicha_UA_PRI");
      if (btFicha_UA_PRI) {
        btFicha_UA_PRI.addEventListener("click", async function () {
          var fid = btFicha_UA_PRI.getAttribute("data-fid");
          var clase = btFicha_UA_PRI.getAttribute("data-clase");

          const entidad = new FeatureUrbanistic(clase, fid);
          await entidad.initialize();
          const formParamUA_PRI = new Form_UNIDAD_EJECUCION_PRI(
            entidad,
            self.sigduMap
          );
          await formParamUA_PRI.createForm();
        });
      }

      // Ficha UA_PRI
      var btFicha_CAT_PGOU98 = document.getElementById("btFicha_CAT_PGOU98");
      if (btFicha_CAT_PGOU98) {
        btFicha_CAT_PGOU98.addEventListener("click", async function () {
          var fid = btFicha_CAT_PGOU98.getAttribute("data-fid");
          var clase = btFicha_CAT_PGOU98.getAttribute("data-clase");

          const entidad = new FeatureUrbanistic(clase, fid);
          await entidad.initialize();
          const formParamCAT_PGOU98 = new Form_CATALOGO_PGOU98(
            entidad,
            self.sigduMap
          );
          await formParamCAT_PGOU98.createForm();
        });
      }

      var elementos = document.querySelectorAll(
        'button[data-accion="normativa"]'
      );
      console.log("elementos", elementos);


      
      for (var i = 0; i < elementos.length; i++) {
        const btNormativa = elementos[i];

        if (btNormativa) {
          btNormativa.addEventListener("click", async function () {
            var fid = btNormativa.getAttribute("data-fid");
            var table = btNormativa.getAttribute("data-table");

            console.log("passa");

            try{
              self.sigduMap.map.spin(true);
              self.normativa = new NormativaDialog(table, fid, self.sigduMap);
              await self.normativa.initialize();
              await self.normativa.show();
              self.sigduMap.map.spin(false);
            }catch(e){
              self.sigduMap.map.spin(false);
            }
          });
        }
      }
    });
  }

  /**
   * Crea HTML para una tabla específica según el tipo de tabla y los datos GeoJSON.
   *
   * @param {string} tabla - El nombre de la tabla.
   * @param {object} geojsonRES - Datos GeoJSON asociados a la tabla.
   * @returns {string} HTML generado.
   */
  async createHTMLForTabla(tabla, geojsonRES) {
    let html = "";

    switch (tabla) {
      case "parcela_su_ru_calles":
        html = this.createHTML_situacion(geojsonRES);
        break;
      case "pg_zou":
        html = this.createHTML_zou_PG2023(geojsonRES);
        break;
      case "pg_actuaciones_suelo_urbano":
        html = this.createHTML_actuaciones_PG2023(geojsonRES);
        break;
      case "pg_actuaciones_aisladas":
        html = this.createHTML_actuaciones_aisladas_PG2023(geojsonRES);
        break;
      case "pg_rustic":
        html = this.createHTML_categorias_rustico_PG2023(geojsonRES);
        break;
      case "suelo_rustico":
        html = this.createHTML_suelo_rustico_PGOU98(geojsonRES);
        break;
      case "zona_residencial_1":
        html = this.createHTML_zona_residencial(geojsonRES);
        break;
      case "zona_secundaria":
        html = this.createHTML_zona_secundaria(geojsonRES);
        break;
      case "zona_terciaria":
        html = this.createHTML_zona_terciaria(geojsonRES);
        break;
      case "zonasf":
        html = this.createHTML_zona_volumetria_especifica(geojsonRES);
        break;
      case "zonas_centro_historico":
        html = this.createHTML_zona_centro_historico(geojsonRES);
        break;
      case "slocal_equipamientos":
        html = this.createHTML_sistema_local_equipamientos(geojsonRES);
        break;
      case "sgeneral_equipamientos":
        html = this.createHTML_sistema_general_equipamientos(geojsonRES);
        break;
      case "pg_dotac_sg_eq":
        html = this.createHTML_sistema_general_equipamientos_PG2023(geojsonRES);
        break;
      case "slocal_espacioslibres_publicos":
        html = this.createHTML_sistema_local_espacios_libres(geojsonRES);
        break;
      case "sgeneral_espacioslibres":
        html = this.createHTML_sistema_general_espacios_libres(geojsonRES);
        break;
      case "pg_dotac_sg_el":
        html =
          this.createHTML_sistema_general_espacios_libres_PG2023(geojsonRES);
        break;
      case "slocal_comunicaciones_infraestructuras":
        html =
          this.createHTML_sistema_local_comunicaciones_infraestructuras(
            geojsonRES
          );
        break;
      case "sgeneral_comunicaciones_infraestructuras":
        html =
          this.createHTML_sistema_general_comunicaciones_infraestructuras(
            geojsonRES
          );
        break;
      case "pg_dotac_sg_cm":
        html =
          this.createHTML_sistema_general_comunicaciones_PG2023(geojsonRES);
        break;
      case "pg_dotac_sg_su":
        html =
          this.createHTML_sistema_general_servicios_urbanos_PG2023(geojsonRES);
        break;
      case "pg_dotac_sg_if":
        html =
          this.createHTML_sistema_general_infraestructuras_PG2023(geojsonRES);
        break;
      case "pri_sistema_espais_lliures_publics":
        html = this.createHTML_sistema_espacios_libres_PRI(geojsonRES);
        break;
      case "pri_equipamientos":
        html = this.createHTML_sistema_equipamientos_PRI(geojsonRES);
        break;
      case "pri_zona_residencial_entre_mitgeres":
        html =
          this.createHTML_zona_residencial_entre_medianeras_PRI(geojsonRES);
        break;
      case "pri_zona_habitatge_edificacio_oberta":
        html =
          this.createHTML_zona_vivienda_edificacion_abierta_PRI(geojsonRES);
        break;
      case "pri_zona_habitatge_tradicional":
        html = this.createHTML_zona_vivienda_tradicional_PRI(geojsonRES);
        break;
      case "pri_zona_habitatges_adossats":
        html = this.createHTML_zona_vivienda_adosada_PRI(geojsonRES);
        break;
      case "pri_zona_habitatge_unifamiliar_aillat":
        html =
          this.createHTML_zona_vivienda_unifamiliar_aislada_PRI(geojsonRES);
        break;
      case "pri_zona_comercial_serveis":
        html = this.createHTML_zona_comercial_servicios_PRI(geojsonRES);
        break;
      case "pri_zona_turistica":
        html = this.createHTML_zona_turistica_PRI(geojsonRES);
        break;
      case "pri_zona_turistica_hotelera":
        html = this.createHTML_zona_turistica_hotelera_PRI(geojsonRES);
        break;
      case "pri_catalogos":
        html = this.createHTML_catalogos_PRI(geojsonRES);
        break;
      case "pri_unitat_actuacio":
        html = this.createHTML_unidad_actuacion_PRI(geojsonRES);
        break;
      case "catalogos":
        html = this.createHTML_catalogos(geojsonRES);
        break;
      case "catalogos_actualizacion":
        html = this.createHTML_catalogos_actualizacion(geojsonRES);
        break;
      case "proteccion_arquitectonica":
        html = this.createHTML_preservacion_r(geojsonRES);
        break;
      case "unidad_ejecucion":
        html = this.createHTML_unidad_ejecucion(geojsonRES);
        break;
      case "api":
        html = this.createHTML_area_planeamiento_incorporado(geojsonRES);
        break;
      case "area_regimen_especial":
        html = this.createHTML_area_regimen_especial(geojsonRES);
        break;
      case "pg_urbanitzable":
        html = this.createHTML_suelo_urbanizable_PG2023(geojsonRES);
        break;
      case "pg_urba":
        html = this.createHTML_suelo_urbano_PG2023(geojsonRES);
        break;
    }

    return html;
  }

  /**
 * Crea HTML para expedientes de una tabla específica según el tipo de tabla y los datos GeoJSON.
 *
 * @param {string} tabla - El nombre de la tabla.
 * @param {object} geojsonRES - Datos GeoJSON asociados a la tabla.
 * @returns {string} HTML generado.
 */
  async createHTMLexpedientesForTabla(tabla, geojsonRES) {
    let html = "";

    switch (tabla) {
      case "pa_modificacion_pgou":
        html = this.createHTML_modificacion_pgou(geojsonRES);
        break;
      case "pb_pla_especial":
        html = this.createHTML_plan_especial(geojsonRES);
        break;
      case "pbx_pla_especial_ri":
        html = this.createHTML_plan_especial_RI(geojsonRES);
        break;
      case "pc_pla_parcial":
        html = this.createHTML_plan_parcial(geojsonRES);
        break;
      case "pd_urbanizacion":
        html = this.createHTML_urbanizacion(geojsonRES);
        break;
      case "pe_estudi_detall":
        html = this.createHTML_estudio_detalle(geojsonRES);
        break;
      case "pf_dotacio_serveis":
        html = this.createHTML_dotacion_servicios(geojsonRES);
        break;
      case "pg_recepcio_obres":
        html = this.createHTML_recepcion_obras(geojsonRES);
        break;
      case "ph_parcelacions":
        html = this.createHTML_parcelaciones(geojsonRES);
        break;
      case "pj_delimitacio_ua":
        html = this.createHTML_delimitacio_ua(geojsonRES);
        break;
    }

    return html;
  }

  /**
   * Genera una tabla HTML que muestra información sobre la dotación de servicios a partir de un objeto GeoJSON.
   *
   * @async
   * @param {Object} geojson - Objeto GeoJSON que contiene la información de la dotación de servicios.
   * @returns {Promise<string>} - Una cadena HTML que representa la tabla de dotación de servicios.
   */
  async createHTML_dotacion_servicios(geojson) {
     // Ordena las características del GeoJSON por el campo 'codigo'
    geojson.features.sort((a, b) => a.properties.codigo - b.properties.codigo);
    var html = "";
    if (this.num_exp_PF == 0) {
      // Crea la cabecera de la tabla si es el primer expediente
      html =
        html +
        `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
          <tr  align="center"  style='background-color:rgb(102,102,102,1);padding:3px;font-size:8.5pt;font-family:Arial BLACK;color:white;height:22px'>
              <td colspan="2">DOTACIÓN DE SERVICIOS</td>                   
          </tr >`;

      this.num_exp_PF++;
    } else {
      // Agrega un espacio en blanco si no es el primer expediente
      html =
        html +
        ` <tr style='height:2px'>                 
          </tr>`;
    }

    for (var r = 0; r < geojson.features.length; r++) {
      if (r > 0)
        html =
          html +
          ` <tr style='height:2px'>                 
            </tr>`;

      var ruta =
        this.ruta_exp +
        "/PF-DOTACIO_SERVEIS/PF-" +
        geojson.features[r].properties.codigo +
        "/PF-" +
        geojson.features[r].properties.codigo +
        "_PORTADA.pdf";

      var colorAplicable = "GREEN";
      var msgAplicable = "";
      if (geojson.features[r].properties.aplicable == "SI") {
        colorAplicable = "#1a4d1a";
        msgAplicable = "ACTUALMENTE APLICABLE";
      }
      if (geojson.features[r].properties.aplicable == "NO") {
        colorAplicable = "#990000";
        msgAplicable = "ACTUALMENTE  NO APLICABLE";
      }
      if (geojson.features[r].properties.aplicable == "D") {
        colorAplicable = "GREY";
        msgAplicable = "-----------------------";
      }

      const reader = new DataReader();
      let isResource = await reader.checkURLAvailability(ruta);

      let isDoc = `<td align="center"><a href="${ruta}"  target="_blank" title="Informació del expedient" style='color:blue;font-family:Arial;font-size:8.5pt'>${geojson.features[r].properties.codigo}</a></td>`;
      if (isResource === false) {
        isDoc = `<td align="center" title="Informació del expedient" style='color:gray;font-family:Arial;font-size:8.5pt'>${geojson.features[r].properties.codigo} (Documentación no disponible)</a></td>`;
      }

      html =
        html +
        ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
              <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>PF - DOTACIÓN DE SERVICIOS</LABEL></td>  
             ${isDoc}             
          </tr> 
          <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
              <td colspan="2"><LABEL style='text-align: justify;font-size:8.5pt;font-family:Arial;color:grey'>${geojson.features[r].properties.descripcio}</LABEL></td>      
          </tr>`;
      //<tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
      //<td COLSPAN="2"><LABEL style='font-size:8.4pt;font-family:Arial;color:WHITE;background-color:${colorAplicable}'>${msgAplicable}</LABEL></td>
      //</tr>
    }
    return html;
  }

   /**
   * Genera una tabla HTML que muestra información sobre parcelaciones a partir de un objeto GeoJSON.
   *
   * @async
   * @param {Object} geojson - Objeto GeoJSON que contiene la información de las parcelaciones.
   * @returns {Promise<string>} - Una cadena HTML que representa la tabla de parcelaciones.
   */
  async createHTML_parcelaciones(geojson) {
    geojson.features.sort((a, b) => a.properties.codigo - b.properties.codigo);
    var html = "";
    if (this.num_exp_PH == 0) {
      html =
        html +
        `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
          <tr  align="center"  style='background-color:rgb(102,102,102,1);padding:3px;font-size:8.5pt;font-family:Arial BLACK;color:white;height:22px'>
              <td colspan="2">PARCELACIONES</td>                   
          </tr >`;

      this.num_exp_PH++;
    } else {
      html =
        html +
        ` <tr style='height:2px'>                 
          </tr>`;
    }

    for (var r = 0; r < geojson.features.length; r++) {
      if (r > 0)
        html =
          html +
          ` <tr style='height:2px'>                 
            </tr>`;

      var ruta =
        this.ruta_exp +
        "/PH-PARCELACIONS/PH-" +
        geojson.features[r].properties.codigo +
        "/PH-" +
        geojson.features[r].properties.codigo +
        "_PORTADA.pdf";

      var colorAplicable = "GREEN";
      var msgAplicable = "";
      if (geojson.features[r].properties.aplicable == "SI") {
        colorAplicable = "#1a4d1a";
        msgAplicable = "ACTUALMENT APLICABLE";
      }
      if (geojson.features[r].properties.aplicable == "NO") {
        colorAplicable = "#990000";
        msgAplicable = "ACTUALMENT NO APLICABLE";
      }
      if (geojson.features[r].properties.aplicable == "D") {
        colorAplicable = "GREY";
        msgAplicable = "-----------------------";
      }

      const reader = new DataReader();
      let isResource = await reader.checkURLAvailability(ruta);

      let isDoc = `<td align="center"><a href="${ruta}"  target="_blank" title="Informació del expedient" style='color:blue;font-family:Arial;font-size:8.5pt'>${geojson.features[r].properties.codigo}</a></td>`;
      if (isResource === false) {
        isDoc = `<td align="center" title="Informació del expedient" style='color:gray;font-family:Arial;font-size:8.5pt'>${geojson.features[r].properties.codigo} (Documentación no disponible)</a></td>`;
      }

      html =
        html +
        ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
              <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>PH - PARCELACIONES</LABEL></td>  
              ${isDoc}             
          </tr> 
          <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
              <td colspan="2"><LABEL style='text-align: justify;font-size:8.5pt;font-family:Arial;color:grey'>${geojson.features[r].properties.descripcio}</LABEL></td>      
          </tr>`;
      //<tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
      //<td COLSPAN="2"><LABEL style='font-size:8.4pt;font-family:Arial;color:WHITE;background-color:${colorAplicable}'>${msgAplicable}</LABEL></td>
      //</tr>
    }
    return html;
  }

  /**
   * Genera una tabla HTML que muestra información sobre delimitaciones UA (Unidades de Actuación) a partir de un objeto GeoJSON.
   *
   * @async
   * @param {Object} geojson - Objeto GeoJSON que contiene la información de las delimitaciones UA.
   * @returns {Promise<string>} - Una cadena HTML que representa la tabla de delimitaciones UA.
   */
  async createHTML_delimitacio_ua(geojson) {
    geojson.features.sort((a, b) => a.properties.codigo - b.properties.codigo);
    var html = "";
    if (this.num_exp_PJ == 0) {
      html =
        html +
        `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
          <tr  align="center"  style='background-color:rgb(102,102,102,1);padding:3px;font-size:8.5pt;font-family:Arial BLACK;color:white;height:22px'>
              <td colspan="2">DELIMITACIÓN UA</td>                   
          </tr >`;

      this.num_exp_PJ++;
    } else {
      html =
        html +
        ` <tr style='height:2px'>                 
          </tr>`;
    }

    for (var r = 0; r < geojson.features.length; r++) {
      if (r > 0)
        html =
          html +
          ` <tr style='height:2px'>                 
            </tr>`;

      var ruta =
        this.ruta_exp +
        "/PJ-DELIMITACIO_U_A/PJ-" +
        geojson.features[r].properties.codigo +
        "/PJ-" +
        geojson.features[r].properties.codigo.substring(0, 8) +
        "_PORTADA.pdf";

      var colorAplicable = "GREEN";
      var msgAplicable = "";
      if (geojson.features[r].properties.aplicable == "SI") {
        colorAplicable = "#1a4d1a";
        msgAplicable = "ACTUALMENT APLICABLE";
      }
      if (geojson.features[r].properties.aplicable == "NO") {
        colorAplicable = "#990000";
        msgAplicable = "ACTUALMENT NO APLICABLE";
      }
      if (geojson.features[r].properties.aplicable == "D") {
        colorAplicable = "GREY";
        msgAplicable = "-----------------------";
      }

      const reader = new DataReader();
      let isResource = await reader.checkURLAvailability(ruta);

      let isDoc = `<td align="center"><a href="${ruta}"  target="_blank" title="Informació del expedient" style='color:blue;font-family:Arial;font-size:8.5pt'>${geojson.features[r].properties.codigo}</a></td>`;
      if (isResource === false) {
        isDoc = `<td align="center" title="Informació del expedient" style='color:gray;font-family:Arial;font-size:8.5pt'>${geojson.features[r].properties.codigo} (Documentación no disponible)</a></td>`;
      }

      html =
        html +
        ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
              <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>PJ - DELIMITACIÓN UA</LABEL></td>  
              ${isDoc}             
          </tr> 
          <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
              <td colspan="2"><LABEL style='text-align: justify;font-size:8.5pt;font-family:Arial;color:grey'>${geojson.features[r].properties.descripcio}</LABEL></td>      
          </tr>`;
      //<tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
      //<td COLSPAN="2"><LABEL style='font-size:8.4pt;font-family:Arial;color:WHITE;background-color:${colorAplicable}'>${msgAplicable}</LABEL></td>
      //</tr>
    }
    return html;
  }

  /**
   * Genera una tabla HTML que muestra información sobre la recepción de obras de planeamiento a partir de un objeto GeoJSON.
   *
   * @async
   * @param {Object} geojson - Objeto GeoJSON que contiene la información de la recepción de obras.
   * @returns {Promise<string>} - Una cadena HTML que representa la tabla de recepción de obras.
   */
  async createHTML_recepcion_obras(geojson) {
    geojson.features.sort((a, b) => a.properties.codigo - b.properties.codigo);
    var html = "";
    if (this.num_exp_PG == 0) {
      html =
        html +
        `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
          <tr  align="center"  style='background-color:rgb(102,102,102,1);padding:3px;font-size:8.5pt;font-family:Arial BLACK;color:white;height:22px'>
              <td colspan="2">RECEPCIÓN OBRAS</td>                   
          </tr >`;

      this.num_exp_PG++;
    } else {
      html =
        html +
        ` <tr style='height:2px'>                 
          </tr>`;
    }

    for (var r = 0; r < geojson.features.length; r++) {
      if (r > 0)
        html =
          html +
          ` <tr style='height:2px'>                 
            </tr>`;

      var ruta =
        this.ruta_exp +
        "/PG-RECEPCIO_OBRES/PG-" +
        geojson.features[r].properties.codigo +
        "/PG-" +
        geojson.features[r].properties.codigo.substring(0, 8) +
        "_ACORD.pdf";

      var colorAplicable = "GREEN";
      var msgAplicable = "";
      if (geojson.features[r].properties.aplicable == "SI") {
        colorAplicable = "#1a4d1a";
        msgAplicable = "ACTUALMENT APLICABLE";
      }
      if (geojson.features[r].properties.aplicable == "NO") {
        colorAplicable = "#990000";
        msgAplicable = "ACTUALMENT NO APLICABLE";
      }
      if (geojson.features[r].properties.aplicable == "D") {
        colorAplicable = "GREY";
        msgAplicable = "-----------------------";
      }

      const reader = new DataReader();
      let isResource = await reader.checkURLAvailability(ruta);

      let isDoc = `<td align="center"><a href="${ruta}"  target="_blank" title="Informació del expedient" style='color:blue;font-family:Arial;font-size:8.5pt'>${geojson.features[r].properties.codigo}</a></td>`;
      if (isResource === false) {
        isDoc = `<td align="center" title="Informació del expedient" style='color:gray;font-family:Arial;font-size:8.5pt'>${geojson.features[r].properties.codigo} (Documentación no disponible)</a></td>`;
      }

      html =
        html +
        ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
              <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>PG - RECEPCIÓN OBRAS</LABEL></td>  
              ${isDoc}                 
          </tr> 
          <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
              <td colspan="2"><LABEL style='text-align: justify;font-size:8.5pt;font-family:Arial;color:grey'>${geojson.features[r].properties.descripcio}</LABEL></td>      
          </tr>`;
      //<tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
      //<td COLSPAN="2"><LABEL style='font-size:8.4pt;font-family:Arial;color:WHITE;background-color:${colorAplicable}'>${msgAplicable}</LABEL></td>
      //</tr>
    }
    return html;
  }

  /**
   * Genera una tabla HTML que muestra información sobre urbanizaciones a partir de un objeto GeoJSON.
   *
   * @async
   * @param {Object} geojson - Objeto GeoJSON que contiene la información de urbanizaciones.
   * @returns {Promise<string>} - Una cadena HTML que representa la tabla de urbanizaciones.
   */
  async createHTML_urbanizacion(geojson) {
    geojson.features.sort((a, b) => a.properties.codigo - b.properties.codigo);
    var html = "";
    if (this.num_exp_PD == 0) {
      html =
        html +
        `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
          <tr  align="center"  style='background-color:rgb(102,102,102,1);padding:3px;font-size:8.5pt;font-family:Arial BLACK;color:white;height:22px'>
              <td colspan="2">URBANIZACION</td>                   
          </tr >`;

      this.num_exp_PD++;
    } else {
      html =
        html +
        ` <tr style='height:2px'>                 
          </tr>`;
    }

    for (var r = 0; r < geojson.features.length; r++) {
      if (r > 0)
        html =
          html +
          ` <tr style='height:2px'>                 
            </tr>`;

      var ruta =
        this.ruta_exp +
        "/PD-URBANITZACIO/PD-" +
        geojson.features[r].properties.codigo +
        "/PD-" +
        geojson.features[r].properties.codigo.substring(0, 8) +
        "_PORTADA.pdf";

      var colorAplicable = "GREEN";
      var msgAplicable = "";
      if (geojson.features[r].properties.aplicable == "SI") {
        colorAplicable = "#1a4d1a";
        msgAplicable = "ACTUALMENT APLICABLE";
      }
      if (geojson.features[r].properties.aplicable == "NO") {
        colorAplicable = "#990000";
        msgAplicable = "ACTUALMENT NO APLICABLE";
      }
      if (geojson.features[r].properties.aplicable == "D") {
        colorAplicable = "GREY";
        msgAplicable = "-----------------------";
      }

      const reader = new DataReader();
      let isResource = await reader.checkURLAvailability(ruta);

      let isDoc = `<td align="center"><a href="${ruta}"  target="_blank" title="Informació del expedient" style='color:blue;font-family:Arial;font-size:8.5pt'>${geojson.features[r].properties.codigo}</a></td>`;
      if (isResource === false) {
        isDoc = `<td align="center" title="Informació del expedient" style='color:gray;font-family:Arial;font-size:8.5pt'>${geojson.features[r].properties.codigo} (Documentación no disponible)</a></td>`;
      }

      html =
        html +
        ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
              <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>PD - URBANIZACIONES</LABEL></td>  
              ${isDoc}              
          </tr> 
          <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
              <td colspan="2"><LABEL style='text-align: justify;font-size:8.5pt;font-family:Arial;color:grey'>${geojson.features[r].properties.descripcio}</LABEL></td>      
          </tr>`;
      //<tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
      //<td COLSPAN="2"><LABEL style='font-size:8.4pt;font-family:Arial;color:WHITE;background-color:${colorAplicable}'>${msgAplicable}</LABEL></td>
      //</tr>
    }
    return html;
  }

 /**
 * Genera una tabla HTML que muestra información sobre planes especiales de reforma interior a partir de un objeto GeoJSON.
 *
 * @param {Object} geojson - Objeto GeoJSON que contiene la información de planes especiales de reforma interior.
 * @returns {Promise<string>} - Una cadena HTML que representa la tabla de planes especiales de reforma interior.
 */
  async createHTML_plan_especial_RI(geojson) {
    geojson.features.sort((a, b) => a.properties.codigo - b.properties.codigo);

    var html = "";
    if (this.num_exp_PBX == 0) {
      html =
        html +
        `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
          <tr  align="center"  style='background-color:rgb(102,102,102,1);padding:3px;font-size:8.5pt;font-family:Arial BLACK;color:white;height:22px'>
              <td colspan="2">PLAN ESPECIAL (REFORMA INTERIOR)</td>                   
          </tr >`;

      this.num_exp_PBX++;
    } else {
      html =
        html +
        ` <tr style='height:2px'>                 
          </tr>`;
    }

    for (var r = 0; r < geojson.features.length; r++) {
      if (r > 0)
        html =
          html +
          ` <tr style='height:2px'>                 
            </tr>`;

      var ruta =
        this.ruta_exp +
        "/PBX_PERIS/PBX-" +
        geojson.features[r].properties.codigo +
        "/PBX-" +
        geojson.features[r].properties.codigo.substring(0, 8) +
        "_PORTADA.pdf";

      var colorAplicable = "GREEN";
      var msgAplicable = "";
      if (geojson.features[r].properties.aplicable == "SI") {
        colorAplicable = "#1a4d1a";
        msgAplicable = "ACTUALMENT APLICABLE";
      }
      if (geojson.features[r].properties.aplicable == "NO") {
        colorAplicable = "#990000";
        msgAplicable = "ACTUALMENT NO APLICABLE";
      }
      if (geojson.features[r].properties.aplicable == "D") {
        colorAplicable = "GREY";
        msgAplicable = "-----------------------";
      }

      const reader = new DataReader();
      let isResource = await reader.checkURLAvailability(ruta);

      let isDoc = `<td align="center"><a href="${ruta}"  target="_blank" title="Informació del expedient" style='color:blue;font-family:Arial;font-size:8.5pt'>${geojson.features[r].properties.codigo}</a></td>`;
      if (isResource === false) {
        isDoc = `<td align="center" title="Informació del expedient" style='color:gray;font-family:Arial;font-size:8.5pt'>${geojson.features[r].properties.codigo} (Documentación no disponible)</a></td>`;
      }

      html =
        html +
        ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
              <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>PBX - PLAN ESPECIAL (PERI)</LABEL></td>  
              ${isDoc}              
          </tr> 
          <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
              <td colspan="2"><LABEL style='text-align: justify;font-size:8.5pt;font-family:Arial;color:grey'>${geojson.features[r].properties.descripcio}</LABEL></td>      
          </tr>`;
      //<tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
      //<td COLSPAN="2"><LABEL style='font-size:8.4pt;font-family:Arial;color:WHITE;background-color:${colorAplicable}'>${msgAplicable}</LABEL></td>
      //</tr>
    }
    return html;
  }

  /**
   * Genera una tabla HTML que muestra información sobre modificaciones del Plan General de Ordenación Urbana (PGOU) a partir de un objeto GeoJSON.
   *
   * @async
   * @param {Object} geojson - Objeto GeoJSON que contiene la información de las modificaciones del PGOU.
   * @returns {Promise<string>} - Una cadena HTML que representa la tabla de modificaciones del PGOU.
   */
  async createHTML_modificacion_pgou(geojson) {
    geojson.features
      // .filter((feature) => feature.properties.boib_ad !== null)
      .sort((a, b) => a.properties.codigo - b.properties.codigo);

    var html = "";
    if (this.num_exp_PA == 0) {
      html =
        html +
        `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
          <tr  align="center"  style='background-color:rgb(102,102,102,1);padding:3px;font-size:8.5pt;font-family:Arial BLACK;color:white;height:22px'>
              <td colspan="2">MODIFICACIÓN PGOU</td>                   
          </tr >`;

      this.num_exp_PA++;
    } else {
      html =
        html +
        ` <tr style='height:2px'>                 
          </tr>`;
    }

    for (var r = 0; r < geojson.features.length; r++) {
      if (r > 0)
        html =
          html +
          ` <tr style='height:2px'>                 
            </tr>`;

      var ruta =
        this.ruta_exp +
        "/PA-MODIFICACIO_PG/PA-" +
        geojson.features[r].properties.codigo +
        "/PA-" +
        /*geojson.features[r].properties.codigo +
        "_PORTADA.pdf"*/
        geojson.features[r].properties.codigo.substring(0, 8) +
        "_PORTADA.pdf";

      /*if (
        geojson.features[r].properties.codigo.charAt(
          geojson.features[r].properties.codigo.length - 1
        ) != 0
      ) {
        ruta =
          this.ruta_exp +
          "/PA-MODIFICACIO_PG/PA-" +
          geojson.features[r].properties.codigo.substring(0, 8) +
          "0000" +
          "/PA-" +
          geojson.features[r].properties.codigo.substring(0, 8) +
          "_PORTADA.pdf";
      }*/

      const reader = new DataReader();
      let isResource = await reader.checkURLAvailability(ruta);

      if (!isResource) {
        ruta =
          this.ruta_exp +
          "/PA-MODIFICACIO_PG/PA-" +
          geojson.features[r].properties.codigo +
          "/PA-" +
          geojson.features[r].properties.codigo +
          "_PORTADA.pdf";
        isResource = await reader.checkURLAvailability(ruta);
      }

      if (!isResource) {
        ruta =
          this.ruta_exp +
          "/PA-MODIFICACIO_PG/PA-" +
          geojson.features[r].properties.codigo.substring(0, 8) +
          "0000" +
          "/PA-" +
          geojson.features[r].properties.codigo.substring(0, 8) +
          "_PORTADA.pdf";
        isResource = await reader.checkURLAvailability(ruta);
      }

      var colorAplicable = "GREEN";
      var msgAplicable = "";
      if (geojson.features[r].properties.aplicable == "SI") {
        colorAplicable = "#1a4d1a";
        msgAplicable = "ACTUALMENT APLICABLE";
      }
      if (geojson.features[r].properties.aplicable == "NO") {
        colorAplicable = "#990000";
        msgAplicable = "ACTUALMENT NO APLICABLE";
      }
      if (geojson.features[r].properties.aplicable == "D") {
        colorAplicable = "GREY";
        msgAplicable = "-----------------------";
      }

      let isDoc = `<td align="center"><a href="${ruta}"  target="_blank" title="Informació del expedient" style='color:blue;font-family:Arial;font-size:8.5pt'>${geojson.features[r].properties.codigo}</a></td>`;
      if (isResource === false) {
        isDoc = `<td align="center" title="Informació del expedient" style='color:gray;font-family:Arial;font-size:8.5pt'>${geojson.features[r].properties.codigo} (Documentación no disponible)</a></td>`;
      }

      html =
        html +
        ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>PA - MODIFICACIÓN PGOU</LABEL></td>  
            ${isDoc}                
        </tr> 
        <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
            <td colspan="2"><LABEL style='text-align: justify;font-size:8.5pt;font-family:Arial;color:grey'>${geojson.features[r].properties.descripcio}</LABEL></td>      
        </tr>`;

      //<tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
      //<td COLSPAN="2"><LABEL style='font-size:8.4pt;font-family:Arial;color:WHITE;background-color:${colorAplicable}'>${msgAplicable}</LABEL></td>
      //</tr>
    }
    return html;
  }

  /**
   * Genera una tabla HTML que muestra información sobre estudios de detalle a partir de un objeto GeoJSON.
   *
   * @async
   * @param {Object} geojson - Objeto GeoJSON que contiene la información de los estudios de detalle.
   * @returns {Promise<string>} - Una cadena HTML que representa la tabla de estudios de detalle.
   */
  async createHTML_estudio_detalle(geojson) {
    geojson.features.sort((a, b) => a.properties.codigo - b.properties.codigo);
    var html = "";
    if (this.num_exp_PE == 0) {
      html =
        html +
        `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
          <tr  align="center"  style='background-color:rgb(102,102,102,1);padding:3px;font-size:8.5pt;font-family:Arial BLACK;color:white;height:22px'>
              <td colspan="2">ESTUDIOS DE DETALLE</td>                   
          </tr >`;

      this.num_exp_PE++;
    } else {
      html =
        html +
        ` <tr style='height:2px'>                 
          </tr>`;
    }

    for (var r = 0; r < geojson.features.length; r++) {
      if (r > 0)
        html =
          html +
          ` <tr style='height:2px'>                 
            </tr>`;

      var ruta =
        this.ruta_exp +
        "/PE-ESTUDI_DETALL/PE-" +
        geojson.features[r].properties.codigo +
        "/PE-" +
        geojson.features[r].properties.codigo.substring(0, 8) +
        "_PORTADA.pdf";

      var colorAplicable = "GREEN";
      var msgAplicable = "";
      if (geojson.features[r].properties.aplicable == "SI") {
        colorAplicable = "#1a4d1a";
        msgAplicable = "ACTUALMENT APLICABLE";
      }
      if (geojson.features[r].properties.aplicable == "NO") {
        colorAplicable = "#990000";
        msgAplicable = "ACTUALMENT NO APLICABLE";
      }
      if (geojson.features[r].properties.aplicable == "D") {
        colorAplicable = "GREY";
        msgAplicable = "-----------------------";
      }

      const reader = new DataReader();
      let isResource = await reader.checkURLAvailability(ruta);

      let isDoc = `<td align="center"><a href="${ruta}"  target="_blank" title="Informació del expedient" style='color:blue;font-family:Arial;font-size:8.5pt'>${geojson.features[r].properties.codigo}</a></td>`;
      if (isResource === false) {
        isDoc = `<td align="center" title="Informació del expedient" style='color:gray;font-family:Arial;font-size:8.5pt'>${geojson.features[r].properties.codigo} (Documentación no disponible)</a></td>`;
      }

      html =
        html +
        ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
              <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>PE - ESTUDI DETALL</LABEL></td>  
              ${isDoc}              
          </tr> 
          <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
              <td colspan="2"><LABEL style='text-align: justify;font-size:8.5pt;font-family:Arial;color:grey'>${geojson.features[r].properties.descripcio}</LABEL></td>      
          </tr>`;
      //<tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
      //<td COLSPAN="2"><LABEL style='font-size:8.4pt;font-family:Arial;color:WHITE;background-color:${colorAplicable}'>${msgAplicable}</LABEL></td>
      //</tr>
    }
    return html;
  }

  // Creación HTML de Situacion

  async createHTML_situacion(geojson) {
    var htmlr = "";

    htmlr =
      htmlr +
      `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
          <tr  align="center"  style='background-color:rgb(26,77,26,1);padding:3px;font-size:8.5pt;font-family:Arial BLACK;color:white;height:22px'>
              <td id="popup_situacion" colspan="2">SITUACIÓN</td>                   
          </tr >`;

    for (var r = 0; r < geojson.features.length; r++) {
      var centroid = turf.centroid(geojson.features[r].geometry);
      var coord = turf.getCoord(centroid.geometry);
      var urlG =
        "http://maps.google.com/?cbll=" +
        coord[1] +
        "," +
        coord[0] +
        "&cbp=12,90,0,0,5&layer=c";

      var calle = "-";
      if (geojson.features[r].properties.tipo == "U") {
        calle =
          geojson.features[r].properties.tipo_via +
          " " +
          geojson.features[r].properties.calle +
          " " +
          geojson.features[r].properties.numero;
      }

      htmlr =
        htmlr +
        ` 
          <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
              <td> 
                  <a target="_blank" id="ir_catastro" title="Ir Sede electronica catastro" href="https://www1.sedecatastro.gob.es/cycbieninmueble/OVCListaBienes.aspx?RC1=${geojson.features[r].properties.pcat1}&RC2=${geojson.features[r].properties.pcat2}"><img src="${window.location.protocol}//${window.location.host}/opg/images/sede_catastro1.png"></a>
              </td> 
              <td> 
                  <a target="_blank" id="ir_streetview" title="Ir a Street view" href="${urlG}}"><img src="${window.location.protocol}//${window.location.host}/opg/images/streetview.png"></a>
              </td>  
              
          </tr>
          <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
              <td><LABEL id="popup_titulo_catastro" style='font-size:8pt;font-family:Arial Black;color:BLACK'>REF. CATASTRAL</LABEL></td>  
              <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.refcat}</LABEL></td>  
          </tr>
         
          
        `;
      if (calle != "-") {
        htmlr =
          htmlr +
          `
          <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
              
              <td COLSPAN="2"><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${calle}</td>                  
          </tr>`;
      }
    }
    htmlr = htmlr + `</TABLE><br>`;

    return htmlr;
  }

  async createHTML_suelo_rustico_PGOU98(geojson) {
    let html = "";
    let descr = "";

    html =
      html +
      `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
        <tr  align="center"  style='background-color:#ffecb1;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
            <td colspan="2">Subzonas Rústico (PGOU98)</td>                   
        </tr >`;

    for (var r = 0; r < geojson.features.length; r++) {
      switch (geojson.features[r].properties.text) {
        case "AP":
          descr = "Subzona agricola protegida";
          break;
        case "AR":
          descr = "Subzona agricola-ganadera";
          break;
        case "F":
          descr = "Subzona de interés forestal y ecológico";
          break;
        case "IN":
          descr = "Subzona de interés natural";
          break;
        case "IP":
          descr = "Subzona de interés paisajístico";
          break;
        case "PL":
          descr = "Subzona de parcelación limitada";
          break;
        case "PL-NR":
          descr = "Subzona de parcelación limitada de núcleo rural";
          break;
        case "R":
          descr = "Subzona de recuperación";
          break;
      }

      html =
        html +
        ` 
          <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
              <td style='font-size:8pt;font-family:Arial Black;color:BLACK'>SUBZONA</td>  
              <td style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.text}</td>                  
          </tr>
          <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
              <td style='font-size:8pt;font-family:Arial Black;color:BLACK'>DESCRIPCIÓN</td>  
              <td style='font-size:8pt;font-family:Arial;color:BLACK'>${descr}</td>                  
          </tr>
          <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
              <td colspan="2"> 
                  <button id="popup_boton_normativa" style="padding:3px;font-size:9pt;font-family:Arial Black" class="ui-button ui-widget ui-corner-all" title="Información normativa asociada" OnClick="createNormativa('suelo_rustico','${geojson.features[r].properties.fid}')"><i class="fa fa-info-circle"></i> Normativa</button>
              </td>      
          </tr>
          `;
    }
    html = html + `</TABLE><br>`;

    return html;
  }

  async createHTML_suelo_urbano_PG2023(geojson) {
    let html = "";

    for (var r = 0; r < geojson.features.length; r++) {
      html =
        html +
        `<TABLE style='margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
          <tr  align="center"  style='background-color:#e6e6e6;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'  >
            <td colspan="2">
              <button id="btNormativa_SU_PG2023" 
                style="padding:3px;font-size:9pt;font-family:Arial Black" 
                class="ui-button ui-widget ui-corner-all" 
                title="Información normativa asociada"
                data-fid="${geojson.features[r].properties.fid}" 
                data-table="pg_urba"
                data-accion="normativa">
                <i class="fa fa-info-circle"></i> Normativa Común en suelo urbano
              </button>
            </td>  
                    
          </tr>
                 `;
    }
    html = html + `</TABLE><BR>`;

    return html;
  }

  async createHTML_zou_PG2023(geojson) {
    let html = "";

    html =
      html +
      `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
        <tr  align="center"  style='background-color:#166d7c;padding:3px;font-size:8.5pt;font-family:Arial BLACK;color:white;height:22px'>
            <td colspan="2">(ZOU) ZONA ORDENACIÓN URBANA (PG2023)</td>                   
        </tr >`;

    for (var r = 0; r < geojson.features.length; r++) {
      const ruta =
        window.location.protocol +
        "//" +
        window.location.host +
        "/images/FICHAS_PLANEAMIENTO/ZOU/" +
        geojson.features[r].properties.nzou +
        ".pdf";

      html =
        html +
        ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>DENOMINACIÓN</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[
              r
            ].properties.zou.toUpperCase()}</td>                  
        </tr> 
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>CÓDIGO</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${
              geojson.features[r].properties.etiq
            }</td>                  
        </tr>
        <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
            <td colspan="2"> 
                 <a href="${ruta}" target="_blank" class="ui-button ui-widget ui-corner-all" title="Fitxa aprobada" style="padding:3px;font-size:9pt;font-family:Arial Black"><i class="fa fa-info-circle"></i> Ficha</a>

                 <button id="btNormativa_ZOU_PG2023" 
                  style="padding:3px;font-size:9pt;font-family:Arial Black" 
                  class="ui-button ui-widget ui-corner-all" 
                  title="Información normativa asociada"
                  data-fid="${geojson.features[r].properties.fid}" 
                  data-table="pg_zou"
                  data-accion="normativa">
                  <i class="fa fa-info-circle"></i> Normativa
                </button>
            </td>      
        </tr>
    `;
    }
    html = html + `</TABLE><br>`;

    return html;
  }

  // Creación HTML actuaciones aisladas PG2023

  async createHTML_actuaciones_aisladas_PG2023(geojson) {
    let html = "";

    html =
      html +
      `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
        <tr  align="center"  style='background-color:#734fb7;padding:3px;font-size:8.5pt;font-family:Arial BLACK;color:white;height:22px'>
            <td colspan="2">ACTUACIONES AISLADAS (PG2023)</td>                   
        </tr >`;

    for (var r = 0; r < geojson.features.length; r++) {
      const ruta =
        window.location.protocol +
        "//" +
        window.location.host +
        "/images/FICHAS_PLANEAMIENTO/ACTUACIONES/AA/" +
        geojson.features[r].properties.tipus +
        "_" +
        geojson.features[r].properties.codi +
        ".pdf";

      html =
        html +
        ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>DENOMINACIÓN</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[
              r
            ].properties.ambit.toUpperCase()}</td>                  
        </tr> 
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL id="popup_titulo_calif" style='font-size:8pt;font-family:Arial Black;color:BLACK'>CALIFICACIÓN</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${
              geojson.features[r].properties.tipus
            }/${geojson.features[r].properties.codi}</td>                  
        </tr>
        <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
            <td colspan="2"> 
                 <a href="${ruta}" target="_blank" class="ui-button ui-widget ui-corner-all" title="Fitxa aprobada" style="padding:3px;font-size:9pt;font-family:Arial Black"><i class="fa fa-info-circle"></i> Ficha</a>

                <button id="btNormativa_AA_PG2023" 
                  style="padding:3px;font-size:9pt;font-family:Arial Black" 
                  class="ui-button ui-widget ui-corner-all" 
                  title="Información normativa asociada"
                  data-fid="${geojson.features[r].properties.fid}" 
                  data-table="pg_actuaciones_aisladas"
                  data-accion="normativa">
                  <i class="fa fa-info-circle"></i> Normativa
                </button>
            </td>      
        </tr>
    `;
    }
    html = html + `</TABLE><br>`;

    return html;
  }

  // Creación HTML actuaciones PG2023

  async createHTML_actuaciones_PG2023(geojson) {
    let html = "";

    html =
      html +
      `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
        <tr  align="center"  style='background-color:#c81c0f;padding:3px;font-size:8.5pt;font-family:Arial BLACK;color:white;height:22px'>
            <td colspan="2">ACTUACIONES (PG2023)</td>                   
        </tr >`;

    for (var r = 0; r < geojson.features.length; r++) {
      const ruta =
        window.location.protocol +
        "//" +
        window.location.host +
        "/images/FICHAS_PLANEAMIENTO/ACTUACIONES/SU/" +
        geojson.features[r].properties.codi +
        ".pdf";

      html =
        html +
        ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>DENOMINACIÓN</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[
              r
            ].properties.nom.toUpperCase()}</td>                  
        </tr> 
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL id="popup_titulo_calif" style='font-size:8pt;font-family:Arial Black;color:BLACK'>CALIFICACIÓN</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${
              geojson.features[r].properties.codi_etiq
            }</td>                  
        </tr>
        <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
            <td colspan="2"> 
                 <a href="${ruta}" target="_blank" class="ui-button ui-widget ui-corner-all" title="Fitxa aprobada" style="padding:3px;font-size:9pt;font-family:Arial Black"><i class="fa fa-info-circle"></i> Ficha</a>

                <button id="btNormativa_ARU_PG2023" 
                  style="padding:3px;font-size:9pt;font-family:Arial Black" 
                  class="ui-button ui-widget ui-corner-all" 
                  title="Información normativa asociada"
                  data-fid="${geojson.features[r].properties.fid}" 
                  data-table="pg_actuaciones_suelo_urbano"
                  data-accion="normativa">
                  <i class="fa fa-info-circle"></i> Normativa
                </button>
            </td>      
        </tr>
    `;
    }
    html = html + `</TABLE><br>`;

    return html;
  }

  // Creación HTML Unidad actuación PRI

  async createHTML_unidad_actuacion_PRI(geojson) {
    let html = "";

    html =
      html +
      `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
          <tr  align="center"  style='background-color:rgb(153,8,8,1);padding:3px;font-size:8.5pt;font-family:Arial BLACK;color:white;height:22px'>
              <td colspan="2">(UA) UNIDAD DE ACTUACIÓN (PRI)</td>                   
          </tr >`;

    for (var r = 0; r < geojson.features.length; r++) {
      html =
        html +
        ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
              <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>DENOMINACIÓN</LABEL></td>  
              <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[
                r
              ].properties.denominacio.toUpperCase()}</td>                  
          </tr> 
          <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
              <td><LABEL id="popup_titulo_calif" style='font-size:8pt;font-family:Arial Black;color:BLACK'>CALIFICACIÓN</LABEL></td>  
              <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${
                geojson.features[r].properties.codigo
              }</td>                  
          </tr>
          <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
              <td colspan="2"> 
                <button id="btFicha_UA_PRI" 
                  style="padding:3px;font-size:9pt;font-family:Arial Black" 
                  class="ui-button ui-widget ui-corner-all" 
                  title="Ficha parametros y condiciones de edificación"
                  data-fid="${geojson.features[r].properties.fid}" 
                  data-clase="UA_PRI">
                  <i class="fa fa-info-circle"></i> Ficha
                </button>
                 
              </td>      
          </tr>
      `;
    }
    html = html + `</TABLE><br>`;

    return html;
  }

  // Creación HTML catalogos PRI

  async createHTML_catalogos_PRI(geojson) {
    let html = "";

    html =
      html +
      `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
          <tr  align="center"  style='background-color:rgb(230,143,230,1);padding:3px;font-size:8.5pt;font-family:Arial BLACK;color:#4d4d4d;height:22px'>
              <td colspan="2">CATALOGOS (PRI)</td>                   
          </tr >`;

    for (var r = 0; r < geojson.features.length; r++) {
      html =
        html +
        ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
              <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>DENOMINACIÓN</LABEL></td>  
              <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[
                r
              ].properties.denominacion.toUpperCase()}</td>                  
          </tr> 
          <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
              <td><LABEL id="popup_titulo_calif" style='font-size:8pt;font-family:Arial Black;color:BLACK'>CALIFICACIÓn</LABEL></td>  
              <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${
                geojson.features[r].properties.codigo
              }</td>                  
          </tr>
          <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
              <td colspan="2"> 
                  <button style="padding:3px;font-size:9pt;font-family:Arial Black" class="ui-button ui-widget ui-corner-all" title="Ficha del elemento" value=${
                    geojson.features[r].properties.codigo
                  } OnClick="fichaCAT_PRI(this)"><i class="fa fa-info-circle"></i> Ficha</button> 
                  <button id="btNormativa_CAT_PRI" 
                    style="padding:3px;font-size:9pt;font-family:Arial Black" 
                    class="ui-button ui-widget ui-corner-all" 
                    title="Información normativa asociada"
                    data-fid="${geojson.features[r].properties.fid}" 
                    data-table="pri_catalogos"
                    data-accion="normativa">
                    <i class="fa fa-info-circle"></i> Normativa
                  </button>
              </td>      
          </tr>
      `;
    }
    html = html + `</TABLE><br>`;

    return html;
  }

  // Creación HTML zona turistica hotelera PRI

  async createHTML_zona_turistica_hotelera_PRI(geojson) {
    let html = "";

    html =
      html +
      `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
          <tr  align="center"  style='background-color:rgb(110,169,231,1);padding:3px;font-size:8.5pt;font-family:Arial Black;color:white;height:22px'>
              <td colspan="2">ZONA TURISTICA HOTELERA (PRI)</td>                   
          </tr >`;

    for (var r = 0; r < geojson.features.length; r++) {
      html =
        html +
        ` <tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
              <td><LABEL id="popup_titulo_calif" style='font-size:8pt;font-family:Arial Black;color:BLACK'>CALIFICACIÓN</LABEL></td>  
              <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.codigo}</td>                  
          </tr>
          <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
              <td colspan="2"> 
                <button id="btFicha_TH_PRI" 
                  style="padding:3px;font-size:9pt;font-family:Arial Black" 
                  class="ui-button ui-widget ui-corner-all" 
                  title="Ficha parametros y condiciones de edificación"
                  data-fid="${geojson.features[r].properties.fid}" 
                  data-clase="TH_PRI">
                  <i class="fa fa-info-circle"></i> Ficha
                </button>
                <button id="btNormativa_TH_PRI" 
                  style="padding:3px;font-size:9pt;font-family:Arial Black" 
                  class="ui-button ui-widget ui-corner-all" 
                  title="Información normativa asociada"
                  data-fid="${geojson.features[r].properties.fid}" 
                  data-table="pri_zona_turistica_hotelera"
                  data-accion="normativa">
                  <i class="fa fa-info-circle"></i> Normativa
                </button>
              </td>      
          </tr>
          `;
    }
    html = html + `</TABLE><br>`;

    return html;
  }

  // Creación HTML zona turistica PRI

  async createHTML_zona_turistica_PRI(geojson) {
    let html = "";

    html =
      html +
      `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
          <tr  align="center"  style='background-color:rgb(165,210,255,1);padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
              <td colspan="2">ZONA TURISTICA (PRI)</td>                   
          </tr >`;

    for (var r = 0; r < geojson.features.length; r++) {
      html =
        html +
        ` <tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
              <td><LABEL id="popup_titulo_calif" style='font-size:8pt;font-family:Arial Black;color:BLACK'>CALIFICACIÓN</LABEL></td>  
              <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.codigo}</td>                  
          </tr>
          <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
              <td colspan="2"> 
                <button id="btFicha_T_PRI" 
                  style="padding:3px;font-size:9pt;font-family:Arial Black" 
                  class="ui-button ui-widget ui-corner-all" 
                  title="Ficha parametros y condiciones de edificación"
                  data-fid="${geojson.features[r].properties.fid}" 
                  data-clase="T_PRI">
                  <i class="fa fa-info-circle"></i> Ficha
                </button>
                <button id="btNormativa_T_PRI" 
                  style="padding:3px;font-size:9pt;font-family:Arial Black" 
                  class="ui-button ui-widget ui-corner-all" 
                  title="Información normativa asociada"
                  data-fid="${geojson.features[r].properties.fid}" 
                  data-table="pri_zona_turistica"
                  data-accion="normativa">
                  <i class="fa fa-info-circle"></i> Normativa
                </button>
              </td>      
          </tr>
          `;
    }
    html = html + `</TABLE><br>`;

    return html;
  }

  // Creación HTML zona comercial servicios PRI

  async createHTML_zona_comercial_servicios_PRI(geojson) {
    let html = "";

    html =
      html +
      `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
          <tr  align="center"  style='background-color:rgb(190,168,211,1);padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
              <td colspan="2">COMERCIAL / SERVICIOS (PRI) </td>                   
          </tr >`;

    for (var r = 0; r < geojson.features.length; r++) {
      html =
        html +
        ` <tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
              <td><LABEL id="popup_titulo_calif" style='font-size:8pt;font-family:Arial Black;color:BLACK'>CALIFICACIÓN</LABEL></td>  
              <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.codigo}</td>                  
          </tr>
          <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
              <td colspan="2"> 
                <button id="btFicha_S_PRI" 
                  style="padding:3px;font-size:9pt;font-family:Arial Black" 
                  class="ui-button ui-widget ui-corner-all" 
                  title="Ficha parametros y condiciones de edificación"
                  data-fid="${geojson.features[r].properties.fid}" 
                  data-clase="S_PRI">
                  <i class="fa fa-info-circle"></i> Ficha
                </button>
                <button id="btNormativa_S_PRI" 
                  style="padding:3px;font-size:9pt;font-family:Arial Black" 
                  class="ui-button ui-widget ui-corner-all" 
                  title="Información normativa asociada"
                  data-fid="${geojson.features[r].properties.fid}" 
                  data-table="pri_zona_comercial_serveis"
                  data-accion="normativa">
                  <i class="fa fa-info-circle"></i> Normativa
                </button>
              </td>      
          </tr>
          `;
    }
    html = html + `</TABLE><br>`;

    return html;
  }

  // Creación HTML zona vivienda unifamilar aislada PRI

  async createHTML_zona_vivienda_unifamiliar_aislada_PRI(geojson) {
    let html = "";

    html =
      html +
      `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
          <tr  align="center"  style='background-color:rgb(248,233,178,1);padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
              <td colspan="2">VIVIENDA UNIFAMILIAR AISLADA (PRI)</td>                   
          </tr >`;

    for (var r = 0; r < geojson.features.length; r++) {
      html =
        html +
        ` <tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
              <td><LABEL id="popup_titulo_calif" style='font-size:8pt;font-family:Arial Black;color:BLACK'>CALIFICACIÓN</LABEL></td>  
              <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.codigo}</td>                  
          </tr>
          <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
              <td colspan="2"> 
                <button id="btFicha_I_PRI" 
                  style="padding:3px;font-size:9pt;font-family:Arial Black" 
                  class="ui-button ui-widget ui-corner-all" 
                  title="Ficha parametros y condiciones de edificación"
                  data-fid="${geojson.features[r].properties.fid}" 
                  data-clase="I_PRI">
                  <i class="fa fa-info-circle"></i> Ficha
                </button>
                <button id="btNormativa_I_PRI" 
                  style="padding:3px;font-size:9pt;font-family:Arial Black" 
                  class="ui-button ui-widget ui-corner-all" 
                  title="Información normativa asociada"
                  data-fid="${geojson.features[r].properties.fid}" 
                  data-table="pri_zona_habitatge_unifamiliar_aillat"
                  data-accion="normativa">
                  <i class="fa fa-info-circle"></i> Normativa
                </button>
              </td>      
          </tr>
          `;
    }
    html = html + `</TABLE><br>`;

    return html;
  }

  // Creación HTML zona vivienda adosada PRI

  async createHTML_zona_vivienda_adosada_PRI(geojson) {
    let html = "";

    html =
      html +
      `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
          <tr  align="center"  style='background-color:rgb(255,221,154,1);padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
              <td colspan="2">VIVIENDA ADOSADA (PRI)</td>                   
          </tr >`;

    for (var r = 0; r < geojson.features.length; r++) {
      html =
        html +
        `<tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
              <td><LABEL id="popup_titulo_calif" style='font-size:8pt;font-family:Arial Black;color:BLACK'>CALIFICACIÓN</LABEL></td>  
              <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.codigo}</td>                  
          </tr>
          <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
              <td colspan="2"> 
                <button id="btFicha_VA_PRI" 
                  style="padding:3px;font-size:9pt;font-family:Arial Black" 
                  class="ui-button ui-widget ui-corner-all" 
                  title="Ficha parametros y condiciones de edificación"
                  data-fid="${geojson.features[r].properties.fid}" 
                  data-clase="VA_PRI">
                  <i class="fa fa-info-circle"></i> Ficha
                </button>
                <button id="btNormativa_VA_PRI" 
                  style="padding:3px;font-size:9pt;font-family:Arial Black" 
                  class="ui-button ui-widget ui-corner-all" 
                  title="Información normativa asociada"
                  data-fid="${geojson.features[r].properties.fid}" 
                  data-table="pri_zona_habitatges_adossats"
                  data-accion="normativa">
                  <i class="fa fa-info-circle"></i> Normativa
                </button>
              </td>      
          </tr>
          `;
    }
    html = html + `</TABLE><br>`;

    return html;
  }

  // Creación HTML zona vivienda tradicional PRI

  async createHTML_zona_vivienda_tradicional_PRI(geojson) {
    let html = "";

    html =
      html +
      `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
          <tr  align="center"  style='background-color:rgb(255,157,175,1);padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
              <td colspan="2">VIVIENDA TRADICIONAL (PRI)</td>                   
          </tr >`;

    for (var r = 0; r < geojson.features.length; r++) {
      html =
        html +
        ` <tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
              <td><LABEL id="popup_titulo_calif" style='font-size:8pt;font-family:Arial Black;color:BLACK'>CALIFICACIÓN</LABEL></td>  
              <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.codigo}</td>                  
          </tr>
          <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
              <td colspan="2"> 
                <button id="btFicha_VT_PRI" 
                  style="padding:3px;font-size:9pt;font-family:Arial Black" 
                  class="ui-button ui-widget ui-corner-all" 
                  title="Ficha parametros y condiciones de edificación"
                  data-fid="${geojson.features[r].properties.fid}" 
                  data-clase="VT_PRI">
                  <i class="fa fa-info-circle"></i> Ficha
                </button>
                <button id="btNormativa_VT_PRI" 
                  style="padding:3px;font-size:9pt;font-family:Arial Black" 
                  class="ui-button ui-widget ui-corner-all" 
                  title="Información normativa asociada"
                  data-fid="${geojson.features[r].properties.fid}" 
                  data-table="pri_zona_habitatge_tradicional"
                  data-accion="normativa">
                  <i class="fa fa-info-circle"></i> Normativa
                </button>
              </td>      
          </tr>
          `;
    }
    html = html + `</TABLE><br>`;

    return html;
  }

  // Creación HTML zona vivienda edificación abierta PRI

  async createHTML_zona_vivienda_edificacion_abierta_PRI(geojson) {
    let html = "";

    html =
      html +
      `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
    <tr  align="center"  style='background-color:rgb(255,224,209,1);padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
        <td colspan="2">VIVIENDA EDIFICACIÓN ABIERTA (PRI)</td>                   
    </tr >`;

    for (var r = 0; r < geojson.features.length; r++) {
      html =
        html +
        ` <tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
        <td><LABEL id="popup_titulo_calif" style='font-size:8pt;font-family:Arial Black;color:BLACK'>CALIFICACIÓN</LABEL></td>  
        <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.codigo}</td>                  
    </tr>
    <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
        <td colspan="2"> 
          <button id="btFicha_E_PRI" 
            style="padding:3px;font-size:9pt;font-family:Arial Black" 
            class="ui-button ui-widget ui-corner-all" 
            title="Ficha parametros y condiciones de edificación"
            data-fid="${geojson.features[r].properties.fid}" 
            data-clase="E_PRI">
            <i class="fa fa-info-circle"></i> Ficha
          </button>
          <button id="btNormativa_E_PRI" 
            style="padding:3px;font-size:9pt;font-family:Arial Black" 
            class="ui-button ui-widget ui-corner-all" 
            title="Información normativa asociada"
            data-fid="${geojson.features[r].properties.fid}" 
            data-table="pri_zona_habitatge_edificacio_oberta"
            data-accion="normativa">
            <i class="fa fa-info-circle"></i> Normativa
          </button>
      </td>      
    </tr>
    `;
    }
    html = html + `</TABLE><br>`;

    return html;
  }

  // Creación HTML zona residencial entre medianeras PRI

  async createHTML_zona_residencial_entre_medianeras_PRI(geojson) {
    let html = "";

    html =
      html +
      `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
          <tr  align="center"  style='background-color:rgb(255,186,173,1);padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
              <td colspan="2">RESIDENCIAL ENTRE MEDIANERAS (PRI)</td>                   
          </tr >`;

    for (var r = 0; r < geojson.features.length; r++) {
      html =
        html +
        ` <tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
              <td><LABEL id='popup_titulo_calif' style='font-size:8pt;font-family:Arial Black;color:BLACK'>CALIFICACIÓN</LABEL></td>  
              <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.codigo}</td>                  
          </tr>
          <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
              <td colspan="2"> 
                <button id="btFicha_D_PRI" 
                  style="padding:3px;font-size:9pt;font-family:Arial Black" 
                  class="ui-button ui-widget ui-corner-all" 
                  title="Ficha parametros y condiciones de edificación"
                  data-fid="${geojson.features[r].properties.fid}" 
                  data-clase="D_PRI">
                  <i class="fa fa-info-circle"></i> Ficha
                <button id="btNormativa_D_PRI" 
                  style="padding:3px;font-size:9pt;font-family:Arial Black" 
                  class="ui-button ui-widget ui-corner-all" 
                  title="Información normativa asociada"
                  data-fid="${geojson.features[r].properties.fid}" 
                  data-table="pri_zona_residencial_entre_mitgeres"
                  data-accion="normativa">
                  <i class="fa fa-info-circle"></i> Normativa
                </button>
              </td>      
          </tr>
          `;
    }
    html = html + `</TABLE><br>`;

    return html;
  }

  // Creación HTML de Suelo urbanizable PG2023

  async createHTML_suelo_urbanizable_PG2023(geojson) {
    var htmlr = "";

    htmlr =
      htmlr +
      `<TABLE  style='margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
          <tr  align="center"  style='background-color:#b7481d;padding:3px;font-size:8.5pt;font-family:Arial Black;color:white;height:22px'>
              <td colspan="2">(SUB) SUELO URBANIZABLE(PG2023)</td>                   
          </tr >`;

    for (var r = 0; r < geojson.features.length; r++) {
      var ruta =
        window.location.protocol +
        "//" +
        window.location.host +
        "/images/FICHAS_PLANEAMIENTO/ACTUACIONES/SUB/" +
        geojson.features[r].properties.codi +
        ".pdf";

      var area = turf.area(geojson.features[r].geometry);
      area = area.toFixed(2) + " m2";

      const codigo = geojson.features[r].properties.codi;

      if (r > 0)
        htmlr =
          htmlr +
          ` <tr style='height:2px'>                 
            </tr>`;

      htmlr =
        htmlr +
        ` 
        <tr align="center"  style='background-color:white;padding:3px;font-size:8pt;font-family:Arial Black;color:#660000;height:22px'>
            <td colspan="2">${geojson.features[
              r
            ].properties.nom.toUpperCase()}</td>                   
        </tr>
        
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>CODI</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>SUB/${codigo} </td>                  
        </tr>
        
        <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
            <td colspan="2"> 
                <a href="${ruta}" target="_blank" class="ui-button ui-widget ui-corner-all" title="Ficha aprobada" style="padding:3px;font-size:9pt;font-family:Arial Black"><i class="fa fa-info-circle"></i> Ficha</a>

                <button id="btNormativa_SUB_PG2023" 
                  style="padding:3px;font-size:9pt;font-family:Arial Black" 
                  class="ui-button ui-widget ui-corner-all" 
                  title="Información normativa asociada"
                  data-fid="${geojson.features[r].properties.fid}" 
                  data-table="pg_urbanitzable"
                  data-accion="normativa">
                  <i class="fa fa-info-circle"></i> Normativa
                </button>
            </td>      
        </tr>
        `;
      //  <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojsonRES.features[r].properties.regulacion} </td>
    }
    htmlr = htmlr + `</TABLE><br>`;

    return htmlr;
  }

  // Creación HTML de Preservación r

  async createHTML_preservacion_r(geojson) {
    var htmlr = "";

    htmlr =
      htmlr +
      `<TABLE  style='margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
        <tr  align="center"  style='background-color:rgb(204,128,51,0.4);padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
            <td colspan="2">PRESERVACIÓN (r) (PGOU98)</td>                   
        </tr >`;

    for (var r = 0; r < geojson.features.length; r++) {
      var area = turf.area(geojson.features[r].geometry);
      area = area.toFixed(2) + " m2";

      const codigo = geojson.features[r].properties.codigo;

      if (r > 0)
        html =
          html +
          ` <tr style='height:2px'>                 
          </tr>`;

      htmlr =
        htmlr +
        `                         
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>CODIGO</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${codigo} </td>                  
        </tr>
        <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
            <td colspan="2"> 
              <button id="btNormativa_r_PGOU98" 
                style="padding:3px;font-size:9pt;font-family:Arial Black" 
                class="ui-button ui-widget ui-corner-all" 
                title="Información normativa asociada"
                data-fid="${geojson.features[r].properties.fid}" 
                data-table="proteccion_arquitectonica"
                data-accion="normativa">
                <i class="fa fa-info-circle"></i> Normativa
              </button>
            </td>      
        </tr>
        `;
    }
    htmlr = htmlr + `</TABLE><br>`;

    return htmlr;
  }

  // Creación HTM de ARE

  async createHTML_area_regimen_especial(geojson) {
    let html = "";

    html =
      html +
      `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
    <tr  align="center"  style='background-color:rgb(237,245,255,1);padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
        <td colspan="2">(ARE) AREA REGIMEN ESPECIAL (PGOU98)</td>                   
    </tr >`;

    for (var r = 0; r < geojson.features.length; r++) {
      html =
        html +
        ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
        <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>CALIFICACIÓ</LABEL></td>  
        <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>ARE/${geojson.features[r].properties.codigo}</td>                  
    </tr>
    <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
        <td colspan="2"> 
          <button id="btNormativa_ARE_PGOU98" 
            style="padding:3px;font-size:9pt;font-family:Arial Black" 
            class="ui-button ui-widget ui-corner-all" 
            title="Información normativa asociada"
            data-fid="${geojson.features[r].properties.fid}" 
            data-table="area_regimen_especial"
            data-accion="normativa">
            <i class="fa fa-info-circle"></i> Normativa
          </button>
        </td>      
    </tr>
    `;
    }
    html = html + `</TABLE><br>`;

    return html;
  }

  // Creación HTM de API

  async createHTML_area_planeamiento_incorporado(geojson) {
    let html = "";
    let codigo = ``;

    for (var r = 0; r < geojson.features.length; r++) {
      if (geojson.features[r].properties.identif == "API") {
        html =
          html +
          `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
            <tr  align="center"  style='background-color:rgb(232,255,223,1);padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
                <td colspan="2">(API) AREA PLANEAMIENTO INCORPORADO (PGOU98)</td>                   
            </tr >`;
        codigo = `API/` + geojson.features[r].properties.codigo;
      } else {
        html =
          html +
          `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
            <tr  align="center"  style='background-color:#f0f8f9;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
                <td colspan="2">SUELO CLASIFICADO COMO URBANIZABLE EN PGOU98 QUE SE RECONOCE COMO SUELO URBANO POR EJECUCIÓN</td>                   
            </tr >`;
        codigo = `PLAN PARCIAL: ` + geojson.features[r].properties.codigo;
      }

      html =
        html +
        ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
              <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>CÓDIGO</LABEL></td>  
              <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${codigo}</td>                  
          </tr>
          <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
              <td colspan="2"> 
                <button id="btNormativa_API_PGOU98" 
                  style="padding:3px;font-size:9pt;font-family:Arial Black" 
                  class="ui-button ui-widget ui-corner-all" 
                  title="Información normativa asociada"
                  data-fid="${geojson.features[r].properties.fid}" 
                  data-table="api"
                  data-accion="normativa">
                  <i class="fa fa-info-circle"></i> Normativa
                </button>
              </td>      
          </tr>
          `;
    }
    html = html + `</TABLE><br>`;

    return html;
  }

  // Creación HTML de Unidades de ejecución

  async createHTML_unidad_ejecucion(geojson) {
    var html = "";

    html =
      html +
      `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
        <tr  align="center"  style='background-color:rgb(153,8,8,0.85);padding:3px;font-size:8.5pt;font-family:Arial BLACK;color:white;height:22px'>
            <td colspan="2">(UE) UNIDAD DE EJECUCIÓN (PGOU98)</td>                   
        </tr >`;

    for (var r = 0; r < geojson.features.length; r++) {
      let titulo = ``;
      if (geojson.features[r].properties.titulo)
        titulo = geojson.features[r].properties.titulo.toUpperCase();
      else titulo = `-`;
      html =
        html +
        ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>NOMBRE</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${titulo}</td>                  
        </tr> 
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>CODIGO</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.codigo}</td>                  
        </tr>
        <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
            <td colspan="2"> 
              <button id="btFicha_UE_PGOU98" 
                style="padding:3px;font-size:9pt;font-family:Arial Black" 
                class="ui-button ui-widget ui-corner-all" 
                title="Ficha del elemento"
                data-fid="${geojson.features[r].properties.fid}" 
                data-clase="UE_PGOU98">
                <i class="fa fa-info-circle"></i> Ficha
              </button>
              <button id="btNormativa_UE_PGOU98" 
                style="padding:3px;font-size:9pt;font-family:Arial Black" 
                class="ui-button ui-widget ui-corner-all" 
                title="Información normativa asociada"
                data-fid="${geojson.features[r].properties.fid}" 
                data-table="unidad_ejecucion"
                data-accion="normativa">
                <i class="fa fa-info-circle"></i> Normativa
              </button>
            </td>      
        </tr>
    `;
    }
    html = html + `</TABLE><br>`;

    return html;
  }

  // Creación HTML de Expediente PC Plan Espceial

  async createHTML_plan_especial(geojson) {
    geojson.features.sort((a, b) => a.properties.codigo - b.properties.codigo);
    var html = "";
    if (this.num_exp_PB == 0) {
      html =
        html +
        `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
          <tr  align="center"  style='background-color:rgb(102,102,102,1);padding:3px;font-size:8.5pt;font-family:Arial BLACK;color:white;height:22px'>
              <td colspan="2">PLANES ESPECIALES</td>                   
          </tr >`;

      this.num_exp_PB++;
    } else {
      html =
        html +
        ` <tr style='height:2px'>                 
        </tr>`;
    }

    for (var r = 0; r < geojson.features.length; r++) {
      if (r > 0)
        html =
          html +
          ` <tr style='height:2px'>                 
                                  </tr>`;

      var ruta =
        this.ruta_exp +
        "/PB-PLA_ESPECIAL/PB-" +
        geojson.features[r].properties.codigo +
        "/PB-" +
        geojson.features[r].properties.codigo.substring(0, 8) +
        "_PORTADA.pdf";

      var colorAplicable = "GREEN";
      var msgAplicable = "";
      if (geojson.features[r].properties.aplicable == "SI") {
        colorAplicable = "#1a4d1a";
        msgAplicable = "DE APLICACIÓN";
      }
      if (geojson.features[r].properties.aplicable == "NO") {
        colorAplicable = "#990000";
        msgAplicable = "NO ES DE APLICACIÓN";
      }
      if (geojson.features[r].properties.aplicable == "D") {
        colorAplicable = "GREY";
        msgAplicable = "-----------------------";
      }

      const reader = new DataReader();
      let isResource = await reader.checkURLAvailability(ruta);

      let isDoc = `<td align="center"><a href="${ruta}"  target="_blank" title="Informació del expedient" style='color:blue;font-family:Arial;font-size:8.5pt'>${geojson.features[r].properties.codigo}</a></td>`;
      if (isResource === false) {
        isDoc = `<td align="center" title="Informació del expedient" style='color:gray;font-family:Arial;font-size:8.5pt'>${geojson.features[r].properties.codigo} (Documentación no disponible)</a></td>`;
      }

      html =
        html +
        ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>PB - PLA ESPECIAL</LABEL></td>  
            ${isDoc}               
        </tr> 
        <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
        <td colspan="2"> 
            <LABEL style='text-align: justify;font-size:8.5pt;font-family:Arial;color:grey'>${geojson.features[r].properties.descripcio}</LABEL></td>      
        </tr>
       <tr align="center"  style='background-color:white;padding:3px;font-size:8.4pt;font-family:Arial Black;color:#660000;height:22px'>
         <td COLSPAN="2"><LABEL style='font-size:8.4pt;font-family:Arial;color:WHITE;background-color:${colorAplicable}'>${msgAplicable}</LABEL></td>
       </tr>`;
    }

    return html;
  }

  // Creación HTML de Expediente PC Plan Parcial

  async createHTML_plan_parcial(geojson) {
    geojson.features.sort((a, b) => a.properties.codigo - b.properties.codigo);
    var html = "";
    if (this.num_exp_PC == 0) {
      html =
        html +
        `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
						<tr  align="center"  style='background-color:rgb(102,102,102,1);padding:3px;font-size:8.5pt;font-family:Arial BLACK;color:white;height:22px'>
								<td colspan="2">PLANES PARCIALES</td>                   
						</tr >`;

      this.num_exp_PC++;
    } else {
      html =
        html +
        ` <tr style='height:2px'>                 
											</tr>`;
    }

    for (var r = 0; r < geojson.features.length; r++) {
      if (r > 0)
        html =
          html +
          ` <tr style='height:2px'>                 
											</tr>`;

      var ruta =
        this.ruta_exp +
        "/PC-PLA_PARCIAL/PC-" +
        geojson.features[r].properties.codigo +
        "/PC-" +
        geojson.features[r].properties.codigo.substring(0, 8) +
        "_PORTADA.pdf";

      var colorAplicable = "GREEN";
      var msgAplicable = "";
      if (geojson.features[r].properties.aplicable == "SI") {
        colorAplicable = "#1a4d1a";
        msgAplicable = "ES DE APLICACIÓN";
      }
      if (geojson.features[r].properties.aplicable == "NO") {
        colorAplicable = "#990000";
        msgAplicable = "NO ES DE APLICACIÓN";
      }
      if (geojson.features[r].properties.aplicable == "D") {
        colorAplicable = "GREY";
        msgAplicable = "-----------------------";
      }

      const reader = new DataReader();
      let isResource = await reader.checkURLAvailability(ruta);

      let isDoc = `<td align="center"><a href="${ruta}"  target="_blank" title="Informació del expedient" style='color:blue;font-family:Arial;font-size:8.5pt'>${geojson.features[r].properties.codigo}</a></td>`;
      if (isResource === false) {
        isDoc = `<td align="center" title="Informació del expedient" style='color:gray;font-family:Arial;font-size:8.5pt'>${geojson.features[r].properties.codigo} (Documentación no disponible)</a></td>`;
      }

      html =
        html +
        ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
											<td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>PC - PLAN PARCIAL</LABEL></td>  
											${isDoc}                
									</tr> 
									<tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
									<td colspan="2"> 
											<LABEL style='text-align: justify;font-size:8.5pt;font-family:Arial;color:grey'>${geojson.features[r].properties.descripcio}</LABEL></td>      
									</tr>
									<tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
                      <td COLSPAN="2"><LABEL style='font-size:8.4pt;font-family:Arial;color:WHITE;background-color:${colorAplicable}'>${msgAplicable}</LABEL>
                      </td>            
                  </tr>`;
    }

    return html;
  }

  // Creación HTML de categorias rústico PG2023

  async createHTML_categorias_rustico_PG2023(geojson) {
    var htmlr = "";

    for (var r = 0; r < geojson.features.length; r++) {
      var back_color = "213,180,60,0.5";
      var calificacion = geojson.features[r].properties.subcategoria;
      var calif_desc = geojson.features[r].properties.subcategoria_es;
      var descr = "";
      var color = "#4d4d4d";
      switch (geojson.features[r].properties.categoria) {
        case "AANP":
          back_color = "0,117,33,0.75";
          color = "white";
          descr = "Sòl Rústic Protegit";
          break;
        case "ANEI":
          back_color = "73,105,52,0.75";
          color = "white";
          descr = "Sòl Rústic Protegit";
          break;
        case "AIN":
          back_color = "151,176,74,0.75";
          descr = "Sòl Rústic Protegit";
          break;
        case "ARIP":
          back_color = "128,166,108,0.75";
          descr = "Sòl Rústic Protegit";
          calificacion = geojson.features[r].properties.zona;
          calif_desc = geojson.features[r].properties.zona_es;
          break;
        case "ZIP":
          back_color = "222,248,222,1";
          descr = "Sòl Rústic Protegit";
          break;
        case "APR":
          back_color = "255,185,120,0.9";
          descr = "Sòl Rústic Protegit (subjacent)";
          break;
        case "APT-C":
          back_color = "224,219,159,0.75";
          descr = "Sòl Rústic Protegit (subjacent)";
          break;
        case "AIA":
          back_color = "228,224,171,1";
          descr = "Sòl Rústic Comú";
          break;
        case "AT":
          back_color = "232,232,215,1";
          descr = "Sòl Rústic Comú";
          calificacion = geojson.features[r].properties.subcategoria;
          calif_desc = geojson.features[r].properties.subcategoria_;
          break;
        case "SRG":
          back_color = "242,242,194,0.75";
          descr = "Sòl Rústic Comú";
          calificacion = geojson.features[r].properties.categoria;
          calif_desc = geojson.features[r].properties.categoria_es;
          break;
        case "NR":
          back_color = "115,101,77,0.75";
          calificacion = geojson.features[r].properties.nom;
          calif_desc = geojson.features[r].properties.nom_;
          color = "white";
          descr = "Nucli Rural";
          break;
        default:
          back_color = "213,180,60,0.5";
          break;
      }

      htmlr =
        htmlr +
        `<TABLE style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
        <tr  align="center"  style='background-color:rgb(${back_color});color:${color};padding:3px;font-size:8.5pt;font-family:Arial Black;height:22px'>
            <td colspan="2">(${geojson.features[r].properties.categoria}) ${geojson.features[r].properties.categoria_es} (PG2023)</td>                   
        </tr >
        <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>
            <td colspan="2">${geojson.features[r].properties.calificacion_}</td>                   
        </tr>`;

      if (
        geojson.features[r].properties.nom_ != "-" &&
        geojson.features[r].properties.nom_ != null
      ) {
        htmlr =
          htmlr +
          `<tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
                   
            <td  colspan="2"><LABEL style='font-size:8pt;font-family:Arial black;color:GREY'>${geojson.features[r].properties.nom_}</td>                  
        </tr>

        `;
      }

      if (
        geojson.features[r].properties.tipo_es != "-" &&
        geojson.features[r].properties.tipo_es != null
      ) {
        htmlr =
          htmlr +
          `<tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
                   
            <td  colspan="2"><LABEL style='font-size:8pt;font-family:Arial black;color:GREY'>(${geojsonRES.features[r].properties.tipo_es})</td>                  
        </tr>

        `;
      }

      htmlr =
        htmlr +
        `
          <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
              <td><LABEL id="popup_titulo_calif" style='font-size:8pt;font-family:Arial Black;color:BLACK'>CALIFICACIÓN</LABEL></td>  
              <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${calificacion}</td>                  
          </tr>
          <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
              <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>DESCRIPCIÓN</LABEL></td>  
              <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${calif_desc}</td>                  
          </tr>
          <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>
              <td colspan="2">
                <button id="btNormativa_SR_PG2023" 
                  style="padding:3px;font-size:9pt;font-family:Arial Black" 
                  class="ui-button ui-widget ui-corner-all" 
                  title="Información normativa asociada"
                  data-fid="${geojson.features[r].properties.fid}" 
                  data-table="pg_rustic"
                  data-accion="normativa">
                  <i class="fa fa-info-circle"></i> Normativa
                </button>
            </td>  
          </tr>
          
      `;
    }
    htmlr = htmlr + `</TABLE><BR>`;

    return htmlr;
  }

  // Creación HTML de Catalogos actualización

  async createHTML_catalogos_actualizacion(geojson) {
    var html = "";

    html =
      html +
      `<TABLE  style='margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
                                <tr  align="center"  style='background-color:rgb(230,143,230,1);padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
                                    <td colspan="2">CATALOGO (PGOU98)</td>                   
                                </tr >`;

    for (var r = 0; r < geojson.features.length; r++) {
      const codigo =
        geojson.features[r].properties.proteccion +
        "/" +
        geojson.features[r].properties.codigo;

      if (r > 0)
        html =
          html +
          ` <tr style='height:2px'>                 
          </tr>`;

      html =
        html +
        ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>NOMBRE</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[
              r
            ].properties.denominacion.toUpperCase()}</td>                  
        </tr>
        
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>CODIGO</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${codigo}</td>                  
        </tr>
        <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
            <td colspan="2"> 
                <button style="padding:3px;font-size:9pt;font-family:Arial Black" class="ui-button ui-widget ui-corner-all" title="Ficha del elemento" value=${
                  geojson.features[r].properties.codigo
                } OnClick="fichaCAT_ACT(this)"><i class="fa fa-info-circle"></i> Ficha</button>

                <button id="btNormativa_CAT_ACT_PGOU98" 
                  style="padding:3px;font-size:9pt;font-family:Arial Black" 
                  class="ui-button ui-widget ui-corner-all" 
                  title="Información normativa asociada"
                  data-fid="${geojson.features[r].properties.fid}" 
                  data-table="catalogos_actualizacion"
                  data-accion="normativa">
                  <i class="fa fa-info-circle"></i> Normativa
                </button>
            </td>      
        </tr>
        `;
    }
    html = html + `</TABLE><br>`;

    return html;
  }

  // Creación HTML de Catalogos

  async createHTML_catalogos(geojson) {
    var html = "";

    html =
      html +
      `<TABLE  style='margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
                                <tr  align="center"  style='background-color:rgb(230,143,230,1);padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
                                    <td colspan="2">CATALOGO (PGOU98)</td>                   
                                </tr >`;

    for (var r = 0; r < geojson.features.length; r++) {
      var area = turf.area(geojson.features[r].geometry);
      area = area.toFixed(2) + " m2";

      const codigo =
        geojson.features[r].properties.proteccion +
        "/" +
        geojson.features[r].properties.codigo;

      if (r > 0)
        html =
          html +
          ` <tr style='height:2px'>                 
          </tr>`;

      html =
        html +
        ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>NOMBRE</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.denominacion}</td>                  
        </tr>
        
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>CODIGO</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${codigo}   (${area})</td>                  
        </tr>
        <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
            <td colspan="2"> 
              <button id="btFicha_CAT_PGOU98" 
                style="padding:3px;font-size:9pt;font-family:Arial Black" 
                class="ui-button ui-widget ui-corner-all" 
                title="Ficha del elemento"
                data-fid="${geojson.features[r].properties.fid}" 
                data-clase="CAT_PGOU98">
                <i class="fa fa-info-circle"></i> Ficha
              </button>

              <button id="btNormativa_CAT_PGOU98" 
                style="padding:3px;font-size:9pt;font-family:Arial Black" 
                class="ui-button ui-widget ui-corner-all" 
                title="Información normativa asociada"
                data-fid="${geojson.features[r].properties.fid}" 
                data-table="catalogos"
                data-accion="normativa">
                <i class="fa fa-info-circle"></i> Normativa
              </button>
            </td>      
        </tr>
        `;
    }
    html = html + `</TABLE><br>`;

    return html;
  }

  // Creación HTML de Zona Centro historico

  async createHTML_zona_centro_historico(geojson) {
    var htmlr = "";
    for (var r = 0; r < geojson.features.length; r++) {
      var back_color = "255,230,204,0.9";
      var tipo_zona = "";

      var tipo = geojson.features[r].properties.codigo.substring(0, 1);

      switch (tipo) {
        case "N":
          back_color = "255,230,204,0.9";
          tipo_zona = "PRESERVACIÓN AMBIENTAL N (PGOU98)";
          break;
        case "R":
          back_color = "255,230,204,0.9";
          tipo_zona = "PRESERVACIÓN ARQUITECTÓNICA AMBIENTAL R (PGOU98)";
          break;
      }

      htmlr =
        htmlr +
        `<TABLE style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
	 
		<thead  align="center"  style='background-color:rgb(${back_color});padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
				<td colspan="2">${tipo_zona}</td>                   
		</thead >`;

      htmlr =
        htmlr +
        `
				<tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
						<td><LABEL id="popup_titulo_calif" style='font-size:8pt;font-family:Arial Black;color:BLACK'>CALIFICACIÓN</LABEL></td>  
						<td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.codigo}</td>                  
				</tr>
				
				<tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>
				
						<td colspan="2"> 						
              <button id="btNormativa_NR_PGOU98" 
                style="padding:3px;font-size:9pt;font-family:Arial Black" 
                class="ui-button ui-widget ui-corner-all" 
                title="Información normativa asociada"
                data-fid="${geojson.features[r].properties.fid}" 
                data-table="zonas_centro_historico"
                data-accion="normativa">
                <i class="fa fa-info-circle"></i> Normativa
              </button>
						</td>  
				</tr>
				
		`;
    }
    htmlr = htmlr + `</TABLE><BR>`;

    return htmlr;
  }

  // Creación HTML de Zona Volumetria especifica

  async createHTML_zona_volumetria_especifica(geojson) {
    let htmlr = "";
    for (var r = 0; r < geojson.features.length; r++) {
      var back_color = "230,204,255,1";
      var tipo_zona = "VOLUMETRIA ESPECIFICA (PGOU98)";

      var tipo = geojson.features[r].properties.codigo.substring(0, 1);

      switch (tipo) {
        case "F":
          back_color = "rgb(215,239,239,1)";
          tipo_zona = "RESIDENCIAL/TERCIARIO (VE) (PGOU98)";
          break;
        case "E":
          back_color = "234,207,195,0.9";
          tipo_zona = "RESIDENCIAL (VE) (PGOU98)";
          break;
        case "S":
          back_color = "230,204,255,1";
          tipo_zona = "TERCIARIO (VE) (PGO98)";
          break;
      }

      const botonFicha = ` 
        <button id="btFicha_VE_PGOU98" 
          style="padding:3px;font-size:9pt;font-family:Arial Black" 
          class="ui-button ui-widget ui-corner-all" 
          title="Ficha parametros y condiciones de edificación"
          data-fid="${geojson.features[r].properties.fid}" 
          data-clase="VE_PGOU98">
          <i class="fa fa-info-circle"></i> Ficha
        </button>
				`;

      htmlr =
        htmlr +
        `<TABLE style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
	 
		<thead  align="center"  style='background-color:rgb(${back_color});padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
				<td colspan="2">${tipo_zona}</td>                   
		</thead >`;

      htmlr =
        htmlr +
        `
				<tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
						<td><LABEL id="popup_titulo_calif" style='font-size:8pt;font-family:Arial Black;color:BLACK'>CALIFICACIÓN</LABEL></td>  
						<td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.codigo}</td>                  
				</tr>
				
				<tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>
				
						<td colspan="2"> 
								${botonFicha}
								<button id="btNormativa_VE_PGOU98" 
                  style="padding:3px;font-size:9pt;font-family:Arial Black" 
                  class="ui-button ui-widget ui-corner-all" 
                  title="Información normativa asociada"
                  data-fid="${geojson.features[r].properties.fid}" 
                  data-table="zonasf"
                  data-accion="normativa">
                  <i class="fa fa-info-circle"></i> Normativa
                </button>
						</td>  
				</tr>
				
		`;
    }
    htmlr = htmlr + `</TABLE><BR>`;

    return htmlr;
  }

  // Creación HTML de Zona Terciaria

  async createHTML_zona_terciaria(geojson) {
    var htmlr = "";
    for (var r = 0; r < geojson.features.length; r++) {
      var back_color = "230,204,255,1";
      var tipo_zona = "";

      var tipo = geojson.features[r].properties.codigo.substring(0, 1);

      switch (tipo) {
        case "S":
          back_color = "230,204,255,1";
          tipo_zona = "TERCIARIO (COMERCIAL/ADMINISTRATIU) (PGO98)";
          break;
        case "T":
          back_color = "193,217,248,1";
          tipo_zona = "TURISTIC (PGOU98)";
          break;
      }

      this.botonFicha = `
        <button id="btFicha_TER_PGOU98" 
          style="padding:3px;font-size:9pt;font-family:Arial Black" 
          class="ui-button ui-widget ui-corner-all" 
          title="Ficha parametros y condiciones de edificación"
          data-fid="${geojson.features[r].properties.fid}" 
          data-clase="TER_PGOU98">
          <i class="fa fa-info-circle"></i> Ficha
        </button>
				`;

      htmlr =
        htmlr +
        `<TABLE style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
	 
		<thead  align="center"  style='background-color:rgb(${back_color});padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
				<td colspan="2">${tipo_zona}</td>                   
		</thead >`;

      htmlr =
        htmlr +
        `
				<tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
						<td><LABEL id="popup_titulo_calif" style='font-size:8pt;font-family:Arial Black;color:BLACK'>CALIFICACIÓN</LABEL></td>  
						<td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.codigo}</td>                  
				</tr>
				
				<tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>
				
						<td colspan="2"> 
								${this.botonFicha}
								<button id="btNormativa_TER_PGOU98" 
                  style="padding:3px;font-size:9pt;font-family:Arial Black" 
                  class="ui-button ui-widget ui-corner-all" 
                  title="Información normativa asociada"
                  data-fid="${geojson.features[r].properties.fid}" 
                  data-table="zona_terciaria"
                  data-accion="normativa">
                  <i class="fa fa-info-circle"></i> Normativa
                </button>
						</td>  
				</tr>
				
		`;
    }
    htmlr = htmlr + `</TABLE><BR>`;

    return htmlr;
  }

  // Creación HTML de Zona Secundaria

  async createHTML_zona_secundaria(geojson) {
    var htmlr = "";
    for (var r = 0; r < geojson.features.length; r++) {
      var back_color = "217,208,233,1";
      var tipo_zona = "INDUSTRIAL (PGOU98)";

      this.botonFicha = ` 
        <button id="btFicha_SEC_PGOU98" 
          style="padding:3px;font-size:9pt;font-family:Arial Black" 
          class="ui-button ui-widget ui-corner-all" 
          title="Ficha parametros y condiciones de edificación"
          data-fid="${geojson.features[r].properties.fid}" 
          data-clase="SEC_PGOU98">
          <i class="fa fa-info-circle"></i> Ficha
        </button>
				`;

      htmlr =
        htmlr +
        `<TABLE style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
	 
		<thead  align="center"  style='background-color:rgb(${back_color});padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
				<td colspan="2">${tipo_zona}</td>                   
		</thead >`;

      htmlr =
        htmlr +
        `
				<tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
						<td><LABEL id="popup_titulo_calif" style='font-size:8pt;font-family:Arial Black;color:BLACK'>CALIFICACIÓN</LABEL></td>  
						<td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.codigo}</td>                  
				</tr>
				
				<tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>
				
						<td colspan="2"> 
								${this.botonFicha}
								<button id="btNormativa_SEC_PGOU98" 
                  style="padding:3px;font-size:9pt;font-family:Arial Black" 
                  class="ui-button ui-widget ui-corner-all" 
                  title="Información normativa asociada"
                  data-fid="${geojson.features[r].properties.fid}" 
                  data-table="zona_secundaria"
                  data-accion="normativa">
                  <i class="fa fa-info-circle"></i> Normativa
                </button>
						</td>  
				</tr>
				
		`;
    }
    htmlr = htmlr + `</TABLE><BR>`;

    return htmlr;
  }

  // Creación HTML de Zona Residencial

  async createHTML_zona_residencial(geojson) {
    var htmlr = "";
    for (var r = 0; r < geojson.features.length; r++) {
      var back_color = "213,180,60,0.5";
      var tipo_zona = "RESIDENCIAL";

      switch (geojson.features[r].properties.agrupacion) {
        case "A":
        case "B":
        case "C":
        case "D":
        case "E":
        case "G":
        case "H":
        case "K":
          back_color = "234,207,195,0.9";
          tipo_zona = "RESIDENCIAL PLURIFAMILIAR (PGOU98)";
          break;
        case "I":
        case "J":
          back_color = "255,255,204,1";
          tipo_zona = "RESIDENCIAL UNIFAMILIAR (PGOU98)";
          break;
        default:
          back_color = "213,180,60,0.3";
          break;
      }

      const botonFicha = `
        <button id="btFicha_RSD_PGOU98" 
          style="padding:3px;font-size:9pt;font-family:Arial Black" 
          class="ui-button ui-widget ui-corner-all" 
          title="Ficha parametros y condiciones de edificación"
          data-fid="${geojson.features[r].properties.fid}" 
          data-clase="RSD_PGOU98">
          <i class="fa fa-info-circle"></i> Ficha
        </button>
				`;

      htmlr =
        htmlr +
        `<TABLE style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
	 
		<thead  align="center"  style='background-color:rgb(${back_color});padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
				<td colspan="2">${tipo_zona}</td>                   
		</thead >`;

      htmlr =
        htmlr +
        `
				<tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
						<td><LABEL id="popup_titulo_calif" style='font-size:8pt;font-family:Arial Black;color:BLACK'>CALIFICACIÓN</LABEL></td>  
						<td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.codigo}</td>                  
				</tr>
				
				<tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>
				
						<td colspan="2"> 
								${botonFicha}
								<button id="btNormativa_RSD_PGOU98" 
                  style="padding:3px;font-size:9pt;font-family:Arial Black" 
                  class="ui-button ui-widget ui-corner-all" 
                  title="Información normativa asociada"
                  data-fid="${geojson.features[r].properties.fid}" 
                  data-table="zona_residencial_1"
                  data-accion="normativa">
                  <i class="fa fa-info-circle"></i> Normativa
                </button>
						</td>  
				</tr>
				
		`;
    }
    htmlr = htmlr + `</TABLE><BR>`;

    return htmlr;
  }

  // Creación HTML de Equipamientos PRI

  async createHTML_sistema_equipamientos_PRI(geojson) {
    var html = "";

    html =
      html +
      `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
        <tr  align="center"  style='background-color:rgb(169,203,215,1);padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
            <td colspan="2">EQUIPAMIENTOS (PRI)</td>                   
        </tr >`;

    for (var r = 0; r < geojson.features.length; r++) {
      let tipo_sistema = "";
      if (geojson.features[r].properties.tipo_sistema == "SL")
        tipo_sistema = "(SISTEMA LOCAL)";
      if (geojson.features[r].properties.tipo_sistema == "SG")
        tipo_sistema = "(SISTEMA GENERAL)";

      html =
        html +
        ` <tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'> 
            <td COLSPAN="2"><LABEL style='font-size:7.5pt;font-family:Arial Black;color:#660000'>${tipo_sistema}</td>                  
        </tr>
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>DENOMINACIÓN</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[
              r
            ].properties.denominacion.toUpperCase()}</td>                  
        </tr>
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>CODIGO</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${
              geojson.features[r].properties.codigo
            }</td>                  
        </tr>
        <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
            <td colspan="2"> 
              <button id="btFicha_EQ_PRI" 
                style="padding:3px;font-size:9pt;font-family:Arial Black" 
                class="ui-button ui-widget ui-corner-all" 
                title="Ficha del elemento"
                data-fid="${geojson.features[r].properties.fid}" 
                data-clase="EQ_PRI">
                <i class="fa fa-info-circle"></i> Ficha
              </button>

              <button id="btNormativa_EQ_PRI" 
                style="padding:3px;font-size:9pt;font-family:Arial Black" 
                class="ui-button ui-widget ui-corner-all" 
                title="Información normativa asociada"
                data-fid="${geojson.features[r].properties.fid}" 
                data-table="pri_equipamientos"
                data-accion="normativa">
                <i class="fa fa-info-circle"></i> Normativa
              </button>
            </td>      
        </tr>
        `;
    }
    html = html + `</TABLE><br>`;

    return html;
  }

  // Creación HTML de Espacios libres PRI

  async createHTML_sistema_espacios_libres_PRI(geojson) {
    var html = "";

    html =
      html +
      `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
        <tr  align="center"  style='background-color:rgb(128,219,103,1);padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
            <td colspan="2">ESPACIO LIBRE (PRI)</td>                   
        </tr >`;

    for (var r = 0; r < geojson.features.length; r++) {
      let tipo_sistema = "";
      if (geojson.features[r].properties.tipo_sistema == "SL")
        tipo_sistema = "(SISTEMA LOCAL)";
      if (geojson.features[r].properties.tipo_sistema == "SG")
        tipo_sistema = "(SISTEMA GENERAL)";

      html =
        html +
        ` <tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'> 
            <td COLSPAN="2"><LABEL style='font-size:7.5pt;font-family:Arial Black;color:#660000'>${tipo_sistema}</td>                  
        </tr>
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>CODIGO</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.codigo}</td>                  
        </tr>
        <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
            <td colspan="2"> 
              <button id="btFicha_EL_PRI" 
                style="padding:3px;font-size:9pt;font-family:Arial Black" 
                class="ui-button ui-widget ui-corner-all" 
                title="Ficha del elemento"
                data-fid="${geojson.features[r].properties.fid}" 
                data-clase="EL_PRI">
                <i class="fa fa-info-circle"></i> Ficha
              </button>

              <button id="btNormativa_EL_PRI" 
                style="padding:3px;font-size:9pt;font-family:Arial Black" 
                class="ui-button ui-widget ui-corner-all" 
                title="Información normativa asociada"
                data-fid="${geojson.features[r].properties.fid}" 
                data-table="pri_sistema_espais_lliures_publics"
                data-accion="normativa">
                <i class="fa fa-info-circle"></i> Normativa
              </button>
            </td>      
        </tr>
        `;
    }
    html = html + `</TABLE><br>`;

    return html;
  }

  // Creación HTML de Sistema General de infraestructuras PG2023

  async createHTML_sistema_general_infraestructuras_PG2023(geojson) {
    var html = "";

    html =
      html +
      `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
        <tr  align="center"  style='background-color:rgb(230,230,230,1);padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
            <td colspan="2">INFRAESTRUCTURAS (PG2023)</td>                   
        </tr >
        <tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td colspan="2">(SISTEMA GENERAL)</td>                   
        </tr>`;

    for (var r = 0; r < geojson.features.length; r++) {
      html =
        html +
        ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>NOMBRE</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.nom}</td>                  
        </tr>
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>IDENTIFICANTE</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.identificant}</td>                  
        </tr>
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>CODIGO</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.codi}</td>                  
        </tr>
        <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
            <td colspan="2"> 
              <button id="btFicha_SGIF_PG2023" 
                style="padding:3px;font-size:9pt;font-family:Arial Black" 
                class="ui-button ui-widget ui-corner-all" 
                title="Ficha del elemento"
                data-fid="${geojson.features[r].properties.fid}" 
                data-clase="SGIF_PG2023">
                <i class="fa fa-info-circle"></i> Ficha
              </button>
              <button id="btNormativa_SGIF_PG2023" 
                style="padding:3px;font-size:9pt;font-family:Arial Black" 
                class="ui-button ui-widget ui-corner-all" 
                title="Información normativa asociada"
                data-fid="${geojson.features[r].properties.fid}" 
                data-table="pg_dotac_sg_if"
                data-accion="normativa">
                <i class="fa fa-info-circle"></i> Normativa
              </button>
            </td>      
        </tr>
        `;
    }
    html = html + `</TABLE><br>`;

    return html;
  }

  // Creación HTML de Sistema General de servicios urbanos PG2023

  async createHTML_sistema_general_servicios_urbanos_PG2023(geojson) {
    var html = "";

    html =
      html +
      `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
        <tr  align="center"  style='background-color:rgb(230,230,230,1);padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
            <td colspan="2">SERVICIOS URBANOS (PG2023)</td>                   
        </tr >
        <tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td colspan="2">(SISTEMA GENERAL)</td>                   
        </tr>`;

    for (var r = 0; r < geojson.features.length; r++) {
      html =
        html +
        ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>NOMBRE</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.nom}</td>                  
        </tr>
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>IDENTIFICANTE</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.identificant}</td>                  
        </tr>
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>CODIGO</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.codi}</td>                  
        </tr>
        <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
            <td colspan="2"> 
              <button id="btFicha_SGSU_PG2023" 
                style="padding:3px;font-size:9pt;font-family:Arial Black" 
                class="ui-button ui-widget ui-corner-all" 
                title="Ficha del elemento"
                data-fid="${geojson.features[r].properties.fid}" 
                data-clase="SGSU_PG2023">
                <i class="fa fa-info-circle"></i> Ficha
              </button>
              <button id="btNormativa_SGSU_PG2023" 
                style="padding:3px;font-size:9pt;font-family:Arial Black" 
                class="ui-button ui-widget ui-corner-all" 
                title="Información normativa asociada"
                data-fid="${geojson.features[r].properties.fid}" 
                data-table="pg_dotac_sg_su"
                data-accion="normativa">
                <i class="fa fa-info-circle"></i> Normativa
              </button>
            </td>      
        </tr>
        `;
    }
    html = html + `</TABLE><br>`;

    return html;
  }

  // Creación HTML de Sistema General de comunicaciones PG2023

  async createHTML_sistema_general_comunicaciones_PG2023(geojson) {
    var html = "";

    html =
      html +
      `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
        <tr  align="center"  style='background-color:rgb(230,230,230,1);padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
            <td colspan="2">COMUNICACIONES (PG2023)</td>                   
        </tr >
        <tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td colspan="2">(SISTEMA GENERAL)</td>                   
        </tr>`;

    for (var r = 0; r < geojson.features.length; r++) {
      html =
        html +
        ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>NOMBRE</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.nom}</td>                  
        </tr>
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>IDENTIFICANTE</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.identificant}</td>                  
        </tr>
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>CODIGO</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.codi}</td>                  
        </tr>
        <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
            <td colspan="2"> 
              <button id="btFicha_SGCM_PG2023" 
                style="padding:3px;font-size:9pt;font-family:Arial Black" 
                class="ui-button ui-widget ui-corner-all" 
                title="Ficha del elemento"
                data-fid="${geojson.features[r].properties.fid}" 
                data-clase="SGCM_PG2023">
                <i class="fa fa-info-circle"></i> Ficha
              </button>
              <button id="btNormativa_SGCM_PG2023" 
                style="padding:3px;font-size:9pt;font-family:Arial Black" 
                class="ui-button ui-widget ui-corner-all" 
                title="Información normativa asociada"
                data-fid="${geojson.features[r].properties.fid}" 
                data-table="pg_dotac_sg_cm"
                data-accion="normativa">
                <i class="fa fa-info-circle"></i> Normativa
              </button>
            </td>      
        </tr>
        `;
    }
    html = html + `</TABLE><br>`;

    return html;
  }

  // Creación HTML de Sistema General de espacios libres PG2023

  async createHTML_sistema_general_espacios_libres_PG2023(geojson) {
    var html = "";

    html =
      html +
      `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
        <tr  align="center"  style='background-color:rgb(128,219,123,1);padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
            <td colspan="2">ESPACIOS LIBRES (PG2023)</td>                   
        </tr >
        <tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td colspan="2">(SISTEMA GENERAL)</td>                   
        </tr>`;

    for (var r = 0; r < geojson.features.length; r++) {
      html =
        html +
        ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>NOMBRE</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.nom}</td>                  
        </tr>
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>IDENTIFICANTE</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.identificant}</td>                  
        </tr>
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>CODIGO</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.codi}</td>                  
        </tr>
        <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
            <td colspan="2"> 
              <button id="btFicha_SGEL_PG2023" 
                style="padding:3px;font-size:9pt;font-family:Arial Black" 
                class="ui-button ui-widget ui-corner-all" 
                title="Ficha del elemento"
                data-fid="${geojson.features[r].properties.fid}" 
                data-clase="SGEL_PG2023">
                <i class="fa fa-info-circle"></i> Ficha
              </button>
              <button id="btNormativa_SGEL_PG2023" 
                style="padding:3px;font-size:9pt;font-family:Arial Black" 
                class="ui-button ui-widget ui-corner-all" 
                title="Información normativa asociada"
                data-fid="${geojson.features[r].properties.fid}" 
                data-table="pg_dotac_sg_el"
                data-accion="normativa">
                <i class="fa fa-info-circle"></i> Normativa
              </button>
            </td>      
        </tr>
        `;
    }
    html = html + `</TABLE><br>`;

    return html;
  }

  // Creación HTML de Sistema General de equipamientos PG2023

  async createHTML_sistema_general_equipamientos_PG2023(geojson) {
    var html = "";

    html =
      html +
      `<TABLE  style='margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
        <tr  align="center"  style='background-color:rgb(169,203,215,1);padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
            <td colspan="2"> EQUIPAMIENTO COMUNITARIO (PG2023)</td>                   
        </tr >
        <tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td colspan="2">(SISTEMA GENERAL)</td>                   
        </tr>`;

    for (var r = 0; r < geojson.features.length; r++) {
      html =
        html +
        ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>NOMBRE</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.nom}</td>                  
        </tr>
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>IDENTIFICANTE</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.identificant}</td>                  
        </tr>
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>CODIGO</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.codi}</td>                  
        </tr>
        <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
            <td colspan="2"> 

              <button id="btFicha_SGEQ_PG2023" 
                style="padding:3px;font-size:9pt;font-family:Arial Black" 
                class="ui-button ui-widget ui-corner-all" 
                title="Ficha del elemento"
                data-fid="${geojson.features[r].properties.fid}" 
                data-clase="SGEQ_PG2023">
                <i class="fa fa-info-circle"></i> Ficha
              </button>

              <button id="btNormativa_SGEQ_PG2023" 
                style="padding:3px;font-size:9pt;font-family:Arial Black" 
                class="ui-button ui-widget ui-corner-all" 
                title="Información normativa asociada"
                data-fid="${geojson.features[r].properties.fid}" 
                data-table="pg_dotac_sg_eq"
                data-accion="normativa">
                <i class="fa fa-info-circle"></i> Normativa
              </button>
            </td>      
        </tr>
    `;
    }
    html = html + `</TABLE><br>`;

    return html;
  }

  // Creación HTML de Sistema General de comunicaciones e infraestruturas

  async createHTML_sistema_general_comunicaciones_infraestructuras(geojson) {
    var html = "";

    html =
      html +
      `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
        <tr  align="center"  style='background-color:rgb(230,230,230,1);padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
            <td colspan="2">COMUNICACIONES E INFRAESTRUCTURAS (PGOU98)</td>                   
        </tr >
        <tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td colspan="2">(SISTEMA GENERAL)</td>                   
        </tr>`;

    for (var r = 0; r < geojson.features.length; r++) {
      html =
        html +
        ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>NOMBRE</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.denominaci}</td>                  
        </tr>
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>IDENTIFICANTE</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.identif}</td>                  
        </tr>
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>CODIGO</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.codigo}</td>                  
        </tr>
        <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
            <td colspan="2"> 
              <button id="btFicha_SGCI_PGOU98" 
                style="padding:3px;font-size:9pt;font-family:Arial Black" 
                class="ui-button ui-widget ui-corner-all" 
                title="Ficha del elemento"
                data-fid="${geojson.features[r].properties.fid}" 
                data-clase="SGCI_PGOU98">
                <i class="fa fa-info-circle"></i> Ficha
              </button>
              <button id="btNormativa_SGCI_PGOU98" 
                style="padding:3px;font-size:9pt;font-family:Arial Black" 
                class="ui-button ui-widget ui-corner-all" 
                title="Información normativa asociada"
                data-fid="${geojson.features[r].properties.fid}" 
                data-table="sgeneral_comunicaciones_infraestructuras"
                data-accion="normativa">
                <i class="fa fa-info-circle"></i> Normativa
              </button>
            </td>      
        </tr>
        `;
    }
    html = html + `</TABLE><br>`;

    return html;
  }

  async createHTML_sistema_local_comunicaciones_infraestructuras(geojson) {
    var html = "";

    html =
      html +
      `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
          <tr  align="center"  style='background-color:rgb(230,230,230,1);padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
              <td colspan="2">COMUNICACIONES/INFRAESTRUCTURES (PGOU98)</td>                   
          </tr >
          <tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
              <td colspan="2">(SISTEMA LOCAL)</td>                   
          </tr>`;

    for (var r = 0; r < geojson.features.length; r++) {
      html =
        html +
        ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
              <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>NOMBRE</LABEL></td>  
              <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.denominaci}</td>                  
          </tr>
          <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
              <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>IDENTIFICANTE</LABEL></td>  
              <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.identif}</td>                  
          </tr>
          <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
              <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>CODIGO</LABEL></td>  
              <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.codigo}</td>                  
          </tr>
          <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
              <td colspan="2"> 
                <button id="btFicha_SLCI_PGOU98" 
                  style="padding:3px;font-size:9pt;font-family:Arial Black" 
                  class="ui-button ui-widget ui-corner-all" 
                  title="Ficha del elemento"
                  data-fid="${geojson.features[r].properties.fid}" 
                  data-clase="SLCI_PGOU98">
                  <i class="fa fa-info-circle"></i> Ficha
                </button>

                <button id="btNormativa_SLCI_PGOU98" 
                  style="padding:3px;font-size:9pt;font-family:Arial Black" 
                  class="ui-button ui-widget ui-corner-all" 
                  title="Información normativa asociada"
                  data-fid="${geojson.features[r].properties.fid}" 
                  data-table="slocal_comunicaciones_infraestructuras"
                  data-accion="normativa">
                  <i class="fa fa-info-circle"></i> Normativa
                </button>
              </td>      
          </tr>
          `;
    }
    html = html + `</TABLE><br>`;

    return html;
  }

  // Creación HTML de Sistema general de espacios libres
  async createHTML_sistema_general_espacios_libres(geojson) {
    var html = "";

    html =
      html +
      `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
          <tr  align="center"  style='background-color:rgb(128,219,123,1);padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
              <td colspan="2">ESPACIOS LIBRES (PGOU98)</td>                   
          </tr >
          <tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
              <td colspan="2">(SISTEMA GENERAL)</td>                   
          </tr>`;

    for (var r = 0; r < geojson.features.length; r++) {
      html =
        html +
        ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
              <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>NOMBRE</LABEL></td>  
              <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.denominaci}</td>                  
          </tr>
          <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
              <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>IDENTIFICANTE</LABEL></td>  
              <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.identif}</td>                  
          </tr>
          <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
              <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>CODIGO</LABEL></td>  
              <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.codigo}</td>                  
          </tr>
          <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
              <td colspan="2"> 
                <button id="btFicha_SGEL_PGOU98" 
                  style="padding:3px;font-size:9pt;font-family:Arial Black" 
                  class="ui-button ui-widget ui-corner-all" 
                  title="Ficha del elemento"
                  data-fid="${geojson.features[r].properties.fid}" 
                  data-clase="SGEL_PGOU98">
                  <i class="fa fa-info-circle"></i> Ficha
                </button>

                <button id="btNormativa_SGEL_PGOU98" 
                  style="padding:3px;font-size:9pt;font-family:Arial Black" 
                  class="ui-button ui-widget ui-corner-all" 
                  title="Información normativa asociada"
                  data-fid="${geojson.features[r].properties.fid}" 
                  data-table="sgeneral_espacioslibres"
                  data-accion="normativa">
                  <i class="fa fa-info-circle"></i> Normativa
                </button>
              </td>      
          </tr>
          `;
    }
    html = html + `</TABLE><br>`;

    return html;
  }

  // Creación HTML de Sistema local de espacios libres

  async createHTML_sistema_local_espacios_libres(geojson) {
    var html = "";
    html =
      html +
      `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
        <tr  align="center"  style='background-color:rgb(128,219,123,1);padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
            <td colspan="2">ESPACIO LIBRE PÚBLICO (PGOU98)</td>                   
        </tr >
        <tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td colspan="2">(SISTEMA LOCAL)</td>                   
        </tr>`;

    for (var r = 0; r < geojson.features.length; r++) {
      html =
        html +
        ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>NOMBRE</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.denominaci}</td>                  
        </tr>
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>IDENTIFICANTE</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.identif}</td>                  
        </tr>
        <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
            <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>CODIGO</LABEL></td>  
            <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.codigo}</td>                  
        </tr>
        <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
            <td colspan="2">
              <button id="btFicha_SLEL_PGOU98" 
                style="padding:3px;font-size:9pt;font-family:Arial Black" 
                class="ui-button ui-widget ui-corner-all" 
                title="Ficha del elemento"
                data-fid="${geojson.features[r].properties.fid}" 
                data-clase="SLEL_PGOU98">
                <i class="fa fa-info-circle"></i> Ficha
              </button>

              <button id="btFicha_SLEL_PGOU98" 
                style="padding:3px;font-size:9pt;font-family:Arial Black" 
                class="ui-button ui-widget ui-corner-all" 
                title="Información normativa asociada"
                data-fid="${geojson.features[r].properties.fid}" 
                data-table="slocal_espacioslibres_publicos"
                data-accion="normativa">
                <i class="fa fa-info-circle"></i> Normativa
              </button>
            </td>      
        </tr>
        `;
    }
    html = html + `</TABLE><br>`;

    return html;
  }

  // Creación HTML de Sistema general de equipamientos PGOU98

  async createHTML_sistema_general_equipamientos(geojson) {
    var html = "";

    html =
      html +
      `<TABLE  style='margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
          <tr  align="center"  style='background-color:rgb(169,203,215,1);padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
              <td colspan="2"> EQUIPAMIENTO COMUNITARIO (PGOU98)</td>                   
          </tr >
          <tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
              <td colspan="2">(SISTEMA GENERAL)</td>                   
          </tr>`;

    for (var r = 0; r < geojson.features.length; r++) {
      html =
        html +
        ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
              <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>NOMBRE</LABEL></td>  
              <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.denominaci}</td>                  
          </tr>
          <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
              <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>IDENTIFICANTE</LABEL></td>  
              <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.identif}</td>                  
          </tr>
          <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
              <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>CODIGO</LABEL></td>  
              <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.codigo}</td>                  
          </tr>
          <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>  
              <td colspan="2"> 
                <button id="btFicha_SGEQ_PGOU98" 
                  style="padding:3px;font-size:9pt;font-family:Arial Black" 
                  class="ui-button ui-widget ui-corner-all" 
                  title="Ficha del elemento"
                  data-fid="${geojson.features[r].properties.fid}" 
                  data-clase="SGEQ_PGOU98">
                  <i class="fa fa-info-circle"></i> Ficha
                </button>

                <button id="btNormativa_SGEQ_PGOU98" 
                  style="padding:3px;font-size:9pt;font-family:Arial Black" 
                  class="ui-button ui-widget ui-corner-all" 
                  title="Información normativa asociada"
                  data-fid="${geojson.features[r].properties.fid}" 
                  data-table="sgeneral_equipamientos"
                  data-accion="normativa">
                  <i class="fa fa-info-circle"></i> Normativa
                </button>
              </td>      
          </tr>
      `;
    }
    html = html + `</TABLE><br>`;

    return html;
  }

  // Creación HTML de Sistema local de equipamientos

  async createHTML_sistema_local_equipamientos(geojson) {
    var html = "";

    html =
      html +
      `<TABLE  style='margin-top: 0px;margin-bottom: 0px;margin-right: 0px;margin-left: 0px;padding:0px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:50px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
          <tr  align="center"  style='background-color:rgb(169,203,215,1);padding:3px;font-size:8.5pt;font-family:Arial Black;color:#4d4d4d;height:22px'>
              <td colspan="2"> EQUIPAMIENTO COMUNITARIO (PGOU98)</td>                   
          </tr >
          <tr align="center"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
              <td colspan="2">(SISTEMA LOCAL)</td>                   
          </tr>`;

    for (var r = 0; r < geojson.features.length; r++) {
      html =
        html +
        ` <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
                        <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>NOMBRE</LABEL></td>  
                        <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.denominaci}</td>                  
          </tr>
          <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
              <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>IDENTIFICANTE</LABEL></td>  
              <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.identif}</td>                  
          </tr>
          <tr align="left"  style='background-color:white;padding:3px;font-size:7.7pt;font-family:Arial Black;color:#660000;height:22px'>
              <td><LABEL style='font-size:8pt;font-family:Arial Black;color:BLACK'>CODIGO</LABEL></td>  
              <td><LABEL style='font-size:8pt;font-family:Arial;color:BLACK'>${geojson.features[r].properties.codigo}</td>                  
          </tr>
          <tr align="center"  style='background-color:white;padding:3px;font-size:8.5pt;font-family:Arial Black;color:#660000;height:22px'>          
              <td colspan="2"> 
                <button id="btFicha_SLEQ_PGOU98" 
                  style="padding:3px;font-size:9pt;font-family:Arial Black" 
                  class="ui-button ui-widget ui-corner-all" 
                  title="Ficha del elemento"
                  data-fid="${geojson.features[r].properties.fid}" 
                  data-clase="SLEQ_PGOU98">
                  <i class="fa fa-info-circle"></i> Ficha
                </button>

                <button id="btNormativa_SLEQ_PGOU98" 
                  style="padding:3px;font-size:9pt;font-family:Arial Black" 
                  class="ui-button ui-widget ui-corner-all" 
                  title="Información normativa asociada"
                  data-fid="${geojson.features[r].properties.fid}" 
                  data-table="slocal_equipamientos"
                  data-accion="normativa">
                  <i class="fa fa-info-circle"></i> Normativa
                </button>
						</td>     
          </tr>
          `;
    }
    html = html + `</TABLE><br>`;

    return html;
  }
}
