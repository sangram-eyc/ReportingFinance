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
import { Renderer2, Type } from '@angular/core';
import { RowClickedEvent } from 'ag-grid-community';

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

    let mockReviewFile = {
        "success": true,
        "message": "",
        "data": {
            "totalCount": 50,
            "rowData": [
                {
                    "file": "General_Ledger_09",
                    "provider": "Data H",
                    "data_domain": "General Ledger",
                    "functions": "TRMS, ",
                    "due_date": "10/19/2021 | 9:00am EST",
                    "exceptions": "Fund completeness",
                    "Status": "High"
                },
                {
                    "file": "General_Ledger_091",
                    "provider": "Statestreet",
                    "data_domain": "General Ledger",
                    "functions": "TRMS,",
                    "due_date": "10/15/2021 | 9:00am EST",
                    "exceptions": "",
                    "Status": "No Issues"
                },
                {
                    "file": "General_Ledger_09",
                    "provider": "Data H",
                    "data_domain": "General Ledger",
                    "functions": "TRMS, ",
                    "due_date": "10/19/2021 | 9:00am EST",
                    "exceptions": "Fund completeness",
                    "Status": "High"
                },
                {
                    "file": "Positions_state_071",
                    "provider": "Facet",
                    "data_domain": "Positions",
                    "functions": "RRMS, ",
                    "due_date": "-12 Days ",
                    "exceptions": "",
                    "Status": "Missing"
                },
                {
                    "file": "General_Ledger_09",
                    "provider": "Data H",
                    "data_domain": "General Ledger",
                    "functions": "TRMS, ",
                    "due_date": "10/19/2021 | 9:00am EST",
                    "exceptions": "Fund completeness",
                    "Status": "High"
                },
                {
                    "file": "General_Ledger_091",
                    "provider": "Statestreet",
                    "data_domain": "General Ledger",
                    "functions": "TRMS, ",
                    "due_date": "10/15/2021 | 9:00am EST",
                    "exceptions": "Fund completeness",
                    "Status": "Medium / Low"
                },
                {
                    "file": "Positions_state_071",
                    "provider": "Facet",
                    "data_domain": "Positions",
                    "functions": "RRMS, ",
                    "due_date": "-12 Days ",
                    "exceptions": "",
                    "Status": "Missing"
                },
                {
                    "file": "General_Ledger_091",
                    "provider": "Statestreet",
                    "data_domain": "General Ledger",
                    "functions": "TRMS, ",
                    "due_date": "10/15/2021 | 9:00am EST",
                    "exceptions": "Fund completeness",
                    "Status": "Medium / Low"
                }
            ]
        }
    };
    let mockTotalReport = {
        "success": true,
        "message": "",
        "corelationId": "9cfca52a-562d-48e7-bfde-72bf000b85f4",
        "data": [
            {
                "name": "EY_BNYM_TRP_FAOP_M_FuturesPortfolioValuation_20210909110912.txt",
                "provider": "BNYM",
                "dataDomain": "Positions",
                "functions": "TRMS_NA_Tax Estimates_Quarterly",
                "dueDate": "2021-09-02T09:00:00",
                "exceptions": "",
                "status": "Received",
                "maxPriority": "noIssues",
                "auditFileGuidName": "59c99535-aed6-418d-847c-6bfc8ace1491",
                "fileNameAlias": "Monthly Futures Portfolio Valuation2021-08-31"
            },
            {
                "name": "EY_BNYM_TRP_FAOP_M_TradeActivity_20210909111019.txt",
                "provider": "BNYM",
                "dataDomain": "Transactions",
                "functions": "TRMS_NA_Tax Estimates_Quarterly",
                "dueDate": "2021-09-02T09:00:00",
                "exceptions": "",
                "status": "Received",
                "maxPriority": "noIssues",
                "auditFileGuidName": "50309d97-fe7b-4a61-8916-60dfc5daa8c1",
                "fileNameAlias": "Monthly Trade Activity2021-08-31"
            },
            {
                "name": "EY_BNYM_TRP_FAOP_M_WorkingTrialBalanceClass_20210909111338.txt",
                "provider": "BNYM",
                "dataDomain": "General Ledger",
                "functions": "TRMS_NA_Tax Estimates_Quarterly",
                "dueDate": "2021-09-02T09:00:00",
                "exceptions": "",
                "status": "Received",
                "maxPriority": "noIssues",
                "auditFileGuidName": "5c7872fe-fbc1-4691-ba23-8a0f79c541bc",
                "fileNameAlias": "Monthly Working  Trial Balance Class2021-08-31"
            },
            {
                "name": "EY_BNYM_TRP_FAOP_M_FuturesPortfolioValuation_20210902220231.txt",
                "provider": "BNYM",
                "dataDomain": "Positions",
                "functions": "TRMS_NA_Tax Estimates_Quarterly",
                "dueDate": "2021-09-02T09:00:00",
                "exceptions": "",
                "status": "Received",
                "maxPriority": "noIssues",
                "auditFileGuidName": "6f3784a9-bfa4-4cd7-9666-20eac61e9ac9",
                "fileNameAlias": "Monthly Futures Portfolio Valuation2021-08-31"
            },
            {
                "name": "EY_BNYM_TRP_FAOP_M_WorkingTrialBalanceClass_20210902230846.txt",
                "provider": "BNYM",
                "dataDomain": "General Ledger",
                "functions": "TRMS_NA_Tax Estimates_Quarterly",
                "dueDate": "2021-09-02T09:00:00",
                "exceptions": "",
                "status": "Received",
                "maxPriority": "noIssues",
                "auditFileGuidName": "ef1c268b-47e4-4e24-a38c-d2b788e3c976",
                "fileNameAlias": "Monthly Working  Trial Balance Class2021-08-31"
            },
            {
                "name": "EY_BNYM_TRP_FAOP_M_TradeActivity_20210902231533.txt",
                "provider": "BNYM",
                "dataDomain": "Transactions",
                "functions": "TRMS_NA_Tax Estimates_Quarterly",
                "dueDate": "2021-09-02T09:00:00",
                "exceptions": "",
                "status": "Received",
                "maxPriority": "noIssues",
                "auditFileGuidName": "9e57ee89-a9b6-4dae-8546-905dca7478ae",
                "fileNameAlias": "Monthly Trade Activity2021-08-31"
            },
            {
                "name": "EY_BNYM_TRP_FAOP_M_WorkingTrialBalanceClass_20210916145656.txt",
                "provider": "BNYM",
                "dataDomain": "General Ledger",
                "functions": "TRMS_NA_Tax Estimates_Quarterly",
                "dueDate": "2021-09-02T09:00:00",
                "exceptions": "",
                "status": "Received",
                "maxPriority": "noIssues",
                "auditFileGuidName": "178ef2cc-4f55-4226-9725-a647e4ce3e1a",
                "fileNameAlias": "Monthly Working  Trial Balance Class2021-08-31"
            },
            {
                "name": "EY_BNYM_TRP_FAOP_M_TradeActivity_20210916145656.txt",
                "provider": "BNYM",
                "dataDomain": "Transactions",
                "functions": "TRMS_NA_Tax Estimates_Quarterly",
                "dueDate": "2021-09-02T09:00:00",
                "exceptions": "",
                "status": "Received",
                "maxPriority": "noIssues",
                "auditFileGuidName": "2cf3ffe9-2d7a-45b4-ae99-11330b8109c6",
                "fileNameAlias": "Monthly Trade Activity2021-08-31"
            },
            {
                "name": "EY_BNYM_TRP_FAOP_M_FuturesPortfolioValuation_20210916150011.txt",
                "provider": "BNYM",
                "dataDomain": "Positions",
                "functions": "TRMS_NA_Tax Estimates_Quarterly",
                "dueDate": "2021-09-02T09:00:00",
                "exceptions": "",
                "status": "Received",
                "maxPriority": "noIssues",
                "auditFileGuidName": "7142e7fa-c35a-4ff9-8085-04cda1ff5c5c",
                "fileNameAlias": "Monthly Futures Portfolio Valuation2021-08-31"
            },
            {
                "name": "EY_BNYM_TRP_FAOP_M_PortfolioValuation_20210909112125.txt",
                "provider": "BNYM",
                "dataDomain": "Positions",
                "functions": "TRMS_NA_Tax Estimates_Quarterly",
                "dueDate": "2021-09-02T09:00:00",
                "exceptions": "Funds are missing,Invalid Funds",
                "status": "Received",
                "maxPriority": "medium",
                "auditFileGuidName": "51a7b0ed-849f-4b18-978c-783bf3cdbb43",
                "fileNameAlias": "Monthly Portfolio Valuation2021-08-31"
            },
            {
                "name": "EY_BNYM_TRP_FAOP_M_WorkingTrialBalanceTF_20210902231317.txt",
                "provider": "BNYM",
                "dataDomain": "General Ledger",
                "functions": "TRMS_NA_Tax Estimates_Quarterly",
                "dueDate": "2021-09-02T09:00:00",
                "exceptions": "Funds are missing,Missing Data - Recheck File Validity,Invalid Funds,Trial Balance Lines",
                "status": "Received",
                "maxPriority": "medium",
                "auditFileGuidName": "579446e5-688d-4d64-b5bf-28f0d8cb16d6",
                "fileNameAlias": "Monthly Working  Trial Balance TF2021-08-31"
            },
            {
                "name": "EY_BNYM_TRP_FAOP_M_PortfolioValuation_20210902224827.txt",
                "provider": "BNYM",
                "dataDomain": "Positions",
                "functions": "TRMS_NA_Tax Estimates_Quarterly",
                "dueDate": "2021-09-02T09:00:00",
                "exceptions": "Funds are missing,Invalid Funds",
                "status": "Received",
                "maxPriority": "medium",
                "auditFileGuidName": "99f76864-6047-422a-9a19-098627ce449a",
                "fileNameAlias": "Monthly Portfolio Valuation2021-08-31"
            },
            {
                "name": "EY_BNYM_TRP_FAOP_M_WorkingTrialBalanceTF_20210909111338.txt",
                "provider": "BNYM",
                "dataDomain": "General Ledger",
                "functions": "TRMS_NA_Tax Estimates_Quarterly",
                "dueDate": "2021-09-02T09:00:00",
                "exceptions": "Funds are missing,Missing Data - Recheck File Validity,Invalid Funds,Trial Balance Lines",
                "status": "Received",
                "maxPriority": "high",
                "auditFileGuidName": "50d92169-789e-4b78-a835-cd7035d4d6f2",
                "fileNameAlias": "Monthly Working  Trial Balance TF2021-08-31"
            },
            {
                "name": "EY_BNYM_TRP_FAOP_M_WorkingTrialBalanceTF_20210916150117.txt",
                "provider": "BNYM",
                "dataDomain": "General Ledger",
                "functions": "TRMS_NA_Tax Estimates_Quarterly",
                "dueDate": "2021-09-02T09:00:00",
                "exceptions": "Funds are missing,Invalid Funds,Trial Balance Lines",
                "status": "Received",
                "maxPriority": "high",
                "auditFileGuidName": "87357625-14b2-4387-a62e-93e7b9e075a4",
                "fileNameAlias": "Monthly Working  Trial Balance TF2021-08-31"
            },
            {
                "name": "EY_BNYM_TRP_FAOP_M_PortfolioValuation_20210916150011.txt",
                "provider": "BNYM",
                "dataDomain": "Positions",
                "functions": "TRMS_NA_Tax Estimates_Quarterly",
                "dueDate": "2021-09-02T09:00:00",
                "exceptions": "Funds are missing,Invalid Funds",
                "status": "Received",
                "maxPriority": "high",
                "auditFileGuidName": "945e821e-8d9e-4d20-86c1-54a64cb4908d",
                "fileNameAlias": "Monthly Portfolio Valuation2021-08-31"
            },
            {
                "name": "Monthly Tax Total FYTDIncome",
                "provider": "BNYM",
                "dataDomain": "General Ledger",
                "functions": "TRMS_NA_Tax Estimates_Quarterly",
                "dueDate": "2021-09-02T09:00:00",
                "exceptions": "",
                "status": "Not Received Past Due",
                "maxPriority": "missingFiles",
                "auditFileGuidName": null,
                "fileNameAlias": "Monthly Tax Total FYTDIncome"
            },
            {
                "name": "Monthly Trial Balance NAV",
                "provider": "BNYM",
                "dataDomain": "General Ledger",
                "functions": "TRMS_NA_Tax Estimates_Quarterly",
                "dueDate": "2021-09-02T09:00:00",
                "exceptions": "",
                "status": "Not Received Past Due",
                "maxPriority": "missingFiles",
                "auditFileGuidName": null,
                "fileNameAlias": "Monthly Trial Balance NAV"
            },
            {
                "name": "Monthly Disposal Lot Table Query",
                "provider": "BNYM",
                "dataDomain": "Positions",
                "functions": "TRMS_NA_Tax Estimates_Quarterly",
                "dueDate": "2021-09-02T09:00:00",
                "exceptions": "",
                "status": "Not Received Past Due",
                "maxPriority": "missingFiles",
                "auditFileGuidName": null,
                "fileNameAlias": "Monthly Disposal Lot Table Query"
            },
            {
                "name": "Monthly Lot Level Position Table Query",
                "provider": "BNYM",
                "dataDomain": "Positions",
                "functions": "TRMS_NA_Tax Estimates_Quarterly",
                "dueDate": "2021-09-02T09:00:00",
                "exceptions": "",
                "status": "Not Received Past Due",
                "maxPriority": "missingFiles",
                "auditFileGuidName": null,
                "fileNameAlias": "Monthly Lot Level Position Table Query"
            },
            {
                "name": "Monthly Realized Loss",
                "provider": "BNYM",
                "dataDomain": "Transactions",
                "functions": "TRMS_NA_Tax Estimates_Quarterly",
                "dueDate": "2021-09-02T09:00:00",
                "exceptions": "",
                "status": "Not Received Past Due",
                "maxPriority": "missingFiles",
                "auditFileGuidName": null,
                "fileNameAlias": "Monthly Realized Loss"
            },
            {
                "name": "Tax Dividend",
                "provider": "BNYM",
                "dataDomain": "Transactions",
                "functions": "TRMS_NA_Tax Estimates_Quarterly",
                "dueDate": "2021-09-02T09:00:00",
                "exceptions": "",
                "status": "Not Received Past Due",
                "maxPriority": "missingFiles",
                "auditFileGuidName": null,
                "fileNameAlias": "Tax Dividend"
            }
        ],
        "error": null
    };
    let mockReviewFileNoRecords = {
        "success": true,
        "message": "",
        "data": {
            "totalCount": 50,
            "rowData": []
        }
    };
    let renderer: Renderer2;
    
    function getElement(id: string): any {
        return document.body.querySelector(id);
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FileReviewComponent],
            providers: [DataManagedService, DataManagedSettingsService,
                EycDataApiService, Renderer2,
                { provide: "dataManagedProduction", useValue: datamanagedenvironment.production },
                { provide: "dataManagedEndPoint", useValue: datamanagedenvironment.apiEndpoint }],
            imports: [RouterTestingModule, HttpClientTestingModule, ReactiveFormsModule, FormsModule, MotifCardModule, MotifButtonModule, MotifIconModule, MotifFormsModule, MotifTabBarModule, MotifBreadcrumbModule, MotifChipModule, MotifToastModule]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FileReviewComponent);
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

    it('should get file-details grid data', () => {
        let mockReviewResponse = mockReviewFile;
        let mockReviewTotalSeriesItem;
        spyOn(dataManagedService, 'getReviewFileTableData').and.returnValue(of(mockReviewResponse));
        component.getReviewFileTableData();
        fixture.detectChanges();
        mockReviewTotalSeriesItem = mockReviewResponse.data;
        expect(component.glRowdata).toEqual(mockReviewTotalSeriesItem);
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

    it('should redirect on click at table-row', () => {
        const event = { data: { name: 'abc', auditFileGuidName: '', fileNameAlias: ''}} as RowClickedEvent;
        component.onRowClicked(event);
        fixture.detectChanges();
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

    it('should manipulate data as per chart model for data domain', () => {
        let mockResponse = mockFileSummaries;
        let mockTotalSeriesItem = [];
        spyOn(dataManagedService, 'getFileSummaryList').and.returnValue(of(mockResponse));
        component.fileSummaryList();
        fixture.detectChanges();
        mockTotalSeriesItem = mockResponse.data[0]['totalSeriesItem'];
        component.manipulateStatusWithResponse(mockTotalSeriesItem);
        const manipulateData = [{
            "name": "BNYM",
            "series": [
                {
                    "name": "No issues",
                    "value": 9
                },
                {
                    "name": "Medium / low priority issues",
                    "value": 3
                },
                {
                    "name": "High priority issues",
                    "value": 3
                },
                {
                    "name": "Missing files, past due",
                    "value": 6
                }
            ]
        }];
        expect(component.stackBarChartData[0].series.length).toEqual(8);
    });

    it('should filterByIssues with all and lightVariant', () => {
        component.innerTabIn = 0;
        component.httpQueryParams.dataFrequency = DATA_FREQUENCY.MONTHLY;
        component.filterByIssues('all', component.lightVariant);
        fixture.detectChanges();
        expect(component.allIssueVariant).toEqual(component.darkVariant);
    });

    it('should filterByIssues with junk-data and lightVariant', () => {
        component.innerTabIn = 0;
        component.httpQueryParams.dataFrequency = DATA_FREQUENCY.MONTHLY;
        component.filterByIssues('abcd', component.lightVariant);
        fixture.detectChanges();
        expect(component.allIssueVariant).toEqual(component.darkVariant);
    });

    it('should filterByIssues with NO_ISSUES and lightVariant', () => {
        component.innerTabIn = 0;
        component.httpQueryParams.dataFrequency = DATA_FREQUENCY.MONTHLY;
        component.filterByIssueType = FILTER_TYPE.NO_ISSUES;
        component.filterByIssues(FILTER_TYPE.NO_ISSUES, component.lightVariant);
        fixture.detectChanges();
        expect(component.noIssueVariant).toEqual(component.darkVariant);
    });

    it('should filterByIssues with NO_ISSUES and darkVariant', () => {
        component.innerTabIn = 0;
        component.httpQueryParams.dataFrequency = DATA_FREQUENCY.MONTHLY;
        component.filterByIssueType = FILTER_TYPE.NO_ISSUES;
        component.filterByIssues(FILTER_TYPE.NO_ISSUES, component.darkVariant);
        fixture.detectChanges();
        expect(component.noIssueVariant).toEqual(component.lightVariant);
    });

    it('should filterByIssues with MEDIUM_LOW and lightVariant', () => {
        component.innerTabIn = 0;
        component.httpQueryParams.dataFrequency = DATA_FREQUENCY.MONTHLY;
        component.filterByIssueType = FILTER_TYPE.MEDIUM_LOW;
        component.filterByIssues(FILTER_TYPE.MEDIUM_LOW, component.lightVariant);
        fixture.detectChanges();
        expect(component.mediumLowIssueVariant).toEqual(component.darkVariant);
    });

    it('should filterByIssues with MEDIUM_LOW and darkVariant', () => {
        component.innerTabIn = 0;
        component.httpQueryParams.dataFrequency = DATA_FREQUENCY.MONTHLY;
        component.filterByIssueType = FILTER_TYPE.MEDIUM_LOW;
        component.filterByIssues(FILTER_TYPE.MEDIUM_LOW, component.darkVariant);
        fixture.detectChanges();
        expect(component.mediumLowIssueVariant).toEqual(component.lightVariant);
    });
    

    it('should filterByIssues with HIGH and lightVariant', () => {
        component.innerTabIn = 0;
        component.httpQueryParams.dataFrequency = DATA_FREQUENCY.MONTHLY;
        component.filterByIssueType = FILTER_TYPE.HIGH;
        component.filterByIssues(FILTER_TYPE.HIGH, component.lightVariant);
        fixture.detectChanges();
        expect(component.highIssueVariant).toEqual(component.darkVariant);
    });

    it('should filterByIssues with HIGH and darkVariant', () => {
        component.innerTabIn = 0;
        component.httpQueryParams.dataFrequency = DATA_FREQUENCY.MONTHLY;
        component.filterByIssueType = FILTER_TYPE.HIGH;
        component.filterByIssues(FILTER_TYPE.HIGH, component.darkVariant);
        fixture.detectChanges();
        expect(component.highIssueVariant).toEqual(component.lightVariant);
    });
    
    it('should filterByIssues with MISSING_FILES and lightVariant', () => {
        component.innerTabIn = 0;
        component.httpQueryParams.dataFrequency = DATA_FREQUENCY.MONTHLY;
        component.filterByIssueType = FILTER_TYPE.MISSING_FILES;
        component.filterByIssues(FILTER_TYPE.MISSING_FILES, component.lightVariant);
        fixture.detectChanges();
        expect(component.missingFileVariant).toEqual(component.darkVariant);
    });

    it('should filterByIssues with MISSING_FILES and darkVariant', () => {
        component.innerTabIn = 0;
        component.httpQueryParams.dataFrequency = DATA_FREQUENCY.MONTHLY;
        component.filterByIssueType = FILTER_TYPE.MISSING_FILES;
        component.filterByIssues(FILTER_TYPE.MISSING_FILES, component.darkVariant);
        fixture.detectChanges();
        expect(component.missingFileVariant).toEqual(component.lightVariant);
    });
    it('should filterByIssues with FILE_NOT_RECIEVED and lightVariant', () => {
        component.innerTabIn = 0;
        component.httpQueryParams.dataFrequency = DATA_FREQUENCY.MONTHLY;
        component.filterByIssueType = FILTER_TYPE.FILE_NOT_RECIEVED;
        component.filterByIssues(FILTER_TYPE.FILE_NOT_RECIEVED, component.lightVariant);
        fixture.detectChanges();
        expect(component.fileNotReceivedVariant).toEqual(component.darkVariant);
    });

    it('should filterByIssues with FILE_NOT_RECIEVED and darkVariant', () => {
        component.innerTabIn = 0;
        component.httpQueryParams.dataFrequency = DATA_FREQUENCY.MONTHLY;
        component.filterByIssueType = FILTER_TYPE.FILE_NOT_RECIEVED;
        component.filterByIssues(FILTER_TYPE.FILE_NOT_RECIEVED, component.darkVariant);
        fixture.detectChanges();
        expect(component.fileNotReceivedVariant).toEqual(component.lightVariant);
    });
});


