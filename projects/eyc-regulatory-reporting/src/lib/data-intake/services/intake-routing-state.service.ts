import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { DATA_INTAKE_TYPE, ROUTE_URL_CONST } from './../../config/intake-config-helpers';
import { HttpUrlEncodingCodec } from '@angular/common/http';
import {Location} from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class IntakeRoutingStateService {
  codec = new HttpUrlEncodingCodec;
  private history = [];
  private historyCopy=[];
  private popState:boolean=false;
  LANDING_URL = "/data-intake";
  

  constructor( private router: Router,private location:Location
  ) { }

  public loadRouting(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((e: any) => {
        var urlAfterRedirects = decodeURI(e.urlAfterRedirects);
        if (this.matchExact(this.LANDING_URL, urlAfterRedirects)) {
          this.historyCopy.splice(0, this.historyCopy.length);
          this.historyCopy=[...this.history];
          this.history.splice(0, this.history.length);
        }
        if (urlAfterRedirects.includes(this.LANDING_URL) && this.isNotExistInArray(this.history, urlAfterRedirects)) {
          if(this.popState && this.history.length==1){
            this.history= this.historyCopy;
            this.popState=false;
          }
          else{
            this.history = [...this.history, urlAfterRedirects];
          } 
        }
      });
  }

  getBrowserBackForwardButtonClick(){
    return this.location.subscribe(
      ( (value:PopStateEvent) => {
        console.log("locaton OnNext")
        this.popState=value['pop'];
        console.log(value);
        return true;
      }),
      ( ex => {
        console.log("Error occured postate event")
        console.log(ex);
        return true;
      })
    )
  }
  public getHistory(): string[] {
    return this.history;
  }

  public getPreviousUrl(): string {
    return this.history[this.history.length - 2] || this.LANDING_URL;
  }

  public getCurrentUrl(): string {
    return this.history[this.history.length - 1] || this.LANDING_URL;
  }

  public getOldHistory(): string[] {
    return this.historyCopy;
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
