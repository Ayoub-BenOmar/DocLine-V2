import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const token = authService.getToken();

    let requestToHandle = req;

    if (token) {
        console.log(`[AuthInterceptor] Attaching token to ${req.url}:`, token.substring(0, 5) + '...');
        requestToHandle = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    } else {
        console.warn(`[AuthInterceptor] No token found for ${req.url}`);
    }

    return next(requestToHandle).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401 || error.status === 403) {
                console.warn('[AuthInterceptor] 401/403 error detected, logging out...');
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user_role');
                router.navigate(['/login']);
            }
            return throwError(() => error);
        })
    );
};
