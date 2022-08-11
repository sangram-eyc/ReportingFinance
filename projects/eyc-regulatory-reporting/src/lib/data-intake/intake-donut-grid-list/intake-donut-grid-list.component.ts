import { Component, OnInit, ElementRef, Renderer2, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { LegendPosition, colorSets, Color } from 'eyc-charts-shared-library';
import { AutoUnsubscriberService } from 'eyc-ui-shared-component';
import { DATA_FREQUENCY, DATA_INTAKE_TYPE, DATA_INTAKE_TYPE_DISPLAY_TEXT, FileFilterStatus, FILTER_TYPE,FILTER_TYPE_TITLE,INPUT_VALIDATON_CONFIG,PowerBiReportDailyList,PowerBiReportDailyListProd,PowerBiReportMonthlyList,PowerBiReportMonthlyListProd,ROUTE_URL_CONST, } from '../../config/intake-config-helpers';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IntakeLandingService } from '../services/intake-landing.service';
import { BarChartSeriesItemDTO, SmallDonutChartSeriesItemDTO } from '../models/bar-chart-series-Item-dto.model';
import { NO_FILE_MISSING_PAST_DUE, NO_HIGH_PRIORITY_ISSUES, NO_LOW_PRIORITY_ISSUES, NO_MEDUIM_PRIORITY_ISSUES, PBI_CONFIG } from '../../config/intake-config-helpers';
import { donutSummariesObject } from '../models/donut-chart-summary.model';
import { DataSummary } from '../models/data-summary.model';
import { ApiDonutSeriesItemDTO, ApiSeriesItemDTO } from '../models/api-series-Item-dto.model';
import { PieChartSeriesItemDTO } from 'projects/eyc-data-managed-services/src/lib/data-intake/models/pie-chart-series-Item-dto.model';
import { GroupByDataProviderCardGrid } from '../models/data-grid.model';
import { Observable, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { IntakeRoutingStateService } from './../services/intake-routing-state.service';
import { RegulatoryReportingFilingService } from '../../regulatory-reporting-filing/services/regulatory-reporting-filing.service';

@Component({
  selector: 'lib-intake-donut-grid-list',
  templateUrl: './intake-donut-grid-list.component.html',
  styleUrls: ['./intake-donut-grid-list.component.scss']
})
export class IntakeDonutGridListComponent implements OnInit, AfterViewInit {
  presentDate: Date;
  view = [];
  showLegend = false;
  legendTitle = 'Legend';
  legendPosition = LegendPosition.Below;
  dailyMonthlyStatus: boolean = false;
  disabledDailyMonthlyButton: boolean = false;
  dataIntakeType: string;
  dataIntakeTypeDisplay: object;
  dataIntakeTypeDisplayText=DATA_INTAKE_TYPE_DISPLAY_TEXT;
  form: FormGroup;
  calSelectedDate: string;
  pieData: PieChartSeriesItemDTO[];
  httpQueryParams: GroupByDataProviderCardGrid;
  Object = Object;
  lightVariant: string = "monochrome-light";
  darkVariant: string = "monochrome-dark";
  allIssueVariant: string = this.darkVariant;
  noIssueVariant: string = this.lightVariant;
  lowIssueVariant: string = this.lightVariant;
  mediumIssueVariant: string = this.lightVariant;
  highIssueVariant: string = this.lightVariant;
  missingFileVariant: string = this.lightVariant;
  fileNotReceivedVariant: string = this.lightVariant;
  filterByIssueType: string = 'all';
  dataList: Observable<any[]>;
  dataListClone: [];
  totalDataIntakeTypeCount: number;
  FILTER_TYPE_TITLE = FILTER_TYPE_TITLE;
  FILTER_TYPE = FILTER_TYPE;
  colorSchemeAll: Color = colorSets.find(s => s.name === 'all');
  calSelectedMonth: string;
  curDate:string;
  isDisplay:boolean=false;
  routeUrlConst=ROUTE_URL_CONST;
  filingName: string;
  period: string;

  customColors: any = [
    { name: FILTER_TYPE_TITLE.noIssues, value: this.colorSchemeAll.domain[0] },
    { name: FILTER_TYPE_TITLE.low, value: this.colorSchemeAll.domain[1] },
    { name: FILTER_TYPE_TITLE.medium, value: this.colorSchemeAll.domain[2] },
    { name: FILTER_TYPE_TITLE.high, value: this.colorSchemeAll.domain[3] },
    { name: FILTER_TYPE_TITLE.missingFiles, value: this.colorSchemeAll.domain[4] },
    { name: FILTER_TYPE_TITLE.fileNotReceived, value: this.colorSchemeAll.domain[5] },
  ];


  @ViewChild('dailyfilter', { static: false }) dailyfilter: ElementRef;
  @ViewChild('monthlyfilter', { static: false }) monthlyfilter: ElementRef;

  lastMonthDate: Date;
  lastMonthDueDateFormat: string;
  presentDateFormat: string;
  presentMonthDate: Date;
  presentMonthFormat: string;

  constructor(
    private dataManagedService: IntakeLandingService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private unsubscriber: AutoUnsubscriberService,
    private _activatedroute: ActivatedRoute, private _router: Router,
    private routingState: IntakeRoutingStateService,
    private filingService: RegulatoryReportingFilingService
    ) {
    this.dailyMonthlyStatus = sessionStorage.getItem("dailyMonthlyStatus") === 'true' ? true : false;
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth());
    this.lastMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    this.lastMonthDueDateFormat = this.dataManagedService.apiDateFormat(this.lastMonthDate);
    this.presentMonthDate = this.lastMonthDate;
    this.presentMonthFormat = this.dataManagedService.monthlyFormat(this.presentMonthDate);

    this._activatedroute.paramMap.subscribe(params => {
      this.dataIntakeType = params.get('dataIntakeType');
      if (this.dataIntakeType == DATA_INTAKE_TYPE.DATA_PROVIDER) {
        this.dataIntakeTypeDisplay = this.dataIntakeTypeDisplayText.DATA_PROVIDER;
      }
      else {
        this.dataIntakeTypeDisplay = this.dataIntakeTypeDisplayText.DATA_DOMAIN;
      }
    });
  }

  ngAfterViewInit(): void {
    let dueDate;
    dueDate = this.presentDateFormat;
    if (this.dailyMonthlyStatus) {
      this.presentMonthFormat = this.dataManagedService.monthlyFormat(this.presentMonthDate);
      dueDate = this.dataManagedService.apiDateFormat(this.presentMonthDate);
    }

    this.httpQueryParams =
    {
      startDate: '',
      endDate: '',
      dataFrequency: this.dailyMonthlyStatus ? DATA_FREQUENCY.MONTHLY : DATA_FREQUENCY.DAILY,
      dataIntakeType: this.dataIntakeType,
      dueDate: dueDate,
      regulationFormReportingPeriodDate: this.period,
      displayName: this.filingName,
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
    };

    
    // if (this.dailyMonthlyStatus) {
    //   this.renderer.setAttribute(this.monthlyfilter.nativeElement, 'color', 'primary-alt');
    //   this.renderer.setAttribute(this.dailyfilter.nativeElement, 'color', '');
    // } else {
    //   this.renderer.setAttribute(this.dailyfilter.nativeElement, 'color', 'primary-alt');
    //   this.renderer.setAttribute(this.monthlyfilter.nativeElement, 'color', '');
    // }

    this.getDataIntakeType();
  }

  patchDatePicker(patchDatePickerValue: Date) {
    const updateDatePicker = {
      isRange: false,
      singleDate: {
        date: {
          year: patchDatePickerValue.getFullYear(),
          month: patchDatePickerValue.getMonth() + 1,
          day: patchDatePickerValue.getDate()
        }
      }
    };
    this.form.patchValue({ datepicker: updateDatePicker });
  }

  ngOnInit(): void {
    if (this.filingService.getFilingData) {
      this.filingName = this.filingService.getFilingData.filingName;
      this.period = this.filingService.getFilingData.period;
    }
    this.curDate = this.dataManagedService.monthlyFormat(this.lastMonthDate);
    const selectedDate = sessionStorage.getItem("selectedDate");
    if (selectedDate) {
      this.presentDate = new Date(new Date(selectedDate).toDateString());
      this.presentMonthDate = this.dataManagedService.monthLastDate(this.presentDate);
    } else {
      this.presentDate = this.dataManagedService.businessDate(new Date());
      this.presentMonthDate = this.dataManagedService.prevMonthLastDate(new Date());
    }
    this.presentDateFormat = this.dataManagedService.apiDateFormat(this.presentDate);
    
    this.form = new FormGroup({
      datepicker: new FormControl({
        isRange: false,
        singleDate: {
          date: {
            year: this.presentDate.getFullYear(),
            month: this.presentDate.getMonth() + 1,
            day: this.presentDate.getDate()
          }
        }
      }, [Validators.required])
    });
  }

  toggleCalendar(event): void {
    this.disabledDailyMonthlyButton = false;
    this.calSelectedDate = event.singleDate.jsDate;
    if (this.calSelectedDate) {
      this.httpQueryParams.dueDate = this.dataManagedService.ymdToApiDateFormat(this.calSelectedDate);
      this.getDataIntakeType();
      sessionStorage.setItem("selectedDate", `${this.calSelectedDate}`);
    }
  }

  toggleMonthlyCalendar(): void {
    this.disabledDailyMonthlyButton = false;
    this.httpQueryParams.dueDate = this.dataManagedService.apiDateFormat(this.presentMonthDate);
    this.getDataIntakeType();
    sessionStorage.setItem("selectedDate", `${this.presentMonthDate}`);
  }

  dateSub() {
    this.presentMonthDate = this.dataManagedService.montlyDateSub(this.presentMonthDate);
    this.presentMonthFormat = this.dataManagedService.monthlyFormat(this.presentMonthDate);
    this.toggleMonthlyCalendar();
  }

  dateAdd() {
    this.presentMonthDate = this.dataManagedService.montlyDateAdd(this.presentMonthDate);
    this.presentMonthFormat = this.dataManagedService.monthlyFormat(this.presentMonthDate);
    this.toggleMonthlyCalendar();
  }

  dailyData(status: boolean) {
    // Daily data fetch as per click
    this.dailyMonthlyStatus = status;
    this.httpQueryParams.dataFrequency = DATA_FREQUENCY.DAILY;
    this.renderer.setAttribute(this.dailyfilter.nativeElement, 'color', 'primary-alt');
    this.renderer.setAttribute(this.monthlyfilter.nativeElement, 'color', '');

    if (this.dataIntakeType) {
      this.httpQueryParams.dataIntakeType = this.dataIntakeType;
    } else {
      this.httpQueryParams.dataIntakeType = '';
    }
    if(!sessionStorage.getItem("selectedDate")){
      this.httpQueryParams.dueDate = this.presentDateFormat;
      this.patchDatePicker(this.presentDate);
    } else {
      const sesstionDate =  this.dataManagedService.ymdToApiDateFormat(sessionStorage.getItem("selectedDate"));
      this.httpQueryParams.dueDate = sesstionDate;
      this.patchDatePicker(new Date(sesstionDate));
    }

    this.getDataIntakeType();
    sessionStorage.setItem("dailyMonthlyStatus", `${this.dailyMonthlyStatus}`);
  }

  monthlyData(status: boolean) {
    // Monthly data fetch as per click
    this.dailyMonthlyStatus = status;
    this.httpQueryParams.dataFrequency = DATA_FREQUENCY.MONTHLY;
    this.renderer.setAttribute(this.monthlyfilter.nativeElement, 'color', 'primary-alt');
    this.renderer.setAttribute(this.dailyfilter.nativeElement, 'color', '');


    const monthlySelectedDate =  sessionStorage.getItem("selectedDate");
    if (monthlySelectedDate) {
      this.presentMonthDate = this.dataManagedService.monthLastDate(new Date(monthlySelectedDate)); 
    } else {
      this.presentMonthDate = this.dataManagedService.prevMonthLastDate(new Date());   
    }
    this.presentMonthFormat = this.dataManagedService.monthlyFormat(this.presentMonthDate);
    this.httpQueryParams.dueDate = this.dataManagedService.apiDateFormat(this.presentMonthDate);
   
    if (this.dataIntakeType) {
      this.httpQueryParams.dataIntakeType = this.dataIntakeType;
    } else {
      this.httpQueryParams.dataIntakeType = '';
    }
    
    if(!sessionStorage.getItem("selectedDate")){
      this.patchDatePicker(this.lastMonthDate);
      this.httpQueryParams.dueDate = this.lastMonthDueDateFormat;
    }

    this.getDataIntakeType();
    sessionStorage.setItem("dailyMonthlyStatus", `${this.dailyMonthlyStatus}`);
  }

  mapDonutChartDataWithKey(fData: [ApiDonutSeriesItemDTO]): SmallDonutChartSeriesItemDTO[] {
    return fData.map(({
      lable: name,
      ...rest
    }) => ({
      name,
      ...rest
    }));
  }

  setLegendColor(status) {
    switch (status) {
      case FILTER_TYPE.NO_ISSUES:
        return this.colorSchemeAll.domain[0];
      case FILTER_TYPE.LOW:
        return this.colorSchemeAll.domain[1];
      case FILTER_TYPE.MEDIUM:
        return this.colorSchemeAll.domain[2];
      case FILTER_TYPE.HIGH:
        return this.colorSchemeAll.domain[3];
      case FILTER_TYPE.MISSING_FILES:
        return this.colorSchemeAll.domain[4];
      case FILTER_TYPE.FILE_NOT_RECIEVED:
        return this.colorSchemeAll.domain[5];
      default:
        break;
    }
  }

  setLegendTitle(status){
    switch (status) {
      case FILTER_TYPE.NO_ISSUES:
        return this.FILTER_TYPE_TITLE.noIssues;
      case FILTER_TYPE.LOW:
        return this.FILTER_TYPE_TITLE.low;
      case FILTER_TYPE.MEDIUM:
        return this.FILTER_TYPE_TITLE.medium;
      case FILTER_TYPE.HIGH:
        return this.FILTER_TYPE_TITLE.high;
      case FILTER_TYPE.MISSING_FILES:
        return this.FILTER_TYPE_TITLE.missingFiles;
      case FILTER_TYPE.FILE_NOT_RECIEVED:
        return this.FILTER_TYPE_TITLE.fileNotReceived;
      default:
        break;
    }
  }

  filterByIssues(issues: string, variants: string) {
    if (this.httpQueryParams.filterTypes.length >= 5 && this.allIssueVariant === this.darkVariant) {
      this.httpQueryParams.filterTypes = [];
    }
    switch (issues) {
      case 'all':
        if (variants === this.lightVariant) {
          this.allIssueVariant = this.darkVariant;
          this.noIssueVariant = this.lightVariant;
          this.lowIssueVariant = this.lightVariant;
          this.mediumIssueVariant = this.lightVariant;
          this.highIssueVariant = this.lightVariant;
          this.missingFileVariant = this.lightVariant;
          this.fileNotReceivedVariant = this.lightVariant;
          this.httpQueryParams.filterTypes = [
            FILTER_TYPE.NO_ISSUES, FILTER_TYPE.HIGH, FILTER_TYPE.LOW, FILTER_TYPE.MEDIUM,
            FILTER_TYPE.MISSING_FILES, FILTER_TYPE.FILE_NOT_RECIEVED];
        }
        break;

      case FILTER_TYPE.NO_ISSUES:
        if (variants === this.lightVariant) {
          this.allIssueVariant = this.lightVariant;
          this.noIssueVariant = this.darkVariant;
          this.filterTypes('push', [FILTER_TYPE.NO_ISSUES]);
        } else {
          this.allIssueVariant = this.lightVariant;
          this.noIssueVariant = this.lightVariant;
          this.filterTypes('pop', [FILTER_TYPE.NO_ISSUES]);
        }
        break;
        case FILTER_TYPE.LOW:
          if (variants === this.lightVariant) {
            this.allIssueVariant = this.lightVariant;
            this.lowIssueVariant = this.darkVariant;
            this.filterTypes('push', [FILTER_TYPE.LOW]);
          } else {
            this.allIssueVariant = this.lightVariant;
            this.lowIssueVariant = this.lightVariant;
            this.filterTypes('pop', [FILTER_TYPE.LOW]);
          }
          break;
      case FILTER_TYPE.MEDIUM:
        if (variants === this.lightVariant) {
          this.allIssueVariant = this.lightVariant;
          this.mediumIssueVariant = this.darkVariant;
          this.filterTypes('push', [FILTER_TYPE.MEDIUM]);
        } else {
          this.allIssueVariant = this.lightVariant;
          this.mediumIssueVariant = this.lightVariant;
          this.filterTypes('pop', [FILTER_TYPE.MEDIUM]);
        }
        break;
      case FILTER_TYPE.HIGH:
        if (variants === this.lightVariant) {
          this.allIssueVariant = this.lightVariant;
          this.highIssueVariant = this.darkVariant;
          this.filterTypes('push', [FILTER_TYPE.HIGH]);
        } else {
          this.allIssueVariant = this.lightVariant;
          this.highIssueVariant = this.lightVariant;
          this.filterTypes('pop', [FILTER_TYPE.HIGH]);
        }
        break;
      case FILTER_TYPE.MISSING_FILES:
        if (variants === this.lightVariant) {
          this.allIssueVariant = this.lightVariant;
          this.missingFileVariant = this.darkVariant;
          this.filterTypes('push', [FILTER_TYPE.MISSING_FILES]);
        } else {
          this.allIssueVariant = this.lightVariant;
          this.missingFileVariant = this.lightVariant;
          this.filterTypes('pop', [FILTER_TYPE.MISSING_FILES]);
        }
        break;
      case FILTER_TYPE.FILE_NOT_RECIEVED:
        if (variants === this.lightVariant) {
          this.allIssueVariant = this.lightVariant;
          this.fileNotReceivedVariant = this.darkVariant;
          this.filterTypes('push', [FILTER_TYPE.FILE_NOT_RECIEVED]);
        } else {
          this.allIssueVariant = this.lightVariant;
          this.fileNotReceivedVariant = this.lightVariant;
          this.filterTypes('pop', [FILTER_TYPE.FILE_NOT_RECIEVED]);
        }
        break;
      default:
        break;
    }
    if (this.httpQueryParams.filterTypes.length <= 0) {
      this.allIssueVariant = this.darkVariant;
      this.noIssueVariant = this.lightVariant;
      this.lowIssueVariant = this.lightVariant;
      this.mediumIssueVariant = this.lightVariant;
      this.highIssueVariant = this.lightVariant;
      this.missingFileVariant = this.lightVariant;
      this.fileNotReceivedVariant = this.lightVariant;
      this.httpQueryParams.filterTypes = [
        FILTER_TYPE.NO_ISSUES, FILTER_TYPE.HIGH, FILTER_TYPE.LOW, FILTER_TYPE.MEDIUM,
        FILTER_TYPE.MISSING_FILES, FILTER_TYPE.FILE_NOT_RECIEVED];
    }
    this.getDataIntakeType();
  }

  filterTypes(method: string, types: string[]) {
    switch (method) {
      case 'push':
        types.map((type) => {
          const index = this.httpQueryParams.filterTypes.indexOf(type);
          (index < 0)
            ? this.httpQueryParams.filterTypes.push(type)
            : null;
        });
        break;
      case 'pop':
        types.map((type) => {
          const index = this.httpQueryParams.filterTypes.indexOf(type);
          (index !== -1) ? this.httpQueryParams.filterTypes.splice(index, 1) : null;
        });
        break;
      default:
        break;
    }
  }

  viewCardDetail(item) {
    if (item && item.dataIntakeName) {
      this._router.navigate([ROUTE_URL_CONST.FILE_REVIEW_URL, this.dataIntakeType, this.routingState.jsEncodeURI(item.dataIntakeName.trim())]);
    }
  }

  getDataIntakeType() {
    this.dataListClone = [];
    this.dataManagedService.getReviewByGroupProviderOrDomainGrid(this.httpQueryParams).pipe(this.unsubscriber.takeUntilDestroy).subscribe((data: any) => {
      this.dataList = of(data.data);
      this.dataListClone = data.data;
      this.totalDataIntakeTypeCount = this.dataListClone.length;
      this.cdr.detectChanges();
    });
  }

   // Table methods
  searchCompleted(input) {
    const searchItem = (input.el.nativeElement.value).toLowerCase();
    if (searchItem && searchItem.length <= 0) {
      this.dataList = of(JSON.parse(JSON.stringify(this.dataListClone)));
    } else {
      this.dataList.subscribe(() => {
        const dataListClone = JSON.parse(JSON.stringify(this.dataListClone));
        const searchedDataList = dataListClone.filter(({ dataIntakeName }) => {
          const regex = new RegExp(`${searchItem}`, "g");
          return (dataIntakeName).toLowerCase().match(regex);
        });
        this.totalDataIntakeTypeCount = searchedDataList.length;
        this.dataList = of(searchedDataList);
      });
    }
  }

  onPasteSearchActiveReports(event: ClipboardEvent) {
    let clipboardData = event.clipboardData;
    let pastedText = (clipboardData.getData('text')).split("");    
    pastedText.forEach((ele, index) => {
      if (INPUT_VALIDATON_CONFIG.SEARCH_INPUT_VALIDATION.test(ele)) {
        if ((pastedText.length - 1) === index) {
          return true;
        }
      } else {
        event.preventDefault();
        return false;
      }
    });
  }

  searchFilingValidation(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (INPUT_VALIDATON_CONFIG.SEARCH_INPUT_VALIDATION.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }


}

