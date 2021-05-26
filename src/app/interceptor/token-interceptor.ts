import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import * as userAuthHelpers from '../services/settings-helpers';
import { EmptyObservable } from 'rxjs/observable/EmptyObservable';
import { SettingsService } from '../services/settings.service';
import {ACCESS_TOKEN,ID_TOKEN,USER_NAME,NONCE,SESSION_ID,UUID} from '../services/settings-helpers';
import {token_interceptor} from '../helper/api-config-helper';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    toshow: any;
    isWarning: any;
    constructor(private settingService: SettingsService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const abcd = request.url.indexOf(token_interceptor.auth_Header);
        if (request.url.indexOf(token_interceptor.auth_Header) !== -1) {
            console.log('policy');
            console.log( request.url.indexOf(token_interceptor.auth_Header));
           
                 const urlString = request.url;
                    console.log('url : ' + urlString);
                    request = request.clone({
                        headers: new HttpHeaders({
                            
                            //    Authorization: `Bearer ${currentUserToken}`
                            
                        }),
                        url: urlString
                    });
                    
                    // install an error handler
                    return next.handle(request)
                        .pipe(
                            catchError((error: HttpErrorResponse) => this.handleAngularJsonBug(error))
                        );
                
            
            
        }
        else
        {
            if (environment.SECURITY_ENABLED) {
                console.log('Banda');
                console.log(sessionStorage.getItem(userAuthHelpers.SESSION_ACCESS_TOKEN));
                if (!!sessionStorage.getItem(userAuthHelpers.SESSION_ACCESS_TOKEN)) {
                    const currentUserToken = this.settingService.getToken();
                    const urlString = request.url;
                    console.log('url : ' + urlString);
                    request = request.clone({
                        headers: new HttpHeaders({
                            
                                Authorization: `Bearer ${currentUserToken}`
                            
                        }),
                        url: urlString
                    });
                    if (currentUserToken && request.url.includes(location.origin)) {
                        request = request.clone({
                            headers: new HttpHeaders({
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${currentUserToken}`
                            })
                        });
    
                    }
                    // install an error handler
                    return next.handle(request)
                        .pipe(
                            catchError((error: HttpErrorResponse) => this.handleAngularJsonBug(error))
                        );
                }
            }
            if (ID_TOKEN) {
                
            }
        }
      
        return new EmptyObservable();
    }

    private handleAngularJsonBug(error: HttpErrorResponse) {
        const JsonParseError = 'Http failure during parsing for';
        // const matches = error.message.match(new RegExp(JsonParseError, 'ig'));
        if (error.error instanceof Error) {
            // A client-side or network error occurred. Handle it accordingly.

        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,

            if ([200, 201, 204].indexOf(error.status) < 0) {
                this.toshow = error.headers.get('message') ? error.headers.get('message') : error.error ? error.error : error.message;
                this.isWarning = error.error ? false : true;
            }

        }

        return observableThrowError(error);
    }
}
