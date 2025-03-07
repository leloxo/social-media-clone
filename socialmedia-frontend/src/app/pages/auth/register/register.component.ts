import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { AppDarkModeToggle } from "../../../layout/component/app.dark-mode-toggle";
import { AuthService } from '../../../services/auth.service';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { RegistrationUserData } from '../../../models/auth/registration-credentials.model';

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
      RouterModule,
      AppDarkModeToggle
    ],
  templateUrl: './register.component.html',
  providers: [MessageService]
})
export class RegisterComponent implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
    
  readonly isLoading$ = this.loadingSubject.asObservable();

  readonly registrationForm = new FormGroup({
    firstName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    lastName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    userName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$")]
    }),
    confirmPassword: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onRegister(): void {
    if (this.registrationForm.invalid) {
      return;
    }

    const userData: RegistrationUserData = this.registrationForm.getRawValue();
    this.loadingSubject.next(true);

    this.authService.register(userData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadingSubject.next(true);
          this.router.navigate([`/login`]);
        },
        error: () => {
          this.loadingSubject.next(false);
          this.showErrorViaToast();
        }
      });
  }

  showErrorViaToast() {
    this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Error during registration, try again.' });
  }
}
