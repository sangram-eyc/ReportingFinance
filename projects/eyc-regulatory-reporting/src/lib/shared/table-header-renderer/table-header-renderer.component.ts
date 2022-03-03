import { Component, ElementRef } from '@angular/core';
// VENDORS
import { IHeaderAngularComp } from 'ag-grid-angular';
import { Column } from 'ag-grid-community';

@Component({
  selector: 'table-header-renderer',
  templateUrl: './table-header-renderer.component.html',
  styleUrls: ['./table-header-renderer.component.scss'],
  host: {
    '(click)': 'onSortRequested(sorted, $event)'
  }
})
export class TableHeaderRendererComponent implements IHeaderAngularComp {
  public params: any = null;
  public sorted: string;
  public filterNumber = 0;
  private filterManager;
  private readonly elementRef: ElementRef;

  constructor(elementRef: ElementRef) {
    this.elementRef = elementRef;
}


  refresh(params): boolean {
    return true;
  }

  agInit(params): void {
    this.params = params;
    this.params.column.addEventListener('sortChanged', this.onSortChanged.bind(this));
    this.params.column.addEventListener('filterChanged', this.filterActive.bind(this));
    this.filterManager = this.params.api.filterManager;
    this.onSortChanged();
  }

  filterActive() {
    console.log('filter of column is ' + this.params.column.isFilterActive());
    console.log(this.params);
    let columnName = this.params.column.colId;
    this.filterNumber = 0;
    let i = 0;
    this.filterNumber = 0;
    for (const filter of this.filterManager.activeAdvancedFilters) {
      if (columnName === filter.textFilterParams.colDef.field) {
        if ( 'condition2' in this.filterManager.activeAdvancedFilters[i].appliedModel) {
          this.filterNumber = 2;
        } else {
          this.filterNumber = 1;
        }
        break;
      }
      i++;
    }
  }

  onSortRequested(currentSort, $event) {
    let order: string;

    if (currentSort === '') {
      order = 'asc';
    } else if (currentSort === 'asc') {
      order = 'desc';
    } else {
      order = '';
    }

    this.params.setSort(order, $event.shiftKey);
  }

  onSortChanged() {
    const params = this.params.column;
    let value;

    if (params.isSortAscending()) {
      value = 'asc';
    } else if (params.isSortDescending()) {
      value = 'desc';
    } else {
      value = '';
    }

    this.sorted = value;
  }

  onMenuClick(e) {
    e.stopPropagation();
    this.params.showColumnMenu(this.querySelector('.header-menu-button'));
  }

  private querySelector(selector: string) {
    return <HTMLElement>this.elementRef.nativeElement.querySelector('.header-menu-button', selector);
  }
}