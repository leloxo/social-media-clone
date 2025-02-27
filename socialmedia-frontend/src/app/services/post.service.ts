import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../models/post/post.model';
import { PageResponse } from '../models/common/page-response.model';

@Injectable({
    providedIn: 'root'
})
export class PostService {
    private apiUrl = 'http://localhost:8005/posts';

    constructor(private http: HttpClient) {}

    uploadProfileImage(image: File): Observable<string> {
        const formData = new FormData();
        formData.append("image", image);

        return this.http.post(`${this.apiUrl}/i`, formData, {
            responseType: 'text'
        });
    }

    getPostsByUser(username: string, page: number = 0, size: number = 20): Observable<PageResponse<Post>> {
        return this.http.get<PageResponse<Post>>(`${this.apiUrl}/user/${username}?page=${page}&size=${size}`);
    }
}