import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {Subscription} from 'rxjs';
import * as moment from 'moment';

import {UsertableService} from '../../services/usertable.service';
import {DashboardService} from '../../services/dashboard.service';
import {SummtableService} from '../../services/summtable.service';



@Component({
  selector: 'app-usertable',
  templateUrl: './usertable.component.html',
  styleUrls: ['./usertable.component.scss']
})
export class UsertableComponent implements OnInit, OnDestroy {

  userDataSource = [];
  displayedColumn = [];
  userProjects = [];



  tableMonthDisplay: any;
  currentYear: string;
  currentMonth: string;
  userId;
  userName: string;
  freedaysArr = [];
  holidayArr = [];
  userHolidayArr = [];
  sickDaysArr = [];
  outOfOfficeArr = [];

  listener: Subscription;
  serviceListener: Subscription;
  userListener: Subscription;
  listenerFreeDays: Subscription;
  listenerHolidays: Subscription;

  constructor(private route: ActivatedRoute,
              private userService: UsertableService,
              private dashboardService: DashboardService,
              private router: Router,
              private sumtableService: SummtableService

  ) { }

  ngOnInit() {

    this.userListener = this.dashboardService.username$.subscribe(
      (name: string) => {
        this.userName = name;
      }
    );

    this.listener = this.route.params.subscribe(
      (param) => {
        this.tableMonthDisplay = moment(param.month, 'MM').format('MMMM');
        this.currentYear = param.year;
        this.currentMonth = param.month;
        this.userId = param.id;


        //console.log('PARAM', param);

        this.serviceListener = this.userService.getDataForId(param).subscribe(
          (res) => {
            //console.log('RES', res);
            const user = this.dashboardService.writeUserTable(res, param);
            this.userProjects = user.userProjects;
            this.userDataSource = user.userDataSource;
            this.freedaysArr = user.freeDaysArr;
            this.userHolidayArr = user.holidayArr;
            this.sickDaysArr = user.sickDaysArr;
            this.outOfOfficeArr = user.outOfOfficeArr;
            //console.log('user sickDays', this.sickDaysArr);

          }
        );
      }
    );
  }

  onPreviousMonth(){
   let m = +this.currentMonth - 1;
   if ( m < 1) {
     m = 12;
     const y = +this.currentYear - 1;
     this.currentYear = y.toString();
   }
    this.currentMonth = m.toString();
    this.router.navigate([this.userId, this.currentYear, this.currentMonth], {relativeTo: (this.route.parent)});
  }

  onNextMonth(){
    let m = +this.currentMonth + 1;
    if ( m > 12) {
      m = 1;
      const y = +this.currentYear + 1;
      this.currentYear = y.toString();
    }
    this.currentMonth = m.toString();
    this.router.navigate([this.userId, this.currentYear, this.currentMonth], {relativeTo: (this.route.parent)});
  }

  getTotalTime(project){
    return this.dashboardService.getTotalTimeUser(project);
  }

  onAllUsers(){
    this.router.navigate([this.currentYear, this.currentMonth], {relativeTo: (this.route.parent)});
  }


  // prebaci u jednu funkciju

  holiday(date) {
    let p = false;
    for (let m of this.userHolidayArr) {
      if (date == m){
        p = true;
      }
    }
    return p;

  }

  freeDays(date){
    let p = false;
    for (let s of this.freedaysArr) {
      if (date == s){
        p = true;
      }
    }
    return p;
  }

  sickDays(date){
    let p = false;
    for (let s of this.sickDaysArr) {
      if (date == s){
        p = true;
      }
    }
    return p;
  }

  outOfOfficeDays(date){
    let p = false;
    for (let s of this.outOfOfficeArr) {
      if (date == s){
        p = true;
      }
    }
    return p;
  }

  ngOnDestroy(): void {
    if (this.listener) {
      this.listener.unsubscribe();
    }
    if (this.serviceListener) {
      this.serviceListener.unsubscribe();
    }
    if (this.userListener) {
      this.userListener.unsubscribe();
    }
    if (this.listenerFreeDays ){
      this.listenerFreeDays.unsubscribe();
    }
    if (this.listenerHolidays ){
      this.listenerHolidays.unsubscribe();
    }


  }


}
