import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  private apiUrl = environment.apiUrl + '/auth/';

  constructor(private httpClient: HttpClient) { }

  passwordMatchValidator(passwordControlName: string): ValidatorFn {
    return (confirmControl: AbstractControl): ValidationErrors | null => {
      if (!confirmControl.parent) return null;

      const password = confirmControl.parent.get(passwordControlName)?.value;
      const confirmPassword = confirmControl.value;

      return password === confirmPassword ? null : { passwordMismatch: true }
    }
  }

  signup(signupData: any) {
    return this.httpClient.post(this.apiUrl + 'signup', signupData);
  }

  verifyEmail(token: string) {
    return this.httpClient.get(this.apiUrl + 'verify-email?token=' + token);
  }
}
