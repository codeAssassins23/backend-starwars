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
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';
import { ResponseIterceptor } from '../response.interceptor';
import { LoggerService } from '../../../../infrastructure/config/logger/logger.service';
import * as AWSXRay from 'aws-xray-sdk';

describe('ResponseIterceptor', () => {
  let interceptor: ResponseIterceptor<any>;
  let loggerService: LoggerService;
  let mockContext: ExecutionContext;
  let mockCallHandler: CallHandler;

  beforeEach(() => {
    loggerService = {
      Response: jest.fn(),
    } as any;

    interceptor = new ResponseIterceptor(loggerService);

    mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({ request: 'test' }),
        getResponse: () => ({ response: 'test' }),
      }),
    } as any;

    mockCallHandler = {
      handle: () => of({ testData: 'test' }),
    };

    jest.spyOn(AWSXRay, 'getSegment').mockReset();
  });

  describe('intercept', () => {
    it('debe formatear correctamente la respuesta con el formato esperado', (done) => {
      const result = interceptor.intercept(mockContext, mockCallHandler);

      result.subscribe((formattedResponse) => {
        expect(formattedResponse).toEqual({
          data: { testData: 'test' },
        });
        done();
      });
    });

    it('debe llamar al logger service con los parámetros correctos', (done) => {
      const result = interceptor.intercept(mockContext, mockCallHandler);

      result.subscribe(() => {
        expect(loggerService.Response).toHaveBeenCalledWith(
          { request: 'test' },
          { response: 'test' },
          { testData: 'test' },
        );
        done();
      });
    });

    it('debe cerrar el segmento de AWS X-Ray si existe', (done) => {
      const mockSegment = {
        close: jest.fn(),
      } as any;

      jest.spyOn(AWSXRay, 'getSegment').mockReturnValue(mockSegment);

      const result = interceptor.intercept(mockContext, mockCallHandler);

      result.subscribe(() => {
        expect(mockSegment.close).toHaveBeenCalled();
        done();
      });
    });

    it('no debe cerrar el segmento de AWS X-Ray si no existe', (done) => {
      jest.spyOn(AWSXRay, 'getSegment').mockReturnValue(null);

      const result = interceptor.intercept(mockContext, mockCallHandler);

      result.subscribe(() => {
        expect(AWSXRay.getSegment()).toBeNull();
        done();
      });
    });
  });
});
