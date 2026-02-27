import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class Notification {
  

  constructor(private snackBar: MatSnackBar){}

  success(message: string, duration: number = 4000) {
    this.snackBar.open(message, 'close', {
      duration: duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['nodification-success']
    });
  }

  error(message: string, duration: number = 4000) {
    this.snackBar.open(message, 'close', {
      duration: duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['nodification-error']
    });
  }
}
