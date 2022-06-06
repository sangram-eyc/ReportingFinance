import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, inject, TestBed } from '@angular/core/testing';
import { TaxReportingComponent } from './tax-reporting.component';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../../src/environments/environment';
import { ProductionCycleService } from '../services/production-cycle.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { AgGridModule } from 'ag-grid-angular';
import { ManagementReportsService } from '../services/management-reports.service';
import { taxenvironment } from '../../../../../../src/environments/eyc-tax-reporting/tax-environment';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
describe('TaxReportingComponent', () => {
  let component: TaxReportingComponent;
  let fixture: ComponentFixture<TaxReportingComponent>;
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
  let productionCycleService : ProductionCycleService;
  let managementReportsService: ManagementReportsService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxReportingComponent ],
      imports: [
        AgGridModule.withComponents([]),
        CommonModule,
        HttpClientModule,
        RouterTestingModule,
        HttpClientTestingModule,
        MatDialogModule
      ],
      providers: [
        ManagementReportsService,
        ProductionCycleService,
        {provide:"apiEndpoint",  useValue: environment.apiEndpoint},
        {provide:"rrproduction",  useValue: environment.production},
        {provide:"taxapiEndpoint",  useValue: taxenvironment.apiEndpoint},
        {provide:"taxProduction",  useValue: taxenvironment.production},
        {provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },]
    })
    .compileComponents();
    
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxReportingComponent);
    component = fixture.componentInstance;
    productionCycleService = TestBed.get(ProductionCycleService);
    managementReportsService = TestBed.get(ManagementReportsService);
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should check the service', () => {
    expect(productionCycleService instanceof ProductionCycleService).toBeTruthy();
    expect(managementReportsService instanceof ManagementReportsService).toBeTruthy();
  });
  it('should get completed filing data', () => {
      let resp = mockFilings;
      let filings = [];
      let activeFilings = [];
      let reportResp = [];
      spyOn(managementReportsService, 'reportsData').and.returnValue(of(resp));
      component.currentPage = 1;
      component.getActiveFilingsData();
      fixture.detectChanges();
      resp['data'].forEach((item) => {
        reportResp.push(resp);
        reportResp[0].data.length === 0 ? component.noActivatedDataAvilable = true : component.noActivatedDataAvilable = false;
        reportResp[0].data.forEach((item) => {
        const eachitem: any = {
          name: item.name,
          author: item.author,
          createdDate: item.createdDate,
          downloadUrl: item.downloadUrl
        };
        activeFilings.push(eachitem);
        });
      });
      expect(component.activeReports).toEqual(activeFilings);
  });
  it('should call getCompletedProductCyclesData', fakeAsync(()=> {
    let listUsers = []
    fixture.detectChanges();
    const result$ = productionCycleService.getProductionCycles();
    result$.subscribe(resp  => {
      resp['data'].forEach((item) => {
        const eachitem: any = {
          name: item.name,
          id: item.id,
          totalFunds: item.fundCount != null ? item.fundCount.fundTotalCount : 0,
          dataToChart: [
            {
              "in EY tax preparation": item.fundCount != null ? item.fundCount.fundCountByStatus[0].fundCount : 0,
              "in client review": item.fundCount != null ? item.fundCount.fundCountByStatus[1].fundCount: 0,
              "Approved by client": item.fundCount != null ? item.fundCount.fundCountByStatus[2].fundCount: 0,
            }
          ]  
        };
        listUsers.push(eachitem);
      });
    })
    expect(component.completedReports).toEqual(listUsers);
  }));
  it('searchFilingValidation method should validate search and retrun false',()=>{
    let data = {
      keyCode:'abcd',
      preventDefault:()=>{}
    }
    spyOn(data,'preventDefault')
    let result = component.searchFilingValidation(data);
    expect(data.preventDefault).toHaveBeenCalled();
    expect(result).toEqual(false)
  });
  it('should format date', () => {
    expect(component.formatDate(1624288509000)).toEqual('06/21/2021');
  });
  it('isFirstColumn method should set first colummn', () => {
    let mockData = {
      data: {
        approved: false
      },
      columnApi: {
        getAllDisplayedColumns: () => {
          return [{ column: '' }]
        }
      }
    }
    expect(component.isFirstColumn(mockData)).toEqual(false);
  });
  it('should call handleGridReady', () => {
    component.handleGridReady({api: ''});
    expect(component.gridApi).toEqual('');
  });
  it('should change tab to selected', () => {
    component.reportTabChange(3);
    expect(component.tabIn).toEqual(3);
  });
  
  it('should validate characters in search`', () => {
    const test1 = { keyCode: 65, preventDefault: function() {}};
    const test2 = { keyCode: 48, preventDefault: function() {} };
    const test3 = { keyCode: 164, preventDefault: function() {} };
    expect(component.searchFilingValidation(test1)).toEqual(true);
    expect(component.searchFilingValidation(test2)).toEqual(true);
    expect(component.searchFilingValidation(test3)).toEqual(false);
  });
});
