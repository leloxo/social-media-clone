import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.model';
import { UserService } from '../user.service';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatButtonModule, 
    MatIconModule, 
    MatMenuModule, 
    MatCardModule, 
    MatDialogModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  user?: User;
  loading = true;
  error?: string;
  isOwnProfile = true;
  username?: string;

  posts: Post[] = [];

  constructor(
    private userService: UserService, 
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(param => {
      this.username = param['username'];

      const loggedInUsername = this.authService.getUsername();
      this.isOwnProfile = this.username === 'me' || this.username === loggedInUsername;
      this.loadProfile();
    });
  }

  private loadProfile(): void {
    if (this.isOwnProfile) {
      this.userService.fetchProfile().subscribe({
        next: (user) => {
          this.user = user;
          this.loading = false;
          console.log('User:', user);
        },
        error: (err) => {
          this.error = 'Failed to load profile';
          this.loading = false;
          console.error('Error loading profile:', err);
        }
      });
    } else if (this.username) {
      this.userService.getUserByUsername(this.username).subscribe({
        next: (user) => {
          this.user = user;
          this.loading = false;
          console.log('User:', user);
        },
        error: (err) => {
          this.error = 'User not found';
          this.loading = false;
          console.error('Error loading user:', err);
        }
      });
    }
  }
}
