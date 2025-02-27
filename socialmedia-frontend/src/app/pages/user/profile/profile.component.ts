import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../../models/user/user.model';
import { UserService } from '../../../services/user.service';

import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Post } from '../../../models/post/post.model';
import { UpdateUserDetailsRequest } from '../../../models/user/update-user-details-request.model';
import { PostService } from '../../../services/post.service';
import { ProfileEditComponent } from '../profile-edit/profile-edit.component';
import { UserFollowService } from '../../../services/user-follow.service';

import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { Button } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Menu } from 'primeng/menu';
import { Subject, takeUntil } from 'rxjs';

interface ProfileChanges {
  biography: string,
  profileImage?: File
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AvatarModule,
    Menu,
    Button,
    CardModule,
    ProfileEditComponent
  ],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit, OnDestroy {
  private userService = inject(UserService);
  private userFollowService = inject(UserFollowService);
  private postService = inject(PostService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  user?: User;
  loading = true;
  error?: string;
  isOwnProfile = true;
  username?: string;
  posts: Post[] = [];

  menuItemsOwnProfile: MenuItem[] | undefined;
  menuItemsUser: MenuItem[] | undefined;

  postCount: number = 0;
  followerCount: number = 0;
  followingCount: number = 0;

  isFollowing: boolean = false;
  isEditMode: boolean= false;

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.initializeMenuItems();
    this.subscribeToRouteParamsAndLoadProfile();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFollow(): void {
    if (!this.user || this.username === 'me') return;
    
    this.userFollowService.followUser(this.user.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log('Successfully followed user');
          this.refreshPage();
        },
        error: (err) => {
          this.handleError('Failed to follow user', err);
        }
      });
  }

  onUnfollow(): void {
    if (!this.user || this.username === 'me') return;

    this.userFollowService.unfollowUser(this.user.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log('Successfully unfollowed user');
          this.refreshPage();
        },
        error: (err) => {
          this.handleError('Failed to unfollow user', err);
        }
      });
  }

  onSaveChanges(changes: ProfileChanges) {
    if (!this.user) return;

    if (changes.profileImage) {
      this.updateProfileWithImage(changes);
    } else {
      this.updateProfileWithoutImage(changes);
    }
  }

  goToUploadPage(): void {
    this.router.navigate(["/upload"]);
  }

  private initializeMenuItems(): void {
    //TODO

    this.menuItemsOwnProfile = [
      { label: 'Options',
        items: [
          { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.onLogout() },
        ]
      }
    ];
    
    this.menuItemsUser = [
      { label: 'Options',
        items: [
          { label: 'Report User', icon: 'pi pi-flag' },
        ]
      }
    ];
  }

  private subscribeToRouteParamsAndLoadProfile(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(param => {
        this.username = param['username'];
        const loggedInUsername = this.authService.getUsername();
        this.isOwnProfile = this.username === 'me' || this.username === loggedInUsername;

        this.loadProfile();
      });
  }

  private loadProfile(): void {
    this.loading = true;

    if (this.isOwnProfile) {
      this.loadOwnProfile();
    } else if (this.username) {
      this.loadUserProfile();
    }
  }

  private loadOwnProfile(): void {
    this.userService.fetchProfile()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          this.user = user;
          this.initializeProfileData();
        },
        error: (err) => {
          this.handleError('Failed to load profile', err);
        }
      });
  }

  private loadUserProfile(): void {
    if (!this.username) return;

    this.userService.getUserByUsername(this.username)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          this.user = user;
          this.initializeProfileData();
          this.getFollowStatus();
        },
        error: (err) => {
          this.handleError('User not found', err);
        }
      });
  }

  private initializeProfileData(): void {
    this.loadProfileStats();
    this.loadUserPosts();
    this.loading = false;
  }

  private loadProfileStats(): void {
    if (!this.user) return;

    // TODO: Use service, else the post count is wrong
    this.postCount = this.posts.length;

    this.userFollowService.getUserFollowersCount(this.user.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (count) => {
          this.followerCount = count;
        },
        error: (err) => {
          this.handleError('Failed to load follower count', err);
        }
      });

    this.userFollowService.getUserFollowingCount(this.user.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (count) => {
          this.followingCount = count;
        },
        error: (err) => {
          this.handleError('Failed to load following count', err);
        }
      });
  }

  private loadUserPosts(): void {
    const username = this.resolveUsername();
    if (!username) return;

    this.postService.getPostsByUser(username)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (page) => {
          this.posts = page.content;
        },
        error: (err) => {
          this.handleError('Failed to fetch posts', err);
        }
      });
  }

  private resolveUsername(): string | null {
    if (this.username === 'me') {
      return this.authService.getUsername();
    }
    return this.username || null;
  }

  private getFollowStatus(): void {
    if (!this.user || this.isOwnProfile) return;

    this.userFollowService.getFollowStatus(this.user.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (isFollowing) => {
          this.isFollowing = isFollowing;
        },
        error: (err) => {
          this.handleError('Failed to load follow status', err);
        }
      });
  }

  private updateProfileWithImage(changes: ProfileChanges): void {
    if (!this.user || !changes.profileImage) return;

    this.postService.uploadProfileImage(changes.profileImage)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (imageUrl) => {
          const profileImageUrl = imageUrl.toString();
          this.updateUserDetails({
            profileImageUrl,
            biography: changes.biography
          });
        },
        error: (err) => {
          this.handleError('Failed to upload image', err);
        }
      });
  }

  private updateProfileWithoutImage(changes: ProfileChanges): void {
    if (!this.user) return;
    
    this.updateUserDetails({
      biography: changes.biography
    });
  }

  private updateUserDetails(details: UpdateUserDetailsRequest) {
    if (!this.user) return;

    this.userService.updateUser(this.user.id, details)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedUser) => {
          this.user = updatedUser;
          this.isEditMode = false;
        },
        error: (err) => {
          this.handleError('Failed to update user', err);
        }
      });
  }

  private onLogout(): void {
    this.authService.logout();
    this.refreshPage();
  }

  private refreshPage(): void {
    window.location.reload();
  }

  private handleError(message: string, error: any): void {
    this.error = message;
    this.loading = false;
    console.error(`${message}:`, error);
  }
}
