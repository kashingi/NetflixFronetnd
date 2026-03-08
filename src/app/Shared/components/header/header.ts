import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { filter, Subscription } from 'rxjs';
import { Auth } from '../../services/auth';
import { Dialog } from '../../services/dialog';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit, OnDestroy {

  @Input() showRouterOutlet: boolean = true;
  currentUser: any = null;
  isAdminMode: boolean = false;
  private routerSubscription: Subscription | null = null;

  constructor(
    private authService: Auth,
    private dialogService: Dialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.updateMode();

    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateMode();
      }
      );
    console.log("The current user role is : ", this.isAdmin())
  }

  private updateMode(): void {
    this.isAdminMode = this.router.url.startsWith('/admin');
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'ADMIN';
  }

  switchMode(): void {
    if (this.isAdminMode) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/admin']);
    }
  }

  openChangePassword() {
    this.dialogService.openChangePasswordDialog();
  }

  logout() {
    this.dialogService.openConfirmation(
      'Logout',
      'Are you sure you want to logout from your account ?',
      'Confirm',
      'Cancle',
      'warning',
    ).subscribe((result => {
      if (result) {
        this.authService.logout();
      }
    }))
  }
}
