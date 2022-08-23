import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChangeDetectorRef, ElementRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { DATA_FREQUENCY, FILTER_TYPE } from '../../config/intake-config-helpers';
import { RegulatoryReportingFilingService } from '../../regulatory-reporting-filing/services/regulatory-reporting-filing.service';
import { IntakeLandingService } from '../services/intake-landing.service';
import { IntakeRoutingStateService } from '../services/intake-routing-state.service';

import { IntakeDonutGridListComponent } from './intake-donut-grid-list.component';

describe('IntakeDonutGridListComponent', () => {
  let component: IntakeDonutGridListComponent;
  let fixture: ComponentFixture<IntakeDonutGridListComponent>;

  let intakeLandingServiceStub = {
    apiDateFormat: () => { },
    monthlyFormat: () => { },
    businessDate: () => { },
    prevMonthLastDate: () => { },
    getReviewByGroupProviderOrDomainGrid: () => {
      return of({})
    },
    ymdToApiDateFormat: () => {
      return ''
    },
    montlyDateSub: () => { },
    montlyDateAdd: () => { },
    monthLastDate: () => { }
  }
  let intakeRoutingStateServiceStub = {}
  let regulatoryReportingFilingServiceStub = {
    getFilingData: () => { }
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IntakeDonutGridListComponent],
      imports: [
        HttpClientModule,
        RouterTestingModule,
        HttpClientTestingModule,
        MatDialogModule
      ],
      providers: [ChangeDetectorRef,
        { provide: IntakeLandingService, useValue: intakeLandingServiceStub },
        { provide: IntakeRoutingStateService, useValue: intakeRoutingStateServiceStub },
        { provide: RegulatoryReportingFilingService, useValue: regulatoryReportingFilingServiceStub }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntakeDonutGridListComponent);
    component = fixture.componentInstance;
    component.httpQueryParams =
    {
      startDate: '',
      endDate: '',
      dataFrequency: component.dailyMonthlyStatus ? DATA_FREQUENCY.MONTHLY : DATA_FREQUENCY.DAILY,
      dataIntakeType: component.dataIntakeType,
      periodType: '',
      auditFileGuidName: '',
      fileId: '',
      fileName: '',
      clientName: '',
      reportId: '',
      reportName: '',
      filterTypes: [
        FILTER_TYPE.NO_ISSUES, FILTER_TYPE.HIGH, FILTER_TYPE.LOW, FILTER_TYPE.MEDIUM,
        FILTER_TYPE.MISSING_FILES, FILTER_TYPE.FILE_NOT_RECIEVED],
      isViewClicked: false
    } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('toggleCalendar method should toggle calender', () => {
    let mockEvent = {
      singleDate: {
        jsDate: '01/03/2002'
      }
    }
    spyOn(component['dataManagedService'], 'ymdToApiDateFormat').and.returnValue('2002-03-01')
    component.toggleCalendar(mockEvent);
    expect(component['dataManagedService'].ymdToApiDateFormat).toHaveBeenCalledWith('01/03/2002');
    expect(component.httpQueryParams.dueDate).toEqual('2002-03-01')
  })

  it('toggleMonthlyCalendar method should toggle monthly calender', () => {

    spyOn(component['dataManagedService'], 'apiDateFormat')
    component.toggleMonthlyCalendar();
    expect(component['dataManagedService'].apiDateFormat).toHaveBeenCalled();
  })

  it('dateSub method should sub dates', () => {
    spyOn(component['dataManagedService'], 'montlyDateSub')
    spyOn(component['dataManagedService'], 'monthlyFormat')
    spyOn(component, 'toggleMonthlyCalendar')
    component.dateSub()
    expect(component.toggleMonthlyCalendar).toHaveBeenCalled()
  })

  it('dateAdd method should add date', () => {
    spyOn(component['dataManagedService'], 'montlyDateAdd')
    spyOn(component['dataManagedService'], 'monthlyFormat')
    spyOn(component, 'toggleMonthlyCalendar')
    component.dateAdd()
    expect(component.toggleMonthlyCalendar).toHaveBeenCalled()
  })


  it('setLegendColor method shouyld set color-no issues', () => {
    let res = component.setLegendColor('noIssues');
    expect(res).toEqual('#57E188')
  })

  it('setLegendColor method shouyld set color-low', () => {
    let res = component.setLegendColor('low');
    expect(res).toEqual('#42C9C2')
  })

  it('setLegendColor method shouyld set color-medium', () => {
    let res = component.setLegendColor('medium');
    expect(res).toEqual('#FF9831')
  })

  it('setLegendColor method shouyld set color-high', () => {
    let res = component.setLegendColor('high');
    expect(res).toEqual('#FF736A')
  })

  it('setLegendColor method shouyld set color -missingFiles', () => {
    let res = component.setLegendColor('missingFiles');
    expect(res).toEqual('#E7E7EA')
  })

  it('setLegendColor method shouyld set color - fileNotReceived', () => {
    let res = component.setLegendColor('fileNotReceived');
    expect(res).toEqual(undefined)
  })



  // 

  it('setLegendTitle method shouyld set title-no issues', () => {
    let res = component.setLegendTitle('noIssues');
    expect(res).toEqual('No issues')
  })

  it('setLegendTitle method shouyld set title-low', () => {
    let res = component.setLegendTitle('low');
    expect(res).toEqual('Low priority issues')
  })

  it('setLegendTitle method shouyld set title-medium', () => {
    let res = component.setLegendTitle('medium');
    expect(res).toEqual('Medium priority issues')
  })

  it('setLegendTitle method shouyld set title-high', () => {
    let res = component.setLegendTitle('high');
    expect(res).toEqual('High priority issues')
  })

  it('setLegendTitle method shouyld set title -missingFiles', () => {
    let res = component.setLegendTitle('missingFiles');
    expect(res).toEqual('Missing files, past due')
  })

  it('setLegendTitle method shouyld set title - fileNotReceived', () => {
    let res = component.setLegendTitle('fileNotReceived');
    expect(res).toEqual('Files not received')
  })

  it('getDataIntakeType method should fetch data intake type', () => {
    let mockData = {
      data: []
    }
    spyOn(component['dataManagedService'], 'getReviewByGroupProviderOrDomainGrid').and.callFake(() => {
      return of(mockData)
    })
    component.getDataIntakeType()
  })

  it('viewCardDetail method should view card details', () => {
    component['routingState'] = {
      jsEncodeURI: () => { }
    } as any

    spyOn(component['_router'], 'navigate');
    component.viewCardDetail({ dataIntakeName: 'view' })
    expect(component['_router'].navigate).toHaveBeenCalled()
  })

  it('searchCompleted method should search', () => {
    let mockInput = {
      el: {
        nativeElement: {
          value: ''
        }
      }
    }
    component.dataListClone = []
    component.dataList = of(['abc'])
    component.searchCompleted(mockInput)
  })

  it('onPasteSearchActiveReports method should search activ reports', () => {
    let mockEvent = {
      clipboardData: {
        getData: () => {
          text: 'abc'
        }
      },
      preventDefault: () => { }
    } as any
    component.onPasteSearchActiveReports(mockEvent)
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

  it('patchDatePicker method should patch date picker', () => {
    let mockDate = new Date();
    component.patchDatePicker(mockDate);

  })

  it('ngOnInit should set data', () => {

    let mockResp = {
      filingName: 'Form PF',
      period: 'Q1 2022'
    }
    spyOn(component['filingService'], 'getFilingData').and.callFake(() => {
      return of(mockResp)
    })
    spyOn(sessionStorage, 'getItem').and.returnValue('01/02/2022')
    component.ngOnInit();
    expect(component.presentDate).toEqual(new Date('01/02/2022'))

  })

  it('ngOnInit should set data - buissness date', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue('')
    spyOn(component['dataManagedService'], 'businessDate').and.returnValue(new Date())
    component.ngOnInit();
    expect(component['dataManagedService'].businessDate).toHaveBeenCalled()
    //expect(component.presentDate).toEqual(new Date(date))
  })

  it('ngAfterViewInit method should set params data', () => {
    component.dailyMonthlyStatus = true;
    spyOn(component['dataManagedService'], 'monthlyFormat');
    component.ngAfterViewInit();
    expect(component['dataManagedService'].monthlyFormat).toHaveBeenCalled();
  })


  xit('dailyData method should set daily data', () => {
    DATA_FREQUENCY.DAILY = 'Daily';
    component.dataIntakeType = 'Type 1';
    // component['dailyfilter'].nativeElement = {value:'abc'}
    // component['monthlyfilter'].nativeElement = {value:'abc'} 

    //spyOn(component['renderer'],'setAttribute');
    component.dailyData(true);
    expect(component.httpQueryParams.dataFrequency).toEqual('Daily');
  })

  it('filterByIssues method should- all', () => {
    component.httpQueryParams =
      {
        filterTypes: [
          FILTER_TYPE.NO_ISSUES, FILTER_TYPE.HIGH, FILTER_TYPE.LOW, FILTER_TYPE.MEDIUM,
          FILTER_TYPE.MISSING_FILES, FILTER_TYPE.FILE_NOT_RECIEVED],
      } as any;
    component.filterByIssues('all', 'monochrome-light')
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
    expect(component.mediumIssueVariant).toEqual('monochrome-dark')
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
    expect(component.mediumIssueVariant).toEqual('monochrome-dark')
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
    expect(component.mediumIssueVariant).toEqual('monochrome-dark')
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
});
