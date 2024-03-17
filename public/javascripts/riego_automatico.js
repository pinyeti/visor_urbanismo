// Cuando se presiona el botón A, activa una bomba conectada al pin P2 durante 3 segundos.
input.onButtonPressed(Button.A, function () {
  // Activa la bomba (pin P2 en alto).
  pins.digitalWritePin(DigitalPin.P2, 1);
  // Espera 3 segundos.
  basic.pause(3000);
  // Desactiva la bomba (pin P2 en bajo).
  pins.digitalWritePin(DigitalPin.P2, 0);
});

// Función para comprobar la humedad del suelo.
function comprobar() {
  // Lee el valor de humedad del pin P0.
  humedad = pins.analogReadPin(AnalogPin.P0);
  // Si la humedad es menor que 580, activa la bomba durante 3 segundos.
  if (humedad < 580) {
    pins.digitalWritePin(DigitalPin.P2, 1);
    basic.pause(3000);
    pins.digitalWritePin(DigitalPin.P2, 0);
  }
  // Mapea el valor de humedad a un rango de 0 a 25 para la visualización gráfica.
  grafico_humedad = Math.map(humedad, 1023, 150, 0, 25);
  // Si no_plot es falso, muestra el gráfico de barras de humedad en la pantalla LED.
  if (!no_plot) {
    led.plotBarGraph(grafico_humedad, 25);
  }
  // Espera 5 segundos antes de volver a comprobar.
  basic.pause(5000);
}
// Cuando se presiona el botón B, lee la humedad, limpia la pantalla, y muestra el valor de humedad.
input.onButtonPressed(Button.B, function () {
  humedad = pins.analogReadPin(AnalogPin.P0);
  // Limpia la pantalla LED.
  basic.clearScreen();
  // Desactiva temporalmente la visualización gráfica.
  no_plot = true;
  // Muestra el valor de humedad como texto.
  basic.showString("" + humedad);
  // Reactiva la visualización gráfica.
  no_plot = false;
});

let no_plot = false;
let grafico_humedad = 0;
let humedad = 0;
// Almacena el último valor de humedad leído.
// Muestra un patrón inicial en la pantalla LED al encenderse.
basic.showLeds(`
    # # # # .
    # . . . #
    # . . . #
    # # # # .
    # . . . .
    `);
// Espera 2 segundos.
basic.pause(2000);
// Limpia la pantalla.
basic.clearScreen();
basic.forever(comprobar);
