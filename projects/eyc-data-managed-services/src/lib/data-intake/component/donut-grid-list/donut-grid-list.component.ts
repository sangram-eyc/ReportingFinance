import { Component, OnInit,ElementRef,Renderer2, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { LegendPosition, colorSets, Color } from 'eyc-charts-shared-library';
import { DataManagedService } from '../../services/data-managed.service';
import { formatDate } from '@angular/common';
import { PieChartSeriesItemDTO } from '../../models/pie-chart-series-Item-dto.model';
import {GroupByDataProviderCardGrid} from '../../models/data-grid.model';
import { AutoUnsubscriberService } from 'eyc-ui-shared-component';
import { DATA_FREQUENCY, FILTER_TYPE } from '../../../config/dms-config-helper';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiDonutSeriesItemDTO } from '../../models/api-series-Item-dto.model';
import { SmallDonutChartSeriesItemDTO } from '../../models/bar-chart-series-Item-dto.model';

@Component({
  selector: 'lib-donut-grid-list',
  templateUrl: './donut-grid-list.component.html',
  styleUrls: ['./donut-grid-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DonutGridListComponent implements OnInit, AfterViewInit {
  curDate: string;
  presentDate: Date;
  view = [];
  colorSchemeAll: Color;
  showLegend = false;
  legendTitle = 'Legend';
  legendPosition= LegendPosition.Below;
  dailyMonthlyStatus: boolean = false;
  disabledDailyMonthlyButton: boolean = false;
  dataIntakeType: string;
  form: FormGroup;
  calSelectedDate: string;
  pieData: PieChartSeriesItemDTO[];
  httpQueryParams: GroupByDataProviderCardGrid;
  Object = Object;
  lightVariant: string = "monochrome-light";
  darkVariant: string = "monochrome-dark";
  allIssueVariant: string = this.darkVariant;
  noIssueVariant: string = this.lightVariant;
  mediumLowIssueVariant: string = this.lightVariant;
  highIssueVariant: string = this.lightVariant;
  missingFileVariant: string = this.lightVariant;
  fileNotReceivedVariant: string = this.lightVariant;
  filterByIssueType: string = 'all';
  dataList:any;

  @ViewChild('dailyfilter', { static: false }) dailyfilter: ElementRef;
  @ViewChild('monthlyfilter', { static: false }) monthlyfilter: ElementRef;

  constructor(
    private dataManagedService: DataManagedService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private unsubscriber: AutoUnsubscriberService,
    private _activatedroute: ActivatedRoute,private _router: Router) {
    this.setColorScheme();
    this.dailyMonthlyStatus = sessionStorage.getItem("dailyMonthlyStatus") === 'true'? true: false;
    this._activatedroute.paramMap.subscribe(params => {
      this.dataIntakeType = params.get('dataIntakeType');
    });
  }

  ngAfterViewInit(): void {
    this.httpQueryParams =
    {
      startDate: '',
      endDate: '',
      dataFrequency: this.dailyMonthlyStatus ? DATA_FREQUENCY.MONTHLY : DATA_FREQUENCY.DAILY,
      dataIntakeType: this.dataIntakeType,
      dueDate: sessionStorage.getItem("selectedDate") ? sessionStorage.getItem("selectedDate") : `${formatDate(new Date(), 'yyyy-MM-dd', 'en')}`,
      periodType: '',
      auditFileGuidName:'',
      fileId:'',
      fileName:'',
      clientName:'',
      reportId:'',
      reportName:'',
      filterTypes: [
        FILTER_TYPE.NO_ISSUES, FILTER_TYPE.HIGH, FILTER_TYPE.LOW, FILTER_TYPE.MEDIUM,
        FILTER_TYPE.MISSING_FILES, FILTER_TYPE.FILE_NOT_RECIEVED]
    };

    if(this.dailyMonthlyStatus) {
      this.renderer.setAttribute(this.monthlyfilter.nativeElement, 'color', 'primary-alt');
      this.renderer.setAttribute(this.dailyfilter.nativeElement, 'color', 'secondary');
    } else {
      this.renderer.setAttribute(this.dailyfilter.nativeElement, 'color', 'primary-alt');
      this.renderer.setAttribute(this.monthlyfilter.nativeElement, 'color', 'secondary');
    }

    this.getDataIntakeType();
  }

  toggleCalendar(event): void {
    this.disabledDailyMonthlyButton = false;
    this.calSelectedDate = event.singleDate.formatted;
    if (this.calSelectedDate) {
      this.httpQueryParams.dueDate = this.calSelectedDate;
      this.getDataIntakeType();
      sessionStorage.setItem("selectedDate", `${this.calSelectedDate}`);
    }
  }

  ngOnInit(): void {
    const selectedDate = sessionStorage.getItem("selectedDate");
    this.curDate = formatDate(new Date(), 'MMM. dd, yyyy', 'en');
    this.presentDate = selectedDate ? new Date(selectedDate) : new Date();
   
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
  setColorScheme() {
    this.colorSchemeAll=colorSets.find(s => s.name === 'all');
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
    this.getDataIntakeType();
    sessionStorage.setItem("dailyMonthlyStatus", `${this.dailyMonthlyStatus}`);
  }

  monthlyData(status: boolean) {
    // Monthly data fetch as per click
    this.dailyMonthlyStatus = status;
    this.httpQueryParams.dataFrequency = DATA_FREQUENCY.MONTHLY;
    this.renderer.setAttribute(this.monthlyfilter.nativeElement, 'color', 'primary-alt');
    this.renderer.setAttribute(this.dailyfilter.nativeElement, 'color', '');
    if (this.dataIntakeType) {
      this.httpQueryParams.dataIntakeType = this.dataIntakeType;
    } else {
      this.httpQueryParams.dataIntakeType = '';
    }
    this.getDataIntakeType();
    sessionStorage.setItem("dailyMonthlyStatus", `${this.dailyMonthlyStatus}`);
  }

  mapDonutChartDataWithKey(fData: [ApiDonutSeriesItemDTO]): SmallDonutChartSeriesItemDTO[] {
    return fData.map(({
      lable: name,
      count:value,
      ...rest
    }) => ({
      name,
      value,
      ...rest
    }));
  }

  filterByIssues(issues: string, variants: string) {
    if(this.httpQueryParams.filterTypes.length >= 5 && this.allIssueVariant === this.darkVariant) {
      this.httpQueryParams.filterTypes = [];
    }
    issues = this.filterByIssueType;  // When filter-type will be enable remove this line
    switch (issues) {
      case 'all':
        if (variants === this.lightVariant) {
          this.allIssueVariant = this.darkVariant;
          this.noIssueVariant = this.lightVariant;
          this.mediumLowIssueVariant = this.lightVariant;
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
          this.filterTypes('push',[FILTER_TYPE.NO_ISSUES]);
        } else {
          this.allIssueVariant = this.lightVariant;
          this.noIssueVariant = this.lightVariant;
          this.filterTypes('pop',[FILTER_TYPE.NO_ISSUES]);
        }
        break;
      case FILTER_TYPE.MEDIUM_LOW:
        if (variants === this.lightVariant) {
          this.allIssueVariant = this.lightVariant;
          this.mediumLowIssueVariant = this.darkVariant;
          this.filterTypes('push',[FILTER_TYPE.MEDIUM,FILTER_TYPE.LOW]);
        } else {
          this.allIssueVariant = this.lightVariant;
          this.mediumLowIssueVariant = this.lightVariant;
          this.filterTypes('pop',[FILTER_TYPE.MEDIUM,FILTER_TYPE.LOW]);
        }
        break;
      case FILTER_TYPE.HIGH:
        if (variants === this.lightVariant) {
          this.allIssueVariant = this.lightVariant;
          this.highIssueVariant = this.darkVariant;
          this.filterTypes('push',[FILTER_TYPE.HIGH]);
        } else {
          this.allIssueVariant = this.lightVariant;
          this.highIssueVariant = this.lightVariant;
          this.filterTypes('pop',[FILTER_TYPE.HIGH]);
        }
        break;
      case FILTER_TYPE.MISSING_FILES:
        if (variants === this.lightVariant) {
          this.allIssueVariant = this.lightVariant;
          this.missingFileVariant = this.darkVariant;
          this.filterTypes('push',[FILTER_TYPE.MISSING_FILES]);
         } else {
          this.allIssueVariant = this.lightVariant;
          this.missingFileVariant = this.lightVariant;
          this.filterTypes('pop',[FILTER_TYPE.MISSING_FILES]);
         }
        break;
      case FILTER_TYPE.FILE_NOT_RECIEVED:
        if (variants === this.lightVariant) {
          this.allIssueVariant = this.lightVariant;
          this.fileNotReceivedVariant = this.darkVariant;
          this.filterTypes('push',[FILTER_TYPE.FILE_NOT_RECIEVED]);
        } else {
          this.allIssueVariant = this.lightVariant;
          this.fileNotReceivedVariant = this.lightVariant;
          this.filterTypes('pop',[FILTER_TYPE.FILE_NOT_RECIEVED]);
        }
        break;
        default:
          break;
    }
    if(this.httpQueryParams.filterTypes.length <= 0) {
      this.allIssueVariant = this.darkVariant;
      this.noIssueVariant = this.lightVariant;
      this.mediumLowIssueVariant = this.lightVariant;
      this.highIssueVariant = this.lightVariant;
      this.missingFileVariant = this.lightVariant;
      this.fileNotReceivedVariant = this.lightVariant;
      this.httpQueryParams.filterTypes = [
        FILTER_TYPE.NO_ISSUES, FILTER_TYPE.HIGH, FILTER_TYPE.LOW, FILTER_TYPE.MEDIUM,
        FILTER_TYPE.MISSING_FILES, FILTER_TYPE.FILE_NOT_RECIEVED];
    }
    this.getDataIntakeType(); // When filter-type will be enable uncomment this line
    this.cdr.detectChanges();
  }

  filterTypes(method: string, types: string[]) {
    switch (method) {
      case 'push':
        types.map((type) => {
          const index = this.httpQueryParams.filterTypes.indexOf(type);
          (index < 0) 
          ? this.httpQueryParams.filterTypes.push(type) 
          : null ;
        });
        break;
      case 'pop':
        types.map((type) => {
          const index = this.httpQueryParams.filterTypes.indexOf(type);
          (index !== -1) ? this.httpQueryParams.filterTypes.splice(index, 1) : null ;
        });
        break;
      default:
        break;
    }
  }

  getDataIntakeType(){
    // this.dataList = [];
    this.dataManagedService.getReviewByGroupProviderOrDomainGrid(this.httpQueryParams).pipe(this.unsubscriber.takeUntilDestroy).subscribe((data: any) => {
      debugger;
      this.dataList=data.data;
      console.log(data);
    });
  }
}
