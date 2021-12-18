import { InjectionToken } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { datamanagedenvironment } from '../../../../../../src/environments/eyc-data-managed-services/data-managed-environment';
import { DataManagedSettingsService } from '../services/data-managed-settings.service';
import { DataManagedService } from '../services/data-managed.service';
import { EycDataApiService } from '../services/eyc-data-api.service';
import { DataIntakeComponent } from './data-intake.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { MotifFormsModule } from '@ey-xd/ng-motif';
import { of } from 'rxjs';
import { DataSummary } from '../models/data-summary.model';
import { DATA_FREQUENCY, DATA_INTAKE_TYPE, FILTER_TYPE } from '../../config/dms-config-helper';

describe('DataIntakeComponent', () => {
  let component: DataIntakeComponent;
  let fixture: ComponentFixture<DataIntakeComponent>;
  let dataManagedService: DataManagedService;
  let httpQueryParams: DataSummary;
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
            "label": "No issue",
            "value": 84,
            "seriesItemDTO": [{ "name": "General Ledger", "value": 40 }, { "name": "Positions", "value": 19 }]
          },
          {
            "label": "Medium / low priority issues",
            "value": 3,
            "seriesItemDTO": [{ "name": "Positions", "value": 2 }, { "name": "Entity", "value": 1 }]
          },
          {
            "label": "High priority issues",
            "value": 4,
            "seriesItemDTO": [{ "name": "Positions", "value": 2 }, { "name": "Entity", "value": 2 }]
          }
        ]
      }
    ],
    "error": null
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DataIntakeComponent],
      providers: [DataManagedService, DataManagedSettingsService,
        EycDataApiService,
        { provide: "dataManagedProduction", useValue: datamanagedenvironment.production },
        { provide: "dataManagedEndPoint", useValue: datamanagedenvironment.apiEndpoint }],
      imports: [HttpClientTestingModule, MotifFormsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataIntakeComponent);
    component = fixture.componentInstance;
    component.ngAfterViewInit();
    fixture.detectChanges();
    dataManagedService = TestBed.get(DataManagedService);
    httpQueryParams =
    {
      startDate: '',
      EndDate: '',
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
    expect(component.formatDate('2021-12-18 09:01:15')).toEqual('12/18/2021');
  });

  it('should change report-tab', () => {
    component.reportTabChange(1);
    expect(component.tabIn).toBe(1);
  });

  it('should change inner-tab', () => {
    component.innerTabChange(1);
    expect(component.innerTabIn).toBe(1);
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

});

