import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { ClientReviewService } from '../services/client-review.service';
import { TableHeaderRendererComponent } from '../../shared/table-header-renderer/table-header-renderer.component';
import { RegulatoryReportingFilingService } from '../../regulatory-reporting-filing/services/regulatory-reporting-filing.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from 'eyc-ui-shared-component';

@Component({
  selector: 'lib-client-review',
  templateUrl: './client-review.component.html',
  styleUrls: ['./client-review.component.scss']
})
export class ClientReviewComponent implements OnInit {

  filingDetails:any;
  constructor(
    private service: ClientReviewService,
    private filingService: RegulatoryReportingFilingService,
    public dialog: MatDialog
    ) { }

  tabs = 2;
  selectedRows = [];
  approveFilingEntitiesModal = false;
  showToastAfterApproveFilingEntities = false;

  status = {
    stage: 'Client Review',
    progress: 'in-progress'
  };

  MotifTableHeaderRendererComponent = TableHeaderRendererComponent;
  MotifTableCellRendererComponent = MotifTableCellRendererComponent;
  gridApi;
  columnDefs;
  rowData = [];

  @ViewChild('headerTemplate')
  headerTemplate: TemplateRef<any>;
  @ViewChild('dropdownTemplate')
  dropdownTemplate: TemplateRef<any>;
  @ViewChild('commentTemplate')
  commentTemplate: TemplateRef<any>;

  ngOnInit(): void {
    
  }

  getFilingEntities(){
    this.service.getfilingEntities(this.filingDetails.filingName, this.filingDetails.period).subscribe(res => {
      this.rowData = res['data'];
      this.createEntitiesRowData();
    },error=>{
      this.rowData =[];
      console.log("Client Review error");
    });
  }

  isFirstColumn = (params) => {
    const displayedColumns = params.columnApi.getAllDisplayedColumns();
    if (params.data) {
      const thisIsFirstColumn = (displayedColumns[0] === params.column) && (params.data.approved === false);
      return thisIsFirstColumn;
    } else {
      const thisIsFirstColumn = (displayedColumns[0] === params.column)  && !(this.rowData.every(item => item.approved === true));
      return thisIsFirstColumn;
    }
  }

  createEntitiesRowData(): void {
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
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Entity Name',
          field: 'entityName',
          sortable: true,
          filter: true,
          wrapText: true,
          autoHeight: true,
          width: 300
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
        //   cellClass: params => {
        //     return params.value === '' ? '' :'comments-background';
        // }
          
        },
      ];
  }

  handleGridReady(params) {
    this.gridApi = params.api;
  }

  onRowSelected(event: any): void {
    let selectedArr = [];
    selectedArr = this.gridApi.getSelectedRows();
    this.selectedRows =selectedArr.filter(item => item.approved === false);
    if(this.selectedRows.length === 0){
      this.gridApi.deselectAll();
    }
    if(this.selectedRows.length === (this.rowData.filter(item => item.approved === false)).length){
      this.gridApi.selectAll();
    }
  }

  receiveMessage($event) {
    this.tabs = $event;
    if(this.tabs == 2){
      this.getFilingEntities();
    }
  }

  receiveFilingDetails(event) {
    this.filingDetails = event;
    // this.getFilingEntities();
    if (this.tabs == 2) {
      this.getFilingEntities();
    }
  }

  onSubmitApproveFilingEntities() {
    let selectedFiling = {
      "entityIds": this.selectedRows.map(({ entityId }) => entityId),
      "filingName": this.filingDetails.filingName,
      "period": this.filingDetails.period,
      "stage": "Client review"
    };
    this.service.approvefilingEntities(selectedFiling).subscribe(res => {
      res['data'].forEach(ele => {
        this.rowData[this.rowData.findIndex(item => item.entityId === ele.entityId)].approved = true;
      });
      this.createEntitiesRowData();
      this.selectedRows = [];
      this.filingService.invokeFilingDetails();
      this.approveFilingEntitiesModal = false;
      this.showToastAfterApproveFilingEntities = !this.showToastAfterApproveFilingEntities;
      setTimeout(() => {
        this.showToastAfterApproveFilingEntities = !this.showToastAfterApproveFilingEntities;
      }, 5000);
    });

    // this.selectedRows.forEach(ele => {
    //   this.rowData[this.rowData.findIndex(item => item.entityId === ele.entityId)].approved = true;
    // });
    // this.createEntitiesRowData();
    // this.selectedRows = [];
    // this.filingService.invokeFilingDetails();
    // this.approveFilingEntitiesModal = false;
    // this.showToastAfterApproveFilingEntities = !this.showToastAfterApproveFilingEntities;
    // setTimeout(() => {
    //   this.showToastAfterApproveFilingEntities = !this.showToastAfterApproveFilingEntities;
    // }, 5000);
  }

  addComment() {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '700px',
      data: {
        type: "ConfirmationTextUpload",
        header: "Add comment",
        description: `Please add your comment below. You also have the option to assign to a user.`,
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
}
