import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const authGuard: CanActivateFn = (route, state) => {
  const rota = inject(Router);
  const auth = inject(AuthService);

  if (auth.estaLogado()) {
    return true;
  } else {
    rota.navigate(['/login'])
    return false;
  }
};
