
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatTableModule} from '@angular/material/table';
import {MatDatepickerModule, MatFormFieldModule, MatNativeDateModule} from '@angular/material';
import {MatDialogModule} from '@angular/material/dialog';

import { DashboardComponent } from './dashboard/dashboard.component';
import {AdminRoutingModule} from './admin-routing.module';
import {MaterialModule} from '../material/material.module';
import {DashboardService} from './services/dashboard.service';
import {CalendarComponent} from './calendar/calendar.component';
//import {DialogTimesheet } from './info-table/info-table.component';

import { SummtableComponent } from './dashboard/summtable/summtable.component';
import { UsertableComponent } from './dashboard/usertable/usertable.component';
import {UsertableService} from './services/usertable.service';
import {CalendarService} from './services/calendar.service';
import {SummtableService} from './services/summtable.service';







@NgModule({
  declarations: [DashboardComponent,
                CalendarComponent,
                SummtableComponent,
                UsertableComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    AdminRoutingModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatFormFieldModule
  ],
  providers: [DashboardService,
              UsertableService,
              MatDatepickerModule,
              MatNativeDateModule,
              CalendarService,
              SummtableService
  ],
  entryComponents: [
  ],
  //exports: [MatDatepickerModule]
})
export class AdminModule { }
