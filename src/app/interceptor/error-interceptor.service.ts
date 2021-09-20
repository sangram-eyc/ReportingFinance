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
import { Router } from '@angular/router';
import { ErrorModalComponent } from 'eyc-ui-shared-component';
import { SettingsService } from '@default/services/settings.service';

@Injectable()
export class ErrorInterceptorService implements HttpInterceptor {
  prevRoute = '';
  count = 0
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private settingsService: SettingsService,
  ) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          let errorCode;
          if (error.url.includes('authorization/currentUser/modules')) {
            let eycError = error.error.error;
            errorMessage = `Error Code: ${eycError.errorCode}\nMessage: ${eycError.message}`;
            if (eycError.errorCode == 500 && eycError.message == "Authorization Error :500 :Could not authorize the user. Invalid user ") {
              this.openErrorModal("Access Denied", "User does not have access to any module or is inactive. Please contact the administrator.");
            } else {
              this.openErrorModal("Access Denied", eycError.message);
            }
            return throwError(errorMessage);
          } else if (error.error instanceof ErrorEvent) {
            if (error.error.hasOwnProperty("error")) {
              if (error.error.error.message.includes("Authentication Token Error :Invalid token")) {
                this.count++;
                if (this.count == 1) {
                  this.openErrorModal("Access Denied", error.error.error.message);
                }
                return throwError(errorMessage);
              }
              errorMessage = `Message: ${error.error.error.message}`;
              errorCode = error.error.error.errorCode;
            } else {
              errorMessage = `Message: ${error.message}`;
              errorCode = `${error.status} ${error.statusText}`;
            }
            // client-side error
          } else if (error.error != null && error.error.error != null && error.error.error.errorCode.includes('TX-')) {
            let eycError = error.error.error;
            errorMessage = `Message: ${eycError.message}`;
            errorCode = eycError.errorCode
            this.launchErrorDialog({ errorMessage: errorMessage, errorCode: errorCode });
            return throwError(errorMessage);
          } else {
            // server-side error
            // temp check will be refractored with the user modal user story
            if (error.error.hasOwnProperty("error")) {
              if (error.error.error.message.includes("Authentication Token Error :Invalid token")) {
                this.count++;
                if (this.count == 1) {
                  this.openErrorModal("Access Denied", error.error.error.message);
                }
                return throwError(errorMessage);
              }
              errorMessage = `Message: ${error.error.error.message}`;
              errorCode = error.error.error.errorCode;
              // if (error.error.message.includes('User already present')) {
              //   errorMessage = `Error Code: 409 \nMessage: User already present.`;
              // }
              // if (Array.isArray(error.error.message)) {
              //   if (error.error.errors[0].includes('Access is denied')) {
              //     errorMessage = `Error Code: 500 \nMessage: Access is denied.`;
              //     console.log('Access is denied Error Message', error.error.errors[0]);
              //   }
              // }
              // else {

              //   errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
              //   console.log('Generic Error Message');
              // }
            } else {
              errorMessage = `Message: ${error.message}`;
              errorCode = `${error.status} ${error.statusText}`;
            }
          }
          // temp check will be refractored with the user modal user story
          this.launchErrorDialog({ errorMessage: errorMessage, errorCode: errorCode });
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

  openErrorModal(header, description) {
    const dialogRef = this.dialog.open(ErrorModalComponent, {
      disableClose: true,
      width: '400px',
      data: {
        header: header,
        description: description,
        footer: {
          style: "start",
          YesButton: "OK"
        },
      }
    });
    // if (!this.moduleLevelPermissionData) {
    //   setTimeout(() => {
    //     dialogRef.close();
    //   }, 30000);
    // }
    dialogRef.afterClosed().subscribe(result => {
      this.settingsService.logoff();
      this.router.navigate(['/eyComply'], { queryParams: { logout: true } });
    });
  }
}
