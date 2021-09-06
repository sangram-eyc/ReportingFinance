import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { EycApiService } from './eyc-tax-api.service';

describe('EycRrApiService', () => {
  let service: EycApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
    });
    service = TestBed.inject(EycApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
