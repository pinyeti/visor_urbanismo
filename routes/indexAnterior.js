
var express = require('express');
var router = express.Router();
// var utm=require('leaflet.utm');

/* PostgreSQL and PostGIS module and connection setup */
const { Client, Query } = require('pg')

const fs = require('fs');

var app = express();
app.use(function(req, res, next) {
  console.log(req.originalUrl);
  res.send(req.originalUrl);
       });
var os = require("os"); 
console.log(os.hostname()); 

//console.log(".............."+app.handle)
/*app.handle((req, res, next) => {
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  console.log(".............."+fullUrl)
  //next()
  
});*/

const fetch = require('cross-fetch');

 var con = require('./connectionString.js');

	

// const fetch = require('node-fetch');


// Setup connection db

var conString = "postgres://"+con.username+":"+con.password+"@"+con.host+"/"+con.database; 
var conStringFASE1 = "postgres://"+con.username+":"+con.password+"@"+con.hostFASE1+"/"+con.databaseFASE1; 


// Connection db Plan Vigente
var client = new Client(conString);
client.connect();

// Connection db Aprobacion Inicial
var clientFASE1 = new Client(conStringFASE1);
clientFASE1.connect();

// Reconnection clients
function reconnect() {

  var status=""

  if(client._connected==false){
    client.end()
    client = new Client(conString);
    client.connect();
    status=status+"client reconnected<br>";
    console.log("client reconnected");
  }else{
    status=status+"client connected ok<br>";
    console.log("client connected ok")
  }

  if(clientFASE1._connected==false){
    clientFASE1.end()
    clientFASE1 = new Client(conStringFASE1);
    clientFASE1.connect();
    status=status+"clientFASE1 reconnected<br>";
    console.log("clientFASE1 reconnected");
  }else{
    status=status+"clientFASE1 connected ok<br>";
    console.log("clientFASE1 connected ok")
  }

  return status
}

setInterval(reconnect, 60000);


router.get('/opg/pg_reconnect', async function (req, res) {

  var status=reconnect()

  res.send(status)
  res.end

});

router.get('/opg/pg_connection_status', async function (req, res) {

  var status=""

  if(client._connected==false)
    status=status+"client connection off<br>"
  else
    status=status+"client connection on<br>"

  if(clientFASE1._connected==false)
    status=status+"clientFASE1 connection off<br>"
  else
    status=status+"clientFASE1 connection on<br>"


  res.send(status)
  res.end

});

//-----------------------------



var geoip = require('geoip-lite');


/*

const { Pool } = require('pg')
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'REVISIONPG2019',
  password: 'q1AIQYhp',
  port: 5432,
})
pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res) 
  pool.end() 
}) */

// prueba pdf

var pdf = require('html-pdf');

var url = require('url');

// prueba geopackage

var geojson = {
  "name":"NewFeatureType",
  "type":"FeatureCollection",
  "features":[]
};



var sqlite = require('spatialite');
var db,db2,db3,db4,db5
//var db = new sqlite.Database('public/geo/prueba.sqlite');

if(db!=null) db.close()

db = new sqlite.Database('public/images/geo/prueba2.sqlite');


//var db = new sqlite.Database('http://vscenegis.hopto.org/opg/geo/prueba.sqlite');

//var sqlite = require('sqlite3').verbose();
//var db = new sqlite.Database('public/geo/prueba.sqlite');

//var query = "SELECT AsGeoJSON(Centroid(GeomFromText('POLYGON ((30 10, 10 20, 20 40, 40 40, 30 10))'))) AS geojson;";
//var query = "SELECT AsGeoJSON(GeomFromText('MULTIPOLYGON ((30 10, 10 20, 20 40, 40 40, 30 10))')) AS geojson;";

//var query = `SELECT AsGeoJSON(Transform(GEOMETRY,4326)) As geometry  from prueba`;


fields='codigo'
var arrayFields=fields.split(",")
var fieldsSQL=""
for(n=0;n<arrayFields.length;n++){
  if(n>0)
    fieldsSQL=fieldsSQL+","
  
  fieldsSQL=fieldsSQL+"'"+arrayFields[n]+"',"+arrayFields[n]
    
}

console.log(fieldsSQL)

var query =`SELECT AsGeoJSON(Transform(the_geom,4326)) As geometry ,json_object(`+fieldsSQL+`) as properties FROM calific_zonas`

//var query =`SELECT AsGeoJSON(Transform(GEOMETRY,4326)) As geometry ,json_object('codigo',codigo,'identif',identificante) as properties FROM prueba`

//var query = "SELECT Centroid(GeomFromText('POLYGON ((30 10, 10 20, 20 40, 40 40, 30 10))')) AS geojson;";
 

/*async function readSQLITE(){
  db.spatialite(function(err) {
    db.each(query, function(err, row) {
      console.log(row);
      geojson.features.geometry.push(row.geometry)
      geojson.features.properties=row.properties
      //console.log(row);
    })
   
  }); 
} */




db.spatialite(function(err) {
db.all(query, [], (err, rows) => {
  if (err) {
    console.log(err)
  } else {
    rows.forEach((row) => {

      var features={
        "type":"Feature",
        "geometry":null,
        "properties":null
      }
      
      features.geometry=JSON.parse(row.geometry)
      features.properties=JSON.parse(row.properties)
      geojson.features.push(features)
    });

    //console.log(JSON.stringify(geojson))
    //console.log(JSON.parse(JSON.stringify(geojson)))
    
    //console.log(geojson.features[0].geometry.coordinates[0])
   // console.log(geojson.features[0].properties.codigo)
   // console.log(geojson)
   // for(n=0;n<geojson.features.length;n++)
   //  console.log(geojson.features[n].properties.codigo)
  }
})
})





router.get('/opg/sqlite_connection', async function (req, res) {

  dbSystem=req.query.dbSystem
  pathSystem=req.query.pathSystem

  switch(dbSystem){
    case "db":
      if(db!=null) db.close()
      db= new sqlite.Database(pathSystem);
      
      break
    case "db2":
      if(db2!=null) db2.close()
      db2= new sqlite.Database(pathSystem);
      break
    case "db3":
      if(db3!=null) db3.close()
      db3= new sqlite.Database(pathSystem);
      break
    case "db4":
      if(db4!=null) db4.close()
      db4= new sqlite.Database(pathSystem);
      break
    case "db5":
      if(db5!=null) db5.close()
      db5= new sqlite.Database(pathSystem);
      break
  }

  res.send("Connection: "+dbSystem+" "+pathSystem+" established")
  res.end

});

async function insertSQL(n,insert){
  
          
    db.all(insert, [], (err, rows) => {
      if (err) {
        console.log(err)
      } else {
        
      
      
      }
    })


}

router.post('/opg/sqlite_insert_collection', async function (req, res) {


  collection=req.body.collection

  jsonA=JSON.parse(collection)


 // console.log(jsonA[0].insert)

  for(n=0;n<jsonA.length;n++){

    insert=jsonA[n].insert

    try{
      db.spatialite(await insertSQL(n,insert))
      

    }catch( err ) {
      console.log("sqlite_query="+err);
      res.send(err)
      res.end()
    } 

  }
  res.send("finished")
  res.end()

 

})

router.post('/opg/sqlite_query_post', async function (req, res) {


  query=req.body.query

  try{
    db.spatialite(function(err) {

     // db.serialize(() => {
        
        db.all(query, [], (err, rows) => {
          if (err) {
            console.log(err)
          } else {
            
            res.send(rows)
            res.end()
          
          }
        })
      //})
    })

  }catch( err ) {
    console.log("sqlite_query="+err);
    res.send(err)
    res.end()
  } 

 

})

router.get('/opg/sqlite_query', async function (req, res) {

  query=req.query.query

  
  console.log("pasa")

  //if(db!=null) db.close()

  //db = new sqlite.Database('public/images/geo/prueba.sqlite');

  
  try{
    db.spatialite(function(err) {

     // db.serialize(() => {
        
        db.all(query, [], (err, rows) => {
          if (err) {
            console.log(err)
          } else {
            
            res.send(rows)
            res.end()
          
          }
        })
      //})
    })

  }catch( err ) {
    console.log("sqlite_query="+err);
    res.send(err)
    res.end()
  } 

});


router.get('/opg/sqlite_query_geojson_exec', async function (req, res) {

  table=req.query.table
  filter=req.query.filter
  fieldsSQL=req.query.fieldsSQL
  crs=req.query.crs

  console.log("llega")
  console.log(table)
  console.log(filter)
  console.log(fieldsSQL)
  console.log(crs)

  //crs="25831"

  var geojson = {
    //"name":"NewFeatureType",
    "type":"FeatureCollection",
    "features":[]
  };

  var query =`SELECT AsGeoJSON(Transform(the_geom,`+crs+`)) As geometry ,json_object(`+fieldsSQL+`) as properties FROM `+table+filter

  try{
    db.spatialite(function(err) {
      db.all(query, [], (err, rows) => {
        if (err) {
          console.log(err)
        } else {
          rows.forEach((row) => {
      
            var features={
              "type":"Feature",
              "geometry":null,
              "properties":null
            }
            
            features.geometry=JSON.parse(row.geometry)
            features.properties=JSON.parse(row.properties)
            geojson.features.push(features)
           // console.log(features.properties)
          });
      
          res.send(geojson)
          res.end()
        
        }
      })
    })

  }catch( err ) {
    console.log("sqlite_query_exec="+err);
  } 

});

function getFormattedUrl(req) {
  return url.format({
      protocol: req.protocol,
      host: req.get('host')
  });
}

router.get('/opg/sqlite_query_geojson', async function (req, res) {

  table=req.query.table
  filter=req.query.filter
  fields=req.query.fields
  crs=req.query.crs

  var arrayFields=null
  var fieldsSQL=""

  if(crs==null) crs="4326"

  if(filter!=null) 
    filter=' where '+filter
  else
    filter=''

  if(fields==null){

    try{

      let url = new URL(getFormattedUrl(req)+"/opg/sqlite_query");
      const params = {query:"SELECT name,type FROM pragma_table_info('"+table+"')"};
      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
      const dataRequest = {
          method: 'GET'
      };
      var response = await fetch(url,dataRequest);
      var geojsonRES = await response.json(); 
      console.log(geojsonRES[0].type)

      for(n=0;n<geojsonRES.length;n++){
        if(geojsonRES[n].type!="MULTIPOLYGON"){
          if(n>0)
            fieldsSQL=fieldsSQL+","
          
          fieldsSQL=fieldsSQL+"'"+geojsonRES[n].name+"',"+geojsonRES[n].name
        }
          
      }
     
    }catch( err ) {
      console.log("sqlite_query="+err);
    } 

  }else{
    arrayFields=fields.split(',')
    for(n=0;n<arrayFields.length;n++){
      if(n>0)
        fieldsSQL=fieldsSQL+","
      
      fieldsSQL=fieldsSQL+"'"+arrayFields[n]+"',"+arrayFields[n]
        
    }
  }

  try{

    let url = new URL(getFormattedUrl(req)+"/opg/sqlite_query_geojson_exec");
    const params = {crs: crs,table: table, filter: filter, fieldsSQL: fieldsSQL};
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    const dataRequest = {
        method: 'GET'
    };
    var response = await fetch(url,dataRequest);
    geojsonRES = await response.json(); 
  
    res.send(geojsonRES)
    res.end()
   
  }catch( err ) {
    console.log("sqlite_query_geojson="+err);
  } 


});


router.get('/opg/postgis_query_geojson', function (req, res) {
 
  table=req.query.table
  filter=req.query.filter
  fields=req.query.fields
  crs=req.query.crs

  if(filter!=null) 
    filter=' where '+filter
  else
    filter=''

  if(fields==null)
    fields="*"
  else{
    fields_array=fields.split(',')
    
    if(!fields_array.includes('fid')) fields="fid,"+fields
  }


  if(crs==null) crs="4326"

  
  var s_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,"+crs+"))::json As geometry , row_to_json(lp) As properties FROM "+table+"  As lg INNER JOIN (SELECT "+fields+" FROM "+table+filter+" ) As lp ON lg.fid = lp.fid ) As f ) As fc"
 
   var query = clientFASE1.query(new Query(s_query));
   query.on("row", function (row, result) {
       result.addRow(row);
   });
   query.on("end", function (result) {
       res.send(result.rows[0].row_to_json);
       res.end();
   }); 
 });





/*

var contenido = `
<h1>Esto es un test de html-pdf</h1>
<p>Estoy generando PDF a partir de este código HTML sencillo</p>
`;

pdf.create(contenido).toFile('./salida.pdf', function(err, res) {
    if (err){
        console.log(err);
    } else {
        console.log(res);
        res.sendFile(data);
    
    }
}); */

// end prueba pdf

var res_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM zona_residencial As lg INNER JOIN (SELECT * FROM zona_residencial) As lp ON lg.fid = lp.fid ) As f ) As fc"



async function createPDF()
{
  var contenido = `
  <h1>Esto es un test modificado de html-pdf</h1>
  <p>Estoy generando PDF a partir de este código HTML sencillo</p>
  `;

  pdf.create(contenido).toFile('./salida.pdf', function(err, resPDF) {
    if (err){
        console.log(err);
    } else {
        console.log(resPDF);
        
       
    }
  });

}

async function createPDF1()
{
  
  await createPDF()
}


router.get('/opg/create_pdf', function (req, res) {

  console.log("pasa");

  

  var contenido=req.query.contenido;

  /* var contenido = `
  <h1>al final si html-pdf</h1>
  <p>Estoy generando PDF a partir de este código HTML sencillo</p>
  `; */

  pdf.create(contenido).toFile('./public/opg/images/salida.pdf', function(err, resPDF) {
    if (err){
        console.log(err);
    } else {
        console.log(resPDF);
       // res.end()

       fs.readFile('./public/opg/images/salida.pdf', (err, data) => {

     
        if(err) return console.error(err);
  
        //console.log(data)
       
        res.contentType("application/pdf");
        
        res.send(data);
      // res.sendFile("c:/personal/dusp/pg_mapper/salida.pdf")
        res.end();
  
      });
        
       
    }
  })
  

});






/* GET home page. */
router.get('/', function(req, res, next) {
  var params=req.query
  console.log(req.query.filter);
  res.render('index', { title: 'Express' });
});

router.get('/prueba', (req, res, next) => {
  console.log(req.query);
});


/* GET Postgres JSON data */
router.get('/data', function (req, res) {
  var client = new Client(conString);
  client.connect();
  var query = client.query(new Query(res_query));
  query.on("row", function (row, result) {
      result.addRow(row);
  });
  query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end(); 
  });
});

/* GET Postgres JSON data slel */
router.get('/geojson_slel', function (req, res) {
 // var client = new Client(conString);
 // client.connect();
 var slel_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM slocal_espacioslibres_publicos  As lg INNER JOIN (SELECT * FROM slocal_espacioslibres_publicos ) As lp ON lg.fid = lp.fid ) As f ) As fc"

  var query = client.query(new Query(slel_query));
  query.on("row", function (row, result) {
      result.addRow(row);
  });
  query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
  });
});

/* GET Postgres JSON data client */
router.get('/geojson', function (req, res) {
 
  var table=req.query.table;
  console.log("paix="+table)
  var slel_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM "+table+"  As lg INNER JOIN (SELECT * FROM "+table+" ) As lp ON lg.fid = lp.fid ) As f ) As fc"
 
   var query = client.query(new Query(slel_query));
   query.on("row", function (row, result) {
       result.addRow(row);
   });
   query.on("end", function (result) {
       res.send(result.rows[0].row_to_json);
       res.end();
   }); 
 });

// end geojson

/* GET Postgres JSON data clientFASE1 */
router.get('/geojson_fase1', function (req, res) {
 
  var table=req.query.table;
  console.log("paix="+table)
  var s_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM "+table+"  As lg INNER JOIN (SELECT * FROM "+table+" ) As lp ON lg.fid = lp.fid ) As f ) As fc"
 
   var query = clientFASE1.query(new Query(s_query));
   query.on("row", function (row, result) {
       result.addRow(row);
   });
   query.on("end", function (result) {
       res.send(result.rows[0].row_to_json);
       res.end();
   }); 
 });


router.get('/opg/geojson_ai', function (req, res) {
 
  var table=req.query.table;
  console.log("paix="+table)
  var s_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM "+table+"  As lg INNER JOIN (SELECT * FROM "+table+" ) As lp ON lg.fid = lp.fid ) As f ) As fc"
 
   var query = clientFASE1.query(new Query(s_query));
   query.on("row", function (row, result) {
       result.addRow(row);
   });
   query.on("end", function (result) {
       res.send(result.rows[0].row_to_json);
       res.end();
   }); 
 });

// end geojson

const SphericalMercator = require("sphericalmercator");
const { Console } = require('console');
const { json } = require('express');
const mercator = new SphericalMercator()

/* GET Postgres vector tiles */
router.get("/mvt_pg/:x/:y/:z", function(req, res) {
  let bbox = mercator.bbox(req.params.x, req.params.y, req.params.z)
 // console.log(bbox.join(", "))

  const sql = `
    SELECT ST_AsMVT(q, 'pg', 4096, 'the_geom')
      FROM (
          SELECT
              fid,
              entidad,
              calificacion,
              ST_AsMVTGeom(
                  the_geom,
                  TileBBox(${req.params.z}, ${req.params.x}, ${req.params.y}, 25831),
                  4096,
                  0,
                  false
              ) the_geom
          FROM plan_general1
          WHERE ST_Intersects(the_geom, (SELECT ST_Transform(ST_MakeEnvelope($1, $2, $3, $4, $5), 25831)))
      ) q`
  
  const values = [bbox[0], bbox[1], bbox[2], bbox[3], 4326]
 
  client.query(sql, values , function(err, mvt) {
    if (err) {
        console.log(err)
    } else {
        res.setHeader('Content-Type', 'application/x-protobuf')
        res.send(mvt.rows[0].st_asmvt)
    }
  })

})





router.get("/mvt/:x/:y/:z", function(req, res) {
  let bbox = mercator.bbox(req.params.x, req.params.y, req.params.z)
 // console.log(bbox.join(", "))

  const sql = `
    SELECT ST_AsMVT(q, 'equipamientos', 4096, 'the_geom')
      FROM (
          SELECT
              fid,
              codigo,
              ST_AsMVTGeom(
                  the_geom,
                  TileBBox(${req.params.z}, ${req.params.x}, ${req.params.y}, 25831),
                  4096,
                  0,
                  false
              ) the_geom
          FROM slocal_equipamientos
          WHERE ST_Intersects(the_geom, (SELECT ST_Transform(ST_MakeEnvelope($1, $2, $3, $4, $5), 25831)))
      ) q`
  
  const values = [bbox[0], bbox[1], bbox[2], bbox[3], 4326]
 
  client.query(sql, values , function(err, mvt) {
    if (err) {
        console.log(err)
    } else {
        res.setHeader('Content-Type', 'application/x-protobuf')
        res.send(mvt.rows[0].st_asmvt)
    }
  })

}) 


router.get("/mvt_res/:x/:y/:z", function(req, res) {
  let bbox = mercator.bbox(req.params.x, req.params.y, req.params.z)
 // console.log(bbox.join(", "))

  const sql = `
    SELECT ST_AsMVT(q, 'residencial', 4096, 'the_geom')
      FROM (
          SELECT
              fid,
              codigo,
              ST_X(ST_Transform(ST_Centroid(the_geom),4326)),
              ST_Y(ST_Transform(ST_Centroid(the_geom),4326)),
              ST_AsMVTGeom(
                  the_geom,
                  TileBBox(${req.params.z}, ${req.params.x}, ${req.params.y}, 25831),
                  4096,
                  0,
                  false
              ) the_geom
          FROM zona_residencial_1
          WHERE ST_Intersects(the_geom, (SELECT ST_Transform(ST_MakeEnvelope($1, $2, $3, $4, $5), 25831)))
      ) q`
  
  const values = [bbox[0], bbox[1], bbox[2], bbox[3], 4326]
 
  client.query(sql, values , function(err, mvt) {
    if (err) {
        console.log(err)
    } else {
        res.setHeader('Content-Type', 'application/x-protobuf')
        res.send(mvt.rows[0].st_asmvt)
    }
  })

})

router.get("/mvt_constru/:x/:y/:z", function(req, res) {
  let bbox = mercator.bbox(req.params.x, req.params.y, req.params.z)
 // console.log(bbox.join(", "))

  const sql = `
    SELECT ST_AsMVT(q, 'constru', 4096, 'the_geom')
      FROM (
          SELECT
              fid,
              ST_X(ST_Transform(ST_Centroid(the_geom),4326)),
              ST_Y(ST_Transform(ST_Centroid(the_geom),4326)),
              ST_AsMVTGeom(
                  the_geom,
                  TileBBox(${req.params.z}, ${req.params.x}, ${req.params.y}, 25831),
                  4096,
                  0,
                  false
              ) the_geom
          FROM constru_su2
          WHERE ST_Intersects(the_geom, (SELECT ST_Transform(ST_MakeEnvelope($1, $2, $3, $4, $5), 25831)))
      ) q`
  
  const values = [bbox[0], bbox[1], bbox[2], bbox[3], 4326]
 
  client.query(sql, values , function(err, mvt) {
    if (err) {
        console.log(err)
    } else {
        res.setHeader('Content-Type', 'application/x-protobuf')
        res.send(mvt.rows[0].st_asmvt)
    }
  })

})

router.get("/mvt_sec/:x/:y/:z", function(req, res) {
  let bbox = mercator.bbox(req.params.x, req.params.y, req.params.z)
 // console.log(bbox.join(", "))

  const sql = `
    SELECT ST_AsMVT(q, 'sec', 4096, 'the_geom')
      FROM (
          SELECT
              fid,
              ST_X(ST_Transform(ST_Centroid(the_geom),4326)),
              ST_Y(ST_Transform(ST_Centroid(the_geom),4326)),
              ST_AsMVTGeom(
                  the_geom,
                  TileBBox(${req.params.z}, ${req.params.x}, ${req.params.y}, 25831),
                  4096,
                  0,
                  false
              ) the_geom
          FROM zona_secundaria
          WHERE ST_Intersects(the_geom, (SELECT ST_Transform(ST_MakeEnvelope($1, $2, $3, $4, $5), 25831)))
      ) q`
  
  const values = [bbox[0], bbox[1], bbox[2], bbox[3], 4326]
 
  client.query(sql, values , function(err, mvt) {
    if (err) {
        console.log(err)
    } else {
        res.setHeader('Content-Type', 'application/x-protobuf')
        res.send(mvt.rows[0].st_asmvt)
    }
  })

})

router.get("/mvt_layers/:x/:y/:z", function(req, res) {
  let bbox = mercator.bbox(req.params.x, req.params.y, req.params.z)
 // console.log(bbox.join(", "))
  

  const sql = `
    SELECT ST_AsMVT(q, 'layer', 4096, 'the_geom')
      FROM (
          SELECT
              fid,
              codigo,
              ST_X(ST_Transform(ST_Centroid(the_geom),4326)),
              ST_Y(ST_Transform(ST_Centroid(the_geom),4326)),
              ST_AsMVTGeom(
                  the_geom,
                  TileBBox(${req.params.z}, ${req.params.x}, ${req.params.y}, 25831),
                  4096,
                  0,
                  false
              ) the_geom
          FROM ${req.query.table}
          WHERE ST_Intersects(the_geom, (SELECT ST_Transform(ST_MakeEnvelope($1, $2, $3, $4, $5), 25831)))
      ) q`
  
  const values = [bbox[0], bbox[1], bbox[2], bbox[3], 4326]
 
  client.query(sql, values , function(err, mvt) {
    if (err) {
        console.log(err)
    } else {
        res.setHeader('Content-Type', 'application/x-protobuf')
        res.send(mvt.rows[0].st_asmvt)
    }
  })

})

router.get("/mvt_layers2/:x/:y/:z", function(req, res) {
  let bbox = mercator.bbox(req.params.x, req.params.y, req.params.z)
 // console.log(bbox.join(", "))
  

  const sql = `
    SELECT ST_AsMVT(q, 'layer', 4096, 'the_geom')
      FROM (
          SELECT
              ${req.query.fields},
              ST_X(ST_Transform(ST_Centroid(the_geom),4326)),
              ST_Y(ST_Transform(ST_Centroid(the_geom),4326)),
              ST_AsMVTGeom(
                  the_geom,
                  TileBBox(${req.params.z}, ${req.params.x}, ${req.params.y}, 25831),
                  4096,
                  0,
                  false
              ) the_geom
          FROM ${req.query.table}
          WHERE ST_Intersects(the_geom, (SELECT ST_Transform(ST_MakeEnvelope($1, $2, $3, $4, $5), 25831)))
      ) q`
  
  const values = [bbox[0], bbox[1], bbox[2], bbox[3], 4326]
 
  client.query(sql, values , function(err, mvt) {
    if (err) {
        console.log(err)
    } else {
        res.setHeader('Content-Type', 'application/x-protobuf')
        res.send(mvt.rows[0].st_asmvt)
    }
  })

})



router.get("/mvt_urbanizable/:x/:y/:z", function(req, res) {
  let bbox = mercator.bbox(req.params.x, req.params.y, req.params.z)
 // console.log(bbox.join(", "))
  

  const sql = `
    SELECT ST_AsMVT(q, 'layer', 4096, 'the_geom')
      FROM (
          SELECT
              fid,
              uso,
              ST_X(ST_Transform(ST_Centroid(the_geom),4326)),
              ST_Y(ST_Transform(ST_Centroid(the_geom),4326)),
              ST_AsMVTGeom(
                  the_geom,
                  TileBBox(${req.params.z}, ${req.params.x}, ${req.params.y}, 25831),
                  4096,
                  0,
                  false
              ) the_geom
          FROM ${req.query.table}
          WHERE ST_Intersects(the_geom, (SELECT ST_Transform(ST_MakeEnvelope($1, $2, $3, $4, $5), 25831)))
      ) q`
  
  const values = [bbox[0], bbox[1], bbox[2], bbox[3], 4326]
 
  client.query(sql, values , function(err, mvt) {
    if (err) {
        console.log(err)
    } else {
        res.setHeader('Content-Type', 'application/x-protobuf')
        res.send(mvt.rows[0].st_asmvt)
    }
  })

})



router.get("/mvt_lsz/:x/:y/:z", function(req, res) {
  let bbox = mercator.bbox(req.params.x, req.params.y, req.params.z)
 // console.log(bbox.join(", "))

  const sql = `
    SELECT ST_AsMVT(q, 'lsz', 4096, 'the_geom')
      FROM (
          SELECT
              fid,
              ST_X(ST_Transform(ST_Centroid(the_geom),4326)),
              ST_Y(ST_Transform(ST_Centroid(the_geom),4326)),
              ST_AsMVTGeom(
                  the_geom,
                  TileBBox(${req.params.z}, ${req.params.x}, ${req.params.y}, 25831),
                  4096,
                  0,
                  false
              ) the_geom
          FROM lineas_separacion_zonas
          WHERE ST_Intersects(the_geom, (SELECT ST_Transform(ST_MakeEnvelope($1, $2, $3, $4, $5), 25831)))
      ) q`
  
  const values = [bbox[0], bbox[1], bbox[2], bbox[3], 4326]
 
  client.query(sql, values , function(err, mvt) {
    if (err) {
        console.log(err)
    } else {
        res.setHeader('Content-Type', 'application/x-protobuf')
        res.send(mvt.rows[0].st_asmvt)
    }
  })

})




router.get("/mvt_sgeq/:x/:y/:z", function(req, res) {
  let bbox = mercator.bbox(req.params.x, req.params.y, req.params.z)
 // console.log(bbox.join(", "))

  const sql = `
    SELECT ST_AsMVT(q, 'sgeq', 4096, 'the_geom')
      FROM (
          SELECT
              fid,
              ST_AsMVTGeom(
                  the_geom,
                  TileBBox(${req.params.z}, ${req.params.x}, ${req.params.y}, 25831),
                  4096,
                  0,
                  false
              ) the_geom
          FROM sgeneral_equipamientos
          WHERE ST_Intersects(the_geom, (SELECT ST_Transform(ST_MakeEnvelope($1, $2, $3, $4, $5), 25831)))
      ) q`
  
  const values = [bbox[0], bbox[1], bbox[2], bbox[3], 4326]
 
  client.query(sql, values , function(err, mvt) {
    if (err) {
        console.log(err)
    } else {
        res.setHeader('Content-Type', 'application/x-protobuf')
        res.send(mvt.rows[0].st_asmvt)
    }
  })

})


router.get("/mvt_sgel/:x/:y/:z", function(req, res) {
  let bbox = mercator.bbox(req.params.x, req.params.y, req.params.z)
 // console.log(bbox.join(", "))

  const sql = `
    SELECT ST_AsMVT(q, 'sgel', 4096, 'the_geom')
      FROM (
          SELECT
              fid,
              codigo,
              ST_AsMVTGeom(
                  the_geom,
                  TileBBox(${req.params.z}, ${req.params.x}, ${req.params.y}, 25831),
                  4096,
                  0,
                  false
              ) the_geom
          FROM sgeneral_espacioslibres
          WHERE ST_Intersects(the_geom, (SELECT ST_Transform(ST_MakeEnvelope($1, $2, $3, $4, $5), 25831)))
      ) q`
  
  const values = [bbox[0], bbox[1], bbox[2], bbox[3], 4326]
 
  client.query(sql, values , function(err, mvt) {
    if (err) {
        console.log(err)
    } else {
        res.setHeader('Content-Type', 'application/x-protobuf')
        res.send(mvt.rows[0].st_asmvt)
    }
  })

})


router.get("/mvt_slel/:x/:y/:z", function(req, res) {
  let bbox = mercator.bbox(req.params.x, req.params.y, req.params.z)
 // console.log(bbox.join(", "))

  const sql = `
    SELECT ST_AsMVT(q, 'slel', 4096, 'the_geom')
      FROM (
          SELECT
              fid,
              codigo,
              ST_AsMVTGeom(
                  the_geom,
                  TileBBox(${req.params.z}, ${req.params.x}, ${req.params.y}, 25831),
                  4096,
                  0,
                  false
              ) the_geom
          FROM slocal_espacioslibres_publicos
          WHERE ST_Intersects(the_geom, (SELECT ST_Transform(ST_MakeEnvelope($1, $2, $3, $4, $5), 25831)))
      ) q`
  
  const values = [bbox[0], bbox[1], bbox[2], bbox[3], 4326]
 
  client.query(sql, values , function(err, mvt) {
    if (err) {
        console.log(err)
    } else {
        res.setHeader('Content-Type', 'application/x-protobuf')
        res.send(mvt.rows[0].st_asmvt)
    }
  })

})


router.get("/mvt_slci/:x/:y/:z", function(req, res) {
  let bbox = mercator.bbox(req.params.x, req.params.y, req.params.z)
 // console.log(bbox.join(", "))

  const sql = `
    SELECT ST_AsMVT(q, 'slci', 4096, 'the_geom')
      FROM (
          SELECT
              fid,
              codigo,
              ST_AsMVTGeom(
                  the_geom,
                  TileBBox(${req.params.z}, ${req.params.x}, ${req.params.y}, 25831),
                  4096,
                  0,
                  false
              ) the_geom
          FROM slocal_comunicaciones_infraestructuras
          WHERE ST_Intersects(the_geom, (SELECT ST_Transform(ST_MakeEnvelope($1, $2, $3, $4, $5), 25831)))
      ) q`
  
  const values = [bbox[0], bbox[1], bbox[2], bbox[3], 4326]
 
  client.query(sql, values , function(err, mvt) {
    if (err) {
        console.log(err)
    } else {
        res.setHeader('Content-Type', 'application/x-protobuf')
        res.send(mvt.rows[0].st_asmvt)
    }
  })

})


router.get("/mvt_sgci/:x/:y/:z", function(req, res) {
  let bbox = mercator.bbox(req.params.x, req.params.y, req.params.z)
 // console.log(bbox.join(", "))

  const sql = `
    SELECT ST_AsMVT(q, 'sgci', 4096, 'the_geom')
      FROM (
          SELECT
              fid,
              ST_AsMVTGeom(
                  the_geom,
                  TileBBox(${req.params.z}, ${req.params.x}, ${req.params.y}, 25831),
                  4096,
                  0,
                  false
              ) the_geom
          FROM sgeneral_comunicaciones_infraestructuras
          WHERE ST_Intersects(the_geom, (SELECT ST_Transform(ST_MakeEnvelope($1, $2, $3, $4, $5), 25831)))
      ) q`
  
  const values = [bbox[0], bbox[1], bbox[2], bbox[3], 4326]
 
  client.query(sql, values , function(err, mvt) {
    if (err) {
        console.log(err)
    } else {
        res.setHeader('Content-Type', 'application/x-protobuf')
        res.send(mvt.rows[0].st_asmvt)
    }
  })

})


router.get("/mvt_nr/:x/:y/:z", function(req, res) {
  let bbox = mercator.bbox(req.params.x, req.params.y, req.params.z)
 // console.log(bbox.join(", "))

  const sql = `
    SELECT ST_AsMVT(q, 'nr', 4096, 'the_geom')
      FROM (
          SELECT
              fid,
              codigo,
              ST_AsMVTGeom(
                  the_geom,
                  TileBBox(${req.params.z}, ${req.params.x}, ${req.params.y}, 25831),
                  4096,
                  0,
                  false
              ) the_geom
          FROM zonas_centro_historico
          WHERE ST_Intersects(the_geom, (SELECT ST_Transform(ST_MakeEnvelope($1, $2, $3, $4, $5), 25831)))
      ) q`
  
  const values = [bbox[0], bbox[1], bbox[2], bbox[3], 4326]
 
  client.query(sql, values , function(err, mvt) {
    if (err) {
        console.log(err)
    } else {
        res.setHeader('Content-Type', 'application/x-protobuf')
        res.send(mvt.rows[0].st_asmvt)
    }
  })

})


router.get("/mvt_api/:x/:y/:z", function(req, res) {
  let bbox = mercator.bbox(req.params.x, req.params.y, req.params.z)
 // console.log(bbox.join(", "))

  const sql = `
    SELECT ST_AsMVT(q, 'api', 4096, 'the_geom')
      FROM (
          SELECT
              fid,
              ST_AsMVTGeom(
                  the_geom,
                  TileBBox(${req.params.z}, ${req.params.x}, ${req.params.y}, 25831),
                  4096,
                  0,
                  false
              ) the_geom
          FROM api
          WHERE ST_Intersects(the_geom, (SELECT ST_Transform(ST_MakeEnvelope($1, $2, $3, $4, $5), 25831)))
      ) q`
  
  const values = [bbox[0], bbox[1], bbox[2], bbox[3], 4326]
 
  client.query(sql, values , function(err, mvt) {
    if (err) {
        console.log(err)
    } else {
        res.setHeader('Content-Type', 'application/x-protobuf')
        res.send(mvt.rows[0].st_asmvt)
    }
  })

})


router.get("/mvt_are/:x/:y/:z", function(req, res) {
  let bbox = mercator.bbox(req.params.x, req.params.y, req.params.z)
 // console.log(bbox.join(", "))

  const sql = `
    SELECT ST_AsMVT(q, 'are', 4096, 'the_geom')
      FROM (
          SELECT
              fid,
              ST_AsMVTGeom(
                  the_geom,
                  TileBBox(${req.params.z}, ${req.params.x}, ${req.params.y}, 25831),
                  4096,
                  0,
                  false
              ) the_geom
          FROM area_regimen_especial
          WHERE ST_Intersects(the_geom, (SELECT ST_Transform(ST_MakeEnvelope($1, $2, $3, $4, $5), 25831)))
      ) q`
  
  const values = [bbox[0], bbox[1], bbox[2], bbox[3], 4326]
 
  client.query(sql, values , function(err, mvt) {
    if (err) {
        console.log(err)
    } else {
        res.setHeader('Content-Type', 'application/x-protobuf')
        res.send(mvt.rows[0].st_asmvt)
    }
  })

})

 
 router.get("/mvt_ue/:x/:y/:z", function(req, res) {
  let bbox = mercator.bbox(req.params.x, req.params.y, req.params.z)
 // console.log(bbox.join(", "))

  const sql = `
    SELECT ST_AsMVT(q, 'ue', 4096, 'the_geom')
      FROM (
          SELECT
              fid,
              ST_AsMVTGeom(
                  the_geom,
                  TileBBox(${req.params.z}, ${req.params.x}, ${req.params.y}, 25831),
                  4096,
                  0,
                  false
              ) the_geom
          FROM unidad_ejecucion
          WHERE ST_Intersects(the_geom, (SELECT ST_Transform(ST_MakeEnvelope($1, $2, $3, $4, $5), 25831)))
      ) q`
  
  const values = [bbox[0], bbox[1], bbox[2], bbox[3], 4326]
 
  client.query(sql, values , function(err, mvt) {
    if (err) {
        console.log(err)
    } else {
        res.setHeader('Content-Type', 'application/x-protobuf')
        res.send(mvt.rows[0].st_asmvt)
    }
  })

})



router.get("/mvt_ed/:x/:y/:z", function(req, res) {
  let bbox = mercator.bbox(req.params.x, req.params.y, req.params.z)
 // console.log(bbox.join(", "))

  const sql = `
    SELECT ST_AsMVT(q, 'ed', 4096, 'the_geom')
      FROM (
          SELECT
              fid,
              ST_AsMVTGeom(
                  the_geom,
                  TileBBox(${req.params.z}, ${req.params.x}, ${req.params.y}, 25831),
                  4096,
                  0,
                  false
              ) the_geom
          FROM estudios_detalle_corregido
          WHERE ST_Intersects(the_geom, (SELECT ST_Transform(ST_MakeEnvelope($1, $2, $3, $4, $5), 25831)))
      ) q`
  
  const values = [bbox[0], bbox[1], bbox[2], bbox[3], 4326]
 
  client.query(sql, values , function(err, mvt) {
    if (err) {
        console.log(err)
    } else {
        res.setHeader('Content-Type', 'application/x-protobuf')
        res.send(mvt.rows[0].st_asmvt)
    }
  })

})


router.get("/mvt_all/:x/:y/:z", function(req, res) {
  let bbox = mercator.bbox(req.params.x, req.params.y, req.params.z)
 // console.log(bbox.join(", "))

  const sql = `

    SELECT ST_AsMVT(q, 'slci', 4096, 'the_geom')
      FROM (
          SELECT
              fid,
              ST_AsMVTGeom(
                  the_geom,
                  TileBBox(${req.params.z}, ${req.params.x}, ${req.params.y}, 25831),
                  4096,
                  0,
                  false
              ) the_geom
          FROM slocal_comunicaciones_infraestructuras
          WHERE ST_Intersects(the_geom, (SELECT ST_Transform(ST_MakeEnvelope($1, $2, $3, $4, $5), 25831)))
      )q
    UNION
    SELECT ST_AsMVT(q, 'sgci', 4096, 'the_geom')
      FROM (
          SELECT
              fid,
              ST_AsMVTGeom(
                  the_geom,
                  TileBBox(${req.params.z}, ${req.params.x}, ${req.params.y}, 25831),
                  4096,
                  0,
                  false
              ) the_geom
          FROM sgeneral_comunicaciones_infraestructuras
          WHERE ST_Intersects(the_geom, (SELECT ST_Transform(ST_MakeEnvelope($1, $2, $3, $4, $5), 25831)))
      )q `

  
  
  const values = [bbox[0], bbox[1], bbox[2], bbox[3], 4326]
 
  client.query(sql, values , function(err, mvt) {
    if (err) {
        console.log(err)
    } else {
        res.setHeader('Content-Type', 'application/x-protobuf')

        var buffers = [];
        for (var i = 0; i < mvt.rows.length; i++) {
           buffers.push(mvt.rows[i].st_asmvt);
        }
        var finalbuffer = Buffer.concat(buffers)
        res.send(finalbuffer); 
       // console.log(mvt.rows.st_asmvt);
     //   res.send(mvt.rows.st_asmvt)
    }
  })

})  


/* SET data users */
router.get('/write_data_user', function (req, res) {
  // var client = new Client(conString);
 
 
 
  try{ 
    var accion=req.query.accion;
    var x=req.query.x;
    var y=req.query.y;
    var lat=req.query.lat;
    var lng=req.query.lng;

    //var latlng=req.query.latlng;
    console.log(x,y);
    console.log(req.query.lat);

     /*const locData = clientIPDATA.lookup(ip);
  console.log(locData);*/
  
  //console.log("The IP is %s", geoip.pretty(ip));

    var ip = req.headers['x-forwarded-for'] || 
        req.connection.remoteAddress || 
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
        console.log(ip);

    var geo = geoip.lookup(ip);
    date_ob = new Date();

 
    
    console.log(date_ob.getDate());
    console.log(geo);
    console.log(geo.country);
    console.log(geo.region);
    console.log(geo.city);
    console.log(geo.area);

    client.query('INSERT INTO users_visor (ip,country,region,city,area,date_obj,day,month,year,hour,minute,second,action,lat,lng,utm_x,utm_y) VALUES ($1, $2 ,$3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)',
          [ip, geo.country,geo.region,geo.city,geo.area,date_ob,date_ob.getDate(),date_ob.getMonth()+1,date_ob.getFullYear(),date_ob.getHours(),date_ob.getMinutes(),date_ob.getSeconds(),accion, lat,lng , x, y], (error, results) => {
      if (error) {
        throw error
      }
      res.status(201).send(`User added with ID: ${results.insertId}`)
    })
  

  }catch( err ) {
    console.log("Error en servicio equipamientos="+err);
  }  
});

router.get('/opg/write_data_user', function (req, res) {
  // var client = new Client(conString);
 
 
 
  try{ 
    var accion=req.query.accion;
    var x=req.query.x;
    var y=req.query.y;
    var lat=req.query.lat;
    var lng=req.query.lng;

    //var latlng=req.query.latlng;
    console.log(x,y);
    console.log(req.query.lat);

     /*const locData = clientIPDATA.lookup(ip);
  console.log(locData);*/
  
  //console.log("The IP is %s", geoip.pretty(ip));

    var ip = req.headers['x-forwarded-for'] || 
        req.connection.remoteAddress || 
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
        console.log(ip);

    var geo = geoip.lookup(ip);
    date_ob = new Date();

 
    console.log(date_ob.getDate());
    console.log(geo);
    console.log(geo.country);
    console.log(geo.region);
    console.log(geo.city);
    console.log(geo.area);

    client.query('INSERT INTO users_visor (ip,country,region,city,area,date_obj,day,month,year,hour,minute,second,action,lat,lng,utm_x,utm_y) VALUES ($1, $2 ,$3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)',
          [ip, geo.country,geo.region,geo.city,geo.area,date_ob,date_ob.getDate(),date_ob.getMonth()+1,date_ob.getFullYear(),date_ob.getHours(),date_ob.getMinutes(),date_ob.getSeconds(),accion, lat,lng , x, y], (error, results) => {
      if (error) {
        throw error
      }
      res.status(201).send(`User added with ID: ${results.insertId}`)
      res.end
    })
  

  }catch( err ) {
    console.log("Error en write_users="+err);
  }  
});

router.get('/opg/write_data_user_cross', async function (req, res) {

  var accion=req.query.accion;
  var x=req.query.x;
  var y=req.query.y;
  var lat=req.query.lat;
  var lng=req.query.lng;

  var protocol_server=req.query.server

  geojsonRES=null

  try{

    let url = new URL(protocol_server+"/opg/write_data_user");
    const params = {accion: accion, x: x, y: y,lat:lat,lng:lng};
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    const dataRequest = {
        method: 'GET'
    };
    fetch(url,dataRequest);
    // console.log(response);
    //geojsonRES = await response.json();

   
  }catch( err ) {
    console.log("Error en llamada cross="+err);
  } 

  
  //res.send(geojsonRES);
  res.end();

});



/* GET Postgres JSON data tables */
router.get('/infoXY', function (req, res) {
  // var client = new Client(conString);
 
 
  try{ 
    var tabla=req.query.tabla;
    var x=req.query.x;
    var y=req.query.y;
  
    var queryXY = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM "+tabla+" As lg INNER JOIN (SELECT * FROM "+tabla+" where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"
 

     // sleq_query=sleq_query+" where "+req.query.filter

    var query = client.query(new Query(queryXY));
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    });

  }catch( err ) {
    console.log("Error en servicio equipamientos="+err);
  }  
});


router.get('/opg/sqlite_findInLayer', async function (req, res) {

  var tabla=req.query.tabla;
  var x=req.query.x;
  var y=req.query.y;

  
    
    var find
    var queryXY = "SELECT fid FROM "+tabla+" where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))"


    try{
      db.spatialite(function(err) {
  
       // db.serialize(() => {
          
          db.all(queryXY, [], (err, rows) => {
            if (err) {
              console.log(err)
            } else {

              if(rows[0]!=null) 
                find=true
              else
                find=false
              
              res.send(find)
              res.end()
            
            }
          })
        
      })
  
    }catch( err ) {
      console.log("sqlite_query="+err);
      res.send(err)
      res.end()
    } 


});


router.get('/opg/findInLayer', async function (req, res) {

  var tabla=req.query.tabla;
  var x=req.query.x;
  var y=req.query.y;

  try{
   
    
    var find
    var queryXY = "SELECT fid FROM "+tabla+" where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))"


    var query =  clientFASE1.query(new Query(queryXY));
    /*query.on("row", function (row, result) {

      result.addRow(row);
    }); */

   
     query.on("end",async function (result) {
        if(result.rows[0]!=null) 
          find=true
        else
          find=false
        res.send(find)
        res.end();

    });

    // SELECT * FROM "+tabla+" where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))
  }catch( err ) {
    console.log("Error read table="+err);
  } 

  

});

router.get('/opg/findLayers', async function (req, res) {

  var protocol_server=req.query.server
  var arrayTables=req.query.arrayTables
  var x=req.query.x;
  var y=req.query.y;

  console.log("array="+arrayTables)

  array=arrayTables.split(",")

  tabla=""

  arrayF=new Array()
  
  for(var p=0;p<array.length;p++){
    
   
      tabla=array[p]
      try{

        //let url = new URL("https://modeldeciutatgis-dev.palma.cat/opg/infoXY_FASE1");
        let url = new URL(protocol_server+"/opg/findInLayer");
        const params = {tabla: tabla, x: x, y: y};
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
        const dataRequest = {
            method: 'GET'
        };
        var response = await fetch(url,dataRequest);
      // console.log(response);
       geojsonRES = await response.json(); 
       //console.log(geojsonRES);

      if(geojsonRES==true) arrayF.push(tabla)
    
       
      }catch( err ) {
        console.log("Error en llamada cross="+err);
      } 
  
  }

  res.send(arrayF)
  res.end();

});


router.get('/opg/infoXY_FASE1_cross', async function (req, res) {

  var tabla=req.query.tabla;
  var x=req.query.x;
  var y=req.query.y;

  var protocol_server=req.query.server

  geojsonRES=null

  try{

    //let url = new URL("https://modeldeciutatgis-dev.palma.cat/opg/infoXY_FASE1");
    let url = new URL(protocol_server+"/opg/infoXY_FASE1");
    const params = {tabla: tabla, x: x, y: y};
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    const dataRequest = {
        method: 'GET'
    };
    var response = await fetch(url,dataRequest);
    // console.log(response);
    geojsonRES = await response.json();

   
  }catch( err ) {
    console.log("Error en llamada cross="+err);
  } 

  
  res.send(geojsonRES);
  res.end();

});




/* GET Postgres JSON data tables */
router.get('/opg/infoXY_FASE1', function (req, res) {
  // var client = new Client(conString);

 
  try{ 
    var tabla=req.query.tabla;
    var x=req.query.x;
    var y=req.query.y;

    //console.log("TABLA="+tabla)
  
    var queryXY = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM "+tabla+" As lg INNER JOIN (SELECT * FROM "+tabla+" where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"
 

    //console.log("pasa query jsonstryngfy")

    var query = clientFASE1.query(new Query(queryXY));
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    });

  }catch( err ) {
    console.log("Error en servicio equipamientos="+err);
  }  
});

router.get('/opg/distancePoint_FASE1', function (req, res) {
  // var client = new Client(conString);

 
  try{ 
    var tabla=req.query.tabla;
    var filter=req.query.filter;
    var x=req.query.x;
    var y=req.query.y;

    var distance=50

    //console.log("TABLA="+tabla)
  
    var queryXY = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM "+tabla+" As lg INNER JOIN (SELECT * FROM "+tabla+" where ST_DWITHIN(ST_GeomFromText('POINT("+x+" "+y+")',25831), the_geom,"+distance+") and "+filter+") As lp ON lg.fid = lp.fid ) As f ) As fc"
 
    //ST_DWITHIN(ST_GeomFromText('POINT("+x+" "+y+")',25831)), the_geom, `+distance+`)

    //console.log("pasa query jsonstryngfy")

    var query = clientFASE1.query(new Query(queryXY));
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    });

  }catch( err ) {
    console.log("Error en servicio equipamientos="+err);
  }  
});

/* GET Postgres JSON data sleq */
router.get('/sleq', function (req, res) {
  // var client = new Client(conString);
 
 
  try{ 
    var x=req.query.x;
    var y=req.query.y;
  
    var sleq_query2 = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM slocal_equipamientos As lg INNER JOIN (SELECT * FROM slocal_equipamientos where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"
 

     // sleq_query=sleq_query+" where "+req.query.filter

    var query = client.query(new Query(sleq_query2));
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    });

  }catch( err ) {
    console.log("Error en servicio equipamientos="+err);
  }  
});

 

/* GET Postgres JSON data sleq */
router.get('/sgeq', function (req, res) {
  
  try{ 
    var x=req.query.x;
    var y=req.query.y;
  
    var sgeq_query2 = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM sgeneral_equipamientos As lg INNER JOIN (SELECT * FROM sgeneral_equipamientos where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"
 
   // var query = client.query(new Query(sgeq_query2))

   var query =client.query(new Query(sgeq_query2));
     
     
    query.on("row", function (row, result) {
      
        result.addRow(row);
    
    });
    query.on("end", function (result) {
     
        res.send(result.rows[0].row_to_json);
        res.end();
   
    });

  }catch( err ) {
    console.log("Error en servicio sg equipamientos="+err);
  }  
});

/* GET Postgres JSON data slel */
router.get('/slel', function (req, res) {
  
  try{ 
    var x=req.query.x;
    var y=req.query.y;
  
    var slel_query2 = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM slocal_espacioslibres_publicos As lg INNER JOIN (SELECT * FROM slocal_espacioslibres_publicos where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"
 
    var query = client.query(new Query(slel_query2));
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    });

  }catch( err ) {
    console.log("Error en servicio sl espacios libres="+err);
  }  
});

/* GET Postgres JSON data sgel */
router.get('/sgel', function (req, res) {
  
  try{ 
    var x=req.query.x;
    var y=req.query.y;
  
    var sgel_query2 = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM sgeneral_espacioslibres As lg INNER JOIN (SELECT * FROM sgeneral_espacioslibres where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"
 
    var query = client.query(new Query(sgel_query2));
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    });

  }catch( err ) {
    console.log("Error en servicio sg espacios libres="+err);
  }  
});

/* GET Postgres JSON data sgel */
router.get('/slci', function (req, res) {
  
  try{ 
    var x=req.query.x;
    var y=req.query.y;
  
    var slci_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM slocal_comunicaciones_infraestructuras As lg INNER JOIN (SELECT * FROM slocal_comunicaciones_infraestructuras where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"
 
    var query = client.query(new Query(slci_query));
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    });

  }catch( err ) {
    console.log("Error en servicio sg espacios libres="+err);
  }  
});

/* GET Postgres JSON data sgci */
router.get('/sgci', function (req, res) {
  
  try{ 
    var x=req.query.x;
    var y=req.query.y;
  
    var sgci_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM sgeneral_comunicaciones_infraestructuras As lg INNER JOIN (SELECT * FROM sgeneral_comunicaciones_infraestructuras where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"
 
    var query = client.query(new Query(sgci_query));
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    });

  }catch( err ) {
    console.log("Error en servicio sg espacios libres="+err);
  }  
});

/* GET Postgres JSON data residencial */
router.get('/residencial', function (req, res) {
  
  try{ 
    var x=req.query.x;
    var y=req.query.y;
  
    var residencial_query2 = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM zona_residencial_1 As lg INNER JOIN (SELECT * FROM zona_residencial_1 where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"
 
    var query = client.query(new Query(residencial_query2));
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    });

  }catch( err ) {
    console.log("Error en servicio sg espacios libres="+err);
  }  
});

/* GET Postgres JSON data residencial */
router.get('/sec', function (req, res) {
  
  try{ 
    var x=req.query.x;
    var y=req.query.y;
  
    var sec_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM zona_secundaria As lg INNER JOIN (SELECT * FROM zona_secundaria where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"
 
    var query = client.query(new Query(sec_query));
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    });

  }catch( err ) {
    console.log("Error en servicio sg espacios libres="+err);
  }  
});

/* GET Postgres JSON data terciario */
router.get('/ter', function (req, res) {
  
  try{ 
    var x=req.query.x;
    var y=req.query.y;
  
    var ter_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM zona_terciaria As lg INNER JOIN (SELECT * FROM zona_terciaria where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"
 
    var query = client.query(new Query(ter_query));
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    });

  }catch( err ) {
    console.log("Error en servicio sg espacios libres="+err);
  }  
});

/* GET Postgres JSON data zonasf */
router.get('/zonasf', function (req, res) {
  
  try{ 
    var x=req.query.x;
    var y=req.query.y;
  
    var zonasf_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM zonasf As lg INNER JOIN (SELECT * FROM zonasf where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"
 
    var query = client.query(new Query(zonasf_query));
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    });

  }catch( err ) {
    console.log("Error en servicio sg espacios libres="+err);
  }  
});



/* GET Postgres JSON data catalogos */
router.get('/cat', function (req, res) {
 // var client = new Client(conString);
  //client.connect();
 
  try{
    
    var x=req.query.x;
    var y=req.query.y;
    //var x=469383
    // var y=4381195
    var catalogos_query2 = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM catalogos As lg INNER JOIN (SELECT * FROM catalogos where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"
 
    //console.log(catalogos_query2)
    // sleq_query=sleq_query+" where "+req.query.filter

    var query = client.query(new Query(catalogos_query2));
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    });

  }catch( err ) {
    console.log("Error en servicio catalogos="+err);
  }  
});

/* GET Postgres JSON data catalogos act*/
router.get('/cat_act', function (req, res) {
  // var client = new Client(conString);
   //client.connect();
  
   try{
     
     var x=req.query.x;
     var y=req.query.y;
     //var x=469383
     // var y=4381195
     var catalogos_query2 = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM catalogos_actualizacion As lg INNER JOIN (SELECT * FROM catalogos_actualizacion where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"
  
     //console.log(catalogos_query2)
     // sleq_query=sleq_query+" where "+req.query.filter
 
     var query = client.query(new Query(catalogos_query2));
     query.on("row", function (row, result) {
       result.addRow(row);
     });
     query.on("end", function (result) {
       res.send(result.rows[0].row_to_json);
       res.end();
     });
 
   }catch( err ) {
     console.log("Error en servicio catalogos="+err);
   }  
 });

 /* GET Postgres JSON data catalogos act*/
router.get('/cat_pri', function (req, res) {
  // var client = new Client(conString);
   //client.connect();
  
   try{
     
     var x=req.query.x;
     var y=req.query.y;
     //var x=469383
     // var y=4381195
     var catalogos_query2 = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM pri_catalogos As lg INNER JOIN (SELECT * FROM pri_catalogos where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"
  
     //console.log(catalogos_query2)
     // sleq_query=sleq_query+" where "+req.query.filter
 
     var query = client.query(new Query(catalogos_query2));
     query.on("row", function (row, result) {
       result.addRow(row);
     });
     query.on("end", function (result) {
       res.send(result.rows[0].row_to_json);
       res.end();
     });
 
   }catch( err ) {
     console.log("Error en servicio catalogos="+err);
   }  
 });

/* GET Postgres JSON data nr */
router.get('/NR', function (req, res) {
  // var client = new Client(conString);
   //client.connect();
  
   try{
     
     var x=req.query.x;
     var y=req.query.y;
     //var x=469383
     // var y=4381195
     var NR_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM zonas_centro_historico As lg INNER JOIN (SELECT * FROM zonas_centro_historico where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"
  
     //console.log(catalogos_query2)
     // sleq_query=sleq_query+" where "+req.query.filter
 
     var query = client.query(new Query(NR_query));
     query.on("row", function (row, result) {
       result.addRow(row);
     });
     query.on("end", function (result) {
       res.send(result.rows[0].row_to_json);
       res.end();
     });
 
   }catch( err ) {
     console.log("Error en servicio catalogos="+err);
   }  
 });

/* GET Postgres JSON data api */
router.get('/api', function (req, res) {
  
   try{
     
     var x=req.query.x;
     var y=req.query.y;
     
     var api_query2 = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM api As lg INNER JOIN (SELECT * FROM api where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"
 
  //  var api_query2 = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM api3 As lg INNER JOIN (SELECT * FROM api3) As lp ON lg.fid = lp.fid ) As f ) As fc"
     var query = client.query(new Query(api_query2));
     query.on("row", function (row, result) {
       result.addRow(row);
     });
     query.on("end", function (result) {
       res.send(result.rows[0].row_to_json);
       res.end();
     });
 
   }catch( err ) {
     console.log("Error en servicio api="+err);
   }  
 });

 /* GET Postgres JSON data are */
router.get('/are', function (req, res) {
  
  try{
    
    var x=req.query.x;
    var y=req.query.y;
    
    var are_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM area_regimen_especial As lg INNER JOIN (SELECT * FROM area_regimen_especial where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"

 //  var api_query2 = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM api3 As lg INNER JOIN (SELECT * FROM api3) As lp ON lg.fid = lp.fid ) As f ) As fc"
    var query = client.query(new Query(are_query));
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    });

  }catch( err ) {
    console.log("Error en servicio ari="+err);
  }  
});

 /* GET Postgres JSON data urbanizable */
 router.get('/sup', function (req, res) {
  
  try{
    
    var x=req.query.x;
    var y=req.query.y;
    
    var urbanizable_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM suelo_urbanizable_programado As lg INNER JOIN (SELECT * FROM suelo_urbanizable_programado where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"

 //  var api_query2 = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM api3 As lg INNER JOIN (SELECT * FROM api3) As lp ON lg.fid = lp.fid ) As f ) As fc"
    var query = client.query(new Query(urbanizable_query));
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    });

  }catch( err ) {
    console.log("Error en servicio ari="+err);
  }  
});

/* GET Postgres JSON data urbanizable no prog*/
router.get('/sunp', function (req, res) {
  
  try{
    
    var x=req.query.x;
    var y=req.query.y;
    
    var urbanizable_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM suelo_urbanizable_no_programado As lg INNER JOIN (SELECT * FROM suelo_urbanizable_no_programado where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"

 //  var api_query2 = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM api3 As lg INNER JOIN (SELECT * FROM api3) As lp ON lg.fid = lp.fid ) As f ) As fc"
    var query = client.query(new Query(urbanizable_query));
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    });

  }catch( err ) {
    console.log("Error en servicio ari="+err);
  }  
});

/* GET Postgres JSON data srg */
router.get('/srg', function (req, res) {
  
  try{
    
    var x=req.query.x;
    var y=req.query.y;
    
    var srg_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM srg_dot As lg INNER JOIN (SELECT * FROM srg_dot where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"

 //  var api_query2 = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM api3 As lg INNER JOIN (SELECT * FROM api3) As lp ON lg.fid = lp.fid ) As f ) As fc"
    var query = client.query(new Query(srg_query));
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    });

  }catch( err ) {
    console.log("Error en servicio srg="+err);
  }  
});

/* GET Postgres JSON data aia */
router.get('/aia', function (req, res) {
  
  try{
    
    var x=req.query.x;
    var y=req.query.y;
    
    var aia_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM aia_dot As lg INNER JOIN (SELECT * FROM aia_dot where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"

 //  var api_query2 = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM api3 As lg INNER JOIN (SELECT * FROM api3) As lp ON lg.fid = lp.fid ) As f ) As fc"
    var query = client.query(new Query(aia_query));
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    });

  }catch( err ) {
    console.log("Error en servicio aia="+err);
  }  
});

/* GET Postgres JSON data apt */
router.get('/apt', function (req, res) {
  
  try{
    
    var x=req.query.x;
    var y=req.query.y;
    
    var apt_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM apt_dot As lg INNER JOIN (SELECT * FROM apt_dot where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"

 //  var api_query2 = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM api3 As lg INNER JOIN (SELECT * FROM api3) As lp ON lg.fid = lp.fid ) As f ) As fc"
    var query = client.query(new Query(apt_query));
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    });

  }catch( err ) {
    console.log("Error en servicio apt="+err);
  }  
});

/* GET Postgres JSON data at */
router.get('/at', function (req, res) {
  
  try{
    
    var x=req.query.x;
    var y=req.query.y;
    
    var at_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM at_dot As lg INNER JOIN (SELECT * FROM at_dot where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"

 //  var api_query2 = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM api3 As lg INNER JOIN (SELECT * FROM api3) As lp ON lg.fid = lp.fid ) As f ) As fc"
    var query = client.query(new Query(at_query));
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    });

  }catch( err ) {
    console.log("Error en servicio at="+err);
  }  
});

/* GET Postgres JSON data at */
router.get('/pri_res_em', function (req, res) {
  
  try{
    
    var x=req.query.x;
    var y=req.query.y;
    
    var pri_res_em_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM pri_zona_residencial_entre_mitgeres As lg INNER JOIN (SELECT * FROM pri_zona_residencial_entre_mitgeres where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"

 //  var api_query2 = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM api3 As lg INNER JOIN (SELECT * FROM api3) As lp ON lg.fid = lp.fid ) As f ) As fc"
    var query = client.query(new Query(pri_res_em_query));
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    });

  }catch( err ) {
    console.log("Error en servicio at="+err);
  }  
});

/* GET Postgres JSON data at */
router.get('/pri_hab_eo', function (req, res) {
  
  try{
    
    var x=req.query.x;
    var y=req.query.y;
    
    var pri_hab_eo_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM pri_zona_habitatge_edificacio_oberta As lg INNER JOIN (SELECT * FROM pri_zona_habitatge_edificacio_oberta where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"

 //  var api_query2 = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM api3 As lg INNER JOIN (SELECT * FROM api3) As lp ON lg.fid = lp.fid ) As f ) As fc"
    var query = client.query(new Query(pri_hab_eo_query));
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    });

  }catch( err ) {
    console.log("Error en servicio at="+err);
  }  
});

/* GET Postgres JSON data pri hab trad */
router.get('/pri_hab_td', function (req, res) {
  
  try{
    
    var x=req.query.x;
    var y=req.query.y;
    
    var pri_hab_td_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM pri_zona_habitatge_tradicional As lg INNER JOIN (SELECT * FROM pri_zona_habitatge_tradicional where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"

 //  var api_query2 = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM api3 As lg INNER JOIN (SELECT * FROM api3) As lp ON lg.fid = lp.fid ) As f ) As fc"
    var query = client.query(new Query(pri_hab_td_query));
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    });

  }catch( err ) {
    console.log("Error en servicio at="+err);
  }  
});

/* GET Postgres JSON data pri hab ADOSSAT */
router.get('/pri_hab_ad', function (req, res) {
  
  try{
    
    var x=req.query.x;
    var y=req.query.y;
    
    var pri_hab_ad_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM pri_zona_habitatges_adossats As lg INNER JOIN (SELECT * FROM pri_zona_habitatges_adossats where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"

 //  var api_query2 = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM api3 As lg INNER JOIN (SELECT * FROM api3) As lp ON lg.fid = lp.fid ) As f ) As fc"
    var query = client.query(new Query(pri_hab_ad_query));
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    });

  }catch( err ) {
    console.log("Error en servicio at="+err);
  }  
});

/* GET Postgres JSON data pri hab UNI AI */
router.get('/pri_hab_unif_ai', function (req, res) {
  
  try{
    
    var x=req.query.x;
    var y=req.query.y;
    
    var pri_hab_unif_ai_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM pri_zona_habitatge_unifamiliar_aillat As lg INNER JOIN (SELECT * FROM pri_zona_habitatge_unifamiliar_aillat where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"

 //  var api_query2 = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM api3 As lg INNER JOIN (SELECT * FROM api3) As lp ON lg.fid = lp.fid ) As f ) As fc"
    var query = client.query(new Query(pri_hab_unif_ai_query));
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    });

  }catch( err ) {
    console.log("Error en servicio at="+err);
  }  
});

/* GET Postgres JSON data pri hab com serv */
router.get('/pri_com_serv', function (req, res) {
  
  try{
    
    var x=req.query.x;
    var y=req.query.y;
    
    var pri_com_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM pri_zona_comercial_serveis As lg INNER JOIN (SELECT * FROM pri_zona_comercial_serveis where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"

 //  var api_query2 = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM api3 As lg INNER JOIN (SELECT * FROM api3) As lp ON lg.fid = lp.fid ) As f ) As fc"
    var query = client.query(new Query(pri_com_query));
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    });

  }catch( err ) {
    console.log("Error en servicio at="+err);
  }  
});

/* GET Postgres JSON data pri hab com serv */
router.get('/pri_turistic', function (req, res) {
  
  try{
    
    var x=req.query.x;
    var y=req.query.y;
    
    var pri_turistic_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM pri_zona_turistica As lg INNER JOIN (SELECT * FROM pri_zona_turistica where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"

 //  var api_query2 = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM api3 As lg INNER JOIN (SELECT * FROM api3) As lp ON lg.fid = lp.fid ) As f ) As fc"
    var query = client.query(new Query(pri_turistic_query));
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    });

  }catch( err ) {
    console.log("Error en servicio at="+err);
  }  
});

/* GET Postgres JSON data pri tur hotl */
router.get('/pri_tur_hot', function (req, res) {
  
  try{
    
    var x=req.query.x;
    var y=req.query.y;
    
    var pri_tur_hot_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM pri_zona_turistica_hotelera As lg INNER JOIN (SELECT * FROM pri_zona_turistica_hotelera where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"

 //  var api_query2 = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM api3 As lg INNER JOIN (SELECT * FROM api3) As lp ON lg.fid = lp.fid ) As f ) As fc"
    var query = client.query(new Query(pri_tur_hot_query));
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    });

  }catch( err ) {
    console.log("Error en servicio at="+err);
  }  
});

/* GET Postgres JSON data pri eq */
router.get('/pri_eq', function (req, res) {
  
  try{
    
    var x=req.query.x;
    var y=req.query.y;
    
    var pri_eq_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM pri_equipamientos As lg INNER JOIN (SELECT * FROM pri_equipamientos where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"

 //  var api_query2 = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM api3 As lg INNER JOIN (SELECT * FROM api3) As lp ON lg.fid = lp.fid ) As f ) As fc"
    var query = client.query(new Query(pri_eq_query));
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    });

  }catch( err ) {
    console.log("Error en servicio eq="+err);
  }  
});

/* GET Postgres JSON data pri el */
router.get('/pri_el', function (req, res) {
  
  try{
    
    var x=req.query.x;
    var y=req.query.y;
    
    var pri_el_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM pri_sistema_espais_lliures_publics As lg INNER JOIN (SELECT * FROM pri_sistema_espais_lliures_publics where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"

 //  var api_query2 = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM api3 As lg INNER JOIN (SELECT * FROM api3) As lp ON lg.fid = lp.fid ) As f ) As fc"
    var query = client.query(new Query(pri_el_query));
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    });

  }catch( err ) {
    console.log("Error en servicio ael="+err);
  }  
});

/* GET Postgres JSON data pri UA */
router.get('/pri_ua', function (req, res) {
  
  try{
    
    var x=req.query.x;
    var y=req.query.y;
    
    var pri_ua_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM pri_unitat_actuacio As lg INNER JOIN (SELECT * FROM pri_unitat_actuacio where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"

 //  var api_query2 = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM api3 As lg INNER JOIN (SELECT * FROM api3) As lp ON lg.fid = lp.fid ) As f ) As fc"
    var query = client.query(new Query(pri_ua_query));
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    });

  }catch( err ) {
    console.log("Error en servicio ael="+err);
  }  
});

/* GET Postgres JSON data pri cp */
router.get('/pri_CP', function (req, res) {
  
  try{
    
    var x=req.query.x;
    var y=req.query.y;
    
    var pri_cp_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM pri_corredor_paisajistic As lg INNER JOIN (SELECT * FROM pri_corredor_paisajistic where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"

 //  var api_query2 = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM api3 As lg INNER JOIN (SELECT * FROM api3) As lp ON lg.fid = lp.fid ) As f ) As fc"
    var query = client.query(new Query(pri_cp_query));
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    });

  }catch( err ) {
    console.log("Error en servicio ael="+err);
  }  
});

/* GET Postgres JSON data pri el */
router.get('/parcela', function (req, res) {
  
  try{
    
    var x=req.query.x;
    var y=req.query.y;
    
    var parcela_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM parcela_su_ru_calles As lg INNER JOIN (SELECT * FROM parcela_su_ru_calles where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"

 //  var api_query2 = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM api3 As lg INNER JOIN (SELECT * FROM api3) As lp ON lg.fid = lp.fid ) As f ) As fc"
    var query = client.query(new Query(parcela_query));
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    });

  }catch( err ) {
    console.log("Error en servicio ael="+err);
  }  
});

/* GET Postgres JSON data ue */
router.get('/ue', function (req, res) {
  
  try{
    
    var x=req.query.x;
    var y=req.query.y;
    
    var ue_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM unidad_ejecucion As lg INNER JOIN (SELECT * FROM unidad_ejecucion where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"

 //  var api_query2 = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM api3 As lg INNER JOIN (SELECT * FROM api3) As lp ON lg.fid = lp.fid ) As f ) As fc"
    var query = client.query(new Query(ue_query));
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    });

  }catch( err ) {
    console.log("Error en servicio ael="+err);
  }  
});

/* GET Postgres JSON data expedientes  pa*/
router.get('/exp_pa', function (req, res) {
 // var client = new Client(conString);
 // client.connect();
 
  try{
    console.log(req.x);
    var x=req.query.x;
    var y=req.query.y;
    
    var PA_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM pa_modificacion_pgou  As lg INNER JOIN (SELECT * FROM pa_modificacion_pgou  where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831)) ORDER BY codigo) As lp ON lg.fid = lp.fid ) As f ) As fc"

    var query = client.query(new Query(PA_query));
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    });

  }catch( err ) {
    console.log("Error en servicio expedientes="+err);
  }  
});

/* GET Postgres JSON data expedientes  pb*/
router.get('/exp_pb', function (req, res) {
  
   try{
     console.log(req.x);
     var x=req.query.x;
     var y=req.query.y;
     
     var PB_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM pb_pla_especial As lg INNER JOIN (SELECT * FROM pb_pla_especial where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"
 
     var query = client.query(new Query(PB_query));
     query.on("row", function (row, result) {
       result.addRow(row);
     });
     query.on("end", function (result) {
       res.send(result.rows[0].row_to_json);
       res.end();
     });
 
   }catch( err ) {
     console.log("Error en servicio expedientes="+err);
   }  
 });

 /* GET Postgres JSON data expedientes  pbx*/
router.get('/exp_pbx', function (req, res) {
  
  try{
    console.log(req.x);
    var x=req.query.x;
    var y=req.query.y;
    
    var PBX_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM pbx_pla_especial_ri As lg INNER JOIN (SELECT * FROM pbx_pla_especial_ri where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"

    var query = client.query(new Query(PBX_query));
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    });

  }catch( err ) {
    console.log("Error en servicio expedientes="+err);
  }  
});

 /* GET Postgres JSON data expedientes  pc*/
 router.get('/exp_pc', function (req, res) {
  
  try{
    console.log(req.x);
    var x=req.query.x;
    var y=req.query.y;
    
    var PC_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM pc_pla_parcial As lg INNER JOIN (SELECT * FROM pc_pla_parcial where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"

    var query = client.query(new Query(PC_query));
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    });

  }catch( err ) {
    console.log("Error en servicio expedientes="+err);
  }  
});

 /* GET Postgres JSON data expedientes  pd*/
 router.get('/exp_pd', function (req, res) {
  
  try{
    console.log(req.x);
    var x=req.query.x;
    var y=req.query.y;
    
    var PD_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM pd_urbanizacion As lg INNER JOIN (SELECT * FROM pd_urbanizacion where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"

    var query = client.query(new Query(PD_query));
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    });

  }catch( err ) {
    console.log("Error en servicio expedientes="+err);
  }  
});

/* GET Postgres JSON data expedientes  pe*/
router.get('/exp_pe', function (req, res) {
  
  try{
    console.log(req.x);
    var x=req.query.x;
    var y=req.query.y;
    
    var PE_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM pe_estudi_detall As lg INNER JOIN (SELECT * FROM pe_estudi_detall where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"

    var query = client.query(new Query(PE_query));
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    });

  }catch( err ) {
    console.log("Error en servicio expedientes="+err);
  }  
});

/* GET Postgres JSON data expedientes  pe*/
router.get('/exp_pf', function (req, res) {
  
  try{
    console.log(req.x);
    var x=req.query.x;
    var y=req.query.y;
    
    var PF_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM pf_dotacio_serveis As lg INNER JOIN (SELECT * FROM pf_dotacio_serveis where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"

    var query = client.query(new Query(PF_query));
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    });

  }catch( err ) {
    console.log("Error en servicio expedientes="+err);
  }  
});

/* GET Postgres JSON data expedientes  pe*/
router.get('/exp_pg', function (req, res) {
  
  try{
    console.log(req.x);
    var x=req.query.x;
    var y=req.query.y;
    
    var PG_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM pg_recepcio_obres As lg INNER JOIN (SELECT * FROM pg_recepcio_obres where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"

    var query = client.query(new Query(PG_query));
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    });

  }catch( err ) {
    console.log("Error en servicio expedientes="+err);
  }  
});

/* GET Postgres JSON data expedientes  pe*/
router.get('/exp_ph', function (req, res) {
  
  try{
    console.log(req.x);
    var x=req.query.x;
    var y=req.query.y;
    
    var PH_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM ph_parcelacions As lg INNER JOIN (SELECT * FROM ph_parcelacions where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"

    var query = client.query(new Query(PH_query));
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    });

  }catch( err ) {
    console.log("Error en servicio expedientes="+err);
  }  
});

/* GET Postgres JSON data expedientes  pe*/
router.get('/exp_pi', function (req, res) {
  
  try{
    console.log(req.x);
    var x=req.query.x;
    var y=req.query.y;
    
    var PI_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM pi_interes_general As lg INNER JOIN (SELECT * FROM pi_interes_general where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"

    var query = client.query(new Query(PI_query));
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    });

  }catch( err ) {
    console.log("Error en servicio expedientes="+err);
  }  
});


router.get('/exp_pj', function (req, res) {
  
  try{
    console.log(req.x);
    var x=req.query.x;
    var y=req.query.y;
    
    var PJ_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM pj_delimitacio_ua As lg INNER JOIN (SELECT * FROM pj_delimitacio_ua where ST_CONTAINS(the_geom,ST_GeomFromText('POINT("+x+" "+y+")',25831))) As lp ON lg.fid = lp.fid ) As f ) As fc"

    var query = client.query(new Query(PJ_query));
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    });

  }catch( err ) {
    console.log("Error en servicio expedientes="+err);
  }  
});

router.get('/infoFeature', function (req, res) {

  var tabla=req.query.tabla;
  var codigo=req.query.codigo;

  // var info_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(lg.the_geom)::json As geometry , row_to_json(lp) As properties FROM "+tabla+"  As lg INNER JOIN (SELECT * FROM "+tabla+" WHERE codigo='"+codigo+"') As lp ON lg.fid = lp.fid ) As f ) As fc"

  
  var info_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM "+tabla+"  As lg INNER JOIN (SELECT * FROM "+tabla+" WHERE codigo='"+codigo+"') As lp ON lg.fid = lp.fid ) As f ) As fc"

  var query = client.query(new Query(info_query));
  query.on("row", function (row, result) {
      result.addRow(row);
  });
  query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
  });
});

router.get('/infoquery', function (req, res) {

  var tabla=req.query.tabla;
  var filtro=req.query.filtro;
  
  var info_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM "+tabla+"  As lg INNER JOIN (SELECT * FROM "+tabla+" WHERE "+filtro+"  ) As lp ON lg.fid = lp.fid ) As f ) As fc"

  var query = client.query(new Query(info_query));
  query.on("row", function (row, result) {
      result.addRow(row);
  });
  query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
  });
});


router.get('/opg/infoquery_fase1_cross', async function (req, res) {

  var tableSource=req.query.tabla;
  var filtroSQL=req.query.filtro;

  var protocol_server=req.query.server

  geojsonRES=null

  try{

    //let url = new URL("https://modeldeciutatgis-dev.palma.cat/opg/infoXY_FASE1");
    let url = new URL(protocol_server+"/opg/infoquery_fase1");
    const params = {tabla: tableSource, filtro: filtroSQL};
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    const dataRequest = {
        method: 'GET'
    };
    var response = await fetch(url,dataRequest);
    // console.log(response);
    geojsonRES = await response.json();

   
  }catch( err ) {
    console.log("Error en llamada cross="+err);
  } 

  
  res.send(geojsonRES);
  res.end();

});

router.get('/opg/infoquery_fase1', function (req, res) {

  var tabla=req.query.tabla;
  var filtro=req.query.filtro;
  
  var info_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM "+tabla+"  As lg INNER JOIN (SELECT * FROM "+tabla+" WHERE "+filtro+"  ) As lp ON lg.fid = lp.fid ) As f ) As fc"

  var query = clientFASE1.query(new Query(info_query));
  query.on("row", function (row, result) {
      result.addRow(row);
  });
  query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
  });
});

// nuevos

router.get('/opg/infoquery_rpg', function (req, res) {

  var tabla=req.query.tabla;
  var filtro=req.query.filtro;
  
  var info_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM "+tabla+"  As lg INNER JOIN (SELECT * FROM "+tabla+" WHERE "+filtro+"  ) As lp ON lg.fid = lp.fid ) As f ) As fc"

  var query = clientFASE1.query(new Query(info_query));
  query.on("row", function (row, result) {
      result.addRow(row);
  });
  query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
  });
});

router.get('/opg/infoquery_normas', function (req, res) {

  var tabla="normativas_datos";
  var filtro="nombre='plan_general_ai'";
  
  
  var info_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM "+tabla+"  As lg INNER JOIN (SELECT * FROM "+tabla+" WHERE "+filtro+"  ) As lp ON lg.fid = lp.fid ) As f ) As fc"

  var query = clientFASE1.query(new Query(info_query));
  query.on("row", function (row, result) {
      result.addRow(row);
  });
  query.on("end", function (result) {

      resultado=result.rows[0].row_to_json
      normativa=resultado.features[0].properties.normativa
      res.send(normativa);
      res.end();
  });
});

router.get('/opg/infoquery_normas_detalladas', function (req, res) {

  var tabla="normativas_datos";
  var filtro="nombre='ord_detallada_ai'";
  
  
  var info_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM "+tabla+"  As lg INNER JOIN (SELECT * FROM "+tabla+" WHERE "+filtro+"  ) As lp ON lg.fid = lp.fid ) As f ) As fc"

  var query = clientFASE1.query(new Query(info_query));
  query.on("row", function (row, result) {
      result.addRow(row);
  });
  query.on("end", function (result) {

      resultado=result.rows[0].row_to_json
      normativa=resultado.features[0].properties.normativa
      res.send(normativa);
      res.end();
  });
});

router.get('/opg/infoquery_normativa', function (req, res) {

  var tabla="normativas_datos";
  var filtro="nombre='"+req.query.normativa+"'";

  console.log(filtro)
  
  
  var info_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM "+tabla+"  As lg INNER JOIN (SELECT * FROM "+tabla+" WHERE "+filtro+"  ) As lp ON lg.fid = lp.fid ) As f ) As fc"

  var query = clientFASE1.query(new Query(info_query));
  query.on("row", function (row, result) {
      result.addRow(row);
  });
  query.on("end", function (result) {

      resultado=result.rows[0].row_to_json
      normativa=resultado.features[0].properties.normativa
      res.send(normativa);
      res.end();
  });
});

router.get('/opg/infoquery_normativa_cross', async function (req, res) {

  var normativa=req.query.normativa;

  var protocol_server=req.query.server

  geojsonRES=null

  try{

    //let url = new URL("https://modeldeciutatgis-dev.palma.cat/opg/infoXY_FASE1");
    let url = new URL(protocol_server+"/opg/infoquery_normativa");
    const params = {normativa: normativa};
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    const dataRequest = {
        method: 'GET'
    };
    var response = await fetch(url,dataRequest);
    // console.log(response);
    geojsonRES = await response.json();

   
  }catch( err ) {
    console.log("Error en llamada cross="+err);
  } 

  
  res.send(geojsonRES);
  res.end();

});


router.get('/opg/intersectionFilter_rpg_cross', async function (req, res) {

  var tablaSOURCE=req.query.tablaSOURCE;
  var tablaTARGET=req.query.tablaTARGET; 
  var filtroSOURCE=req.query.filtroSOURCE;
  var filtroTARGET=req.query.filtroTARGET;

  var protocol_server=req.query.server

  geojsonRES=null

  console.log("pasa1 cross filter")

  
  try{

    //let url = new URL("https://modeldeciutatgis-dev.palma.cat/opg/infoXY_FASE1");
    let url = new URL(protocol_server+"/opg/intersectionFilter_rpg");
    const params = {tablaSOURCE: tablaSOURCE, tablaTARGET: tablaTARGET, filtroSOURCE: filtroSOURCE,filtroTARGET: filtroTARGET};
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    const dataRequest = {
        method: 'GET'
    };
    var response = await fetch(url,dataRequest);
    // console.log(response);
    geojsonRES = await response.json();

   
  }catch( err ) {
    console.log("Error en llamada cross="+err);
  } 

  
  res.send(geojsonRES);
  res.end();

});

router.get('/opg/distanceFilter_rpg', function (req, res) {
  
  try{

    var tablaSOURCE=req.query.tablaSOURCE;
    var tablaTARGET=req.query.tablaTARGET; 
    var filtroSOURCE=req.query.filtroSOURCE;
    var filtroTARGET=req.query.filtroTARGET;
    var distance=req.query.distance;

    console.log(tablaSOURCE);
    console.log(tablaTARGET);
    console.log(filtroSOURCE);
    console.log(filtroTARGET);
    
   

    var intersection_query = `SELECT row_to_json(fc) FROM 
    ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features 
      FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lp.geometria,4326))::json As geometry , row_to_json(lp) As properties FROM `+tablaSOURCE+` As lg INNER JOIN 
          (select `+tablaSOURCE+`.*,`+tablaSOURCE+`.the_geom AS geometria from `+tablaSOURCE+`,`+tablaTARGET+` 
        where ST_DWITHIN(`+tablaSOURCE+`.the_geom, `+tablaTARGET+`.the_geom, `+distance+`) and `+tablaTARGET+`.`+filtroTARGET+` and `+tablaSOURCE+`.`+filtroSOURCE+`) As lp ON lg.fid = lp.fid ) As f ) As fc`
  
    

    var query = clientFASE1.query(new Query(intersection_query));

    try{
      query.on("row", function (row, result) {
        console.log("EJECUTADA");
        result.addRow(row);
      });
    }catch( err ) {
      console.log("Error en consulta="+err);
      result.addRow(null);
    }  
    

    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    }); 

  }catch( err ) {
    console.log("Error en servicio expedientes="+err);
  }  
});

router.get('/opg/intersectionFilter_rpg', function (req, res) {
  
  try{

    var tablaSOURCE=req.query.tablaSOURCE;
    var tablaTARGET=req.query.tablaTARGET; 
    var filtroSOURCE=req.query.filtroSOURCE;
    var filtroTARGET=req.query.filtroTARGET;

    console.log(tablaSOURCE);
    console.log(tablaTARGET);
    console.log(filtroSOURCE);
    console.log(filtroTARGET);
    
    var intersection_query = `SELECT row_to_json(fc) FROM 
    ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features 
      FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lp.geometria,4326))::json As geometry , row_to_json(lp) As properties FROM `+tablaSOURCE+` As lg INNER JOIN 
         (select `+tablaSOURCE+`.*,ST_INTERSECTION(`+tablaSOURCE+`.the_geom,`+tablaTARGET+`.the_geom) AS geometria from `+tablaSOURCE+`,`+tablaTARGET+` 
        where ST_INTERSECTS(`+tablaSOURCE+`.the_geom, `+tablaTARGET+`.the_geom) and `+tablaTARGET+`.`+filtroTARGET+` and `+tablaSOURCE+`.`+filtroSOURCE+`) As lp ON lg.fid = lp.fid ) As f ) As fc`
    

    var query = clientFASE1.query(new Query(intersection_query));

    try{
      query.on("row", function (row, result) {
        console.log("EJECUTADA");
        result.addRow(row);
      });
    }catch( err ) {
      console.log("Error en consulta="+err);
      result.addRow(null);
    }  
    

    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    }); 

  }catch( err ) {
    console.log("Error en servicio expedientes="+err);
  }  
});

// end nuevos

router.get('/intersection', function (req, res) {
  
  try{

    console.log(req.query.xmin+","+req.query.ymin);
    console.log(req.query.xmax+","+req.query.ymax);
   
    var tabla=req.query.tabla;
    var xmin=req.query.xmin;
    var ymin=req.query.ymin;
    var xmax=req.query.xmax;
    var ymax=req.query.ymax;

    //console.log(xmin);

    console.log(xmin+","+ymin);
    console.log(xmax+","+ymax);


    
    
    var intersection_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lg.the_geom,4326))::json As geometry , row_to_json(lp) As properties FROM "+tabla+" As lg INNER JOIN (SELECT * FROM "+tabla+" WHERE the_geom && ST_Transform(ST_MakeEnvelope("+xmin+","+ymin+","+xmax+","+ymax+", 4326),25831)) As lp ON lg.fid = lp.fid ) As f ) As fc"

    var query = client.query(new Query(intersection_query));
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    }); 

  }catch( err ) {
    console.log("Error en servicio expedientes="+err);
  }  
});

router.get('/intersection2', function (req, res) {
  
  try{

    var tabla1=req.query.tabla1;
    var tabla2=req.query.tabla2; 
    var filtro=req.query.filtroSQL;

    console.log(req.query.tabla1);
    console.log(req.query.tabla2);
    console.log(req.query.filtroSQL);
    
    var intersection_query = `SELECT row_to_json(fc) FROM 
    ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features 
      FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lp.geometria,4326))::json As geometry , row_to_json(lp) As properties FROM `+tabla1+` As lg INNER JOIN 
         (select `+tabla1+`.*,ST_INTERSECTION(`+tabla1+`.the_geom,`+tabla2+`.the_geom) AS geometria from `+tabla1+`,`+tabla2+` 
        where ST_INTERSECTS(`+tabla1+`.the_geom, `+tabla2+`.the_geom) and `+tabla2+`.`+filtro+`) As lp ON lg.fid = lp.fid ) As f ) As fc`
  
    var query = client.query(new Query(intersection_query));

    try{
      query.on("row", function (row, result) {
        result.addRow(row);
      });
    }catch( err ) {
      console.log("Error en consulta="+err);
      result.addRow(null);
    }  
    

    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    }); 

  }catch( err ) {
    console.log("Error en servicio expedientes="+err);
  }  
});


router.get('/intersectionFilter', function (req, res) {
  
  try{

    var tablaSOURCE=req.query.tablaSOURCE;
    var tablaTARGET=req.query.tablaTARGET; 
    var filtroSOURCE=req.query.filtroSOURCE;
    var filtroTARGET=req.query.filtroTARGET;

    console.log(tablaSOURCE);
    console.log(tablaTARGET);
    console.log(filtroSOURCE);
    console.log(filtroTARGET);
    
    var intersection_query = `SELECT row_to_json(fc) FROM 
    ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features 
      FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lp.geometria,4326))::json As geometry , row_to_json(lp) As properties FROM `+tablaSOURCE+` As lg INNER JOIN 
         (select `+tablaSOURCE+`.*,ST_INTERSECTION(`+tablaSOURCE+`.the_geom,`+tablaTARGET+`.the_geom) AS geometria from `+tablaSOURCE+`,`+tablaTARGET+` 
        where ST_INTERSECTS(`+tablaSOURCE+`.the_geom, `+tablaTARGET+`.the_geom) and `+tablaTARGET+`.`+filtroTARGET+` and `+tablaSOURCE+`.`+filtroSOURCE+`) As lp ON lg.fid = lp.fid ) As f ) As fc`
  
    var query = client.query(new Query(intersection_query));

    try{
      query.on("row", function (row, result) {
        console.log("EJECUTADA");
        result.addRow(row);
      });
    }catch( err ) {
      console.log("Error en consulta="+err);
      result.addRow(null);
    }  
    

    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    }); 

  }catch( err ) {
    console.log("Error en servicio expedientes="+err);
  }  
});

router.get('/intersectionFilter2', function (req, res) {
  
  try{

    var tablaSOURCE=req.query.tablaSOURCE;
    var tablaTARGET=req.query.tablaTARGET; 
    var filtroSOURCE=req.query.filtroSOURCE;
    var filtroTARGET=req.query.filtroTARGET;

    console.log(tablaSOURCE);
    console.log(tablaTARGET);
    console.log(filtroSOURCE);
    console.log(filtroTARGET);
    
    var intersection_query = `SELECT row_to_json(fc) FROM 
    ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features 
      FROM (SELECT 'Feature' As type , ST_AsGeoJSON(ST_Transform(lp.geometria,4326))::json As geometry , row_to_json(lp) As properties FROM `+tablaSOURCE+` As lg INNER JOIN 
         (select `+tablaSOURCE+`.*,ST_INTERSECTION(`+tablaSOURCE+`.the_geom,`+tablaTARGET+`.the_geom) AS geometria from `+tablaSOURCE+`,`+tablaTARGET+` 
        where ST_INTERSECTS(`+tablaSOURCE+`.the_geom, `+tablaTARGET+`.the_geom) and `+filtroTARGET+` and `+filtroSOURCE+`) As lp ON lg.fid = lp.fid ) As f ) As fc`
  
    var query = client.query(new Query(intersection_query));

    try{
      query.on("row", function (row, result) {
        console.log("EJECUTADA");
        result.addRow(row);
      });
    }catch( err ) {
      console.log("Error en consulta="+err);
      result.addRow(null);
    }  
    

    query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    }); 

  }catch( err ) {
    console.log("Error en servicio expedientes="+err);
  }  
});


router.get('/readImages', function (req, res) {
  
  try{

    var directory=req.query.directory;

    var root_dir="public/images/"+directory;
    console.log(root_dir);
    fs.readdir(root_dir, (err, files) => {

    //fs.readdir('public/images/catalogos/46-04', (err, files) => {

     
      if(err) return console.error(err);

        var filesJPG=[];
        for(var n=0;n<files.length;n++){

          if(files[n].endsWith(".JPG") || 
            files[n].endsWith(".jpg") ||
            files[n].endsWith(".PNG") ||
            files[n].endsWith(".png")) filesJPG.push(files[n]);
        }


  
       console.log(filesJPG.join(' '));
     

      res.send(JSON.stringify(filesJPG));
      res.end();

    });
  

  }catch( err ) {
    console.log("Error en read images"+err);
  }  
});


router.get('/opg/readNormasDetalladas', function (req, res) {
  
  try{

    
    fs.readFile("public/images/normes_detalladas.json", 'utf8', (err, data) => {

    //fs.readdir('public/images/catalogos/46-04', (err, files) => {

     
      if(err) return console.error(err);
     

      res.send(data)
     // res.send(data);
      res.end();

    });
  

  }catch( err ) {
    console.log("Error en read images"+err);
  }  
});

router.get('/opg/readNormas', function (req, res) {
  
  try{

    
    fs.readFile("public/images/normas_estructuradas.json", 'utf8', (err, data) => {

    //fs.readdir('public/images/catalogos/46-04', (err, files) => {

     
      if(err) return console.error(err);
     

      res.send(data)
     // res.send(data);
      res.end();

    });
  

  }catch( err ) {
    console.log("Error en read images"+err);
  }  
});

router.get('/opg/readNormasVigente', function (req, res) {
  
  try{

    
    fs.readFile("public/images/normas_vigente.json", 'utf8', (err, data) => {

    //fs.readdir('public/images/catalogos/46-04', (err, files) => {

     
      if(err) return console.error(err);
     

      res.send(data)
     // res.send(data);
      res.end();

    });
  

  }catch( err ) {
    console.log("Error en read images"+err);
  }  
});

router.get('/opg/readNormasPRI', function (req, res) {
  
  try{

    
    fs.readFile("public/images/normas_pri.json", 'utf8', (err, data) => {

    //fs.readdir('public/images/catalogos/46-04', (err, files) => {

     
      if(err) return console.error(err);
     

      res.send(data)
     // res.send(data);
      res.end();

    });
  

  }catch( err ) {
    console.log("Error en read images"+err);
  }  
});




router.get('/residencial', function (req, res) {
  var client = new Client(conString);
  client.connect();
  var query = client.query(new Query(res_query));
  query.on("row", function (row, result) {
      result.addRow(row);
  });
  query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
  });
});


router.get('/catalogos', function (req, res) {
  var client = new Client(conString);
  client.connect();
  var query = client.query(new Query(catalogos_query));
  query.on("row", function (row, result) {
      result.addRow(row);
  });
  query.on("end", function (result) {
      res.send(result.rows[0].row_to_json);
      res.end();
  });
});

/* GET the map page */

router.get('/opg/plan_vigente', function(req, res) {
  // var client = new Client(conString); // Setup our Postgres Client
 
  // client.connect(); // connect to the client

  res.render('plan_vigente', {
    title: "Plan Vigente", // Give a title to our page
   // jsonData: data[3], // Pass data to the View
   // jsonDataSLEQ: data[2], // Pass data to the View
   // jsonDataRES: data[1], // Pass data to the View
   // jsonDataCAT: data[0] // Pass data to the View
  });

  //error handler
  router.use(function(err, req, res, next){
    console.log(err.stack);    // e.g., Not valid name
    return res.status(500).send('Internal Server Occured');
  });
});


/* GET the map page */

router.get('/opg/revision_fase1', function(req, res) {
  // var client = new Client(conString); // Setup our Postgres Client
 
  // client.connect(); // connect to the client

  res.render('revision_fase1', {
    title: "Revision Fase 1", // Give a title to our page
   // jsonData: data[3], // Pass data to the View
   // jsonDataSLEQ: data[2], // Pass data to the View
   // jsonDataRES: data[1], // Pass data to the View
   // jsonDataCAT: data[0] // Pass data to the View
  });

  //error handler
  router.use(function(err, req, res, next){
    console.log(err.stack);    // e.g., Not valid name
    return res.status(500).send('Internal Server Occured');
  });
});


/* GET the map page */
router.get('/opg/aprobacion_inicial1', function(req, res) {
  // var client = new Client(conString); // Setup our Postgres Client
 
  // client.connect(); // connect to the client
  
  res.render('aprobacion_inicial', {
    title: "Pla General (Aprov. Inicial)", // Give a title to our page
   // jsonData: data[3], // Pass data to the View
   // jsonDataSLEQ: data[2], // Pass data to the View
   // jsonDataRES: data[1], // Pass data to the View
   // jsonDataCAT: data[0] // Pass data to the View
  });

  //error handler
  router.use(function(err, req, res, next){
    console.log(err.stack);    // e.g., Not valid name
    return res.status(500).send('Internal Server Occured');
  });
});

router.get('/opg/aprobacion_inicial_cdn', function(req, res) {
  // var client = new Client(conString); // Setup our Postgres Client
 
  // client.connect(); // connect to the client
  
  res.render('aprobacion_inicial_cdn', {
    title: "Pla General (Aprov. Inicial cdn)", // Give a title to our page
   // jsonData: data[3], // Pass data to the View
   // jsonDataSLEQ: data[2], // Pass data to the View
   // jsonDataRES: data[1], // Pass data to the View
   // jsonDataCAT: data[0] // Pass data to the View
  });

  //error handler
  router.use(function(err, req, res, next){
    console.log(err.stack);    // e.g., Not valid name
    return res.status(500).send('Internal Server Occured');
  });
});

router.get('/opg/visor_urbanismo', function(req, res) {
  // var client = new Client(conString); // Setup our Postgres Client
 
  // client.connect(); // connect to the client
  
  res.render('visor_urbanismo', {
    title: "Visor Urbanismo", // Give a title to our page
   // jsonData: data[3], // Pass data to the View
   // jsonDataSLEQ: data[2], // Pass data to the View
   // jsonDataRES: data[1], // Pass data to the View
   // jsonDataCAT: data[0] // Pass data to the View
  });

  //error handler
  router.use(function(err, req, res, next){
    console.log(err.stack);    // e.g., Not valid name
    return res.status(500).send('Internal Server Occured');
  });
});


/* GET the map page */
/*
router.get('/revision_fase1', function(req, res) {
  // var client = new Client(conString); // Setup our Postgres Client
 
  // client.connect(); // connect to the client

  res.render('revision_fase1', {
    title: "Revision Fase 1", // Give a title to our page
   // jsonData: data[3], // Pass data to the View
   // jsonDataSLEQ: data[2], // Pass data to the View
   // jsonDataRES: data[1], // Pass data to the View
   // jsonDataCAT: data[0] // Pass data to the View
  });

  //error handler
  router.use(function(err, req, res, next){
    console.log(err.stack);    // e.g., Not valid name
    return res.status(500).send('Internal Server Occured');
  });
});

*/

/* GET the map page */

router.get('/map', function(req, res) {
  // var client = new Client(conString); // Setup our Postgres Client
 
  // client.connect(); // connect to the client

/*  res.render('map', {
    title: "Plano Guia", // Give a title to our page
   // jsonData: data[3], // Pass data to the View
   // jsonDataSLEQ: data[2], // Pass data to the View
   // jsonDataRES: data[1], // Pass data to the View
   // jsonDataCAT: data[0] // Pass data to the View
  }); */

  

  



  //error handler
router.use(function(err, req, res, next){
  console.log(err.stack);    // e.g., Not valid name
  return res.status(500).send('Internal Server Occured');
});
  
 /* 

  var queryCAT = client.query(new Query(catalogos_query)); // Run our Query

  
  var data=[]
   
  queryCAT.on("row", function (row, result) {
    result.addRow(row);
  });
  // Pass the result to the map page
  queryCAT.on("end", function (result) {
    var dataCAT = result.rows[0].row_to_json // Save the JSON as variable data
    data.push(dataCAT); // push JSON data to data[]
  }); 

  var queryRES = client.query(new Query(res_query)); // Run our Query


  queryRES.on("row", function (row, result) {
    result.addRow(row);
  });
  // Pass the result to the map page
  queryRES.on("end", function (result) {
    var dataRES = result.rows[0].row_to_json // Save the JSON as variable data
    data.push(dataRES); // push JSON data to data[]
  }); 


  var querySLEQ = client.query(new Query(sleq_query)); // Run our Query

  querySLEQ.on("row", function (row, result) {
    result.addRow(row);
  });
  // Pass the result to the map page
  querySLEQ.on("end", function (result) {
    var dataSLEQ = result.rows[0].row_to_json // Save the JSON as variable data
    data.push(dataSLEQ); // push JSON data to data[]
  }); 

  var query = client.query(new Query(coffee_query)); // Run our Query
  query.on("row", function (row, result) {
      result.addRow(row);
  });

  
  // Pass the result to the map page
  query.on("end", function (result) {
      var data1 = result.rows[0].row_to_json // Save the JSON as variable data
      data.push(data1);
      res.render('map', {
          title: "Express API", // Give a title to our page
          jsonData: data[3], // Pass data to the View
          jsonDataSLEQ: data[2], // Pass data to the View
          jsonDataRES: data[1], // Pass data to the View
          jsonDataCAT: data[0] // Pass data to the View
      });
  }); */

  
}); 


router.get('/pruebaselect', function(req, res) {
  // var client = new Client(conString); // Setup our Postgres Client
 
  // client.connect(); // connect to the client

  res.render('pruebaselect', {
    title: "Revision Fase 1", // Give a title to our page
   // jsonData: data[3], // Pass data to the View
   // jsonDataSLEQ: data[2], // Pass data to the View
   // jsonDataRES: data[1], // Pass data to the View
   // jsonDataCAT: data[0] // Pass data to the View
  });

  //error handler
  router.use(function(err, req, res, next){
    console.log(err.stack);    // e.g., Not valid name
    return res.status(500).send('Internal Server Occured');
  });
});

router.get('/opg/analytics_browser', function(req, res) {
  // var client = new Client(conString); // Setup our Postgres Client
 
  // client.connect(); // connect to the client

  res.render('analytics_browser', {
    title: "Analytics Browser" 
  });

  //error handler
  router.use(function(err, req, res, next){
    console.log(err.stack);    // e.g., Not valid name
    return res.status(500).send('Internal Server Occured');
  });
});

router.get('/opg/vs_admin', function(req, res) {
  // var client = new Client(conString); // Setup our Postgres Client
 
  // client.connect(); // connect to the client

  res.render('vs_admin', {
    title: "VScene BD Admnin" 
  });

  //error handler
  router.use(function(err, req, res, next){
    console.log(err.stack);    // e.g., Not valid name
    return res.status(500).send('Internal Server Occured');
  });
});

/* GET Postgres select */
router.get('/select_query', function (req, res) {
  
  try{

    var table=req.query.tabla;
    var filter=req.query.filtro; 
    var select_query=req.query.select;
    
    
    // var select_query = "SELECT * FROM users_visor ORDER BY year,month,day,hour,minute,second"
    // var select_query = "SELECT * FROM "+table+" WHERE "+filter+"  ORDER BY CAST (year AS INTEGER),CAST (month AS INTEGER),CAST (day AS INTEGER),CAST (hour AS INTEGER),CAST (minute AS INTEGER),CAST (second AS INTEGER)"

    client.query(select_query, (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).json(results.rows)
    })

    /*var query = client.query(new Query(select_query));
    query.on("row", function (row, result) {
      result.addRow(row);
    });
    query.on("end", function (result) {
      //res.send(result.rows);
      res.status(200).json(results.rows);
      res.end();
    }); */

  }catch( err ) {
    console.log("Error en servicio at="+err);
  }  
});

/* GET Postgres Server select */
router.get('/opg/select_query', function (req, res) {
  
  try{

    var select_query=req.query.select;
    
    clientServer.query(select_query, (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).json(results.rows)
    })
   

  }catch( err ) {
    console.log("Error en servicio at="+err);
  }  
});

router.get('/opg/select_query_rpg', function (req, res) {
  
  try{

    var select_query=req.query.select;

    //console.log(select_query)
    
    
    clientFASE1.query(select_query, (error, results) => {
      if (error) {
        throw error
      }
     
      res.status(200).json(results.rows)
    }) 
    

  }catch( err ) {
    console.log("Error en servicio at="+err);
  }  
});


router.get('/opg/select_query_rpg_cross', async function (req, res) {

  var select_query=req.query.select;

  var protocol_server=req.query.server

  geojsonRES=null

  //console.log(select_query)

  try{

    let url = new URL(protocol_server+"/opg/select_query_rpg");
    const params = {select: select_query};
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    const dataRequest = {
        method: 'GET'
    };
    var response = await fetch(url,dataRequest);
    // console.log(response);
    geojsonRES = await response.json();

   
  }catch( err ) {
    console.log("Error en llamada cross="+err);
  } 

  
  res.send(geojsonRES);
  res.end();

});





module.exports = router;
