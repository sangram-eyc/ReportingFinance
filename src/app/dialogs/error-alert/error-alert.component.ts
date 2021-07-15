import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';

@Component({
  selector: 'app-error-alert',
  templateUrl: './error-alert.component.html',
  styleUrls: ['./error-alert.component.scss']
})
export class ErrorAlertComponent implements OnInit {

  error;
  errorType;
  readData = false;
  timeOutResponseMessage = false;
  statusCode = '';
  statusText = '';
  errorMessage = '';
  errorList = [];

  constructor(public dialogRef: MatDialogRef<ErrorAlertComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    if (this.data != null && this.data !== undefined) {
      console.log('Have data', this.data);
      if (typeof this.data === 'string') {
        // If data contains only string
        if(this.data.includes('User already present')) {
          this.statusCode = '409';
          this.statusText = 'Request retuns a invalid response';
          this.errorMessage = 'User with specified email address already exists';
        } 
        else if (this.data.includes('Access is denied')) {
          this.statusCode = '500';
          this.statusText = 'INTERNAL_SERVER_ERROR';
          this.errorMessage = 'Access is denied.';
        }
        else {
          this.statusCode = '404';
          this.statusText = 'Request retuns a invalid response';
          this.errorMessage = this.data;
        }
       
      }
      else {
        // If we have a normal error
        if (this.data.status) {
          this.statusCode = this.data.status;
        }
        if (this.data.statusText) {
          this.statusText = this.data.statusText;
        }
        if (this.data.error?.message) {
          this.errorMessage = this.data.error.message;
        }
        if (this.data.errorList) {
          this.errorList = this.data.errorList;
        }

        // If we have an error object
        if (this.data.error) {
          console.log('Have an error', this.data.error);
          if (this.data.error.status) {
            this.statusText = this.data.error.status;
          }
          if (this.data.error.errors) {
            let buffer = '';
            for (const error of this.data.error.errors) {
              buffer = buffer + error + '\n';
            }
          }

          // If we have an error string
          const timeOutResponse = '500 - The request timed out.'.toUpperCase();
          if (typeof this.data.error === 'string') {
            // If it is a timeout error
            if (this.data.error.toUpperCase().includes(timeOutResponse)) {
              this.statusCode = '500';
              this.statusText = 'The request timed out';
              this.errorMessage = 'The web server failed to respond within the specified time.';
            } else {
              this.errorMessage = this.data.error;
            }
          }

        }


      }

      if (this.statusCode === '') {
        this.statusCode = 'N/A';
      }
      if (this.statusText === '') {
        this.statusText = 'Unknown Error';
      }
      if (this.errorMessage === '') {
        if (typeof this.data === 'string') {
          this.errorMessage = this.data;
        }
      }

      // Got no data whatsoever
    } else {
      this.statusCode = 'N/A';
      this.statusText = 'Unknown Error';
      this.errorMessage = 'An error occured but we have not been able to determine it.';
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
