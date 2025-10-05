import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LoggerService } from 'src/infrastructure/config/logger/logger.service';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? this.extractMessage(exception)
        : 'Internal Server Error';

    const path = request.url;
    const method = request.method;
    const timestamp = new Date().toISOString();

    this.logger.error(
      `${method} ${path} → ${message} (Status: ${status})`,
      exception instanceof Error ? exception.stack : undefined,
      'AllExceptionFilter',
    );

    // Respuesta uniforme al cliente
    const responseData = {
      statusCode: status,
      timestamp,
      path,
      method,
      message,
    };

    response.status(status).json(responseData);
  }

  // Extrae mensaje del HttpException de forma segura
  private extractMessage(exception: HttpException): string {
    const response = exception.getResponse();
    if (typeof response === 'string') return response;
    if (typeof response === 'object' && 'message' in response) {
      const msg = (response as any).message;
      if (Array.isArray(msg)) return msg.join(', ');
      return msg ?? exception.message;
    }
    return exception.message;
  }
}
