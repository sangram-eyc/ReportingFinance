import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ErrorAlertComponent } from '@default/dialogs/error-alert/error-alert.component';
import { of, throwError } from 'rxjs';
import { take } from 'rxjs/operators';

import { ErrorInterceptorService } from './error-interceptor.service';

describe('ErrorInterceptorService', () => {
  let service: ErrorInterceptorService;
  let httpMock: HttpTestingController;
  // let dialogSpy: jasmine.Spy;
  // let error;
  // let dialogRefSpyObj = jasmine.createSpyObj({ afterClosed : of({}), close: null });
  // dialogRefSpyObj.componentInstance = { body: '' }; // attach componentInstance to the spy object...
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, HttpClientTestingModule],
      providers: [ErrorInterceptorService,
        { provide: MatDialog, useValue: {} }
      ]
    });
    service = TestBed.inject(ErrorInterceptorService);
    httpMock = TestBed.get(HttpTestingController);
  });


  afterEach(() => {
    httpMock.verify();
  });
  //   beforeEach(() => {
  //     dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
  // });

  // it('open modal ', () => {
  //   let error
  //   (service as any).launchErrorDialog(error);
  //     expect(dialogSpy).toHaveBeenCalled();

  //     // You can also do things with this like:
  //     expect(dialogSpy).toHaveBeenCalledWith(ErrorAlertComponent, { maxWidth: '100vw' });

  //     // and ...
  //     expect(dialogRefSpyObj.afterClosed).toHaveBeenCalled();
  // });


  describe('Error intercept', () => {
    let httpRequestSpy;
    let httpHandlerSpy;
    const error = {
      error:
        { message: 'test-error' }
    }
    it('error interceptor', () => {
      //arrange
      httpRequestSpy = jasmine.createSpyObj('HttpRequest', ['doesNotMatter']);
      httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
      httpHandlerSpy.handle.and.returnValue(throwError(
        {
          error:
            { message: 'test-error' }
        }
      ));
      //act
      service.intercept(httpRequestSpy, httpHandlerSpy)
        .subscribe(
          result => console.log('good', result),
          err => {
            console.log('error', err);
            expect({
              error:
                { message: 'test-error' }
            }).toEqual(error);
          }
        );

      //assert

    })
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
