import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../../../src/environments/environment';
import { EycRrSettingsService } from '../../services/eyc-tax-settings.service';

import { RegulatoryReportingFilingService } from './regulatory-reporting-filing.service';

describe('RegulatoryReportingFilingService', () => {
  let service: RegulatoryReportingFilingService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [EycRrSettingsService, {provide:"apiEndpoint",  useValue: environment.apiEndpoint},
      {provide:"rrproduction",  useValue: environment.production}]
    });
    service = TestBed.inject(RegulatoryReportingFilingService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return list fillings', () => {
    service.getFilings().subscribe(resp => {
      expect(resp).toEqual({
        "success": true,
      "message": "sucess",
      "data": [
            {
                "name": "CPO-PQR",
                "status": {
                    "stage": "Data Intake",
                    "progress": "in-progress"
                },
                "comments": [],
                "dueDate": 1625112000000,
                "startDate": 1620153000000,
                "period": "Q3 2021"
            },
            {
                "name": "Form PF",
                "status": {
                    "stage": "Data Intake",
                    "progress": "in-progress"
                },
                "comments": [],
                "dueDate": 1625112000000,
                "startDate": 1609785000000,
                "period": "Q3 2021"
            },
            {
                "name": "N-PORT",
                "status": {
                    "stage": "Submission",
                    "progress": "in-progress"
                },
                "comments": [
                    {"0": "comment"},
                    {"1": "second comment"},
                    {"2": "third comment"}
                ],
                "dueDate": 1625112000000,
                "startDate": 1619634600000,
                "period": "Q3 2021"
            }
        ]
    })
    })
  });

  it('should fetch filing search as an Observable', () => {
    const filingSearch = {
      "success": true,
      "message": "",
      "corelationId": null,
      "data": [
        {
          "filingName": "Form PF",
          "filingId": 1,
          "filingStatus": [
            {
              "stage": "Fund Scoping",
              "stageId": 1,
              "stageCode": "FUND_SCOPING",
              "progress": "In Progress",
              "displayOrder": 1
            },
            {
              "stage": "Intake",
              "stageId": 2,
              "stageCode": "DATA_INTAKE",
              "progress": "In Progress",
              "displayOrder": 2
            },
            {
              "stage": "Reporting",
              "stageId": 3,
              "stageCode": "REPORTING",
              "progress": "Not Started",
              "displayOrder": 3
            },
            {
              "stage": "Client review",
              "stageId": 4,
              "stageCode": "CLIENT_REVIEW",
              "progress": "Not Started",
              "displayOrder": 4
            },
            {
              "stage": "Submission",
              "stageId": 5,
              "stageCode": "SUBMISSION",
              "progress": "Not Started",
              "displayOrder": 5
            }
          ],
          "dueDate": "2021-05-30",
          "startDate": null,
          "period": "Q4 2021"
        }
      ]
    }
    service.getFilingSearch(1).subscribe(resp => {
      expect(resp['data'].length).toEqual(1);
    });
    let req = httpMock.expectOne(environment.apiEndpoint + 'assets/eyc-regulatory-reporting/mock/filings.json1');
    expect(req.request.method).toEqual("GET");
    req.flush(filingSearch);
    httpMock.verify();
  });

  it('should fetch filing status Observable', () => {
    const filingStatus = {
      "success": true,
      "message": "",
      "corelationId": null,
      "data": [
          {
              "stageId": 21,
              "stage": "Fund Scoping",
              "stageCode": "FUND_SCOPING",
              "progress": "COMPLETED",
              "displayOrder": 1
          },
          {
              "stageId": 22,
              "stage": "Intake",
              "stageCode": "DATA_INTAKE",
              "progress": "COMPLETED",
              "displayOrder": 2
          },
          {
              "stageId": 23,
              "stage": "Reporting",
              "stageCode": "REPORTING",
              "progress": "COMPLETED",
              "displayOrder": 3
          },
      ],
      "error": null
  }
    service.getFilingStatus(1).subscribe(resp => {
      expect(resp['data'].length).toEqual(3);
    });
    let req = httpMock.expectOne(environment.apiEndpoint + 'assets/eyc-regulatory-reporting/mock/filing-status.json');
    expect(req.request.method).toEqual("GET");
    req.flush(filingStatus);
    httpMock.verify();
  });

});
