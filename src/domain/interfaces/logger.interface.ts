export interface ILogger {
  /**
   * Logs generales (uso global en app, cron, guards, etc.)
   */
  log(message: string, context?: string): void;
  error(message: string, trace?: string, context?: string): void;
  warn(message: string, context?: string): void;
  debug(message: string, context?: string): void;

  /**
   * Logs específicos de flujo HTTP
   */
  logRequest(req: any, additionalFields?: Partial<Record<string, any>>): void;

  Response(
    req: any,
    res: any,
    body: any,
    additionalFields?: Partial<Record<string, any>>,
  ): void;

  Error(
    req: any,
    res: any,
    error: any,
    additionalFields?: Partial<Record<string, any>>,
  ): void;
}
