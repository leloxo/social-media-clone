import { Component } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, debounceTime } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  imports: [FormsModule, CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
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
