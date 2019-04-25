import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
// import {LoginComponent} from './login/login.component';
// import {HomeComponent} from './home/home.component';
import {ErrorPageComponent} from './error-page/error-page.component';


const routes: Routes = [
   {path: '', redirectTo: 'admin', pathMatch: 'full'},
  // {path: 'login', component: LoginComponent},
  // {
  //   path: 'home', component: HomeComponent, data: {label: ''}, children: [
  //     //{path: '', data: {label: 'projects'}, component: ProjectsComponent},
  //   ]
  // },
  { path: 'admin', loadChildren: './admin/admin.module#AdminModule' },
  { path: 'not-found', component: ErrorPageComponent, data: { message: 'Page not found!' } },
  { path: '**', redirectTo: '/not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
