import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ErrorAlertComponent } from '../dialogs/error-alert/error-alert.component';


@Injectable()
export class ErrorInterceptorService implements HttpInterceptor {
  prevRoute = '';
  constructor(public dialog: MatDialog
  ) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          if (error.status !== 200) {
            if (error.error instanceof ErrorEvent) {
              // client-side error
              errorMessage = `Error: ${error.error.message}`;
            } else {
              // server-side error
              // temp check will be refractored with the user modal user story
              if (error.error.message) {
                if (error.error.message.includes('User already present')) {
                  errorMessage = `Error Code: 409 \nMessage: User already present.`;
                }
                if (Array.isArray(error.error.message)) {
                  if (error.error.errors[0].includes('Access is denied')) {
                    errorMessage = `Error Code: 500 \nMessage: Access is denied.`;
                    console.log('Access is denied Error Message', error.error.errors[0]);
                  }
                }
                else {
                  errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
                  console.log('Generic Error Message');
                }
              }
            }
            // temp check will be refractored with the user modal user story
            this.launchErrorDialog(errorMessage);
            return throwError(errorMessage);
          }
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
