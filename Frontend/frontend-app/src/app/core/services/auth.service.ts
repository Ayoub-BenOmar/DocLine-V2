import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:8080/api';

    constructor(private http: HttpClient,
                private router: Router) { }

    register(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/auth/register`, data);
    }

    login(credentials: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/auth/authenticate`, credentials).pipe(
            tap(response => {
              console.log('Login response:', response);
                if (response.token) {
                    this.saveToken(response.token);
                    if (typeof localStorage !== 'undefined') {
                        localStorage.setItem('user_role', response.role);
                        localStorage.setItem('user_email', response.email);
                        localStorage.setItem('user_name', response.name);
                    }
                }
            })
        );
    }

    saveToken(token: string): void {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('auth_token', token);
        }
    }

    getToken(): string | null {
        if (typeof localStorage !== 'undefined') {
            return localStorage.getItem('auth_token');
        }
        return null;
    }

    logout(): void {
         if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_role');
            localStorage.removeItem('user_email');
            localStorage.removeItem('user_name');
        }
        // Use setTimeout to ensure state is cleared before navigation
        setTimeout(() => {
            this.router.navigate(['/']);
        }, 0);
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    getUserRole(): string | null {
        if (typeof localStorage !== 'undefined') {
            return localStorage.getItem('user_role');
        }
        return null;
    }

    getCities(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/public/cities`);
    }

    getSpecialities(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/public/specialities`);
    }
}
