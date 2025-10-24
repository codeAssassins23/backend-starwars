import { AllExceptionFilter } from '../exception.filter';
import { LoggerService } from '../../../infrastructure/config/logger/logger.service';
import { HttpException, HttpStatus, ArgumentsHost } from '@nestjs/common';

describe('AllExceptionFilter', () => {
  let filter: AllExceptionFilter;
  let mockLogger: jest.Mocked<LoggerService>;
  let mockHost: jest.Mocked<ArgumentsHost>;
  let mockResponse: any;
  let mockRequest: any;

  beforeEach(() => {
    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    } as any;

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockRequest = {
      url: '/test',
      method: 'GET',
    };

    mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn(() => mockResponse),
        getRequest: jest.fn(() => mockRequest),
      }),
    } as any;

    filter = new AllExceptionFilter(mockLogger);
  });

  it('debería manejar correctamente una HttpException', () => {
    const exception = new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    filter.catch(exception, mockHost);

    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringContaining('[EXCEPTION] GET /test'),
      expect.any(String),
      'AllExceptionFilter',
    );

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.FORBIDDEN,
        path: '/test',
        method: 'GET',
      }),
    );
  });

  it('debería manejar una excepción genérica', () => {
    const exception = new Error('Unexpected error');

    filter.catch(exception, mockHost);

    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringContaining('[EXCEPTION] GET /test'),
      expect.any(String),
      'AllExceptionFilter',
    );

    expect(mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  });

  it('debería manejar correctamente un HttpException con objeto de respuesta', () => {
    const exception = new HttpException(
      { message: ['Campo inválido'] },
      HttpStatus.BAD_REQUEST,
    );

    filter.catch(exception, mockHost);

    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringContaining('Campo inválido'),
      expect.any(String),
      'AllExceptionFilter',
    );
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
  });
});
