import { CanActivateFn, Router } from '@angular/router';
import { AuthserviceService } from '../services/authservice.service';
import { inject } from '@angular/core';
import { StateService } from '../services/state.service';

export const canActivateAsClientGuard: CanActivateFn = (route, state) => {

    const stateService: StateService = inject(StateService);
    const router: Router = inject(Router)


    const isAdmin = stateService.getisAdminData();

    if (isAdmin) {
        router.navigate(['/admin-board']);
        return false;
    } else {
        return true;
    }
}