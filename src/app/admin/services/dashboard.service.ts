import { Injectable } from '@angular/core';

import {BehaviorSubject} from 'rxjs';

import * as moment from 'moment';
import {SummtableService} from './summtable.service';
import {UsertableService} from './usertable.service';



@Injectable({
  providedIn: 'root'
})

export class DashboardService {

  dataSource = [];
  dataSourceUser =[];
  userNameSubject = new BehaviorSubject<string>('');
  username$ = this.userNameSubject.asObservable();


  constructor( private sumTableService: SummtableService,
               private userService: UsertableService) {
  }


  writeTable(res) {

    //console.log(res)

   const summary = res.summary;
   const users = res.users;
   const next = res.next;
   const prev = res.prev;

   let displayedColumnsByIds = [];
   let userIdNameArr = [];
   const serverDate = [];
   const  allDaysSummary = {};
    let yearFromServer = '';
    let montFromServer = '';
    let allDaysInMonth = [];
    const idHour = [];
    let holidayArr = [];


    if (Object.entries(summary).length !== 0){
      for (const k in summary) {serverDate.push({k})}
      yearFromServer = (serverDate[0].k).substring(0, 4);
      montFromServer = (serverDate[0].k).substring(6, 7);
      allDaysInMonth = this.getDaysInMonth(+montFromServer - 1, +yearFromServer);

      for (const d of allDaysInMonth) {
        allDaysSummary[d] = {};
        for (const s in summary) {
          if (moment(d).isSame(s)) {
            allDaysSummary[d] = summary[s];
          }
        }
      }

      for (const k in allDaysSummary) {
        //allDays.push({k});
        idHour.push({...allDaysSummary[k], date: moment(k, 'YYYY-MM-DD').format("ddd DD ") });
      }

      this.dataSource = idHour;
      for (let u in users) {
        userIdNameArr.push([u, users[u]['first_name']]);
      }
      //sort users
      userIdNameArr.sort(
        (a, b) => {
          if (a[1] > b[1]) {
            return 1;
          }
          return -1;
        });
      userIdNameArr.unshift(['date', 'date']);
      //taking users id
      for (let u in userIdNameArr) {
        displayedColumnsByIds.push(userIdNameArr[u][0]);
      }

      this.sumTableService.getHolidays(yearFromServer, montFromServer).subscribe(
        (res)=>{
          for( let k in res['holidays']) {
            holidayArr.push(moment(k, 'YYYY-MM-DD').format("DD"))
          }
        }
      )

    } else {
      this.dataSource = [{date: '', empty_info: 'Nema podataka za ovaj mesec'}];
      displayedColumnsByIds = ['empty_info'];
      userIdNameArr = [['empty_info','empty_info']];

    }


   return {
      dataSource: this.dataSource,
      displayedColumnsByIds: displayedColumnsByIds,
      userIdNameArr: userIdNameArr,
      next: next,
      prev: prev,
      holidayArr: holidayArr


    };
  }

  writeUserTable(res, param){
    console.log('WT res', res.timesheet,param);

    let userProjectsArr = [];
    let userProjects = [];
    let userDataSource = [];
    const allDaysTimesheet = [];
    const year = param.year;
    const month = param.month;
    const id  = param.id;
    let freeDaysArr = [];
    let holidayArr =[];
    let sickDaysArr =[];
    let outOfOfficeArr = [];


    if (res.timesheet.length !== 0) {

      let yearFromServer = ( res.timesheet[0].date).substring(0, 4);
      let montFromServer = ( res.timesheet[0].date).substring(6, 7);
      const allDays =  this.getDaysInMonth(+montFromServer - 1, +yearFromServer);

      for (const obj of res.timesheet) {
        if (userProjectsArr.length < obj.projects.length) {
          userProjectsArr = [];
          userProjectsArr = obj.projects;
        }
      }

      for (const u of userProjectsArr) {
        userProjects.push(u.name);
      }
      userProjects.unshift('date');

      allDays.forEach((day, index) => {
        allDaysTimesheet.push({date: day, projects: []});
        for (const t of res.timesheet) {
          if (day === t.date) {
            allDaysTimesheet[index] = t;
          }
        }
      });

      let a;
      a = allDaysTimesheet;

      userDataSource = a.map(t => {
        let ds = {};
        let prj = t.projects;
        prj.forEach(project => {
          ds[project['name']] = project['hours'];
        });
        ds['date'] = moment(t.date, 'YYYY-MM-DD').format("ddd DD ")
        return ds;
      });
      // console.log(userDataSource);

      this.sumTableService.getHolidays(yearFromServer, montFromServer).subscribe(
        (res)=>{
          for( let k in res['holidays']) {
            holidayArr.push(moment(k, 'YYYY-MM-DD').format("DD"))
          }
        }
      )

      this.userService.getFreedays(id, year, month)
        .subscribe(
          (res) => {
            for (let k in res['freedays']){
              freeDaysArr.push(moment(k, 'YYYY-MM-DD').format("DD"));
            }
          }
        );

      this.userService.getSickDays(id, year, month)
        .subscribe(
          (res) => {
            for (let k in res['sick_leave_days']){
              sickDaysArr.push(moment(k, 'YYYY-MM-DD').format("DD"));
            }
          }
        );

      this.userService.getOutOfOffice(id, year, month)
        .subscribe(
          (res) => {
            for (let k in res['ouf_of_office_days']){
              outOfOfficeArr.push(moment(k, 'YYYY-MM-DD').format("DD"));
            }

            console.log('eee',outOfOfficeArr);
          }
        );




    } else {

      userDataSource = [{date: '', empty_info: 'Nema podataka za ovaj mesec'}];
      userProjects = ['empty_info'];
    }

  this.dataSourceUser = userDataSource;
    //console.log('freeDays before return',freeDaysArr);

    return  {
      userProjects,
      userDataSource,
      freeDaysArr,
      holidayArr,
      sickDaysArr,
      outOfOfficeArr
    };
  }

// func for date in one month
  getDaysInMonth(month, year) {
    var date = new Date(year, month, 1);
    var days = [];
    while (date.getMonth() === month) {
      const d = (new Date(date))
      days.push( moment(d, 'YYYY-MM-DD').format("YYYY-MM-DD") );
      date.setDate(date.getDate() + 1);
    }
    return days;
  }


  getTotalTime(idFromTable) {
    if (idFromTable == 'date') {
      return '/Total:';
    } else if (idFromTable === 'empty_info') {
      return 0;
    } else {
      let sum = 0;
      for (let i of this.dataSource) {
        if (i.hasOwnProperty(idFromTable)) {
          sum += i[idFromTable];
        }
      }
      return sum;
    }

  }

  getTotalTimeUser(project) {
    if (project === 'date') {
      return '/Total:';
    } else if(project === 'empty_info'){
      return 0;
    }
    else {
      let sum = 0;
      for (let i of this.dataSourceUser) {

        if (i.hasOwnProperty(project)){
          sum += i[project];
        }
      }
      return sum;
    }

  }

  }


