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
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Post } from '../../models/post.model';
import { UserFollowService } from '../user-follow.service';
import { ProfileEditComponent } from '../profile-edit/profile-edit.component';
import { UpdateUserDetailsRequest } from '../../models/update-user-details-request.model';
import { PostService } from '../../post/post.service';

import { AvatarModule } from 'primeng/avatar';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { Button } from 'primeng/button';
import { CardModule } from 'primeng/card';

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

    AvatarModule,
    Menu,
    Button,
    CardModule,

    ProfileEditComponent
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

  menuItems: MenuItem[] = [
    { label: 'Block', icon: 'pi pi-ban' },
    { label: 'Report', icon: 'pi pi-flag' },
    { label: 'Share Profile', icon: 'pi pi-share-alt' }
  ];

  postCount: number = 0;
  followerCount: number = 0;
  followingCount: number = 0;

  isFollowing: boolean = false;
  isEditMode: boolean= false;

  constructor(
    private userService: UserService,
    private userFollowService: UserFollowService,
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

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
          
          this.loadProfileStats();
          
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

          this.loadProfileStats();
          this.getFollowStatus();

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

  private loadProfileStats(): void {
    // TODO
    this.postCount = this.posts.length;

    if (this.user) {
      console.log("loading profile stats");

      this.userFollowService.getUserFollowersCount(this.user.id).subscribe({
        next: (followerCount) => {
          this.followerCount = followerCount;
        },
        error: (err) => {
          this.error = 'Failed to load follower count';
          console.error('Error loading profile:', err);
        }
      });
  
      this.userFollowService.getUserFollowingCount(this.user.id).subscribe({
        next: (followingCount) => {
          this.followingCount = followingCount;
        },
        error: (err) => {
          this.error = 'Failed to load following count';
          console.error('Error loading profile:', err);
        }
      });
    }
  }

  private getFollowStatus(): void {
    if (this.user && !this.isOwnProfile) {
      console.log('Loading follow status');
      this.userFollowService.getFollowStatus(this.user.id).subscribe({
        next: (isFollowing) => {
          this.isFollowing = isFollowing;
          console.log('isFollowing:', true);
        },
        error: (err) => {
          this.error = 'Failed to load follow status';
          console.error('Error loading profile:', err);
        }
      });
    }
  }

  onFollow(): void {
    if (this.user && this.username != 'me') {
      this.userFollowService.followUser(this.user.id).subscribe({
        next: () => {
          console.log('Successfully unfollowed user');
          window.location.reload();
        },
        error: (err) => {
          this.error = 'Failed to follow user';
          console.error('Error following user:', err);
        }
      });
    }
  }

  onUnfollow(): void {
    if (this.user && this.username != 'me') {
      this.userFollowService.unfollowUser(this.user.id).subscribe({
        next: () => {
          console.log('Successfully unfollowed user');
          window.location.reload();
        },
        error: (err) => {
          this.error = 'Failed to unfollow user';
          console.error('Error unfollowing user:', err);
        }
      });
    }
  }

  // TODO: use type for params
  onSaveChanges(changes: {biography: string, profileImage?: File}) {
    if (changes.profileImage) {
      console.log("Selected File:", changes.profileImage);

      this.postService.uploadProfileImage(changes.profileImage).subscribe({
        next: (imageUrl) => {
          console.log('Successfully uploaded profile image:', imageUrl);
          const profileImageUrl = imageUrl.toString();

          const updatedUserDetails: UpdateUserDetailsRequest = {
            profileImageUrl,
            biography: changes.biography,
          }

          if (this.user) {
            this.userService.updateUser(this.user.id, updatedUserDetails).subscribe({
              next: (updatedUser) => {
                this.user = updatedUser;
                this.isEditMode = false;
                console.log('Successfully updated user');
              },
              error: (err) => {
                this.error = 'Failed to update user';
                console.error('Error updating user:', err);
              }
            });
          }
        },
        error: (err) => {
          this.error = 'Failed to upload image';
          console.error('Error uploading image:', err);
        }
      });
    } else {
      const updatedUserDetails: UpdateUserDetailsRequest = {
        profileImageUrl: undefined,
        biography: changes.biography,
      }
  
      if (this.user) {
        this.userService.updateUser(this.user.id, updatedUserDetails).subscribe({
          next: (updatedUser) => {
            this.user = updatedUser;
            this.isEditMode = false;
            console.log('Successfully updated user');
          },
          error: (err) => {
            this.error = 'Failed to update user';
            console.error('Error updating user:', err);
          }
        });
      }
    }
  }

  goToUploadPage(): void {
    this.router.navigate(["/upload"]);
  }
}
