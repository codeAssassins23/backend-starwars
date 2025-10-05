import { Injectable, Logger } from '@nestjs/common';
import { ILogger } from 'src/domain/interfaces/logger.interface';

@Injectable()
export class LoggerService extends Logger implements ILogger {
  private readonly defaultContext = 'App';

  constructor() {
    super();
  }

  log(message: string, context?: string) {
    const ctx = context || this.defaultContext;
    super.log(` [${ctx}] ${message} (${this.timestamp()})`);
  }

  warn(message: string, context?: string) {
    const ctx = context || this.defaultContext;
    super.warn(` [${ctx}] ${message} (${this.timestamp()})`);
  }

  error(message: string, trace?: string, context?: string) {
    const ctx = context || this.defaultContext;
    super.error(` [${ctx}] ${message} (${this.timestamp()})`, trace);
  }

  debug(message: string, context?: string) {
    const ctx = context || this.defaultContext;
    super.debug(` [${ctx}] ${message} (${this.timestamp()})`);
  }

  private timestamp(): string {
    return new Date().toISOString().replace('T', ' ').split('.')[0];
  }
}
