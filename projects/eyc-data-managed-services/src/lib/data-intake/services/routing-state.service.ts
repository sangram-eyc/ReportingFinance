import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class RoutingStateService {

  private history = [];
   DMS_Landing_Url = "/data-managed-services";

  constructor(
    private router: Router
  ) { }

  public loadRouting(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((e: any) => {
        var urlAfterRedirects=decodeURI(e.urlAfterRedirects);
        if (this.matchExact(this.DMS_Landing_Url, urlAfterRedirects)) {
          this.history.splice(0, this.history.length)
        }
        if (urlAfterRedirects.includes(this.DMS_Landing_Url) && this.isNotExistInArray(this.history,urlAfterRedirects)) {
          this.history = [...this.history, urlAfterRedirects];
        }
      });
  }

  public getHistory(): string[] {
    return this.history;
  }

  public getPreviousUrl(): string {
    return this.history[this.history.length - 2] || this.DMS_Landing_Url;
  }

  public getCurrentUrl(): string {
    return this.history[this.history.length - 1] || this.DMS_Landing_Url;
  }

  public matchExact(r, str) {
    var match = str.match(r);
    return match && str === match[0];
  }
  public isNotExistInArray(array,string) {

    let index = array.indexOf(string);
    return (index > -1) ? false:true;
  }
}
