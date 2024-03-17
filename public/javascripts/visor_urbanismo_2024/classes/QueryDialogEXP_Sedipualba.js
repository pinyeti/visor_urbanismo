/**
 * Clase para gestionar el diálogo de consultas de espedientes Sedipualba.
 * @memberof module:Frontend
 */
class QueryDialogEXP_Sedipualba {
  /**
   * Crea una instancia de QueryDialogEXP_Planeamiento.
   * @param {L.Map} map - Instancia del mapa Leaflet.
   * @param {MapLayers} mapLayers - Capas del mapa.
   * @param {TOC} toc - Controlador de la tabla de contenido (TOC).
   * @param {SigduMap} sigduMap - Instancia de SigduMap.
   */
  constructor(map, mapLayers, toc, sigduMap) {
    this.sigduMap = sigduMap;
    this.toc = toc;
    this.map = map;
    this.mapLayers = mapLayers;

    this.nodoContenedor;
    this.materia = "TODAS";
    this.submateria = "TODAS";
    this.tipoProcedimiento = "TODAS";
    this.subtipoProcedimiento = "TODAS";
    this.estado = "";
    this.clearPassword = "0rQwjGZ3Fb6Dw7oFJKt4wl3at";

    this.codigo_exp_selected;
    this.con_ubicacion = false;
    this.entorno = "DEV";

    this.expedientes_con_ubicacion = [];

    this.initialize();
  }

  async initialize() {
    const reader = new DataReaderSedipualb();
    await reader.setEntorno("DEV");
    await this.createHTML();

    window.addEventListener("DOMContentLoaded", () => {
      this.queryEXP_Sedipaulba("-");
    });
  }

  async createHTML() {
    const strSelectEntorno = this.createSelectEntorno();
    const divQUERY_EXP_SEDIPUALBA = `<div id="divQUERY_EXP_SEDIPUALBA" style='background-color:#f2f2f2;width:100%;height:80%'></div`;
    const strOptions = await this.setOptions();
    const strSelect_NODOS = this.createSelect_NODOS();

    const htmlQuery = `
      <div style="display: flex;justify-content: space-between;align-items: center;">
        <h2>Prueba Expedientes Sedipualba</h2>
        <div style="flex: 1;text-align: right;">
          ${strSelectEntorno}
        </div>
      </div>
  
			${strSelect_NODOS}
			<BR>
			<BR>
			${strOptions}
			<BR>
			${divQUERY_EXP_SEDIPUALBA}
			<BR>
			`;
    const elem = document.getElementById("queryTablesSedipualba");
    elem.innerHTML = `<div style='overflow:auto;padding:20px;background-color:#f2f2f2;border-style: solid;border-width:0pt;border-color:black;box-shadow: 3px 3px 3px 3px rgba(0, 0, 0, 0.2);position:absolute;width:90%;height:90%;top:10px;left:10px'>  
				${htmlQuery}
			</div>`;

    const self = this;
    let elemSelect = elem.querySelectorAll(
      "input[name='selectTablesNODOS'], select[name='selectTablesNODOS']"
    );
    for (const select of elemSelect) {
      select.onchange = async function () {
        console.log(
          "change option select nodos: " + select[select.selectedIndex].value
        );

        self.sigduMap.map.spin(true);
        if (self.entorno == "DEV") {
          self.nodoContenedor = select[select.selectedIndex].value;
          if (select[select.selectedIndex].value == "URB")
            self.nodoContenedor = "44689";
        }
        if (self.entorno == "PROD") {
          self.nodoContenedor = select[select.selectedIndex].value;
          if (select[select.selectedIndex].value == "URB")
            self.nodoContenedor = "25102";
        }
        console.log("NODO CONTENEDOR: " + self.nodoContenedor);

        await self.queryEXP_Sedipaulba(); // podria ser select[select.selectedIndex].id
        self.sigduMap.map.spin(false);
      };
    }

    var elemOptions = document.getElementById("tableOptions");
    //elemOptions.innerHTML = html;
    console.log(elemOptions);

    //const elem = document.getElementsByName("select");
    elemSelect = elemOptions.querySelectorAll("select[name='selectOptions']");
    for (const select of elemSelect) {
      select.onchange = async function () {
        //self.changeQUERY();
        console.log(
          "change option select: " + select[select.selectedIndex].value
        );
        await self.changeOptionsSubMateria();
        await self.changeOptionsTipoProcedimiento();
        await self.changeOptionsSubtipoProcedimiento();
        self.submateria = "TODAS";
        self.tipoProcedimiento = "TODAS";
        self.subtipoProcedimiento = "TODAS";
        self.sigduMap.map.spin(true);
        self.materia = select[select.selectedIndex].value;

        await self.queryEXP_Sedipaulba(); // podria ser select[select.selectedIndex].id
        self.sigduMap.map.spin(false);
      };
    }

    var elemOptions = document.getElementById("tableOptions");
    elemSelect = elemOptions.querySelectorAll(
      "select[name='selectOptionsEstado']"
    );
    console.log(elemSelect);

    for (const select of elemSelect) {
      select.onchange = async function () {
        //self.changeQUERY();
        console.log(
          "change option select: " + select[select.selectedIndex].value
        );
        //self.changeOptionsTipoProcedimiento();

        self.sigduMap.map.spin(true);
        self.estado = select[select.selectedIndex].value;

        console.log("ESTADO: " + self.estado);

        await self.queryEXP_Sedipaulba(); // podria ser select[select.selectedIndex].id
        self.sigduMap.map.spin(false);
      };
    }

    elemSelect = elem.querySelectorAll("select[name='selectTablesEntorno']");
    for (const select of elemSelect) {
      select.onchange = async function () {
        console.log(
          "change option select entorno: " + select[select.selectedIndex].value
        );

        self.entorno = select[select.selectedIndex].value;
        console.log("ENTORNO: " + self.entorno);
        if (self.entorno === "DEV") {
          if (
            self.nodoContenedor === "25102" ||
            self.nodoContenedor === "44689"
          )
            self.nodoContenedor = "44689";
        }
        if (self.entorno === "PROD") {
          console.log("PRODUCCION");
          console.log(self.nodoContenedor);
          if (
            self.nodoContenedor === "25102" ||
            self.nodoContenedor === "44689"
          )
            console.log("URB");
          self.nodoContenedor = "25102";
        }
        self.sigduMap.map.spin(true);
        const reader = new DataReaderSedipualb();
        await reader.setEntorno(select[select.selectedIndex].value);
        await self.queryEXP_Sedipaulba();
        self.sigduMap.map.spin(false);
      };
    }
  }

  createSelectEntorno() {
    const strOptionsEntorno = `
        <option value="DEV" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optDESARROLLO">DESARROLLO</option>
        <option value="PROD" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optPRODUCCION">PRODUCCION</option>
        `;
    const strSelectEntorno = `
          <select style='background-color:#5b9ec1;color:white;padding:2px;font-size:9pt;font-family:Arial;width:150px;height:20px;overflow: scroll' name="selectTablesEntorno" id="selectTablesEntorno" >
              ${strOptionsEntorno}
          </select>
          `;
    return strSelectEntorno;
  }

  // NODO DESAROLLO URBANISMO 44689 PRODUCCION
  createSelect_NODOS() {
    const strOptionsNODOS = `
				<option value="NADA" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="optNADA">-</option>
        <option value="URB" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="URB">ÁREA DE URBANISMO, VIVIENDA Y PROYECTOS ESTRATÉGICOS</option>
				<option value="" style='font-size:7.5pt.5pt;font-family:Arial;background-color:white;color:black' id="">TODOS LOS EXPEDIENTES</option>				
				`;

    const strSelect_NODOS = `    
          <select style='background-color:#5b9ec1;color:white;padding:2px;font-size:9pt;font-family:Arial;width:100%;height:20px;overflow: scroll' name="selectTablesNODOS" id="selectTablesNODOS" >
          
              ${strOptionsNODOS}
          </select>
          `;

    return strSelect_NODOS;
  }

  /**
   * Configura las opciones para la consulta (materia,submateria,procedimiento,subprocedimiento) y establece controladores de eventos de cambio.
   */
  async setOptions() {
    // Consulta para obtener las opciones de Materia
    const reader = new DataReaderSedipualb();
    const info_materias = await reader.listMaterias(
      "07040_SIGDU",
      this.clearPassword,
      "07040"
    );
    console.log(info_materias.ListMateriasResult.MateriaInfo);

    let strOptionsMaterias = `<option value="TODAS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTODAS_MATERIAS">TODAS LAS MATERIAS</option>`;

    if (info_materias.ListMateriasResult != null)
      info_materias.ListMateriasResult.MateriaInfo.forEach((item) => {
        strOptionsMaterias += `
				<option value="${item.Id}" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="opt${item.Id}">
					${item.Id} - ${item.Descripcion}
				</option>`;
      });

    const strSelectMaterias = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="selectOptions" id="selectMaterias" >
			${strOptionsMaterias}
			</select>`;

    let strOptionsSubmaterias = `<option value="TODAS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTODAS_SUBMATERIAS">TODAS LAS SUBMATERIAS</option>`;

    const strSelectSubmaterias = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="selectOptionsSubMaterias" id="selectSubmaterias" >
			${strOptionsSubmaterias}
			</select>`;

    let strOptionsTipoProcedimiento = `<option value="TODAS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTODOS_PROC">TODOS LOS TIPOS DE PROCEDIMIENTOS</option>`;

    const strSelectTipoProcedimiento = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="selectOptionsTipoProcedimiento" id="selectTipoProcedimiento" >
			${strOptionsTipoProcedimiento}
			</select>`;

    let strOptionsSubtipoProcedimiento = `<option value="TODAS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTODOS_PROC">TODOS LOS SUBTIPOS DE PROCEDIMIENTOS</option>`;

    const strSelectSubtipoProcedimiento = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="selectOptionsSubtipoProcedimiento" id="selectSubtipoProcedimiento" >
			${strOptionsSubtipoProcedimiento}
			</select>`;

    let strOptionsEstado = `
      <option value="" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTODOS_ESTADO">TODOS</option>
      <option value="Borrador" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optBORRADOR_ESTADO">0 - BORRADOR</option>
      <option value="EnTramitacion" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optBORRADOR_ESTADO">1 - EN TRAMITACION</option>
      <option value="FinalizadoPorResolucionAdministrativa" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optFIN_RES_ADM_ESTADO">2 - FINALIZADO POR RESOLUCIÓN ADMINISTRATIVA</option>
      <option value="FinalizadoPorDesistimientoCiudadano" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optFIN_DES_CIU_ESTADO">3 - FINALIZADO POR DESESTIMIENTO DEL CIUDADANO</option>
      <option value="FinalizadoPorCaducidad" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optFIN_CAD_ESTADO">4 - FINALIZADO POR CADUCIDAD</option>
      <option value="FinalizadoPorImposibilidadMaterial" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optFIN_IMP_MAT_ESTADO">5 - FINALIZADO POR IMPOSIBILIDAD MATERIAL</option>
      `;

    const strSelectEstado = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="selectOptionsEstado" id="selectEstado" >
      ${strOptionsEstado}
      </select>`;

    // Creación del HTML para la tabla de opciones
    const html = `
			<TABLE id="tableOptions" style='padding:3px;font-size:9px;font-family:Arial;color:#000000;width:100%;height:10px'  BORDER=0  bgcolor="#cfd7e7" BORDERCOLOR="grey" CELLPADDING=3 CELLSPACING=1>
			
					<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
							<td> <LABEL  style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>MATERIA</label></td>
							<td>${strSelectMaterias}</td>       
					</tr>
					<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
							<td> <LABEL  style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>SUBMATERIA</label></td>
							<td>${strSelectSubmaterias}</td>       
					</tr> 
					<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
							<td> <LABEL  style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>TIPO PROCEDIMIENTO</label></td>
							<td>${strSelectTipoProcedimiento}</td>       
					</tr> 
					<tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
							<td> <LABEL  style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>SUBTIPO PROCEDIMIENTO</label></td>
							<td>${strSelectSubtipoProcedimiento}</td>       
					</tr>
          <tr align="left" bgcolor="white" style='padding:0px;font-size:9.5px;font-family:Arial;color:#000000;height:20px'>
              <td> <LABEL  style='padding:3px;font-size:8pt;font-family:Arial;color:#000000;'>ESTADO EXPEDIENTE</label></td>
              <td>${strSelectEstado}</td>       
          </tr>           				
			
			</TABLE>`;

    return html;
  }

  async changeOptionsSubMateria() {
    const selectMaterias = document.getElementById("selectMaterias");
    const idMateria = selectMaterias[selectMaterias.selectedIndex].value;
    console.log("Materia seleccionada: " + idMateria);

    let strOptionsSubMaterias = `<option value="TODAS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTODAS_SUBMATERIAS">TODAS LAS SUBMATERIAS</option>`;

    // Consulta para obtener las opciones de Submateria
    if (idMateria != "TODAS") {
      const reader = new DataReaderSedipualb();
      const info_subMaterias = await reader.listSubmaterias(
        "07040_SIGDU",
        this.clearPassword,
        "07040",
        idMateria
      );
      if (info_subMaterias.ListSubmateriasResult != null)
        info_subMaterias.ListSubmateriasResult.SubmateriaInfo.forEach(
          (item) => {
            strOptionsSubMaterias += `
						 <option value="${item.Id}" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="opt${item.Id}">
						 ${item.Id} - ${item.Descripcion}
						 </option>`;
          }
        );
    }

    const strSelectSubmaterias = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="selectOptionsSubMaterias" id="selectSubmaterias" >
			${strOptionsSubMaterias}
			</select>`;

    var elemOptionsM = document.getElementById("selectSubmaterias");
    elemOptionsM.innerHTML = strSelectSubmaterias;
    console.log(elemOptionsM);

    //const elem = document.getElementsByName("select");
    var elemOptions = document.getElementById("tableOptions");
    const elemSelect = elemOptions.querySelectorAll(
      "select[name='selectOptionsSubMaterias']"
    );
    console.log(elemSelect);

    const self = this;
    for (const select of elemSelect) {
      select.onchange = async function () {
        //self.changeQUERY();
        console.log(
          "change option select: " + select[select.selectedIndex].value
        );
        self.changeOptionsTipoProcedimiento();
        self.changeOptionsSubtipoProcedimiento();
        self.tipoProcedimiento = "TODAS";
        self.subtipoProcedimiento = "TODAS";

        self.sigduMap.map.spin(true);
        self.submateria = select[select.selectedIndex].value;

        await self.queryEXP_Sedipaulba(); // podria ser select[select.selectedIndex].id
        self.sigduMap.map.spin(false);
      };
    }
  }

  async changeOptionsTipoProcedimiento() {
    const selectMaterias = document.getElementById("selectSubmaterias");
    const idSubmateria = selectMaterias[selectMaterias.selectedIndex].value;
    console.log("Submateria seleccionada: " + idSubmateria);

    let strOptionsTipoProcedimiento = `<option value="TODAS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTODAS_TIPOPROCEDIMIENTO">TODOS LOS TIPOS DE PROCEDIMIENTO</option>`;

    // Consulta para obtener las opciones de Submateria
    if (idSubmateria != "TODAS") {
      const reader = new DataReaderSedipualb();
      const info_TipoProcedimiento = await reader.listTiposProcedimiento(
        "07040_SIGDU",
        this.clearPassword,
        "07040",
        idSubmateria
      );
      if (info_TipoProcedimiento.ListTiposProcedimientoResult != null)
        info_TipoProcedimiento.ListTiposProcedimientoResult.TipoProcedimientoInfo.forEach(
          (item) => {
            strOptionsTipoProcedimiento += `
						 <option value="${item.Id}" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="opt${item.Id}">
						 ${item.Id} - ${item.Descripcion}
						 </option>`;
          }
        );
    }

    const strSelectTipoProcedimiento = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="selectOptionsTipoProcedimiento" id="selectTipoProcedimiento" >
			${strOptionsTipoProcedimiento}
			</select>`;

    var elemOptionsTP = document.getElementById("selectTipoProcedimiento");
    elemOptionsTP.innerHTML = strSelectTipoProcedimiento;
    console.log(elemOptionsTP);

    var elemOptions = document.getElementById("tableOptions");
    const elemSelect = elemOptions.querySelectorAll(
      "select[name='selectOptionsTipoProcedimiento']"
    );
    console.log(elemSelect);

    const self = this;
    for (const select of elemSelect) {
      select.onchange = async function () {
        //self.changeQUERY();
        console.log(
          "change option select: " + select[select.selectedIndex].value
        );
        self.changeOptionsSubtipoProcedimiento();
        self.subtipoProcedimiento = "TODAS";

        self.sigduMap.map.spin(true);
        self.tipoProcedimiento = select[select.selectedIndex].value;

        await self.queryEXP_Sedipaulba(); // podria ser select[select.selectedIndex].id
        self.sigduMap.map.spin(false);
      };
    }
  }

  async changeOptionsSubtipoProcedimiento() {
    const selectTipoProcedimiento = document.getElementById(
      "selectTipoProcedimiento"
    );
    const idTipoProcedimiento =
      selectTipoProcedimiento[selectTipoProcedimiento.selectedIndex].value;
    console.log("selectTipoProcedimiento seleccionada: " + idTipoProcedimiento);

    let strOptionsSubtipoProcedimiento = `<option value="TODAS" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="optTODAS_SUBTIPOPROCEDIMIENTO">TODOS LOS SUBTIPOS DE PROCEDIMIENTO</option>`;

    // Consulta para obtener las opciones de Submateria
    if (idTipoProcedimiento != "TODAS") {
      const reader = new DataReaderSedipualb();
      const info_subTipoProcedimiento = await reader.listSubtiposProcedimiento(
        "07040_SIGDU",
        this.clearPassword,
        "07040",
        idTipoProcedimiento
      );
      console.log(idTipoProcedimiento);
      console.log(info_subTipoProcedimiento);
      if (info_subTipoProcedimiento.ListSubtiposProcedimientoResult != null)
        info_subTipoProcedimiento.ListSubtiposProcedimientoResult.SubtipoProcedimientoInfo.forEach(
          (item) => {
            strOptionsSubtipoProcedimiento += `
						 <option value="${item.Id}" style='font-size:7.5pt.5pt;font-family:Arial;color:#660000' id="opt${item.Id}">
						 ${item.Id} - ${item.DescripcionSubtipo}
						 </option>`;
          }
        );
    }

    const strSelectSubtipoProcedimiento = `<select  style='background-color:#e6e6e6;padding:2px;font-size:8pt;font-family:Arial;width:98%;height:20px;overflow: scroll' name="selectOptionsSubtipoProcedimiento" id="selectSubtipoProcedimiento" >
			${strOptionsSubtipoProcedimiento}
			</select>`;

    var elemOptionsSP = document.getElementById("selectSubtipoProcedimiento");
    elemOptionsSP.innerHTML = strSelectSubtipoProcedimiento;
    console.log(elemOptionsSP);

    var elemOptions = document.getElementById("tableOptions");
    const elemSelect = elemOptions.querySelectorAll(
      "select[name='selectOptionsSubtipoProcedimiento']"
    );
    console.log(elemSelect);

    const self = this;
    for (const select of elemSelect) {
      select.onchange = async function () {
        //self.changeQUERY();
        console.log(
          "change option select: " + select[select.selectedIndex].value
        );

        self.sigduMap.map.spin(true);
        self.subtipoProcedimiento = select[select.selectedIndex].value;
        await self.queryEXP_Sedipaulba(); // podria ser select[select.selectedIndex].id
        self.sigduMap.map.spin(false);
      };
    }
  }

  async formatQuery() {
    $(document).ready(function () {
      $("#table_queryEXP_Sedipualba")
        .removeAttr("width")
        .DataTable({
          dom: "Bfrtip",
          buttons: [
            "copy",
            "excel",
            //'csv',
            "pdf",
            "print",
          ],
          scrollY: "45vh",
          scrollCollapse: true,
          scrollX: true,
          paging: false,
          padding: "3px",
          language: {
            decimal: "",
            emptyTable: "No hay información",
            info: "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
            infoEmpty: "Mostrando 0 to 0 of 0 Entradas",
            infoFiltered: "(Filtrado de _MAX_ total entradas)",
            infoPostFix: "",
            thousands: ",",
            lengthMenu: "Mostrar _MENU_ Entradas",
            loadingRecords: "Cargando...",
            processing: "Procesando...",
            search: "Buscar:",
            zeroRecords: "Sin resultados encontrados",
            paginate: {
              first: "Primero",
              last: "Ultimo",
              next: "Siguiente",
              previous: "Anterior",
            },
          },
          order: [[1, "dsc"]], // Ordenar por la tercera columna (índice 2) de forma ascendente
        });
    });
  }

  

  async queryEXP_Sedipaulba() {
    this.expedientes_con_ubicacion = [];
    const readerSDP = new DataReaderSedipualb();

    const info_exp = await readerSDP.listExpedientes(
      this.nodoContenedor,
      this.materia,
      this.submateria,
      this.tipoProcedimiento,
      this.subtipoProcedimiento,
      this.estado
    );

    console.log(info_exp);

    let info_json = info_exp;

    if (this.con_ubicacion) {
      const reader = new DataReader();
      const geo_exp = await reader.selectSQL(
        "select cod_exp from geo_exp_sedipualba"
      );
      console.log(geo_exp);

      // Crear un nuevo array con los elementos encontrados
      this.expedientes_con_ubicacion = info_exp.filter((expediente) => {
        const codigoExpediente = expediente.CodigoExpediente;
        return geo_exp.some((row) => row.cod_exp === codigoExpediente);
      });

      console.log("Expedientes encontrados en geo_exp:");
      console.log(this.expedientes_con_ubicacion);

      info_json = this.expedientes_con_ubicacion;
    }

    /*if (this.con_ubicacion) {

      for (const expediente of info_exp) {
        const codigoExpediente = expediente.CodigoExpediente;
        // Usa await aquí dentro de un método asincrónico
        const numgeo_exp = await readerSDP.ListGeorreferenciasExpediente(codigoExpediente);
        //console.log(numgeo_exp);
    
        if (numgeo_exp.ListGeorreferenciasExpedienteResult) {
          this.expedientes_con_ubicacion.push(expediente);
        }
      }
      info_json = this.expedientes_con_ubicacion;
      
    }*/

    //info_geojson.features.sort((a, b) => a.properties.codigo - b.properties.codigo);

    // class="stripe row-border order-column"

    let html_QUERY_HEAD = `
          <div style="text-align: right;">
            <label for="myCheckbox">Solo con ubicación</label>
            <input type="checkbox" id="myCheckbox">
          </div>
          <button style="padding-top:4px;padding-bottom:4px;" class="ui-button ui-widget ui-corner-all" title="Descàrrega en format geojson"  id="download_exp_Sedipualba"><i class="fa fa-download"></i></button>
          <button style="padding-top:4px;padding-bottom:4px;" class="ui-button ui-widget ui-corner-all" title="Afegeix consulta a taula de contingut" id="add_layer_toc_exp_Sedipualba"><i class="fa fa-plus-circle"></i></button>
					<button style="padding-top:4px;padding-bottom:4px;" class="ui-button ui-widget ui-corner-all" title="Acceder al expediente" id="info_expediente"><i class="fa-solid fa-file-shield"></i></button>
          <button style="padding-top:4px;padding-bottom:4px;" class="ui-button ui-widget ui-corner-all" title="Localiza expediente en el mapa" id="localizar_expediente"><i class="fa fa-search"></i></button>

    
          <TABLE id="table_queryEXP_Sedipualba" class="stripe row-border order-column" style="padding:3px;font-size:8pt;font-family:Arial;width:100%">
         
          <thead style="background-color:#e1eefb;">
            <tr>            
							<th>NUM.EXP.</td>
							<th>FECHA CREACIÓN</th>  
							<th>DESCRIPCIÓN_EXPEDIENTE</th>  
							<th>NOMBRE_PROCEDIMIENTO</th>
							<th>DESCR_ESTADO</th> 
            </tr>
          </thead>`;

    let html_QUERY_ROWS = "<tbody>";

    if (info_json != null)
      for (var n = 0; n < info_json.length; n++) {
        const fecha = new Date(info_json[n].FechaCreacion);

        // Obtener el día, mes y año
        const dia = fecha.getUTCDate().toString().padStart(2, "0");
        const mes = (fecha.getUTCMonth() + 1).toString().padStart(2, "0"); // Sumamos 1 porque en JavaScript los meses van de 0 a 11
        const ano = fecha.getUTCFullYear();

        // Construir la cadena en el formato deseado (dd-mm-yyyy)
        const fechaFormateada = `${ano}-${mes}-${dia}`;

        html_QUERY_ROWS =
          html_QUERY_ROWS +
          `
					<tr id="queryEXP_${n}" 
            data-codigo=${info_json[n].CodigoExpediente} 
            data-fid="${n}"
            data-accion="doActionRowSedipualba">

						<td>${info_json[n].CodigoExpediente}</td>   
						<td>${fechaFormateada}</td>
						<td>${info_json[n].Descripcion}</td>
						<td>${info_json[n].NombreProcedimiento}</td>                                
						<td>${info_json[n].DescripcionEstado}</td>
				       
					</tr>`;
      }

    html_QUERY_ROWS = html_QUERY_ROWS + "</tbody>";

    const html_QUERY = html_QUERY_HEAD + html_QUERY_ROWS + `</TABLE>`;

    this.formatQuery();

    var elem = document.getElementById("divQUERY_EXP_SEDIPUALBA");
    elem.style.height = "70%";
    elem.innerHTML = html_QUERY;

    const self = this;

    var elementos = document.querySelectorAll(
      'tr[data-accion="doActionRowSedipualba"]'
    );
    for (var i = 0; i < elementos.length; i++) {
      const tr = elementos[i];

      if (tr) {
        tr.addEventListener("click", async function () {
          //self.fid = tr.getAttribute("data-fid");
          self.codigo_exp_selected = tr.getAttribute("data-codigo");

          console.log(self.codigo_exp_selected);

          var filas = document.querySelectorAll(
            'tr[data-accion="doActionRowSedipualba"]'
          );
          filas.forEach(function (fila) {
            fila.classList.remove("selected-row");
          });

          // Agregar la clase de fila seleccionada a la fila clicada
          tr.classList.add("selected-row");

          //self.doActionRow(table, fid);
        });
      }
    }

    document
      .getElementById("info_expediente")
      .addEventListener("click", async function () {
        console.log("info expediente:" + self.codigo_exp_selected);
        const reader = new DataReaderSedipualb();

        const info_json = await reader.getUrlDetalleExpediente(
          "07040_SIGDU",
          self.clearPassword,
          "07040",
          self.codigo_exp_selected
        );
        console.log(info_json);
        const url_exp =
          info_json.ObtenerUrlDetalleExpedienteComoUsuarioSegexConCertificadoResult; // url del expediente
        window.open(url_exp, "_blank");
      });

    document
      .getElementById("localizar_expediente")
      .addEventListener("click", async function () {
        console.log("info expediente:" + self.codigo_exp_selected);
        self.locateExpediente(self.codigo_exp_selected);
      });

    var checkbox = document.getElementById("myCheckbox");

    // Asigna el valor de la variable a la propiedad checked del checkbox
    checkbox.checked = this.con_ubicacion;

    document
      .getElementById("myCheckbox")
      .addEventListener("change", async function () {
        if (this.checked) {
          console.log("Checkbox marcado");
          self.con_ubicacion = true;
          // Realizar acciones adicionales cuando el checkbox está marcado
        } else {
          console.log("Checkbox desmarcado");
          self.con_ubicacion = false;
          // Realizar acciones adicionales cuando el checkbox está desmarcado
        }
        self.sigduMap.map.spin(true);
        await self.queryEXP_Sedipaulba();
        self.sigduMap.map.spin(false);
      });


    /* document
      .getElementById("download_exp_Sedipualba")
      .addEventListener("click", function () {
        self.download(name, info_geojson);
      });*/

    document
      .getElementById("add_layer_toc_exp_Sedipualba")
      .addEventListener("click", function () {
        self.addLayerTOC();
      });
  }

  async addLayerTOC() {
    console.log("addLayerTOC");
    
    
  }


  async locateExpediente(codigo_exp) {
    const reader = new DataReader();
    const info_json = await reader.selectSQL(
      "select * from geo_exp_sedipualba where cod_exp='" + codigo_exp + "'"
    );
    console.log(info_json);
    if (info_json.length > 0) {
      const parcela = info_json[0].referencia_catastral.substring(0, 7);
      console.log(parcela);
      const info_geojson = await reader.readDataFeature(
        "parcela_su_ru_calles",
        "pcat1='" + parcela + "'"
      );
      this.createGeojsonEXP(
        info_geojson,
        info_json[0].cod_exp,
        info_json[0].estado,
        info_json[0].referencia_interna
      );
      
    }
  }

  async createGeojsonEXP(geojson, cod_exp, estado,referencia_interna) {
    /*const reader = new DataReader();

    const geojson = await reader.readDataFeature(
      "pa_modificacion_pgou",
      "DATE_PART('year', CURRENT_DATE) - DATE_PART('year', TO_DATE(a_ini, 'YYYY-MM-DD'))<2 and a_def is null"
    );*/

    console.log(geojson, cod_exp, estado, referencia_interna);

    if(referencia_interna===null) referencia_interna="-------";

    // Crear una nueva colección de puntos
    const pointFeatures = geojson.features.map((feature) => {
      // Obtener el centroide de cada polígono
      const centroid = turf.centroid(feature);

      // Crear un nuevo punto a partir del centroide
      const point = turf.point([
        centroid.geometry.coordinates[0],
        centroid.geometry.coordinates[1],
      ]);

      point.properties = {
        expediente: cod_exp,
        referencia_interna: referencia_interna,
        estado: estado,

        // Agrega aquí más propiedades si es necesario
      };

      return point;
    });

    // Crear un nuevo GeoJSON con los puntos
    const pointGeoJSON = {
      type: "FeatureCollection",
      features: pointFeatures,
    };

    const style = () => {
      return {
        fillColor: "yellow",
        weight: 6,
        opacity: 1,
        color: "yellow",
        dashArray: "2,8",
        fillOpacity: 0,
      };
    };

    const polyLayer = L.geoJSON(geojson, { style: style });

    const pointsLayer = L.geoJSON(pointGeoJSON, {
      minZoom: 18,
      maxZoom: 22,
      pointToLayer: function (feature, latlng) {
        // Crear un círculo
        const circleMarker = L.circleMarker(latlng, {
          radius: 6,
          fillColor: "red",
          color: "yellow",
          weight: 4,
          opacity: 1,
          fillOpacity: 0.8,
        });

        // Crear un texto
       /* const text = L.divIcon({
          className: "text-label-sedipualba",
          html: `<div style="padding:3px">${feature.properties.expediente}</div>`,
        });*/

        console.log(feature);
        // Agregar el texto al círculo
        circleMarker.bindTooltip(
          "<DIV style='padding:8px;'>" +
          "<LABEL>"+feature.properties.expediente + "</LABEL><BR>"+
          "<LABEL>"+feature.properties.referencia_interna + "</LABEL><BR>"+
          "<LABEL>" + feature.properties.estado+"</LABEL>"+

            "</DIV>",
          {
            permanent: true,
            direction: "center",
            opacity: 0.8,
            offset: [0, -50],
            className: "text-label-sedipualba",
          }
        );

        // Retornar un grupo que contiene el círculo y el texto
        return L.layerGroup([circleMarker]);
      },
    });

    var bbox = turf.bbox(geojson.features[0].geometry);
    var polyBBOX = turf.bboxPolygon(bbox);

    var coordsB = turf.getCoords(polyBBOX);
    var coords = [];
    coords[0] = [coordsB[0][0][1], coordsB[0][0][0]];
    coords[1] = [coordsB[0][1][1], coordsB[0][1][0]];
    coords[2] = [coordsB[0][2][1], coordsB[0][2][0]];
    coords[3] = [coordsB[0][3][1], coordsB[0][3][0]];

    var poly = L.polygon(coords);

    // if(isMobile()) sidebar.close('queryTables');

    console.log(this.sigduMap.map);

    this.sigduMap.map.fitBounds(poly.getBounds());

    if (this.sigduMap.puntos != null)
      this.sigduMap.map.removeLayer(this.sigduMap.puntos);

    this.sigduMap.puntos = L.layerGroup([polyLayer, pointsLayer]);
    //this.sigduMap.map.addLayer(marker);
    this.sigduMap.map.addLayer(this.sigduMap.puntos);
  }
}
