import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { AllExceptionFilter } from '../exception.filter';
import { LoggerService } from '../../../infrastructure/config/logger/logger.service';

describe('AllExceptionFilter', () => {
  let filter: AllExceptionFilter;
  let mockLogger: jest.Mocked<LoggerService>;
  let mockResponse: any;
  let mockRequest: any;
  let mockHost: jest.Mocked<ArgumentsHost>;

  beforeEach(() => {
    mockLogger = {
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    } as any;

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockRequest = {
      url: '/test/url',
      method: 'GET',
    };

    mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as any;

    filter = new AllExceptionFilter(mockLogger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Manejo de HttpException
  it('debería manejar correctamente una HttpException', () => {
    const exception = new HttpException(
      'Unauthorized',
      HttpStatus.UNAUTHORIZED,
    );

    filter.catch(exception, mockHost);

    expect(mockLogger.error).toHaveBeenCalledWith(
      'GET /test/url → Unauthorized (Status: 401)',
      exception.stack,
      'AllExceptionFilter',
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
        message: 'Unauthorized',
        path: '/test/url',
        method: 'GET',
      }),
    );
  });

  // Test 2: Manejo de excepción genérica (no HttpException)
  it('debería manejar correctamente una excepción genérica', () => {
    const exception = new Error('Unexpected failure');

    filter.catch(exception, mockHost);

    expect(mockLogger.error).toHaveBeenCalledWith(
      'GET /test/url → Internal Server Error (Status: 500)',
      exception.stack,
      'AllExceptionFilter',
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        message: 'Internal Server Error',
      }),
    );
  });

  // Test 3: HttpException con objeto response
  it('debería manejar un HttpException con objeto de respuesta', () => {
    const exception = new HttpException(
      { message: ['Campo requerido', 'Email inválido'] },
      HttpStatus.BAD_REQUEST,
    );

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Campo requerido, Email inválido',
      }),
    );
  });

  // Test 4: Verifica método privado extractMessage()
  it('debería extraer correctamente el mensaje del HttpException', () => {
    const exception = new HttpException(
      { message: ['Campo requerido', 'Contraseña inválida'] },
      HttpStatus.BAD_REQUEST,
    );

    const message = filter['extractMessage'](exception);
    expect(message).toBe('Campo requerido, Contraseña inválida');
  });
});
