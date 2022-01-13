import { Component, OnInit, ElementRef, Renderer2, ViewChild, TemplateRef } from '@angular/core';
import { DataManagedService } from '../../services/data-managed.service';
import { formatDate } from '@angular/common';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { CustomGlobalService, ModalComponent, TableHeaderRendererComponent } from 'eyc-ui-shared-component';
import { GridDataSet } from '../../models/grid-dataset.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ExceptionDataGrid } from '../../models/data-grid.model';
import { DATA_FREQUENCY, DATA_INTAKE_TYPE, FILTER_TYPE } from '../../../config/dms-config-helper';
import { RowClickedEvent } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'lib-exceptions',
  templateUrl: './exceptions.component.html',
  styleUrls: ['./exceptions.component.scss']
})
export class ExceptionsComponent implements OnInit {
  @ViewChild('dailyfilter', { static: false }) dailyfilter: ElementRef;
  @ViewChild('monthlyfilter', { static: false }) monthlyfilter: ElementRef;


  @ViewChild('reportTypeTemplate')
  reportTypeTemplate: TemplateRef<any>;
  @ViewChild('chipTemplate')
  chipTemplate: TemplateRef<any>;
  @ViewChild('commentTemplate')
  commentTemplate: TemplateRef<any>;
  
  @ViewChild('nextButtonTemplate')
  nextButtonTemplate: TemplateRef<any>;
  
  curDate: string;
  presentDate: Date;
  form: FormGroup;
  calSelectedDate: string;
  disabledDailyMonthlyButton: boolean = false;
  dailyMonthlyStatus: boolean = false;
  
  
  ExceptionFileName: string;
  ExceptionAuditGuidName:string;
  noExceptionDataAvilable: boolean;
  searchNoDataAvilable: boolean;

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
 
  constructor(private dataManagedService: DataManagedService,
    private renderer: Renderer2, private customglobalService: CustomGlobalService,
    public dialog: MatDialog,
    private _Activatedroute: ActivatedRoute,private _router: Router) {
  }

  ngOnInit(): void {
    this.curDate = formatDate(new Date(), 'MMM. dd, yyyy', 'en');
    this.presentDate = new Date();
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
    debugger;
    this._Activatedroute.paramMap.subscribe(params => {
      this.ExceptionFileName = params.get('paramFilename');
      this.ExceptionAuditGuidName = params.get('paramguidName');
      debugger;
    });
    this.getExceptionTableData();
  }

  ngAfterViewInit(): void {
    debugger;
    this.httpDataGridParams = {
      startDate: '',
      endDate: '',
      dataFrequency: DATA_FREQUENCY.DAILY,
      dueDate: `${formatDate(new Date(), 'yyyy-MM-dd', 'en')}`,
      periodType: '',
      clientName: '',
      auditFileGuidName:this.ExceptionAuditGuidName,
      fileId:'',
      fileName:this.ExceptionFileName
    };
    this.getExceptionTableData();
  }

  // Table methods
  searchCompleted(input) {
    this.gridApi.setQuickFilter(input.el.nativeElement.value);
    this.searchNoDataAvilable = (this.gridApi.rowModel.rowsToDisplay.length === 0)
  }

  getExceptionTableData() {
    this.dataManagedService.getExceptionTableData(this.httpDataGridParams).subscribe(resp => {
      resp['data'].length === 0 ? this.noExceptionDataAvilable = true : this.noExceptionDataAvilable = false;
      this.glRowdata = resp['data'];
      debugger;
      this.columnGl = [
        {
          headerComponentFramework: TableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          headerName: 'Exception Report Type',
          field: 'type',
          sortable: true,
          filter: true,
          minWidth: 150,
          wrapText: false,
          autoHeight: true,
          cellRendererParams: {
            ngTemplate: this.reportTypeTemplate
          }
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Exception Report Name',
          field: 'name',
          sortable: true,
          filter: true,
          minWidth: 100,
          wrapText: true,
          autoHeight: true
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
        {
          headerComponentFramework: TableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.commentTemplate,
          },
          headerName: 'Comments',
          field: 'comments',
          sortable: true,
          filter: true,
          width: 155
        },
        {
          headerName: 'Exceptions',
          field: 'exceptionCount',
          sortable: true,
          filter: true,
          minWidth: 200,
          wrapText: false,
          autoHeight: true,
          valueGetter: function (params) {
            if (params.data.exceptions) {
              return params.data.exceptions
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
    this.calSelectedDate = event.singleDate.formatted;
    if (this.calSelectedDate) {
      this.httpDataGridParams.dueDate = this.calSelectedDate;
      this.getExceptionTableData();
    }
  }

  dailyData(status: boolean) {
    // Daily data fetch as per click

    this.dailyMonthlyStatus = status;
    this.httpDataGridParams.dataFrequency = DATA_FREQUENCY.DAILY;

    this.renderer.setAttribute(this.dailyfilter.nativeElement, 'color', 'primary-alt');
    this.renderer.setAttribute(this.monthlyfilter.nativeElement, 'color', 'secondary')
    // if (this.innerTabIn == 1) {
    //   this.httpDataGridParams.dataIntakeType = DATA_INTAKE_TYPE.DATA_PROVIDER;
    // } else {
    //   this.httpDataGridParams.dataIntakeType = DATA_INTAKE_TYPE.DATA_DOMAIN;
    // }
    this.getExceptionTableData();
  }

  monthlyData(status: boolean) {
    // Monthly data fetch as per click
    
    this.dailyMonthlyStatus = status;
    this.httpDataGridParams.dataFrequency = DATA_FREQUENCY.MONTHLY;

    this.renderer.setAttribute(this.monthlyfilter.nativeElement, 'color', 'primary-alt');
    this.renderer.setAttribute(this.dailyfilter.nativeElement, 'color', 'secondary');

    // if (this.innerTabIn == 1) {
    //   this.httpDataGridParams.dataIntakeType = DATA_INTAKE_TYPE.DATA_PROVIDER;
    // } else {
    //   this.httpDataGridParams.dataIntakeType = DATA_INTAKE_TYPE.DATA_DOMAIN;
    // }
    this.getExceptionTableData();
  }
  
  onRowClicked (event: RowClickedEvent){
    
    this._router.navigate(['/data-managed-services/files/exception-details',event.data.exceptionReportDetails]);
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
            data:[
              { name: "Test1", id: 1 },
              { name: "Test2", id: 2 },
              { name: "Test3", id: 3 },
              { name: "Test4", id: 4 }
            ]
          },
          isTextarea: true,
          textareaDetails:{
            label:"Comment (required)",
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
      // console.log('The dialog was closed', result);
      if(result.button === "Submit") {
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