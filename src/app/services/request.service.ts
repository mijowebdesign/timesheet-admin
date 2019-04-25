import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorage } from '../auth/token.storage';
import { of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {environment} from '../../environments/environment.prod';

@Injectable()
export class RequestService {

  tokenStorage: TokenStorage;

  constructor(protected http: HttpClient) {
    this.tokenStorage = new TokenStorage();
  }

  getHostUrl(url) {
    return `${environment.host_url}${url}`;
  }


  getApiUrl(url) {
    return `${environment.api_url}${url}`;
  }

  create(url, resource, token = true) {
    return this.sendRequest('PUT', url, resource, token);
  }

  getAll(url, token = true) {
    return this.sendRequest('GET', url, {}, token);
  }

  get(url, id, token = true) {
    return this.sendRequest('GET', url + '/' + id, {}, token);
  }

  update(url, resource, token = true) {
    return this.sendRequest('PATCH', url, resource, token);
  }

  delete(url, id, token = true) {
    return this.sendRequest('DELETE', url + '/' + id, {}, token);
  }

  sendRequest(method, url, data, token = true) {
    const options = { params: {}, headers: {} };

    if (method === 'GET' || method === 'DELETE') {
      options.params = data;
    }
    if (token) {
      options.headers = new HttpHeaders({ Authorization: this.tokenStorage.getToken() });
    }

    if (method === 'GET') {
      return this.http.get(this.getApiUrl(url), options)
        .pipe(
          catchError(err => { this.handleError(err); return of([]); })
        );
    }

    if (method === 'PUT') {
      return this.http.put(this.getApiUrl(url), data, options)
        .pipe(
          catchError(err => { this.handleError(err); return of([]); })
        );
    }

    if (method === 'POST') {
      return this.http.post(this.getApiUrl(url), data, options)
        .pipe(
          catchError(err => { this.handleError(err); return of([]); })
        );
    }

    if (method === 'PATCH') {
      return this.http.patch(this.getApiUrl(url), data, options)
        .pipe(
          catchError(err => { this.handleError(err); return of([]); })
        );
    }

    if (method === 'DELETE') {
      return this.http.delete(this.getApiUrl(url), options)
        .pipe(
          catchError(err => { this.handleError(err); return of([]); })
        );
    }
  }

  protected handleError(error) {
    switch (error.status) {
      case 404:
        return throwError(error); // Should be instance of Not found error
      case 400:
        return throwError(error); // Should be instance of Bad input error
      default:
        break;
    }
    return throwError(error);
  }
}
