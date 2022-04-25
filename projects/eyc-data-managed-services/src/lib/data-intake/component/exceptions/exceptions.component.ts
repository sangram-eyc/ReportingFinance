import { Component, OnInit, ElementRef, Renderer2, ViewChild, TemplateRef } from '@angular/core';
import { DataManagedService } from '../../services/data-managed.service';
import { formatDate } from '@angular/common';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { AutoUnsubscriberService, CustomGlobalService, ModalComponent, TableHeaderRendererComponent } from 'eyc-ui-shared-component';
import { GridDataSet } from '../../models/grid-dataset.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ExceptionDataGrid } from '../../models/data-grid.model';
import { DATA_FREQUENCY, DATA_INTAKE_TYPE, DATA_INTAKE_TYPE_DISPLAY_TEXT, FILTER_TYPE, FILTER_TYPE_TITLE,ROUTE_URL_CONST, INPUT_VALIDATON_CONFIG } from '../../../config/dms-config-helper';
import { RowClickedEvent } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RoutingStateService } from '../../services/routing-state.service';
import { colorSets, Color } from 'eyc-charts-shared-library';


@Component({
  selector: 'lib-exceptions',
  templateUrl: './exceptions.component.html',
  styleUrls: ['./exceptions.component.scss']
})
export class ExceptionsComponent implements OnInit {
  previousRoute: string;
  routeHistory: any;
  fileName:string;
  filereviewUrl: string;
  isDataIntaketype: boolean = false;
  dataIntakeTypeDisplay: object;
  dataIntakeTypeDisplayText = DATA_INTAKE_TYPE_DISPLAY_TEXT;
  dataIntakeTypeUrl: string = '';
  routeUrlConst=ROUTE_URL_CONST;
  colorSchemeAll: Color = colorSets.find(s => s.name === 'all');
  @ViewChild('dailyfilter', { static: false }) dailyfilter: ElementRef;
  @ViewChild('monthlyfilter', { static: false }) monthlyfilter: ElementRef;


  @ViewChild('reportNameTemplate')
  reportNameTemplate: TemplateRef<any>;
  @ViewChild('chipTemplate')
  chipTemplate: TemplateRef<any>;
  @ViewChild('commentTemplate')
  commentTemplate: TemplateRef<any>;

  @ViewChild('nextButtonTemplate')
  nextButtonTemplate: TemplateRef<any>;


  presentDate: Date;
  isDisplay:boolean=false;
  curDate:string;
  calSelectedMonth: string;
  form: FormGroup;
  calSelectedDate: string;
  disabledDailyMonthlyButton: boolean = false;
  dailyMonthlyStatus: boolean = false;
  ExceptionFileName: string;
  ExceptionAuditGuidName: string;
  ExceptionFileNameAlias: string;
  FILTER_TYPE_TITLE = FILTER_TYPE_TITLE;
  FILTER_TYPE = FILTER_TYPE;
  noExceptionDataAvilable: boolean;
  searchNoDataAvilable: boolean = false;
  dataExplorer = false;
  httpDataGridParams: ExceptionDataGrid;
  columnGl = [];
  glRowdata = [];
  gridApi;
  domLayout = 'autoHeight';
  MotifTableCellRendererComponent = MotifTableCellRendererComponent;
  TableHeaderRendererComponent = TableHeaderRendererComponent;

  noOfCompletdFilingRecords = 10;
  currentPage = 1;
  maxPages = 5;
  dataset: GridDataSet[] = [{
    disable: false,
    value: 10,
    name: '10',
    id: 0
  },
  {
    disable: false,
    value: 25,
    name: '25',
    id: 1
  },
  {
    disable: false,
    value: 50,
    name: '50',
    id: 2
  }];

  currentlySelectedPageSize: GridDataSet = {
    disable: false,
    value: 10,
    name: '10',
    id: 0
  };
  commentEntityType
  showComments = false;
  commentsName;
  entityId;
 
  lastMonthDate: Date;
  lastMonthDueDateFormat: string;
  presentDateFormat: string;

  constructor(
    private unsubscriber: AutoUnsubscriberService,
    private dataManagedService: DataManagedService,
    private renderer: Renderer2, private customglobalService: CustomGlobalService,
    public dialog: MatDialog,
    private _activatedroute: ActivatedRoute,private _router: Router,private routingState: RoutingStateService) {
      this.dailyMonthlyStatus = sessionStorage.getItem("dailyMonthlyStatus") === 'true'? true: false;
      const currentDate = new Date();
      currentDate.setMonth(currentDate.getMonth());
      this.lastMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
      this.lastMonthDueDateFormat = `${formatDate(this.lastMonthDate, 'yyyy-MM-dd', 'en')}`;
      this._activatedroute.paramMap.subscribe(params => {
        this.ExceptionFileName = params.get('paramFilename');
        this.ExceptionAuditGuidName = params.get('paramguidName');
        this.ExceptionFileNameAlias=params.get('paramfileNameAlias');
      });
  
  }

  ngOnInit(): void {
    this.curDate = formatDate(this.lastMonthDate, 'MMMM  yyyy', 'en');
    const selectedDate = sessionStorage.getItem("selectedDate");
    if (selectedDate) {
      this.presentDate = new Date(new Date(selectedDate).toLocaleDateString());
    } else {
      this.presentDate = this.dataManagedService.businessDate(new Date());
    }
    this.presentDateFormat = `${formatDate(this.presentDate, 'yyyy-MM-dd', 'en')}`;
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
    this.previousRoute = this.routingState.getPreviousUrl();
    this.routeHistory = this.routingState.getHistory();

    const routeArray = this.previousRoute.split("/");
    const routePart = routeArray[routeArray.length - 2]

    if (routePart == DATA_INTAKE_TYPE.DATA_PROVIDER || routePart == DATA_INTAKE_TYPE.DATA_DOMAIN) {
      this.isDataIntaketype = true;
      this.fileName= routeArray[routeArray.length - 1];
      if (routePart == DATA_INTAKE_TYPE.DATA_PROVIDER) {
        this.dataIntakeTypeDisplay = this.dataIntakeTypeDisplayText.DATA_PROVIDER;
      }
      else {
        this.dataIntakeTypeDisplay = this.dataIntakeTypeDisplayText.DATA_DOMAIN;
      }
      this.dataIntakeTypeUrl = this.routeHistory.find(url => url.includes(ROUTE_URL_CONST.DATA_INTAKE_TYPE_URL));
    }
    else if (routePart == "files" || routeArray[2]=="files") {
      const urlPartArray=this.routeHistory.find(url => url.includes(ROUTE_URL_CONST.FILE_REVIEW_URL)).split("/");
      const urlPart=urlPartArray[urlPartArray.length - 2];
      if (urlPart == DATA_INTAKE_TYPE.DATA_PROVIDER || urlPart == DATA_INTAKE_TYPE.DATA_DOMAIN) {
        this.isDataIntaketype = true;
        this.fileName=urlPartArray[urlPartArray.length - 1];
        if (urlPart == DATA_INTAKE_TYPE.DATA_PROVIDER) {
          this.dataIntakeTypeDisplay = this.dataIntakeTypeDisplayText.DATA_PROVIDER;
        }
        else {
          this.dataIntakeTypeDisplay = this.dataIntakeTypeDisplayText.DATA_DOMAIN;
        }
        this.dataIntakeTypeUrl = this.routeHistory.find(url => url.includes(ROUTE_URL_CONST.DATA_INTAKE_TYPE_URL));
      }
      else {
        this.fileName="Files";
        this.isDataIntaketype = false;
      }
    }else if((routeArray[routeArray.length - 1])=="files-review"){
      this.isDataIntaketype = false;
      this.fileName="Files";
    }
    else {
      this.isDataIntaketype = false;
    }
      this.filereviewUrl = this.routeHistory.find(url => url.includes(ROUTE_URL_CONST.FILE_REVIEW_URL));
  }

  ngAfterViewInit(): void {
    let dueDate;
    if (sessionStorage.getItem("selectedDate")) {
      dueDate = `${formatDate(new Date(sessionStorage.getItem("selectedDate")).toLocaleDateString(), 'yyyy-MM-dd', 'en')}`;
    } else if (this.dailyMonthlyStatus) {
      dueDate = this.lastMonthDueDateFormat;
      this.patchDatePicker(this.lastMonthDate);
    } else {
      dueDate = this.presentDateFormat;
    }

    this.httpDataGridParams = {
      startDate: '',
      endDate: '',
      dataFrequency: this.dailyMonthlyStatus ? DATA_FREQUENCY.MONTHLY : DATA_FREQUENCY.DAILY,
      dueDate: dueDate,
      periodType: '',
      clientName: '',
      auditFileGuidName: this.ExceptionAuditGuidName,
      fileId: '',
      fileName: this.ExceptionFileNameAlias
    };
    if (this.dailyMonthlyStatus) {
      this.renderer.setAttribute(this.monthlyfilter.nativeElement, 'color', 'primary-alt');
      this.renderer.setAttribute(this.dailyfilter.nativeElement, 'color', '');
    } else {
      this.renderer.setAttribute(this.dailyfilter.nativeElement, 'color', 'primary-alt');
      this.renderer.setAttribute(this.monthlyfilter.nativeElement, 'color', '');
    }
    this.getExceptionTableData();
  }

  // Table methods
  searchCompleted(input) {
    this.gridApi.setQuickFilter(input.el.nativeElement.value);
    this.searchNoDataAvilable = (this.gridApi.rowModel.rowsToDisplay.length === 0)
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

  getExceptionTableData() {
    this.dataManagedService.getExceptionTableData(this.httpDataGridParams).pipe(this.unsubscriber.takeUntilDestroy).subscribe(resp => {
      resp['data'].length === 0 ? this.noExceptionDataAvilable = true : this.noExceptionDataAvilable = false;
      this.glRowdata = resp['data'];
      this.columnGl = [
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Exception Report Type',
          field: 'type',
          sortable: true,
          filter: false,
          minWidth: 150,
          wrapText: false,
          autoHeight: true
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          headerName: 'Exception Report Name',
          field: 'name',
          sortable: true,
          filter: false,
          minWidth: 400,
          wrapText: true,
          autoHeight: true,
          cellRendererParams: {
            ngTemplate: this.reportNameTemplate
          }
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          headerName: 'Exceptions Priority Level',
          field: 'priority',
          sortable: true,
          filter: false,
          minWidth: 200,
          cellRendererParams: {
            ngTemplate: this.chipTemplate,
          }
        },
        // {
        //   headerComponentFramework: TableHeaderRendererComponent,
        //   cellRendererFramework: MotifTableCellRendererComponent,
        //   cellRendererParams: {
        //     ngTemplate: this.commentTemplate,
        //   },
        //   headerName: 'Comments',
        //   field: 'comments',
        //   sortable: false,
        //   filter: false,
        //   width: 155
        // },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Exceptions',
          field: 'exceptionCount',
          sortable: true,
          filter: false,
          minWidth: 200,
          wrapText: false,
          autoHeight: true,
          valueGetter: function (params) {
            if (params.data.exceptionCount) {
              return params.data.exceptionCount
            } else {
              return '--'
            }
          }
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          headerName: '',
          field: 'next',
          sortable: false,
          filter: false,
          minWidth: 100,
          cellRendererParams: {
            ngTemplate: this.nextButtonTemplate,
          }
        },
      ];
    });
  }


  toggleCalendar(event): void {
    this.disabledDailyMonthlyButton = false;
    this.calSelectedDate = event.singleDate.jsDate;
    if (this.calSelectedDate) {
      this.httpDataGridParams.dueDate =`${formatDate(new Date(this.calSelectedDate).toLocaleDateString(), 'yyyy-MM-dd', 'en')}`;
      sessionStorage.setItem("selectedDate", `${this.calSelectedDate}`);
      this.getExceptionTableData();
    }
  }

  toggleMonthlyCalendar(event): void {
    this.disabledDailyMonthlyButton = false;
    this.calSelectedMonth = event;
    if (this.calSelectedMonth) {
      this.httpDataGridParams.dueDate = this.dataManagedService.getLastDayOfMonthFormatted(this.calSelectedMonth);
      this.getExceptionTableData();
    }   
  }

  dateSub(presentDate) {
    let dateVal = this.dataManagedService.montlyDateSub(presentDate,this.calSelectedMonth);
    this.toggleMonthlyCalendar(dateVal);
    this.curDate = formatDate(dateVal, 'MMMM  yyyy', 'en');
  }

  dateAdd(presentDate) {
  let dateVal = this.dataManagedService.montlyDateAdd(presentDate,this.calSelectedMonth);
  this.toggleMonthlyCalendar(dateVal);
  this.curDate = formatDate(dateVal, 'MMMM  yyyy', 'en');
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

  dailyData(status: boolean) {
    // Daily data fetch as per click
    this.dailyMonthlyStatus = status;
    this.httpDataGridParams.dataFrequency = DATA_FREQUENCY.DAILY;

    if (this.isDisplay){
      this.isDisplay=!this.isDisplay;
    } else {
      this.isDisplay=this.isDisplay;
    }

    this.renderer.setAttribute(this.dailyfilter.nativeElement, 'color', 'primary-alt');
    this.renderer.setAttribute(this.monthlyfilter.nativeElement, 'color', '')
    if(!sessionStorage.getItem("selectedDate")){
      this.httpDataGridParams.dueDate = this.presentDateFormat;
      this.patchDatePicker(this.presentDate);
    }
    this.getExceptionTableData();
    sessionStorage.setItem("dailyMonthlyStatus", `${this.dailyMonthlyStatus}`);
  }

  monthlyData(status: boolean) {
    // Monthly data fetch as per click
    this.dailyMonthlyStatus = status;
    this.httpDataGridParams.dataFrequency = DATA_FREQUENCY.MONTHLY;

    if (this.isDisplay){
      this.isDisplay=this.isDisplay;
    } else {
      this.isDisplay=!this.isDisplay;
    }

    this.renderer.setAttribute(this.monthlyfilter.nativeElement, 'color', 'primary-alt');
    this.renderer.setAttribute(this.dailyfilter.nativeElement, 'color', '');

    if(!sessionStorage.getItem("selectedDate")){
      this.patchDatePicker(this.lastMonthDate);
      this.httpDataGridParams.dueDate = this.lastMonthDueDateFormat;
    }

    this.getExceptionTableData();
    sessionStorage.setItem("dailyMonthlyStatus", `${this.dailyMonthlyStatus}`);
  }
  onRowClicked(event: RowClickedEvent) {
    const exceptionReportDetail = event.data.exceptionReportDetails;
    // FDF is not sending empty array. It is sending three type of values. 
    if(exceptionReportDetail == null || exceptionReportDetail == "\"[]\"" || exceptionReportDetail == '[]') {
      return false;
    } else if (event && event.data && exceptionReportDetail) {
      this.dataManagedService.setExceptionDetails = event.data.exceptionReportDetails;
      this.dataManagedService.setExceptionFileName = event.data.name;
      this._router.navigate([ROUTE_URL_CONST.FILE_EXCEPTION_DETAILS]);
    } else {
      console.log("Data (exceptionReportDetails) is not getting");
      // This console is use for QA live env (RouterLink is working in local system but not in QA Env)
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  };

  updatePaginationSize(newPageSize: number) {
    this.noOfCompletdFilingRecords = newPageSize;
  }

  handlePageChange(val: number): void {
    this.currentPage = val;
  }

  openComments(row) {
    console.log(row);
    this.showComments = true;
  }
  addComment(row) {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '700px',
      data: {
        type: "ConfirmationTextUpload",
        header: "Add comment",
        description: `Please add your comment below.`,
        entityId: row.entityId,
        entityType: "FILING_ENTITY",
        forms: {
          isSelect: false,
          selectDetails: {
            label: "Assign to (Optional)",
            formControl: 'assignTo',
            type: "select",
            data: [
              { name: "Test1", id: 1 },
              { name: "Test2", id: 2 },
              { name: "Test3", id: 3 },
              { name: "Test4", id: 4 }
            ]
          },
          isTextarea: true,
          textareaDetails: {
            label: "Comment (required)",
            formControl: 'comment',
            type: "textarea",
            validation: true,
            validationMessage: "Comment is required"
          }
        },
        footer: {
          style: "start",
          YesButton: "Submit",
          NoButton: "Cancel"
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.button === "Submit") {
        const obj = {
          assignTo: result.data.assignTo,
          comment: escape(result.data.comment),
          files: result.data.files
        }
        console.log(obj);
      } else {
        console.log(result);
      }
    });
  }
  commentAdded() {
  }
}