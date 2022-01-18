import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { RegulatoryReportingFilingService } from '../services/regulatory-reporting-filing.service';

import { RegulatoryReportingFilingComponent } from './regulatory-reporting-filing.component';
import { of } from 'rxjs';
import { MotifButtonModule, MotifCardModule, MotifFormsModule, MotifIconModule, MotifPaginationModule, MotifProrgressIndicatorsModule, MotifTableModule } from '@ey-xd/ng-motif';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../../src/environments/environment';
import { EycRrSettingsService } from '../../services/eyc-rr-settings.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { AgGridModule } from 'ag-grid-angular';
describe('RegulatoryReportingFilingComponent', () => {
  let component: RegulatoryReportingFilingComponent;
  let fixture: ComponentFixture<RegulatoryReportingFilingComponent>;
  let filingService: RegulatoryReportingFilingService;
  let mockFilings = {
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegulatoryReportingFilingComponent ],
      imports: [
        AgGridModule.withComponents([]),
        CommonModule,
        MotifCardModule,
        MotifButtonModule,
        MotifFormsModule,
        MotifIconModule,
        MotifProrgressIndicatorsModule,
        MotifTableModule,
        HttpClientModule,
        MotifPaginationModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [RegulatoryReportingFilingService,
        EycRrSettingsService,
        {provide:"apiEndpoint",  useValue: environment.apiEndpoint},
        {provide:"rrproduction",  useValue: environment.production}]
    })
    .compileComponents();
    fixture = TestBed.createComponent(RegulatoryReportingFilingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    filingService = TestBed.get(RegulatoryReportingFilingService);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getFilingsData and return list of flilingsData', async(()=> {
    let activeFilings = []
    // spyOn(filingService, 'getFilings').and.returnValue(of(response))
    fixture.detectChanges();
    const result$ = filingService.getFilings();
    result$.subscribe(resp  => {
      resp['data'].forEach((item) => {
        const eachitem: any  = {
          name: item.filingName,
          dueDate: item.dueDate,
          startDate: item.startDate,
          comments: [],
          status: item.filingStatus,
          filingName: item.filingName,
          period: item.period,
          filingId: item.filingId
        };
        activeFilings.push(eachitem);
      });
      expect(component.activeFilings).toEqual(activeFilings);
    })
    
  }));


  it('should format date', () => {
    expect(component.formatDate(1624288509000)).toEqual('06/21/2021');
  });

  it('should change tab to selected', () => {
    component.reportTabChange(3);
    expect(component.tabIn).toEqual(3);
  });

  it('should get active filing data', () => {
    let resp = mockFilings;
    let filings = [];
    spyOn(filingService, 'getFilings').and.returnValue(of(resp));
    // spyOn(filingService, 'getFilingsHitory').and.returnValue(of(resp2));
    component.getActiveFilingsData();
    fixture.detectChanges();
    resp['data'].forEach((item) => {
      const eachitem: any = {
        name: item.filingName,
        dueDate: item.dueDate,
        startDate: item.startDate,
        comments: [],
        status: item.filingStatus,
        filingName: item.filingName,
        period: item.period,
        filingId: item.filingId
      };
      filings.push(eachitem);
    });
    expect(component.activeFilings).toEqual(filings);
  });

  it('should get completed filing data', () => {
    let resp = mockFilings;
    let filings = [];
    spyOn(filingService, 'getFilingsHistory').and.returnValue(of(resp));
    component.currentPage = 1;
    component.noOfCompletdFilingRecords = 1;
    component.getCompletedFilingsData();
    component.noCompletedDataAvilable =  false;
    component.noActivatedDataAvilable = false;
    fixture.detectChanges();
    resp['data'].forEach((item) => {
      const eachitem: any = {
        name: item.filingName + ' // ' + item.period,
        period: item.period,
        dueDate: item.dueDate,
        startDate: item.startDate,
        comments: [],
        status: item.filingStatus
      };
      filings.push(eachitem);
    });
    expect(component.completedFilings).toEqual(filings);
  });

  it('should validate characters in search`', () => {
    const test1 = { keyCode: 65, preventDefault: function() {}};
    const test2 = { keyCode: 48, preventDefault: function() {} };
    const test3 = { keyCode: 164, preventDefault: function() {} };
    expect(component.searchFilingValidation(test1)).toEqual(true);
    expect(component.searchFilingValidation(test2)).toEqual(true);
    expect(component.searchFilingValidation(test3)).toEqual(false);
  });

  // it('grid API is available after `detectChanges`', () => {
  //   fixture.detectChanges();
  //   expect(component.gridApi).toBeTruthy();
  // });

  // it('should populate grid cells as expected', () => {
  //   component.funds = dummyFunds;
  //   component.createFundRowData();
  //   fixture.detectChanges();
  //   const hostElement = fixture.nativeElement;
  //   const cellElements = hostElement.querySelectorAll('.ag-cell-value');
  //   expect(cellElements.length).toEqual(20);
  // });

  // it('should search table', () => {
  //   component.funds = dummyFunds;
  //   component.createFundRowData();
  //   fixture.detectChanges();
  //   const hostElement = fixture.nativeElement;
  //   // component.gridApi.setQuickFilter('19614013');
  //   const input = {
  //     el: {
  //       nativeElement: {
  //         value: '19614013'
  //       }
  //     }
  //   }
  //   component.searchFunds(input);
  //   const cellElements = hostElement.querySelectorAll('.ag-cell-value');
  //   expect(cellElements.length).toEqual(4);
  // })


});
