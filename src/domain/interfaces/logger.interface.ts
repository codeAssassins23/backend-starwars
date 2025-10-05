export interface ILogger {
  /**
   * Log general de información.
   * @param message Mensaje principal del log.
   * @param context Contexto opcional del log (ej. nombre del módulo o clase).
   */
  log(message: string, context?: string): void;

  /**
   * Log de advertencia (warning).
   * @param message Mensaje principal del log.
   * @param context Contexto opcional del log.
   */
  warn(message: string, context?: string): void;

  /**
   * Log de error.
   * @param message Mensaje principal del log.
   * @param trace Traza opcional del error (stack trace).
   * @param context Contexto opcional del log.
   */
  error(message: string, trace?: string, context?: string): void;

  /**
   * Log de depuración (debug).
   * @param message Mensaje principal del log.
   * @param context Contexto opcional del log.
   */
  debug(message: string, context?: string): void;
}
