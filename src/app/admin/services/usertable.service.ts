import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';


import * as moment from 'moment';
import {RequestService} from '../../services/request.service';
import {TokenStorage} from '../../auth/token.storage';

@Injectable({
  providedIn: 'root'
})
export class UsertableService {

  tokenStorage: TokenStorage;

  constructor(private httpClient: HttpClient,
              public requestService: RequestService
              ) {
    this.tokenStorage = new TokenStorage();
  }

  getDataForId(data) {

    const month = moment(data.month).format('MM');
    const maxDateInMonth = moment((data.year +"-"+ month), "YYYY-MM").daysInMonth()
    const startDate = data.year +"-"+ month + '-01';
    const endDate = data.year +"-"+ month +"-"+maxDateInMonth;

    const url = this.requestService.getHostUrl(`/api/user/timesheet/${data.id}`);
    const header = new HttpHeaders().set('Authorization', this.tokenStorage.getToken());
    const params = new HttpParams()
      .set('start', startDate)
      .set('end', endDate);

    return this.httpClient.get(url, {
      headers: header,
      params: params
    })

  }

  getFreedays(id, year, month){
    const url = this.requestService.getHostUrl(`/api/freedays/${id}`);
    const header = new HttpHeaders().set('Authorization', this.tokenStorage.getToken());
    const params = new HttpParams()
      .set('year', year)
      .set('month', month);

    return this.httpClient.get(url, {
      headers: header,
      params: params
    })
  }

  getSickDays(id, year, month){
    const url = this.requestService.getHostUrl(`/api/sick-leave/${id}`);
    const header = new HttpHeaders().set('Authorization', this.tokenStorage.getToken());
    const params = new HttpParams()
      .set('year', year)
      .set('month', month);

    return this.httpClient.get(url, {
      headers: header,
      params: params
    });
  }


  getOutOfOffice(id, year, month){
    const url = this.requestService.getHostUrl(`/api/outofoffice/${id}`);
    const header = new HttpHeaders().set('Authorization', this.tokenStorage.getToken());
    const params = new HttpParams()
      .set('year', year)
      .set('month', month);

    return this.httpClient.get(url, {
      headers: header,
      params: params
    });
  }
}
