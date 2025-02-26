import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
}