import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChangePassword } from '../components/change-password/change-password';
import { DIALOG_CONFIG } from '../constants/app.constants';
import { Observable } from 'rxjs';
import { Confirm } from '../components/confirm/confirm';
import { ManageVideo } from '../../admin/dialog/manage-video/manage-video';
import { VideoPlayer } from '../components/video-player/video-player';
import { ManageUser } from '../../admin/dialog/manage-user/manage-user';

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
    cancelText: 'Cancel',
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

  openVideoFormDialog(mode: 'create' | 'edit', video?: any): MatDialogRef<ManageVideo> {
    return this.dialog.open(ManageVideo, {
      ...DIALOG_CONFIG.VIDEO_FROM,
      data: { mode, video }
    });
  }

  openVideoPlayer(video: any): MatDialogRef<VideoPlayer> {
    return this.dialog.open(VideoPlayer, {
      data: video,
      ...DIALOG_CONFIG.VIDEO_PLAYER
    });
  }

  openManageUserDialog(mode: 'create' | 'edit', user?: any): MatDialogRef<ManageUser> {
    return this.dialog.open(ManageUser, {
      ...DIALOG_CONFIG.MANAGE_USER,
      data: { mode, user }
    });
  }
}
