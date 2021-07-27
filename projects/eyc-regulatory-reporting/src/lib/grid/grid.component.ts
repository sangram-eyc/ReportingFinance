import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {INPUT_VALIDATON_CONFIG} from '../config/rr-config-helper';
import { TableHeaderRendererComponent } from '../shared/table-header-renderer/table-header-renderer.component';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from 'eyc-ui-shared-component';

@Component({
  selector: 'lib-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  gridApi;
  selectedRows = [];
  approveFilingEntitiesModal = false;
  showToastAfterSubmit = false;
  searchNoDataAvilable;
  buttonModal = false;

  @Input() gridStyle = 'first';
  @Input() button = true;
  @Input() search = true;
  @Input() buttonPosition: 'left' | 'right';
  @Input() buttonText = 'Approve selected';
  @Input() displayCheckBox;
  @Input() modalMessage;
  @Input() toastSuccessMessage = 'Approved successfully';
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
  @Input() rowData: any;
  @Input() columnDefs: any;
  @Input() defaultColDef: any;
  @Input() masterDetail = false;
  @Input() detailCellRendererParams: any;
  @Input() rowSelection: 'single' | 'multiple';
  @Input() firstColumnBorderRight=true;
  @Input() supressCellSelection = true;
  @Input() pagination = false;
  @Input() paginationSize = 10;
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
        headerCheckboxSelection: this.isFirstColumn,
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
  }

  async submit() {
    await this.submitFunction();
    this.selectedRows = [];
    this.buttonModal = false;
      this.showToastAfterSubmit = !this.showToastAfterSubmit;
      setTimeout(() => {
        this.showToastAfterSubmit = !this.showToastAfterSubmit;
      }, 5000);
  }

  openDialog() {
    const dialogRef = this.dialog.open(ModalComponent, this.modalConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

  handleGridReady(params) {
    this.gridApi = params.api;
  }

  onRowSelected(event: any): void {
    console.log('Search',this.search);
    console.log('Button',this.button);
    console.log('Position',this.buttonPosition);
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

  searchGrid(input) {
    this.gridApi.setQuickFilter(input.el.nativeElement.value);
    this.searchNoDataAvilable = (this.gridApi.rowModel.rowsToDisplay.length === 0);
    console.log(this.search);
  }

  searchFilingValidation(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (INPUT_VALIDATON_CONFIG.SEARCH_INPUT_VALIDATION.test(inp)) {
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
      if (INPUT_VALIDATON_CONFIG.SEARCH_INPUT_VALIDATION.test(ele)) {
        if ((pastedText.length - 1) === index) {
          return true;
        }
      } else {
        event.preventDefault();
        return false;
      }
    });
  } 

}
