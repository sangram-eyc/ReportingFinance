import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MotifBreadcrumbModule, MotifButtonModule, MotifCardModule, MotifChipModule, MotifFormsModule, MotifIconModule, MotifTabBarModule, MotifToastModule } from '@ey-xd/ng-motif';
import { formatDate } from '@angular/common';
import { Observable, of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { Renderer2, Type } from '@angular/core';
import { RowClickedEvent } from 'ag-grid-community';
import { IntakeFileReviewComponent } from './intake-file-review.component'
import { DATA_FREQUENCY, DATA_INTAKE_TYPE, FILTER_TYPE } from '../../config/intake-config-helpers';
import { DataSummary } from '../models/data-summary.model';
import { IntakeLandingService } from '../services/intake-landing.service';
import { RegulatoryReportingFilingService } from '../../regulatory-reporting-filing/services/regulatory-reporting-filing.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { IntakeRoutingStateService } from '../services/intake-routing-state.service';
import { MatDialogModule } from '@angular/material/dialog';

describe('FileReviewComponent', () => {
    let component: IntakeFileReviewComponent;
    let fixture: ComponentFixture<IntakeFileReviewComponent>;
    let regulatoryReportingFilingServiceStub = {
        getFilingData: () => {
            return { filingName: 'Form PF', period: 'Q1 2022' }
        }
    };
    let intakeLandingServiceStub = {
        apiDateFormat: () => {
            return of({})
        },
        monthlyFormat: () => {
            return of({})
        },
        monthLastDate: () => {
            return of({})
        },
        getReviewAllList: () => {
            return of({})
        },
        getReviewFileTableData: () => {
            return of({})
        },
        ymdToApiDateFormat: () => {
            return of({})
        },
        prevMonthLastDate: () => {
            return of({})
        },
        getReviewByGroupProviderOrDomainGrid: () => {
            return of({})
        }
    };
    let intakeRoutingStateServiceStub = {
        getBrowserBackForwardButtonClick: () => { }
    };

    let activatedRouteStub = {
        paramMap: () => {
            return of({})
        }
    }
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [IntakeFileReviewComponent],
            imports: [
                HttpClientModule,
                RouterTestingModule,
                HttpClientTestingModule,
                MatDialogModule
            ],
            providers: [
                { provide: RegulatoryReportingFilingService, useValue: regulatoryReportingFilingServiceStub },
                { provide: IntakeLandingService, useValue: intakeLandingServiceStub },
                { provide: IntakeRoutingStateService, useValue: intakeRoutingStateServiceStub },
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IntakeFileReviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('searchCompleted method should search', () => {
        let mockInput = {
            el: {
                nativeElement: {
                    value: ''
                }
            }
        }
        component['gridApi'] = {
            setQuickFilter: () => { },
            refreshCells: () => { },
            rowModel: {
                rowsToDisplay: []
            }
        }
        component.searchCompleted(mockInput)
    })


    it('searchFilingValidation method should search filing validation - return false', () => {
        let mockEvent = {
            keyCode: "",
            preventDefault: () => { }
        }
        let res = component.searchFilingValidation(mockEvent)
        expect(res).toEqual(false)
    })

    it('searchFilingValidation method should search filing validation - return true', () => {
        let mockEvent = {
            keyCode: "abc",
            preventDefault: () => { }
        }
        let res = component.searchFilingValidation(mockEvent)
        expect(res).toEqual(false)
    })

    it('updatePaginationSize method should update pagination size', () => {
        component.noOfCompletdFilingRecords = 10;
        component.updatePaginationSize(20);
        expect(component.noOfCompletdFilingRecords).toEqual(20);
    })

    it('handlePageChange method should handle page chnage', () => {

        component.handlePageChange(2);
        expect(component.currentPage).toEqual(2)
    })

    it('onGridReady method should set grid', () => {
        let mockParams = {
            api: {
                sizeColumnsToFit: () => { }
            }
        }
        component['gridApi'] = {
            sizeColumnsToFit: () => { }
        }
        component.onGridReady(mockParams);
    })

    it('filterByIssues method should set filter - all', () => {
        component.httpQueryParams =
            {
                filterTypes: [
                    FILTER_TYPE.NO_ISSUES, FILTER_TYPE.HIGH, FILTER_TYPE.LOW, FILTER_TYPE.MEDIUM,
                    FILTER_TYPE.MISSING_FILES, FILTER_TYPE.FILE_NOT_RECIEVED],
            } as any;
        component.filterByIssues('all', 'monochrome-light');
        expect(component.noIssueVariant).toEqual('monochrome-light');
    })

      it('filterByIssues method should set filter - noIssues', () => {
        component.httpQueryParams =
          {
            filterTypes: [
              FILTER_TYPE.NO_ISSUES, FILTER_TYPE.HIGH, FILTER_TYPE.LOW, FILTER_TYPE.MEDIUM,
              FILTER_TYPE.MISSING_FILES, FILTER_TYPE.FILE_NOT_RECIEVED],
          } as any;
        component.filterByIssues('noIssues', 'monochrome-light');
        expect(component.noIssueVariant).toEqual('monochrome-dark');
      })

      it('filterByIssues method should set filter - noIssues, monochrome-dark', () => {
        component.httpQueryParams =
          {
            filterTypes: [
              FILTER_TYPE.NO_ISSUES, FILTER_TYPE.HIGH, FILTER_TYPE.LOW, FILTER_TYPE.MEDIUM,
              FILTER_TYPE.MISSING_FILES, FILTER_TYPE.FILE_NOT_RECIEVED],
          } as any;
        component.filterByIssues('noIssues', 'monochrome-dark');
        expect(component.noIssueVariant).toEqual('monochrome-light');
      })

      it('filterByIssues method should set filter - low', () => {
        component.httpQueryParams =
          {
            filterTypes: [
              FILTER_TYPE.NO_ISSUES, FILTER_TYPE.HIGH, FILTER_TYPE.LOW, FILTER_TYPE.MEDIUM,
              FILTER_TYPE.MISSING_FILES, FILTER_TYPE.FILE_NOT_RECIEVED],
          } as any;
        component.filterByIssues('low', 'monochrome-light');
        expect(component.noIssueVariant).toEqual('monochrome-light');
      })

      it('filterByIssues method should set filter - low, monochrome-dark', () => {
        component.httpQueryParams =
          {
            filterTypes: [
              FILTER_TYPE.NO_ISSUES, FILTER_TYPE.HIGH, FILTER_TYPE.LOW, FILTER_TYPE.MEDIUM,
              FILTER_TYPE.MISSING_FILES, FILTER_TYPE.FILE_NOT_RECIEVED],
          } as any;
        component.filterByIssues('low', 'monochrome-dark');
        expect(component.noIssueVariant).toEqual('monochrome-light');
      })

      it('filterByIssues method should set filter - medium', () => {
        component.httpQueryParams =
          {
            filterTypes: [
              FILTER_TYPE.NO_ISSUES, FILTER_TYPE.HIGH, FILTER_TYPE.LOW, FILTER_TYPE.MEDIUM,
              FILTER_TYPE.MISSING_FILES, FILTER_TYPE.FILE_NOT_RECIEVED],
          } as any;
        component.filterByIssues('medium', 'monochrome-light');
        expect(component.noIssueVariant).toEqual('monochrome-light');
        expect(component.mediumIssueVariant).toEqual('monochrome-dark')
      })

      it('filterByIssues method should set filter - medium,monochrome-dark', () => {
        component.httpQueryParams =
          {
            filterTypes: [
              FILTER_TYPE.NO_ISSUES, FILTER_TYPE.HIGH, FILTER_TYPE.LOW, FILTER_TYPE.MEDIUM,
              FILTER_TYPE.MISSING_FILES, FILTER_TYPE.FILE_NOT_RECIEVED],
          } as any;
        component.filterByIssues('medium', 'monochrome-dark');
        expect(component.noIssueVariant).toEqual('monochrome-light');
        expect(component.mediumIssueVariant).toEqual('monochrome-light')
      })

      it('filterByIssues method should set filter - high', () => {
        component.httpQueryParams =
          {
            filterTypes: [
              FILTER_TYPE.NO_ISSUES, FILTER_TYPE.HIGH, FILTER_TYPE.LOW, FILTER_TYPE.MEDIUM,
              FILTER_TYPE.MISSING_FILES, FILTER_TYPE.FILE_NOT_RECIEVED],
          } as any;
        component.filterByIssues('high', 'monochrome-light');
        expect(component.noIssueVariant).toEqual('monochrome-light');
        expect(component.mediumIssueVariant).toEqual('monochrome-light')
      })

      it('filterByIssues method should set filter - high,monochrome-dark', () => {
        component.httpQueryParams =
          {
            filterTypes: [
              FILTER_TYPE.NO_ISSUES, FILTER_TYPE.HIGH, FILTER_TYPE.LOW, FILTER_TYPE.MEDIUM,
              FILTER_TYPE.MISSING_FILES, FILTER_TYPE.FILE_NOT_RECIEVED],
          } as any;
        component.filterByIssues('high', 'monochrome-dark');
        expect(component.noIssueVariant).toEqual('monochrome-light');
        expect(component.mediumIssueVariant).toEqual('monochrome-light')
      })

      it('filterByIssues method should set filter - missingFiles', () => {
        component.httpQueryParams =
          {
            filterTypes: [
              FILTER_TYPE.NO_ISSUES, FILTER_TYPE.HIGH, FILTER_TYPE.LOW, FILTER_TYPE.MEDIUM,
              FILTER_TYPE.MISSING_FILES, FILTER_TYPE.FILE_NOT_RECIEVED],
          } as any;
        component.filterByIssues('missingFiles', 'monochrome-light');
        expect(component.noIssueVariant).toEqual('monochrome-light');
        expect(component.mediumIssueVariant).toEqual('monochrome-light')
      })

      it('filterByIssues method should set filter - missingFiles,monochrome-dark', () => {
        component.httpQueryParams =
          {
            filterTypes: [
              FILTER_TYPE.NO_ISSUES, FILTER_TYPE.HIGH, FILTER_TYPE.LOW, FILTER_TYPE.MEDIUM,
              FILTER_TYPE.MISSING_FILES, FILTER_TYPE.FILE_NOT_RECIEVED],
          } as any;
        component.filterByIssues('missingFiles', 'monochrome-dark');
        expect(component.noIssueVariant).toEqual('monochrome-light');
        expect(component.mediumIssueVariant).toEqual('monochrome-light')
      })

      it('filterByIssues method should set filter - fileNotReceived', () => {
        component.httpQueryParams =
          {
            filterTypes: [
              FILTER_TYPE.NO_ISSUES, FILTER_TYPE.HIGH, FILTER_TYPE.LOW, FILTER_TYPE.MEDIUM,
              FILTER_TYPE.MISSING_FILES, FILTER_TYPE.FILE_NOT_RECIEVED],
          } as any;
        component.filterByIssues('fileNotReceived', 'monochrome-light');
        expect(component.noIssueVariant).toEqual('monochrome-light');
        expect(component.mediumIssueVariant).toEqual('monochrome-light')
      })

      it('filterByIssues method should set filter - fileNotReceived,monochrome-dark', () => {
        component.httpQueryParams =
          {
            filterTypes: [
              FILTER_TYPE.NO_ISSUES, FILTER_TYPE.HIGH, FILTER_TYPE.LOW, FILTER_TYPE.MEDIUM,
              FILTER_TYPE.MISSING_FILES, FILTER_TYPE.FILE_NOT_RECIEVED],
          } as any;
        component.filterByIssues('fileNotReceived', 'monochrome-dark');
        expect(component.noIssueVariant).toEqual('monochrome-light');
        expect(component.mediumIssueVariant).toEqual('monochrome-light')
      })

    it('onRowClicked method should navigate to file exception page ', () => {
        let mockEvent = {
            data: {
                name: 'test',
                auditFileGuidName: 'audit file test',
                fileNameAlias: 'file name',
                exceptions: []
            }
        }
        spyOn(component['_router'], 'navigate')
        component.onRowClicked(mockEvent as RowClickedEvent)
        expect(component['_router'].navigate).toHaveBeenCalled()
    })

    it('onRowClicked method should not navigate to file exception page ', () => {
        let mockEvent = {
            data: {}
        }
        spyOn(component['_router'], 'navigate')
        component.onRowClicked(mockEvent as RowClickedEvent)
        expect(component['_router'].navigate).not.toHaveBeenCalled()
    })

    it('routeToExceptionDetailsPage method should navigate ', () => {
        let mockEvent = {
            data: {
                name: 'test',
                auditFileGuidName: 'audit file test',
                fileNameAlias: 'file name'
            }
        }
        spyOn(component['_router'], 'navigate')
        component.routeToExceptionDetailsPage(mockEvent)
        expect(component['_router'].navigate).toHaveBeenCalled()
    })

    it('stringTrim method should trim and return the string', () => {
        let res = component.stringTrim('', 3);
        expect(res).toEqual('--')
    })

    it('stringTrim method should trim and return the -- when no string', () => {
        let res = component.stringTrim('test123 ', 3);
        expect(res).toEqual('tes')
    })

    it('stringTrim method should trim and return the exact string', () => {
        let res = component.stringTrim('test123 ', 7);
        expect(res).toEqual('test123')
    })

    it('getReviewFileTableData method should fetch review file table data', () => {

        let mockData = {
            data: [
                { datasetId: '101' }
            ]
        }
        spyOn(component['IntakeLandingService'], 'getReviewFileTableData').and.callFake(() => {
            return of(mockData)
        })
        component.getReviewFileTableData();
        expect(component.filesCount).toEqual(1)
    })

    it('innerTabChange method set data on inner tab change', () => {
        component.dailyMonthlyStatus = true;
        component.innerTabChange(1)
        expect(component.innerTabIn).toEqual(1);
        expect(component['httpQueryParams'].dataIntakeType).toEqual('dataProvider')
        expect(component['httpDataGridParams'].dataIntakeType).toEqual('dataProvider')
        expect(component['httpQueryParams'].dataFrequency).toEqual('Monthly')
        expect(component['httpDataGridParams'].dataFrequency).toEqual('Monthly')
    })

    it('innerTabChange method set data on inner tab change', () => {
        component.dailyMonthlyStatus = true;
        component.innerTabChange(2)
        expect(component.innerTabIn).toEqual(2);
        expect(component['httpQueryParams'].dataIntakeType).toEqual('dataDomain')
        expect(component['httpDataGridParams'].dataIntakeType).toEqual('dataDomain')
        expect(component['httpQueryParams'].dataFrequency).toEqual('Monthly')
        expect(component['httpDataGridParams'].dataFrequency).toEqual('Monthly')
    })

    it('dailyData method should set daily data - tab 1', () => {
        component.innerTabIn = 1;
        component.dailyData(true)
    })

    it('dailyData method should set daily data - tab 2', () => {
        component.innerTabIn = 2;
        spyOn(sessionStorage, 'getItem').and.returnValue('')
        component.dailyData(true)
    })

    it('monthlyData method should set monthly data - tab 1', () => {
        component.innerTabIn = 1;
        component.dataIntakeType = 'dataProvider'
        component.monthlyData(true)
        expect(component['httpQueryParams'].dataIntakeType).toEqual('dataProvider')
        expect(component['httpDataGridParams'].dataIntakeType).toEqual('dataProvider')
    })

    it('monthlyData method should set monthly data - tab 2', () => {
        component.innerTabIn = 2;
        spyOn(sessionStorage, 'getItem').and.returnValue('')
        component.monthlyData(true)
        expect(component['httpQueryParams'].dataIntakeType).toEqual('dataDomain')
        expect(component['httpDataGridParams'].dataIntakeType).toEqual('dataDomain')
    })

    it('fileSummaryList method should fetch file summary list - view clicked', () => {
        component.isViewClicked = true;
        let mockResp = {
            data: []
        }
        component.httpDataGridParams = {
            dataFrequency: 'Daily',
            dueDate: '02/03/2022'
        } as any;
        spyOn(component['IntakeLandingService'], 'getReviewByGroupProviderOrDomainGrid').and.callFake(() => {
            return of(mockResp)
        })
        spyOn(component, 'manipulateStatusWithReviewByGroup');
        component.fileSummaryList();
        expect(component['IntakeLandingService'].getReviewByGroupProviderOrDomainGrid).toHaveBeenCalled()
        expect(component['httpReviewByGroupParams'].dataFrequency).toEqual('Daily')
        expect(component['httpReviewByGroupParams'].dueDate).toEqual('02/03/2022')
        expect(component.manipulateStatusWithReviewByGroup).toHaveBeenCalled()
    })

    it('fileSummaryList method should fetch file summary list - view not clicked', () => {
        component.isViewClicked = false;
        component.httpDataGridParams = {
            dataFrequency: 'Daily',
            dueDate: '02/03/2022'
        } as any;
        let mockResp = {
            data: [
                {
                    donutChartDTO: '',
                    barChartDTO: ['test1', 'test2'],
                }
            ]
        }
        spyOn(component['IntakeLandingService'], 'getReviewAllList').and.callFake(() => {
            return of(mockResp)
        })
        spyOn(component, 'manipulateStatusWithReviewByGroup');
        component.fileSummaryList();
        expect(component['IntakeLandingService'].getReviewAllList).toHaveBeenCalled()
        expect(component['httpReviewByGroupParams'].dataFrequency).toEqual('Daily')
        expect(component['httpReviewByGroupParams'].dueDate).toEqual('02/03/2022')
        expect(component.manipulateStatusWithReviewByGroup).not.toHaveBeenCalled();
        expect(component.totalFileCount).toEqual(2);

    })

    it('checkException method should check exception - return true', () => {
        let mockParams = {
            data: {
                name: 'test1',
                auditFileGuidName: 'audit file name',
                fileNameAlias: 'test',
                exceptions: []
            }
        }
        let res = component.checkException(mockParams);
        expect(res).toEqual([])
    })


})