import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  private apiUrl = environment.apiUrl + '/auth';

  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  passwordMatchValidator(passwordControlName: string): ValidatorFn {
    return (confirmControl: AbstractControl): ValidationErrors | null => {
      if (!confirmControl.parent) return null;

      const password = confirmControl.parent.get(passwordControlName)?.value;
      const confirmPassword = confirmControl.value;

      return password === confirmPassword ? null : { passwordMismatch: true }
    }
  }

  signup(signupData: any) {
    return this.httpClient.post(this.apiUrl + '/signup', signupData);
  }

  verifyEmail(token: string) {
    return this.httpClient.get(this.apiUrl + '/verify-email?token=' + token);
  }

  login(loginData: any) {
    return this.httpClient.post(this.apiUrl + '/login', loginData)
      .pipe(
        tap(response => this.handleAuthSuccess(response))
      );
  }

  handleAuthSuccess(authData: any) {
    if (authData?.token) {
      localStorage.setItem('token', authData.token);
    }
  }

  setCurrentUser(user: any | null) {
    this.currentUserSubject.next(user)
  }

  getCurrentUser() {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'ADMIN'
  }

  redirectBasedOnRole() {
    const targetUrl = this.isAdmin() ? '/admin' : '/home';
    this.router.navigate([targetUrl]);
  }

  resendVerificationEmail(email: string) {
    return this.httpClient.post(this.apiUrl + '/resend-verification', { email });
  }
}
