import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';

import { ErrorInterceptorService } from './error-interceptor.service';

describe('ErrorInterceptorService', () => {
  let service: ErrorInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ErrorInterceptorService,
        { provide: MatDialog, useValue: {} }
      ]
    });
    service = TestBed.inject(ErrorInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
