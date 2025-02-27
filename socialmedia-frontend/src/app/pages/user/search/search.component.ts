import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Subject, debounceTime } from 'rxjs';
import { User } from '../../../models/user/user.model';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-search',
  imports: [
    FormsModule, 
    CommonModule,
    ReactiveFormsModule,
    InputIcon, 
    IconField, 
    InputTextModule,
  ],
  templateUrl: './search.component.html',
})
export class SearchComponent {
  searchTerm: string = '';
  users: User[] = [];
  searchSubject = new Subject<string>();

  constructor(private userService: UserService, private router: Router) {
    this.searchSubject.pipe(
      debounceTime(300)
    ).subscribe(term => this.searchUsers(term));
  }

  onSearch(): void {
    this.searchSubject.next(this.searchTerm);
  }

  searchUsers(term: string): void {
    if (term.trim().length > 0) {
      this.userService.findUsersByUsername(this.searchTerm).subscribe({
        next: (data) => this.users = data,
        error: (err) => console.error('Error fetching users', err)
      });
    } else {
      this.users = [];
    }
  }

  viewUserProfile(username: string) {
    this.router.navigate([`/profile/${username}`]);
  }
}
