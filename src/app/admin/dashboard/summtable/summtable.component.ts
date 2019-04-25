import {AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import { Subscription} from 'rxjs';
//import {MAT_DIALOG_DATA, MatDialogConfig, MatDialogRef} from '@angular/material';


import {DashboardService} from '../../services/dashboard.service';
import {SummtableService} from '../../services/summtable.service';
import * as moment from 'moment';


// Dialog

/*export interface DialogData {
  animal: string;
  name: string;
}*/

@Component({
  selector: 'app-summtable',
  templateUrl: './summtable.component.html',
  styleUrls: ['./summtable.component.scss']
})
export class SummtableComponent implements OnInit, OnDestroy, AfterViewInit {

  dataSource = [];
  displayedColumnsByIds = [];
  userIdNameArr = [];
  next;
  prev;

  currentYear: number;
  currentMonth: number;
  tableMonthDisplay: any;
  listener: Subscription;
  summaryListener: Subscription;
  dayListener: Subscription;
  dataForUrl: any;
  searchDay: any;
  holidayArr = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private dashboardService: DashboardService,
              private sumTableService: SummtableService) {
  }

  ngOnInit() {

    this.listener = this.route.params.subscribe((data) => {
      if (Object.keys(data).length > 0) {
        this.sumTableService.yearMonthParams.next(data);
        this.dataForUrl = data;
        this.currentMonth = data.month;
        this.currentYear = data.year;
        this.tableMonthDisplay = moment(this.currentMonth, 'MM').format('MMMM');

        this.summaryListener = this.sumTableService.getAllData(this.dataForUrl)
          .subscribe(
            (res) => {
              const tabledata = this.dashboardService.writeTable(res);
              this.dataSource = tabledata.dataSource;
              this.displayedColumnsByIds = tabledata.displayedColumnsByIds;
              this.userIdNameArr = tabledata.userIdNameArr;
              this.next = tabledata.next;
              this.prev = tabledata.prev;
              this.holidayArr = tabledata.holidayArr;

            }
          );

      } else {
        this.currentYear = new Date().getFullYear();
        this.currentMonth = (new Date().getMonth()) + 1;
        this.router.navigate([this.currentYear, this.currentMonth], {relativeTo: this.route});
      }

    });
  }

  ngAfterViewInit(): void {
    this.dayListener = this.route.fragment.subscribe(
      (day: string ) => {
        if (day) {
          this.searchDay = day;
          const cellId = (day + '_date').toString();
          //console.log(cellId);
          setTimeout(()=> {
            const cell = document.getElementById(cellId);
            //console.log(cell);
            cell.scrollIntoView({ behavior: "smooth", block: "center" });
          },100);
        }
      }
    );
  }

  getTotalTime(idFromTable) {
    return this.dashboardService.getTotalTime(idFromTable);
  }


  onNextMonth() {
    this.searchDay = -1;
    const year = this.next.substring(0, 4);
    const month = this.next.substring(5, 7);
    this.router.navigate([year, month], {relativeTo: this.route.parent});
  }

  onPreviousMonth() {
    this.searchDay = -1;
    const year = this.prev.substring(0, 4);
    const month = this.prev.substring(5, 7);
    this.router.navigate([year, month], {relativeTo: this.route.parent});
  }

  onName(id, name){
    this.dashboardService.userNameSubject.next(name);
    console.log(name);
    this.router.navigate([id,this.currentYear,this.currentMonth], {relativeTo:this.route.parent});


  }

  holiday(date){
   let p = false;
   for (let s of this.holidayArr) {
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
    if (this.summaryListener) {
      this.summaryListener.unsubscribe();
    }
    if (this.dayListener) {
      this.dayListener.unsubscribe();
    }
  }


//Dialog

// openDialog(event, val): void {
//   // uzimanje pozicije td
//   const target: HTMLInputElement = event.target;
// console.log('Target',);
//
// let rect = target.getBoundingClientRect();
// let topBox:string = (rect.top).toString()+ "px";
// let leftBox:string = (rect.left).toString()+ "px";
//
//
//
// let dialogConfig = new MatDialogConfig();
// dialogConfig.width = '250px';
// dialogConfig.data = {date: target.id, month:this.tableMonthDisplay, overall: val};
// dialogConfig.position = {
//   top: topBox ,
//   left: leftBox
//};
// const dialogRef = this.dialog.open(DialogTimesheet, dialogConfig );
// dialogRef.afterClosed().subscribe(result => {
//   console.log('The dialog was closed');
//   this.animal = result;
// });
//}

//}
//
// @Component({
//   selector: 'dialog-timesheet',
//   templateUrl: 'dialog-timesheet.html',
// })
// export class DialogTimesheet {
//
//   constructor(
//     public dialogRef: MatDialogRef<DialogTimesheet>,
//     @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
//
//   onNoClick(): void {
//     this.dialogRef.close();
//   }
//
}

