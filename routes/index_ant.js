const { Router } = require("express");
const router = Router();


const {
  getEquipamientos,
  getFeatureByPoint,
  getGeojson,
  getIntersection,
  getSelect,
  getListEntities,
} = require("../controllers/index.controller");

const {
  getListMaterias,
  getListSubmaterias,
  getListTiposProcedimiento,
  getListSubtiposProcedimiento,
  getListExpedientes,
  getListarDocumentosV2,
  getListarCarpetasV2,
  getInfoDocumento,
} = require("../controllers/sedipualb.controller");

// Sedipualb

router.get("/opg/listMaterias", getListMaterias);
router.get("/opg/listSubmaterias", getListSubmaterias);
router.get("/opg/ListTiposProcedimiento", getListTiposProcedimiento);
router.get("/opg/ListSubtiposProcedimiento", getListSubtiposProcedimiento);
router.get("/opg/listExpedientes", getListExpedientes);
router.get("/opg/listarDocumentosV2", getListarDocumentosV2);
router.get("/opg/listarCarpetasV2", getListarCarpetasV2);
router.get("/opg/obtenerInfoDocumento", getInfoDocumento);

// Visor

router.get("/opg/equipamientos", getEquipamientos);

router.get("/opg/featureByPoint", getFeatureByPoint);

router.get("/opg/postgis_query_geojson", getGeojson);

router.get("/opg/postgis_select", getSelect);

router.get("/opg/postgis_intersection_query", getIntersection);

router.get("/opg/visor_urbanismo", function (req, res) {
  res.render("visor_urbanismo", {
    title: "Visor Urbanismo v.2",
  });

  router.use(function (err, req, res, next) {
    console.log(err.stack); // e.g., Not valid name
    return res.status(500).send("Internal Server Occured");
  });
});

router.get("/opg/visor_cesium", function (req, res) {
  res.render("visor_cesium", {
    title: "Visor Urbanismo Cesium",
  });

  router.use(function (err, req, res, next) {
    console.log(err.stack); // e.g., Not valid name
    return res.status(500).send("Internal Server Occured");
  });
});

module.exports = router;
