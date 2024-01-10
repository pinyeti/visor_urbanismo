/**
 * Clase para gestionar unidades de ejecución del Plan General de Ordenación Urbana de 1998 (PGOU98).
 * @memberof module:Frontend
 */
class Form_UNIDAD_EJECUCION_PGOU98 {
  /**
   * Crea una instancia de Form_UNIDAD_EJECUCION_PGOU98.
   *
   * @param {object} entity - La entidad que contiene la información.
   * @param {object} sigduMap - El mapa SIGDU.
   */
  constructor(entity, sigduMap) {
    this.sigduMap=sigduMap;
    this.map=sigduMap.map;
    this.geojson = entity.getGeojson();
    this.feature = entity.getFeature();
    this.codigo = entity.getFeature().properties.codigo;
    this.denominacion =
      entity.getFeature().properties.titulo.toUpperCase() || "-";

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
    this.html_SISTEMAS_CESION = ``;
    this.html_SUPERFICIES = ``;
    this.html_ORDENACION = ``;
    this.html_ESTANDARES_URBANISTICOS=``;
    this.html_GESTION=``;
    this.html_OBSERVACIONES=``;
    this.html_buttons = ``;
    this.html_TITULO = ``;
    this.html_SUPERFICIE_EDIF = ``;

    this.mapManager = null;

    this.setHTML_IDENTIFICACION();
    this.setHTML_SISTEMAS_CESION();
    this.setHTML_SUPERFICIES();
    this.setHTML_ORDENACION();
    this.setHTML_SUPERFICIE_EDIF();
    this.setHTML_GESTION();
    this.setHTML_OBSERVACIONES();
    this.setHTML_ESTANDARES_URBANISTICOS();
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

    console.log("===============================");
  }

  setHTML_SISTEMAS_CESION() {
    this.html_SISTEMAS_CESION = `
    <TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
        <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
            <td><LABEL style='padding:10px;font-size:8pt;font-family:Arial;color:black' align="right">EXPAIS LLIURES</LABEL></td>
            <td><LABEL style='padding:10px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.totlibres}</LABEL></td>
            <td><LABEL style='padding:10px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.elibres}</LABEL></td>
        </tr>
        <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
            <td><LABEL style='padding:10px;font-size:8pt;font-family:Arial;color:black' align="right">EQUIPAMENTS</LABEL></td>
            <td><LABEL style='padding:10px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.totequipam}</LABEL></td>
            <td><LABEL style='padding:10px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.equipam}</LABEL></td>
        </tr>
        <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
            <td><LABEL style='padding:10px;font-size:8pt;font-family:Arial;color:black' align="right">VIALS I INF.</LABEL></td>
            <td><LABEL style='padding:10px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.totvial}</LABEL></td>
            <td><LABEL style='padding:10px;font-size:8pt;font-family:Arial;color:#000000;'>-</LABEL></td>
        </tr>
       
       
    </TABLE>`;
  }

  setHTML_SUPERFICIES() {
    this.html_SUPERFICIES = `
        <TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
            <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
                <td><LABEL style='padding:10px;font-size:8pt;font-family:Arial;color:black' align="right">SUP. SÓL NO LUCRATIU</LABEL></td>
                <td><LABEL style='padding:10px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.totcesion}</LABEL></td>
               
            </tr>
            <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
                <td><LABEL style='padding:10px;font-size:8pt;font-family:Arial;color:black' align="right">SUP. SÓL LUCRATIU</LABEL></td>
                <td><LABEL style='padding:10px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.totlucrat}</LABEL></td>
               
            </tr>
            <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
                <td><LABEL style='padding:10px;font-size:8pt;font-family:Arial;color:black' align="right">TOTAL</LABEL></td>
                <td><LABEL style='padding:10px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.totue}</LABEL></td>
                 
            </tr>       
           
        </TABLE>`;
  }

  setHTML_ORDENACION() {
    this.html_ORDENACION = `
      <TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
              
      <tr align="left" bgcolor="#eaf5ff" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
          <td bgcolor="grey"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:white' align="right">USOS</LABEL></td>
          <td bgcolor="grey"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:white' align="right">TIPOLOGIA</LABEL></td>
          <td bgcolor="grey"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:white' align="right">ORDENANÇA</LABEL></td>
          <td bgcolor="grey"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:white' align="right">COEF. EDIFICABILITAT MITJA</LABEL></td>
          <td bgcolor="grey"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:white' align="right">SUP. SÒL</LABEL></td>
          <td bgcolor="grey"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:white' align="right">EDIFICABILITAT</LABEL></td>
      </tr>
      <tr align="left" bgcolor="#eaf5ff" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
          <td rowspan=2 bgcolor="#eaf5ff"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black' align="right">RESID. UNIFAMILIAR</LABEL></td>
          <td bgcolor="#eaf5ff"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black' align="right">CONTINUA</LABEL></td>
          <td bgcolor="white"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.orden_ruc}</LABEL></td>
          <td bgcolor="white"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.edif_ruc}</LABEL></td>
          <td bgcolor="white"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.supsol_ruc}</LABEL></td>
          <td bgcolor="white"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.suptot_ruc}</LABEL></td>
      </tr>
      <tr align="left" bgcolor="#eaf5ff" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
        <!-- <td bgcolor="#eaf5ff"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black' align="right">RESID. UNIFAMILIAR</LABEL></td> -->
          <td bgcolor="#eaf5ff"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black' align="right">AILLADA</LABEL></td>
          <td bgcolor="white"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.orden_rua}</LABEL></td>
          <td bgcolor="white"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.edif_rua}</LABEL></td>
          <td bgcolor="white"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.supsol_rua}</LABEL></td>
          <td bgcolor="white"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.suptot_rua}</LABEL></td>
      </tr>
      <tr align="left" bgcolor="#eaf5ff" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
          <td rowspan=3 bgcolor="#eaf5ff"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black' align="right">RESID. PLURIFAMILIAR</LABEL></td>
          <td bgcolor="#eaf5ff"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black' align="right">CONTINUA</LABEL></td>
          <td bgcolor="white"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.orden_rpc}</LABEL></td>
          <td bgcolor="white"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.edif_rpc}</LABEL></td>
          <td bgcolor="white"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.supsol_rpc}</LABEL></td>
          <td bgcolor="white"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.suptot_rpc}</LABEL></td>
      </tr>
          <tr align="left" bgcolor="#eaf5ff" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>          
          <td bgcolor="#eaf5ff"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black' align="right">AILLADA</LABEL></td>
          <td bgcolor="white"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.orden_rpa}</LABEL></td>
          <td bgcolor="white"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.edif_rpa}</LABEL></td>
          <td bgcolor="white"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.supsol_rpa}</LABEL></td>
          <td bgcolor="white"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.suptot_rpa}</LABEL></td>
      </tr>
      <tr align="left" bgcolor="#eaf5ff" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
          
          <td bgcolor="#eaf5ff"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black' align="right">VOL. ESP.</LABEL></td>
          <td bgcolor="white"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.orden_vol}</LABEL></td>
          <td bgcolor="white"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.edif_vol}</LABEL></td>
          <td bgcolor="white"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.supsol_vol}</LABEL></td>
          <td bgcolor="white"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.suptot_vol}</LABEL></td>
      </tr>
      <tr align="left" bgcolor="#eaf5ff" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
          <td bgcolor="#eaf5ff"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black' align="right">SECUNDARI</LABEL></td>
          <td bgcolor="#eaf5ff"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black' align="right">TOTES</LABEL></td>
          <td bgcolor="white"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.orden_sec}</LABEL></td>
          <td bgcolor="white"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.edif_sec}</LABEL></td>
          <td bgcolor="white"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.supsol_sec}</LABEL></td>
          <td bgcolor="white"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.suptot_sec}</LABEL></td>
      </tr>
      <tr align="left" bgcolor="#eaf5ff" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
          <td bgcolor="#eaf5ff"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black' align="right">TERCIARI</LABEL></td>
          <td bgcolor="#eaf5ff"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black' align="right">TOTES</LABEL></td>
          <td bgcolor="white"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.orden_ter}</LABEL></td>
          <td bgcolor="white"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.edif_ter}</LABEL></td>
          <td bgcolor="white"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.supsol_ter}</LABEL></td>
          <td bgcolor="white"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.suptot_ter}</LABEL></td>
      </tr>
      <tr align="left" bgcolor="#eaf5ff" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
          <td bgcolor="#eaf5ff"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black' align="right">EQUIPAMENTS</LABEL></td>
          <td bgcolor="#eaf5ff"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:black' align="right">TOTES</LABEL></td>
          <td bgcolor="white"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.orden_eqp}</LABEL></td>
          <td bgcolor="white"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.edif_eqp}</LABEL></td>
          <td bgcolor="white"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.supsol_eqp}</LABEL></td>
          <td bgcolor="white"><LABEL style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.suptot_eqp}</LABEL></td>
      </tr>
              
    </TABLE>`;
  }

  setHTML_SUPERFICIE_EDIF(){
    this.html_SUPERFICIE_EDIF=`
    <TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
        <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
            <td><LABEL style='padding:10px;font-size:8pt;font-family:Arial;color:black' align="right">EDIFICABILITAT MAX. (m2t)</LABEL></td>
            <td><LABEL style='padding:10px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.aprofitn}</LABEL></td>
            
        </tr>
        <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
            <td><LABEL style='padding:10px;font-size:8pt;font-family:Arial;color:black' align="right">COEF. EDIFICABILITAT MAX. (m2t/m2)</LABEL></td>
            <td><LABEL style='padding:10px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.edifglob_1}</LABEL></td>
            
        </tr>
        
        
    </TABLE>`; 
  }

  setHTML_ESTANDARES_URBANISTICOS(){
    this.html_ESTANDARES_URBANISTICOS=`
    <TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
        <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
            <td><LABEL style='padding:10px;font-size:8pt;font-family:Arial;color:black' align="right">DENSITAT MAX. VIVENDES (viv/ha)</LABEL></td>
            <td><LABEL style='padding:10px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.densvivm_1}</LABEL></td>
            
        </tr>
        <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
            <td><LABEL style='padding:10px;font-size:8pt;font-family:Arial;color:black' align="right">DENSITAT POBLACIÓ MAX. (hab/ha)</LABEL></td>
            <td><LABEL style='padding:10px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.denspobm_1}</LABEL></td>
            
        </tr>
        <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
            <td><LABEL style='padding:10px;font-size:8pt;font-family:Arial;color:black' align="right">NUM. VIV. MAX. (viv)</LABEL></td>
            <td><LABEL style='padding:10px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.numvivn}</LABEL></td>
            
        </tr>
        <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
            <td><LABEL style='padding:10px;font-size:8pt;font-family:Arial;color:black' align="right">NUM. HAB. MAX. (hab)</LABEL></td>
            <td><LABEL style='padding:10px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.numhabmaxn}</LABEL></td>
            
        </tr>
        
        
    </TABLE>`; 
  }

  setHTML_GESTION(){
    this.html_GESTION=`
    <TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
        <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
            <td><LABEL style='padding:10px;font-size:8pt;font-family:Arial;color:black' align="right">PALNEJAMENT APROVAT</LABEL></td>
            <td><LABEL style='padding:10px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.plana_apro}</LABEL></td>
            
        </tr>
        <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
            <td><LABEL style='padding:10px;font-size:8pt;font-family:Arial;color:black' align="right">PLANEJAMENT A DESENVOLUPAR</LABEL></td>
            <td><LABEL style='padding:10px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.plana_a_d}</LABEL></td>
            
        </tr>
        <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
            <td><LABEL style='padding:10px;font-size:8pt;font-family:Arial;color:black' align="right">SISTEMA D' ACTUACIÓ</LABEL></td>
            <td><LABEL style='padding:10px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.sistema_ac}</LABEL></td>
            
        </tr>
        <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
            <td><LABEL style='padding:10px;font-size:8pt;font-family:Arial;color:black' align="right">PLA D' ETAPES</LABEL></td>
            <td><LABEL style='padding:10px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.plan_etapa}</LABEL></td>
            
        </tr>
        
        
    </TABLE>`; 
  }

  setHTML_OBSERVACIONES(){
    this.html_OBSERVACIONES=`
        <TABLE style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
            <tr align="left" bgcolor="white" style='padding:10px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
               
                <td style='text-align: justify;padding:10px;font-size:8pt;font-family:Arial;color:#000000;'>${this.feature.properties.observacio.replace(
                  /\n/g,
                  "<br>"
                )}</LABEL></td>
               
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
      <button id="buttons" class="accordion">SISTEMAS LOCALES DE CESIÓN</button>
      <div class="panelCESION id="panelCESION">
        <BR>
        ${this.html_SISTEMAS_CESION}
        <BR>      
      </div>
      <button id="buttons" class="accordion">SUPERFICIES</button>
      <div class="panelSUPERFICIES id="panelSUPERFCIES">
        <BR>
        ${this.html_SUPERFICIES}
        <BR>      
      </div>
      <button id="buttons" class="accordion">ORDENACION</button>
      <div class="panelORDENACION id="panelORDENACION">
        <BR>
        ${this.html_ORDENACION}
        <BR>      
      </div>
      <button id="buttons" class="accordion">SUPERFICIE EDIFICABLE</button>
      <div class="panelSUPERFICIE_EDIF id="panelSUPERFICIE_EDIF">
        <BR>
        ${this.html_SUPERFICIE_EDIF}
        <BR>      
      </div>
      <button id="buttons" class="accordion">ESTANDARES URBANISTICOS</button>
      <div class="panelESTANDARES_URBANISTICOS id="panelESTANDARES_URBANISTICOS">
        <BR>
        ${this.html_ESTANDARES_URBANISTICOS}
        <BR>      
      </div>
      <button id="buttons" class="accordion">GESTIÓN, PROGRAMACIÓN Y PLANEAMIENTO</button>
      <div class="panelGESTION id="panelGESTION">
        <BR>
        ${this.html_GESTION}
        <BR>      
      </div>
      <button id="buttons" class="accordion">OBSERVACIONES</button>
      <div class="panelOBSERVACIONES id="panelOBSERVACIONES">
        <BR>
        ${this.html_OBSERVACIONES}
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

    const tit_caracteristicas = `<DIV style='padding:3px;font-size:8.5pt;font-family:Arial Black;background-color:rgba(85, 140, 212, 1);color:white;border-style: solid;border-width:0.1pt;border-color:RGB(12,1,73);width:99%;height:14px;'>2. SISTEMAS LOCALES DE CESIÓN</DIV>`;
    ventana.document.write(tit_sistemas_cesion);
    ventana.document.write(this.html_SISTEMAS_CESION);

    const tit_superficies = `<DIV style='padding:3px;font-size:8.5pt;font-family:Arial Black;background-color:rgba(85, 140, 212, 1);color:white;border-style: solid;border-width:0.1pt;border-color:RGB(12,1,73);width:99%;height:14px;'>3. SUPERFICIES</DIV>`;
    ventana.document.write(tit_superficies);
    ventana.document.write(this.html_SUPERFICIES);

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
