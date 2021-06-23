import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DotsCardComponent } from './dots-card.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from '../../../../../../src/environments/environment';
import { RegulatoryReportingFilingService } from '../../regulatory-reporting-filing/services/regulatory-reporting-filing.service';
import { of } from 'rxjs';
import { resolvePtr } from 'dns';

describe('DotsCardComponent', () => {
  let component: DotsCardComponent;
  let service: RegulatoryReportingFilingService;
  let fixture: ComponentFixture<DotsCardComponent>;
  let mockFilingData = {
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
  };
  let mockFilingStatus = {
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
        {
            "stageId": 24,
            "stage": "Client review",
            "stageCode": "CLIENT_REVIEW",
            "progress": "COMPLETED",
            "displayOrder": 4
        },
        {
            "stageId": 25,
            "stage": "Submission",
            "stageCode": "SUBMISSION",
            "progress": "IN_PROGRESS",
            "displayOrder": 5
        }
    ],
    "error": null
  };
  let router = {
    navigate: jasmine.createSpy('navigate'),
    url: jasmine.createSpy('url')
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DotsCardComponent ],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        {provide: Router, useValue: router},
        {provide:"apiEndpoint",  useValue: environment.apiEndpoint},
        {provide:"rrproduction",  useValue: environment.production}
      ]
    })
    .compileComponents();
    service = TestBed.inject(RegulatoryReportingFilingService);
    fixture = TestBed.createComponent(DotsCardComponent);
    component = fixture.componentInstance;
    component.filingName = 'AIFMD';
    component.period = 'Q4 2021';
    component.dueDate = "2021-06-30";
    component.states = [
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
    ];
    fixture.detectChanges();
  }));

  it('should initialize with data', () => {
    spyOnProperty(service, 'getFilingData').and.returnValue(
      mockFilingData
    );
    fixture.detectChanges();
    component.ngOnInit()

  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('get status', () => {
    let result = component.getStatus(1);
    expect(result).toBe('In Progress');
  });


  it('dots onclick', () => {
    let pageUrl = 'client-review';
    let enableRoute = false;
    component.handleStepClick(pageUrl, enableRoute)
    expect(router.navigate).toHaveBeenCalledWith([pageUrl])
  });

  it('should format date', () => {
    component.dueDate = '2021-06-30';
    component.formatDate();
    expect(component.dueDate).toEqual('06/29/2021');
  });

  it('should get filing status', () => {
    let resp = mockFilingStatus;
    component.filingId = 1;
    spyOn(service, 'getFilingStatus').and.returnValue(of(resp));
    component.getFilingStatus();
    fixture.detectChanges();
    expect(component.states).toEqual(resp['data']);
  })

  describe('The function progressSort...', () => {
    let a = {
      displayOrder: 2
    }
    let b = {
      displayOrder: 3
    }
    it(`- should return -1 when a < b`, () => {
      let result = component.progressSort(a, b);
      expect(result).toBe(-1);
    });
    it(`- should return 1 when a > b`, () => {
      let result = component.progressSort(b, a);
      expect(result).toBe(1);
    });
    it(`- should return 0 when a === b`, () => {
      let result = component.progressSort(a, a);
      expect(result).toBe(0);
    });
  });

});
