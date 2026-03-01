import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Auth } from '../Shared/services/auth';
import { Notification } from '../Shared/services/notification';

@Component({
  selector: 'app-verify-email',
  standalone: false,
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.scss',
})
export class VerifyEmail implements OnInit {


  loading = true;
  success = false;
  message = '';

  constructor(
    private route: ActivatedRoute,
    private authService: Auth,
    private detectChange: ChangeDetectorRef,
    private notification: Notification
  ) { }

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.loading = false;
      this.success = false;
      this.message = 'Invalid verification link, no token provided.';
      return;
    }

    this.authService.verifyEmail(token).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.success = true;
        this.message = response.message || 'Email verified successfully, you can now login.';
        this.notification.success(this.message);
        this.detectChange.detectChanges();
      },
      error: (erro) => {
        this.loading = false;
        this.success = false;
        this.message = erro.error?.error || 'Verification failed. The link may have expired pr is invalid';
        this.notification.error(this.message);
        this.detectChange.detectChanges();
      }
    });
  }
}
