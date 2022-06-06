import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '../../../../../../src/environments/environment';
import { taxenvironment } from '../../../../../../src/environments/eyc-tax-reporting/tax-environment';
import { ArchivedReportsComponent } from './archived-reports.component';
import { ArchivedReportsService } from '../services/archived-reports.service';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AgGridModule } from 'ag-grid-angular';
import { MotifCardModule, MotifFormsModule, MotifIconModule, MotifModalModule, MotifTableModule, MotifToastModule } from '@ey-xd/ng-motif';
describe('ArchivedReportsComponent', () => {
  let component: ArchivedReportsComponent;
  let fixture: ComponentFixture<ArchivedReportsComponent>;
  let service : ArchivedReportsService;
  let mockedReports = {
    "success": true,
    "message": "",
    "corelationId": "1b0d7670-0fce-4b9c-ae76-4514e392a19a",
    "data": [
        {
            "name": "2021.10.31 Estimates",
            "id": "01KV7KIYEG5XYXPXQ7X5EZHUFTQAJCV5H3",
            "fundCount": 12,
            "totalComments":24,
            "dueDate":"12/23/2021",
            "dateSubmitted":"12/23/2021",
            "submittedBy":"Savannah Nguyen",
            "year": 2021
        },
        {
            "name": "JUN 2021 Estimate",
            "id": "01KV7KIYEG5XYXPXQ7X5EZHUFTQAJCV5H3",
            "fundCount": 33,
            "totalComments":23,
            "dueDate":"12/23/2021",
            "dateSubmitted":"12/23/2021",
            "submittedBy":"Savannah Nguyen",
            "year": 2021
        },   
    ],
    "error": null
  };
  let archivedReportsServiceStub = {
    getArchivedReportsData: () => {return of(mockedReports)},
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchivedReportsComponent ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        MotifModalModule,
        MotifFormsModule,
        MotifCardModule,
        MotifIconModule,
        MotifToastModule,
        MotifTableModule,
        AgGridModule.withComponents([])
      ],
      providers: [
        ArchivedReportsService,
        {provide: ArchivedReportsService,  useValue: archivedReportsServiceStub},
        {provide:"apiEndpoint",  useValue: environment.apiEndpoint},
        {provide:"taxapiEndpoint",  useValue: taxenvironment.apiEndpoint},
        {provide:"taxProduction",  useValue: taxenvironment.production},
        {provide:"rrproduction",  useValue: environment.production},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivedReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = TestBed.get(ArchivedReportsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should set variables', () => {
    expect(component.rowClass).toEqual('row-style');
    expect(component.rowStyle.height).toEqual('74px');
    expect(component.domLayout).toEqual('autoHeight');
    expect(component.currentPage).toEqual(0);
    expect(component.maxPages).toEqual(5);
    expect(component.searchNoDataAvilable).toEqual(false);
    expect(component.activeReportsSearchNoDataAvilable).toEqual(false);
    expect(component.noActivatedDataAvilable).toEqual(false);

  });
  it('getArchivedReportData method should fetch ReportData', () => {
    fixture.detectChanges();
    let archivedReportData = [];
    let mockedReport = {
      "success": true,
      "message": "",
      "corelationId": "1b0d7670-0fce-4b9c-ae76-4514e392a19a",
      "data": [
          {
              "name": "2021.10.31 Estimates",
              "id": "01KV7KIYEG5XYXPXQ7X5EZHUFTQAJCV5H3",
              "fundCount": 12,
              "totalComments":24,
              "dueDate":"12/23/2021",
              "dateSubmitted":"12/23/2021",
              "submittedBy":"Savannah Nguyen",
              "year": 2021
          },
          {
              "name": "JUN 2021 Estimate",
              "id": "01KV7KIYEG5XYXPXQ7X5EZHUFTQAJCV5H3",
              "fundCount": 33,
              "totalComments":23,
              "dueDate":"12/23/2021",
              "dateSubmitted":"12/23/2021",
              "submittedBy":"Savannah Nguyen",
              "year": 2021
          },   
      ],
      "error": null
    };
    mockedReport.data.forEach((item) => {
      const eachitem: any = {
        name: item.name,
        id: item.id,
        fundCount: item.fundCount != null ? item.fundCount : 0,
        totalComments: item.totalComments != null ? item.totalComments : 0,
        year: item.year
      };
      archivedReportData.push(eachitem);
    });
    expect(component.completedReports).toEqual(archivedReportData);
  });

  it('should call getArchivedReportData from the service', () => {
    let mockResp = {
        data: mockedReports
    }
    spyOn(component['archivedReportsService'], 'getArchivedReportsData').and.callFake(() => {
      return of(mockResp)
    });
    spyOn(component, 'createHistoryRowData');
    component.getArchivedReportData('2010');
    expect(component['archivedReportsService'].getArchivedReportsData).toHaveBeenCalled();
  });

  it('createHistoryRowData method should filter by year', () => {
    let mockedRowData = [];
    let mockedFilteredData = [];
    component.createHistoryRowData('2021');
    mockedReports.data.forEach((reportRow) =>{
      mockedRowData.push({
        name: reportRow.name,
        id: reportRow.id,
        fundCount: reportRow.fundCount,
        totalComments: reportRow.totalComments,
      });
      mockedFilteredData.push({
        name: reportRow.name,
        id: reportRow.id,
        fundCount: reportRow.fundCount,
        totalComments: reportRow.totalComments,
        year: reportRow.year
      });
    })
    expect(component.filteredReports).toEqual(mockedFilteredData);
    expect(component.rowData).toEqual(mockedRowData);
  });

  it('onPasteSearchActiveReports method should search data on paste',()=>{
    const pasteData = new DataTransfer();
    pasteData.setData('text', 'asd');
    const pasteEvent = new ClipboardEvent('paste', {
      clipboardData: pasteData
    } as any);
    component.onPasteSearchActiveReports(pasteEvent);
  });

  it('searchCompleted method should set gridapi Quick filter', () => {
    let mockInput:any = {el : {
      nativeElement : {
        value : 'data'
      }
    }};
    let mockGridApi = {
      setQuickFilter: () => {},
      rowModel: {
        rowsToDisplay: []}
    };
    component.gridApi = mockGridApi;
    component.searchCompleted(mockInput);
    expect(component.searchNoDataAvilable).toEqual(true);
  });
   
  it( `searchFilingValidation`, () => {
    let keyEvent = new KeyboardEvent('keyCode', {key: "abc"},);
    const checkVal = component.searchFilingValidation(keyEvent);
    expect(checkVal).toBeFalsy();
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
  })

  it('handleGridReady method should set grid', () => {
    let mockData = {
      api: '/data'
    };
    component.handleGridReady(mockData);
    expect(component.gridApi).toEqual('/data')
  });
  
  it(`getReportYear should set and remove classes`, () => {
    let id = 'option1';
    component.getReportYear(id, '2021');
    spyOn(component, 'createHistoryRowData');
    expect(component.createHistoryRowData).not.toHaveBeenCalled();
  });
});
