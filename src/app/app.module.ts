import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';

import {MaterialModule} from './material/material.module';
import { AppRoutingModule } from './app-routing.module';
import {AuthServiceConfig, GoogleLoginProvider} from 'angularx-social-login';

import {RequestService} from './services/request.service';
import { AppComponent } from './app.component';


import {ErrorPageComponent} from './error-page/error-page.component';
import {LoggedUserService} from './auth/logged-user.service';
import {MediatorService} from './services/mediator.service';

const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('515403727575-v0p3oqds89pn4i3c87o8ae9ljee7jtfb.apps.googleusercontent.com')
  },
]);

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    ErrorPageComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [
    RequestService,
    LoggedUserService,
    MediatorService,
    {provide: AuthServiceConfig, useFactory: provideConfig}],
  bootstrap: [AppComponent]
})
export class AppModule { }
