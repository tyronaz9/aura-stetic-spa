import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { fechaBonita, fechaDesdeTexto, fechaHoy, horaBonita } from './src/fechas';
import { CatalogoScreen } from './src/screens/CatalogoScreen';
import { CitasScreen } from './src/screens/CitasScreen';
import { ReservarScreen } from './src/screens/ReservarScreen';
import {
  crearErrorRespuesta,
  ErrorApi,
  mensajeErrorConexion,
} from './src/api-errores';
import type {
  EstadoReserva,
  Formulario,
  Pestana,
  Reserva,
} from './src/types';

const URL_CONFIGURADA = process.env.EXPO_PUBLIC_API_URL?.trim();
const HOST_EXPO = Constants.expoConfig?.hostUri;
const HOST_API = HOST_EXPO
  ? new URL(`http://${HOST_EXPO}`).hostname
  : 'localhost';
const API_URL = URL_CONFIGURADA
  ? URL_CONFIGURADA.replace(/\/clientes\/?$/, '/reservas')
  : `http://${Platform.OS === 'web' ? 'localhost' : HOST_API}:3000/api/reservas`;

export default function App() {
  const [pestana, setPestana] = useState<Pestana>('catalogo');
  const [formulario, setFormulario] = useState<Formulario>({
    nombre: '',
    telefono: '',
    servicio: '',
    fecha: '',
    hora: '',
    notas: '',
  });
  const [mostrarServicios, setMostrarServicios] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mostrarFecha, setMostrarFecha] = useState(false);
  const [mostrarHora, setMostrarHora] = useState(false);
  const [citas, setCitas] = useState<Reserva[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<EstadoReserva | 'todas'>('todas');
  const [cargandoCitas, setCargandoCitas] = useState(false);
  const [errorCitas, setErrorCitas] = useState('');

  const minimo = fechaHoy();

  const resumen = useMemo(() => {
    const lineas = ['Hola Aura Stetic Spa, quisiera reservar una cita.', ''];
    if (formulario.nombre.trim()) lineas.push(`Nombre: ${formulario.nombre.trim()}`);
    if (formulario.servicio) lineas.push(`Tratamiento: ${formulario.servicio}`);
    const cuando: string[] = [];
    if (formulario.fecha) cuando.push(fechaBonita(formulario.fecha));
    if (formulario.hora) cuando.push(`a las ${horaBonita(formulario.hora)}`);
    if (cuando.length) lineas.push(`Preferiría: ${cuando.join(' ')}`);
    if (formulario.telefono.trim()) lineas.push(`Teléfono: ${formulario.telefono.trim()}`);
    if (formulario.notas.trim()) lineas.push(`Nota: ${formulario.notas.trim()}`);
    return lineas.join('\n');
  }, [formulario]);

  const cambiar = (campo: keyof Formulario, valor: string) => {
    setFormulario((actual) => ({ ...actual, [campo]: valor }));
  };

  const cargarCitas = async () => {
    setCargandoCitas(true);
    setErrorCitas('');
    try {
      const respuesta = await fetch(API_URL);
      const contenido = await respuesta.json().catch(() => null);
      if (!respuesta.ok) {
        throw crearErrorRespuesta(
          respuesta.status,
          contenido,
          'No se pudieron cargar las citas.',
        );
      }
      if (!Array.isArray(contenido)) {
        throw new Error('La API devolvió una respuesta de citas inválida.');
      }
      setCitas(contenido);
    } catch (e) {
      setErrorCitas(
        e instanceof ErrorApi
          ? (e.status === 400 || e.status === 409
              ? `Error ${e.status}: ${e.message}`
              : e.message)
          : mensajeErrorConexion(e),
      );
    } finally {
      setCargandoCitas(false);
    }
  };

  const abrirPestana = (siguiente: Pestana) => {
    setPestana(siguiente);
    if (siguiente === 'citas') void cargarCitas();
  };

  const reservarServicio = (servicio: string) => {
    cambiar('servicio', servicio);
    abrirPestana('reservar');
  };

  const abrirEnlace = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (e) {
      Alert.alert(
        'No se pudo abrir el enlace',
        e instanceof Error ? e.message : 'Intenta nuevamente.',
      );
    }
  };

  const cambiarEstadoCita = async (cita: Reserva, estado: EstadoReserva) => {
    try {
      const respuesta = await fetch(`${API_URL}/${cita.id}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado }),
      });
      const contenido = await respuesta.json().catch(() => null);
      if (!respuesta.ok) {
        throw crearErrorRespuesta(
          respuesta.status,
          contenido,
          'No se pudo actualizar el estado de la cita.',
        );
      }
      setCitas((actuales) =>
        actuales.map((item) => item.id === cita.id ? { ...item, estado } : item),
      );
    } catch (e) {
      const detalle = mensajeErrorConexion(e);
      const estado = e instanceof ErrorApi ? e.status : 0;
      Alert.alert(
        'No se pudo actualizar',
        estado === 400 || estado === 409
          ? `Error ${estado}: ${detalle}`
          : detalle,
      );
    }
  };

  const eliminarCita = async (cita: Reserva) => {
    const eliminar = async () => {
      try {
        const respuesta = await fetch(`${API_URL}/${cita.id}`, { method: 'DELETE' });
        if (!respuesta.ok) {
          const contenido = await respuesta.json().catch(() => null);
          throw crearErrorRespuesta(
            respuesta.status,
            contenido,
            'No se pudo eliminar la cita.',
          );
        }
        setCitas((actuales) => actuales.filter((item) => item.id !== cita.id));
      } catch (e) {
        const detalle = mensajeErrorConexion(e);
        const estado = e instanceof ErrorApi ? e.status : 0;
        Alert.alert(
          'No se pudo eliminar',
          estado === 400 || estado === 409
            ? `Error ${estado}: ${detalle}`
            : detalle,
        );
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm(`¿Eliminar la cita de ${cita.nombre}?`)) await eliminar();
      return;
    }
    Alert.alert('Eliminar cita', `¿Eliminar la cita de ${cita.nombre}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => void eliminar() },
    ]);
  };

  const validar = (): string | null => {
    if (formulario.nombre.trim().length < 3) return 'Escribe al menos 3 caracteres para tu nombre.';
    if (!/^0\d{9}$/.test(formulario.telefono)) return 'El teléfono debe tener 10 dígitos y empezar con 0.';
    if (!formulario.servicio) return 'Por favor elige un tratamiento.';
    if (!fechaDesdeTexto(formulario.fecha)) return 'Elige una fecha válida.';
    if (formulario.fecha < minimo) return 'La fecha no puede estar en el pasado.';
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(formulario.hora)) return 'Elige una hora válida.';
    if (formulario.notas.length > 200) return 'Las notas no pueden superar los 200 caracteres.';
    return null;
  };

  const enviar = async () => {
    const error = validar();
    if (error) {
      Alert.alert('Revisa tu reserva', error);
      return;
    }

    setGuardando(true);
    try {
      const respuesta = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formulario.nombre.trim(),
          telefono: formulario.telefono.trim(),
          servicio: formulario.servicio,
          fecha: formulario.fecha,
          hora: formulario.hora,
          notas: formulario.notas.trim(),
        }),
      });
      const contenido = await respuesta.json().catch(() => null);
      if (!respuesta.ok) {
        throw crearErrorRespuesta(
          respuesta.status,
          contenido,
          'No se pudo guardar la reserva.',
        );
      }

      Alert.alert(
        'Reserva guardada',
        'Tu solicitud quedó registrada. ¿Deseas confirmar por WhatsApp?',
        [
          { text: 'Después', style: 'cancel' },
          {
            text: 'Abrir WhatsApp',
            onPress: () =>
              Linking.openURL(
                `https://wa.me/593999406511?text=${encodeURIComponent(resumen)}`,
              ),
          },
        ],
      );
      setFormulario({ nombre: '', telefono: '', servicio: '', fecha: '', hora: '', notas: '' });
    } catch (e) {
      const detalle = mensajeErrorConexion(e);
      const estado = e instanceof ErrorApi ? e.status : 0;
      const titulo =
        estado === 400
          ? 'Datos de reserva inválidos'
          : estado === 409
            ? 'La reserva no pudo completarse'
            : 'No se pudo guardar';
      Alert.alert(
        titulo,
        estado === 400 || estado === 409
          ? `Error ${estado}: ${detalle}`
          : detalle,
      );
    } finally {
      setGuardando(false);
    }
  };

  const citasVisibles = filtroEstado === 'todas'
    ? citas
    : citas.filter((cita) => (cita.estado || 'pendiente') === filtroEstado);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe}>
        <StatusBar style="dark" />
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.contenido}
            keyboardShouldPersistTaps="handled"
          >
            {pestana === 'catalogo' ? (
              <CatalogoScreen
                styles={styles}
                onReservarPestana={() => abrirPestana('reservar')}
                onReservarServicio={reservarServicio}
                onAbrirEnlace={abrirEnlace}
              />
            ) : pestana === 'citas' ? (
              <CitasScreen
                styles={styles}
                citas={citas}
                citasVisibles={citasVisibles}
                filtroEstado={filtroEstado}
                cargandoCitas={cargandoCitas}
                errorCitas={errorCitas}
                onFiltro={setFiltroEstado}
                onCargar={() => void cargarCitas()}
                onCambiarEstado={(cita, estado) => void cambiarEstadoCita(cita, estado)}
                onEliminar={(cita) => void eliminarCita(cita)}
              />
            ) : (
              <ReservarScreen
                styles={styles}
                formulario={formulario}
                minimo={minimo}
                guardando={guardando}
                resumen={resumen}
                mostrarServicios={mostrarServicios}
                mostrarFecha={mostrarFecha}
                mostrarHora={mostrarHora}
                onCambiar={cambiar}
                onMostrarServicios={setMostrarServicios}
                onMostrarFecha={setMostrarFecha}
                onMostrarHora={setMostrarHora}
                onEnviar={() => void enviar()}
              />
            )}
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={styles.navInferior}>
          {([
            ['catalogo', 'Inicio'],
            ['reservar', 'Reservar'],
            ['citas', 'Citas'],
          ] as const).map(([destino, etiqueta]) => (
            <Pressable
              key={destino}
              style={styles.navPestana}
              onPress={() => abrirPestana(destino)}
            >
              <Text
                style={[styles.navTexto, pestana === destino && styles.navTextoActivo]}
              >
                {etiqueta}
              </Text>
            </Pressable>
          ))}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f7f1eb' },
  flex: { flex: 1 },
  contenido: { padding: 20, paddingBottom: 36 },
  catalogoHero: { alignItems: 'center', backgroundColor: '#f0e2d7', borderRadius: 20, marginBottom: 22, overflow: 'hidden', padding: 22 },
  heroImagen: { borderRadius: 14, height: 190, marginBottom: 4, width: '100%' },
  encabezado: { alignItems: 'center', marginBottom: 20 },
  marca: { color: '#774c43', fontFamily: Platform.select({ ios: 'Georgia', default: 'serif' }), fontSize: 18, fontWeight: '700' },
  script: { color: '#b48a78', fontFamily: Platform.select({ ios: 'Georgia', default: 'serif' }), fontSize: 18, fontStyle: 'italic', marginTop: 18 },
  titulo: { color: '#5e4038', fontFamily: Platform.select({ ios: 'Georgia', default: 'serif' }), fontSize: 34, fontWeight: '700' },
  subtitulo: { color: '#75665f', fontSize: 14, lineHeight: 21, marginTop: 8, textAlign: 'center' },
  heroBoton: { alignSelf: 'stretch' },
  seccionTitulo: { color: '#5e4038', fontFamily: Platform.select({ ios: 'Georgia', default: 'serif' }), fontSize: 26, fontWeight: '700', marginBottom: 12, marginTop: 10 },
  categoriaImagen: { borderRadius: 14, height: 140, marginBottom: 12, width: '100%' },
  servicioCard: { backgroundColor: '#fff', borderRadius: 14, marginBottom: 12, overflow: 'hidden', paddingBottom: 15, shadowColor: '#5c4037', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 2 },
  servicioImagen: { height: 180, marginBottom: 14, width: '100%' },
  servicioContenido: { paddingHorizontal: 15 },
  servicioCardCabecera: { alignItems: 'flex-start', flexDirection: 'row', gap: 8, justifyContent: 'space-between' },
  servicioNombre: { color: '#5e4038', flex: 1, fontSize: 16, fontWeight: '700' },
  servicioPrecio: { color: '#8a5d50', fontSize: 15, fontWeight: '700' },
  servicioDescripcion: { color: '#75665f', fontSize: 13, lineHeight: 19, marginTop: 8 },
  ubicacionCard: { backgroundColor: '#fff', borderRadius: 16, marginTop: 12, padding: 17 },
  ubicacionEtiqueta: { color: '#5e4038', fontSize: 14, fontWeight: '700', marginTop: 10 },
  ubicacionDireccion: { color: '#75665f', fontSize: 14, lineHeight: 21, marginTop: 4 },
  botonInstagram: { alignItems: 'center', marginTop: 13, padding: 8 },
  botonInstagramTexto: { color: '#8a5d50', fontSize: 14, fontWeight: '700' },
  botonSecundario: { alignItems: 'center', borderColor: '#8a5d50', borderRadius: 9, borderWidth: 1, marginTop: 12, minHeight: 40, justifyContent: 'center', paddingHorizontal: 10 },
  botonSecundarioTexto: { color: '#8a5d50', fontSize: 14, fontWeight: '700' },
  citasCabecera: { alignItems: 'center', flexDirection: 'row', gap: 12, marginBottom: 16 },
  tituloSeccion: { color: '#5e4038', fontFamily: Platform.select({ ios: 'Georgia', default: 'serif' }), fontSize: 27, fontWeight: '700', marginTop: 8 },
  recargar: { borderColor: '#8a5d50', borderRadius: 9, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 9 },
  recargarTexto: { color: '#8a5d50', fontSize: 13, fontWeight: '700' },
  filtros: { gap: 8, paddingBottom: 14 },
  filtro: { borderColor: '#dccfc5', borderRadius: 20, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 9 },
  filtroActivo: { backgroundColor: '#8a5d50', borderColor: '#8a5d50' },
  filtroTexto: { color: '#75665f', fontSize: 13 },
  filtroTextoActivo: { color: '#fff', fontWeight: '700' },
  estadoLista: { color: '#75665f', backgroundColor: '#fff', borderRadius: 12, fontSize: 15, marginTop: 6, padding: 20, textAlign: 'center' },
  errorLista: { backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  errorTexto: { color: '#a43e3e', fontSize: 14, lineHeight: 20 },
  citaCard: { backgroundColor: '#fff', borderRadius: 14, marginBottom: 12, padding: 15 },
  citaId: { color: '#9a8d82', fontSize: 13, fontWeight: '700' },
  citaServicio: { color: '#8a5d50', fontSize: 14, fontWeight: '700', marginTop: 8 },
  citaDetalle: { color: '#75665f', fontSize: 13, marginTop: 5 },
  citaNota: { backgroundColor: '#f7f1eb', borderRadius: 8, color: '#68574f', fontSize: 13, lineHeight: 19, marginTop: 9, padding: 10 },
  etiquetaEstado: { color: '#5e4038', fontSize: 13, fontWeight: '700', marginTop: 14 },
  estadosFila: { flexDirection: 'row', gap: 7, paddingTop: 8 },
  estadoBoton: { borderColor: '#dccfc5', borderRadius: 18, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 7 },
  estadoBotonActivo: { backgroundColor: '#8a5d50', borderColor: '#8a5d50' },
  estadoBotonTexto: { color: '#75665f', fontSize: 12 },
  estadoBotonTextoActivo: { color: '#fff', fontWeight: '700' },
  eliminarBoton: { alignSelf: 'flex-end', marginTop: 14, paddingVertical: 6 },
  eliminarTexto: { color: '#a43e3e', fontSize: 13, fontWeight: '700' },
  navInferior: { backgroundColor: '#fff', borderTopColor: '#e8ddd5', borderTopWidth: StyleSheet.hairlineWidth, flexDirection: 'row', paddingHorizontal: 10, paddingTop: 8 },
  navPestana: { alignItems: 'center', flex: 1, justifyContent: 'center', minHeight: 48 },
  navTexto: { color: '#91847c', fontSize: 14, fontWeight: '600' },
  navTextoActivo: { color: '#8a5d50', fontWeight: '800' },
  tarjeta: { backgroundColor: '#fff', borderRadius: 18, padding: 16, shadowColor: '#5c4037', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 18, elevation: 3 },
  etiqueta: { color: '#5e4038', fontSize: 14, fontWeight: '700', marginBottom: 7, marginTop: 10 },
  input: { borderColor: '#dccfc5', borderRadius: 10, borderWidth: 1, color: '#46372f', fontSize: 15, minHeight: 48, paddingHorizontal: 13 },
  selector: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  selectorTexto: { color: '#46372f', flex: 1 },
  placeholder: { color: '#9a8d82', flex: 1 },
  chevron: { color: '#b48a78', fontSize: 22 },
  fila: { flexDirection: 'row', gap: 10 },
  campoMitad: { flex: 1 },
  ayuda: { color: '#94877f', fontSize: 12, marginTop: 6 },
  opcional: { color: '#9a8d82', fontWeight: '400' },
  textarea: { height: 92, paddingTop: 12 },
  resumenTitulo: { color: '#5e4038', fontSize: 14, fontWeight: '700', marginBottom: 7, marginTop: 16 },
  resumen: { backgroundColor: '#f4e9df', borderRadius: 10, minHeight: 72, padding: 12 },
  resumenTexto: { color: '#68574f', fontSize: 13, lineHeight: 20 },
  boton: { alignItems: 'center', backgroundColor: '#8a5d50', borderRadius: 12, marginTop: 16, minHeight: 52, justifyContent: 'center' },
  botonPresionado: { opacity: 0.82 },
  botonDeshabilitado: { opacity: 0.55 },
  botonTexto: { color: '#fff', fontSize: 16, fontWeight: '700' },
  ubicacion: { color: '#9a8d82', fontSize: 12, marginTop: 14, textAlign: 'center' },
  modalCapa: { backgroundColor: 'rgba(45, 35, 31, 0.42)', flex: 1, justifyContent: 'flex-end' },
  modalLista: { backgroundColor: '#fff', borderTopLeftRadius: 22, borderTopRightRadius: 22, maxHeight: '78%', paddingBottom: 24 },
  modalCabecera: { alignItems: 'center', borderBottomColor: '#eee5de', borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 16 },
  modalTitulo: { color: '#5e4038', fontSize: 17, fontWeight: '700' },
  modalCerrar: { color: '#8a5d50', fontWeight: '700' },
  opcion: { borderBottomColor: '#f1ebe6', borderBottomWidth: 1, paddingHorizontal: 18, paddingVertical: 15 },
  opcionActiva: { backgroundColor: '#f7eee7' },
  opcionTexto: { color: '#554740', fontSize: 15 },
  opcionTextoActiva: { color: '#8a5d50', fontWeight: '700' },
});
