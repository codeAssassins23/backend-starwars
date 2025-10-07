import { Logger } from '@nestjs/common';
import { LoggerService } from '../logger.service';

describe('LoggerService', () => {
  let service: LoggerService;

  beforeEach(() => {
    service = new LoggerService();

    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'debug').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('debería llamar a super.log con el formato correcto', () => {
    const spy = jest.spyOn(Logger.prototype, 'log');
    service.log('Mensaje de prueba', 'TestContext');

    expect(spy).toHaveBeenCalledWith(
      expect.stringMatching(/\[TestContext\] Mensaje de prueba \(.+\)/),
    );
  });

  it('debería usar el contexto por defecto si no se pasa uno', () => {
    const spy = jest.spyOn(Logger.prototype, 'warn');
    service.warn('Mensaje sin contexto');

    expect(spy).toHaveBeenCalledWith(
      expect.stringMatching(/\[App\] Mensaje sin contexto \(.+\)/),
    );
  });

  it('debería llamar a super.error con trace y contexto', () => {
    const spy = jest.spyOn(Logger.prototype, 'error');
    service.error('Error grave', 'trace aquí', 'MovieSyncCron');

    expect(spy).toHaveBeenCalledWith(
      expect.stringMatching(/\[MovieSyncCron\] Error grave \(.+\)/),
      'trace aquí',
    );
  });

  it('debería llamar a super.debug con el formato correcto', () => {
    const spy = jest.spyOn(Logger.prototype, 'debug');
    service.debug('Depurando...', 'CronJob');

    expect(spy).toHaveBeenCalledWith(
      expect.stringMatching(/\[CronJob\] Depurando... \(.+\)/),
    );
  });

  it('debería generar un timestamp con el formato esperado', () => {
    const ts = (service as any).timestamp();
    expect(ts).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
  });
});
