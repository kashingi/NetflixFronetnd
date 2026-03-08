import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Auth } from '../../services/auth';
import { Notification } from '../../services/notification';
import { ErrorHandler } from '../../services/error-handler';

@Component({
  selector: 'app-change-password',
  standalone: false,
  templateUrl: './change-password.html',
  styleUrl: './change-password.scss',
})
export class ChangePassword {

  changePasswordForm!: FormGroup;
  loading = false;

  hideCurrent = true;
  hideNew = true;
  hideConfirm = true;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ChangePassword>,
    private authService: Auth,
    private notification: Notification,
    private errorHandle: ErrorHandler,
    private detectChange: ChangeDetectorRef
  ) {
    this.changePasswordForm = formBuilder.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, authService.passwordMatchValidator('newPassword')]]
    })
  }

  submit() {
    this.loading = true;
    const formData = this.changePasswordForm.value;
    const data = {
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword
    };

    this.authService.changePassword(data).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.notification.success(response.message || 'Password changed successfully.');
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.loading = false;
        this.errorHandle.handleError(err, 'Failed to change password, please try again');
        this.detectChange.detectChanges();
      }
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
