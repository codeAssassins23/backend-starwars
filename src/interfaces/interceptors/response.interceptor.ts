import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { LoggerService } from 'src/infrastructure/config/logger/logger.service';

export class ResponseFormat<T> {
  data: T;
}

@Injectable()
export class ResponseIterceptor<T>
  implements NestInterceptor<T, ResponseFormat<T>>
{
  constructor(private readonly loggerService: LoggerService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ResponseFormat<T>> {
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse();
    return next.handle().pipe(
      map((data) => {
        this.loggerService.log(
          'Data: ' + JSON.stringify(data),
          'ResponseInterceptor',
        );
        return {
          data,
        };
      }),
    );
  }
}
