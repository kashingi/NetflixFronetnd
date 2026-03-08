import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth } from '../Shared/services/auth';
import { Router } from '@angular/router';
import { Notification } from '../Shared/services/notification';
import { ErrorHandler } from '../Shared/services/error-handler';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {

  hide = true;
  loginForm!: FormGroup;
  loading = false;
  showResendLink = false;
  userEmail = '';

  constructor(
    private formbuilder: FormBuilder,
    private authService: Auth,
    private router: Router,
    private notification: Notification,
    private errorHandle: ErrorHandler,
    private changeDetect: ChangeDetectorRef
  ) {
    this.loginForm = formbuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.authService.redirectBasedOnRole();
    }
  }

  submit() {
    this.loading = true;
    const formData = this.loginForm.value;
    const authData = {
      email: formData.email.trim().toLowerCase(),
      password: formData.password
    };

    this.authService.login(authData).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.authService.redirectBasedOnRole();
        this.notification.success('Login successfully.')
      },
      error: (error) => {
        this.loading = false;
        const errorMessage = error.error?.error || 'Login failed, check your credentials.';
        this.changeDetect.detectChanges();

        if (error.status === 403 && errorMessage.toLowerCase().includes('verify')) {
          this.showResendLink = true;
          this.changeDetect.detectChanges();
          this.userEmail = this.loginForm.value.email;
        } else {
          this.showResendLink = false;
          this.changeDetect.detectChanges();
        }
        this.notification.error(errorMessage);
      }
    });
  }

  resendVerification() {
    if (!this.userEmail) {
      this.notification.error('Please enter your email address.');
      return;
    }
    this.showResendLink = false;
    this.loading = true;
    this.authService.resendVerificationEmail(this.userEmail).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.notification.success(response.message || 'Verification email sent, please chec your inbox.');
      },
      error: (erro) => {
        this.loading = false;
        this.errorHandle.handleError(erro, 'Failed to send verification email, please try again.');
      }
    });
  }

  forgot() {
    this.router.navigate(['/forget-password']);
  }

}
