process.env.PORT = '3000';
process.env.DATABASE_SSL = 'false';
process.env.SYNCHRONIZE = 'false';
process.env.XRAY_DAEMON_ADDRESS = 'http://xray-daemon.local';
process.env.NODE_ENV = 'development';
process.env.OPENSEARCH_LOG_LEVEL = 'debug';
process.env.URL_FILES = 'http://localhost/files';
process.env.API_CRM = 'http://localhost/crm';
process.env.URL_REGISTRAR_CASO_AUTOGESTIONABLE = 'http://localhost/registrar';
process.env.API_KEY = 'some-api-key';
process.env.URL_ACTUALIZAR_CASO_AUTOGESTIONABLE = 'http://localhost/actualizar';
process.env.APOLO_SSL = 'false';
process.env.SOAP_BASE = 'http://localhost/soap';
process.env.SOAP_ALUMNO_SANCIONADO = 'http://localhost/soap/alumno-sancionado';
process.env.SOAP_ES_REINCORPORADO_PS = 'http://localhost/soap/reincorporado-ps';
process.env.SOAP_CARRERA_REINCORPORADO =
  'http://localhost/soap/carrera-reincorporado';
process.env.SOAP_REVERSION_CARGO = 'http://localhost/soap/reversion-cargo';
process.env.SOAP_LVF_CARGOS_ALUMNO = 'http://localhost/soap/lvf-cargos-alumno';
process.env.SECRET_ACCESS = JSON.stringify({
  'BDAPOLO.HOST': 'host',
  'BDAPOLO.PORT': '5432',
  'BDAPOLO.USER': 'user',
  'BDAPOLO.PASSWORD': 'password',
  'BDAPOLO.NAME': 'bdname',
  'BDTRAMITES.HOST': 'host',
  'BDTRAMITES.PORT': '5432',
  'BDTRAMITES.USER': 'user',
  'BDTRAMITES.PASSWORD': 'password',
  'BDTRAMITES.NAME': 'bdname',
});
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { AllExceptionFilter } from '../exception.filter';
import { LoggerService } from 'src/infrastructure/config/logger/logger.service';

describe('AllExceptionFilter', () => {
  let exceptionFilter: AllExceptionFilter;
  let mockLoggerService: jest.Mocked<LoggerService>;
  let mockArgumentsHost: jest.Mocked<ArgumentsHost>;
  let mockRequest: any;
  let mockResponse: any;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockDate: Date;

  beforeEach(() => {
    mockJson = jest.fn().mockReturnThis();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockRequest = {
      url: '/test-url',
    };
    mockResponse = {
      status: mockStatus,
    };

    mockLoggerService = {
      Error: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as unknown as jest.Mocked<ArgumentsHost>;

    mockDate = new Date('2024-01-01T00:00:00.000Z');
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

    exceptionFilter = new AllExceptionFilter(mockLoggerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('catch', () => {
    it('debería manejar HttpException con mensaje de string', () => {
      const exception = new HttpException(
        'Error de prueba',
        HttpStatus.BAD_REQUEST,
      );

      exceptionFilter.catch(exception, mockArgumentsHost);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockJson).toHaveBeenCalledWith({
        status: HttpStatus.BAD_REQUEST,
        datetime: mockDate.toISOString(),
        path: '/test-url',
        message: 'Error de prueba',
      });
      expect(mockLoggerService.Error).toHaveBeenCalledWith(
        mockRequest,
        { statusCode: HttpStatus.BAD_REQUEST },
        { code: 'ERROR', message: 'Error de prueba' },
      );
    });

    it('debería manejar HttpException con mensaje en objeto', () => {
      const exception = new HttpException(
        { message: 'Error en objeto' },
        HttpStatus.BAD_REQUEST,
      );

      exceptionFilter.catch(exception, mockArgumentsHost);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockJson).toHaveBeenCalledWith({
        status: HttpStatus.BAD_REQUEST,
        datetime: mockDate.toISOString(),
        path: '/test-url',
        message: 'Error en objeto',
      });
    });

    it('debería manejar excepciones genéricas con Internal Server Error', () => {
      const exception = new Error('Error genérico');

      exceptionFilter.catch(exception, mockArgumentsHost);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockJson).toHaveBeenCalledWith({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        datetime: mockDate.toISOString(),
        path: '/test-url',
        message: 'Error genérico',
      });
    });

    it('debería manejar HttpException sin mensaje en objeto de respuesta', () => {
      const exception = new HttpException({}, HttpStatus.BAD_REQUEST);

      exceptionFilter.catch(exception, mockArgumentsHost);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockJson).toHaveBeenCalledWith({
        status: HttpStatus.BAD_REQUEST,
        datetime: mockDate.toISOString(),
        path: '/test-url',
        message: 'Http Exception',
      });
    });

    it('debería registrar el error utilizando el LoggerService', () => {
      const exception = new HttpException(
        'Error de logging',
        HttpStatus.BAD_REQUEST,
      );

      exceptionFilter.catch(exception, mockArgumentsHost);

      expect(mockLoggerService.Error).toHaveBeenCalledWith(
        mockRequest,
        { statusCode: HttpStatus.BAD_REQUEST },
        { code: 'ERROR', message: 'Error de logging' },
      );
    });
  });
});
