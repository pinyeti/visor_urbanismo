/**
 * Clase para gestionar las consultas y la obtención de información de expedientes en Sedipualb.
 * @memberof module:Frontend
 */
class Sedipualb {
   /**
   * Crea una instancia de Sedipualb.
   */
  constructor() {
    this.query_expedientes = [];
    
    this.initialize();
  }

  async initialize() {
    let query=[];
    query=await this.getExpedientes("password");
    this.query_expedientes.splice(0, this.query_expedientes.length, ...query);
    console.log(this.query_expedientes);

    const documentosExp=await this.getDocumentosExpediente("password","07040","170167T",-1,"43052971F");
    console.log(documentosExp);

    const infoDocumento=await this.getInfoDocumento("07040_SIGDU","password","07040","1331960");
    console.log(infoDocumento);

    const carpetasDoc=await this.getCarpetasDocumentos("07040_SIGDU","password","07040","170167T",-1)
    console.log(carpetasDoc.ListarCarpetasV2Result.CarpetaItemV2);

    const materias=await this.getMaterias("07040_SIGDU","password","07040");
    console.log(materias.ListMateriasResult.MateriaInfo);

    const subMaterias=await this.getSubmaterias("07040_SIGDU","password","07040","33");
    console.log(subMaterias.ListSubmateriasResult.SubmateriaInfo);

    const tiposProcedimiento=await this.getTiposProcedimento("07040_SIGDU","password","07040","3301");
    console.log(tiposProcedimiento.ListTiposProcedimientoResult.TipoProcedimientoInfo);

    const subTiposProcedimiento=await this.getSubtiposProcedimento("07040_SIGDU","password","07040",219);
    if(subTiposProcedimiento.ListSubtiposProcedimientoResult!=null)
      console.log(subTiposProcedimiento.ListSubtiposProcedimientoResult.SubtipoProcedimientoInfo);
    else
      console.log(subTiposProcedimiento);


  }

  async getInfoDocumento(wsseg_user,clearPassword,pk_entidad,pkDocumento) {
    const reader = new DataReaderSedipualb();
    const info_json = await reader.obtenerInfoDocumento(wsseg_user,clearPassword,pk_entidad,pkDocumento);
    return info_json;
  } 

  async getMaterias(wsseg_user,clearPassword,idEntidad) {
    const reader = new DataReaderSedipualb();
    const info_json = await reader.listMaterias(wsseg_user,clearPassword,idEntidad);
    return info_json;
  } 

  async getSubmaterias(wsseg_user,clearPassword,idEntidad,idMateria) {
    const reader = new DataReaderSedipualb();
    const info_json = await reader.listSubmaterias(wsseg_user,clearPassword,idEntidad,idMateria);
    return info_json;
  } 

  async getTiposProcedimento(wsseg_user,clearPassword,idEntidad,idSubmateria) {
    const reader = new DataReaderSedipualb();
    const info_json = await reader.listTiposProcedimiento(wsseg_user,clearPassword,idEntidad,idSubmateria);
    return info_json;
  } 

  async getSubtiposProcedimento(wsseg_user,clearPassword,idEntidad,idProcedimiento) {
    const reader = new DataReaderSedipualb();
    const info_json = await reader.listSubtiposProcedimiento(wsseg_user,clearPassword,idEntidad,idProcedimiento);
    return info_json;
  } 

  async getDocumentosExpediente(clearPassword,pkEntidad,codigoExpediente,pkCarpetaPadre,nifUsuario) {
    const reader = new DataReaderSedipualb();
    const info_json = await reader.listarDocumentosV2(clearPassword,pkEntidad,codigoExpediente,pkCarpetaPadre,nifUsuario);
    return info_json;
  } 

  async getCarpetasDocumentos(wsseg_user,clearPassword,pkEntidad,codigoExpediente,pkCarpetaPadre) {
    const reader = new DataReaderSedipualb();
    const info_json = await reader.listarCarpetasV2(wsseg_user,clearPassword,pkEntidad,codigoExpediente,pkCarpetaPadre);
    return info_json;
  } 

  async getExpedientes(clearPassword) {
    const reader = new DataReaderSedipualb();

    let expedientes = [];
    let i = 0;

    while (true) {
      const info_json = await reader.listExpedientes(clearPassword, i);

      if (
        info_json.ListExpedientesResult &&
        info_json.ListExpedientesResult.InfoExpedienteV2.length > 0
      ) {
        expedientes = expedientes.concat(
          info_json.ListExpedientesResult.InfoExpedienteV2
        );
        i++;
      } else {
        break; 
      }
    }

    return expedientes;
  }
}
