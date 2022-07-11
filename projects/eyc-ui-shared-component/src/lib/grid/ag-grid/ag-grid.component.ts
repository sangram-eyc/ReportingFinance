import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../../modal/component/modal.component';
import {
  AgGridEvent,
  CheckboxSelectionCallbackParams,
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ICellRendererParams,
  PaginationNumberFormatterParams,
  SideBarDef,
} from 'ag-grid-community';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';

@Component({
  selector: 'lib-ag-grid',
  templateUrl: './ag-grid.component.html',
  styleUrls: ['./ag-grid.component.scss']
})
export class AgGridComponent implements OnInit {
  @Input() customRowSelected = false;
  @Input() columnDefs: ColDef[] = [];
  @Input() omitModal = false;
  @Input() rowData!: any[];
  @Input() displayCheckBox: any;
  @Input() paginationPageSize = 20;
  @Input() pagination = true;
  @Input() gridStyle = 'first';
  @Input() permissionToPrimaryButton = true;
  @Input() permissionToSecondaryButton = true;
  @Input() displayPlusIcon = true;
  @Input() buttonText = 'Approve selected';
  @Input() displaySecondButton = false;
  @Input() secondbuttonText = 'Reject selected';
  @Input() permissionToApproveButton = false;
  @Input() disabledApproveButton = false;
  @Input() approveButtonText = 'Approve'
  @Input() permissionToUnapproveButton = false;
  @Input() disabledUnapproveButton = false;
  @Input() unApprovebuttonText = "Unapprove";
  @Input() permissionToResolveExceptionButton = false;
  @Input() permissionToUnresolveExceptionButton = false;
  @Input() disableResolveButton = false;
  @Input() disableUnresolveButton = false;
  @Input() buttonPosition: 'left' | 'right';
  @Input() unresolveButtonText ="Unresolve"
  @Input() resolveButtonText ="Resolve";
  @Input() isToggleLeft = false;
  @Input() toggleLeftTitle = "";
  @Input() toggleLeftDisabled :boolean = false;
  @Input() button = true;
  @Input() search = true;
  @Input() isToggle = false;
  @Input() export = false;
  @Input() permissionToShowDataTable = true;
  @Input() disablePrimaryButton = true;
  @Input() disableAddMemberButton = true;
  mytasks = false;
  @Input() hideLabels:boolean = false;
  private gridApi!: GridApi;
  @Input() paginationSize = 100;
  @Output() rowSelected = new EventEmitter<any>();
  @Output() selectedRowEmitter = new EventEmitter<any[]>();
  @Output() selectedRowEmitterProcess = new EventEmitter<string>();
  @Output() newEventToParent = new EventEmitter<string>();
  @Input() submitFunction: () => void;
  @Input() submitTwoFunction: () => void;
  @Input() pageChangeFunc: () => void;
  @Input() modalMessage;
  @Input() masterDetail = false;
  @Input() detailCellRendererParams: any;
  isAllRecordSelected = false;
  overlayNoRowsTemplate =`<span style="font-size: 16px;
  line-height: 20px;
  font-family: EYInterstate!important;;">No data found with current filters</span>`;
  pageList=[20,50,100];
  pageSize=20;
  currentlySelectedPageSize;
  @Input() staticDataGrid = false;
  showToastAfterSubmit = false;
  buttonModal = false;
  @Input() isHideCheckBox = true;

  @Input() modalConfig = {
    width: '400px',
    data: {
      type: "Confirmation",
      header: "Approve Selected",
      description: "Are you sure you want to approve the selected entities?",
      footer: {
        style: "start",
        YesButton: "Yes",
        NoButton: "No"
      }
    }
  };
  @Input() modalConfigTwo ={
    width: '500px',
    data: {
      type: "Confirmation",
      header: "Unapprove",
      description: "Are you sure you want to unapprove selected entity? This will move this back to the previous reviewer/step",
      footer: {
        style: "start",
        YesButton: "Continue",
        NoButton: "Cancel"
      }
    }
  };

  public defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
    autoHeight: true,
    // cellStyle: {"white-space": "normal",'line-height': '22px'}
  };
  public rowSelection = 'multiple';
  public sideBar: SideBarDef | string | string[] | boolean | null = 'filters';
  public gridOptions:GridOptions;
  selectedRows = [];
  gridHeadingCls;
  gridContainerCls;
  srnoCls;
  gridColumnApi: any;
  dataset;
  public domLayout: 'normal' | 'autoHeight' | 'print' = 'autoHeight';

  
  constructor(private http: HttpClient, public dialog: MatDialog) {
    this.gridOptions = <GridOptions>{};
    this.gridOptions = {
      // sideBar: this.sideBar,
  }
}

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.setSideBarVisible(false);
    this.gridApi.setDomLayout('autoHeight');
    (document.querySelector<HTMLElement>('#agGrid')! as any).style.height = '';
  }

  ngOnInit(): void {
    if (this.displayCheckBox) {
      this.selectedRows.length = 1;
      this.gridHeadingCls = 'grid-heading-admin';
      this.gridContainerCls = 'gridAdminContainer';
      this.srnoCls = '';
    } else {
      this.gridHeadingCls = 'grid-heading';
      this.gridContainerCls = 'gridContainer';
      this.gridStyle === 'first' ? this.srnoCls = 'srno-class' : this.srnoCls = '';
    }
    this.currentlySelectedPageSize = {
      disable: false,
      value: this.paginationSize,
      name: (this.paginationSize).toString(),
      id: 0
    };

    this.dataset = [{
      disable: false,
      value: this.paginationSize,
      name: (this.paginationSize).toString(),
      id: 0
    },
    {
      disable: false,
      value: this.paginationSize*2,
      name: (this.paginationSize*2).toString(),
      id: 1
    },
    {
      disable: false,
      value: this.paginationSize*3,
      name: (this.paginationSize*3).toString(),
      id: 2
    }];
    
   }

   ngOnChanges(changes: SimpleChanges) {
    console.log('GRID CHANGES', changes);
    this.disablePrimaryButton ? this.selectedRows.length = 0 : this.selectedRows.length = 1;  
  }

   onChange(event): void {
    if (this.customRowSelected) {
      this.rowSelected.emit(event);
      this.selectedRows = this.gridApi.getSelectedRows();
      this.selectedRowEmitter.emit(this.selectedRows);
    } else {
      this.selectedRowEmitterProcess.emit('processing');
      this.selectedRows = [];
      this.selectedRows = this.gridApi.getSelectedRows().filter(item => item.approved === false);
      this.selectedRowEmitter.emit(this.selectedRows);
      this.selectedRowEmitterProcess.emit('finished');
      if (this.selectedRows.length === 0) this.gridApi.deselectAll();
      if (this.selectedRows.length === (this.rowData.filter(item => item.approved === false)).length) {
        this.gridApi.selectAll();
        this.isAllRecordSelected = true;
      } else {
        this.isAllRecordSelected = false;
      }
    }
  }

  isFirstColumn = (params) => {
    const displayedColumns = params.columnApi.getAllDisplayedColumns();
    if(this.isHideCheckBox) {
      if (params.data) {
        const thisIsFirstColumn = (displayedColumns[0] === params.column) && (params.data.approved === false);
        return thisIsFirstColumn;
      } else {
        if(this.rowData){
          const thisIsFirstColumn = (displayedColumns[0] === params.column) && !(this.rowData.every(item => item.approved === true));
          return thisIsFirstColumn;
        } 
      }
    } else {
      const thisIsFirstColumn = displayedColumns[0] === params.column;
      return thisIsFirstColumn;
    }
  }

  exportData() {
    this.gridApi.exportDataAsCsv();
  }

  onQuickFilterChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('quickFilter') as HTMLInputElement).value
    );
  }

  onModelUpdated($event) {
    if (this.gridApi?.getDisplayedRowCount() && this.gridApi?.getDisplayedRowCount() == 0) {
      this.gridApi.showNoRowsOverlay();
    }
    if (this.gridApi?.getDisplayedRowCount() && this.gridApi?.getDisplayedRowCount() > 0) {
      this.gridApi.hideOverlay();
    }
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi?.paginationSetPageSize(Number(value));
  }
  onPageSizeChange() {
    this.gridApi?.paginationSetPageSize(Number(this.pageSize));
  }

  primaryButtonAction(){
    if (this.omitModal) {
      this.submit();
    } else {
      this.openDialog();
    }
  }

  async submit() {
    await this.submitFunction();
    this.selectedRows = [];
    if(!this.isAllRecordSelected) this.gridApi.deselectAll();
    this.buttonModal = false;
  }

  async submitTwo() {
    await this.submitTwoFunction();
    this.selectedRows = [];
    if(!this.isAllRecordSelected) this.gridApi.deselectAll();
    this.buttonModal = false;
  }

  approveButtonAction(){
    this.openDialog();
  }

  unapproveButtonAction() {
    this.openDialogTwo();
  }

  openDialog() {
    if(this.buttonText === "Add User" || this.buttonText === "Add team" || this.buttonText === "Add member" || this.buttonText === "Data Explorer" || this.buttonText === "Add PBI") {
      this.newEventToParent.emit();
      return;
    }
    const dialogRef = this.dialog.open(ModalComponent, this.modalConfig);
    dialogRef.afterClosed().subscribe(result => {
      if(result.button === "Submit" || result.button === "Continue" || result.button === "Yes") {
        this.submit();
      } 
    });
  }
  
  openDialogTwo() {
    if(this.buttonText === "Add User" || this.buttonText === "Add team" || this.buttonText === "Add member" || this.buttonText === "Data Explorer" || this.buttonText === "Add PBI") {
      this.newEventToParent.emit();
      return;
    }
    const dialogRef = this.dialog.open(ModalComponent, this.modalConfigTwo);
    dialogRef.afterClosed().subscribe(result => {
      if(result.button === "Submit" || result.button === "Continue" || result.button === "Yes") {
        this.submitTwo();
      } 
    });
  }

  openResolveUnresolveDialog(type:string){

  }

  toggleLeftChanged(event){

  }

  toggleChanged(event){

  }

  public paginationNumberFormatter: (
    params: PaginationNumberFormatterParams
  ) => string = (params: PaginationNumberFormatterParams) => {
    return '[' + params.value.toLocaleString() + ']';
  }

  onSortChanged(e: AgGridEvent) {
    e.api.refreshCells();
  }

  onFilterChanged(e: AgGridEvent) {
    e.api.refreshCells();
  }

  jumpToPage() {
    let SelectedRowNo= (document.getElementById('jumpTo') as HTMLInputElement).value
    this.gridApi.paginationGoToPage(parseInt(SelectedRowNo)?parseInt(SelectedRowNo)-1: 0);
  }

  openCloseToolPanel(key) {
    if(this.gridApi.getOpenedToolPanel()){
      this.gridApi.closeToolPanel();
      this.gridApi.setSideBarVisible(false);
     }
     else{
      this.gridApi.setSideBarVisible(true);
      this.gridApi.openToolPanel(key);
    }
 }

 setAutoHeight() {
  this.gridApi.setDomLayout('autoHeight');
  // auto height will get the grid to fill the height of the contents,
  // so the grid div should have no height set, the height is dynamic.
  (document.querySelector<HTMLElement>('#agGrid')! as any).style.height = '';
}

}