import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from '../Shared/services/auth';
import { Notification } from '../Shared/services/notification';

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})
export class ResetPassword implements OnInit {

  resetPasswordForm!: FormGroup;
  loading = false;
  tokenValid = false;
  token = '';
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: Auth,
    private notification: Notification
  ) {
    this.resetPasswordForm = formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', [Validators.required, authService.passwordMatchValidator('password')]]
    });
  }

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.token = token;
      this.tokenValid = true
    } else {
      this.tokenValid = false;
    }
  }

  submit() {
    this.loading = true;
    const newPassword = this.resetPasswordForm.value.password;

    this.authService.resetPassword(this.token, newPassword).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.notification.success(response.message || 'Password reset successfully.');
        this.router.navigate(['/login'])
      },
      error: (err) => {
        this.loading = false;
        const errorMsg = err.error?.error || 'Failed to reset password, please try again ';
        if (errorMsg.toLowerCase().includes('expired') || errorMsg.toLowerCase().includes('invalid')) {
          this.tokenValid = false;
        } else {
          this.notification.error(errorMsg);
        }
      }
    });
  }
}
