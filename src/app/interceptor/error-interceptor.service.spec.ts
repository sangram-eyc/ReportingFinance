import { HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ErrorAlertComponent } from '@default/dialogs/error-alert/error-alert.component';
import { OauthService } from '@default/login/services/oauth.service';
import { OAuthLogger, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { EMPTY, of, throwError } from 'rxjs';
import { take } from 'rxjs/operators';

import { ErrorInterceptorService } from './error-interceptor.service';

describe('ErrorInterceptorService', () => {
  let service: ErrorInterceptorService;
  let httpMock: HttpTestingController;
  
  let routerStub = {
    navigate : () => {}
  }
  // let dialogSpy: jasmine.Spy;
  // let error;
  // let dialogRefSpyObj = jasmine.createSpyObj({ afterClosed : of({}), close: null });
  // dialogRefSpyObj.componentInstance = { body: '' }; // attach componentInstance to the spy object...
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, HttpClientTestingModule],
      providers: [ErrorInterceptorService, OauthService, OAuthService,UrlHelperService,OAuthLogger,
        { provide: MatDialog, useValue: { open : ()=>{}} },
        { provide: Router, useValue: routerStub}
      ]
    });
    service = TestBed.inject(ErrorInterceptorService);
    httpMock = TestBed.get(HttpTestingController);
  });


  afterEach(() => {
    httpMock.verify();
  });


  // describe('Error intercept', () => {
  //   let httpRequestSpy;
  //   let httpHandlerSpy;
  //   const error = {
  //     error:
  //       { message: 'test-error' }
  //   }
  //   it('error interceptor', () => {
  //     //arrange
  //     httpRequestSpy = jasmine.createSpyObj('HttpRequest', ['doesNotMatter']);
  //     httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
  //     httpHandlerSpy.handle.and.returnValue(throwError(
  //       {
  //         error:
  //           { message: 'test-error' }
  //       }
  //     ));
  //     //act
  //     service.intercept(httpRequestSpy, httpHandlerSpy)
  //       .subscribe(
  //         result => console.log('good', result),
  //         err => {
  //           console.log('error', err);
  //           expect({
  //             error:
  //               { message: 'test-error' }
  //           }).toEqual(error);
  //         }
  //       );

  //     //assert

  //   })
  // });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('launchErrorDialog method should open error modal',()=>{
    spyOn(service['dialog'],'open').and.returnValue({afterClosed : () => of({data : 'data'}) } as any)
    service.openErrorModal('error header','error occurred');
    expect(service['dialog'].open).toHaveBeenCalled()
  })



  describe('Error intercept', () => {
    let httpRequestSpy;
    let httpHandlerSpy;
    const error = {
      error:
        { message: 'test-error' }
    }
    it('error interceptor should open error modal - 500 code', () => {

      let mockError = {
        message: 'test-error',
        url:'/authorization/currentUser/modules',
        error: {
            error : {
              errorCode:500,
              message:'Authorization Error :500 :Could not authorize the user. Invalid user '
            }
          }
      }
      //arrange

      httpRequestSpy = jasmine.createSpyObj('HttpRequest', ['doesNotMatter']);
      httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
      httpHandlerSpy.handle.and.returnValue(throwError(mockError));
      spyOn(service,'openErrorModal')
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
      expect(service.openErrorModal).toHaveBeenCalledWith("Access Denied", "User does not have access to any module or is inactive. Please contact the administrator.")
    });


    it('error interceptor shoulld open error modal - not 500 code', () => {

      let mockError = {
        message: 'test-error',
        url:'/authorization/currentUser/modules',
        error: {
            error : {
              errorCode:501,
              message:'Authorization Error :500 :Could not authorize the user. Invalid user '
            }
          }
      }
      //arrange

      httpRequestSpy = jasmine.createSpyObj('HttpRequest', ['doesNotMatter']);
      httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
      httpHandlerSpy.handle.and.returnValue(throwError(mockError));
      spyOn(service,'openErrorModal')
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
      expect(service.openErrorModal).toHaveBeenCalledWith("Access Denied", "Authorization Error :500 :Could not authorize the user. Invalid user ")
    });


    it('error interceptor should open error modal - error code includes TX-', () => {

      let mockError = {
        message: 'test-error',
        url:'/',
        error: {
            error : {
              errorCode:'TX-501',
              message:'Authorization Error :500 :Could not authorize the user. Invalid user '
            }
          } as ErrorEvent
      }
      //arrange

      httpRequestSpy = jasmine.createSpyObj('HttpRequest', ['doesNotMatter']);
      httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
      httpHandlerSpy.handle.and.returnValue(throwError(mockError));
      spyOn(service,'openErrorModal')
      //act
      service.intercept(httpRequestSpy, httpHandlerSpy)
        .subscribe(
          result => console.log('good', result),
          err => {
            console.log('error', err);
          }
        );
    })


    it('error interceptor should open error modal - auth token error', () => {

      let mockError = {
        message: 'test-error',
        url:'/',
        error: {
            error : {
              errorCode:'501',
              message:"Authentication Token Error :Invalid token"
            }
          }
      }
      //arrange

      httpRequestSpy = jasmine.createSpyObj('HttpRequest', ['doesNotMatter']);
      httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
      httpHandlerSpy.handle.and.returnValue(throwError(mockError));
      spyOn(service,'openErrorModal');
      service.count = 0;
      //act
      service.intercept(httpRequestSpy, httpHandlerSpy)
        .subscribe(
          result => console.log('good', result),
          err => {
            console.log('error', err);
          }
        );

      //assert
      expect(service.count).toEqual(1);
      expect(service.openErrorModal).toHaveBeenCalledWith("Access Denied","Authentication Token Error :Invalid token")
    })


    it('error interceptor should open error modal - auth token error', () => {

      let mockError = {
        message: 'test-error',
        url:'/',
        error: {
            error : {
              errorCode:'501',
              message:"oops, server down error"
            }
          }
      }
      //arrange

      httpRequestSpy = jasmine.createSpyObj('HttpRequest', ['doesNotMatter']);
      httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
      httpHandlerSpy.handle.and.returnValue(throwError(mockError));
      spyOn(service,'openErrorModal');
      service.count = 0;
      //act
      service.intercept(httpRequestSpy, httpHandlerSpy)
        .subscribe(
          result => console.log('good', result),
          err => {
            console.log('error', err);
          }
        );

      //assert
      expect(service.count).not.toEqual(1);
      expect(service.openErrorModal).not.toHaveBeenCalledWith("Access Denied","Authentication Token Error :Invalid token")
    })


    it('error interceptor should open error modal - error.error is null', () => {

      let mockError = {
        message: 'test-error',
        url:'/',
        error: {}
      }
      //arrange

      httpRequestSpy = jasmine.createSpyObj('HttpRequest', ['doesNotMatter']);
      httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
      httpHandlerSpy.handle.and.returnValue(throwError(mockError));
      spyOn(service,'openErrorModal');
      service.count = 0;
      //act
      service.intercept(httpRequestSpy, httpHandlerSpy)
        .subscribe(
          result => console.log('good', result),
          err => {
            console.log('error', err);
          }
        );

      //assert
      expect(service.count).not.toEqual(1);
      expect(service.openErrorModal).not.toHaveBeenCalledWith("Access Denied","Authentication Token Error :Invalid token");
    })


    it('error interceptor should open error modal - error.error as instance of ErrorEvent', () => {

      let mockError = {
        message: 'test-error',
        url:'/',
        error: { 
            error : {
              errorCode:'502',
              message:'Authentication Token Error :Invalid token'
            }
          } instanceof ErrorEvent
      }

      //arrange

      httpRequestSpy = jasmine.createSpyObj('HttpRequest', ['doesNotMatter']);
      httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
      httpHandlerSpy.handle.and.returnValue(throwError(mockError));
      spyOn(service,'openErrorModal')
      //act
      service.intercept(httpRequestSpy, httpHandlerSpy)
        .subscribe(
          result => console.log('good', result),
          err => {
            console.log('error', err);
          }
        );
      
    })

  });
});
