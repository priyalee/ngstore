import { HttpInterceptorFn } from '@angular/common/http';
import { ErrorService } from '../services/error.service';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(ErrorService);

  return next(req).pipe(
    catchError(error => {
      if ([400, 401, 403, 404, 500].includes(error.status)) {
        errorService.showError(`Error ${error.status}: ${error.message}`);
      }
      return throwError(() => error);
    })
  );
};
