import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MotifBreadcrumbModule, MotifButtonModule, MotifCardModule, MotifChipModule, MotifFormsModule, MotifIconModule, MotifTabBarModule, MotifToastModule } from '@ey-xd/ng-motif';
import { datamanagedenvironment } from '../../../../../../../src/environments/eyc-data-managed-services/data-managed-environment';
import { DATA_FREQUENCY, DATA_INTAKE_TYPE, FILTER_TYPE } from '../../../config/dms-config-helper';
import { DataSummary } from '../../models/data-summary.model';
import { DataManagedService } from '../../services/data-managed.service';
import { EycDataApiService } from '../../services/eyc-data-api.service';
import { formatDate } from '@angular/common';
import { FileReviewComponent } from './file-review.component';
import { of } from 'rxjs';
import { DataManagedSettingsService } from '../../services/data-managed-settings.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('FileReviewComponent', () => {
    let component: FileReviewComponent;
    let fixture: ComponentFixture<FileReviewComponent>;
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

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FileReviewComponent],
            providers: [DataManagedService, DataManagedSettingsService,
                EycDataApiService,
                { provide: "dataManagedProduction", useValue: datamanagedenvironment.production },
                { provide: "dataManagedEndPoint", useValue: datamanagedenvironment.apiEndpoint }],
            imports: [RouterTestingModule, HttpClientTestingModule, ReactiveFormsModule, FormsModule, MotifCardModule, MotifButtonModule, MotifIconModule, MotifFormsModule, MotifTabBarModule, MotifBreadcrumbModule, MotifChipModule, MotifToastModule]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FileReviewComponent);
        component = fixture.componentInstance;
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
        expect(formatDate('2021-12-18 09:01:15', 'yyyy-MM-dd', 'en')).toEqual('2021-12-18');
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
        const event = { "isRange": false, "singleDate": { "date": { "year": 2021, "month": 12, "day": 15 }, "jsDate": "2021-12-14T18:30:00.000Z", "formatted": "2021-12-15", "epoc": 1639506600 }, "dateRange": null };
        component.toggleCalendar(event);
        fixture.detectChanges();
        component.calSelectedDate = event.singleDate.formatted
        let selector = getElement('#datepicker');
        expect(selector).not.toBe(null);

        if (component.calSelectedDate) {
            component.httpQueryParams.dueDate = component.calSelectedDate;
        }
        expect(component.httpQueryParams.dueDate).toEqual(component.calSelectedDate);
    });

});
