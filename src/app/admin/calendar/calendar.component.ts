import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import { MatDatepicker } from '@angular/material';
import {Moment} from 'moment';

import {Subscription} from 'rxjs';
import * as moment from 'moment';


import {CalendarService} from '../services/calendar.service';
import {SummtableService} from '../services/summtable.service';


import {concatMap} from 'rxjs/internal/operators/concatMap';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CalendarComponent implements OnInit, OnDestroy, AfterViewInit {

  listener: Subscription;
  holidaysListener: Subscription;
  paramsListener: Subscription;
  selectedDate: any;
  holidayDates = [];
  dateClass;
  m: any;
  canRender = true;
  holidays: any;
  startDate;
  year: any;
  month: any;


  @ViewChild('calendar') calendar: MatDatepicker<Moment>;

  constructor(private router: Router,
              public route: ActivatedRoute,
              public calendarService: CalendarService,
              private sumService: SummtableService,
              private renderer: Renderer2,
              private cd: ChangeDetectorRef
  ) {

  }


  ngOnInit() {
    this.paramsListener = this.route.queryParams.pipe(
      concatMap(param => {
        if (param && Object.entries(param).length !== 0) {
          const year = param.year;
          const monthMinus = param.month - 1;
          this.startDate = new Date(year, monthMinus);
          this.m = moment(this.startDate);
        } else {
          const today = new Date();
          this.m = moment(today);
        }
        return this.route.data;
      })).subscribe((data) => {

      this.holidays = data['data']['holidays'];
      this.holidayDates = [];
      let holidayArr = [];

      for (let h in this.holidays) {
        holidayArr.push(+(moment(h).format('D')));
      };

      this.holidayDates = holidayArr;

      this.calendarService.hightlightDate(this.holidayDates);
      this.cd.detectChanges();
    });
  }


  ngAfterViewInit() {

    // Find arrow buttons in the calendar
    let prevBtn = document.getElementsByClassName('mat-calendar-previous-button mat-icon-button')[0];
    let nextBtn = document.getElementsByClassName('mat-calendar-next-button mat-icon-button')[0];

    if (prevBtn && nextBtn) {
      this.renderer.listen(prevBtn, "click", (event) => {
        this.m.subtract(1, 'month').format('YYYY-MM');
        this.year = moment(this.m._d).format('YYYY');
        this.month = moment(this.m._d).format('M');

        this.router.navigate([], {relativeTo: this.route, queryParams: {year: this.year, month: this.month}});
        this.cd.markForCheck();
      });

      this.renderer.listen(nextBtn, 'click', () => {
        this.m.add(1, 'month').format('YYYY-MM');
        this.year = moment(this.m._d).format('YYYY');
        this.month = moment(this.m._d).format('M');

        this.router.navigate([], {relativeTo: this.route, queryParams: {year: this.year, month: this.month}});
      });
    }

  }


  ngOnDestroy(): void {
    if (this.holidaysListener) {
      this.holidaysListener.unsubscribe();
    }

    if (this.listener) {
      this.listener.unsubscribe();
    }

    if (this.paramsListener) {
      this.paramsListener.unsubscribe();
    }
  }


  onSelect(event) {
    //console.log(event);
    const year = (moment(event).format('YYYY'));
    const month = (moment(event).format('M'));
    const day = (moment(event).format('DD'));
    this.selectedDate = event;
    this.router.navigate([year, month], {relativeTo: this.route, fragment: day});
  }

  monthSelected(date) {
    console.log('MONTH', date);
  }

  chosenYearHandler(event) {
    console.log('year', event);
  }


}
