/**
 * Función principal de la aplicación.
 * Inicializa el mapa AF, analiza la URL para extraer parámetros y realiza acciones basadas en ellos.
 */
function mainApp_AF() {
  
	// Comprueba el evento de carga del DOM
  window.addEventListener("DOMContentLoaded", (event) => {
    // Analiza la URL para extraer el parámetro
    const urlParams = new URLSearchParams(window.location.search);
    const parametro = urlParams.get("parametro");

    if (parametro) {
      // Llama a la función y pasa el parámetro

      console.log(parametro);
      //ejecutarFuncionEnFrontend(parametro);
      const sigduMap = new AFMap("map", { zoomControl: "topleft" },parametro); 

    }else{
      const sigduMap = new AFMap("map", { zoomControl: "topleft" }); 
    }
    
  });

	// Crea una instancia del mapa SIGDU en el contenedor HTML con ID "map" y opciones de control de zoom en la esquina superior izquierda
  //const sigduMap = new AFMap("map", { zoomControl: "topleft" }); 

 
}
