import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { AgGridEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { of } from 'rxjs';

import { AgGridComponent } from './ag-grid.component';

describe('AgGridComponent', () => {
  let component: AgGridComponent;
  let fixture: ComponentFixture<AgGridComponent>;
  let matDialogStub = {
    open: () => { }
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AgGridComponent],
      providers: [HttpClient, HttpClientModule, HttpHandler,
        { provide: MatDialog, useValue: matDialogStub }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit method should set grid headings for checkbox', () => {
    component.displayCheckBox = true;
    component.ngOnInit();
    expect(component.selectedRows.length).toEqual(1)
  })

  it('ngOnChnages method should set selected rows length to 0', () => {
    component.disablePrimaryButton = true;
    component.ngOnChanges({});
    expect(component.selectedRows.length).toEqual(0)
  })

  it('ngOnChnages method should set selected rows length to 1', () => {
    component.disablePrimaryButton = false;
    component.ngOnChanges({});
    expect(component.selectedRows.length).toEqual(1)
  })

  it('isFirstColumn method should set first column', () => {
    let mockDisplayedColumns = [
      {
        approved: false,
        entityName: 'PF',
        entityId: 344
      }
    ]
    let mockParams = {
      column: {
        approved: false,
        entityName: 'PF',
        entityId: 344
      },
      data: {
        approved: false
      },
      columnApi: {
        getAllDisplayedColumns: () => {
          return mockDisplayedColumns;
        }
      }
    }
    let res = component.isFirstColumn(mockParams);
    expect(component.isHideCheckBox).toEqual(true);
    expect(res).toEqual(false)

  })

  it('isFirstColumn method should set first column', () => {
    let mockDisplayedColumns = [
      {
        approved: false,
        entityName: 'PF',
        entityId: 344
      }
    ]
    let mockParams = {
      column: {
        approved: false,
        entityName: 'PF',
        entityId: 344
      },
      columnApi: {
        getAllDisplayedColumns: () => {
          return mockDisplayedColumns;
        }
      }
    }
    component.rowData = [
      {
        approved: false,
        entityName: 'PF',
        entityId: 344
      }
    ]
    let res = component.isFirstColumn(mockParams);
    expect(component.isHideCheckBox).toEqual(true);
    expect(res).toEqual(false)
  })

  it('isFirstColumn method should set first column  when no checkbox', () => {
    let mockParams = {
      column: {
        entityName: 'PF',
        entityId: 344
      },
      columnApi: {
        getAllDisplayedColumns: () => {
          return []
        }
      }
    }
    component.isHideCheckBox = false
    let res = component.isFirstColumn(mockParams);
    expect(res).toEqual(false)
  })

  it('openDialog method should emit event to parent', () => {
    spyOn(component['newEventToParent'], 'emit');
    component.buttonText = 'Add User';
    component.openDialog()
    expect(component['newEventToParent'].emit).toHaveBeenCalled();
  })

  it('openDialog method should call submit method ', () => {
    spyOn(component['dialog'], 'open').and.returnValue({ afterClosed: () => of({ button: 'Submit' }) } as any);
    spyOn(component, 'submit')
    component.buttonText = 'Resolve';
    component.openDialog()
    expect(component['dialog'].open).toHaveBeenCalled();
    expect(component.submit).toHaveBeenCalled()
  })

  it('openDialog method should not call submit method ', () => {
    spyOn(component['dialog'], 'open').and.returnValue({ afterClosed: () => of({ button: 'Click' }) } as any);
    spyOn(component, 'submit')
    component.buttonText = 'Resolve';
    component.openDialog()
    expect(component['dialog'].open).toHaveBeenCalled();
    expect(component.submit).not.toHaveBeenCalled()
  })

  it('openDialogTwo method should emit event to parent', () => {
    spyOn(component['newEventToParent'], 'emit');
    component.buttonText = 'Add User';
    component.openDialogTwo()
    expect(component['newEventToParent'].emit).toHaveBeenCalled();
  })

  it('openDialogTwo method should call submiTwo method ', () => {
    spyOn(component['dialog'], 'open').and.returnValue({ afterClosed: () => of({ button: 'Submit' }) } as any);
    spyOn(component, 'submitTwo')
    component.buttonText = 'Resolve';
    component.openDialogTwo()
    expect(component['dialog'].open).toHaveBeenCalled();
    expect(component.submitTwo).toHaveBeenCalled()
  })

  it('openDialogTwo method should not call submiTwo method ', () => {
    spyOn(component['dialog'], 'open').and.returnValue({ afterClosed: () => of({ button: 'Click' }) } as any);
    spyOn(component, 'submitTwo')
    component.buttonText = 'Resolve';
    component.openDialogTwo()
    expect(component['dialog'].open).toHaveBeenCalled();
    expect(component.submitTwo).not.toHaveBeenCalled()
  })

  it('openResolveUnresolveDialog method should open Resolve Dialog', () => {
    spyOn(component['newEventToParent'], 'emit')
    component.openResolveUnresolveDialog('resolve');
    expect(component['newEventToParent'].emit).toHaveBeenCalled()
  })

  it('openResolveUnresolveDialog method should open Unresolve Dialog', () => {
    spyOn(component['unresolveEventToParent'], 'emit')
    component.openResolveUnresolveDialog('unresolve');
    expect(component['unresolveEventToParent'].emit).toHaveBeenCalled()
  })

  it('primaryButtonAction method should open omitModal', () => {
    spyOn(component, 'submit');
    component.omitModal = true;
    component.primaryButtonAction()
    expect(component.submit).toHaveBeenCalled();
  })

  it('primaryButtonAction method should open openDialog', () => {
    spyOn(component, 'openDialog');
    component.omitModal = false;
    component.primaryButtonAction()
    expect(component.openDialog).toHaveBeenCalled();
  })

  it('approveButtonAction method should open openDialog', () => {
    spyOn(component, 'openDialog');
    component.omitModal = false;
    component.approveButtonAction()
    expect(component.openDialog).toHaveBeenCalled();
  })

  it('unapproveButtonAction method should open openDialogTwo', () => {
    spyOn(component, 'openDialogTwo');
    component.omitModal = false;
    component.unapproveButtonAction()
    expect(component.openDialogTwo).toHaveBeenCalled();
  })

  it('onChange method should emit event on custom row selection', () => {
    component.customRowSelected = true;
    let mockRows = [
      {
        approved: false,
        entityId: 1234,
        entityName: 'Form PF'
      }
    ]
    component['gridApi'] = {
      getSelectedRows: () => { }
    } as any
    spyOn(component['rowSelected'], 'emit');
    spyOn(component['selectedRowEmitter'], 'emit');
    spyOn(component['gridApi'], 'getSelectedRows').and.returnValue(mockRows)
    component.onChange(mockRows);
    expect(component['gridApi'].getSelectedRows).toHaveBeenCalled()
  })

  it('onChange method should set isAllRecordSelected as true when the user selects all', () => {
    let mockRows = [
      {
        approved: false,
        entityId: 1234,
        entityName: 'Form PF'
      }
    ]
    component.rowData = [
      {
        approved: false,
        entityId: 1234,
        entityName: 'Form PF'
      }
    ]
    component['gridApi'] = {
      getSelectedRows: () => { },
      selectAll: () => { }
    } as any
    spyOn(component['gridApi'], 'getSelectedRows').and.returnValue(mockRows)
    spyOn(component['gridApi'], 'selectAll');
    spyOn(component['selectedRowEmitterProcess'], 'emit');
    component.onChange(mockRows);
    expect(component['gridApi'].getSelectedRows).toHaveBeenCalled()
    expect(component['gridApi'].selectAll).toHaveBeenCalled()
    expect(component.isAllRecordSelected).toEqual(true)

  })

  it('onChange method should call deselectAll and call isAllRecordSelected as false when the  deselects all', () => {
    let mockRows = [
      {
        approved: false,
        entityId: 1234,
        entityName: 'Form PF'
      }
    ]
    component.rowData = [
      {
        approved: false,
        entityId: 1234,
        entityName: 'Form PF'
      }
    ]
    component['gridApi'] = {
      getSelectedRows: () => { },
      selectAll: () => { },
      deselectAll: () => { }
    } as any
    spyOn(component['gridApi'], 'getSelectedRows').and.returnValue([])
    spyOn(component['gridApi'], 'deselectAll');
    component.onChange(mockRows);
    expect(component['gridApi'].getSelectedRows).toHaveBeenCalled()
    expect(component['gridApi'].deselectAll).toHaveBeenCalled()

  })

  it('onSortChanged method should call refreshCells method', () => {
    let mockEvent = {
      api: {
        refreshCells: () => { }
      }
    } as AgGridEvent;
    spyOn(mockEvent['api'], 'refreshCells')
    component.onSortChanged(mockEvent);
    expect(mockEvent.api.refreshCells).toHaveBeenCalled()
  })

  it('onFilterChanged method should call refreshCells method', () => {
    let mockEvent = {
      api: {
        refreshCells: () => { }
      }
    } as AgGridEvent;
    spyOn(mockEvent['api'], 'refreshCells')
    component.onFilterChanged(mockEvent);
    expect(mockEvent.api.refreshCells).toHaveBeenCalled()
  })

  it('openCloseToolPanel method should open side panel', () => {
    component['gridApi'] = {
      getOpenedToolPanel: () => { false },
      setSideBarVisible: () => { },
      openToolPanel: () => { }
    } as any;
    spyOn(component['gridApi'], 'setSideBarVisible');
    spyOn(component['gridApi'], 'openToolPanel');
    component.openCloseToolPanel({})
    expect(component['gridApi'].setSideBarVisible).toHaveBeenCalledWith(true);
    expect(component['gridApi'].openToolPanel).toHaveBeenCalled()
  })

  it('openCloseToolPanel method should close side panel', () => {
    component['gridApi'] = {
      getOpenedToolPanel: () => {
        return { data: {} }
      },
      setSideBarVisible: () => { },
      closeToolPanel: () => { },
      openToolPanel: () => { }
    } as any;
    spyOn(component['gridApi'], 'setSideBarVisible');
    spyOn(component['gridApi'], 'closeToolPanel');
    component.openCloseToolPanel({})
    expect(component['gridApi'].setSideBarVisible).toHaveBeenCalledWith(false);
    expect(component['gridApi'].closeToolPanel).toHaveBeenCalled()
  })

  it('exportData method should set name for csv', () => {
    let currentdate = new Date();
    var datetime = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1) + "-" + currentdate.getDate() + " "
      + currentdate.getHours() + "-"
      + currentdate.getMinutes() + "-"
      + currentdate.getSeconds();
    component.exportName = "Form PF";
    component['gridApi'] = {
      exportDataAsCsv: () => { }
    } as any;
    spyOn(component['gridApi'], 'exportDataAsCsv');
    component.exportData()
    expect(component['gridApi'].exportDataAsCsv).toHaveBeenCalledWith({ fileName: `Form PF${datetime}` })
  })

  it('onPageSizeChange method should set new page size', () => {
    component['gridApi'] = {
      paginationSetPageSize: () => { }
    } as any
    component.pageSize = 50
    spyOn(component['gridApi'], 'paginationSetPageSize');
    component.onPageSizeChange();
    expect(component['gridApi'].paginationSetPageSize).toHaveBeenCalledWith(50)
  })

  it('onModelUpdated method should set pagination status bar data', () => {
    component.pageList = [20, 50, 100];
    component.pageSize = 20;
    component['gridApi'] = {
      getDisplayedRowCount: () => {},
      showNoRowsOverlay: () => { },
      hideOverlay: () => { },
      paginationGetTotalPages: () => 15,
      paginationGetCurrentPage: () => 3,
      getStatusPanel: () => { }
    } as any;
    let mockBarComponent = {
      totalPage: '',
      currentpage: '',
      pageList: '',
      pageSize: ''
    } as any
    spyOn(component['gridApi'], 'paginationGetTotalPages').and.returnValue(15);
    spyOn(component['gridApi'], 'paginationGetCurrentPage').and.returnValue(3);
    spyOn(component['gridApi'], 'getStatusPanel').and.returnValue(mockBarComponent);

    component.onModelUpdated({})
    expect(component['gridApi'].getStatusPanel).toHaveBeenCalledWith('statusBarCompKey')
    expect(component['gridApi'].paginationGetTotalPages).toHaveBeenCalled();
    expect(component.totalPage).toEqual(15)
    expect(component.currentpage).toEqual(3)
    expect(mockBarComponent.totalPage).toEqual(15)
    expect(mockBarComponent.currentpage).toEqual(3)
    expect(mockBarComponent.pageList).toEqual([20, 50, 100])
    expect(mockBarComponent.pageSize).toEqual(20)
  });

  it('onGridReady method should set data for grid', () => {
    let mockParams = {
      api: {
        setSideBarVisible: () => { },
        paginationGetTotalPages: () => { },
        paginationGetCurrentPage: () => { },
        setDomLayout: () => { }
      },
      columnApi: {}
    };

    component['gridApi'] = mockParams.api as any
    spyOn(component['gridApi'], 'paginationGetTotalPages').and.returnValue(15);
    spyOn(component['gridApi'], 'paginationGetCurrentPage').and.returnValue(3);
    spyOn(component['gridApi'], 'setSideBarVisible');
    spyOn(component['gridApi'], 'setDomLayout');
    component.onGridReady(mockParams as any);
    expect(component['gridApi'].setSideBarVisible).toHaveBeenCalledWith(false);
    expect(component['gridApi'].paginationGetTotalPages).toHaveBeenCalled();
    expect(component['gridApi'].paginationGetCurrentPage).toHaveBeenCalled();
    expect(component.totalPage).toEqual(15)
    expect(component.currentpage).toEqual(3)
    
  })

  it('setAutoHeight method should set auto height',()=>{
    component['gridApi']={
      setDomLayout:()=>{}
    }as any;
    spyOn(component['gridApi'], 'setDomLayout');
    component.setAutoHeight();
    expect(component['gridApi'].setDomLayout).toHaveBeenCalledWith('autoHeight');

  })
});
