import { Injectable } from '@angular/core';

import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import {Subject} from 'rxjs';

import {TokenStorage} from '../../auth/token.storage';
import {RequestService} from '../../services/request.service';




@Injectable({
  providedIn: 'root'
})
export class SummtableService {

  tokenStorage: TokenStorage;
  yearMonthParams = new Subject();


  constructor(private httpClient: HttpClient,
              private requestService: RequestService) {
              this.tokenStorage = new TokenStorage();
  }

  getAllData(data) {
    const url = this.requestService.getHostUrl(`/api/projects-all-users/timesheets`);
    const header =  new HttpHeaders().set('Authorization', this.tokenStorage.getToken());
    const params = new HttpParams()
      .set('year', data.year)
      .set('month', data.month);

    return this.httpClient.get(url, {
      headers: header,
      params: params
    });
  }

  getHolidays(year, month) {
    const url = this.requestService.getHostUrl(`/api/holidays`);
    const header =  new HttpHeaders().set('Authorization', this.tokenStorage.getToken());
    const params = new HttpParams()
      .set('year', year)
      .set('month', month);

    return this.httpClient.get(url, {
      headers: header,
      params: params
    });
  }


}
