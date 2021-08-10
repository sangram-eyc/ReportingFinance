import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';
import { UrlHelperService } from 'angular-oauth2-oidc';
import { environment } from '../../../../../../src/environments/environment';
import { EycRrSettingsService } from '../../services/eyc-rr-settings.service';

import { FundScopingService } from './fund-scoping.service';

describe('FundScopingService', () => {
  let service: FundScopingService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [EycRrSettingsService, UrlHelperService,
        {provide:"apiEndpoint",  useValue: environment.apiEndpoint},
        {provide:"rrproduction",  useValue: environment.production}]
    });
    service = TestBed.inject(FundScopingService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch fund scoping details as an Observable', () => {
    const fundScopingDetails = {
      "success": true,
      "message": "Funds in scope details fetched successfully",
      "corelationId": null,
      "data": [
        {
          "fundName": "Goldman Sachs China A-Share Equity Portfolio",
          "fundCode": "19614011",
          "fundId": "PV100356"
        },
        {
          "fundName": "Goldman Sachs China B-Share Equity Portfolio",
          "fundCode": "19614012",
          "fundId": "PV100357"
        },
        {
          "fundName": "Goldman Sachs China C-Share Equity Portfolio",
          "fundCode": "19614013",
          "fundId": "PV100358"
        },
        {
          "fundName": "Goldman Sachs China D-Share Equity Portfolio",
          "fundCode": "19614014",
          "fundId": "PV100359"
        },
        {
          "fundName": "Goldman Sachs China E-Share Equity Portfolio",
          "fundCode": "19614015",
          "fundId": "PV100360"
        }
      ],
      "error": null
    };
    service.getFundScopingDetails('Form PF', 'Q4 2021').subscribe(resp => {
      expect(resp['data'].length).toBe(5);
    });
    let req = httpMock.expectOne(environment.apiEndpoint + 'assets/eyc-regulatory-reporting/mock/fundScopingDetails.json');
    expect(req.request.method).toEqual("GET");
    req.flush(fundScopingDetails);
    httpMock.verify();
  });

  it('should fetch fund scoping status as an Observable', () => {
    const fundScopingStatus = {
      "success": true,
      "message": "Funds scoping status returned successfully",
      "corelationId": null,
      "data": [
        {
          "stageId": 61,
          "stage": "EY Review",
          "stageCode": "EY_REVIEW",
          "progress": "In Progress",
          "displayOrder": 1
        },
        {
          "stageId": 62,
          "stage": "Client Review",
          "stageCode": "CLIENT_REVIEW",
          "progress": "Completed",
          "displayOrder": 2
        }
      ],
      "error": null
    };
    service.getFundScopingStatus(1).subscribe(resp => {
      expect(resp['data'].length).toEqual(2);
    });
    let req = httpMock.expectOne(environment.apiEndpoint + 'assets/eyc-regulatory-reporting/mock/fundScopingStatus.json');
    expect(req.request.method).toEqual("GET");
    req.flush(fundScopingStatus);
    httpMock.verify();
  });

  it('should approve fund scoping', () => {
    const data = [];
    service.approveFundScopingStatus(data).subscribe(resp => {
    })
    let req = httpMock.expectOne(environment.apiEndpoint);
    expect(req.request.method).toEqual("PUT");
    req.flush(data);
    httpMock.verify();
  });

});