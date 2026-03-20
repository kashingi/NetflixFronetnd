import { Component, HostListener, OnInit } from '@angular/core';
import { User } from '../../Shared/services/user';
import { Auth } from '../../Shared/services/auth';
import { Dialog } from '../../Shared/services/dialog';
import { Notification } from '../../Shared/services/notification';
import { ErrorHandler } from '../../Shared/services/error-handler';

@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList implements OnInit {

  paginatedUsers: any = [];
  loading = true;
  loadingMore = false;
  error = false;
  currentUserEmail: string | null = null;
  searchQuery: string = '';

  pageSize = 5;
  currentPage = 0;
  totalPages = 0;
  totalUsers = 0;
  hasMoreUsers = true;

  constructor(
    private userService: User,
    private authService: Auth,
    private errorHandler: ErrorHandler,
    private dialogService: Dialog,
    private notification: Notification
  ) { }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    this.currentUserEmail = currentUser?.email || null;

    this.loadUsers()
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const scrollPosition = window.pageYOffset + window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;

    if (scrollPosition >= pageHeight - 200 && !this.loadingMore && !this.loading && this.hasMoreUsers) {
      this.loadMoreUsers();
    }
  }

  loadUsers() {
    this.loading = true;
    this.error = false;
    this.currentPage = 0;
    this.paginatedUsers = [];
    const search = this.searchQuery.trim() || undefined;

    this.userService.getAllUsers(this.currentPage, this.pageSize, search).subscribe({
      next: (response: any) => {
        this.paginatedUsers = response.content;
        this.totalUsers = response.totalElements;
        this.totalPages = response.totalPages;
        this.currentPage = response.number;
        this.hasMoreUsers = this.currentPage < this.totalPages - 1;
        this.loading = false;
      },
      error: (err) => {
        this.error = true;
        this.loading = false;
        this.errorHandler.handleError(err, 'Failed to load users.');
      }
    });
  }

  loadMoreUsers() {
    if (this.loadingMore || !this.hasMoreUsers) return;

    this.loadingMore = true;
    const nextPage = this.currentPage + 1;
    const search = this.searchQuery.trim() || undefined;

    this.userService.getAllUsers(nextPage, this.pageSize, search).subscribe({
      next: (response: any) => {
        this.paginatedUsers = [...this.paginatedUsers, ...response.content];
        this.currentPage = response.number;
        this.hasMoreUsers = this.currentPage < this.totalPages - 1;
        this.loadingMore = false;
      },
      error: (err) => {
        this.loadingMore = false;
        this.errorHandler.handleError(err, 'Failed to load more users.');
      }
    });
  }

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.currentPage = 0;
    this.loadUsers();
  }

  clearSearch() {
    this.searchQuery = '';
    this.currentPage = 0;
    this.loadUsers();
  }

  createUser() {
    const dialogref = this.dialogService.openManageUserDialog('create');
    dialogref.afterClosed().subscribe((response) => {
      if (response) {
        this.loadUsers();
      }
    });
  }

  editUser(user: any) {
    const dialogref = this.dialogService.openManageUserDialog('edit', user);
    dialogref.afterClosed().subscribe((response) => {
      if (response) {
        this.loadUsers();
      }
    });
  }

  isCurrentUser(user: any): boolean {
    return user.email === this.currentUserEmail;
  }

  toggleUserStatus(user: any): void {
    this.userService.toggleUserStatus(user.id).subscribe({
      next: (response: any) => {
        this.notification.success(response.message);
        this.loadUsers();
      },
      error: (err) => {
        this.errorHandler.handleError(err, 'Failed to updated user status.');
      }
    });
  }

  deleteUser(user: any) {
    this.dialogService.openConfirmation(
      'Delete User ?',
      `Are you sure you want to delete "${user.fullName} "? This action cannot be undone`,
      'Confirm',
      'Cancel',
      'danger'
    ).subscribe(response => {
      if (response) {
        this.userService.deleteUser(user.id).subscribe({
          next: (response: any) => {
            this.notification.success(response?.message);
            this.loadUsers();
          },
          error: (err) => {
            this.errorHandler.handleError(err, 'Failed to delete user.');
          }
        });
      }
    });
  }

  changeUserRole(user: any) {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';

    this.dialogService.openConfirmation(
      'Change User Role ?',
      `Are you sure you want to change ${user.fullName}'s role to ${newRole}`,
      'Confirm',
      'Cancel',
      'warning'
    ).subscribe(response => {
      if (response) {
        this.userService.changeUserRole(user.id, newRole).subscribe({
          next: (response: any) => {
            this.notification.success(response?.message);
          },
          error: (err) => {
            this.errorHandler.handleError(err, 'Failed to change user role.');
          }
        });
        this.loadUsers();
      }
    });
  }

  getRoleBadgeClass(role: string): string {
    return role === 'ADMIN' ? 'role-badge admin' : 'role-badge user';
  }

  getStatusBadgeClass(active: boolean): string {
    return active ? 'status-badge active' : 'status-badge inactive';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('eng-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
}
