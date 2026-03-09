import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        const userRole = authService.getUserRole();
        const expectedRoles = route.data['roles'] as Array<string>;

        if (expectedRoles && expectedRoles.length > 0) {
            if (userRole && expectedRoles.includes(userRole)) {
                return true;
            } else {
                if (userRole === 'ROLE_ADMIN') {
                    router.navigate(['/admin/dashboard']);
                } else if (userRole === 'ROLE_DOCTOR') {
                    router.navigate(['/doctor/dashboard']);
                } else {
                    router.navigate(['/']);
                }
                return false;
            }
        }
        return true;
    } else {
        router.navigate(['/login']);
        return false;
    }
};


