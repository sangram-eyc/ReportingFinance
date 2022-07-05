import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import {
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
  @Input() columnDefs: ColDef[] = [];
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
  mytasks = false;
  @Input() hideLabels:boolean = false;
  private gridApi!: GridApi;
  @Input() paginationSize = 100;
  overlayNoRowsTemplate =`<span style="font-size: 16px;
  line-height: 20px;
  font-family: EYInterstate!important;;">No data found with current filters</span>`;
  pageList=[20,50,100];
  pageSize=20;
  currentlySelectedPageSize;



  public defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
  };
  public rowSelection = 'multiple';
  isHideCheckBox: any;
  public sideBar: SideBarDef | string | string[] | boolean | null = 'filters';
  public gridOptions:GridOptions;
  selectedRows = [];
  gridHeadingCls;
  gridContainerCls;
  srnoCls;
  gridColumnApi: any;
  dataset;

  
  constructor(private http: HttpClient) {
    this.gridOptions = <GridOptions>{};
    this.gridOptions = {
      sideBar: this.sideBar,
  }
}

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;


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

  }

  approveButtonAction(){

  }

  unapproveButtonAction() {

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
  };
}