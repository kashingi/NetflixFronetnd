import { Injectable } from '@angular/core';
import { Notification } from './notification';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandler {

  constructor(private notification: Notification) { }

  handleError(error: any, fallbackMessage: string) {
    const errorMsg = error.error?.error || fallbackMessage;
    this.notification.error(errorMsg);
    console.error('API error', error);
  }
}
