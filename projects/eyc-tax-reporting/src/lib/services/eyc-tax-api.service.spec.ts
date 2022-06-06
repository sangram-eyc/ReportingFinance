import { HttpClientModule, HttpHeaders, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { EycApiService } from './eyc-tax-api.service';

describe('EycRrApiService', () => {
  let service: EycApiService;
  let httpClient :HttpClient; 
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [EycApiService]
    });
    service = TestBed.inject(EycApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
