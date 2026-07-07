import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

/** Sends first-time / signed-out visitors to the sign-in gate. */
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.hasEntered()) return true;

  return router.createUrlTree(['/signin'], {
    queryParams: state.url && state.url !== '/' ? { returnUrl: state.url } : {},
  });
};
