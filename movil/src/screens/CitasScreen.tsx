import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ESTADOS, NOMBRES_ESTADO } from '../datos';
import { horaBonita } from '../fechas';
import type { EstadoReserva, Reserva } from '../types';

type Props = {
  styles: Record<string, any>;
  citas: Reserva[];
  citasVisibles: Reserva[];
  filtroEstado: EstadoReserva | 'todas';
  cargandoCitas: boolean;
  errorCitas: string;
  onFiltro: (estado: EstadoReserva | 'todas') => void;
  onCargar: () => void;
  onCambiarEstado: (cita: Reserva, estado: EstadoReserva) => void;
  onEliminar: (cita: Reserva) => void;
};

export function CitasScreen({
  citas,
  citasVisibles,
  filtroEstado,
  cargandoCitas,
  errorCitas,
  onFiltro,
  onCargar,
  onCambiarEstado,
  onEliminar,
}: Props) {
  return (
    <>
      {/* CABECERA */}
      <View style={e.cabecera}>
        <View style={e.cabeceraTexto}>
          <Text style={e.marca}>AURA STETIC SPA</Text>
          <Text style={e.titulo}>Citas registradas</Text>
          <Text style={e.subtitulo}>
            {citasVisibles.length} cita(s) · {citas.length} en total
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [e.recargar, pressed && e.presionado]}
          onPress={onCargar}
        >
          <Text style={e.recargarTexto}>↻ Actualizar</Text>
        </Pressable>
      </View>

      {/* FILTROS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={e.filtros}
        style={e.filtrosScroll}
      >
        {(['todas', ...ESTADOS] as const).map((estado) => {
          const activo = filtroEstado === estado;
          return (
            <Pressable
              key={estado}
              style={({ pressed }) => [
                e.filtro,
                activo && e.filtroActivo,
                pressed && e.presionado,
              ]}
              onPress={() => onFiltro(estado)}
            >
              <Text style={[e.filtroTexto, activo && e.filtroTextoActivo]}>
                {estado === 'todas' ? 'Todas' : NOMBRES_ESTADO[estado]}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* LISTA */}
      {cargandoCitas ? (
        <View style={e.estadoCaja}>
          <Text style={e.estadoLista}>Cargando citas…</Text>
        </View>
      ) : errorCitas ? (
        <View style={e.errorLista}>
          <Text style={e.errorTexto}>{errorCitas}</Text>
          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [e.botonReintentar, pressed && e.presionado]}
            onPress={onCargar}
          >
            <Text style={e.botonReintentarTexto}>Intentar de nuevo</Text>
          </Pressable>
        </View>
      ) : citasVisibles.length === 0 ? (
        <View style={e.estadoCaja}>
          <Text style={e.estadoLista}>
            {citas.length
              ? 'No hay citas con este estado.'
              : 'Todavía no hay citas registradas.'}
          </Text>
        </View>
      ) : (
        citasVisibles.map((cita) => {
          const estadoActual = (cita.estado || 'pendiente') as EstadoReserva;
          const color = COLOR_ESTADO[estadoActual] ?? COLOR_ESTADO_DEFECTO;

          return (
            <View key={cita.id} style={e.citaCard}>
              <View style={[e.citaBarra, { backgroundColor: color.texto }]} />

              <View style={e.citaContenido}>
                <View style={e.citaCabecera}>
                  <Text style={e.citaNombre} numberOfLines={2}>
                    {cita.nombre}
                  </Text>
                  <Text style={e.citaId}>#{cita.id}</Text>
                </View>

                <View style={[e.insignia, { backgroundColor: color.fondo }]}>
                  <Text style={[e.insigniaTexto, { color: color.texto }]}>
                    {NOMBRES_ESTADO[estadoActual]}
                  </Text>
                </View>

                <Text style={e.citaServicio}>{cita.servicio}</Text>

                <View style={e.citaDatos}>
                  <Text style={e.citaDetalle}>
                    📅 {cita.fecha || 'Fecha pendiente'}
                    {cita.hora ? ` · ${horaBonita(cita.hora)}` : ''}
                  </Text>
                  {cita.telefono ? (
                    <Text style={e.citaDetalle}>📞 {cita.telefono}</Text>
                  ) : null}
                </View>

                {cita.notas ? (
                  <View style={e.citaNotaCaja}>
                    <Text style={e.citaNota}>{cita.notas}</Text>
                  </View>
                ) : null}

                <Text style={e.etiquetaEstado}>CAMBIAR ESTADO</Text>
                <View style={e.estadosFila}>
                  {ESTADOS.map((estado) => {
                    const activo = estadoActual === estado;
                    return (
                      <Pressable
                        key={estado}
                        style={({ pressed }) => [
                          e.estadoBoton,
                          activo && e.estadoBotonActivo,
                          pressed && e.presionado,
                        ]}
                        onPress={() => onCambiarEstado(cita, estado)}
                      >
                        <Text
                          style={[
                            e.estadoBotonTexto,
                            activo && e.estadoBotonTextoActivo,
                          ]}
                        >
                          {NOMBRES_ESTADO[estado]}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <Pressable
                  accessibilityRole="button"
                  style={({ pressed }) => [e.eliminarBoton, pressed && e.presionado]}
                  onPress={() => onEliminar(cita)}
                >
                  <Text style={e.eliminarTexto}>Eliminar cita</Text>
                </Pressable>
              </View>
            </View>
          );
        })
      )}
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
  peligro: '#C0392B',
  peligroSuave: '#FBEAE8',
};

// Colores por estado. Si tus estados tienen otros nombres, ajusta las claves.
const COLOR_ESTADO_DEFECTO = { fondo: '#F6E7E9', texto: '#B76E79' };
const COLOR_ESTADO: Record<string, { fondo: string; texto: string }> = {
  pendiente: { fondo: '#FFF3D6', texto: '#B7791F' },
  confirmada: { fondo: '#DFF3E4', texto: '#2F855A' },
  completada: { fondo: '#E0ECF9', texto: '#2B6CB0' },
  cancelada: { fondo: '#FBEAE8', texto: '#C0392B' },
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

  // Cabecera
  cabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  cabeceraTexto: { flex: 1 },
  marca: {
    color: COLOR.principal,
    fontSize: 12,
    letterSpacing: 3,
    fontWeight: '700',
    marginBottom: 4,
  },
  titulo: {
    color: COLOR.texto,
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 2,
  },
  subtitulo: { color: COLOR.textoSuave, fontSize: 13 },
  recargar: {
    backgroundColor: COLOR.principalSuave,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  recargarTexto: { color: COLOR.principal, fontWeight: '700', fontSize: 13 },

  // Filtros
  filtrosScroll: { flexGrow: 0, marginBottom: 18 },
  filtros: { gap: 8, paddingRight: 8 },
  filtro: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: COLOR.tarjeta,
    borderWidth: 1,
    borderColor: COLOR.borde,
  },
  filtroActivo: {
    backgroundColor: COLOR.principal,
    borderColor: COLOR.principal,
  },
  filtroTexto: { color: COLOR.textoSuave, fontWeight: '600', fontSize: 13 },
  filtroTextoActivo: { color: '#FFFFFF', fontWeight: '700' },

  // Estados de la lista
  estadoCaja: {
    backgroundColor: COLOR.tarjeta,
    borderRadius: 18,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLOR.borde,
  },
  estadoLista: {
    color: COLOR.textoSuave,
    fontSize: 14,
    textAlign: 'center',
  },
  errorLista: {
    backgroundColor: COLOR.peligroSuave,
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0C8C3',
  },
  errorTexto: {
    color: COLOR.peligro,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  botonReintentar: {
    backgroundColor: COLOR.peligro,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 999,
  },
  botonReintentarTexto: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },

  // Tarjeta de cita
  citaCard: {
    flexDirection: 'row',
    backgroundColor: COLOR.tarjeta,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLOR.borde,
    ...sombra,
  },
  citaBarra: { width: 6 },
  citaContenido: { flex: 1, padding: 16 },
  citaCabecera: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  citaNombre: {
    flex: 1,
    color: COLOR.texto,
    fontSize: 18,
    fontWeight: '800',
  },
  citaId: { color: COLOR.textoSuave, fontSize: 13, fontWeight: '600' },
  insignia: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 999,
    marginBottom: 10,
  },
  insigniaTexto: { fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  citaServicio: {
    color: COLOR.principal,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  citaDatos: { gap: 3 },
  citaDetalle: { color: COLOR.texto, fontSize: 14, lineHeight: 20 },
  citaNotaCaja: {
    backgroundColor: COLOR.fondo,
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
  },
  citaNota: {
    color: COLOR.textoSuave,
    fontSize: 13,
    lineHeight: 19,
    fontStyle: 'italic',
  },

  // Cambiar estado
  etiquetaEstado: {
    color: COLOR.textoSuave,
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  estadosFila: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  estadoBoton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLOR.borde,
    backgroundColor: COLOR.tarjeta,
  },
  estadoBotonActivo: {
    backgroundColor: COLOR.principal,
    borderColor: COLOR.principal,
  },
  estadoBotonTexto: { color: COLOR.textoSuave, fontSize: 13, fontWeight: '600' },
  estadoBotonTextoActivo: { color: '#FFFFFF', fontWeight: '700' },

  // Eliminar
  eliminarBoton: {
    marginTop: 16,
    paddingVertical: 11,
    borderRadius: 999,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLOR.peligro,
    backgroundColor: COLOR.peligroSuave,
  },
  eliminarTexto: { color: COLOR.peligro, fontWeight: '700', fontSize: 14 },
});