import { Injectable } from '@angular/core';
import {TokenStorage} from './token.storage';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class LoggedUserService {
  loggedIn = false;

  tokenStorage: TokenStorage;
  token: string;

  id: string;
  username: string;
  firstName: string;
  lastName: string;

  constructor(private http: HttpClient) {
    this.tokenStorage = new TokenStorage();
    this.token = this.tokenStorage.getToken();
  }

  getHostUrl(url) {
    return `${environment.host_url}${url}`;
  }

  attemptAuth(username: string, password: string): Observable<any> {
    const credentials = { username, password };
    return this.http.post(this.getHostUrl('/user/login'), credentials);
  }

  isAuthenticated() {
    const promise = new Promise(
      (resolve) => {
        resolve(this.tokenStorage.getToken() !== null);
      }
    );
    return promise;
  }

  logout() {
    this.tokenStorage.signOut();
    this.loggedIn = false;
  }

  login(response) {
    if (response.token) {
      this.tokenStorage.saveToken(response.token);
    }
    if (response.id) {
      this.id = response.id;
    }
    if (response.username) {
      this.username = response.username;
    }
    if (response.first_name) {
      this.firstName = response.first_name;
    }
    if (response.last_name) {
      this.lastName = response.last_name;
    }
  }

  checkUser() {
    const header = { headers: new HttpHeaders({ Authorization: this.token }) };
    return this.http.get(this.getHostUrl('/user/login'), header);
  }

}
