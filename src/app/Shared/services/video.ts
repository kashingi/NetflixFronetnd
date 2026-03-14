import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Video {

  private apiUrl = environment.apiUrl + '/videos';
  private apiUrlAdmin = environment.apiUrl + '/videos/admin';

  constructor(
    private httpClient: HttpClient
  ) { }

  getAllAdminVideos(page: number, size: number, search?: string) {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (search) {
      params = params.set('search', search);
    }

    return this.httpClient.get(this.apiUrlAdmin + '/getVideos', { params })
  }

  createVideoByAdmin(data: any) {
    return this.httpClient.post(this.apiUrlAdmin, data);
  }

  updateVideoByAdmin(id: string | number, data: any) {
    return this.httpClient.put(this.apiUrlAdmin + '/updateVideo/' + id, data);
  }

  deleteVideoByAdmin(id: string | number) {
    return this.httpClient.delete(this.apiUrlAdmin + '/deleteById/' + id);
  }

  setPublishedByAdmin(id: string | null, publishd: boolean) {
    return this.httpClient.patch(this.apiUrlAdmin + '/' + id + '/changeStatus?value=' + publishd, {});
  }

  getStatsByAdmin() {
    return this.httpClient.get(this.apiUrlAdmin + '/stats');
  }

  getPublishedVideosPaginated(page: number = 0, size: number = 10, search?: string) {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (search) {
      params = params.set('search', search);
    }

    return this.httpClient.get(this.apiUrl + '/getPublished', { params })
  }

  getfeaturedVideos() {
    return this.httpClient.get(this.apiUrl + '/featured');
  }
}
