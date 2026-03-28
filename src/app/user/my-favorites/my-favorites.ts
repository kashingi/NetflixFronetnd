import { Component, HostListener } from '@angular/core';
import { Watchlist } from '../../Shared/services/watchlist';
import { Utility } from '../../Shared/services/utility';
import { Media } from '../../Shared/services/media';
import { Dialog } from '../../Shared/services/dialog';
import { ErrorHandler } from '../../Shared/services/error-handler';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { Notification } from '../../Shared/services/notification';

@Component({
  selector: 'app-my-favorites',
  standalone: false,
  templateUrl: './my-favorites.html',
  styleUrl: './my-favorites.scss',
})
export class MyFavorites {

  allVideos: any = [];
  filteredVideos: any = [];
  loading = true;
  loadingMore = false;
  error = false;
  searchQuery: string = '';

  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  hasMoreVideos = true;

  private searchSubject = new Subject<string>();

  constructor(
    private watchlistService: Watchlist,
    private notification: Notification,
    public utilityService: Utility,
    public mediaService: Media,
    private dialogService: Dialog,
    private errorHandler: ErrorHandler

  ) { }

  ngOnInit(): void {
    this.loadVideos();
    this.initializeSearchDebounce();
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  initializeSearchDebounce() {
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(() => {
      this.performSearch()
    });
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const scrollPosition = window.pageYOffset + window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;

    if (scrollPosition >= pageHeight - 200 && !this.loadingMore && !this.loading && this.hasMoreVideos) {
      this.loadMoreVideos();
    }
  }

  loadVideos(page: number = 0) {
    this.error = false;
    this.currentPage = 0;
    this.allVideos = [];
    const search = this.searchQuery.trim() || '';
    this.loading = true;

    this.watchlistService.watchList(page, this.pageSize, search).subscribe({
      next: (response: any) => {
        this.allVideos = response.content;
        this.filteredVideos = response.content;
        this.currentPage = response.number;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.hasMoreVideos = this.currentPage < this.totalPages - 1;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading videos', err);
        this.error = true;
        this.loading = false;
      }
    })
  }

  loadMoreVideos() {
    if (this.loadingMore || !this.hasMoreVideos) return;
    this.loadingMore = true;
    const nextPage = this.currentPage + 1;
    const search = this.searchQuery.trim() || '';

    this.watchlistService.watchList(nextPage, this.pageSize, search).subscribe({
      next: (response: any) => {
        this.allVideos = [...this.allVideos, ...response.content];
        this.filteredVideos = [...this.filteredVideos, ...response.content];
        this.currentPage = response.number;
        this.hasMoreVideos = this.currentPage < this.totalPages - 1;
        this.loadingMore = false;
      },
      error: (err) => {
        this.notification.error('Failed to load more viddeos');
        this.loadingMore = false;
      }
    });
  }

  onSearch() {
    this.searchSubject.next(this.searchQuery);
  }

  private performSearch() {
    this.currentPage = 0;
    this.loadVideos();
  }

  clearSearch() {
    this.searchQuery = '';
    this.currentPage = 0;
    this.loadVideos();
  }

  toggleWatchlist(video: any, event?: any) {
    if (event) {
      event.stopPropagation();
    }

    const videoId = video.id;

    this.watchlistService.removeFromWatchlist(videoId).subscribe({
      next: () => {
        this.allVideos = this.allVideos.filter((v: any) => v.id !== videoId);
        this.filteredVideos = this.filteredVideos.filter((v: any) => v.id !== videoId);
        this.notification.success('Video removed from watchlist');
      },
      error: (err) => {
        this.errorHandler.handleError(err, 'Failed to remove video from My Favorites. Please try again.');
      }
    });
  }

  getPosterUrl(video: any) {
    return this.mediaService.getMediaUrl(video, 'image', {
      useCache: true
    }) || '';
  }

  playVideo(video: any) {
    this.dialogService.openVideoPlayer(video);
  }

  formatDuration(seconds: number | undefined): string {
    return this.utilityService.formatDuration(seconds);
  }
}
