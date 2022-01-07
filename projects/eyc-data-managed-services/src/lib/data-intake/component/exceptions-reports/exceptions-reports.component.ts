import { Component, ChangeDetectionStrategy, TemplateRef, ViewChild, ElementRef, OnInit } from '@angular/core';
import { MotifTableCellRendererComponent, MotifTableHeaderRendererComponent } from '@ey-xd/ng-motif';
import { ColDef } from 'ag-grid-community';
import { DataManagedService } from '../../services/data-managed.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from 'eyc-ui-shared-component';

@Component({
  selector: 'lib-exceptions-reports',
  templateUrl: './exceptions-reports.component.html',
  styleUrls: ['./exceptions-reports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExceptionsReportsComponent implements OnInit {

  MotifTableHeaderRendererComponent = MotifTableHeaderRendererComponent;
  MotifTableCellRendererComponent = MotifTableCellRendererComponent;

  exceptionTableData = [];
  gridApi;
  columnDefs: Array<ColDef>;


  entityId;
  showComments = false;
  commentEntityType;
  commentsName;
  row={
    "commentsCount":20
  }

  @ViewChild('motifTable') table: ElementRef;
  @ViewChild('headerTemplate')
  headerTemplate: TemplateRef<any>;
  @ViewChild('dropdownTemplate')
  dropdownTemplate: TemplateRef<any>;

  @ViewChild('commentTemplate')
  commentTemplate: TemplateRef<any>;

  constructor(private dataManagedService: DataManagedService,public dialog: MatDialog,) {
  }

  ngOnInit(): void {
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
  isFirstColumn = (params) => {
    const displayedColumns = params.columnApi.getAllDisplayedColumns();
    const thisIsFirstColumn = displayedColumns[0] === params.column;
    return thisIsFirstColumn;
  };

  handleGridReady = (params) => {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  };

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.columnDefs = [
        {
          headerComponentFramework: MotifTableHeaderRendererComponent,
          headerName: 'Type',
          field: 'type',
          sortable: true
        },
        {
          headerComponentFramework: MotifTableHeaderRendererComponent,
          headerName: 'Exposure',
          field: 'exposure',
          sortable: true,
        },
        {
          headerComponentFramework: MotifTableHeaderRendererComponent,
          headerName: 'Classification',
          field: 'classification',
          sortable: true,
        },
        {
          headerComponentFramework: MotifTableHeaderRendererComponent,
          headerName: 'Category',
          field: 'category',
          sortable: true,
        },
        {
          headerComponentFramework: MotifTableHeaderRendererComponent,
          headerName: 'Value',
          field: 'value',
          sortable: true,
        },
        {
          headerComponentFramework: MotifTableHeaderRendererComponent,
          headerName: 'Variance',
          field: 'variance',
          sortable: true,
        },
        {
          headerComponentFramework: MotifTableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.commentTemplate,
          },
          headerName: 'Comments',
          field: 'comments',
          sortable: true,
          filter: true,
          width: 155
        }
      ];
      this.getExceptionReportstable();
    });

  }

  getExceptionReportstable() {
    // Mock API integration for exception reports table
    this.dataManagedService.getExceptionReportstable().subscribe(data => {
      this.exceptionTableData = data.data['rowData'];
    });
  }
}
