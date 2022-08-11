import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ElementRef, Input, Renderer2, Type } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { MotifButtonModule, MotifCardModule, MotifFormsModule, MotifIconModule, MotifPaginationModule, MotifProrgressIndicatorsModule, MotifTableModule } from '@ey-xd/ng-motif';
import { AgGridModule } from 'ag-grid-angular';
import { RowClickedEvent } from 'ag-grid-community';
import { of } from 'rxjs';
import { environment } from '../../../../../../../src/environments/environment';
import { DATA_FREQUENCY, DATA_INTAKE_TYPE, FILTER_TYPE } from '../../../config/dms-config-helper';
import { ExceptionDataGrid } from '../../models/data-grid.model';
import { DataSummary } from '../../models/data-summary.model';
import { DataManagedSettingsService } from '../../services/data-managed-settings.service';
import { DataManagedService } from '../../services/data-managed.service';
import { EycDataApiService } from '../../services/eyc-data-api.service';

import { ExceptionsComponent } from './exceptions.component';

describe('ExceptionsComponent', () => {
    let component: ExceptionsComponent;
    let fixture: ComponentFixture<ExceptionsComponent>;
    let dataManagedService: DataManagedService;
    let renderer: Renderer2;
    let httpQueryParams: DataSummary;
    let httpDataGridParams: ExceptionDataGrid;
    let httpDataGridParamsException: ExceptionDataGrid;
    
    const data = {
        "success": true,
        "message": "",
        "corelationId": "9d07b574-4d1a-4a24-8d60-84229203f11b",
        "data": [
            {
                "type": "Integrity",
                "name": "null check on securitytypedescription",
                "priority": "medium",
                "comments": null,
                "exceptionCount": 3,
                "exceptionReportDetails": null
            },
            {
                "type": "Integrity",
                "name": "Date Format Check",
                "priority": "high",
                "comments": null,
                "exceptionCount": 0,
                "exceptionReportDetails": null
            },
            {
                "type": null,
                "name": null,
                "priority": "medium",
                "comments": null,
                "exceptionCount": 0,
                "exceptionReportDetails": null
            }
        ],

        "error": null
    };

    let mockReviewFile = {
        "success": true,
        "message": "success",
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
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ExceptionsComponent],
            imports: [AgGridModule.withComponents([]),
                MatDialogModule,
                ReactiveFormsModule,
                FormsModule,
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
                HttpClientTestingModule],
            providers: [DataManagedService, DataManagedSettingsService, EycDataApiService,
                { provide: "dataManagedEndPoint", useValue: environment.apiEndpoint },
                { provide: "dataManagedProduction", useValue: environment.production }]
        })
            .compileComponents();
        fixture = TestBed.createComponent(ExceptionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        dataManagedService = TestBed.get(DataManagedService)
    }));

    function getElement(id: string): any {
        return document.body.querySelector(id);
    }

    beforeEach(() => {
        fixture = TestBed.createComponent(ExceptionsComponent);
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

        httpDataGridParamsException = {
            startDate: '',
            endDate: '',
            dataFrequency: DATA_FREQUENCY.DAILY,
            dueDate: '2021-03-31',
            periodType: '',
            clientName: '',
            auditFileGuidName: '6f43bd8a-2be3-4953-8e69-aa22ff5c4b4d',
            fileId: '',
            fileName: 'Security Master2021-03-31'
        };
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should check the service', () => {
        expect(dataManagedService instanceof DataManagedService).toBeTruthy();
    });

    it('should update PaginationSize', () => {
        let newSize = 10;
        component.updatePaginationSize(newSize);
        expect(component.noOfCompletdFilingRecords).toEqual(10);
    });

    it('should update handlePageChange', () => {
        let value = 10;
        component.handlePageChange(value);
        expect(component.currentPage).toEqual(10);
    });

    it('should fetch date from motif Calendar', () => {
        renderer.setAttribute(component.monthlyfilter.nativeElement, 'color', 'primary-alt');
        renderer.setAttribute(component.dailyfilter.nativeElement, 'color', 'secondary');

        const event = { "isRange": false, "singleDate": { "date": { "year": 2021, "month": 12, "day": 15 }, "jsDate": "2021-12-14T18:30:00.000Z", "formatted": "2021-12-15", "epoc": 1639506600 }, "dateRange": null };
        component.toggleCalendar(event);
        fixture.detectChanges();
        component.calSelectedDate = event.singleDate.formatted
        let selector = getElement('#datepicker');
        expect(selector).not.toBe(null);

        if (component.calSelectedDate) {
            component.httpDataGridParams.dueDate = component.calSelectedDate;
        }
        expect(component.httpDataGridParams.dueDate).toEqual(component.calSelectedDate);
    });

    it('should dataFrequency as daily', () => {
        component.dailyData(false);
        fixture.detectChanges();
        expect(component.httpDataGridParams.dataFrequency).toEqual(DATA_FREQUENCY.DAILY);
    });

    it('should fetch daily statues as false', () => {
        component.dailyData(false);
        fixture.detectChanges();
        expect(component.dailyMonthlyStatus).toEqual(false);
    });

    it('should dataFrequency as monthly', () => {
        component.monthlyData(true);
        fixture.detectChanges();
        expect(component.httpDataGridParams.dataFrequency).toEqual(DATA_FREQUENCY.MONTHLY);
    });

    it('should fetch daily statues as true', () => {
        component.monthlyData(true);
        fixture.detectChanges();
        expect(component.dailyMonthlyStatus).toEqual(true);
    });

    it('should showComments as true', () => {
        component.openComments(true);
        fixture.detectChanges();
        expect(component.showComments).toEqual(true);
    });

    it('should dataFrequency as daily', () => {
        component.dailyData(false);
        fixture.detectChanges();
        expect(component.httpDataGridParams.dataFrequency).toEqual(DATA_FREQUENCY.DAILY);
    });

    it('should check the service', () => {
        expect(dataManagedService instanceof DataManagedService).toBeTruthy();
    });

    it('should redirect on click at table-row', () => {
        const event = { data: { name: 'AECX', exceptionReportDetails: "\"[{\"fundnumber\":\"AECX\"}, {\"fundnumber\":\"70Rl\"}, {\"fundnumber\":\"AECW\"}, {\"fundnumber\":\"AECZ\"}, {\"fundnumber\":\"AECY\"}]\"" } } as RowClickedEvent;
        component.onRowClicked(event);
        fixture.detectChanges();
    });

    it('should get file-details grid data', () => {
        let mockReviewResponse = data;
        let mockReviewTotalSeriesItem;
        spyOn(dataManagedService, 'getExceptionTableData').and.returnValue(of(mockReviewResponse));
        component.getExceptionTableData();
        fixture.detectChanges();
        mockReviewTotalSeriesItem = mockReviewResponse.data;
        expect(component.glRowdata).toEqual(mockReviewTotalSeriesItem);
    });

    it('should return ExceptionTableData', () => {

        fixture.detectChanges();
        component.getExceptionTableData();
        dataManagedService.getExceptionTableData(httpDataGridParamsException).subscribe(resp => {
            expect(resp).toEqual(data);
            expect(resp['data']).toEqual(component.glRowdata);
        })
    })

});



