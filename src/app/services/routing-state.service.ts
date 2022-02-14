import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class RoutingStateService {

  private history = [];

  constructor(
    private router: Router
  ) { }

  public loadRouting(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((e: any) => {
        var urlAfterRedirects=decodeURI(e.urlAfterRedirects)
        const str = "/data-managed-services"
        if (this.matchExact(str, urlAfterRedirects)) {
          this.history.splice(0, this.history.length)
        }
        if (urlAfterRedirects.includes(str) && this.isNotExistInArray(this.history,urlAfterRedirects)) {
          this.history = [...this.history, urlAfterRedirects];
        }
      });
  }

  public getHistory(): string[] {
    return this.history;
  }

  public getPreviousUrl(): string {
    return this.history[this.history.length - 2] || '/data-managed-services';
  }

  public getCurrentUrl(): string {
    return this.history[this.history.length - 1] || '/data-managed-services';
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
