import { Component, Input, OnInit,Output, EventEmitter , OnChanges, OnDestroy, TemplateRef, SimpleChanges, SimpleChange} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../../modal/component/modal.component';
import { ValueGetterParams } from 'ag-grid-community/dist/lib/entities/colDef';


@Component({
  selector: 'lib-shared-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit, OnChanges, OnDestroy {
  mytasks = false;
  constructor(public dialog: MatDialog) { }
  
  INPUT_VALIDATON_CONFIG = {
    SEARCH_INPUT_VALIDATION:/[A-Za-z0-9\-\.\<\$\%\*\>\(\)\_/ ]+/,
   }
  gridApi;
  params;
  selectedRows = [];
  approveFilingEntitiesModal = false;
  showToastAfterSubmit = false;
  searchNoDataAvilable;
  buttonModal = false;
  toastAfterExport = false;

  @Input() gridStyle = 'first';
  @Input() button = true;
  @Input() enableAutoId = false;
  @Input() search = true;
  @Input() isToggle = false;
  @Input() isToggleLeft = false;
  @Input() toggleLeftTitle = "";
  @Input() toggleLeftDisabled :boolean = false;
  @Input() hideLabels:boolean = false;
  @Input() buttonPosition: 'left' | 'right';
  @Input() buttonText = 'Approve selected';
  @Input() secondbuttonText = 'Reject selected';
  @Input() unresolveButtonText ="Unresolve"
  @Input() resolveButtonText ="Resolve"
  @Input() displaySecondButton = false;
  @Input() displayCheckBox = false;
  @Input() modalMessage;
  @Input() toastSuccessMessage = 'Approved successfully';
  @Input() noData = 'No results found';
  @Input() submitFunction: () => void;
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
  @Input() permissionToPrimaryButton = true;
  @Input() permissionToSecondaryButton = true;
  @Input() permissionToShowDataTable = true;
  @Input() permissionToResolveExceptionButton = false;
  @Input() permissionToUnresolveExceptionButton = false;
  @Input() rowData: any;
  @Input() disableAddMemberButton = true;
  @Input() columnDefs: any;
  columnDefsData;
  @Input() defaultColDef: any;
  @Input() masterDetail = false;
  @Input() detailCellRendererParams: any;
  @Input() rowSelection: 'single' | 'multiple';
  @Input() firstColumnBorderRight=true;
  @Input() supressCellSelection = true;
  @Input() pagination = false;
  @Input() paginationApi = false;
  @Input() paginationSize = 100;
  @Input() pageChangeFunc: () => void;
  @Input() displayPlusIcon = true;
  @Input() hideHeaderCheckbox = false;
  @Input() disableResolveButton = false;
  @Input() disableUnresolveButton = false;
  @Input() customRowSelected = false;
  @Output() customSortChange = new EventEmitter<string>();
  @Output() newEventToParent = new EventEmitter<string>();
  @Output() unresolveEventToParent = new EventEmitter<string>();
  @Output() selectedRowEmitter = new EventEmitter<any[]>();
  @Output() selectedRowEmitterProcess = new EventEmitter<string>();
  @Output() toggleEventToParent = new EventEmitter<boolean>();
  @Output() toggleLeftEventToParent = new EventEmitter<boolean>();
  @Output() exportFlagToParent = new EventEmitter<boolean>();
  @Output() currentPageChange = new EventEmitter<number>(); 
  @Output() updatePageSize = new EventEmitter<number>();
  @Output() gridReady = new EventEmitter<any>();
  @Output() searchInput = new EventEmitter<string>();
  @Input() export = false;
  @Input() totalRecords = null;
  @Output() rowSelected = new EventEmitter<any>();
  @Input() omitModal = false;
  @Input() uiPagination = false;
  // @Input() exportRequestDetails;
  gridHeadingCls;
  gridContainerCls;
  srnoCls;
  isAllRecordSelected = false;
  dataset;
  currentlySelectedPageSize;
  currentPage = 1;
  maxPages = 5;
  prevPageSize;
  dataset1 = [{
    disable: false,
    value: 100,
    name: '100',
    id: 0
  },
  {
    disable: false,
    value: 200,
    name: '200',
    id: 1
  },
  {
    disable: false,
    value: 300,
    name: '300',
    id: 2
  }];

  currentlySelectedPageSize1 = {
    disable: false,
    value: 100,
    name: '100',
    id: 0
  };


pageSize;

  ngOnInit(): void {
    if (!this.defaultColDef) {
      this.defaultColDef = {
        headerCheckboxSelection: this.hideHeaderCheckbox ? false : this.isFirstColumn,
        checkboxSelection: this.isFirstColumn
      }
    }
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
    this.buttonText === "Data Explorer" ?  this.permissionToPrimaryButton = false  : ''; 
    this.dataset = [{
      disable: false,
      value: this.paginationSize,
      name: this.paginationSize.toString(),
      id: 0
    },
    {
      disable: false,
      value: this.paginationSize * 2,
      name: (this.paginationSize * 2).toString(),
      id: 1
    },
    {
      disable: false,
      value: this.paginationSize * 3,
      name: (this.paginationSize * 3).toString(),
      id: 2
    }];
  
    this.currentlySelectedPageSize = {
      disable: false,
      value: this.paginationSize,
      name: this.paginationSize.toString(),
      id: 0
    };
    this.prevPageSize = this.paginationSize;
    console.log('PAGINATION PAGE SIZE',this.currentlySelectedPageSize);
  }


  ngOnChanges(changes: SimpleChanges) {
    console.log('GRID CHANGES', changes);
    this.disableAddMemberButton ? this.selectedRows.length = 0 : this.selectedRows.length = 1;  
    if (this.paginationApi) {
      if (this.totalRecords >= 0) {
        this.maxPages = Math.ceil(this.totalRecords / this.prevPageSize);
      } else {
        this.maxPages = 1;
      }
      console.log(this.maxPages);
    } 
    if (typeof (this.columnDefs) !== 'undefined' ) {
      this.columnDefsData = []
      this.columnDefsData = this.columnDefs.slice(0);
      if (this.columnDefs[1]?.cellClass !== 'srno-class') {
        let object = { 
          width: 30,
          valueGetter: (args) => this.paginationApi ? (this._getIndexValue(args) + (this.currentPage * this.prevPageSize) - this.prevPageSize) : this._getIndexValue(args), rowDrag: false,
          pinned: 'left',
          cellClass: this.srnoCls
        }
        if (this.displayCheckBox) {
          this.columnDefsData.splice(0, 0, object);
        } else {
          this.columnDefsData.splice(1, 0, object);
        }
      }
      // this.columnDefsData = [...this.columnDefsData];
      console.log('SERIAL NUMBERS', this.columnDefsData)
    }
  }

  async submit() {
    this.selectedRowEmitter.emit(this.selectedRows);
    await this.submitFunction();
    this.selectedRows = [];
    if(!this.isAllRecordSelected) this.gridApi.deselectAll();
    this.buttonModal = false;
    this.showToastAfterSubmit = !this.showToastAfterSubmit;
    setTimeout(() => {
      this.showToastAfterSubmit = !this.showToastAfterSubmit;
    }, 5000);
  }

  async handlePageChange(val: number) {
    this.currentPage = val;
    this.currentPageChange.emit(val);
    console.log('HANDLE PAGE CHANGE', val);
    await this.pageChangeFunc();
  }

  updatePaginationSize(newPageSize: number) {
    this.gridApi.paginationSetPageSize(newPageSize);
    console.log('UPDATE PAGINATION SIZE', newPageSize);
  }

  updatePaginationSizeApi(newPageSize: number) {
    const lastRow = this.prevPageSize * this.currentPage - (this.prevPageSize + 1);
    this.prevPageSize = newPageSize;
    let newPage = 1;
    let rowsVisited = newPageSize;
    while(rowsVisited < lastRow) {
      newPage += 1;
      rowsVisited += newPageSize;
    }
    this.currentPage = newPage;
    this.maxPages = Math.ceil(this.totalRecords / newPageSize);
    this.currentPageChange.emit(this.currentPage);
    this.updatePageSize.emit(newPageSize);
    this.gridApi.paginationSetPageSize(newPageSize);
  }

  openResolveUnresolveDialog(type:string){
    type == "resolve" ? this.newEventToParent.emit() : this.unresolveEventToParent.emit();
  }

  primaryButtonAction() {
    if (this.omitModal) {
      this.submit();
    } else {
      this.openDialog();
    }
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

  handleGridReady(params) {
    this.params = params;
    this.gridApi = params.api;
    this.gridReady.emit(this.params);
  }

  _getIndexValue(args: ValueGetterParams): any {
    return args.node.rowIndex+1;
  }  

  filterChanged(event) {
    this.gridApi.refreshCells();
  }

  sortChanged(params) {
    let sortModel = this.gridApi.getSortModel();
    if (sortModel.length > 0) {
      sortModel = sortModel[0];
      const colId = sortModel['colId'];
      console.log('SORT MODEL', sortModel);
      console.log('TEST', sortModel['colId']);
      console.log('COLID', colId);
      const order = sortModel['sort'] === 'asc' ? 'true' : 'false';
      console.log('GRID COMPONENT SORT', colId + ':' + order);
      this.customSortChange.emit(colId + ':' + order);
      // this.gridApi.refreshCells();
    } else {
      this.customSortChange.emit('');
      this.gridApi.refreshCells();
    }
  }

  onRowSelected(event): void {
    if (this.customRowSelected) {
      this.rowSelected.emit(event);
      this.selectedRows = this.gridApi.getSelectedRows();
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
    if (params.data) {
      const thisIsFirstColumn = (displayedColumns[0] === params.column) && (params.data.approved === false);
      return thisIsFirstColumn;
    } else {
      if(this.rowData){
        const thisIsFirstColumn = (displayedColumns[0] === params.column) && !(this.rowData.every(item => item.approved === true));
        return thisIsFirstColumn;
      } 
    }
  }

  searchGrid(input) {
    this.gridApi.setQuickFilter(input.el.nativeElement.value);
    this.searchNoDataAvilable = (this.gridApi.rowModel.rowsToDisplay.length === 0);
  }

  searchGridPagination(input) {
    if(this.uiPagination) {
      this.searchGrid(input)
    } else {
      this.searchInput.emit(input.el.nativeElement.value);
      this.currentPage = 1;
      console.log('SEARCH GRID PAGINATION EMIT');
    }
    
  }

  searchFilingValidation(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (this.INPUT_VALIDATON_CONFIG.SEARCH_INPUT_VALIDATION.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  onPasteSearchValidation(event: ClipboardEvent) {
    let clipboardData = event.clipboardData;
    let pastedText = (clipboardData.getData('text')).split("");    
    pastedText.forEach((ele, index) => {
      if (this.INPUT_VALIDATON_CONFIG.SEARCH_INPUT_VALIDATION.test(ele)) {
        if ((pastedText.length - 1) === index) {
          return true;
        }
      } else {
        event.preventDefault();
        return false;
      }
    });
  } 

  toggleChanged(event){
    this.toggleEventToParent.emit(event);
  }

  toggleLeftChanged(event){
    this.toggleLeftEventToParent.emit(event);
  }

  exportData(event) {
   /*  const exportURL = requestDetails.exportEndPoint + "?filingName=" + requestDetails.filingName + "&period=" + requestDetails.period + "&headers=" + requestDetails.headers;
    console.log("exportURL > ", exportURL);
    // */
    this.toastAfterExport = true;
    setTimeout(() => {
      this.toastAfterExport = !this.toastAfterExport;
    }, 5000);
    this.exportFlagToParent.emit(true);
  }

  ngOnDestroy(): void {
    this.columnDefs = undefined;
    console.log("Grid Destroy");
  }
}