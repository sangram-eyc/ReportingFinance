import { Renderer2, Type } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { datamanagedenvironment } from '../../../../../../src/environments/eyc-data-managed-services/data-managed-environment';
import { DataManagedSettingsService } from '../services/data-managed-settings.service';
import { DataManagedService } from '../services/data-managed.service';
import { EycDataApiService } from '../services/eyc-data-api.service';
import { DataIntakeComponent } from './data-intake.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { MotifCardModule, MotifButtonModule, MotifIconModule, MotifFormsModule, MotifTabBarModule, MotifBreadcrumbModule, MotifChipModule, MotifToastModule } from '@ey-xd/ng-motif';
import { formatDate } from '@angular/common';
import { of } from 'rxjs';
import { DataSummary } from '../models/data-summary.model';
import { DATA_FREQUENCY, DATA_INTAKE_TYPE, FILTER_TYPE } from '../../config/dms-config-helper';

describe('DataIntakeComponent', () => {
  let component: DataIntakeComponent;
  let fixture: ComponentFixture<DataIntakeComponent>;
  let dataManagedService: DataManagedService;
  let httpQueryParams: DataSummary;
  let innerTabIn: number;
  let mockFileSummaries = {
    "success": true,
    "message": "",
    "corelationId": "1293081023",
    "data": [
      {
        "totalCount": 98,
        "dataProvideCount": 3,
        "dataDomainCount": 6,
        "totalSeriesItem": [
          {
            "label": "noIssues",
            "value": 84,
            "seriesItemDTO": [{ "name": "General Ledger", "value": 40 }, { "name": "Positions", "value": 19 }]
          },
          {
            "label": "mediumLow",
            "value": 3,
            "seriesItemDTO": [{ "name": "Positions", "value": 2 }, { "name": "Entity", "value": 1 }]
          },
          {
            "label": "high",
            "value": 4,
            "seriesItemDTO": [{ "name": "Positions", "value": 2 }, { "name": "Entity", "value": 2 }]
          },
          {
            "label": "missingFiles",
            "value": 4,
            "seriesItemDTO": [{ "name": "Positions", "value": 2 }, { "name": "Entity", "value": 2 }]
          }
        ]
      }
    ],
    "error": null
  };
  let mockFileSummariesNoRecords = {
    "success": true,
    "message": "",
    "corelationId": "1293081023",
    "data": [
      {
        "totalCount": 98,
        "dataProvideCount": 3,
        "dataDomainCount": 6,
        "totalSeriesItem": []
      }
    ],
    "error": null
  };
  let mockFileSummariesFileNotReceived = {
    "success": true,
    "message": "",
    "corelationId": "1293081023",
    "data": [
      {
        "totalCount": 9,
        "dataProvideCount": 3,
        "dataDomainCount": 6,
        "totalSeriesItem": [{
          "label": "fileNotReceived",
          "value": 59,
          "seriesItemDTO": [{ "name": "General Ledger", "value": 40 }, { "name": "Positions", "value": 19 }]
        }]
      }
    ],
    "error": null
  };
  function getElement(id: string): any {
    return document.body.querySelector(id);
  }
  let renderer: Renderer2;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DataIntakeComponent],
      providers: [DataManagedService, DataManagedSettingsService,
        EycDataApiService, Renderer2,
        { provide: "dataManagedProduction", useValue: datamanagedenvironment.production },
        { provide: "dataManagedEndPoint", useValue: datamanagedenvironment.apiEndpoint }
      ],
      imports: [HttpClientTestingModule, ReactiveFormsModule, FormsModule, MotifCardModule, MotifButtonModule, MotifIconModule, MotifFormsModule, MotifTabBarModule, MotifBreadcrumbModule, MotifChipModule, MotifToastModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataIntakeComponent);
    component = fixture.componentInstance;
    component.dailyfilter = { nativeElement: 'nativeElement' };
    component.monthlyfilter = { nativeElement: 'nativeElement' };
    renderer = fixture.componentRef.injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
    spyOn(renderer, 'setAttribute');
    renderer.setAttribute(component.monthlyfilter.nativeElement, 'color', 'primary-alt');
    renderer.setAttribute(component.dailyfilter.nativeElement, 'color', 'secondary');

    component.ngAfterViewInit();
    fixture.detectChanges();
    dataManagedService = TestBed.get(DataManagedService);
    httpQueryParams =
    {
      startDate: '',
      endDate: '',
      dataFrequency: DATA_FREQUENCY.DAILY,
      dataIntakeType: DATA_INTAKE_TYPE.DATA_PROVIDER,
      dueDate: '2021-10-22',
      periodType: '',
      filterTypes: [
        FILTER_TYPE.NO_ISSUES, FILTER_TYPE.HIGH, FILTER_TYPE.LOW, FILTER_TYPE.MEDIUM,
        FILTER_TYPE.MISSING_FILES, FILTER_TYPE.FILE_NOT_RECIEVED]
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format date', () => {
    expect(formatDate('2021-12-18 09:01:15','yyyy-MM-dd', 'en')).toEqual('2021-12-18');
  });

  it('should change report-tab', () => {
    component.reportTabChange(1);
    expect(component.tabIn).toBe(1);
  });

  it('should change inner-tab with monthly data ', () => {
    component.innerTabIn = 1;
    component.dailyMonthlyStatus = true;
    component.innerTabChange(1);
    expect(component.httpQueryParams.dataFrequency).toEqual(DATA_FREQUENCY.MONTHLY);
  });

  it('should change inner-tab with monthly data ', () => {
    component.innerTabIn = 1;
    component.dailyMonthlyStatus = false;
    component.innerTabChange(1);
    expect(component.httpQueryParams.dataFrequency).toEqual(DATA_FREQUENCY.DAILY);
  });

  it('should change inner-tab with daily data ', () => {
    component.innerTabIn = 0;
    component.dailyMonthlyStatus = false;
    component.innerTabChange(0);
    expect(component.httpQueryParams.dataFrequency).toEqual(DATA_FREQUENCY.DAILY);
  });

  it('should change inner-tab with daily data ', () => {
    component.innerTabIn = 0;
    component.dailyMonthlyStatus = true;
    component.innerTabChange(0);
    expect(component.httpQueryParams.dataFrequency).toEqual(DATA_FREQUENCY.MONTHLY);
  });

  it('should get file summary data', () => {
    let mockResponse = mockFileSummaries;
    let mockTotalSeriesItem = [];
    spyOn(dataManagedService, 'getFileSummaryList').and.returnValue(of(mockResponse));
    component.fileSummaryList();
    fixture.detectChanges();
    mockTotalSeriesItem = mockResponse.data[0]['totalSeriesItem'];
    expect(component.dataList).toEqual(mockTotalSeriesItem);
  });

  it('should get file summary data but totalSeriesItem null', () => {
    let mockResponseNoRecords = mockFileSummariesNoRecords;
    let mockTotalSeriesItem = [];
    spyOn(dataManagedService, 'getFileSummaryList').and.returnValue(of(mockResponseNoRecords));
    component.fileSummaryList();
    fixture.detectChanges();
    mockTotalSeriesItem = mockResponseNoRecords.data[0]['totalSeriesItem'];
    expect(component.dataList).toEqual(mockTotalSeriesItem);
  });

  it('should get file summary data but totalSeriesItem with FileNotReceived', () => {
    let mockResponseNoFilesReceived = mockFileSummariesFileNotReceived;
    let mockTotalSeriesItem = [];
    spyOn(dataManagedService, 'getFileSummaryList').and.returnValue(of(mockResponseNoFilesReceived));
    component.fileSummaryList();
    fixture.detectChanges();
    mockTotalSeriesItem = mockResponseNoFilesReceived.data[0]['totalSeriesItem'];
    expect(component.dataList).toEqual(mockTotalSeriesItem);
  });

  it('should manipulate data as per chart model for data domain', () => {
    let mockResponse = mockFileSummaries;
    let mockTotalSeriesItem = [];
    spyOn(dataManagedService, 'getFileSummaryList').and.returnValue(of(mockResponse));
    component.fileSummaryList();
    fixture.detectChanges();
    mockTotalSeriesItem = mockResponse.data[0]['totalSeriesItem'];
    component.manipulateStatusWithResponse(mockTotalSeriesItem);
    expect(component.reviewByGroupDomains).toEqual(mockResponse.data[0]['dataDomainCount']);
  });

  it('should manipulate data as per chart model for data provider', () => {
    let mockResponse = mockFileSummaries;
    let mockTotalSeriesItem = [];
    spyOn(dataManagedService, 'getFileSummaryList').and.returnValue(of(mockResponse));
    component.fileSummaryList();
    fixture.detectChanges();
    mockTotalSeriesItem = mockResponse.data[0]['totalSeriesItem'];
    component.manipulateStatusWithResponse(mockTotalSeriesItem);
    expect(component.reviewByGroupProviders).toEqual(mockResponse.data[0]['dataProvideCount']);
  });

  it('should fetch daily data as per data-provider', () => {
    component.innerTabIn = 1;
    component.httpQueryParams.dataFrequency = DATA_FREQUENCY.DAILY;
    component.dailyData(false);
    fixture.detectChanges();
    expect(component.httpQueryParams.dataIntakeType).toEqual(DATA_INTAKE_TYPE.DATA_PROVIDER);
  });

  it('should fetch daily data as per data-domain', () => {
    component.innerTabIn = 0;
    component.httpQueryParams.dataFrequency = DATA_FREQUENCY.DAILY;
    component.dailyData(false);
    fixture.detectChanges();
    expect(component.httpQueryParams.dataIntakeType).toEqual(DATA_INTAKE_TYPE.DATA_DOMAIN);
  });

  it('should fetch monthly data as per data-provider', () => {
    component.innerTabIn = 1;
    component.httpQueryParams.dataFrequency = DATA_FREQUENCY.MONTHLY;
    component.monthlyData(true);
    fixture.detectChanges();
    expect(component.httpQueryParams.dataIntakeType).toEqual(DATA_INTAKE_TYPE.DATA_PROVIDER);
  });

  it('should fetch monthly data as per data-domain', () => {
    component.innerTabIn = 0;
    component.httpQueryParams.dataFrequency = DATA_FREQUENCY.MONTHLY;
    component.monthlyData(true);
    fixture.detectChanges();
    expect(component.httpQueryParams.dataIntakeType).toEqual(DATA_INTAKE_TYPE.DATA_DOMAIN);
  });

  it('should fetch date from motif Calendar', () => {
    renderer.setAttribute(component.monthlyfilter.nativeElement, 'color', 'primary-alt');
    renderer.setAttribute(component.dailyfilter.nativeElement, 'color', 'secondary');
    
    const event = { "isRange": false, "singleDate": { "date": { "year": 2021, "month": 12, "day": 15 }, "jsDate": "2021-12-14T18:30:00.000Z", "formatted": "2021-12-15", "epoc": 1639506600 }, "dateRange": null };
    component.toggleCalendar(event);
    fixture.detectChanges();
    component.calSelectedDate=event.singleDate.formatted
    let selector = getElement('#datepicker');
    expect(selector).not.toBe(null);

    if (component.calSelectedDate) {
      component.httpQueryParams.dueDate = component.calSelectedDate;
    }
    expect(component.httpQueryParams.dueDate).toEqual(component.calSelectedDate);
  });

});

