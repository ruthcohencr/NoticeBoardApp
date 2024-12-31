import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SecurityService } from '../../security/security.service';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  
  const router = inject(Router);
  const securityService = inject(SecurityService);

  if (securityService.isLoggedIn()){
    return true;
  }

  router.navigate(['/login']);
  return true;
};
