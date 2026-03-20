import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../Shared/services/user';
import { Notification } from '../../../Shared/services/notification';
import { ErrorHandler } from '../../../Shared/services/error-handler';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-manage-user',
  standalone: false,
  templateUrl: './manage-user.html',
  styleUrl: './manage-user.scss',
})
export class ManageUser {

  userForm!: FormGroup;
  creating = false;
  hidePaswword = true;
  iseditMode: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: User,
    private notification: Notification,
    private errorHandler: ErrorHandler,
    public dialogRef: MatDialogRef<ManageUser>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.iseditMode = data.mode === 'edit';

    this.userForm = formBuilder.group({
      fullName: [data.user?.fullName || '', Validators.required],
      email: [data.user?.email || '', [Validators.required, Validators.email]],
      password: ['', this.iseditMode ? [] : [Validators.required, Validators.minLength(6)]],
      role: [data.user?.role || 'USER', Validators.required]
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    this.creating = true;
    const formData = this.userForm.value;

    const data = {
      email: formData.email?.trim().toLowerCase(),
      password: formData.password,
      fullName: formData.fullName,
      role: formData.role
    }

    const op$ = this.iseditMode 
    ? this.userService.updateUser(this.data.user.id, data)
    : this.userService.createUser(data);

    op$.subscribe({
      next: (response: any) => {
        this.creating = false;
        this.notification.success(response?.message);
        this.dialogRef.close();
      },
      error: (err) => {
        this.creating = false;
        this.errorHandler.handleError(err, 'Failed to save user');
      }
    })
  }
}
