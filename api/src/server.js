// Punto de entrada: inicia el servidor HTTP.
const os = require('node:os');
const app = require('./app');

// En la nube, la plataforma asigna el puerto con la variable PORT.
const PUERTO = process.env.PORT ?? 3000;

// Direcciones IPv4 del computador en la red local (las que usa el celular).
const ipsLocales = () =>
  Object.values(os.networkInterfaces())
    .flat()
    .filter((red) => red && red.family === 'IPv4' && !red.internal)
    .map((red) => red.address);

app.listen(PUERTO, () => {
  console.log(`API disponible en el puerto ${PUERTO} (/api/reservas)`);
  if (process.env.NODE_ENV !== 'production') {
    for (const ip of ipsLocales()) {
      console.log(`Desde el celular: http://${ip}:${PUERTO}/api/reservas`);
    }
  }
});