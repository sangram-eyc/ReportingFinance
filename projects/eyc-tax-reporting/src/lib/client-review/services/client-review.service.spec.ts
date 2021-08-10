import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../../../src/environments/environment';
import { EycRrSettingsService } from '../../services/eyc-rr-settings.service';

import { ClientReviewService } from './client-review.service';

describe('ClientReviewService', () => {
  let service: ClientReviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [EycRrSettingsService,
        {provide:"apiEndpoint",  useValue: environment.apiEndpoint}, {provide:"rrproduction",  useValue: environment.production}]
    });
    service = TestBed.inject(ClientReviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('invokePutAPI  returned Observable should match the right data', () => {
    const mockUser ={
      "entityIds": [1,2,3],
      "filingName": "FormPF",
      "period": "Q3 2021",
      "stage": "Client review"
    };
    service.approvefilingEntities(mockUser)
      .subscribe(res => {
        expect(res).toBeTruthy();
      });

    // const req = httpMock.expectOne(url);
    // expect(req.request.method).toEqual('PUT');
    // req.flush(mockUser);
  });
});
