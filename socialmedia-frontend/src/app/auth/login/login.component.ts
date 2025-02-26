import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { AppDarkModeToggle } from "../../layout/component/app.dark-mode-toggle";
import { AuthService } from '../auth.service';

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
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private authService: AuthService, private messageService: MessageService, private router: Router) {}

  onLogin(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    this.authService.login({ email: email, password: password }).subscribe({
      next: (response: any) => {
        this.authService.saveToken(response.token);
        this.authService.saveUsername(response.username);
        this.router.navigate([`/profile/me`]);
      },
      error: (err: any) => {
        this.showErrorViaToast();
      }
    });
  }

  // TODO: move to profile
  onLogout(): void {
    this.authService.logout();
    console.log('Logged out!');
  }

  showErrorViaToast() {
    this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Invalid credentials' });
  }
}
