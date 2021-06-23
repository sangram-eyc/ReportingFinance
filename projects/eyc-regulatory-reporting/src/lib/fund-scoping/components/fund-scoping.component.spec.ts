import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RegulatoryReportingFilingComponent } from '../../regulatory-reporting-filing/components/regulatory-reporting-filing.component';
import { EycRegulatoryReportingModule } from '../../eyc-regulatory-reporting.module';
import { FundScopingComponent } from './fund-scoping.component';
import { EycRrSettingsService } from '../../services/eyc-rr-settings.service';
import { environment } from '../../../../../../src/environments/environment';
import { FundScopingService } from '../services/fund-scoping.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { MotifCardModule, MotifFormsModule, MotifIconModule, MotifModalModule, MotifTableCellRendererComponent, MotifTableModule, MotifToastModule } from '@ey-xd/ng-motif';
import { TableHeaderRendererComponent } from '../../shared/table-header-renderer/table-header-renderer.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DotsCardComponent } from '../../shared/dots-card/dots-card.component';
import { RegulatoryReportingFilingService } from '../../regulatory-reporting-filing/services/regulatory-reporting-filing.service';

describe('FundScopingComponent', () => {
  let component: FundScopingComponent;
  let fixture: ComponentFixture<FundScopingComponent>;
  let fundScopingService: FundScopingService;
  let dummyFunds = [
    {
      "name": "Goldman Sachs China A-Share Equity Portfolio",
      "code": "19614011",
      "id": "PV100356"
    },
    {
      "name": "Goldman Sachs China B-Share Equity Portfolio",
      "code": "19614012",
      "id": "PV100357"
    },
    {
      "name": "Goldman Sachs China C-Share Equity Portfolio",
      "code": "19614013",
      "id": "PV100358"
    },
    {
      "name": "Goldman Sachs China D-Share Equity Portfolio",
      "code": "19614014",
      "id": "PV100359"
    },
    {
      "name": "Goldman Sachs China E-Share Equity Portfolio",
      "code": "19614015",
      "id": "PV100360"
    }
  ]
  let mockDetails = {
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
  }
  let mockStatus = {
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
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundScopingComponent ],
      imports: [ 
        CommonModule,
        RouterTestingModule,
        HttpClientModule,
        HttpClientTestingModule,
        FormsModule,
        MotifModalModule,
        MotifFormsModule,
        MotifCardModule,
        MotifIconModule,
        MotifToastModule,
        MotifTableModule,
        AgGridModule.withComponents([])
      ],
      providers: [
        FundScopingService,
        {provide:"apiEndpoint",  useValue: environment.apiEndpoint},
        {provide:"rrproduction",  useValue: environment.production}
      ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(FundScopingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    fundScopingService = TestBed.get(FundScopingService);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check the service', () => {
    expect(fundScopingService instanceof FundScopingService).toBeTruthy();
  });

  it("should call getFundScopingDetails and return list of funds", async(() => {
    const resp = mockDetails;
    const fundTest = [];
    const filingDetails = {
      filingName: 'Form PF',
      period: 'Q4 2021',
      filingId: 1
    };
    spyOn(fundScopingService, 'getFundScopingDetails').and.returnValue(of(resp));
    component.receiveFilingDetails(filingDetails);
    fixture.detectChanges();
    resp['data'].forEach((item) => {
      const eachitem: any  = {
        name: item.fundName,
        code: item.fundCode,
        id: item.fundId
      };
      fundTest.push(eachitem);
    })
    expect(component.funds).toEqual(fundTest);
  }));

  it("should call getFundScopingStatus and return list of fund status", async(() => {
    const resp = mockStatus;
    const fundTest = [];
    const filingDetails = {
      filingName: 'Form PF',
      period: 'Q4 2021',
      filingId: 1
    };
    spyOn(fundScopingService, 'getFundScopingStatus').and.returnValue(of(resp));
    component.receiveFilingDetails(filingDetails);
    fixture.detectChanges();
    expect(component.fundScopingStatus).toEqual(resp['data']);
  }));

  it('should call onSubmitApproveFund and close modal', () => {
    const resp = [];
    component.filingDetails = {filingId: 1};
    component.fundScopingStatus = [{stageId: 61}];
    spyOn(fundScopingService, 'approveFundScopingStatus').and.returnValue(of(resp));
    component.onSubmitApproveFunds();
    fixture.detectChanges();
    expect(component.approveModal).toEqual(false);
  })

  it('should validate characters in search`', () => {
    const test1 = { keyCode: 65, preventDefault: function() {}};
    const test2 = { keyCode: 48, preventDefault: function() {} };
    const test3 = { keyCode: 164, preventDefault: function() {} };
    expect(component.searchFilingValidation(test1)).toEqual(true);
    expect(component.searchFilingValidation(test2)).toEqual(true);
    expect(component.searchFilingValidation(test3)).toEqual(false);
  });

  it('grid API is available after `detectChanges`', () => {
    fixture.detectChanges();
    expect(component.gridApi).toBeTruthy();
  });

  it('should populate grid cells as expected', () => {
    component.funds = dummyFunds;
    component.createFundRowData();
    fixture.detectChanges();
    const hostElement = fixture.nativeElement;
    const cellElements = hostElement.querySelectorAll('.ag-cell-value');
    expect(cellElements.length).toEqual(20);
  });

  it('should search table', () => {
    component.funds = dummyFunds;
    component.createFundRowData();
    fixture.detectChanges();
    const hostElement = fixture.nativeElement;
    // component.gridApi.setQuickFilter('19614013');
    const input = {
      el: {
        nativeElement: {
          value: '19614013'
        }
      }
    }
    component.searchFunds(input);
    const cellElements = hostElement.querySelectorAll('.ag-cell-value');
    expect(cellElements.length).toEqual(4);
  })
});
