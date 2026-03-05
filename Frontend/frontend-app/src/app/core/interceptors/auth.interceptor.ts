import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.getToken();

    if (token) {
        console.log(`[AuthInterceptor] Attaching token to ${req.url}:`, token.substring(0, 5) + '...');
        const cloned = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        return next(cloned);
    } else {
        console.warn(`[AuthInterceptor] No token found for ${req.url}`);
    }

    return next(req);
};
