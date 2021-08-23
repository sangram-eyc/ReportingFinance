import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SettingsService} from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService  implements CanActivate, CanActivateChild {

  constructor(
    private router: Router,
    private settings: SettingsService,
  ) { }

  canActivate( next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | boolean  {
    if (this.settings.isUserLoggedin()) {
      console.log('loggedin');
      return true;
    }
    this.router.navigate(['']);
    return false;
  }
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
}
