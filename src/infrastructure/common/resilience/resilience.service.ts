import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../config/logger/logger.service';

@Injectable()
export class ResilienceService {
  private failureCount = 0;
  private circuitOpen = false;
  private lastFailureTime: number | null = null;

  private readonly CIRCUIT_BREAKER_THRESHOLD = 3;
  private readonly CIRCUIT_BREAKER_TIMEOUT = 60 * 1000;

  constructor(private readonly logger: LoggerService) {}

  /**
   * Ejecuta una función con retry, backoff y circuito de protección.
   */
  async executeWithResilience<T>(
    fn: () => Promise<T>,
    retries = 3,
    delay = 1000,
  ): Promise<T> {
    // Si el circuito está abierto, verificamos si puede volver a probar
    if (this.circuitOpen && this.lastFailureTime) {
      const elapsed = Date.now() - this.lastFailureTime;
      if (elapsed < this.CIRCUIT_BREAKER_TIMEOUT) {
        this.logger.warn(
          `[RESILIENCE] Circuit breaker abierto. Esperando ${(this.CIRCUIT_BREAKER_TIMEOUT - elapsed) / 1000}s...`,
          'ResilienceService',
        );
        throw new Error('Circuit breaker activo. Reintentará luego.');
      }

      this.logger.log(
        `[RESILIENCE] Reintentando ejecución después del timeout.`,
        'ResilienceService',
      );
      this.circuitOpen = false;
      this.failureCount = 0;
    }

    let lastError: any;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        this.logger.log(
          `[RESILIENCE] Intento ${attempt}/${retries}`,
          'ResilienceService',
        );
        const result = await fn();
        this.failureCount = 0;
        return result;
      } catch (error) {
        lastError = error;
        this.failureCount++;
        const backoff = delay * Math.pow(2, attempt - 1);

        this.logger.warn(
          `[RESILIENCE] Intento ${attempt} fallido. Reintentando en ${backoff / 1000}s...`,
          'ResilienceService',
        );
        await new Promise((r) => setTimeout(r, backoff));

        // Si superamos el umbral, abrimos el circuito
        if (this.failureCount >= this.CIRCUIT_BREAKER_THRESHOLD) {
          this.circuitOpen = true;
          this.lastFailureTime = Date.now();
          this.logger.error(
            `[RESILIENCE] Circuit breaker activado por ${this.failureCount} fallos consecutivos.`,
            '',
            'ResilienceService',
          );
          throw lastError;
        }
      }
    }

    throw lastError;
  }
}
