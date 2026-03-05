import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth } from '../Shared/services/auth';
import { Notification } from '../Shared/services/notification';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  standalone: false,
  templateUrl: './forget-password.html',
  styleUrl: './forget-password.scss',
})
export class ForgetPassword {

  forgotPasswordForm!: FormGroup;
  loading = false;

  constructor(
    private formbuilder: FormBuilder,
    private authService: Auth,
    private notification: Notification,
    private router: Router
  ) {
    this.forgotPasswordForm = formbuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  submit() {
    this.loading = true;
    const email = this.forgotPasswordForm.value?.email;

    this.authService.forgotPassword(email).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.notification.success(response.message);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.notification.error(err.error?.error || 'Failed to send reset email. please try again');
      }
    });
  }
}
