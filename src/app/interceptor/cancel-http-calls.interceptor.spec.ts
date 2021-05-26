import {async,ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelHttpCallsInterceptor } from './cancel-http-calls.interceptor';
import { SettingsService } from '../services/settings.service';

describe('CancelHttpCallsInterceptor', () => {
  let cancelInterceptor: CancelHttpCallsInterceptor;
  let settingService: SettingsService;
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      CancelHttpCallsInterceptor
      ]
  }));
  

  

  it('should be created', () => {
    const interceptor: CancelHttpCallsInterceptor = TestBed.inject(CancelHttpCallsInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
