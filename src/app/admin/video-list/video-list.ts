import { Component } from '@angular/core';
import { Dialog } from '../../Shared/services/dialog';

@Component({
  selector: 'app-video-list',
  standalone: false,
  templateUrl: './video-list.html',
  styleUrl: './video-list.scss',
})
export class VideoList {

  constructor(
    private dialogService: Dialog
  ) { }

  createNew() {
    const dialogRef = this.dialogService.openVideoFormDialog('create');
  }
}
