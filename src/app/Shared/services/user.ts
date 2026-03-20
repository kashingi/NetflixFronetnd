import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class User {

  private apiUrl = environment.apiUrl + '/users';

  constructor(private httpClient: HttpClient) { }

  getAllUsers(page: number, size: number, search?: string) {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (search) {
      params = params.set('search', search);
    }

    return this.httpClient.get(this.apiUrl + '/getAllUsers', { params })
  }

  createUser(user: any) {
    return this.httpClient.post(this.apiUrl + '/createUser', user);
  }

  //Missing API
  getUserById(id: number) {
    return this.httpClient.get(this.apiUrl + '/' + id);
  }

  updateUser(id: number, user: any) {
    return this.httpClient.put(this.apiUrl + '/updateUser/' + id, user);
  }

  deleteUser(id: number) {
    return this.httpClient.delete(this.apiUrl + '/deleteUser/' + id);
  }

  toggleUserStatus(id: number) {
    return this.httpClient.put(this.apiUrl + '/' + id + '/toggle-status', {});
  }

  changeUserRole(id: number, role: string) {
    return this.httpClient.put(this.apiUrl + '/' + id + '/change-role', { role });
  }
}
