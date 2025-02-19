import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private baseUrl = 'http://localhost:8005/users';

    constructor(private http: HttpClient) {}

    fetchProfile(): Observable<User> {
        return this.http.get<User>(`${this.baseUrl}/me`);
    }

    findUsersByUsername(userName: string): Observable<User[]> {
        return this.http.get<User[]>(`${this.baseUrl}/search?username=${userName}`);
    }
    
    getUserByUsername(userName: string): Observable<User> {
        return this.http.get<User>(`${this.baseUrl}/${userName}`);
    }
}