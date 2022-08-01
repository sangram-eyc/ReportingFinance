import { Component } from '@angular/core';
import { IStatusPanelAngularComp } from 'ag-grid-angular';
import { IStatusPanelParams } from 'ag-grid-community';


@Component({
  selector: 'lib-status-bar',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.scss']
})
export class StatusBarComponent implements IStatusPanelAngularComp  {
  private params!: IStatusPanelParams;
  public count: number | null = null;
  gridApi: any;
  totalPage:number;
  currentpage:number;
  pageList = [20,50,100];
  componentParent: any;
  visible = false;
  constructor() { }

  agInit(params: IStatusPanelParams): void {
    this.params = params;
    this.params.api.addEventListener('gridReady', this.onGridReady.bind(this));
  }

  onGridReady() {
    this.count = this.params.api.getModel().getRowCount();
    this.gridApi = this.params.api;
    // this.pageList = this.params?.context?.componentParent.pageList;

    // setTimeout(() => {
    //   if (this.gridApi) {
    //     this.componentParent = this.params.context?.componentParent;
    //     this.componentParent?.onModelUpdated();
    //     this.totalPage = this.gridApi.paginationGetTotalPages();
    //     this.currentpage = this.gridApi.paginationGetCurrentPage();
    //     this.pageList = this.componentParent?.pageList;
    //     console.log(this.pageList,"totalPage is loaded")

    //   }
    //   if (this.componentParent.totalPage) {
    //     console.log("totalPage is loaded")
    //   }
    // }, 1000);
  }

  onBtFirst() {
    this.gridApi.paginationGoToFirstPage();
    this.pagingData();
  }

  onBtLast() {
    this.gridApi.paginationGoToLastPage();
    this.pagingData();
    console.log(this.gridApi.paginationGoToLastPage(),"this.gridApi.paginationGoToLastPage()")
}

  onBtNext() {
    this.gridApi.paginationGoToNextPage();
    this.pagingData();
  }

  onBtPrevious() {
    this.gridApi.paginationGoToPreviousPage();
    this.pagingData();
  }

  pagingData(){
    this.resetJumpToValue()
    this.totalPage = this.gridApi.paginationGetTotalPages();
    this.currentpage = this.gridApi.paginationGetCurrentPage();  
  }

  jumpToPage() {
    let SelectedRowNo= (document.getElementById('jumpToPage') as HTMLInputElement).value
    console.log(SelectedRowNo,"SelectedRowNo SelectedRowNo SelectedRowNo SelectedRowNo")
    this.gridApi.paginationGoToPage(parseInt(SelectedRowNo)?parseInt(SelectedRowNo)-1: 0);
    this.totalPage = this.gridApi.paginationGetTotalPages();
    this.currentpage = this.gridApi.paginationGetCurrentPage();
  }

  onPageSizeChanged() {
    this.resetJumpToValue()
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi?.paginationSetPageSize(Number(value));
    this.totalPage = this.gridApi.paginationGetTotalPages();
    this.currentpage = this.gridApi.paginationGetCurrentPage();
  }

  resetJumpToValue(){
    (document.getElementById('jumpToPage') as HTMLInputElement).value = '';
  }

  setVisible(visible: boolean) {
    this.visible = visible;
  }
}
