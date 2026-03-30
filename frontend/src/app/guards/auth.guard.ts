import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  return authState(auth).pipe(
    map((user) => {
      if (!user) return router.createUrlTree(['/login']);

      if (user && !user.emailVerified)
        return router.createUrlTree(['/verify-email']);

      return true;
    }),
  );
};
