import { Injectable } from '@angular/core';

import {TokenStorage} from '../../auth/token.storage';

import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {RequestService} from '../../services/request.service';


@Injectable({
  providedIn: 'root'
})

export class CalendarService {

  tokenStorage: TokenStorage;
  //dateClass;

  constructor(private httpClient: HttpClient,
              private requestService:RequestService) {
    this.tokenStorage = new TokenStorage();
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

  hightlightDate(dates) {
/*    this.dateClass = (d: Date) => {
      const date = d.getDate();
      if (dates.length > 0 && dates.find(day => day === date)) {
        return 'example-custom-date-class';
      } else {
        return undefined;
      }
    };*/
  }
}

