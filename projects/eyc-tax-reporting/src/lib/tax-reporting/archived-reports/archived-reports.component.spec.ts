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
import {
  MotifCardModule,
  MotifFormsModule,
  MotifIconModule,
  MotifModalModule,
  MotifTableModule,
  MotifToastModule,
} from '@ey-xd/ng-motif';
import { NO_ERRORS_SCHEMA } from '@angular/core';

const stubArchivedReportsService = jasmine.createSpyObj(
  'archivedReportsService',
  ['getArchivedReportsData']
);
describe('ArchivedReportsComponent', () => {
  let component: ArchivedReportsComponent;
  let fixture: ComponentFixture<ArchivedReportsComponent>;
  let service: ArchivedReportsService;
  let mockedReports = {
    success: true,
    message: '',
    corelationId: '1b0d7670-0fce-4b9c-ae76-4514e392a19a',
    data: [
      {
        name: '2021.10.31 Estimates',
        id: '01KV7KIYEG5XYXPXQ7X5EZHUFTQAJCV5H3',
        fundCount: 12,
        totalComments: 24,
        dueDate: '12/23/2021',
        dateSubmitted: '12/23/2021',
        submittedBy: 'Savannah Nguyen',
        year: 2021,
      },
      {
        name: 'JUN 2021 Estimate',
        id: '01KV7KIYEG5XYXPXQ7X5EZHUFTQAJCV5H3',
        fundCount: 33,
        totalComments: 23,
        dueDate: '12/23/2021',
        dateSubmitted: '12/23/2021',
        submittedBy: 'Savannah Nguyen',
        year: 2021,
      },
      {
        name: '2021.10.31 Estimates',
        id: '01KV7KIYEG5XYXPXQ7X5EZHUFTQAJCV5H3',
        fundCount: 44,
        totalComments: 23,
        dueDate: '12/23/2021',
        dateSubmitted: '12/23/2021',
        submittedBy: 'Savannah Nguyen',
        year: 2021,
      },
      {
        name: '2021.10.22 Estimates',
        id: '01KV7KIYEG5XYXPXQ7X5EZHUFTQAJCV5H3',
        fundCount: 14,
        totalComments: 342,
        dueDate: '12/23/2021',
        dateSubmitted: '12/23/2021',
        submittedBy: 'Savannah Nguyen',
        year: 2021,
      },
      {
        name: '2021.10.31 Estimates',
        id: '01KV7KIYEG5XYXPXQ7X5EZHUFTQAJCV5H3',
        fundCount: 75,
        totalComments: 33,
        dueDate: '12/23/2021',
        dateSubmitted: '12/23/2021',
        submittedBy: 'Savannah Nguyen',
        year: 2021,
      },
      {
        name: '2021.10.31 Estimates',
        id: '01KV7KIYEG5XYXPXQ7X5EZHUFTQAJCV5H3',
        fundCount: 12,
        totalComments: 24,
        dueDate: '12/23/2021',
        dateSubmitted: '12/23/2021',
        submittedBy: 'Savannah Nguyen',
        year: 2021,
      },
      {
        name: 'JUN 2021 Estimate',
        id: '01KV7KIYEG5XYXPXQ7X5EZHUFTQAJCV5H3',
        fundCount: 33,
        totalComments: 23,
        dueDate: '12/23/2021',
        dateSubmitted: '12/23/2021',
        submittedBy: 'Savannah Nguyen',
        year: 2021,
      },
      {
        name: '2021.10.31 Estimates',
        id: '01KV7KIYEG5XYXPXQ7X5EZHUFTQAJCV5H3',
        fundCount: 44,
        totalComments: 23,
        dueDate: '12/23/2021',
        dateSubmitted: '12/23/2021',
        submittedBy: 'Savannah Nguyen',
        year: 2021,
      },
      {
        name: '2021.10.22 Estimates',
        id: '01KV7KIYEG5XYXPXQ7X5EZHUFTQAJCV5H3',
        fundCount: 14,
        totalComments: 342,
        dueDate: '12/23/2021',
        dateSubmitted: '12/23/2021',
        submittedBy: 'Savannah Nguyen',
        year: 2021,
      },
      {
        name: '2021.10.31 Estimates',
        id: '01KV7KIYEG5XYXPXQ7X5EZHUFTQAJCV5H3',
        fundCount: 75,
        totalComments: 33,
        dueDate: '12/23/2021',
        dateSubmitted: '12/23/2021',
        submittedBy: 'Savannah Nguyen',
        year: 2021,
      },
      {
        name: '2021.10.22 Estimates',
        id: '01KV7KIYEG5XYXPXQ7X5EZHUFTQAJCV5H3',
        fundCount: 14,
        totalComments: 342,
        dueDate: '12/23/2021',
        dateSubmitted: '12/23/2021',
        submittedBy: 'Savannah Nguyen',
        year: 2021,
      },
      {
        name: '2021.10.31 Estimates',
        id: '01KV7KIYEG5XYXPXQ7X5EZHUFTQAJCV5H3',
        fundCount: 75,
        totalComments: 33,
        dueDate: '12/23/2021',
        dateSubmitted: '12/23/2021',
        submittedBy: 'Savannah Nguyen',
        year: 2021,
      },
      {
        name: '2020.10.31 Estimates',
        id: '01KV7KIYEG5XYXPXQ7X5EZHUFTQAJCV5H3',
        fundCount: 12,
        totalComments: 24,
        dueDate: '12/23/2020',
        dateSubmitted: '12/23/2020',
        submittedBy: 'Savannah Nguyen',
        year: 2020,
      },
      {
        name: 'JUN Estimate',
        id: '01KV7KIYEG5XYXPXQ7X5EZHUFTQAJCV5H3',
        fundCount: 33,
        totalComments: 23,
        dueDate: '12/23/2020',
        dateSubmitted: '12/23/2020',
        submittedBy: 'Savannah Nguyen',
        year: 2020,
      },
      {
        name: '2020.10.31 Estimates',
        id: '01KV7KIYEG5XYXPXQ7X5EZHUFTQAJCV5H3',
        fundCount: 44,
        totalComments: 23,
        dueDate: '12/23/2020',
        dateSubmitted: '12/23/2020',
        submittedBy: 'Savannah Nguyen',
        year: 2020,
      },
      {
        name: '2020.10.22 Estimates',
        id: '01KV7KIYEG5XYXPXQ7X5EZHUFTQAJCV5H3',
        fundCount: 14,
        totalComments: 342,
        dueDate: '12/23/2020',
        dateSubmitted: '12/23/2020',
        submittedBy: 'Savannah Nguyen',
        year: 2020,
      },
      {
        name: '2020.10.31 Estimates',
        id: '01KV7KIYEG5XYXPXQ7X5EZHUFTQAJCV5H3',
        fundCount: 75,
        totalComments: 33,
        dueDate: '12/23/2020',
        dateSubmitted: '12/23/2020',
        submittedBy: 'Savannah Nguyen',
        year: 2020,
      },
      {
        name: '2019.10.31 Estimates',
        id: '01KV7KIYEG5XYXPXQ7X5EZHUFTQAJCV5H3',
        fundCount: 12,
        totalComments: 24,
        dueDate: '12/23/2019',
        dateSubmitted: '12/23/2019',
        submittedBy: 'Savannah Nguyen',
        year: 2019,
      },
      {
        name: 'JUN 2019 Estimate',
        id: '01KV7KIYEG5XYXPXQ7X5EZHUFTQAJCV5H3',
        fundCount: 33,
        totalComments: 23,
        dueDate: '12/23/2019',
        dateSubmitted: '12/23/2019',
        submittedBy: 'Savannah Nguyen',
        year: 2019,
      },
      {
        name: '2019.10.31 Estimates',
        id: '01KV7KIYEG5XYXPXQ7X5EZHUFTQAJCV5H3',
        fundCount: 44,
        totalComments: 23,
        dueDate: '12/23/2019',
        dateSubmitted: '12/23/2019',
        submittedBy: 'Savannah Nguyen',
        year: 2019,
      },
      {
        name: '2019.10.22 Estimates',
        id: '01KV7KIYEG5XYXPXQ7X5EZHUFTQAJCV5H3',
        fundCount: 14,
        totalComments: 342,
        dueDate: '12/23/2019',
        dateSubmitted: '12/23/2019',
        submittedBy: 'Savannah Nguyen',
        year: 2019,
      },
      {
        name: '2019.10.31 Estimates',
        id: '01KV7KIYEG5XYXPXQ7X5EZHUFTQAJCV5H3',
        fundCount: 75,
        totalComments: 33,
        dueDate: '12/23/2019',
        dateSubmitted: '12/23/2019',
        submittedBy: 'Savannah Nguyen',
        year: 2019,
      },
      {
        name: '2019.11.31 Estimates',
        id: '01KV7KIYEG5XYXPXQ7X5EZHUFTQAJCV5H3',
        fundCount: 75,
        totalComments: 33,
        dueDate: '12/23/2019',
        dateSubmitted: '12/23/2019',
        submittedBy: 'Savannah Nguyen',
        year: 2019,
      },
    ],
    error: null,
  };
  let archivedReportsServiceStub = {
    getArchivedReportsData: () => {
      return of(mockedReports);
    },
  };
  let stubArchivedReportsService: jasmine.SpyObj<ArchivedReportsService>;
  beforeEach(async(() => {
    stubArchivedReportsService = jasmine.createSpyObj(
      'archivedReportsService',
      ['getArchivedReportsData']
    );
    TestBed.configureTestingModule({
      declarations: [ArchivedReportsComponent],
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
        AgGridModule.withComponents([]),
      ],
      providers: [
        ArchivedReportsService,
        {
          provide: ArchivedReportsService,
          useValue: stubArchivedReportsService,
        },
        { provide: 'apiEndpoint', useValue: environment.apiEndpoint },
        { provide: 'taxapiEndpoint', useValue: taxenvironment.apiEndpoint },
        { provide: 'taxProduction', useValue: taxenvironment.production },
        { provide: 'rrproduction', useValue: environment.production },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivedReportsComponent);
    stubArchivedReportsService.getArchivedReportsData.and.returnValue(
      of(mockedReports)
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = TestBed.get(ArchivedReportsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('ngOnInit method should call getArchivedReportData', () => {
    spyOn(component, 'getArchivedReportData');
    component.ngOnInit()
    expect(component.getArchivedReportData).toHaveBeenCalled();
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
    let archivedReportData: any = [];
    mockedReports.data.forEach((item) => {
      const eachitem: any = {
        name: item.name,
        id: item.id,
        fundCount: item.fundCount != null ? item.fundCount : 0,
        totalComments: item.totalComments != null ? item.totalComments : 0,
        year: item.year,
      };
      archivedReportData.push(eachitem);
    });
    expect(component.completedReports).toEqual(archivedReportData);
  });

  it('should call getArchivedReportData from the service', () => {
    spyOn(component, 'createHistoryRowData');
    component.getArchivedReportData('2010');
    expect(
      component['archivedReportsService'].getArchivedReportsData
    ).toHaveBeenCalled();
  });

  it('createHistoryRowData method should filter by year', () => {
    let mockedRowData: any = [];
    let _filterYear = '2021';
    component.createHistoryRowData(_filterYear);
    let mockedFilteredReports = _filterYear
      ? component.completedReports.filter((item) => item.year == _filterYear)
      : component.completedReports;
    mockedFilteredReports.forEach((reportRow) => {
      mockedRowData.push({
        name: reportRow.name,
        id: reportRow.id,
        fundCount: reportRow.fundCount,
        totalComments: reportRow.totalComments,
      });
    });
    expect(component.filteredReports).toEqual(mockedFilteredReports);
    expect(component.rowData).toEqual(mockedRowData);
  });

  it('onPasteSearchActiveReports method should search data on paste', () => {
    const pasteData = new DataTransfer();
    pasteData.setData('text', 'asd');
    const pasteEvent = new ClipboardEvent('paste', {
      clipboardData: pasteData,
    } as any);
    component.onPasteSearchActiveReports(pasteEvent);
  });

  it('searchCompleted method should set gridapi Quick filter', () => {
    let mockInput: any = {
      el: {
        nativeElement: {
          value: 'data',
        },
      },
    };
    let mockGridApi = {
      setQuickFilter: () => {},
      rowModel: {
        rowsToDisplay: [],
      },
    };
    component.gridApi = mockGridApi;
    component.searchCompleted(mockInput);
    expect(component.searchNoDataAvilable).toEqual(true);
  });

  it(`searchFilingValidation`, () => {
    let keyEvent = new KeyboardEvent('keyCode', { key: 'abc' });
    const checkVal = component.searchFilingValidation(keyEvent);
    expect(checkVal).toBeFalsy();
  });

  it('should format date', () => {
    expect(component.formatDate(1624288509000)).toEqual('06/21/2021');
  });

  it('isFirstColumn method should set first colummn', () => {
    let mockData = {
      data: {
        approved: false,
      },
      columnApi: {
        getAllDisplayedColumns: () => {
          return [{ column: '' }];
        },
      },
    };
    expect(component.isFirstColumn(mockData)).toEqual(false);
  });

  it('handleGridReady method should set grid', () => {
    let mockData = {
      api: '/data',
    };
    component.handleGridReady(mockData);
    expect(component.gridApi).toEqual('/data');
  });
  it('searchGrid method should set quick filter and set searchNoDataAvilable variable', () => {
    let mockedGrid = {
      setQuickFilter: (input) => {
        return [{ column: '' }];
      },
      rowModel: {
        rowsToDisplay: 1,
      },
    };
    component.gridApi = mockedGrid;
    component.searchGrid(mockedGrid);
    expect(component.searchNoDataAvilable).toEqual(false);
  });
  it('onGridReady method should set the gridApi params and size columns', () => {
    let mockedGrid = {
      sizeColumnsToFit: () => {
        return [{ column: '' }];
      },
    };
    component.onGridReady({ api: mockedGrid });
  });
  it('getReportYear method should call createHistoryRowData', () => {
    let mockID = 'option1';
    let mockFilterYear = '2021';
    spyOn(component, 'createHistoryRowData');
    component.getReportYear(mockID, mockFilterYear);
    expect(component.createHistoryRowData).toHaveBeenCalledWith(mockFilterYear);
  });
});
