import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {CalendarService} from '../services/calendar.service';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class DashboardResolverService implements Resolve<any> {


  calendarDate: any;

  constructor(private calendarService: CalendarService) {
  }


  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {

    const a = route.queryParams;

    if (Object.entries(a).length !== 0) {
      const year = a.year;
      const month = a.month;
      this.calendarDate = {year: year, month: month};
      return this.calendarService.getHolidays(year, month);
    } else {
      const m = moment();
      const year = moment().format('YYYY');
      const month = moment().format('M');
      return this.calendarService.getHolidays(year, month);
    }
  }

}


