import { HttpClient, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { async, getTestBed, inject, TestBed, tick } from '@angular/core/testing';
import { LoaderService } from '@default/services/loader.service';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';

import { LoaderInterceptor } from './loader.interceptor';

describe('LoaderInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let loaderService: LoaderService;
  let mySpy;
  let hideSpy;
  let interceptor: LoaderInterceptor;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        LoaderInterceptor,
        LoaderService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: LoaderInterceptor,
          multi: true
        }
      ]
    })
    httpMock = TestBed.get(HttpTestingController);
    httpClient = TestBed.get(HttpClient);
    loaderService = TestBed.inject(LoaderService);
    interceptor = TestBed.inject(LoaderInterceptor);
    const payload = {
      status: 401
    },
      response = new HttpErrorResponse(payload),
      next: any = {
        handle: jasmine.createSpy('handle').and.callFake(() => of(response))
      };
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('intercept', () => {
    beforeEach(() => {
      const payload = {
        status: 401
      },
        response = new HttpErrorResponse(payload),
        next: any = {
          handle: jasmine.createSpy('handle').and.callFake(() => of(response))
        };

      interceptor.intercept(response as any, next).pipe(take(1))
        .subscribe(() => {
          // it('show loader', () => {
          mySpy = spyOn(loaderService, 'show').and.callThrough();
          expect(mySpy).toBeTruthy();
          // });
        });
    });

    describe('', () => {
      it('hide loader', () => {
        hideSpy = spyOn(loaderService, 'hide').and.callThrough();
        expect(hideSpy).toBeTruthy();
      });
    });
  })

  it('should be created', () => {
    const interceptor: LoaderInterceptor = TestBed.inject(LoaderInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
