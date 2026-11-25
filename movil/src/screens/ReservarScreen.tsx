import DateTimePicker, {
  DateTimePickerAndroid,
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SERVICIOS } from '../datos';
import {
  fechaBonita,
  fechaDesdeTexto,
  horaBonita,
  textoFecha,
  textoHora,
} from '../fechas';
import type { Formulario } from '../types';

type Props = {
  styles: Record<string, any>;
  formulario: Formulario;
  minimo: string;
  guardando: boolean;
  resumen: string;
  mostrarServicios: boolean;
  mostrarFecha: boolean;
  mostrarHora: boolean;
  onCambiar: (campo: keyof Formulario, valor: string) => void;
  onMostrarServicios: (visible: boolean) => void;
  onMostrarFecha: (visible: boolean) => void;
  onMostrarHora: (visible: boolean) => void;
  onEnviar: () => void;
};

export function ReservarScreen({
  styles,
  formulario,
  minimo,
  guardando,
  resumen,
  mostrarServicios,
  mostrarFecha,
  mostrarHora,
  onCambiar,
  onMostrarServicios,
  onMostrarFecha,
  onMostrarHora,
  onEnviar,
}: Props) {
  const abrirFecha = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: fechaDesdeTexto(formulario.fecha) ?? new Date(),
        mode: 'date',
        minimumDate: fechaDesdeTexto(minimo) ?? new Date(),
        onChange: (_evento: DateTimePickerEvent, seleccionada?: Date) => {
          if (seleccionada) onCambiar('fecha', textoFecha(seleccionada));
        },
      });
      return;
    }
    onMostrarFecha(true);
  };

  const abrirHora = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: new Date(2000, 0, 1, 12, 0),
        mode: 'time',
        is24Hour: true,
        onChange: (_evento: DateTimePickerEvent, seleccionada?: Date) => {
          if (seleccionada) onCambiar('hora', textoHora(seleccionada));
        },
      });
      return;
    }
    onMostrarHora(true);
  };

  return (
    <>
      <View style={styles.encabezado}>
        <Text style={styles.marca}>Aura Stetic Spa</Text>
        <Text style={styles.script}>Reserva tu momento</Text>
        <Text style={styles.titulo}>Agenda tu cita</Text>
        <Text style={styles.subtitulo}>
          Elige el tratamiento, el día y la hora que mejor te queden.
        </Text>
      </View>

      <View style={styles.tarjeta}>
        <Text style={styles.etiqueta}>Tu nombre</Text>
        <TextInput
          value={formulario.nombre}
          onChangeText={(valor) => onCambiar('nombre', valor)}
          style={styles.input}
          placeholder="Nombre y apellido"
          placeholderTextColor="#9a8d82"
          autoCapitalize="words"
        />

        <Text style={styles.etiqueta}>Tu teléfono</Text>
        <TextInput
          value={formulario.telefono}
          onChangeText={(valor) =>
            onCambiar('telefono', valor.replace(/\D/g, '').slice(0, 10))
          }
          style={styles.input}
          placeholder="0990000000"
          placeholderTextColor="#9a8d82"
          keyboardType="phone-pad"
          maxLength={10}
        />

        <Text style={styles.etiqueta}>Tratamiento que deseas</Text>
        <Pressable
          style={[styles.input, styles.selector]}
          onPress={() => onMostrarServicios(true)}
        >
          <Text style={formulario.servicio ? styles.selectorTexto : styles.placeholder}>
            {formulario.servicio || 'Elige un tratamiento…'}
          </Text>
          <Text style={styles.chevron}>⌄</Text>
        </Pressable>

        <View style={styles.fila}>
          <View style={styles.campoMitad}>
            <Text style={styles.etiqueta}>Día que prefieres</Text>
            {Platform.OS === 'web' ? (
              <TextInput
                value={formulario.fecha}
                onChangeText={(valor) => onCambiar('fecha', valor)}
                style={styles.input}
                placeholder="AAAA-MM-DD"
                placeholderTextColor="#9a8d82"
                autoCapitalize="none"
              />
            ) : (
              <Pressable style={[styles.input, styles.selector]} onPress={abrirFecha}>
                <Text style={formulario.fecha ? styles.selectorTexto : styles.placeholder}>
                  {formulario.fecha ? fechaBonita(formulario.fecha) : 'Seleccionar día'}
                </Text>
              </Pressable>
            )}
          </View>
          <View style={styles.campoMitad}>
            <Text style={styles.etiqueta}>Hora aproximada</Text>
            {Platform.OS === 'web' ? (
              <TextInput
                value={formulario.hora}
                onChangeText={(valor) => onCambiar('hora', valor)}
                style={styles.input}
                placeholder="HH:MM"
                placeholderTextColor="#9a8d82"
                autoCapitalize="none"
              />
            ) : (
              <Pressable style={[styles.input, styles.selector]} onPress={abrirHora}>
                <Text style={formulario.hora ? styles.selectorTexto : styles.placeholder}>
                  {formulario.hora ? horaBonita(formulario.hora) : 'Seleccionar hora'}
                </Text>
              </Pressable>
            )}
          </View>
        </View>

        {Platform.OS === 'web' && (
          <Text style={styles.ayuda}>
            Usa formatos AAAA-MM-DD y 24 horas (por ejemplo 14:30).
          </Text>
        )}
        {mostrarFecha && Platform.OS === 'ios' && (
          <DateTimePicker
            value={fechaDesdeTexto(formulario.fecha) ?? fechaDesdeTexto(minimo) ?? new Date()}
            mode="date"
            minimumDate={fechaDesdeTexto(minimo) ?? new Date()}
            display="spinner"
            onChange={(_evento, seleccionada) => {
              if (seleccionada) onCambiar('fecha', textoFecha(seleccionada));
              onMostrarFecha(false);
            }}
          />
        )}
        {mostrarHora && Platform.OS === 'ios' && (
          <DateTimePicker
            value={new Date(2000, 0, 1, 12, 0)}
            mode="time"
            is24Hour
            display="spinner"
            onChange={(_evento, seleccionada) => {
              if (seleccionada) onCambiar('hora', textoHora(seleccionada));
              onMostrarHora(false);
            }}
          />
        )}

        <Text style={styles.etiqueta}>
          Algo que debamos saber <Text style={styles.opcional}>opcional</Text>
        </Text>
        <TextInput
          value={formulario.notas}
          onChangeText={(valor) => onCambiar('notas', valor.slice(0, 200))}
          style={[styles.input, styles.textarea]}
          placeholder="Alergias, primera vez, dudas sobre el tratamiento…"
          placeholderTextColor="#9a8d82"
          multiline
          maxLength={200}
          textAlignVertical="top"
        />

        <Text style={styles.resumenTitulo}>Mensaje de la reserva</Text>
        <View style={styles.resumen}>
          <Text style={styles.resumenTexto}>
            {formulario.nombre || formulario.servicio
              ? resumen
              : 'Completa el formulario y aquí verás el mensaje.'}
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.boton,
            guardando && styles.botonDeshabilitado,
            pressed && styles.botonPresionado,
          ]}
          onPress={onEnviar}
          disabled={guardando}
        >
          <Text style={styles.botonTexto}>
            {guardando ? 'Guardando…' : 'Enviar reserva'}
          </Text>
        </Pressable>

        <Text style={styles.ubicacion}>Portoviejo · Ciudadela El Maestro · Manabí</Text>
      </View>

      <Modal
        visible={mostrarServicios}
        transparent
        animationType="slide"
        onRequestClose={() => onMostrarServicios(false)}
      >
        <Pressable
          style={styles.modalCapa}
          onPress={() => onMostrarServicios(false)}
        >
          <View style={styles.modalLista}>
            <View style={styles.modalCabecera}>
              <Text style={styles.modalTitulo}>Elige un tratamiento</Text>
              <Pressable onPress={() => onMostrarServicios(false)}>
                <Text style={styles.modalCerrar}>Cerrar</Text>
              </Pressable>
            </View>
            <ScrollView>
              {SERVICIOS.map(({ nombre }) => (
                <Pressable
                  key={nombre}
                  style={[
                    styles.opcion,
                    formulario.servicio === nombre && styles.opcionActiva,
                  ]}
                  onPress={() => {
                    onCambiar('servicio', nombre);
                    onMostrarServicios(false);
                  }}
                >
                  <Text
                    style={[
                      styles.opcionTexto,
                      formulario.servicio === nombre && styles.opcionTextoActiva,
                    ]}
                  >
                    {nombre}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
