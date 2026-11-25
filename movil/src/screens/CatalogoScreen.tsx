import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SERVICIOS } from '../datos';

type Props = {
  styles: Record<string, any>;
  onReservarPestana: () => void;
  onReservarServicio: (servicio: string) => void;
  onAbrirEnlace: (url: string) => void;
};

const URL_UBICACION =
  'https://www.google.com/maps?q=Ciudadela+El+Maestro,+Portoviejo,+Ecuador';
const URL_INSTAGRAM =
  'https://www.instagram.com/aura_stetic.spa?utm_source=qr';

const CATEGORIAS = ['Faciales', 'Corporales', 'Cejas y pestañas'] as const;

const IMAGEN_CATEGORIA = {
  Faciales: require('../../assets/img/faciales-aura-stetic-spa.webp'),
  Corporales: require('../../assets/img/tratamientos-corporales-aura-stetic-spa.webp'),
  'Cejas y pestañas': require('../../assets/img/cejas-y-pestanas-aura-stetic-spa.webp'),
};

const formatoPrecio = new Intl.NumberFormat('es-EC', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export function CatalogoScreen({
  onReservarPestana,
  onReservarServicio,
  onAbrirEnlace,
}: Props) {
  return (
    <>
      {/* HERO */}
      <ImageBackground
        source={require('../../assets/img/tratamiento-facial-en-aura-stetic-spa.webp')}
        style={e.hero}
        imageStyle={e.heroImagen}
      >
        <View style={e.heroOverlay}>
          <Text style={e.marca}>AURA STETIC SPA</Text>
          <Text style={e.script}>Un espacio para ti</Text>
          <Text style={e.titulo}>Redefine tu ritual de belleza</Text>
          <Text style={e.subtitulo}>
            Tratamientos faciales, corporales y de mirada para regalarte un momento de bienestar.
          </Text>
          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [e.boton, pressed && e.presionado]}
            onPress={onReservarPestana}
          >
            <Text style={e.botonTexto}>Reservar mi cita</Text>
          </Pressable>
          <Text style={e.ubicacion}>
            Portoviejo · Ciudadela El Maestro · Manabí
          </Text>
        </View>
      </ImageBackground>

      {/* CATEGORÍAS */}
      {CATEGORIAS.map((categoria) => (
        <View key={categoria} style={e.seccion}>
          <View style={e.seccionCabecera}>
            <Text style={e.seccionTitulo}>{categoria}</Text>
            <View style={e.seccionLinea} />
          </View>

          <Image
            source={IMAGEN_CATEGORIA[categoria]}
            style={e.categoriaImagen}
            resizeMode="cover"
          />

          {SERVICIOS.filter((s) => s.categoria === categoria).map((servicio) => (
            <View key={servicio.nombre} style={e.servicioCard}>
              <Image
                source={servicio.imagen}
                style={e.servicioImagen}
                resizeMode="cover"
              />
              <View style={e.servicioContenido}>
                <View style={e.servicioCabecera}>
                  <Text style={e.servicioNombre}>{servicio.nombre}</Text>
                  <View style={e.precioPildora}>
                    <Text style={e.servicioPrecio}>
                      {formatoPrecio.format(servicio.precio)}
                    </Text>
                  </View>
                </View>
                <Text style={e.servicioDescripcion}>{servicio.descripcion}</Text>
                <Pressable
                  accessibilityRole="button"
                  style={({ pressed }) => [e.botonReservar, pressed && e.presionado]}
                  onPress={() => onReservarServicio(servicio.nombre)}
                >
                  <Text style={e.botonReservarTexto}>Reservar este tratamiento</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      ))}

      {/* CONTACTO */}
      <View style={e.ubicacionCard}>
        <Text style={e.seccionTitulo}>Contacto y ubicación</Text>

        <Text style={e.etiqueta}>DIRECCIÓN</Text>
        <Text style={e.dato}>
          Portoviejo, Ciudadela El Maestro — Manabí, Ecuador
        </Text>

        <Text style={e.etiqueta}>HORARIO DE ATENCIÓN</Text>
        <Text style={e.dato}>Escríbenos por WhatsApp para agendar tu cita.</Text>

        <Pressable
          accessibilityRole="link"
          style={({ pressed }) => [e.boton, e.botonAncho, pressed && e.presionado]}
          onPress={() => onAbrirEnlace(URL_UBICACION)}
        >
          <Text style={e.botonTexto}>Ver ubicación en Google Maps</Text>
        </Pressable>
        <Pressable
          accessibilityRole="link"
          style={({ pressed }) => [e.botonInstagram, pressed && e.presionado]}
          onPress={() => onAbrirEnlace(URL_INSTAGRAM)}
        >
          <Text style={e.botonInstagramTexto}>@aura_stetic.spa</Text>
        </Pressable>
      </View>
    </>
  );
}

const COLOR = {
  fondo: '#FBF6F2',
  tarjeta: '#FFFFFF',
  principal: '#B76E79',
  principalSuave: '#F6E7E9',
  texto: '#3B2A2E',
  textoSuave: '#7A6A6E',
  borde: '#EBDDD9',
};

const sombra = {
  shadowColor: '#3B2A2E',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.08,
  shadowRadius: 12,
  elevation: 3,
};

const e = StyleSheet.create({
  presionado: { opacity: 0.85, transform: [{ scale: 0.98 }] },

  // Hero
  hero: {
    height: 440,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 28,
    ...sombra,
  },
  heroImagen: { borderRadius: 24 },
  heroOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 22,
    backgroundColor: 'rgba(40, 20, 25, 0.48)',
  },
  marca: {
    color: '#F3D9DC',
    fontSize: 12,
    letterSpacing: 3,
    fontWeight: '700',
    marginBottom: 4,
  },
  script: {
    color: '#FFFFFF',
    fontSize: 20,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  titulo: {
    color: '#FFFFFF',
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    marginBottom: 10,
  },
  subtitulo: {
    color: '#F1E6E6',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 18,
  },
  ubicacion: {
    color: '#F3D9DC',
    fontSize: 12,
    marginTop: 14,
    textAlign: 'center',
  },

  // Botones
  boton: {
    backgroundColor: COLOR.principal,
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 999,
    alignItems: 'center',
  },
  botonAncho: { alignSelf: 'stretch', marginTop: 16 },
  botonTexto: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  botonReservar: {
    backgroundColor: COLOR.principal,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: 'center',
    marginTop: 14,
  },
  botonReservarTexto: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  botonInstagram: {
    marginTop: 10,
    paddingVertical: 13,
    borderRadius: 999,
    alignItems: 'center',
    backgroundColor: COLOR.principalSuave,
  },
  botonInstagramTexto: { color: COLOR.principal, fontWeight: '700', fontSize: 15 },

  // Secciones
  seccion: { marginBottom: 28 },
  seccionCabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  seccionTitulo: {
    color: COLOR.texto,
    fontSize: 22,
    fontWeight: '800',
  },
  seccionLinea: { flex: 1, height: 1, backgroundColor: COLOR.borde },
  categoriaImagen: {
    width: '100%',
    height: 150,
    borderRadius: 18,
    marginBottom: 14,
  },

  // Tarjeta de servicio (vertical)
  servicioCard: {
    backgroundColor: COLOR.tarjeta,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: COLOR.borde,
    ...sombra,
  },
  servicioImagen: {
    width: '100%',
    height: 190,
  },
  servicioContenido: {
    padding: 16,
  },
  servicioCabecera: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  servicioNombre: {
    flex: 1,
    color: COLOR.texto,
    fontSize: 16,
    fontWeight: '700',
  },
  precioPildora: {
    backgroundColor: COLOR.principalSuave,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  servicioPrecio: { color: COLOR.principal, fontWeight: '800', fontSize: 14 },
  servicioDescripcion: {
    color: COLOR.textoSuave,
    fontSize: 13,
    lineHeight: 19,
  },

  // Contacto
  ubicacionCard: {
    backgroundColor: COLOR.tarjeta,
    borderRadius: 22,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLOR.borde,
    ...sombra,
  },
  etiqueta: {
    color: COLOR.principal,
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 2,
  },
  dato: { color: COLOR.texto, fontSize: 15, lineHeight: 22 },
});