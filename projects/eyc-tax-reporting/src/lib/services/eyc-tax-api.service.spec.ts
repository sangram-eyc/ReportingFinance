import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { EycRrApiService } from './eyc-rr-api.service';

describe('EycRrApiService', () => {
  let service: EycRrApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
    });
    service = TestBed.inject(EycRrApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
