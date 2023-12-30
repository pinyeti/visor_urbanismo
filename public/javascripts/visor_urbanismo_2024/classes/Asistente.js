/**
 * Clase para gestionar el asistente de voz.
 * @memberof module:Frontend
 */
class Asistente {
  /**
   * Crea una instancia de Asistente y realiza la inicialización.
   */
  constructor() {
    this.initialize();
  }

  /**
   * Inicializa el asistente de voz.
   */
  initialize() {
    if (annyang) {
      console.log("pasa anyanag");

      annyang.setLanguage("es-ES");
      const self = this;

      annyang.addCallback(
        "resultNoMatch",
        async function (userSaid, commandText, phrases) {
          console.log(userSaid); // sample output: 'hello'

          const doc = esCompromise(userSaid[0]); // window.esCompromise

          self.processDOC(doc);
          /*const stemmer = new PorterStemmer();

          console.log(doc.json());

          let arrayTerms = doc.terms().out("array");
          console.log(arrayTerms);

          for (let n = 0; n < arrayTerms.length; n++) {
            arrayTerms[n] = stemmer.stem(arrayTerms[n].toLowerCase());
            //arrayTerms[n] = self.sinDiacriticos(arrayTerms[n]);
          }
          console.log(arrayTerms);*/

				

          const partesDelHabla = doc
            .terms()
            .filter((term) => term.pos)
            .map((term) => ({ palabra: term.text, parteDelHabla: term.pos }));

					console.log(partesDelHabla);

					console.log(doc.match("equipamiento").growRight('two').out('array'))
        }
      );

      annyang.debug();
    }
  }

  /**
   * Procesa un documento lingüístico.
   *
   * @param {Document} doc - El documento lingüístico a procesar.
   */
  processDOC(doc) {
    const stemmer = new PorterStemmer();

    console.log(doc.json());

    let arrayTerms = doc.terms().out("array");
    console.log(arrayTerms);

    for (let n = 0; n < arrayTerms.length; n++) {
      arrayTerms[n] = stemmer.stem(arrayTerms[n].toLowerCase());
      arrayTerms[n] = this.sinDiacriticos(arrayTerms[n]);
    }
    console.log(arrayTerms);
  }

   /**
   * Elimina los diacríticos de un texto.
   *
   * @param {string} texto - El texto del que se eliminarán los diacríticos.
   * @returns {string} - El texto sin diacríticos.
   */
  sinDiacriticos(texto) {
    let de = "ÁÃÀÄÂÉËÈÊÍÏÌÎÓÖÒÔÚÜÙÛÑÇáãàäâéëèêíïìîóöòôúüùûñç",
      a = "AAAAAEEEEIIIIOOOOUUUUNCaaaaaeeeeiiiioooouuuunc",
      re = new RegExp("[" + de + "]", "ug");
    const sin = texto.replace(re, (match) => a.charAt(de.indexOf(match)));

    return sin;
  }
}
