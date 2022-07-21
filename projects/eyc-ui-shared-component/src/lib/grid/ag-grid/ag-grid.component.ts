import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../../modal/component/modal.component';
import {
  AgGridEvent,
  CheckboxSelectionCallbackParams,
  ColDef,
  GetContextMenuItemsParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ICellRendererParams,
  PaginationNumberFormatterParams,
  SideBarDef,
  StatusPanelDef,
} from 'ag-grid-community';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';
import { StatusBarComponent } from '../status-bar/status-bar.component'


@Component({
  selector: 'lib-ag-grid',
  templateUrl: './ag-grid.component.html',
  styleUrls: ['./ag-grid.component.scss']
})
export class AgGridComponent implements OnInit {

  public icons: {
    [key: string]: Function | string;
  } = {
      sortAscending: '<i class="fa fa-caret-up" style="font-size: 14px; margin-top: 4px;"></i>',
      sortDescending: '<i class="fa fa-caret-down" style="font-size: 14px; margin-top: 4px;"></i>',
      sortUnSort: `<i class="fa fa-sort" aria-hidden="true" style="font-size: 14px; margin-top: 4px;"></i>`
    };

  @Input() customRowSelected = false;
  @Input() columnDefs: ColDef[] = [];
  @Input() omitModal = false;
  @Input() rowData: any[] = [];
  @Input() displayCheckBox: any;
  @Input() paginationPageSize = 20;
  @Input() pagination = true;
  @Input() gridStyle = 'first';
  @Input() permissionToPrimaryButton = true;
  @Input() permissionToSecondaryButton = true;
  @Input() filterDisable = true;
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
  @Output() unresolveEventToParent = new EventEmitter<string>();
  @Output() newEventToParent = new EventEmitter<string>();
  @Input() submitFunction: () => void;
  @Input() submitTwoFunction: () => void;
  @Input() pageChangeFunc: () => void;
  @Input() modalMessage;
  @Input() masterDetail = false;
  @Input() detailCellRendererParams: any;
  isAllRecordSelected = false;
  overlayNoRowsTemplate =`<div class="no-data-img"><svg width="59" height="58" viewBox="0 0 59 58" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M45.5013 31.8332V51.6665H5.83464V11.9998H20.058C20.1996 9.98817 20.6813 8.08984 21.418 6.33317H5.83464C2.71797 6.33317 0.167969 8.88317 0.167969 11.9998V51.6665C0.167969 54.7832 2.71797 57.3332 5.83464 57.3332H45.5013C48.618 57.3332 51.168 54.7832 51.168 51.6665V37.4998L45.5013 31.8332ZM41.2513 45.9998H10.0846L17.8763 35.9982L23.4296 42.6848L31.2213 32.6548L41.2513 45.9998ZM49.1846 20.1882C50.4313 18.2048 51.168 15.9098 51.168 13.4165C51.168 6.3615 45.473 0.666504 38.418 0.666504C31.363 0.666504 25.668 6.3615 25.668 13.4165C25.668 20.4715 31.363 26.1665 38.3896 26.1665C40.883 26.1665 43.2063 25.4298 45.1613 24.1832L54.0013 33.0232L58.0246 28.9998L49.1846 20.1882ZM38.418 20.4998C34.508 20.4998 31.3346 17.3265 31.3346 13.4165C31.3346 9.5065 34.508 6.33317 38.418 6.33317C42.328 6.33317 45.5013 9.5065 45.5013 13.4165C45.5013 17.3265 42.328 20.4998 38.418 20.4998Z" fill="#6F6F7A"/></svg><span>No data displayed</span></div>`;
  @Input()pageList=[20,50,100];
  @Input()pageSize=20;
  currentlySelectedPageSize;
  @Input() staticDataGrid = false;
  showToastAfterSubmit = false;
  buttonModal = false;
  @Input() isHideCheckBox = true;
  @Input() exportName ;

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
  statusBar: {
    statusPanels: StatusPanelDef[];
  } = {
    statusPanels: [
      { statusPanel: StatusBarComponent , align: 'right', key: 'statusBarCompKey', }
    ],
  };
  totalPage: number;
  currentpage: number;
  context: any;
  columnsForExport: any[];
  
  constructor(private http: HttpClient, public dialog: MatDialog) {
    this.gridOptions = <GridOptions>{};
    this.gridOptions = {
      unSortIcon: true,
      context: this.exportName
  }
}

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.setSideBarVisible(false);
    this.gridApi.setDomLayout('autoHeight');
    (document.querySelector<HTMLElement>('#agGrid')! as any).style.height = '';
    this.totalPage = this.gridApi.paginationGetTotalPages();
    this.currentpage = this.gridApi.paginationGetCurrentPage();
    this.context=({componentParent: this,totalPage : this.gridApi.paginationGetTotalPages(),
      currentpage : this.gridApi.paginationGetCurrentPage(),
      pageList : this.pageList,
      pageSize : this.pageSize

    })
  }

  ngOnInit(): void {
   console.log(this.pageList,"this.pageList this.pageList this.pageList") 
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
    
    let statusBarComponent = this.gridApi?.getStatusPanel(
      'statusBarCompKey'
    ) as any;
    if(this.rowData == undefined || this.rowData?.length ==0 || this.rowData == null){
      this.columnDefs = [];
      this.filterDisable = false;
      statusBarComponent?.setVisible(false);
    } else {
      this.filterDisable = true;
      statusBarComponent?.setVisible(true);
    }
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
    let currentdate = new Date();
    var datetime = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1) + "-" + currentdate.getDate() + " "
      + currentdate.getHours() + "-"
      + currentdate.getMinutes() + "-"
      + currentdate.getSeconds();
    let name = this.exportName + datetime;
    var allColumns = this.gridOptions.columnApi.getAllColumns();
    this.columnsForExport = [];
    allColumns.forEach((element: any) => {
      if (element.colId != "Actions" && element.colDef.headerName!="Result" && element?.userProvidedColDef?.cellClass != "approved_icon") {
        this.columnsForExport.push(element.colId)
      }
    });
    console.log(this.columnsForExport, "columnsForExport columnsForExport")
    var csvcelParams = {
      fileName: name,
      columnKeys: this.columnsForExport,
      processCellCallback: (params) => this.processCells(params)
    }
    this.gridApi.exportDataAsCsv(csvcelParams);
  }

  processCells(params: any) {
    return params.value;
  }

  getContextMenuItems(params: GetContextMenuItemsParams) {
    let currentdate = new Date();
    var datetime = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1) + "-" + currentdate.getDate() + " "
      + currentdate.getHours() + "-"
      + currentdate.getMinutes() + "-"
      + currentdate.getSeconds();
     console.log(params,datetime,"this.exportName")
    var name = params.context.componentParent.exportName +datetime;
    var allColumns = params.columnApi.getAllColumns();
    var columnsForExport = [];
    allColumns.forEach((element: any) => {
      if (element.colId != "Actions" && element.colDef.headerName!="Result" && element?.userProvidedColDef?.cellClass != "approved_icon") {
        columnsForExport.push(element.colId)
      }
    });    return [  
      {
          name: 'CSV Export',
          action: function(data) {
            var csvcelParams = {
              fileName: name,
              columnKeys: columnsForExport
            }
            params.api.exportDataAsCsv(csvcelParams);
          },
        },
        {
          name: 'Excel Export',
          action: function(data) {
            var excelcelParams = {
              fileName: name,
              columnKeys: columnsForExport
            }
            params.api.exportDataAsExcel(excelcelParams);
          },
        },
      ];
    }

  onQuickFilterChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('quickFilter') as HTMLInputElement).value
    );
    if(this.gridApi.getDisplayedRowCount() == 0) {
      this.gridApi.showNoRowsOverlay();
    }
  }

  onModelUpdated($event) {
    if (this.gridApi) {
    if (this.gridApi?.getDisplayedRowCount() && this.gridApi?.getDisplayedRowCount() == 0) {
      this.gridApi.showNoRowsOverlay();
    }
    if (this.gridApi?.getDisplayedRowCount() && this.gridApi?.getDisplayedRowCount() > 0) {
      this.gridApi.hideOverlay();
    }
    this.totalPage = this.gridApi.paginationGetTotalPages();
    this.currentpage = this.gridApi.paginationGetCurrentPage();
    this.context=({componentParent: this,totalPage : this.gridApi.paginationGetTotalPages(),
      currentpage : this.gridApi.paginationGetCurrentPage(),
      pageList : this.pageList,
      pageSize : this.pageSize

    })
    const statusBarComponent = this.gridApi.getStatusPanel(
      'statusBarCompKey'
    ) as any;
    statusBarComponent.totalPage = this.gridApi.paginationGetTotalPages();
    statusBarComponent.currentpage = this.gridApi.paginationGetCurrentPage();
    statusBarComponent.pageList = this.pageList,
    statusBarComponent.pageSize = this.pageSize;
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
    type == "resolve" ? this.newEventToParent.emit() : this.unresolveEventToParent.emit();
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