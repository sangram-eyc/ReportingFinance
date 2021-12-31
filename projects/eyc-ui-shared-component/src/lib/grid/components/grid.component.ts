import { Component, Input, OnInit, TemplateRef, ViewChild, Output, EventEmitter , OnChanges, OnDestroy} from '@angular/core';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../../modal/component/modal.component';
import { ValueGetterParams } from 'ag-grid-community/dist/lib/entities/colDef';
import { TableHeaderRendererComponent } from '../../table-header-renderer/table-header-renderer.component';

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
  selectedRows = [];
  approveFilingEntitiesModal = false;
  showToastAfterSubmit = false;
  searchNoDataAvilable;
  buttonModal = false;

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
  @Input() paginationSize = 10;
  @Input() displayPlusIcon = true;
  @Input() hideHeaderCheckbox = false;
  @Output() newEventToParent = new EventEmitter<string>();
  @Output() selectedRowEmitter = new EventEmitter<any[]>();
  @Output() selectedRowEmitterProcess = new EventEmitter<string>();
  @Output() toggleEventToParent = new EventEmitter<boolean>();
  @Output() toggleLeftEventToParent = new EventEmitter<boolean>();
  gridHeadingCls;
  gridContainerCls;


  // MotifTableHeaderRendererComponent = TableHeaderRendererComponent;
  // MotifTableCellRendererComponent = MotifTableCellRendererComponent;

  // @ViewChild('headerTemplate')
  // headerTemplate: TemplateRef<any>;
  // @ViewChild('dropdownTemplate')
  // dropdownTemplate: TemplateRef<any>;

  ngOnInit(): void {
    // console.log(this.defaultColDef);
    // console.log('GRID COMPONENT INIT');
    if (!this.defaultColDef) {
      this.defaultColDef = {
        headerCheckboxSelection: this.hideHeaderCheckbox ? false : this.isFirstColumn,
        checkboxSelection: this.isFirstColumn
      }
    }
    if(this.displayCheckBox) {
      //this.buttonText = 'Add team';
      this.selectedRows.length = 1;
      this.gridHeadingCls = 'grid-heading-admin';
      this.gridContainerCls = 'gridAdminContainer';
    } else {
      this.gridHeadingCls = 'grid-heading';
      this.gridContainerCls = 'gridContainer';
    }

    this.buttonText === "Data Explorer" ?  this.permissionToPrimaryButton = false  : ''; 
  }


  ngOnChanges(changes: any) {
    this.disableAddMemberButton ? this.selectedRows.length = 0 : this.selectedRows.length = 1;  
    if (typeof(this.columnDefs) !== 'undefined') {
      this.columnDefsData = []
      this.columnDefsData = this.columnDefs.slice(0);
      //sr no column data
      let object =  {
        width: 50,
        valueGetter: (args) => this._getIndexValue(args), rowDrag: true,
        pinned: 'left',
        cellClass: 'srno-class'
      }
        this.columnDefsData.push(object);    
    }
    
  }

  async submit() {
    console.log('CALLING SUBMIT SHARED GRID');
    await this.submitFunction();
    this.selectedRows = [];
    this.gridApi.deselectAll();
    this.selectedRowEmitter.emit(this.selectedRows);
    this.buttonModal = false;
    this.showToastAfterSubmit = !this.showToastAfterSubmit;
    setTimeout(() => {
      this.showToastAfterSubmit = !this.showToastAfterSubmit;
    }, 5000);
  }

  openDialog() {
    if(this.buttonText === "Add User" || this.buttonText === "Add team" || this.buttonText === "Add member" || this.buttonText === "Data Explorer" || this.buttonText === "Add PBI") {
      this.newEventToParent.emit();
      return;
    }
    const dialogRef = this.dialog.open(ModalComponent, this.modalConfig);
    console.log('OPEN DIALOG SHARED GRID');
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if(result.button === "Submit" || result.button === "Continue" || result.button === "Yes") {
        console.log('Calling Submit ...');
        this.submit();
      } else {
        // console.log(result);
      }
    });
  }

  handleGridReady(params) {
    this.gridApi = params.api;
  }

  _getIndexValue(args: ValueGetterParams): any {
    return args.node.rowIndex+1;
  }  

  onRowSelected(event: any): void {
    // console.log('Search',this.search);
    // console.log('Button',this.button);
    // console.log('Position',this.buttonPosition);
    this.selectedRowEmitterProcess.emit('processing');
    let selectedArr = [];
    this.selectedRows = [];
    selectedArr = this.gridApi.getSelectedRows();
    // this.selectedRows =selectedArr.filter(item => item.approved === false);
    for(let i = 0; i < selectedArr.length; i++) {
      if (selectedArr[i].approved == false) {
        this.selectedRows.push(selectedArr[i]);
      }
    }
    this.selectedRowEmitter.emit(this.selectedRows);
    this.selectedRowEmitterProcess.emit('finished');
    if(this.selectedRows.length === 0){
      this.gridApi.deselectAll();
    }
    if(this.selectedRows.length === (this.rowData.filter(item => item.approved === false)).length){
      this.gridApi.selectAll();
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
    // console.log(this.search);
    // console.log(this.rowData);
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
  ngOnDestroy(): void {
    this.columnDefs = undefined;
  }
}