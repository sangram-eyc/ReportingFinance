import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { ModalComponent } from 'eyc-ui-shared-component';
import { RegulatoryReportingFilingService } from '../../regulatory-reporting-filing/services/regulatory-reporting-filing.service';
import { TableHeaderRendererComponent } from '../../shared/table-header-renderer/table-header-renderer.component';
import {DataIntakeService} from '../services/data-intake.service';

@Component({
  selector: 'lib-data-intake',
  templateUrl: './data-intake.component.html',
  styleUrls: ['./data-intake.component.scss']
})
export class DataIntakeComponent implements OnInit {
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
  constructor(
    private service: DataIntakeService,
    private filingService: RegulatoryReportingFilingService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
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
  
  receiveFilingDetails(event) {
    this.filingDetails = event;
    if (this.tabs == 2) {
      this.getFiles();
    }
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
    this.service.getfilingEntities(this.filingDetails.filingName, this.filingDetails.period).subscribe(res => {
      this.rowData = res['data'];
      this.createEntitiesRowData();
    },error=>{
      this.rowData =[];
      console.log("Client Review error");
    });
  }

  receiveMessage($event) {
    this.tabs = $event;
    if(this.tabs == 2){
      this.getFiles();
    } else if (this.tabs == 1) {
     
      this.getExceptionReports();
    }
  }

  createEntitiesRowData(): void {
    const customComparator = (valueA, valueB) => {
      return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
    };
      this.columnDefs = [
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
      ];

      this.exceptionDefs = [
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


}
