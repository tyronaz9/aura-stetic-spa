import type { EstadoReserva, Servicio } from './types';

export const SERVICIOS: Servicio[] = [
  { nombre: 'Limpieza básica', categoria: 'Faciales', descripcion: 'Limpieza versátil para extraer impurezas y células muertas.', precio: 25, imagen: require('../assets/img/limpieza-basica.webp') },
  { nombre: 'Facial hidratante relax', categoria: 'Faciales', descripcion: 'Hidratación y relajación para tu piel, sin extracciones.', precio: 30, imagen: require('../assets/img/facial-hidratante-relax.webp') },
  { nombre: 'Facial renueva tu luminosidad', categoria: 'Faciales', descripcion: 'Renueva la luminosidad de la piel opaca.', precio: 30, imagen: require('../assets/img/facial-renueva-tu-luminosidad.webp') },
  { nombre: 'Limpieza profunda hidratante', categoria: 'Faciales', descripcion: 'Limpieza profunda con hidratación.', precio: 35, imagen: require('../assets/img/limpieza-profunda-hidratante.webp') },
  { nombre: 'Limpieza profunda detox', categoria: 'Faciales', descripcion: 'Ayuda a purificar la piel y retirar impurezas.', precio: 35, imagen: require('../assets/img/limpieza-profunda-detox.webp') },
  { nombre: 'Tratamiento anti-acné', categoria: 'Faciales', descripcion: 'Limpieza profunda indicada para piel con acné.', precio: 40, imagen: require('../assets/img/tratamiento-anti-acne.webp') },
  { nombre: 'Tratamiento despigmentante', categoria: 'Faciales', descripcion: 'Protocolo facial para tratar manchas e hiperpigmentación.', precio: 40, imagen: require('../assets/img/tratamiento-despigmentante.webp') },
  { nombre: 'Facial corea Glow', categoria: 'Faciales', descripcion: 'Un facial avanzado para una piel luminosa.', precio: 50, imagen: require('../assets/img/facial-corea-glow.webp') },
  { nombre: 'Facial Glass skin PDRN', categoria: 'Faciales', descripcion: 'Protocolo premium para una piel de aspecto luminoso.', precio: 60, imagen: require('../assets/img/facial-glass-skin-pdrn.webp') },
  { nombre: 'Facial lifting con radiofrecuencia', categoria: 'Faciales', descripcion: 'Tratamiento facial con radiofrecuencia para firmeza.', precio: 40, imagen: require('../assets/img/facial-lifting-con-radiofrecuencia.webp') },
  { nombre: 'Corrección de textura y cicatrices', categoria: 'Faciales', descripcion: 'Protocolo para mejorar la textura y apariencia de cicatrices.', precio: 50, imagen: require('../assets/img/tratamiento-correctivo-de-textura-y-cica.webp') },
  { nombre: 'Facial Glow con ultrasonido', categoria: 'Faciales', descripcion: 'Tratamiento facial con ultrasonido para aportar luminosidad.', precio: 35, imagen: require('../assets/img/facial-glow-con-ultrasonido.webp') },
  { nombre: 'Masaje relajante cuerpo completo', categoria: 'Corporales', descripcion: 'Alivia la tensión muscular y favorece la relajación.', precio: 25, imagen: require('../assets/img/masaje-relajante-cuerpo-completo.webp') },
  { nombre: 'Masaje relajante · 1 zona localizada', categoria: 'Corporales', descripcion: 'Masaje para liberar tensión en un área puntual.', precio: 15, imagen: require('../assets/img/masaje-relajante-1-zona-localizada.webp') },
  { nombre: 'Masaje relajante con acupuntura', categoria: 'Corporales', descripcion: 'Combina técnicas de masaje y estimulación de puntos energéticos.', precio: 30, imagen: require('../assets/img/masaje-relajante-con-acupuntura.webp') },
  { nombre: 'Maderoterapia', categoria: 'Corporales', descripcion: 'Técnica corporal con instrumentos de madera.', precio: 25, imagen: require('../assets/img/maderoterapia.webp') },
  { nombre: 'Drenaje linfático', categoria: 'Corporales', descripcion: 'Masaje suave que favorece la circulación y el drenaje.', precio: 20, imagen: require('../assets/img/drenaje-linfatico.webp') },
  { nombre: 'Limpieza profunda de espalda', categoria: 'Corporales', descripcion: 'Limpieza para retirar impurezas y exceso de grasa.', precio: 35, imagen: require('../assets/img/limpieza-profunda-de-espalda.webp') },
  { nombre: 'Despigmentación química', categoria: 'Corporales', descripcion: 'Tratamiento para manchas e irregularidades de la piel.', precio: 40, imagen: require('../assets/img/despigmentacion-quimica.webp') },
  { nombre: 'Drenaje reductor térmico', categoria: 'Corporales', descripcion: 'Protocolo corporal combinado con aparatología.', precio: 45, imagen: require('../assets/img/drenaje-reductor-termico.webp') },
  { nombre: 'Moldeo corporal intensivo', categoria: 'Corporales', descripcion: 'Protocolo corporal combinado de moldeo y termoterapia.', precio: 60, imagen: require('../assets/img/moldeo-corporal-intensivo-con-termoterap.webp') },
  { nombre: 'Cejas laminadas', categoria: 'Cejas y pestañas', descripcion: 'Realza y define la forma natural de tus cejas.', precio: 20, imagen: require('../assets/img/cejas-laminadas.webp') },
  { nombre: 'Cejas henna', categoria: 'Cejas y pestañas', descripcion: 'Color y definición para tus cejas.', precio: 15, imagen: require('../assets/img/cejas-laminadas-2.webp') },
  { nombre: 'Laminado / Henna', categoria: 'Cejas y pestañas', descripcion: 'Laminado y color para una mirada definida.', precio: 25, imagen: require('../assets/img/cejas-henna.webp') },
  { nombre: 'Micropigmentación efecto polvo', categoria: 'Cejas y pestañas', descripcion: 'Diseño de cejas con acabado efecto polvo.', precio: 100, imagen: require('../assets/img/laminado-y-henna.webp') },
  { nombre: 'Lifting de pestañas', categoria: 'Cejas y pestañas', descripcion: 'Realza la curvatura natural de las pestañas.', precio: 25, imagen: require('../assets/img/micropigmentacion-cejas-efecto-polvo.webp') },
  { nombre: 'Lifting efecto rímel', categoria: 'Cejas y pestañas', descripcion: 'Lifting con un acabado de mayor definición.', precio: 30, imagen: require('../assets/img/lifting-de-pestanas.webp') },
];

export const ESTADOS: EstadoReserva[] =
  ['pendiente', 'confirmada', 'atendida', 'cancelada'];

export const NOMBRES_ESTADO: Record<EstadoReserva, string> = {
  pendiente: 'Pendiente',
  confirmada: 'Confirmada',
  atendida: 'Atendida',
  cancelada: 'Cancelada',
};
