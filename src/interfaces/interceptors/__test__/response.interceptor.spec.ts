import { ResponseIterceptor } from '../response.interceptor';
import { LoggerService } from '../../../infrastructure/config/logger/logger.service';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';

describe('ResponseIterceptor', () => {
  let interceptor: ResponseIterceptor<any>;
  let mockLogger: jest.Mocked<LoggerService>;
  let mockContext: jest.Mocked<ExecutionContext>;
  let mockCallHandler: jest.Mocked<CallHandler>;

  beforeEach(() => {
    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    } as any;

    mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn(() => ({ url: '/movies', method: 'GET' })),
        getResponse: jest.fn(() => ({ statusCode: 200 })),
      }),
    } as any;

    mockCallHandler = {
      handle: jest.fn(() => of({ title: 'A New Hope' })),
    } as any;

    interceptor = new ResponseIterceptor(mockLogger);
  });

  it('debería devolver el formato { data } correctamente', (done) => {
    interceptor.intercept(mockContext, mockCallHandler).subscribe((result) => {
      expect(result).toEqual({ data: { title: 'A New Hope' } });
      expect(mockLogger.log).toHaveBeenCalledWith(
        '[RESPONSE] GET /movies -> 200',
        'ResponseInterceptor',
      );
      done();
    });
  });

  it('debería registrar el log correctamente con LoggerService', (done) => {
    interceptor.intercept(mockContext, mockCallHandler).subscribe(() => {
      expect(mockLogger.log).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it('debería manejar correctamente si no hay request/response (entorno de test)', (done) => {
    const mockContextWithoutHttp = {
      switchToHttp: jest.fn().mockReturnValue({}),
    } as any;

    interceptor
      .intercept(mockContextWithoutHttp, mockCallHandler)
      .subscribe((result) => {
        expect(result).toEqual({ data: { title: 'A New Hope' } });
        done();
      });
  });
});
