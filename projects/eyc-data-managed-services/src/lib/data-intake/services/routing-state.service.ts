import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { DATA_INTAKE_TYPE, ROUTE_URL_CONST } from '../../config/dms-config-helper';
import { HttpUrlEncodingCodec } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class RoutingStateService {
  codec = new HttpUrlEncodingCodec;
  private history = [];
  DMS_Landing_Url = "/data-managed-services";

  constructor(
    private router: Router
  ) { }

  public loadRouting(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((e: any) => {
        var urlAfterRedirects = decodeURI(e.urlAfterRedirects);
        if (this.matchExact(this.DMS_Landing_Url, urlAfterRedirects)) {
          this.history.splice(0, this.history.length)
        }
        if (urlAfterRedirects.includes(this.DMS_Landing_Url) && this.isNotExistInArray(this.history, urlAfterRedirects)) {
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
  public isNotExistInArray(array, string) {
    const routeArray = string.split("/");
    if (routeArray.length == 5) {
      const routePart = routeArray[routeArray.length - 2]
      if (routePart == DATA_INTAKE_TYPE.DATA_PROVIDER || routePart == DATA_INTAKE_TYPE.DATA_DOMAIN) {
        const stringUrl=ROUTE_URL_CONST.FILE_REVIEW_URL+'/'+routePart+'/';
        const existingurl=array.find(url => url.includes(stringUrl));
        if(existingurl){
          const urlindex=array.indexOf(existingurl);
          array[urlindex]=string;
        }
       
      }
    }
    let index = array.indexOf(string);
    if(index > 0) {
      array.splice(index,1);
      array.push(string);
    }
    return (index > -1) ? false : true;
  }


  ngEncode(param: string){
    return this.codec.encodeValue(param);
  }

  jsEncodeComponent(param: string){
    return encodeURIComponent(param);
  }

  jsEncodeURI(param: string){
    return encodeURI(param);
  }

  ngDecode(param: string){
    return this.codec.decodeValue(param);
  }

  jsDecodeComponent(param: string){
    return decodeURIComponent(param);
  }

  jsDecodeURI(param: string){
    return decodeURI(param);
  }
}
