import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { ModalComponent } from 'eyc-ui-shared-component';
import { RegulatoryReportingFilingService } from '../../regulatory-reporting-filing/services/regulatory-reporting-filing.service';
import { TableHeaderRendererComponent } from '../../shared/table-header-renderer/table-header-renderer.component';
import {DataIntakeService} from '../services/data-intake.service';
import { PermissionService } from 'eyc-ui-shared-component';


@Component({
  selector: 'lib-data-intake',
  templateUrl: './data-intake.component.html',
  styleUrls: ['./data-intake.component.scss']
})
export class DataIntakeComponent implements OnInit, OnDestroy {
  status = {
    stage: 'Reporting',
    progress: 'in-progress'
  };
  MotifTableHeaderRendererComponent = TableHeaderRendererComponent;
  MotifTableCellRendererComponent = MotifTableCellRendererComponent;
  gridApi;
  columnDefs;
  exceptionDefs;
  tabs = 1;
  filingDetails:any;
  exceptionData;
  rowData = [];
  exceptionDetailCellRendererParams;
  filesListArr;
  enableTabs = false;

  filesDatasets = {};
  datasets = [];
  datasetsDefs;
  submitDatasets;
  datasetsSelectedRows;
  datasetsModalConfig = {
    width: '550px',
    data: {
      type: "Confirmation",
      header: "Approve Selected",
      description: "Are you sure you want to approve the selected datasets? This will advance them to the next reviewer.",
      footer: {
        style: "start",
        YesButton: "Continue",
        NoButton: "Cancel"
      }
    }
  };

  constructor(
    private service: DataIntakeService,
    private filingService: RegulatoryReportingFilingService,
    public dialog: MatDialog,
    public permissions: PermissionService
  ) { }

  ngOnInit(): void {
    this.submitDatasets = this.onSubmitApproveDatasets.bind(this);
    this.getFiles();
  }
  
  @ViewChild('headerTemplate')
  headerTemplate: TemplateRef<any>;
  @ViewChild('dropdownTemplate')
  dropdownTemplate: TemplateRef<any>;
  @ViewChild('commentTemplate')
  commentTemplate: TemplateRef<any>;
  @ViewChild('commentExceptionTemplate')
  commentExceptionTemplate: TemplateRef<any>;
  @ViewChild('resolveExceptionTemplate')
  resolveExceptionTemplate: TemplateRef<any>;
  @ViewChild('datasetsDropdownTemplate')
  datasetsDropdownTemplate: TemplateRef<any>;
  @ViewChild('commentDatasetsTemplate')
  commentDatasetsTemplate: TemplateRef<any>;
  @ViewChild('resolveDatasetsTemplate')
  resolveDatasetsTemplate: TemplateRef<any>;
  receiveFilingDetails(event) {
    this.filingDetails = event;
    /* if (this.tabs == 2) {
      this.getDatasets();
    } */
  }
  getExceptionReports() {
    this.service.getExceptionReports(this.filingDetails.filingName, this.filingDetails.period).subscribe(res => {
      this.exceptionData = res['data'];
      console.log(this.exceptionData);
      this.createEntitiesRowData();
      
    },error=>{
      this.exceptionData =[];
      console.log("Client Review error");
    });

  }

  getFiles(){
    this.service.getfilesList().subscribe(res => {
      this.filesListArr = res['data'];
    },error=>{
      console.log("files list error");
    });

  }

  getDatasets() {
    this.service.getDatasetsrecords().subscribe(res => {
      this.datasets = res['data'];
      console.log(this.datasets);
      this.createEntitiesRowData();
      
    },error=>{
      this.datasets =[];
      console.log("Datasets error");
    });
  }

  getFileDataSet(event) {
    let index = event.index;
    console.log('INDEX', index);
    this.service.getDatasetsrecords().subscribe(res => {
      this.filesDatasets[index] = res['data'];
    },error=>{
      this.filesDatasets[index] = [];
      console.log("Dataset error");
    });
  }

  receiveMessage($event) {
    this.tabs = $event;
    if(this.tabs == 2){
      this.getDatasets();
    } else if (this.tabs == 1) {
      this.getExceptionReports();
    } 
    /* else if (this.tabs == 3) {
      this.getDatasets();
    } */
  }

  getIntakeDetails($event) {
    this.enableTabs = $event;
    this.receiveMessage(this.tabs);
  }

  createEntitiesRowData(): void {
    const customComparator = (valueA, valueB) => {
      return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
    };
      /* this.columnDefs = [
        {
          headerComponentFramework: TableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.dropdownTemplate,
          },
          field: 'template',
          headerName: '',
          width: 70,
          sortable: false,
          pinned: 'left'
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Entity Group',
          field: 'entityGroup',
          sortable: true,
          filter: true,
          sort:'asc',
          comparator: customComparator
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Entity Name',
          field: 'entityName',
          sortable: true,
          filter: true,
          wrapText: true,
          autoHeight: true,
          width: 300,
          sort:'asc',
          comparator: customComparator
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Resolved/Exception',
          field: 'resolve_exception',
          sortable: true,
          filter: true,
          width: 210,
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Review Level',
          field: 'reviewLevel',
          sortable: true,
          filter: true,
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'My Tasks',
          field: 'myTasks',
          sortable: true,
          filter: true,
          width: 140
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
          width: 155,
        },
      ]; */

      this.exceptionDefs = [
        {
          headerComponentFramework: TableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.dropdownTemplate,
          },
          field: 'template',
          headerName: '',
          width: 70,
          sortable: false,
          pinned: 'left'
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Due',
          field: 'exceptionDue',
          sortable: true,
          filter: true,
          sort:'asc',
          comparator: customComparator,
          autoHeight: true,
         wrapText: true,
         width: 130
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'File',
          field: 'exceptionFile',
          sortable: true,
          filter: true,
          sort:'asc',
          comparator: customComparator,
          autoHeight: true,
         wrapText: true,
         width: 150
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Exception Report Type',
          field: 'exceptionReportType',
          sortable: true,
          filter: true,
          sort:'asc',
          comparator: customComparator,
          autoHeight: true,
         wrapText: true,
         width: 250
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Exception Report Name',
          field: 'exceptionReportName',
          sortable: true,
          filter: true,
          wrapText: true,
          autoHeight: true,
          width: 250,
          sort:'asc',
          comparator: customComparator
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.commentExceptionTemplate,
          },
          headerName: 'Comments',
          field: 'comments',
          sortable: true,
          filter: true,
          width: 150
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.resolveExceptionTemplate,
          },
          headerName: 'Resolved',
          field: 'resolve_exception',
          sortable: true,
          filter: true,
          width: 200,
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Exceptions',
          field: 'exceptions',
          sortable: true,
          filter: true,
          width: 200,
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Review Level',
          field: 'reviewLevel',
          sortable: true,
          filter: true,
        },
        
      ];

    this.datasetsDefs = [
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.datasetsDropdownTemplate,
        },
        field: 'template',
        headerName: '',
        width: 70,
        sortable: false,
        pinned: 'left'
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Due',
        field: 'exceptionDue',
        sortable: true,
        filter: true,
        sort: 'asc',
        comparator: customComparator,
        autoHeight: true,
        wrapText: true,
        width: 130
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'File',
        field: 'exceptionFile',
        sortable: true,
        filter: true,
        sort: 'asc',
        comparator: customComparator,
        autoHeight: true,
        wrapText: true,
        width: 150
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Source',
        field: 'source',
        sortable: true,
        filter: true,
        sort: 'asc',
        comparator: customComparator,
        autoHeight: true,
        wrapText: true,
        width: 150
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Client',
        field: 'client',
        sortable: true,
        filter: true,
        wrapText: true,
        autoHeight: true,
        width: 150,
        sort: 'asc',
        comparator: customComparator
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.commentExceptionTemplate,
        },
        headerName: 'Comments',
        field: 'comments',
        sortable: true,
        filter: true,
        width: 150
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.resolveExceptionTemplate,
        },
        headerName: 'Resolved',
        field: 'resolve_exception',
        sortable: true,
        filter: true,
        width: 150,
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Exceptions',
        field: 'exceptions',
        sortable: true,
        filter: true,
        width: 150,
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Review Level',
        field: 'reviewLevel',
        sortable: true,
        filter: true,
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Version',
        field: 'version',
        sortable: true,
        filter: true,
      }
    ];
  }

  handleGridReady(params) {
    this.gridApi = params.api;
  }

  addCommentToException() {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '700px',
      data: {
        type: "ConfirmationTextUpload",
        header: "Add comment",
        description: `Please add your comment below.`,
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

  addComment()
  {
    
  }

  onSubmitApproveDatasets(){
    this.datasetsSelectedRows.forEach(ele => {
      this.datasets[this.datasets.findIndex(item => item.exceptionId === ele.exceptionId)].approved = true;
    });
    this.createEntitiesRowData();
  }

  datasetsReportRowsSelected(event) {
    console.log(event);
    this.datasetsSelectedRows = event;
  }

  ngOnDestroy() {
    this.enableTabs = false;
  }

}