import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:8080/api';

    constructor(private http: HttpClient) { }

    register(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/auth/register`, data);
    }

    login(credentials: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/auth/authenticate`, credentials).pipe(
            tap(response => {
                if (response.token) {
                    this.saveToken(response.token);
                    // Save other user info if needed
                    localStorage.setItem('user_role', response.role);
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
        }
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    getCities(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/public/cities`);
    }

    getSpecialities(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/public/specialities`);
    }
}
