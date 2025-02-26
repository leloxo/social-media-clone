import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private baseUrl = 'http://localhost:8005/auth';

    constructor(private http: HttpClient) {}

    // TODO use DTO classes and make user class
    
    register(personData: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/signup`, personData);
    }

    login(credentials: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/login`, credentials);
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