import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {DashboardComponent} from './dashboard/dashboard.component';
import {SummtableComponent} from './dashboard/summtable/summtable.component';
import {UsertableComponent} from './dashboard/usertable/usertable.component';
import {DashboardResolverService} from './dashboard/dashboard-resolver.service';



const routes: Routes = [

  {path: '', redirectTo: 'timesheet', pathMatch: 'full'},
  {path: 'timesheet', component: DashboardComponent,
    resolve: { data: DashboardResolverService },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    children:
          [
            {path: '', component:  SummtableComponent},
            {path: ':year/:month', component:  SummtableComponent},
            {path: ':id/:year/:month', component: UsertableComponent}

          ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdminRoutingModule {
}

