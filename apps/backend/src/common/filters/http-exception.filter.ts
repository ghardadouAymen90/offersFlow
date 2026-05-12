import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('Error');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error: any = {};

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object') {
        error = exceptionResponse;
        message = (exceptionResponse as any).message || exception.message;
      } else {
        message = exception.message;
      }

      if (status >= 500) {
        // Only loggind stack for server errors
        this.logger.error(
          `${request.method} ${request.url} - ${status} - ${message}`,
          exception.stack
        );
      } else {
        this.logger.warn(`${request.method} ${request.url} - ${status} - ${message}`);
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      error = {
        message: exception.message,
        name: exception.name,
      };

      //unhandled errors
      this.logger.error(
        `${request.method} ${request.url} - ${status} - ${exception.message}`,
        exception.stack
      );
    } else {
      message = String(exception);
      this.logger.error(`${request.method} ${request.url} - ${status} - ${String(exception)}`);
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      ...(process.env.NODE_ENV === 'development' && {
        details: typeof error === 'object' ? error : { message: error },
      }),
    };

    response.status(status).json(errorResponse);
  }
}
