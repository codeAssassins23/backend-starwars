import { of } from 'rxjs';
import { Test, TestingModule } from '@nestjs/testing';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { ResponseIterceptor } from '../response.interceptor';
import { LoggerService } from '../../../infrastructure/config/logger/logger.service';

describe('ResponseInterceptor', () => {
  let interceptor: ResponseIterceptor<any>;
  let loggerService: jest.Mocked<LoggerService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResponseIterceptor,
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
          },
        },
      ],
    }).compile();

    interceptor = module.get<ResponseIterceptor<any>>(ResponseIterceptor);
    loggerService = module.get(LoggerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería devolver el formato { data } correctamente', (done) => {
    // Mock del ExecutionContext y CallHandler
    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn(),
      }),
    } as unknown as ExecutionContext;

    const mockData = { message: 'Hola mi king' };
    const mockNext: CallHandler = {
      handle: () => of(mockData),
    };

    interceptor.intercept(mockContext, mockNext).subscribe((result) => {
      expect(result).toEqual({ data: mockData });
      done();
    });
  });

  it('debería registrar el log correctamente con LoggerService', (done) => {
    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn(),
      }),
    } as unknown as ExecutionContext;

    const mockData = { success: true };
    const mockNext: CallHandler = {
      handle: () => of(mockData),
    };

    interceptor.intercept(mockContext, mockNext).subscribe(() => {
      expect(loggerService.log).toHaveBeenCalledWith(
        'Data: ' + JSON.stringify(mockData),
        'ResponseInterceptor',
      );
      done();
    });
  });
});
