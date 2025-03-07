import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginCredentials } from '../models/auth/login-credentials.model';
import { LoginResponse } from '../models/auth/login-response.model';
import { RegistrationUserData } from '../models/auth/registration-credentials.model';
import { User } from '../models/user/user.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = 'http://localhost:8005/auth';

    register(userData: RegistrationUserData): Observable<User> {
        return this.http.post<User>(`${this.baseUrl}/signup`, userData);
    }

    login(credentials: LoginCredentials): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.baseUrl}/login`, credentials);
    }

    isLoggedIn(): Observable<boolean> {
        return this.http.get<boolean>(`${this.baseUrl}/status`);
    }

    saveToken(token: string): void {
        localStorage.setItem('authToken', token);
    }

    getToken(): string | null {
        return localStorage.getItem('authToken');
    }

    saveUsername(username: string): void {
        localStorage.setItem('username', username);
    }

    getUsername(): string | null {
        return localStorage.getItem('username');
    }

    logout(): Observable<any> {
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        return this.http.post(`${this.baseUrl}/logout`, {});
    }
}