import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChangePassword } from '../components/change-password/change-password';
import { DIALOG_CONFIG } from '../constants/app.constants';
import { Observable } from 'rxjs';
import { Confirm } from '../components/confirm/confirm';

@Injectable({
  providedIn: 'root',
})
export class Dialog {

  constructor(
    private dialog: MatDialog
  ) { }

  openChangePasswordDialog(): MatDialogRef<ChangePassword> {
    return this.dialog.open(ChangePassword, DIALOG_CONFIG.CHANGE_PASSWORD);
  }

  openConfirmation(
    title: string,
    message: string,
    confirmText: 'Confirm',
    cancelText: 'Cancle',
    type: 'warning' | 'danger' | 'infor-warning'
  ): Observable<boolean> {
    const dialogRef = this.dialog.open(Confirm, {
      ...DIALOG_CONFIG.CONFIRM,
      data: {
        title,
        message,
        confirmText,
        cancelText,
        type
      }
    });

    return dialogRef.afterClosed();
  }
}
