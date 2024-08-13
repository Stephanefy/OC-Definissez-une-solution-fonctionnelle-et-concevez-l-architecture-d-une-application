import { CanActivateFn, Router } from '@angular/router';
import { AuthserviceService } from '../services/authservice.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const canActivateGuard: CanActivateFn = (route, state) => {
  
  const authService: AuthserviceService = inject(AuthserviceService);
  
  const router: Router = inject(Router)

  return authService.currentAuthStatus$.pipe(
    map(
      (authStatus: boolean) => {
        console.log(authStatus)
        if (!authStatus) {
          router.navigate(['/']);
          return false;
        } else {
          return true;
        }
      }
    )
  )
};
