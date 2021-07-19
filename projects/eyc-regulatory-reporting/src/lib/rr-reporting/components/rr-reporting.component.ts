import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { RegulatoryReportingFilingService } from '../../regulatory-reporting-filing/services/regulatory-reporting-filing.service';
import { TableHeaderRendererComponent } from '../../shared/table-header-renderer/table-header-renderer.component';
import { RrReportingService } from '../services/rr-reporting.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from 'projects/eyc-ui-shared-component/src/lib/modal/component/modal.component';

@Component({
  selector: 'lib-rr-reporting',
  templateUrl: './rr-reporting.component.html',
  styleUrls: ['./rr-reporting.component.scss']
})
export class RrReportingComponent implements OnInit {

  constructor(
    private rrservice: RrReportingService,
    private filingService: RegulatoryReportingFilingService,
    public dialog: MatDialog
  ) { }

  tabs = 1;
  selectedRows = [];
  approveFilingEntitiesModal = false;
  showToastAfterApproveFilingEntities = false;

  status = {
    stage: 'Reporting',
    progress: 'in-progress'
  };

  filingDetails: any;

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

  getFilingEntities() {
    this.rrservice.getfilingEntities(this.filingDetails.filingName, this.filingDetails.period).subscribe(res => {
      this.rowData = res['data'];
      this.createEntitiesRowData();
    }, error => {
      this.rowData = [];
      console.log("Reporting error");
    });
  }

  isFirstColumn = (params) => {
    const displayedColumns = params.columnApi.getAllDisplayedColumns();
    if (params.data) {
      const thisIsFirstColumn = (displayedColumns[0] === params.column) && (params.data.approved === false);
      return thisIsFirstColumn;
    } else {
      const thisIsFirstColumn = (displayedColumns[0] === params.column) && !(this.rowData.every(item => item.approved === true));
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
          field: 'approved',
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
          headerName: 'Comments',
          field: 'comments',
          sortable: true,
          filter: true,
          width: 155
        },
      ];
  }

  handleGridReady(params) {
    this.gridApi = params.api;
  }

  onRowSelected(event: any): void {
    let selectedArr = [];
    selectedArr = this.gridApi.getSelectedRows();
    this.selectedRows = selectedArr.filter(item => item.approved === false);
    if (this.selectedRows.length === 0) {
      this.gridApi.deselectAll();
    }
    if (this.selectedRows.length === (this.rowData.filter(item => item.approved === false)).length) {
      this.gridApi.selectAll();
    }
  }

  receiveMessage($event) {
    this.tabs = $event;
    if (this.tabs == 2) {
      this.getFilingEntities();
    }
  }

  receiveFilingDetails(event) {
    this.filingDetails = event;
    // this.getFilingEntities();
  }

  onSubmitApproveFilingEntities() {
    let selectedFiling = {
      "entityIds": this.selectedRows.map(({ entityId }) => entityId),
      "filingName": this.filingDetails.filingName,
      "period": this.filingDetails.period,
      "stage": "Reporting"
    };
    this.rrservice.approvefilingEntities(selectedFiling).subscribe(res => {
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
        header: "Resolved Selected",
        description: `<p>Are you sure you want to resolve the selected exception? If yes, you will need to add a general comment for this action. Please note, this will move these items to production review.</p><br><p><b style="font-weight: 800;">Note:</b> Resolved exceptions will be noted with this icon <svg style="display: inline;" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M2 6H14V8H2V6ZM2 10H14V12H2V10ZM2 16H10V14H2V16ZM23 13L21.5 11.5L16.01 17L13 14L11.5 15.5L16.01 20L23 13Z" fill="#168736"/></svg>. When clicked you can view resolution comments.</p>`,
        forms: {
          isSelect: false,
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
          YesButton: "Confirm",
          NoButton: "Cancel"
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
}
