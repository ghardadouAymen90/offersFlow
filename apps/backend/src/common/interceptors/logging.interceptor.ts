import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        const statusCode = context.switchToHttp().getResponse().statusCode;
        this.logger.log(`${method} ${url} - ${statusCode} (${duration}ms)`);
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;
        const statusCode = error.status || 500;

        const isServerError = statusCode >= 500;
        const isDebugMode = process.env.LOG_LEVEL === 'debug';

        if (isServerError) {
          this.logger.error(
            `${method} ${url} - ${statusCode} (${duration}ms) - ${error.message}`,
            error.stack
          );
        } else if (isDebugMode) {
          this.logger.debug(
            `${method} ${url} - ${statusCode} (${duration}ms) - ${error.message}`,
            error.stack
          );
        } else {
          this.logger.warn(`${method} ${url} - ${statusCode} (${duration}ms) - ${error.message}`);
        }

        throw error;
      })
    );
  }
}
