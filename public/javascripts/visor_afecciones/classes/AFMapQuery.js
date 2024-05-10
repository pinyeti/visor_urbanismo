/**
 * Clase para gestionar consultas y operaciones en el mapa.
 * @memberof module:Frontend
 */
class AFMapQuery {
  /**
   * Crea una instancia de MapQuery.
   * @param {SigduMap} sigduMap - Instancia del mapa SigduMap.
   */
  constructor(sigduMap) {
    this.sigduMap = sigduMap;
    this.map = sigduMap.map;
    this.i18nHandler = sigduMap.i18nHandler;
    this.languageControl = sigduMap.languageControl;
    this.normativa = null;
    this.popup = null;

    this.eventsManagerRegistered = false;

    this.dataReport = [];
    this.dataReport_ajunt = [];
    this.dataReport_sin_informe = [];
    this.tableContainer = null;
  }

  addOrUpdateAfeccion(organo, imagen, afeccion, observacion) {
    // Encontrar el índice del órgano en dataReport
    const index = this.dataReport.findIndex((item) => item.organo === organo);

    if (index === -1) {
      // Si el órgano no existe, añadir un nuevo objeto
      this.dataReport.push({
        organo: organo,
        image: [imagen],
        afeccion: [afeccion],
        observaciones: [observacion],
      });
    } else {
      // Si el órgano ya existe, añadir la nueva afección y observación
      this.dataReport[index].image.push(imagen);
      this.dataReport[index].afeccion.push(afeccion);
      this.dataReport[index].observaciones.push(observacion);
    }
  }

  addOrUpdateAfeccion_ajunt(organo, imagen, afeccion, observacion) {
    // Encontrar el índice del órgano en dataReport
    const index = this.dataReport_ajunt.findIndex(
      (item) => item.organo === organo
    );

    if (index === -1) {
      // Si el órgano no existe, añadir un nuevo objeto
      this.dataReport_ajunt.push({
        organo: organo,
        image: [imagen],
        afeccion: [afeccion],
        observaciones: [observacion],
      });
    } else {
      // Si el órgano ya existe, añadir la nueva afección y observación
      this.dataReport_ajunt[index].image.push(imagen);
      this.dataReport_ajunt[index].afeccion.push(afeccion);
      this.dataReport_ajunt[index].observaciones.push(observacion);
    }
  }

  addOrUpdateAfeccion_sin_informe(organo, imagen, afeccion, observacion) {
    // Encontrar el índice del órgano en dataReport
    const index = this.dataReport_sin_informe.findIndex(
      (item) => item.organo === organo
    );

    if (index === -1) {
      // Si el órgano no existe, añadir un nuevo objeto
      this.dataReport_sin_informe.push({
        organo: organo,
        image: [imagen],
        afeccion: [afeccion],
        observaciones: [observacion],
      });
    } else {
      // Si el órgano ya existe, añadir la nueva afección y observación
      this.dataReport_sin_informe[index].image.push(imagen);
      this.dataReport_sin_informe[index].afeccion.push(afeccion);
      this.dataReport_sin_informe[index].observaciones.push(observacion);
    }
  }

  renderTable() {
    const table = document.createElement("table");
    table.className = "data-tableAF"; // Clase para estilos

    // Crear cabecera de la tabla
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    ["Òrgan/Administració", "Afecció", "Observacions"].forEach((text) => {
      const th = document.createElement("th");
      th.textContent = text;
      th.style.textAlign = "center"; // Centra el texto
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Crear cuerpo de la tabla
    const tbody = document.createElement("tbody");
    this.dataReport.forEach((item) => {
      if (item.afeccion.length > 0) {
        item.afeccion.forEach((afeccion, index) => {
          const row = document.createElement("tr");

          if (index === 0) {
            // Solo añadir la celda del órgano en la primera fila
            const organoCell = document.createElement("td");
            organoCell.textContent = item.organo;
            organoCell.className = "organo-cell"; // Aplicar clase específica
            organoCell.rowSpan = item.afeccion.length; // Establecer rowspan basado en el número de afecciones
            row.appendChild(organoCell);
          }

          const afeccionCell = document.createElement("td");
          const image = document.createElement("img");
          //console.log(item.image);
          image.src = item.image[index]; // Asegúrate de reemplazar esto con la ruta correcta a tu imagen
          image.alt = "Descripción de la imagen"; // Proporciona una descripción alternativa para la imagen
          image.style.height = "16px"; // Ajusta según necesites
          image.style.width = "16px"; // Ajusta según necesites
          image.style.marginRight = "5px"; // Espacio entre la imagen y el texto

          // Añadir la imagen a la celda
          afeccionCell.appendChild(image);

          // Añadir el texto después de la imagen
          const textNode = document.createTextNode(afeccion); // 'afeccion' debe ser la variable que contiene el texto
          afeccionCell.appendChild(textNode);
          row.appendChild(afeccionCell);

          const observacionCell = document.createElement("td");
          observacionCell.innerHTML = item.observaciones[index].replace(/<a /g, '<a target="_blank" ') || ""; // Agregar observaciones o dejar en blanco si no hay
          observacionCell.className = "observaciones-cell"; // Aplicar clase específica
          row.appendChild(observacionCell);

          tbody.appendChild(row);
        });
      } else {
        // En caso de no haber afecciones, se crea una fila con celdas vacías
        const row = document.createElement("tr");
        const organoCell = document.createElement("td");
        organoCell.textContent = item.organo;
        row.appendChild(organoCell);
        const emptyAfeccionCell = document.createElement("td");
        row.appendChild(emptyAfeccionCell);
        const emptyObservacionCell = document.createElement("td");
        row.appendChild(emptyObservacionCell);
        tbody.appendChild(row);
      }
    });
    table.appendChild(tbody);

    const title1 = document.createElement("div");
    title1.textContent =
      "1. Possibles afeccions les quals requereixen informe/autorització a aportar pel promotor";
    title1.style.textAlign = "left"; // Centra el texto
    //title1.style.textDecoration = 'underline'; // Subraya el texto
    title1.style.fontWeight = "bold"; // Aplica negrita
    title1.style.fontSize = "15px";
    title1.style.fontFamily = "Calibri, sans-serif"; // Establece la fuente a Calibri, con sans-serif como alternativa

    this.hoja.appendChild(title1);

    //this.hoja.appendChild(title1);

    if (this.dataReport.length > 0) {
      const subtitle1 = document.createElement("div");
      subtitle1.textContent =
        "Per a obtenir permís al punt indicat és possible que es requereixi aportar autorització o informe de:";
      //subtitle1.style.padding = "10px";
      subtitle1.style.textAlign = "left"; // Centra el texto
      subtitle1.style.fontSize = "14px";
      subtitle1.style.color = "grey";
      subtitle1.style.fontFamily = "Calibri, sans-serif"; // Establece la fuente a Calibri, con sans-serif como alternativa
      this.hoja.appendChild(subtitle1);
      this.hoja.appendChild(table);
    } else {
      const titleN = document.createElement("div");
      titleN.textContent = "  No s`han detectat afeccions";
      titleN.style.padding = "10px";
      titleN.style.textAlign = "left";
      titleN.style.fontWeight = "normal"; // Aplica negrita
      titleN.style.fontSize = "13px";
      titleN.style.fontFamily = "Calibri, sans-serif"; // Establece la fuente a Calibri, con sans-serif como alternativa
      this.hoja.appendChild(titleN);
    }
  }

  renderTable_ajunt() {
    const table = document.createElement("table");
    table.className = "data-tableAF"; // Clase para estilos

    // Crear cabecera de la tabla
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    ["Òrgan/Administració", "Afecció", "Observacions"].forEach((text) => {
      const th = document.createElement("th");
      th.textContent = text;
      th.style.textAlign = "center"; // Centra el texto
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Crear cuerpo de la tabla
    const tbody = document.createElement("tbody");
    this.dataReport_ajunt.forEach((item) => {
      if (item.afeccion.length > 0) {
        item.afeccion.forEach((afeccion, index) => {
          const row = document.createElement("tr");

          if (index === 0) {
            // Solo añadir la celda del órgano en la primera fila
            const organoCell = document.createElement("td");
            organoCell.textContent = item.organo;
            organoCell.className = "organo-cell"; // Aplicar clase específica
            organoCell.rowSpan = item.afeccion.length; // Establecer rowspan basado en el número de afecciones
            row.appendChild(organoCell);
          }

          const afeccionCell = document.createElement("td");
          const image = document.createElement("img");
          //console.log(item.image);
          image.src = item.image[index]; // Asegúrate de reemplazar esto con la ruta correcta a tu imagen
          image.alt = "Descripción de la imagen"; // Proporciona una descripción alternativa para la imagen
          image.style.height = "16px"; // Ajusta según necesites
          image.style.width = "16px"; // Ajusta según necesites
          image.style.marginRight = "5px"; // Espacio entre la imagen y el texto

          // Añadir la imagen a la celda
          afeccionCell.appendChild(image);

          // Añadir el texto después de la imagen
          const textNode = document.createTextNode(afeccion); // 'afeccion' debe ser la variable que contiene el texto
          afeccionCell.appendChild(textNode);
          row.appendChild(afeccionCell);

          const observacionCell = document.createElement("td");
          //observacionCell.textContent = item.observaciones[index] || ""; // Agregar observaciones o dejar en blanco si no hay
          observacionCell.innerHTML = item.observaciones[index].replace(/<a /g, '<a target="_blank" ') || ""; // Agregar observaciones con formato HTML o dejar en blanco si no hay
         

          observacionCell.className = "observaciones-cell"; // Aplicar clase específica
          row.appendChild(observacionCell);

          tbody.appendChild(row);
        });
      } else {
        // En caso de no haber afecciones, se crea una fila con celdas vacías
        const row = document.createElement("tr");
        const organoCell = document.createElement("td");
        organoCell.textContent = item.organo;
        row.appendChild(organoCell);
        const emptyAfeccionCell = document.createElement("td");
        row.appendChild(emptyAfeccionCell);
        const emptyObservacionCell = document.createElement("td");
        row.appendChild(emptyObservacionCell);
        tbody.appendChild(row);
      }
    });
    table.appendChild(tbody);

    const title1 = document.createElement("div");
    title1.textContent =
      "2. Possibles afeccions a sol·licitar d’ofici pel propi ajuntament";
    title1.style.textAlign = "left"; // Centra el texto
    //title1.style.textDecoration = 'underline'; // Subraya el texto
    title1.style.fontWeight = "bold"; // Aplica negrita
    title1.style.fontSize = "15px";
    title1.style.fontFamily = "Calibri, sans-serif"; // Establece la fuente a Calibri, con sans-serif como alternativa

    this.hoja.appendChild(title1);

    if (this.dataReport_ajunt.length > 0) {
      const subtitle1 = document.createElement("div");
      subtitle1.textContent =
        "Per a obtenir permís al punt indicat és possible que l’Ajuntament requereixi informe o autorització de:";
      //subtitle1.style.padding = "10px";
      subtitle1.style.textAlign = "left"; // Centra el texto
      subtitle1.style.fontSize = "14px";
      subtitle1.style.color = "grey";
      subtitle1.style.fontFamily = "Calibri, sans-serif"; // Establece la fuente a Calibri, con sans-serif como alternativa
      this.hoja.appendChild(subtitle1);
      this.hoja.appendChild(table);
    } else {
      const titleN = document.createElement("div");
      titleN.textContent = "  No s`han detectat afeccions";
      titleN.style.padding = "10px";
      titleN.style.textAlign = "left";
      titleN.style.fontWeight = "normal"; // Aplica negrita
      titleN.style.fontSize = "13px";
      titleN.style.fontFamily = "Calibri, sans-serif"; // Establece la fuente a Calibri, con sans-serif como alternativa
      this.hoja.appendChild(titleN);
    }
  }

  renderTable_sin_informe() {
    const table = document.createElement("table");
    table.className = "data-tableAF"; // Clase para estilos

    // Crear cabecera de la tabla
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    ["Afecció", "Observacions"].forEach((text) => {
      const th = document.createElement("th");
      th.textContent = text;
      th.style.textAlign = "center"; // Centra el texto
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Crear cuerpo de la tabla
    const tbody = document.createElement("tbody");
    this.dataReport_sin_informe.forEach((item) => {
      if (item.afeccion.length > 0) {
        item.afeccion.forEach((afeccion, index) => {
          const row = document.createElement("tr");

          const afeccionCell = document.createElement("td");
          const image = document.createElement("img");
          //console.log(item.image);
          image.src = item.image[index]; // Asegúrate de reemplazar esto con la ruta correcta a tu imagen
          image.alt = "Descripción de la imagen"; // Proporciona una descripción alternativa para la imagen
          image.style.height = "16px"; // Ajusta según necesites
          image.style.width = "16px"; // Ajusta según necesites
          image.style.marginRight = "5px"; // Espacio entre la imagen y el texto

          // Añadir la imagen a la celda
          afeccionCell.appendChild(image);

          // Añadir el texto después de la imagen
          const textNode = document.createTextNode(afeccion); // 'afeccion' debe ser la variable que contiene el texto
          afeccionCell.appendChild(textNode);
          row.appendChild(afeccionCell);

          const observacionCell = document.createElement("td");
          observacionCell.textContent = item.observaciones[index] || ""; // Agregar observaciones o dejar en blanco si no hay
          observacionCell.className = "observaciones-cell"; // Aplicar clase específica
          row.appendChild(observacionCell);

          tbody.appendChild(row);
        });
      } else {
        // En caso de no haber afecciones, se crea una fila con celdas vacías
        const row = document.createElement("tr");
        const organoCell = document.createElement("td");
        organoCell.textContent = item.organo;
        row.appendChild(organoCell);
        const emptyAfeccionCell = document.createElement("td");
        row.appendChild(emptyAfeccionCell);
        const emptyObservacionCell = document.createElement("td");
        row.appendChild(emptyObservacionCell);
        tbody.appendChild(row);
      }
    });
    table.appendChild(tbody);

    const title1 = document.createElement("div");
    title1.textContent =
      "3. Algunes possibles afeccions les quals no requereixen informe";
    title1.style.textAlign = "left";
    title1.style.fontWeight = "bold"; // Aplica negrita
    title1.style.fontSize = "15px";
    title1.style.fontFamily = "Calibri, sans-serif"; // Establece la fuente a Calibri, con sans-serif como alternativa
    this.hoja.appendChild(title1);

    if (this.dataReport_sin_informe.length > 0) {
      this.hoja.appendChild(table);
    } else {
      const titleN = document.createElement("div");
      titleN.textContent = "  No s`han detectat afeccions";
      titleN.style.padding = "10px";
      titleN.style.textAlign = "left";
      titleN.style.fontWeight = "normal"; // Aplica negrita
      titleN.style.fontSize = "13px";
      titleN.style.fontFamily = "Calibri, sans-serif"; // Establece la fuente a Calibri, con sans-serif como alternativa
      this.hoja.appendChild(titleN);
    }
  }

  renderTitle() {
    const title = document.createElement("div");
    title.style.margin = "auto";
    //title.style.width = "300px";
    title.textContent =
      "VISOR D’AFECCIONS SECTORIALS VINCULADES A LLICÈNCIES URBANÍSTIQUES";
    title.style.textAlign = "center"; // Centra el texto
    title.style.textDecoration = "underline"; // Subraya el texto
    title.style.fontWeight = "bold"; // Aplica negrita
    title.style.fontSize = "15px";
    title.style.fontFamily = "Calibri, sans-serif"; // Establece la fuente a Calibri, con sans-serif como alternativa

    this.hoja.appendChild(title);
  }

  renderAdvertencias() {
    var advertenciesDiv = document.createElement("div");
    advertenciesDiv.textContent = "Advertències:";
    advertenciesDiv.style.textAlign = "left";
    advertenciesDiv.style.fontWeight = "bold"; // Aplica negrita
    advertenciesDiv.style.fontSize = "14px";
    advertenciesDiv.style.fontFamily = "Calibri, sans-serif"; // Establece la fuente a Calibri, con sans-serif como alternativa
    advertenciesDiv.id = "advertencies";
    document.body.appendChild(advertenciesDiv);

    // Crear el contenido de las advertencias como listas
    var advertencia1 =
      "El present visor representa un esforç en recopilar possibles afeccions exigides des d’altres administracions/organismes en relació a la sol·licitud de llicències urbanístiques.";
    var advertencia2 =
      "Tractant-se de normativa aliena a l’Ajuntament la informació només pot ser orientativa. A tal efecte, cal dir que les possibles imperfeccions es corregiran tal qual la administració/òrgan competent ens faciliti les dades actualitzades en format vectorial.";
    var advertencia3 =
      "Hi ha afeccions geogràfiques que depenen del tipus d’obra o ús sol·licitats, així com d’altres factors més complexes  (info completa <a href='images/af_obras.pdf'>aquí</a>).";
    var advertencia4 =
      "Hi ha afeccions la autorització de les quals depèn de l’ús i no de la localització geogràfica (turisme, comerç, etc) (info completa <a href='images/af_obras.pdf'>aquí</a>).";

    // Crear lista de advertencias
    var listaAdvertencias = document.createElement("ul");
    listaAdvertencias.style.textAlign = "justify";
    listaAdvertencias.style.fontWeight = "normal";
    listaAdvertencias.style.fontSize = "13px";
    listaAdvertencias.style.fontFamily = "Calibri, sans-serif"; // Establece la fuente a Calibri, con sans-serif como alternativa

    // Crear elementos de lista para las advertencias
    var advertenciaElement1 = document.createElement("li");
    advertenciaElement1.innerHTML = advertencia1.replace(/<a /g, '<a target="_blank" ');

    var advertenciaElement2 = document.createElement("li");
    advertenciaElement2.innerHTML = advertencia2.replace(/<a /g, '<a target="_blank" ');

    var advertenciaElement3 = document.createElement("li");
    advertenciaElement3.innerHTML = advertencia3.replace(/<a /g, '<a target="_blank" ');

    var advertenciaElement4 = document.createElement("li");
    advertenciaElement4.innerHTML = advertencia4.replace(/<a /g, '<a target="_blank" ');

    // Agregar elementos de lista a la lista
    listaAdvertencias.appendChild(advertenciaElement1);
    listaAdvertencias.appendChild(advertenciaElement2);
    listaAdvertencias.appendChild(advertenciaElement3);
    listaAdvertencias.appendChild(advertenciaElement4);

    // Insertar lista de advertencias en el div contenedor
    advertenciesDiv.appendChild(listaAdvertencias);

    this.hoja.appendChild(advertenciesDiv);
  }

  printReport() {
    // Captura el contenido del tableContainer
    const hoja = this.hoja.cloneNode(true);

    const printableContent = this.hoja.innerHTML;

    const cssStyles = `
        <style>
        
          .data-tableAF {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-family: 'Calibri', sans-serif; /* Define Calibri como la fuente principal, con sans-serif como alternativa */
            font-size: 13px;
          }
          
          .data-tableAF th, .data-tableAF td {
            border: 1px solid #000000; /* Borde negro */
            padding: 8px;
            text-align: left; /* Alineación central para todas las celdas */
          }
          
          .data-tableAF th {
            background-color: #d6d6d6;
            color: rgb(0, 0, 0);
            font-size: 14px;
          }
          
          .data-tableAF .organo-cell {
            font-weight: bold; /* Aplica negrita al texto */
            text-align: center; 
          }
              
          .data-tableAF .observaciones-cell { /* Clase específica para celdas de observaciones */
            text-align: justify; /* Alineación justificada para las observaciones */
            vertical-align: top; /* Asegura que el texto empiece desde la parte superior de la celda */
          }
          
          .data-tableAF ul {
            padding-left: 20px;
            margin: 0; /* Asegura que no hay espacio extra alrededor del texto */
          }
          
          .data-tableAF li {
            list-style-type: disc;
          }
        
        </style>
    `;

    // Contenido del pie de página
    const footerContent = `
        <footer>
            <!-- Contenido de tu pie de página -->
            SIGDU - Servei Innnovació i Gestió de Dades de Urbanisme - AJuntament Palma
        </footer>
    `;

    // Crea un nuevo documento para imprimir
    //const printWindow = window.open('', '_blank');
    const printWindow = window.open(' ', ' ');
    printWindow.document.open();
    printWindow.document.write(`
        <html>
            <head>
                <title>SIGDU - Servei de Innovació i Gestió de dades de Urbanisme - Ajuntament de Palma</title>
                ${cssStyles} <!-- Inserta los estilos CSS aquí -->
               <!-- <link rel="stylesheet" type="text/css" href="https:/sigdu-urbanismo.net/stylesheets/style.css">-->
            </head>
           
            <body>
             
              ${printableContent}
            
            </body>
        </html>
    `);
    
    //printWindow.document.write(printableContent);
    printWindow.document.close();

    // Espera a que el contenido se cargue antes de imprimir
    printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
    };
}

  renderReport() {
    this.tableContainer = document.getElementById("userinfo");
    this.tableContainer.style.height = "95%";
    this.tableContainer.innerHTML = ""; // Limpiar el contenedor de la tabla antes de volver a renderizar

    // Crear botón de impresión
    const printButton = document.createElement("button");
    printButton.textContent = "Imprimir";
    printButton.addEventListener("click", () => {
        this.printReport();
    });

    // Agregar botón de impresión al contenedor
    this.tableContainer.appendChild(printButton);

    this.hoja = document.createElement("div");
    this.hoja.classList.add("mi-clase"); // Asigna una clase a this.hoja
    this.hoja.style.backgroundColor = "white";
    this.hoja.style.padding = "20px";
    this.hoja.style.boxShadow = "0px 0px 10px #ccc"; // Aplica la sombra
    this.hoja.style.height = "95%";
    this.hoja.style.overflowY = "auto";

    const imageDiv = document.createElement("div"); // Crea un div contenedor para la imagen
    imageDiv.style.textAlign = "center"; // Centra el contenido dentro del div
    const image = document.createElement("img");
    //console.log(item.image);
    image.src = "images/SIGDU_VISOR.jpg"; // Asegúrate de reemplazar esto con la ruta correcta a tu imagen
    image.alt = "Descripción de la imagen"; // Proporciona una descripción alternativa para la imagen
    //image.style.height = '16px';  // Ajusta según necesites
    image.style.width = "260px"; // Ajusta según necesites
    image.style.marginRight = "5px"; // Espacio entre la imagen y el texto

    // Añade la imagen al div contenedor
    imageDiv.appendChild(image);

    // Añadir la imagen a la celda
    this.hoja.appendChild(imageDiv);

    this.hoja.appendChild(document.createElement("br"));
    this.renderTitle();
    this.hoja.appendChild(document.createElement("br"));
    this.hoja.appendChild(document.createElement("br"));
    this.renderTable();
    this.hoja.appendChild(document.createElement("br"));
    this.hoja.appendChild(document.createElement("br"));
    this.renderTable_ajunt();
    this.hoja.appendChild(document.createElement("br"));
    this.hoja.appendChild(document.createElement("br"));
    this.renderTable_sin_informe();

    this.hoja.appendChild(document.createElement("br"));
    this.hoja.appendChild(document.createElement("br"));
    this.renderAdvertencias();
    this.hoja.appendChild(document.createElement("br"));
    this.hoja.appendChild(document.createElement("br"));
    this.hoja.appendChild(document.createElement("br"));


    /*const imageDiv = document.createElement("div"); // Crea un div contenedor para la imagen
    imageDiv.style.textAlign = "center"; // Centra el contenido dentro del div
    const image = document.createElement("img");
    //console.log(item.image);
    image.src = "images/SIGDU_VISOR.jpg"; // Asegúrate de reemplazar esto con la ruta correcta a tu imagen
    image.alt = "Descripción de la imagen"; // Proporciona una descripción alternativa para la imagen
    //image.style.height = '16px';  // Ajusta según necesites
    image.style.width = "260px"; // Ajusta según necesites
    image.style.marginRight = "5px"; // Espacio entre la imagen y el texto

    // Añade la imagen al div contenedor
    imageDiv.appendChild(image);

    // Añadir la imagen a la celda
    this.hoja.appendChild(imageDiv);*/

    this.tableContainer.appendChild(this.hoja);
  }

  /**
   * Realiza una consulta en el mapa utilizando las coordenadas proporcionadas y muestra los resultados en un popup.
   *
   * @param {Object} e - El objeto de eventos que contiene las coordenadas latlng en formato UTM.
   * @returns {Promise<void>} - Una promesa que resuelve cuando se completan todas las consultas y se muestra el popup.
   */
  async queryByPoint(e) {
    const { x, y } = e.latlng.utm();

    /*let urlA = new URL(window.location.protocol+'//'+window.location.host+"/opg/write_data_user");
    const params = {accion:"info_features_vigente", latlng:e.latlng, lat:e.latlng.lat, lng:e.latlng.lng, x:x, y:y};
    Object.keys(params).forEach(key => urlA.searchParams.append(key, params[key]));
    const dataRequest = {
        method: 'POST'
    }; 
    await fetch(urlA,dataRequest);*/

    // Activa un spinner de carga en el mapa.
    this.map.spin(true);

    this.dataReport = [];
    this.dataReport_ajunt = [];
    this.dataReport_sin_informe = [];

    // Define una matriz arrayTablas con nombres de tablas para las consultas.
    const arrayTablas = [
      "obras.af_porn_serra_tramuntana",
      "obras.af_enp",
      "obras.af_epxn_2000",
      "obras.af_abc_fontanelles",
      "obras.af_zar_palma",
      "obras.af_inundables_t500_2",
      "obras.af_inundables_freatic",
      "obras.af_potenc_inund",
      "obras.af_flux_pref",
      "obras.af_torrentes_zona_servidumbre_uso",
      "obras.af_torrentes_zona_servidumbre_pol",
      "obras.af_buffer_humides",
      "obras.af_pot_humedas",
      "obras.af_protecc_pous_proveim",
      "obras.af_apt_carreteres",
      "obras.af_apt_l",
      "obras.af_via_ferrea_sfm",
      "obras.af_via_ferrea_soller",
      "obras.af_cch",
      "obras.af_bic_bc_cic",
      "obras.af_zonas_n_r_parq",
      "obras.af_centro_historico",
      "obras.af_nt",
      "obras.af_costas",
      "obras.af_zdpmt_agua",
      "obras.af_aip",
      "obras.v_pg_rustic",
      "obras.af_zona_ports",
      "obras.af_zona_aerop",
      "obras.af_zpzm",
      "obras.af_emerg",
      "obras.af_parcbit",
      "obras.af_poliducte",
      "obras.af_gasoducte_3",
      "obras.af_proteccionaeropuerto",
      "obras.af_parc_nacional",
      "obras.v_pg_rustico_riesgos",
    ];

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
        this.createHTMLForTabla(tabla, geojsonRES);
      }
    }

    const self = this; // Almacena una referencia a 'this'

    const elem = document.getElementById("userinfo");

    this.renderReport();

    //if (this.sigduMap.sidebarStatus == "cerrado") {
      this.sigduMap.sidebar.open("userinfo");
    //}

    this.map.spin(false);
    console.log(this.dataReport);
  }

  /**
   * Crea HTML para una tabla específica según el tipo de tabla y los datos GeoJSON.
   *
   * @param {string} tabla - El nombre de la tabla.
   * @param {object} geojsonRES - Datos GeoJSON asociados a la tabla.
   * @returns {string} HTML generado.
   */
  async createHTMLForTabla(tabla, geojsonRES) {
    //const back_color = "102,102,102,1";
    let html = ``;
    console.log("Tabla for: " + tabla);

    switch (tabla) {
      case "parcela_su_ru_calles":
        html = this.createHTML_situacion(geojsonRES);
        break;
      case "obras.af_porn_serra_tramuntana":
        this.addOrUpdateAfeccion_ajunt(
          "Medi ambient (CAIB)",
          "images/legends/af_porn_serra_tramuntana.png",
          "PORN",
          "Més info <a href='images/af_obras.pdf'>aquí</a>"
        );
        break;
      case "obras.af_enp":
        this.addOrUpdateAfeccion_ajunt(
          "Medi ambient (CAIB)",
          "images/legends/af_espacio_natural_protegido.png",
          "Espai natural protegit",
          "Més info <a href='images/af_obras.pdf'>aquí</a>"
        );
        break;
      case "obras.af_epxn_2000":
        this.addOrUpdateAfeccion_ajunt(
          "Medi ambient (CAIB)",
          "images/legends/af_red_natura_2000.png",
          "Espai protegit xarxa natura 2000",
          "Més info <a href='images/af_obras.pdf'>aquí</a>"
        );
        break;
      case "obras.af_abc_fontanelles":
        this.addOrUpdateAfeccion_ajunt(
          "Medi ambient (CAIB)",
          "images/legends/af_abc_fontanelles.png",
          "Àrea Biològica Crítica",
          "Més info <a href='images/af_obras.pdf'>aquí</a>"
        );
        break;
      case "obras.af_zar_palma":
        this.addOrUpdateAfeccion(
          "Medi ambient (CAIB)",
          "images/legends/af_zar_palma.png",
          "ZAR - APR incendis",
          ""
        );
        break;
      case "obras.af_inundables_t500_2":
        this.addOrUpdateAfeccion(
          "Recursos Hídrics (CAIB)",
          "images/legends/af_inundables_t500.png",
          "Zona inundable T500",
          "El Departament d`Obres dona la opció de presentar l`Annex de substitució de procediment de recursos hídrics (Més info <a href='images/af_recursos_hidricos.pdf'>aquí</a>)"
        );
        break;
      case "obras.af_inundables_freatic":
        this.addOrUpdateAfeccion(
          "Recursos Hídrics (CAIB)",
          "images/legends/af_inundables_freatico.png",
          "Zona inundable per nivell freàtic",
          "El Departament d`Obres dona la opció de presentar l`Annex de substitució de procediment de recursos hídrics (Més info <a href='images/af_recursos_hidricos.pdf'>aquí</a>)"
        );
        break;
      case "obras.af_potenc_inund":
        this.addOrUpdateAfeccion(
          "Recursos Hídrics (CAIB)",
          "images/legends/af_potencialmente_inundable.png",
          "Zona potencialment inundable",
          "El Departament d’Obres dona la opció de presentar l’Annex de substitució de procediment de recursos hídrics (Més info <a href='images/af_recursos_hidricos.pdf'>aquí</a>)"
        );
        break;
      case "obras.af_flux_pref":
        this.addOrUpdateAfeccion(
          "Recursos Hídrics (CAIB)",
          "images/legends/af_flujo_preferente.png",
          "Zona inundable de flux preferent",
          "El Departament d’Obres dona la opció de presentar l’Annex de substitució de procediment de recursos hídrics (Més info <a href='images/af_recursos_hidricos.pdf'>aquí</a>)"
        );
        break;
      case "obras.af_torrentes_zona_servidumbre_uso":
        this.addOrUpdateAfeccion(
          "Recursos Hídrics (CAIB)",
          "images/legends/af_zona_servitud.png",
          "Zona de servitud",
          "El Departament d’Obres dona la opció de presentar l’Annex de substitució de procediment de recursos hídrics (<Més info <a href='images/af_recursos_hidricos.pdf'>aquí</a>)"
        );
        break;
      case "obras.af_torrentes_zona_servidumbre_pol":
        this.addOrUpdateAfeccion(
          "Recursos Hídrics (CAIB)",
          "images/legends/af_zona_policia.png",
          "Zona de policia",
          "El Departament d’Obres dona la opció de presentar l’Annex de substitució de procediment de recursos hídrics (Més info <a href='images/af_recursos_hidricos.pdf'>aquí</a>)"
        );
        break;
      case "obras.af_buffer_humides":
        this.addOrUpdateAfeccion(
          "Recursos Hídrics (CAIB)",
          "images/legends/af_zonas_humedas.png",
          "Zona humida",
          "Més info <a href='images/af_obras.pdf'>aquí</a>"
        );
        break;
      case "obras.af_pot_humedas":
        this.addOrUpdateAfeccion(
          "Recursos Hídrics (CAIB)",
          "images/legends/af_pot_humedas.png",
          "Zona potencialment humida",
          "Més info <a href='images/af_obras.pdf'>aquí</a>"
        );
        break;
      case "obras.af_protecc_pous_proveim":
        this.addOrUpdateAfeccion(
          "Recursos Hídrics (CAIB)",
          "images/legends/af_proteccion_prov.png",
          "Perímetre de protecció de captació de proveïment a població",
          "S’ha agafat la opció més desfavorable (1 Km). Consultar Art. 76 del Pla Hidrològic. Més info <a href='images/af_obras.pdf'>aquí</a>"
        );
        break;
      case "obras.af_apt_carreteres":
        this.addOrUpdateAfeccion(
          "Carreteres (CIM)",
          "images/legends/af_apt_carreteras.png",
          "APT-Carreteres",
          "Més info <a href='images/af_obras.pdf'>aquí</a>"
        );
        break;
      case "obras.af_apt_l":
        this.addOrUpdateAfeccion(
          "Costes (CIM)",
          "images/legends/af_apt_litoral.png",
          "APT-Litoral",
          "Més info <a href='images/af_obras.pdf'>aquí</a>"
        );
        break;
      case "obras.af_via_ferrea_sfm":
        this.addOrUpdateAfeccion(
          "Serveis ferroviaris de Mallorca (SFM)",
          "images/legends/af_via_ferrea_sfm.png",
          "Protecció de via ferrea",
          "Més info <a href='images/af_obras.pdf'>aquí</a>"
        );
        break;
      case "obras.af_via_ferrea_soller":
        this.addOrUpdateAfeccion(
          "Ferrocarril de Sóller",
          "images/legends/af_via_ferrea_soller.png",
          "Protecció de via ferrea",
          "Més info <a href='images/af_obras.pdf'>aquí</a>"
        );
        break;
      case "obras.af_costas":
        let organo = "";
        let color = "";
        let tipo_zona = "";
        switch (geojsonRES.features[0].properties.codigo) {
          case "ZSP":
            if (geojsonRES.features[0].properties.clas_suelo == "SR") {
              organo = "COSTAS (CAIB)";
              this.addOrUpdateAfeccion(
                "Costes (CAIB)",
                "images/legends/af_costas_zsp.png",
                "Zona de servitud de protecció a sòl rústic",
                "Més info <a href='images/af_obras.pdf'>aquí</a>"
              );
            } else {
              organo = "COSTAS (CIM)";
              this.addOrUpdateAfeccion(
                "Costes (CIM)",
                "images/legends/af_costas_zsp.png",
                "Zona de servitud de protecció",
                "Més info <a href='images/af_obras.pdf'>aquí</a>"
              );
            }
            break;
          case "TR":
            if (geojsonRES.features[0].properties.clas_suelo == "SR") {
              organo = "COSTAS (CAIB)";
              this.addOrUpdateAfeccion(
                "Costes (CAIB)",
                "images/legends/af_costas_tr.png",
                "Zona de servitud de trànsit a sòl rústic",
                "Més info <a href='images/af_obras.pdf'>aquí</a>"
              );
            } else {
              organo = "COSTAS (CIM)";
              this.addOrUpdateAfeccion(
                "Costes (CIM)",
                "images/legends/af_costas_tr.png",
                "Zona de servitud de trànsit",
                "Més info <a href='images/af_obras.pdf'>aquí</a>"
              );
            }
            break;
          case "ZD":
            this.addOrUpdateAfeccion(
              "Costes (Administració de l’Estat)",
              "images/legends/af_zdpmt_agua.png",
              "Zona de domini públic M-T",
              "Més info <a href='images/af_obras.pdf'>aquí</a>"
            );
            break;
        }
        break;
      case "obras.af_aip":
        this.addOrUpdateAfeccion(
          "Territori (CIM))",
          "images/legends/af_aip.png",
          "ART o AIP",
          "Des de el CIM no s’ha considerat oportú facilitar-nos les dades vectorials corresponents a les ART."
        );
        break;
      case "obras.af_zdpmt_agua":
        this.addOrUpdateAfeccion(
          "Costes (Administració de l’Estat)",
          "images/legends/af_zdpmt_agua.png",
          "Zona de domini públic M-T",
          "Més info <a href='images/af_obras.pdf'>aquí</a>"
        );
        break;
      case "obras.af_cch":
        this.addOrUpdateAfeccion_ajunt(
          "Comissió de Centre històric i catàleg",
          "images/legends/af_catalogos_molinos_entorno.png",
          "Element protegit/catalogat",
          ""
        );
        break;
      case "obras.af_bic_bc_cic":
        this.addOrUpdateAfeccion(
          "Patrimoni Historicoartístic (CIM)",
          "images/legends/af_bic_bc_cic.png",
          "BIC, BC, CIC",
          "Més info <a href='images/af_obras.pdf'>aquí</a>"
        );
        break;
      case "obras.af_zonas_n_r_parq":
        this.addOrUpdateAfeccion_ajunt(
          "Comissió de Centre històric i catàleg",
          "images/legends/af_zonas_n_r_parq.png",
          "Zona R, r o N",
          "Ver Art. 287 de las NN.UU."
        );
        break;
      case "obras.af_centro_historico":
        this.addOrUpdateAfeccion_ajunt(
          "Comissió de Centre històric i catàleg",
          "images/legends/af_centro_historico.png",
          "Centre històric",
          "En el cas d’obres al subsòl (exclosa zona avingudes)"
        );
        break;
      case "obras.af_nt":
        this.addOrUpdateAfeccion_ajunt(
          "Comissió de Centre històric i catàleg",
          "images/legends/af_nucleos_tradicionales.png",
          "Nucli tradicional",
          "A criteri del tècnic que informa la sol·licitud de llicència."
        );
        break;
      case "obras.v_pg_rustic":
        this.addOrUpdateAfeccion(
          "Agricultura (CAIB)",
          "images/legends/af_rustico.png",
          "Sòl rústic",
          "Afecció depenent de l’ús, tipus d’obra i altres factors (Més info <a href='images/af_obras.pdf'>aquí</a>)"
        );
        this.addOrUpdateAfeccion_ajunt(
          "Territori (CIM)",
          "images/legends/af_rustico.png",
          "Sòl rústic",
          `En cas d’Habitatge unifamiliar, i sempre i quan la normativa en permeti l’ús.<br> El promotor ha d’aportar certa documentació per que l’Ajuntament pugui sol·licitar aquest informe (<a href='images/af_obras.pdf'>més info aquí</a>)`
        );
        this.addOrUpdateAfeccion_ajunt(
          "Agencia de defensa del territori (CIM)",
          "images/legends/af_rustico.png",
          "Sòl rústic",
          "En el cas de legalització d’actes objecte d’un expedient instruït o resolt pel CIM.<br> El promotor ha d’aportar certa documentació per que l’Ajuntament pugui sol·licitar aquest informe (<a href='images/af_obras.pdf'>més info aquí</a>)."
        );
        // falta art (aip) no veo tabla
        break;
      case "obras.af_zona_ports":
        this.addOrUpdateAfeccion(
          "Autoritat portuària de Balears (Administració de l’Estat)",
          "images/legends/af_zona_ports.png",
          "Zona de ports",
          "Més info <a href='images/af_obras.pdf'>aquí</a>"
        );
        break;
      case "obras.af_zona_aerop":
        this.addOrUpdateAfeccion(
          "AENA (Administració de l’Estat)",
          "images/legends/af_zona_aerop.png",
          "Zona de l’aeroport",
          "Més info <a href='images/af_obras.pdf'>aquí</a>"
        );
        break;
      case "obras.af_zpzm":
        this.addOrUpdateAfeccion(
          "Defensa (Administració de l’Estat)",
          "images/legends/af_zpzm.png",
          "Zona de protecció de zones militars",
          "Més info <a href='images/af_obras.pdf'>aquí</a>"
        );
        break;
      case "obras.af_emerg":
        this.addOrUpdateAfeccion(
          "Emergències (CAIB)",
          "images/legends/af_emerg.png",
          "Zona de seguretat d’emergències",
          "Més info <a href='images/af_obras.pdf'>aquí</a>"
        );
        break;
      case "obras.af_parcbit":
        this.addOrUpdateAfeccion(
          "Parc Bit (CAIB)",
          "images/legends/af_parcbit.png",
          "Àmbit del Parc Bit",
          "Més info <a href='images/af_obras.pdf'>aquí</a>"
        );
        break;
      case "obras.af_poliducte":
        this.addOrUpdateAfeccion(
          "CLH S.A.",
          "images/legends/af_poliducto.png",
          "Zona de servitud poliducte",
          "Més info <a href='images/af_obras.pdf'>aquí</a>"
        );
        break;
      case "obras.af_gasoducte_3":
        this.addOrUpdateAfeccion(
          "Redexis S.A.",
          "images/legends/af_gasoducto.png",
          "Zona de servitud gasoducte",
          "Més info <a href='images/af_obras.pdf'>aquí</a>"
        );
        break;
      case "obras.af_proteccionaeropuerto":
        this.addOrUpdateAfeccion_ajunt(
          "AESA",
          "images/legends/af_proteccionaeropuerto.png",
          "Servitud aeronàutica",
          "El promotor ha d’aportar certa documentació per que l’Ajuntament pugui sol·licitar aquest informe (Més info <a href='images/af_obras.pdf'>aquí</a>)."
        );
        break;
      case "obras.af_parc_nacional":
        this.addOrUpdateAfeccion_ajunt(
          "Òrgan gestor de Cabrera (CAIB",
          "images/legends/af_parc_nacional_cabrera.png",
          "Parc Nacional",
          "<p>Més info <a href='images/af_obras.pdf' style='background-color: #4CAF50; color: white; padding: 4px 4px; text-decoration: none; border-radius: 5px; transition: background-color 0.3s, color 0.3s;' onmouseover='this.style.backgroundColor=\"#45a049\"' onmouseout='this.style.backgroundColor=\"#4CAF50\"'>aquí</a></p>"
        
        );
        break;
      case "obras.v_pg_rustico_riesgos":
        for (var r = 0; r < geojsonRES.features.length; r++) {
          switch (geojsonRES.features[r].properties.subcategoria) {
            case "APR-CN":
              this.addOrUpdateAfeccion_sin_informe(
                "",
                "images/legends/af_apr_cn.png",
                "APR-CN Contaminació d’aquifers",
                ""
              );
              break;
            case "APR-ER":
              this.addOrUpdateAfeccion_sin_informe(
                "",
                "images/legends/af_apr_er.png",
                "APR-ER Erosió",
                ""
              );
              break;
            case "APR-ES":
              this.addOrUpdateAfeccion_sin_informe(
                "",
                "images/legends/af_apr_es.png",
                "APR-ES Esllavissaments",
                ""
              );
              break;
          }
        }

        break; 
    }

    return html;
  }
}
