export class ErrorApi extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ErrorApi';
  }
}

export function detalleRespuestaApi(
  contenido: unknown,
  mensajePredeterminado: string,
): string {
  if (contenido && typeof contenido === 'object') {
    const cuerpo = contenido as { errores?: unknown; message?: unknown };
    if (Array.isArray(cuerpo.errores)) {
      const errores = cuerpo.errores
        .filter((error): error is string => typeof error === 'string')
        .join(' ')
        .trim();
      if (errores) return errores;
    }
    if (typeof cuerpo.message === 'string' && cuerpo.message.trim()) {
      return cuerpo.message.trim();
    }
  }
  return mensajePredeterminado;
}

export function crearErrorRespuesta(
  status: number,
  contenido: unknown,
  mensajePredeterminado: string,
): ErrorApi {
  return new ErrorApi(
    status,
    detalleRespuestaApi(contenido, mensajePredeterminado),
  );
}

export function mensajeErrorConexion(error: unknown): string {
  return error instanceof ErrorApi
    ? error.message
    : 'No se pudo conectar con la API.';
}
