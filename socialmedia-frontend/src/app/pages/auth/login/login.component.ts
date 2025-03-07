import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { AppDarkModeToggle } from "../../../layout/component/app.dark-mode-toggle";
import { AuthService } from '../../../services/auth.service';
import { LoginCredentials } from '../../../models/auth/login-credentials.model';
import { LoginResponse } from '../../../models/auth/login-response.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    MessageModule,
    PasswordModule,
    RouterModule,
    AppDarkModeToggle
  ],
  templateUrl: './login.component.html',
  providers: [MessageService]
})
export class LoginComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  
  readonly isLoading$ = this.loadingSubject.asObservable();

  readonly loginForm = new FormGroup({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });

  ngOnInit(): void {
    this.authService.isLoggedIn()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (isLoggedIn) => {
          if (isLoggedIn) {
            this.router.navigate(['/profile/me']);
          }
        },
        error: () => {}
      });    
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const credentials: LoginCredentials = this.loginForm.getRawValue();
    this.loadingSubject.next(true);

    this.authService.login(credentials)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: LoginResponse) => {
          this.loadingSubject.next(false);
          this.authService.saveToken(response.token);
          this.authService.saveUsername(response.username);
          this.router.navigate([`/profile/me`]);
        },
        error: () => {
          this.loadingSubject.next(false);
          this.showErrorViaToast('Invalid email or password');

          const resetPasswordCredentials: LoginCredentials = {
            ...credentials,
            password: ''
          }
          this.loginForm.setValue(resetPasswordCredentials);
        }
      });
  }

  private showErrorViaToast(message: string): void {
    this.messageService.add({ severity: 'error', summary: 'Login Error', detail: message });
  }
}
