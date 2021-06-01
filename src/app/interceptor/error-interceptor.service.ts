import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable , throwError, Subject} from 'rxjs';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ErrorAlertComponent} from '../dialogs/error-alert/error-alert.component';


@Injectable()
export class ErrorInterceptorService implements HttpInterceptor {
  private pendingHTTPRequests$ = new Subject<void>();
  // enter the route for which you want outgoing request to be canceled
  prevRoute = '';
  constructor(public dialog: MatDialog
   ) { }
public onCancelPendingRequests() {
  return this.pendingHTTPRequests$.asObservable();
}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          if (error.error instanceof ErrorEvent) {
            // client-side error
            errorMessage = `Error: ${error.error.message}`;
          } else {
            // server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
          }
          this.launchErrorDialog(errorMessage);
          return throwError(errorMessage);

        }));
  }

  private launchErrorDialog(error): void {
    const config = new MatDialogConfig();
    config.data = error;
    config.height = 'auto';
    config.width = '40%';
    config.disableClose = true;
    const errorDialogRef = this.dialog.open(ErrorAlertComponent, config);
  }
}
