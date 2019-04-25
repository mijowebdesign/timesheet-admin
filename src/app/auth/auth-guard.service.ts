import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {LoggedUserService} from './logged-user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private loggedUser: LoggedUserService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return new Promise((resolve) => {
      this.loggedUser.checkUser().subscribe(
        r => {
          this.loggedUser.login(r);
          resolve(true);
        },
        err => {
          this.router.navigate(['/login']);
          resolve(false);
        }
      );
    });
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return this.canActivate(childRoute, state);
  }
}
