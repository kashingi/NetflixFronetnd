import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { debounce, debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { Video } from '../../Shared/services/video';
import { Watchlist } from '../../Shared/services/watchlist';
import { Notification } from '../../Shared/services/notification';
import { Utility } from '../../Shared/services/utility';
import { Media } from '../../Shared/services/media';
import { Dialog } from '../../Shared/services/dialog';
import { ErrorHandler } from '../../Shared/services/error-handler';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit, OnDestroy{

  allVideos: any = [];
  filteredVideos: any = [];
  loading = true;
  loadingMore = false;
  error = false;
  searchQuery: string = '';

  featuredVideos: any = [];
  currentSlideIndex = 0;
  featuredLoading = true;

  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  hasMoreVideos = true;

  private searchSubject = new Subject<string>();
  private sliderInterval: any;
  private savedScrollPosition: number = 0;

  constructor(
    private videoService: Video,
    private watchlistService: Watchlist,
    private notification: Notification,
    public utilityService: Utility,
    public mediaService: Media,
    private dialogService: Dialog,
    private errorHandler: ErrorHandler

  ) {}

  ngOnInit(): void {
    this.loadFeaturedVideos();
    this.loadVideos();
    this.initializeSearchDebounce();
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
    this.stopSlider();
  }

  initializeSearchDebounce() {
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(() => {
      this.performSearch()
    });
  }

  loadFeaturedVideos() {
    this.featuredLoading = true;
    this.videoService.getfeaturedVideos().subscribe({
      next: (videos: any) => {
        this.featuredVideos = videos;
        this.featuredLoading = false;
        if (this.featuredVideos.length > 1) {
          this.startSlider();
        }
      },
      error: (err) => {
        this.featuredLoading = false;
        this.errorHandler.handleError(err, 'Error loading featured videos.');
      }
    });
  }

  private startSlider() {
    this.sliderInterval = setInterval(() => {
      this.nextSlide();
    })
  }

  private stopSlider() {
    if (this.sliderInterval) {
      clearInterval(this.sliderInterval);
    }
  }

  nextSlide() {
    if(this.featuredVideos.length > 0) {
      this.currentSlideIndex = (this.currentSlideIndex + 1) % this.featuredVideos.length;
    }
  }

  prevSlide() {
    if(this.featuredVideos.length > 0) {
      this.currentSlideIndex = (this.currentSlideIndex - 1 + this.featuredVideos.length) % this.featuredVideos.length;
    }
  }

  goToSlide(index: number) {
    this.currentSlideIndex = index;
    this.stopSlider();
    if (this.featuredVideos.length > 1) {
      this.startSlider();
    }
  }

  getCurrentFeaturedVideos() {
    return this.featuredVideos[this.currentSlideIndex] || null;
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
    this.featuredVideos = [];
    const search = this.searchQuery.trim() || undefined;
    const isSearching = !!search;
    this.loading =  true;

    this.videoService.getPublishedVideosPaginated(page, this.pageSize, search).subscribe({
      next: (response: any) => {
        this.allVideos = response.content;
        this.filteredVideos = response.content;
        this.currentPage = response.number;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.hasMoreVideos = this.currentPage < this.totalPages -1;
        this.loading = false;

        if (isSearching && this.savedScrollPosition > 0) {
          setTimeout(() => {
            window.scrollTo({
              top: this.savedScrollPosition,
              behavior: 'auto'
            });
            this.savedScrollPosition = 0;
          }, 0);
        }
      },
      error: (err) => {
        console.error('Error loading videos', err);
        this.error = true;
        this.loading = false;
        this.savedScrollPosition = 0;
      }
    })
  }

  loadMoreVideos() {
    if (this.loadingMore || !this.hasMoreVideos) return;

    this.loadingMore = true;
    const nextPage = this.currentPage + 1;
    const search = this.searchQuery.trim() || undefined;

    this.videoService.getPublishedVideosPaginated(nextPage, this.pageSize, search).subscribe({
      next: (response: any) => {
        this.allVideos = [...this.allVideos, ...response.content];
        this.filteredVideos = [...this.filteredVideos, ...response.content];
        this.currentPage = response.number;
        this.hasMoreVideos = this.currentPage < this.totalPages -1;
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
    this.savedScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    this.currentPage = 0;
    this.loadVideos();
  }
  
  clearSearch() {
    this.searchQuery = '';
    this.currentPage = 0;
    this.savedScrollPosition = 0;
    this.loadVideos();
  }

  isInWatchlist(video: any): boolean {
    return video.isInWatchlist === true;
  }

  toggleWatchlist(video: any, event?: any) {
    if (event) {
      event.stopPropagation();
    }

    const videoId = video.id;
    const isInList = this.isInWatchlist(video);

    if (isInList) {
      video.isInWatchlist = false;
      this.watchlistService.removeFromWatchlist(videoId).subscribe({
        next: (response: any) => {
          this.notification.success('Video removed from favorites');
        },
        error: (err) => {
          video.isInWatchlist = true;
          this.errorHandler.handleError(err, 'Failed to remove from my favorites, please try gain.');
        }
      });
    } else {
      video.isInWatchlist = true;
      this.watchlistService.addtoWatchlist(videoId).subscribe({
        next: (response: any) => {
          this.notification.success('Video added from My Favorites');
        },
        error: (err) => {
          video.isInWatchlist = false;
          this.errorHandler.handleError(err, 'Failed to add to My Favorites, please try gain.');
        }
      });
    }
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
