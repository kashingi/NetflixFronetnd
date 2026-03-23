import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Watchlist {

  private apiUrl = environment.apiUrl + '/watchlist';

  constructor(private httpClient: HttpClient) { }

  watchList(page: number = 0, size: number = 10, search: string) {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (search) {
      params = params.set('search', search);
    }

    return this.httpClient.get(this.apiUrl + '/getWatchlist', { params });
  }

  addtoWatchlist(videoId: number | string) {
    return this.httpClient.post(this.apiUrl + '/addToWatchlist/' + videoId, {});
  }

  removeFromWatchlist(videoId: number | string) {
    return this.httpClient.delete(this.apiUrl + '/removeFromWatchlist/' + videoId);
  }
}
