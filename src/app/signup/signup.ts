import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Notification } from '../Shared/services/notification';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandler } from '../Shared/services/error-handler';
import { Auth } from '../Shared/services/auth';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup implements OnInit {

  hidePassword = true;
  hideConfirmPassword = true;
  signupForm!: FormGroup;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: Auth,
    private router: Router,
    private route: ActivatedRoute,
    private notification: Notification,
    private errorHandle: ErrorHandler,
    private detectChange: ChangeDetectorRef
  ) {
    this.signupForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.minLength(8)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', [Validators.required, this.authService.passwordMatchValidator('password')]]
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.authService.redirectBasedOnRole();
    }

    const email = this.route.snapshot.queryParams['email'];
    if (email) {
      this.signupForm.patchValue({ email: email });
      console.log(email);
    }
  }

  submit() {
    this.loading = true;
    const formData = this.signupForm.value;
    const data = {
      email: formData.email?.trim().toLowerCase(),
      password: formData.password,
      fullName: formData.fullName
    };

    this.authService.signup(data).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.notification.success(response?.message);
        this.router.navigate(['/login']);
        this.signupForm.reset();
        this.detectChange.detectChanges();
      },
      error: (error) => {
        this.loading = false;
        console.log("The error is :", error);
        this.errorHandle.handleError(error, 'registration failed, please try again.');
        this.detectChange.detectChanges();
      }
    })
  }
}
