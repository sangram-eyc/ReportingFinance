import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { RegulatoryReportingFilingService } from './regulatory-reporting-filing.service';

describe('RegulatoryReportingFilingService', () => {
  let service: RegulatoryReportingFilingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(RegulatoryReportingFilingService);
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
});
