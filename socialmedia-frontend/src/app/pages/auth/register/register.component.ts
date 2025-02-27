import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { AppDarkModeToggle } from "../../../layout/component/app.dark-mode-toggle";
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [
      CommonModule,
      ReactiveFormsModule,
      ButtonModule,
      InputTextModule,
      DividerModule,
      ToastModule,
      MessageModule,
      PasswordModule,
      AppDarkModeToggle
    ],
  templateUrl: './register.component.html',
  providers: [MessageService]
})
export class RegisterComponent {

  registrationForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    userName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  constructor(private authService: AuthService, private messageService: MessageService, private router: Router) {}

  onRegister(): void {
    if (this.registrationForm.invalid) {
      return;
    }

    const firstName = this.registrationForm.get('firstName')?.value;
    const lastName = this.registrationForm.get('lastName')?.value;
    const userName = this.registrationForm.get('userName')?.value;
    const email = this.registrationForm.get('email')?.value;
    const password = this.registrationForm.get('password')?.value;

    this.authService.register({ firstName: firstName, lastName: lastName, userName: userName, email: email, password: password }).subscribe({
      next: (response: any) => {
        console.log(response.personData)
        this.router.navigate([`/login`]);
      },
      error: (err: any) => {
        this.showErrorViaToast();
      }
    });
  }

  showErrorViaToast() {
    this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Error during registration, try again.' });
  }
}
