import { Component, HostListener, OnInit } from '@angular/core';
import { Dialog } from '../../Shared/services/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Video } from '../../Shared/services/video';
import { Utility } from '../../Shared/services/utility';
import { Media } from '../../Shared/services/media';
import { ErrorHandler } from '../../Shared/services/error-handler';
import { Notification } from '../../Shared/services/notification';

@Component({
  selector: 'app-video-list',
  standalone: false,
  templateUrl: './video-list.html',
  styleUrl: './video-list.scss',
})
export class VideoList implements OnInit {

  pagedVideos: any = [];
  loading = false;
  loadingMore = false;
  searchQuery = '';

  pageSize = 10;
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  hasMoreVideos = true;

  totalVideos = 0;
  publishedVideos = 0;
  totalDurationSeconds = 0;

  data = new MatTableDataSource<any>([]);

  constructor(
    private dialogService: Dialog,
    private videoService: Video,
    public utilityService: Utility,
    public mediaService: Media,
    private errorHandler: ErrorHandler,
    private notification: Notification
  ) { }

  ngOnInit(): void {
    this.load();
    this.loadStats();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const scrollPosition = window.pageXOffset + window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;

    if (scrollPosition >= pageHeight - 200 && !this.loadingMore && !this.loading && this.hasMoreVideos) {
      this.loadMoreVideos();
    }
  }

  load() {
    this.loading = true;
    this.currentPage = 0;
    this.pagedVideos = [];
    const search = this.searchQuery.trim() || undefined;

    this.videoService.getAllAdminVideos(this.currentPage, this.pageSize, search).subscribe({
      next: (response: any) => {
        this.pagedVideos = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.currentPage = response.number;
        this.hasMoreVideos = this.currentPage < this.totalPages - 1;
        this.data.data = this.pagedVideos;
        this.loading = false;
      },
      error: (err) => {
        this.loadingMore = false;
        this.errorHandler.handleError(err, 'Failed to load more videos');
      }
    });
  }

  loadMoreVideos() {
    if (this.loadingMore || !this.hasMoreVideos) return;

    this.loadingMore = true;
    const nextPage = this.currentPage + 1;
    const search = this.searchQuery.trim() || undefined;

    this.videoService.getAllAdminVideos(nextPage, this.pageSize, search).subscribe({
      next: (response: any) => {
        this.pagedVideos = [...this.pagedVideos, ...response.content];
        this.currentPage = response.number;
        this.hasMoreVideos = this.currentPage < this.totalPages - 1;
        this.loadingMore = false;
      },
      error: (err) => {
        this.loadingMore = false;
        this.errorHandler.handleError(err, 'Failed to load more videos.');
      }
    });
  }

  loadStats() {
    this.videoService.getStatsByAdmin().subscribe((stats: any) => {
      this.totalVideos = stats.totalVideos;
      this.publishedVideos = stats.publishedVideos;
      this.totalDurationSeconds = stats.totalDuration;
    });
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.currentPage = 0;
    this.load();
  }

  clearSearch() {
    this.searchQuery = '';
    this.currentPage = 0;
    this.load();
  }

  play(video: any) {
    this.dialogService.openVideoPlayer(video);
  }

  createNew() {
    const dialogRef = this.dialogService.openVideoFormDialog('create');
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.load();
        this.loadStats();
      }
    })
  }

  edit(video: any) {
    const dialogRef = this.dialogService.openVideoFormDialog('edit', video);
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.load();
        this.loadStats();
      }
    })
  }

  remove(video: any) {
    this.dialogService.openConfirmation(
      'Delete Video ?',
      `Are you sure you want to delete "${video.title}" ? This action cannot be undone,`,
      'Confirm',
      'Cancel',
      'danger'
    ).subscribe(response => {
      if (response) {
        this.loading = false;
        this.videoService.deleteVideoByAdmin(video.id).subscribe({
          next: () => {
            this.notification.success('Video deleted successfully.');
            this.load();
            this.loadStats();
          },
          error: (err) => {
            this.loading = false;
            this.errorHandler.handleError(err, 'Failed to delete video, please try again.');
          }
        });
      }
    });
  }

  togglePublish(event: any, video: any) {
    const newPublishedState = event.checked;

    this.videoService.setPublishedByAdmin(video.id, newPublishedState).subscribe({
      next: (response) => {
        video.published = newPublishedState;
        this.notification.success(`Video ${video.published ? ' published' : ' unpublished'} successfully.`);
        this.loadStats();
      },
      error: (err) => {
        video.published = !newPublishedState;
        this.errorHandler.handleError(err, 'Failed to update published status, please try again');
      }
    });
  }

  getPublishedCount(): number {
    return this.publishedVideos;
  }

  getTotalduration(): string {
    const total = this.totalDurationSeconds;
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    if (hours) {
      return `${hours}hr ${minutes}min`;
    }

    return `${minutes} min`;
  }

  formatDuration(seconds: number): string {
    return this.utilityService.formatDuration(seconds);
  }

  getPosterUrl(video: any) {
    return this.mediaService.getMediaUrl(video.poster, 'image', {
      useCache: true
    });
  }
}
