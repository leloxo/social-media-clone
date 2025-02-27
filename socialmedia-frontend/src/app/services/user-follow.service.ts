import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user/user.model';

@Injectable({
    providedIn: 'root'
})
export class UserFollowService {
    private baseUrl = 'http://localhost:8005/follows';

    constructor(private http: HttpClient) {}

    getUserFollowersCount(userId: number): Observable<number> {
        return this.http.get<number>(`${this.baseUrl}/followers/count/${userId}`);
    }

    getUserFollowingCount(userId: number): Observable<number> {
        return this.http.get<number>(`${this.baseUrl}/following/count/${userId}`);
    }

    followUser(targetUserId: number): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/${targetUserId}`, {});
    }

    unfollowUser(targetUserId: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${targetUserId}`);
    }

    getFollowStatus(userId: number): Observable<boolean> {
        return this.http.get<boolean>(`${this.baseUrl}/status/${userId}`);
    }
}