/**
 * Clase para manejar internacionalización (i18n) en la aplicación.
 * @memberof module:Frontend
 */
class I18nHandler {
  /**
   * Crea una instancia de I18nHandler e inicializa la configuración de internacionalización.
   */
  constructor() {
    this.initialize();
  }

  /**
   * Inicializa la configuración de internacionalización.
   * Esta función debe llamarse en el constructor para configurar el idioma y recursos.
   */
  initialize() {
    i18next.init({
      lng: "es", // Idioma por defecto
      resources: {
        es: {
          translation: {
            toc_mapas_base: "MAPAS BASE",
            toc_ordenacion: "ORDENACIÓN",
            toc_consultas: "CONSULTAS",
            deleteSelectedConsultas: "BORRAR SELECIONADOS",
            download_select_consultas: "Descarga en formato geojson",
            tree_ord_root: "Plan General 2023 + POD(PGOU98+PRI)",
            tree_categorias_rustico: "Categorias rústico (PG2023)",
            tree_calificaciones: "Calificaciones",
            tree_ambitos: "Ámbitos",
            tree_aprobacion_inicial: "Ultimas aprobaciones iniciales",
            tree_PGOU98: "Plan General 1998",
            tree_PRI: "(PRI) Playa de Palma",
            tree_PG2023: "Plan General 2023",
            tree_AANP:
              "(AANP) Areas naturales de especial interés de alto nivel de protección",
            tree_ANEI: "(ANEI) Áreas naturales de especial interés",
            tree_AIN_PG:
              "(AIN-PG) Áreas de interés natural por planeamiento general",
            tree_ZIP:
              "(ZIP) Zonas de Interés pasajistico protegidas por planeamiento general",
            tree_ARIP: "(ARIP) Áreas rurales de interés paisajístico",
            tree_SRG: "(SRG) Áreas de suelo rústico de régimen general",
            tree_AIA: "(AIA) Áreas de interés agrario",
            tree_AT_H: "(AT-H) Áreas de transición, de armonización",
            tree_NR: "(NR) Núcleo rural",
            tree_RSD_A: "(A) Residencial Plurifamiliar Ensanche. AV-MC.V.",
            tree_RSD_B:
              "(B) Residencial Plurifamiliar Ensanche Periférico. AV-MC.V.",
            tree_RSD_C: "(C) Residencial Plurifamiliar Ejes Cívicos. AV-MC.V.",
            tree_RSD_D:
              "(D) Residencial Plurifamiliar en manzana cerrada retranqueada. AV-MC.R.",
            tree_RSD_E:
              "(E) Residencial Plurifamiliar Ordenación Abierta. RP.A.",
            tree_VOL:
              "(F) Ordenación volumétrica específica (residencial plurifamiliar o terciario. VE)",
            tree_RSD_G:
              "(G) Residencial Plurifamiliar con tipologías mixtas. RP. S.",
            tree_RSD_H:
              "(H) Residencial Plurifamiliar MC retranqueado con porches. AV-MC.R.",
            tree_RSD_I:
              "(I) Residencial Unifamiliar aislada de baja densidad. RP.A.",
            tree_RSD_J: "(J) Residencial Unifamiliar Suburbana. RP.S.",
            tree_RSD_K:
              "(K) Residencial Unifamiliar entre medianeras. AV-MC.R.",
            tree_SEC_L:
              "(L) Industrial. Uso productivo en trama residencial. RP.A.",
            tree_SEC_M:
              "(M) Industrial. Uso productivo en polígonos industriales. RP.A.",
            tree_PROT_N: "(N) Preservación ambiental N.",
            tree_PROT_R: "(R) Preservación arquitectónica ambiental R.",
            tree_TER_S:
              "(S) Terciario en edificación aislada (Comercial/Administrativo). RP.A.",
            tree_TER_T: "(T) Turístico en edificación aislada. RP.A.",
            tree_SIST: "Sistemas dotacionales",
            tree_EL0: "(EL0) Espacio Libre Privado",
            tree_CAT: "(CAT) Catálogos",
            tree_r: "(r) Preservación",
            tree_CAR_INF: "Carencia de Infraestructuras",
            tree_PASAJE: "Pasaje",
            tree_NOVA_AL: "Nueva Alineación",
            tree_PE: "Profundidad edificable",
            tree_SEP_CALIF: "Separación calificación",
            tree_SEP_ALT: "Separación altura",
            tree_SLEC_PGOU98: "(SLEC) Equipamiento Comunitario (S.Local)",
            tree_SLEL_PGOU98: "(SLEL) Espai Lliure (S.Local)",
            tree_SLCI_PGOU98:
              "(SLCI) Comunicaciones e infraestructuras (S.Local)",
            tree_SGEC_PGOU98: "(SGEC) Equipamiento Comunitario (S.General)",
            tree_SGEL_PGOU98: "(SGEL) Espacio Libre (S.General)",
            tree_SGCI_PGOU98:
              "(SGCI) Comunicaciones e infraestructuras (S.General)",
            tree_PRI_D: "(PRI_D) Edificación residencial entre medianeras",
            tree_PRI_E: "(PRI_E) Vivienda edificación abierta",
            tree_PRI_I: "(PRI_I) Vivienda Unifamiliar aislada",
            tree_PRI_VA: "(PRI_VA) Vivienda adosada",
            tree_PRI_VT: "(PRI_VT) Vivienda Tradicional",
            tree_PRI_S: "(PRI_S) Comercial / Servicios",
            tree_PRI_T: "(PRI_T) Turístico",
            tree_PRI_TH: "(PRI_TH) Turístico hotelero",
            tree_PRI_EQ: "(EQ) Equipaments comunitaris",
            tree_PRI_EL: "(EL) Espacios libres",
            catastro: "Catastro (Oficina Virtual)",
            orto_actual: "(PNOA) OrtoImagen mas actual",
            nacional_1981_1986: "Vuelo Nacional (1981-1986)",
            orto_ams_1956: "Vuelo Americano Serie B (1956-1957)",
            label_opacidad_ordenacion: "OPACIDAD",
            popup_titulo_calif: "CALIFICACIÓN",
            popup_situacion: "SITUACIÓN",
            ir_catastro: "Ir Sede electronica catastro",
            ir_streetview: "Ir a Street view",
            popup_titulo_catastro: "REF. CATASTRAL",
            popup_boton_ficha_rsd: "Ficha",
            boton_ficha_rsd_tip:
              "Ficha parametros y condiciones de edificación",
            popup_boton_normativa: "Información normativa asociada",
            popup_historico_exp: "HISTORICO EXPEDIENTES",
            boton_normativa_su: "Normativa Común en Suelo Urbano",
            form_rsd_calif: "CALIFICACIÓN",
            form_rsd_supmin: "SUPERFICIE MÍNIMA DE PARCELA EN METROS",
            form_rsd_anchmin: "ANCHO MÍNIMO DE PARCELA EN METROS"
          },
        },
        ca: {
          translation: {
            toc_mapas_base: "MAPES BASE",
            toc_ordenacion: "ORDENACIÓ",
            toc_consultas: "CONSULTES",
            deleteSelectedConsultas: "ESBORRAR SELECCIONATS",
            download_select_consultas: "Descàrrega en format geojson",
            tree_ord_root: "Pla General 2023 + POD(PGOU98+PRI)",
            tree_categorias_rustico: "Categories rústic (PG2023)",
            tree_calificaciones: "Qualificacions",
            tree_ambitos: "Àmbits",
            tree_aprobacion_inicial: "Últimes aprovacions inicials",
            tree_PGOU98: "Pla General 1998",
            tree_PRI: "(PRI) Platja de Palma",
            tree_PG2023: "Pla General 2023",
            tree_AANP:
              "(AANP) Àrees naturals d'especial interès d'alt nivell de protecció",
            tree_ANEI: "(ANEI) Àrees naturals d`especial interès",
            tree_AIN_PG:
              "(AIN-PG) Àrees d`interes natural per planejament general",
            tree_ZIP:
              "(ZIP) Zones de Interés pasajistic protegides per planejament general",
            tree_ARIP: "(ARIP) Àrees rurals d`interès paisatgistic",
            tree_SRG: "(SRG) Àrees de sòl rústic de regim general",
            tree_AIA: "(AIA) Àrees de interes agrari",
            tree_AT_H: "(AT-H) Àrees de transició, d´harmonització",
            tree_NR: "(NR) Nucli rural",
            tree_RSD_A: "(A) Residencial Plurifamiliar Eixample. AV-MC.V.",
            tree_RSD_B:
              "(B) Residencial Plurifamiliar Eixample Perifèric. AV-MC.V.",
            tree_RSD_C: "(C) Residencial Plurifamiliar Eixos Cívics. AV-MC.V.",
            tree_RSD_D:
              "(D) Residencial Plurifamiliar en illa tancada reculada. AV-MC.R.",
            tree_RSD_E: "(E) Residencial Plurifamiliar Ordenació Oberta. RP.A.",
            tree_VOL:
              "(F) Ordenació volumètrica específica (residencial plurifamiliar o terciari. VE)",
            tree_RSD_G:
              "(G) Residencial Plurifamiliar amb tipologies mixtes. RP. S.",
            tree_RSD_H:
              "(H) Residencial Plurifamiliar MC reculada amb porxos. AV-MC.R.",
            tree_RSD_I:
              "(I) Residencial Unifamiliar aïllada de baixa densitat. RP.A.",
            tree_RSD_J: "(J) Residencial Unifamiliar Suburbana. RP.S.",
            tree_RSD_K: "(K) Residencial Unifamiliar entre mitgeres. AV-MC.R.",
            tree_SEC_L:
              "(L) Industrial. Ús productiu en trama residencial. RP.A.",
            tree_SEC_M:
              "(M) Industrial. Ús productiu en Polígons Industrials. RP.A.",
            tree_PROT_N: "(N) Preservació ambiental N.",
            tree_PROT_R: "(R) Preservació arquitectònica ambiental R.",
            tree_TER_S:
              "(S) Terciari en edificació aïllada (Comercial/Administratiu). RP.A.",
            tree_TER_T: "(T) Turístic en edificació aïllada. RP.A.",
            tree_SIST: "Sistemes dotacionals",
            tree_EL0: "(EL0) Espai Lliure Privat",
            tree_CAT: "(CAT) Catalegs",
            tree_r: "(r) Preservació",
            tree_CAR_INF: "Manca d'infraestructures",
            tree_PASAJE: "Pasatge",
            tree_NOVA_AL: "Nova Alineació",
            tree_PE: "Profunditat edificable",
            tree_SEP_CALIF: "Separació qualificació",
            tree_SEP_ALT: "Separació alçada",
            tree_SLEC_PGOU98: "(SLEC) Equipament Comunitari (S.Local)",
            tree_SLEL_PGOU98: "(SLEL) Espai Lliure (S.Local)",
            tree_SLCI_PGOU98:
              "(SLCI) Comunicacions i infraestructures (S.Local)",
            tree_SGEC_PGOU98: "(SGEC) Equipament Comunitari (S.General)",
            tree_SGEL_PGOU98: "(SGEL) Espai Lliure (S.General)",
            tree_SGCI_PGOU98:
              "(SGCI) Comunicacions i infraestructures (S.General)",
            tree_PRI_D: "(PRI_D) Edificació residencial entre mitgeres",
            tree_PRI_E: "(PRI_E) Habitatge edificació oberta",
            tree_PRI_I: "(PRI_I) Habitatge Unifamiliar aïllat",
            tree_PRI_VA: "(PRI_VA) Habitatge adossat",
            tree_PRI_VT: "(PRI_VT) Habitatge Tradicional",
            tree_PRI_S: "(PRI_S) Comercial / Serveis",
            tree_PRI_T: "(PRI_T) Turístic",
            tree_PRI_TH: "(PRI_TH) Turístic hoteler",
            tree_PRI_EQ: "(EQ) Equipaments comunitaris",
            tree_PRI_EL: "(EL) Espais lliures",
            catastro: "Cadastre (Oficina Virtual)",
            orto_actual: "(PNOA) OrtoImatge més actual",
            nacional_1981_1986: "Vol Nacional (1981-1986)",
            orto_ams_1956: "Vol Americà Sèrie B (1956-1957)",
            label_opacidad_ordenacion: "OPACITAT",
            popup_titulo_calif: "QUALIFICACIÓ",
            popup_situacion: "SITUACIÓ",
            ir_catastro: "Anar Seu electrònica cadastre",
            ir_streetview: "Anar a Street view",
            popup_titulo_catastro: "REF. CADASTRAL",
            popup_boton_ficha_rsd: "Fitxa",
            boton_ficha_rsd_tip: "Fitxa paràmetres i condicions d'edificació",
            popup_boton_normativa: "Informació normativa associada",
            popup_historico_exp: "HISTÒRIC EXPEDIENTS",
            boton_normativa_su: "Normativa Comú a Sòl Urbà",
            form_rsd_calif: "CALIFICACIÓ",
            form_rsd_supmin: "SUPERFICIE MÍNIMA DE PARCEL·LA EN METRES",
            form_rsd_anchmin: "AMPLADA MÍNIMA DE PARCEL·LA EN METRES"
          },
        },
      },
    });
  }

  changeLanguage(lng) {
    i18next.changeLanguage(lng);
    this.updateContentTOC();
  }

  updateForms() {

    // Residencial PGOU98

    if (document.getElementById("form_rsd_calif") != null)
    document.getElementById("form_rsd_calif").innerText = i18next.t(
      "form_rsd_calif"
    );

    if (document.getElementById("form_rsd_supmin") != null)
    document.getElementById("form_rsd_supmin").innerText = i18next.t(
      "form_rsd_supmin"
    );

    if (document.getElementById("form_rsd_anchmin") != null)
    document.getElementById("form_rsd_anchmin").innerText = i18next.t(
      "form_rsd_anchmin"
    );

  }

  updateMapQuery() {
    // expedientes

    if (document.getElementById("popup_historico_exp") != null)
      document.getElementById("popup_historico_exp").innerText = i18next.t(
        "popup_historico_exp"
      );

    if (document.getElementById("popup_titulo_calif") != null)
      document.getElementById("popup_titulo_calif").innerHTML =
        i18next.t("popup_titulo_calif");

    if (document.getElementById("popup_situacion") != null)
      document.getElementById("popup_situacion").innerHTML =
        i18next.t("popup_situacion");

    if (document.getElementById("ir_catastro") != null)
      document.getElementById("ir_catastro").title = i18next.t("ir_catastro");

    $("#ir_streetview").attr("title", i18next.t("ir_streetview"));

    if (document.getElementById("popup_titulo_catastro") != null)
      document.getElementById("popup_titulo_catastro").innerText = i18next.t(
        "popup_titulo_catastro"
      );

    if (document.getElementById("popup_boton_ficha_rsd") != null)
      document.getElementById("popup_boton_ficha_rsd").innerHTML =
        '<i class="fa fa-info-circle"></i> ' +
        i18next.t("popup_boton_ficha_rsd");

    if (document.getElementById("popup_boton_ficha_rsd") != null)
      document.getElementById("popup_boton_ficha_rsd").title = i18next.t(
        "boton_ficha_rsd_tip"
      );

    if (document.getElementById("popup_boton_normativa") != null)
      document.getElementById("popup_boton_normativa").title = i18next.t(
        "popup_boton_normativa"
      );

    if (document.getElementById("boton_normativa_su") != null) {
      document.getElementById("boton_normativa_su").innerHTML =
        '<i class="fa fa-info-circle"></i> ' +
        i18next.t("boton_normativa_su");
      document.getElementById("boton_normativa_su").title = i18next.t(
        "popup_boton_normativa"
      );
    }

    
  }

  updateTreeCalificacionesPRI(jstree_ord) {
    let nodo = jstree_ord.get_node("2_2_1");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_PRI_D") +
        "</i></Label>"
    );
    nodo = jstree_ord.get_node("2_2_2");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_PRI_E") +
        "</i></Label>"
    );
    nodo = jstree_ord.get_node("2_2_3");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_PRI_I") +
        "</i></Label>"
    );
    nodo = jstree_ord.get_node("2_2_4");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_PRI_VA") +
        "</i></Label>"
    );
    nodo = jstree_ord.get_node("2_2_5");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_PRI_VT") +
        "</i></Label>"
    );
    nodo = jstree_ord.get_node("2_2_6");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_PRI_S") +
        "</i></Label>"
    );
    nodo = jstree_ord.get_node("2_2_7");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_PRI_T") +
        "</i></Label>"
    );
    nodo = jstree_ord.get_node("2_2_8");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_PRI_TH") +
        "</i></Label>"
    );
    nodo = jstree_ord.get_node("2_2_9");
    jstree_ord.set_text(nodo, i18next.t("tree_SIST"));
    nodo = jstree_ord.get_node("2_2_9_1");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_PRI_EQ") +
        "</i></Label>"
    );
    nodo = jstree_ord.get_node("2_2_9_2");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_PRI_EL") +
        "</i></Label>"
    );
    nodo = jstree_ord.get_node("2_2_10");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_EL0") +
        "</i></Label>"
    );
    nodo = jstree_ord.get_node("2_2_11");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_CAT") +
        "</i></Label>"
    );
    nodo = jstree_ord.get_node("2_2_12");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' + i18next.t("tree_PE") + "</i></Label>"
    );
    nodo = jstree_ord.get_node("2_2_13");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_SEP_CALIF") +
        "</i></Label>"
    );
  }

  updateTreeSistemasDotacionales(jstree_ord) {
    let nodo = jstree_ord.get_node("2_1_18_1");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_SLEC_PGOU98") +
        "</i></Label>"
    );
    nodo = jstree_ord.get_node("2_1_18_2");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_SLEL_PGOU98") +
        "</i></Label>"
    );
    nodo = jstree_ord.get_node("2_1_18_3");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_SLCI_PGOU98") +
        "</i></Label>"
    );
    nodo = jstree_ord.get_node("2_1_18_4");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_SGEC_PGOU98") +
        "</i></Label>"
    );
    nodo = jstree_ord.get_node("2_1_18_5");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_SGEL_PGOU98") +
        "</i></Label>"
    );
    nodo = jstree_ord.get_node("2_1_18_6");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_SGCI_PGOU98") +
        "</i></Label>"
    );
  }

  updateTreeCalificacionesPGOU98(jstree_ord) {
    let nodo = jstree_ord.get_node("2_1_1");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_RSD_A") +
        "</i></Label>"
    );

    nodo = jstree_ord.get_node("2_1_2");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_RSD_B") +
        "</i></Label>"
    );

    nodo = jstree_ord.get_node("2_1_3");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_RSD_C") +
        "</i></Label>"
    );

    nodo = jstree_ord.get_node("2_1_4");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_RSD_D") +
        "</i></Label>"
    );
    nodo = jstree_ord.get_node("2_1_5");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_RSD_E") +
        "</i></Label>"
    );
    nodo = jstree_ord.get_node("2_1_6");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_VOL") +
        "</i></Label>"
    );
    nodo = jstree_ord.get_node("2_1_7");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_RSD_G") +
        "</i></Label>"
    );
    nodo = jstree_ord.get_node("2_1_8");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_RSD_H") +
        "</i></Label>"
    );
    nodo = jstree_ord.get_node("2_1_9");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_RSD_I") +
        "</i></Label>"
    );
    nodo = jstree_ord.get_node("2_1_10");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_RSD_J") +
        "</i></Label>"
    );
    nodo = jstree_ord.get_node("2_1_11");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_RSD_K") +
        "</i></Label>"
    );
    nodo = jstree_ord.get_node("2_1_12");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_SEC_L") +
        "</i></Label>"
    );
    nodo = jstree_ord.get_node("2_1_13");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_SEC_M") +
        "</i></Label>"
    );
    nodo = jstree_ord.get_node("2_1_14");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_PROT_N") +
        "</i></Label>"
    );
    nodo = jstree_ord.get_node("2_1_15");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_PROT_R") +
        "</i></Label>"
    );
    nodo = jstree_ord.get_node("2_1_16");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_TER_S") +
        "</i></Label>"
    );
    nodo = jstree_ord.get_node("2_1_17");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_TER_T") +
        "</i></Label>"
    );

    nodo = jstree_ord.get_node("2_1_18");
    jstree_ord.set_text(nodo, i18next.t("tree_SIST"));

    this.updateTreeSistemasDotacionales(jstree_ord);

    nodo = jstree_ord.get_node("2_1_19");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_EL0") +
        "</i></Label>"
    );
    nodo = jstree_ord.get_node("2_1_20");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_CAT") +
        "</i></Label>"
    );
    nodo = jstree_ord.get_node("2_1_21");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' + i18next.t("tree_r") + "</i></Label>"
    );
    nodo = jstree_ord.get_node("2_1_22");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_CAR_INF") +
        "</i></Label>"
    );
    nodo = jstree_ord.get_node("2_1_23");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_PASAJE") +
        "</i></Label>"
    );
    nodo = jstree_ord.get_node("2_1_24");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_NOVA_AL") +
        "</i></Label>"
    );
    nodo = jstree_ord.get_node("2_1_25");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' + i18next.t("tree_PE") + "</i></Label>"
    );
    nodo = jstree_ord.get_node("2_1_26");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_SEP_CALIF") +
        "</i></Label>"
    );
    nodo = jstree_ord.get_node("2_1_27");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_SEP_ALT") +
        "</i></Label>"
    );
  }

  updateTreeCategoriasRustico(jstree_ord) {
    let nodo = jstree_ord.get_node("1_1");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_AANP") +
        "</i></Label>"
    );

    nodo = jstree_ord.get_node("1_2");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_ANEI") +
        "</i></Label>"
    );

    nodo = jstree_ord.get_node("1_3");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_AIN_PG") +
        "</i></Label>"
    );

    nodo = jstree_ord.get_node("1_4");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_ZIP") +
        "</i></Label>"
    );

    nodo = jstree_ord.get_node("1_5");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_ARIP") +
        "</i></Label>"
    );

    nodo = jstree_ord.get_node("1_6");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_SRG") +
        "</i></Label>"
    );

    nodo = jstree_ord.get_node("1_7");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_AIA") +
        "</i></Label>"
    );

    nodo = jstree_ord.get_node("1_8");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' +
        i18next.t("tree_AT_H") +
        "</i></Label>"
    );

    nodo = jstree_ord.get_node("1_9");
    jstree_ord.set_text(
      nodo,
      '<Label style="font-size:8pt"><i>' + i18next.t("tree_NR") + "</i></Label>"
    );
  }

  updateContentTOC() {
    const mapasBaseActivo = $("#accordion").accordion("option", "active") === 0;
    if (mapasBaseActivo) {
      document.getElementById("toc_mapas_base").innerHTML =
        '<span class="ui-accordion-header-icon ui-icon ui-icon-triangle-1-s"></span>' +
        i18next.t("toc_mapas_base");
    } else {
      document.getElementById("toc_mapas_base").innerHTML =
        '<span class="ui-accordion-header-icon ui-icon ui-icon-triangle-1-e"></span>' +
        i18next.t("toc_mapas_base");
    }

    const ordenacionActivo =
      $("#accordion").accordion("option", "active") === 1;
    if (ordenacionActivo) {
      document.getElementById("toc_ordenacion").innerHTML =
        '<span class="ui-accordion-header-icon ui-icon ui-icon-triangle-1-s"></span>' +
        i18next.t("toc_ordenacion");
    } else {
      document.getElementById("toc_ordenacion").innerHTML =
        '<span class="ui-accordion-header-icon ui-icon ui-icon-triangle-1-e"></span>' +
        i18next.t("toc_ordenacion");
    }

    const consultasActivo = $("#accordion").accordion("option", "active") === 2;
    if (consultasActivo) {
      document.getElementById("toc_consultas").innerHTML =
        '<span class="ui-accordion-header-icon ui-icon ui-icon-triangle-1-s"></span>' +
        i18next.t("toc_consultas");
    } else {
      document.getElementById("toc_consultas").innerHTML =
        '<span class="ui-accordion-header-icon ui-icon ui-icon-triangle-1-e"></span>' +
        i18next.t("toc_consultas");
    }

    document.getElementById("deleteSelectedConsultas").value = i18next.t(
      "deleteSelectedConsultas"
    );
    document.getElementById("download_select_consultas").title = i18next.t(
      "download_select_consultas"
    );

    // tree
    let jstree_ord = $("#jstree_ord").jstree(true);

    let nodo = jstree_ord.get_node("root");
    jstree_ord.set_text(nodo, i18next.t("tree_ord_root"));

    nodo = jstree_ord.get_node("1");
    jstree_ord.set_text(nodo, i18next.t("tree_categorias_rustico"));

    nodo = jstree_ord.get_node("2");
    jstree_ord.set_text(nodo, i18next.t("tree_calificaciones"));

    nodo = jstree_ord.get_node("2_1");
    jstree_ord.set_text(nodo, i18next.t("tree_PGOU98"));

    nodo = jstree_ord.get_node("2_2");
    jstree_ord.set_text(nodo, i18next.t("tree_PRI"));

    nodo = jstree_ord.get_node("2_3");
    jstree_ord.set_text(nodo, i18next.t("tree_PG2023"));

    nodo = jstree_ord.get_node("3");
    jstree_ord.set_text(nodo, i18next.t("tree_ambitos"));

    nodo = jstree_ord.get_node("3_1");
    jstree_ord.set_text(nodo, i18next.t("tree_PGOU98"));

    nodo = jstree_ord.get_node("3_2");
    jstree_ord.set_text(nodo, i18next.t("tree_PRI"));

    nodo = jstree_ord.get_node("3_3");
    jstree_ord.set_text(nodo, i18next.t("tree_PG2023"));

    nodo = jstree_ord.get_node("4");
    jstree_ord.set_text(nodo, i18next.t("tree_aprobacion_inicial"));

    this.updateTreeCategoriasRustico(jstree_ord);
    this.updateTreeCalificacionesPGOU98(jstree_ord);
    this.updateTreeCalificacionesPRI(jstree_ord);
    

    this.updateMapQuery();

    this.updateForms();

    //mapas base
    $('label[for="catastro"]').text(i18next.t("catastro"));
    $('label[for="nacional_1981_1986"]').text(i18next.t("nacional_1981_1986"));
    $('label[for="orto_actual"]').text(i18next.t("orto_actual"));
    $('label[for="orto_ams_1956"]').text(i18next.t("orto_ams_1956"));

    // OPACIDAD
    document.getElementById("label_opacidad_ordenacion").innerText = i18next.t(
      "label_opacidad_ordenacion"
    );
  }
}
