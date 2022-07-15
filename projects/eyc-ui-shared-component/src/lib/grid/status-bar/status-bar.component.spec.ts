import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IStatusPanelParams } from 'ag-grid-community';

import { StatusBarComponent } from './status-bar.component';

describe('StatusBarComponent', () => {
  let component: StatusBarComponent;
  let fixture: ComponentFixture<StatusBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StatusBarComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('agInit method should set template and call  refresh method', () => {
    let mockParams = {
      api: {
        addEventListener: () => { }
      }
    } as any;
    component.agInit(mockParams);
  })

  it('onGridReady method should set gridApi data', () => {
    component['params'] = {
      api: {
        getModel: () => {
          return { getRowCount: () => { } }
        }
      }
    } as any
    component.onGridReady();
  })

  it('onBtFirst method should go to first page', () => {
    component['gridApi'] = {
      paginationGoToFirstPage: () => { }
    }
    spyOn(component['gridApi'], 'paginationGoToFirstPage')
    spyOn(component, 'pagingData')
    component.onBtFirst();
    expect(component['gridApi'].paginationGoToFirstPage).toHaveBeenCalled()
    expect(component.pagingData).toHaveBeenCalled()
  })

  it('onBtLast method should go to last page', () => {
    component['gridApi'] = {
      paginationGoToLastPage: () => { }
    }
    spyOn(component['gridApi'], 'paginationGoToLastPage')
    spyOn(component, 'pagingData')
    component.onBtLast();
    expect(component['gridApi'].paginationGoToLastPage).toHaveBeenCalled()
    expect(component.pagingData).toHaveBeenCalled()
  })

  it('onBtNext method should go to next page', () => {
    component['gridApi'] = {
      paginationGoToNextPage: () => { }
    }
    spyOn(component['gridApi'], 'paginationGoToNextPage')
    spyOn(component, 'pagingData')
    component.onBtNext();
    expect(component['gridApi'].paginationGoToNextPage).toHaveBeenCalled()
    expect(component.pagingData).toHaveBeenCalled()
  })


  it('onBtPrevious method should go to previous page', () => {
    component['gridApi'] = {
      paginationGoToPreviousPage: () => { }
    }
    spyOn(component['gridApi'], 'paginationGoToPreviousPage')
    spyOn(component, 'pagingData')
    component.onBtPrevious();
    expect(component['gridApi'].paginationGoToPreviousPage).toHaveBeenCalled()
    expect(component.pagingData).toHaveBeenCalled()
  })

  it('pagingData method should set page data', () => {
    component['gridApi'] = {
      paginationGetTotalPages: () => { },
      paginationGetCurrentPage: () => { },
    }
    spyOn(component['gridApi'], 'paginationGetTotalPages').and.returnValue(20)
    spyOn(component['gridApi'], 'paginationGetCurrentPage').and.returnValue(5)
    component.pagingData();
    expect(component['gridApi'].paginationGetTotalPages).toHaveBeenCalled()
    expect(component['gridApi'].paginationGetCurrentPage).toHaveBeenCalled()
    expect(component.totalPage).toEqual(20)
    expect(component.currentpage).toEqual(5)
  })

  it('jumpToPage method should jump to page ', () => {
    component['gridApi'] = {
      paginationGoToPage: () => { },
      paginationGetTotalPages: () => { },
      paginationGetCurrentPage: () => { },
    }
    spyOn(component['gridApi'], 'paginationGetTotalPages').and.returnValue(20)
    spyOn(component['gridApi'], 'paginationGetCurrentPage').and.returnValue(5)
    component.jumpToPage()
    expect(component['gridApi'].paginationGetTotalPages).toHaveBeenCalled()
    expect(component['gridApi'].paginationGetCurrentPage).toHaveBeenCalled()
    expect(component.totalPage).toEqual(20)
    expect(component.currentpage).toEqual(5)
  })

  it('onPageSizeChanged method should update page size', () => {
    component['gridApi'] = {
      paginationSetPageSize: () => { },
      paginationGetTotalPages: () => { },
      paginationGetCurrentPage: () => { },
    }
    spyOn(component['gridApi'], 'paginationSetPageSize');
    spyOn(component['gridApi'], 'paginationGetTotalPages').and.returnValue(20)
    spyOn(component['gridApi'], 'paginationGetCurrentPage').and.returnValue(5)
    component.onPageSizeChanged()
    expect(component['gridApi'].paginationSetPageSize).toHaveBeenCalled()
    expect(component['gridApi'].paginationGetTotalPages).toHaveBeenCalled()
    expect(component['gridApi'].paginationGetCurrentPage).toHaveBeenCalled()
    expect(component.totalPage).toEqual(20)
    expect(component.currentpage).toEqual(5)
  })
});
