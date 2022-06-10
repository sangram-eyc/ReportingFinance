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
  let productionCycleService : ProductionCycleService;
  let managementReportsService: ManagementReportsService;
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
  let mockedReports = {
    "success": true,
    "message": "",
    "corelationId": "1b0d7670-0fce-4b9c-ae76-4514e392a19a",
    "data": [
        {
            "name": "2021.10.31 Estimates",
            "id": "01KV7KIYEG5XYXPXQ7X5EZHUFTQAJCV5H3",
            "statusTracker": null,
            "fundCount": null
        },
        {
            "name": "2021.11.30 Estimates",
            "id": "01KV7KIYGSEE4YRXLQXBFKESDBC6JOFFLH",
            "statusTracker": null,
            "fundCount": {
                "fundTotalCount": 13,
                "fundCountByStatus": [
                    {
                        "statusName": "in EY tax preparation",
                        "fundCount": 4
                    },
                    {
                        "statusName": "in client review",
                        "fundCount": 3
                    },
                    {
                        "statusName": "Approved by client",
                        "fundCount": 6
                    }
                ]
            }
        },
        {
            "name": "2021.12.31 Estimates",
            "id": "01KV7KIYHWSXPAXR2E7FEY4FWXL22DFCX2",
            "statusTracker": null,
            "fundCount": {
                "fundTotalCount":15,
                "fundCountByStatus": [
                    {
                        "statusName": "in EY tax preparation",
                        "fundCount": 5
                    },
                    {
                        "statusName": "in client review",
                        "fundCount": 5
                    },
                    {
                        "statusName": "Approved by client",
                        "fundCount": 5
                    }
                ]
            }
        },
        {
            "name": "2022.01.31 Estimates",
            "id": "01KV7KIYBR63NX7U7DLBEKGGP7SWQ2SHB6",
            "statusTracker": null,
            "fundCount": {
                "fundTotalCount":90,
                "fundCountByStatus": [
                    {
                        "statusName": "in EY tax preparation",
                        "fundCount": 30
                    },
                    {
                        "statusName": "in client review",
                        "fundCount": 20
                    },
                    {
                        "statusName": "Approved by client",
                        "fundCount": 40
                    }
                ]
            }
        },
        {
            "name": "2021.10.31 Fiscal",
            "id": "01KV7KIYGI4HU4JSGDNJBY6PO54ARRCGNO",
            "statusTracker": null,
            "fundCount": {
                "fundTotalCount":6,
                "fundCountByStatus": [
                    {
                        "statusName": "in EY tax preparation",
                        "fundCount": 0
                    },
                    {
                        "statusName": "in client review",
                        "fundCount": 4
                    },
                    {
                        "statusName": "Approved by client",
                        "fundCount": 2
                    }
                ]
            }
        },
        {
            "name": "2021.12.31 Fiscal",
            "id": "01KV7KIYG4L4LM6GQLDBBYSXQALLCNVBM2",
            "statusTracker": null,
            "fundCount": {
                "fundTotalCount":6,
                "fundCountByStatus": [
                    {
                        "statusName": "in EY tax preparation",
                        "fundCount": 0
                    },
                    {
                        "statusName": "in client review",
                        "fundCount": 6
                    },
                    {
                        "statusName": "Approved by client",
                        "fundCount": 0
                    }
                ]
            }
        },
        {
            "name": "2021.10.31 Excise",
            "id": "01KV7KIYFWGAHTHG75WJG327UBHX5QSTUT",
            "statusTracker": null,
            "fundCount": {
                "fundTotalCount": 0,
                "fundCountByStatus": [
                    {
                        "statusName": "in EY tax preparation",
                        "fundCount": 0
                    },
                    {
                        "statusName": "in client review",
                        "fundCount": 0
                    },
                    {
                        "statusName": "Approved by client",
                        "fundCount": 0
                    }
                ]
            }
        },
        {
            "name": "2021.11.25 Excise",
            "id": "01KV7KIYG2KZMNH2KOE5EZZ7XHOJGGZUB6",
            "statusTracker": null,
            "fundCount": {
                "fundTotalCount": 0,
                "fundCountByStatus": [
                    {
                        "statusName": "in EY tax preparation",
                        "fundCount": 0
                    },
                    {
                        "statusName": "in client review",
                        "fundCount": 0
                    },
                    {
                        "statusName": "Approved by client",
                        "fundCount": 0
                    }
                ]
            }
        },
        {
            "name": "2021.12.31 Excise",
            "id": "01KV7KIYAHULIZAEVGGFGKEUY4UUJ54A3Y",
            "statusTracker": null,
            "fundCount": {
                "fundTotalCount": 21,
                "fundCountByStatus": [
                    {
                        "statusName": "in EY tax preparation",
                        "fundCount": 0
                    },
                    {
                        "statusName": "in client review",
                        "fundCount": 15
                    },
                    {
                        "statusName": "Approved by client",
                        "fundCount": 6
                    }
                ]
            }
        },
        {
            "name": "2022.01.31 Excise",
            "id": "01KV7KIYEI3G5YTFTD6RCLL7ICP4ZR4FAO",
            "statusTracker": null,
            "fundCount": {
                "fundTotalCount": 149,
                "fundCountByStatus": [
                    {
                        "statusName": "in EY tax preparation",
                        "fundCount": 39
                    },
                    {
                        "statusName": "in client review",
                        "fundCount": 110
                    },
                    {
                        "statusName": "Approved by client",
                        "fundCount": 0
                    }
                ]
            }
        },
        {
            "name": "2021.11.30 Tax Report",
            "id": "01KV7KIYFMLB3U2MLTQNEJI7RAH2XD7ICO",
            "statusTracker": null,
            "fundCount": {
                "fundTotalCount": 21,
                "fundCountByStatus": [
                    {
                        "statusName": "in EY tax preparation",
                        "fundCount": 0
                    },
                    {
                        "statusName": "in client review",
                        "fundCount": 10
                    },
                    {
                        "statusName": "Approved by client",
                        "fundCount": 11
                    }
                ]
            }
        },
        {
            "name": "2021.111.30 Tax Report",
            "id": "01KV7KIYGETUAXIY65NJAKI52NA75IML5M",
            "statusTracker": null,
            "fundCount": {
                "fundTotalCount": 21,
                "fundCountByStatus": [
                    {
                        "statusName": "in EY tax preparation",
                        "fundCount": 0
                    },
                    {
                        "statusName": "in client review",
                        "fundCount": 16
                    },
                    {
                        "statusName": "Approved by client",
                        "fundCount": 5
                    }
                ]
            }
        },
        {
            "name": "2021.1111.30 Tax Report",
            "id": "01KV7KIYEJIUP4NILSQJEKYPSRE7ZQ3ZLA",
            "statusTracker": null,
            "fundCount": {
                "fundTotalCount": 21,
                "fundCountByStatus": [
                    {
                        "statusName": "in EY tax preparation",
                        "fundCount": 2
                    },
                    {
                        "statusName": "in client review",
                        "fundCount": 19
                    },
                    {
                        "statusName": "Approved by client",
                        "fundCount": 0
                    }
                ]
            }
        },
        {
            "name": "2021.11111.30 Tax Report",
            "id": "01KV7KIYAIDU6DLLUYFJCI457XTJ7BL5JM",
            "statusTracker": null,
            "fundCount": {
                "fundTotalCount": 21,
                "fundCountByStatus": [
                    {
                        "statusName": "in EY tax preparation",
                        "fundCount": 0
                    },
                    {
                        "statusName": "in client review",
                        "fundCount": 21
                    },
                    {
                        "statusName": "Approved by client",
                        "fundCount": 0
                    }
                ]
            }
        },
        {
            "name": "2021.11112.30 Tax Report",
            "id": "01KV7KIYBY5NNVPMVB7VDJN6JJGVLXXAUS",
            "statusTracker": null,
            "fundCount": {
                "fundTotalCount": 21,
                "fundCountByStatus": [
                    {
                        "statusName": "in EY tax preparation",
                        "fundCount": 0
                    },
                    {
                        "statusName": "in client review",
                        "fundCount": 21
                    },
                    {
                        "statusName": "Approved by client",
                        "fundCount": 0
                    }
                ]
            }
        },
        {
            "name": "2021.1112.30 Tax Report",
            "id": "01KV7KIYFAFEAG5PTDOVBYCZUGDUWYHZGF",
            "statusTracker": null,
            "fundCount": {
                "fundTotalCount": 21,
                "fundCountByStatus": [
                    {
                        "statusName": "in EY tax preparation",
                        "fundCount": 0
                    },
                    {
                        "statusName": "in client review",
                        "fundCount": 21
                    },
                    {
                        "statusName": "Approved by client",
                        "fundCount": 0
                    }
                ]
            }
        },
        {
            "name": "2021.1113.30 Tax Report",
            "id": "01KV7KIYGRN4MFQA4AQNA3HZO7QQANVRWX",
            "statusTracker": null,
            "fundCount": {
                "fundTotalCount": 21,
                "fundCountByStatus": [
                    {
                        "statusName": "in EY tax preparation",
                        "fundCount": 0
                    },
                    {
                        "statusName": "in client review",
                        "fundCount": 21
                    },
                    {
                        "statusName": "Approved by client",
                        "fundCount": 0
                    }
                ]
            }
        },
        {
            "name": "2021.112.30 Tax Report",
            "id": "01KV7KIYHUL54O3Q2UXRDKHXEU5VYOKZWD",
            "statusTracker": null,
            "fundCount": {
                "fundTotalCount": 21,
                "fundCountByStatus": [
                    {
                        "statusName": "in EY tax preparation",
                        "fundCount": 1
                    },
                    {
                        "statusName": "in client review",
                        "fundCount": 20
                    },
                    {
                        "statusName": "Approved by client",
                        "fundCount": 0
                    }
                ]
            }
        },
        {
            "name": "2021.1121.30 Tax Report",
            "id": "01KV7KIYEW4TTQNWEYZBDK6QZALSQTORXF",
            "statusTracker": null,
            "fundCount": {
                "fundTotalCount": 21,
                "fundCountByStatus": [
                    {
                        "statusName": "in EY tax preparation",
                        "fundCount": 1
                    },
                    {
                        "statusName": "in client review",
                        "fundCount": 20
                    },
                    {
                        "statusName": "Approved by client",
                        "fundCount": 0
                    }
                ]
            }
        },
        {
            "name": "2021.113.30 Tax Report",
            "id": "01KV7KIYB4IBGNY3LZOVDYINNI2CLJHIRL",
            "statusTracker": null,
            "fundCount": {
                "fundTotalCount": 22,
                "fundCountByStatus": [
                    {
                        "statusName": "in EY tax preparation",
                        "fundCount": 0
                    },
                    {
                        "statusName": "in client review",
                        "fundCount": 22
                    },
                    {
                        "statusName": "Approved by client",
                        "fundCount": 0
                    }
                ]
            }
        },
        {
            "name": "2021.114.30 Tax Report",
            "id": "01KV7KIYHD4XESF43YB5FYENRD57U3FEZ3",
            "statusTracker": null,
            "fundCount": {
                "fundTotalCount": 21,
                "fundCountByStatus": [
                    {
                        "statusName": "in EY tax preparation",
                        "fundCount": 1
                    },
                    {
                        "statusName": "in client review",
                        "fundCount": 20
                    },
                    {
                        "statusName": "Approved by client",
                        "fundCount": 0
                    }
                ]
            }
        },
        {
            "name": "2021.12.31 Tax Report",
            "id": "01KV7KIYCXEEKW6EWWRRG2GDSZ4S4BV5HI",
            "statusTracker": null,
            "fundCount": {
                "fundTotalCount": 21,
                "fundCountByStatus": [
                    {
                        "statusName": "in EY tax preparation",
                        "fundCount": 0
                    },
                    {
                        "statusName": "in client review",
                        "fundCount": 21
                    },
                    {
                        "statusName": "Approved by client",
                        "fundCount": 0
                    }
                ]
            }
        },
        {
            "name": "2021.121.31 Tax Report",
            "id": "01KV7KIYCAFMTNB5WOWNDI63GSGE4TW56S",
            "statusTracker": null,
            "fundCount": {
                "fundTotalCount": 21,
                "fundCountByStatus": [
                    {
                        "statusName": "in EY tax preparation",
                        "fundCount": 0
                    },
                    {
                        "statusName": "in client review",
                        "fundCount": 21
                    },
                    {
                        "statusName": "Approved by client",
                        "fundCount": 0
                    }
                ]
            }
        },
        {
            "name": "2021.1211.31 Tax Report",
            "id": "01KV7KIYCHKHIWMDVOAJB2WZBCC4PG4IHM",
            "statusTracker": null,
            "fundCount": {
                "fundTotalCount": 21,
                "fundCountByStatus": [
                    {
                        "statusName": "in EY tax preparation",
                        "fundCount": 0
                    },
                    {
                        "statusName": "in client review",
                        "fundCount": 21
                    },
                    {
                        "statusName": "Approved by client",
                        "fundCount": 0
                    }
                ]
            }
        },
        {
            "name": "2021.122.31 Tax Report",
            "id": "01KV7KIYFWAZACV2M4TZA3XPT2OMPELAKI",
            "statusTracker": null,
            "fundCount": {
                "fundTotalCount": 21,
                "fundCountByStatus": [
                    {
                        "statusName": "in EY tax preparation",
                        "fundCount": 0
                    },
                    {
                        "statusName": "in client review",
                        "fundCount": 19
                    },
                    {
                        "statusName": "Approved by client",
                        "fundCount": 2
                    }
                ]
            }
        }
    ],
    "error": null
  };
  let productionCycleServiceStub = {
    getProductionCycles: () => {return of(mockedReports)},
    getProductionCyclesDetails: () => {return of(mockedReports)},
    getStatusTrackerLink: () => {return of(mockedReports)},
    getDownloadFile: () => {return of(mockedReports)},
    putApproveEntities: () => {return of(mockedReports)},
  };

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
        {provide: ProductionCycleService, userValue: productionCycleServiceStub},
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
  it('ngOnInit method should set variables and call getCompletedProductCyclesData function', () => {
    spyOn(component, 'getCompletedProductCyclesData');
    component.ngOnInit();
    expect(component.widthDivChart).toEqual(950);
    expect(component.colorsBarChart).toEqual(['#9C82D4', '#87D3F2', '#8CE8AD']);
    expect(component.labelsChart).toEqual(['In EY tax preparation', 'In client review', 'Approved by client']);
    expect(component.tabIn).toEqual(1);
    expect(component.getCompletedProductCyclesData).toHaveBeenCalled();
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
