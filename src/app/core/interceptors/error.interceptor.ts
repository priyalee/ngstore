import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ErrorService } from '@core/services/error.service';
import { ConnectionService } from '@core/services/connection.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(ErrorService);
  const connection = inject(ConnectionService);

  return next(req).pipe(
    catchError(error => {
      // status 0 => network failure / no internet / CORS
      if (error.status === 0 || !navigator.onLine) {
        connection.reportOffline();
      } else if (error.status >= 500) {
        // server-side failure => show the global error page
        errorService.showError(`Server error ${error.status}`);
      }
      return throwError(() => error);
    })
  );
};
