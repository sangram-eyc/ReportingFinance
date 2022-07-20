import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Grid, GridApi, ValueGetterParams } from 'ag-grid-community/dist/lib/main';
import { EMPTY, of } from 'rxjs';
import { ModalComponent } from '../../modal/component/modal.component';

import { GridComponent } from './grid.component';

describe('GridComponent', () => {
  let component: GridComponent;
  let fixture: ComponentFixture<GridComponent>;

  let matDialogStub  = {
    open :()=>{}
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridComponent ],
      providers:[
        {provide:MatDialog,useValue:matDialogStub}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  }); 

  it('openResolveUnresolveDialog method should open Resolve Dialog',()=>{
    spyOn(component['newEventToParent'],'emit')
    component.openResolveUnresolveDialog('resolve');
    expect(component['newEventToParent'].emit).toHaveBeenCalled()
  })

  it('openResolveUnresolveDialog method should open Unresolve Dialog',()=>{
    spyOn(component['unresolveEventToParent'],'emit')
    component.openResolveUnresolveDialog('unresolve');
    expect(component['unresolveEventToParent'].emit).toHaveBeenCalled()
  })

  it('primaryButtonAction method should open omitModal',()=>{
    spyOn(component,'submit');
    component.omitModal = true;
    component.primaryButtonAction()
    expect(component.submit).toHaveBeenCalled();
  })

  it('primaryButtonAction method should open openDialog',()=>{
    spyOn(component,'openDialog');
    component.omitModal = false;
    component.primaryButtonAction()
    expect(component.openDialog).toHaveBeenCalled();
  })

  it('approveButtonAction method should open omitModal',()=>{
    spyOn(component,'submit');
    component.omitModal = true;
    component.approveButtonAction()
    expect(component.submit).toHaveBeenCalled();
  })

  it('approveButtonAction method should open openDialog',()=>{
    spyOn(component,'openDialog');
    component.omitModal = false;
    component.approveButtonAction()
    expect(component.openDialog).toHaveBeenCalled();
  })

  it('unapproveButtonAction method should open omitModal',()=>{
    spyOn(component,'submit');
    component.omitModal = true;
    component.unapproveButtonAction()
    expect(component.submit).toHaveBeenCalled();
  })

  it('unapproveButtonAction method should open openDialogTwo',()=>{
    spyOn(component,'openDialogTwo');
    component.omitModal = false;
    component.unapproveButtonAction()
    expect(component.openDialogTwo).toHaveBeenCalled();
  })

  it('handleGridReady method should set params',()=>{
    let mockData = {
      api :''
    }
    spyOn(component['gridReady'],'emit');
    component.handleGridReady(mockData);
    expect(component['gridReady'].emit).toHaveBeenCalled()
  })

  it('_getIndexValue method should return index value',()=>{
    let mockData = {
      node :{
        rowIndex : 4
      }
    } as ValueGetterParams
    let res = component._getIndexValue(mockData);
    expect(res).toEqual(5)
  })

  it('toggleChanged method should emit event',()=>{
    spyOn(component['toggleEventToParent'],'emit');
    component.toggleChanged({});
    expect(component['toggleEventToParent'].emit).toHaveBeenCalled()
  })

  it('toggleLeftChanged method should emit event',()=>{
    spyOn(component['toggleLeftEventToParent'],'emit');
    component.toggleLeftChanged({});
    expect(component['toggleLeftEventToParent'].emit).toHaveBeenCalled()
  })

  it('exportData method should export the data',fakeAsync(()=>{
    spyOn(component['exportFlagToParent'],'emit');
    component.toastAfterExport = false;
    component.exportData({});
    expect(component.toastAfterExport).toEqual(true);
    tick(5000);
    expect(component.toastAfterExport).toEqual(false);
    expect(component['exportFlagToParent'].emit).toHaveBeenCalled()
  }))
  
  it('isFirstColumn method should set first column',()=>{
    let mockDisplayedColumns = [
      {
        approved:false,
        entityName:'PF',
        entityId:344
      }
    ]
    let mockParams ={
      column:{
        approved:false,
        entityName:'PF',
        entityId:344
      },
      data :{
        approved: false
      },
      columnApi :{
        getAllDisplayedColumns :()=>{
          return mockDisplayedColumns;
        }
      }
    }
    let res= component.isFirstColumn(mockParams);
    expect(component.isHideCheckBox).toEqual(true);
    expect(res).toEqual(false)

  })

  it('isFirstColumn method should set first column',()=>{
    let mockDisplayedColumns = [
      {
        approved:false,
        entityName:'PF',
        entityId:344
      }
    ]
    let mockParams ={
      column:{
        approved:false,
        entityName:'PF',
        entityId:344
      },
      columnApi :{
        getAllDisplayedColumns :()=>{
          return mockDisplayedColumns;
        }
      }
    }
    component.rowData =[
      {
        approved:false,
        entityName:'PF',
        entityId:344
      }
    ]
    let res= component.isFirstColumn(mockParams);
    expect(component.isHideCheckBox).toEqual(true);
    expect(res).toEqual(false)
  })

  it('searchGridPagination method should',()=>{
    let mockInput = {
      el :{
        nativeElement :{
          value:'ab'
        }
      }
    }
    component.searchGridPagination(mockInput);
    expect(component.uiPagination).toEqual(false)
  })

  it('searchGridPagination method should',()=>{
    let mockInput = {
      el :{
        nativeElement :{
          value:'ab'
        }
      }
    }
    component.uiPagination= true
    spyOn(component,'searchGrid')
    component.searchGridPagination(mockInput);
    expect(component.searchGrid).toHaveBeenCalledWith(mockInput)
  })

  it('ngOnInit method should set gridheaders details',()=>{
    component.displayCheckBox=true;
    component.ngOnInit();
    expect(component.gridHeadingCls).toEqual('grid-heading-admin');
    expect(component.gridContainerCls ).toEqual('gridAdminContainer');
    expect(component.srnoCls  ).toEqual('');
  })

  it('ngOnChanges method should set prev page size, max pages',()=>{
    component.prevPageSize = 2;
    component.disableAddMemberButton = true;
    component.paginationApi=true;
    component.columnDefs =[
      {
        header:'name',
        filter:true
      }
    ]
    component.ngOnChanges({});
    expect(component.prevPageSize).toEqual(4)
    expect(component.maxPages ).toEqual(0)
    expect(component.initialGridLoaded  ).toEqual(true)
  })

  it('searchFilingValidation method should return validation - return true',()=>{
    let mockEvent = {
      keyCode:101
    }
    let res= component.searchFilingValidation(mockEvent)
    expect(res).toEqual(true);
  })

  xit('searchFilingValidation method should return validation - return false',()=>{
    let mockEvent = {
      keyCode:''
    }
    component.searchFilingValidation(mockEvent)
  })

  it('openDialog method should emit event to parent',()=>{
    spyOn(component['newEventToParent'],'emit');
    component.buttonText = 'Add User';
    component.openDialog()
    expect(component['newEventToParent'].emit).toHaveBeenCalled();
  })

  it('openDialog method should call submit method ',()=>{
    spyOn(component['dialog'],'open').and.returnValue({afterClosed:()=>of({button:'Submit'})} as any);
    spyOn(component,'submit')
    component.buttonText = 'Resolve';
    component.openDialog()
    expect(component['dialog'].open).toHaveBeenCalled();
    expect(component.submit).toHaveBeenCalled()
  })

  it('openDialog method should not call submit method ',()=>{
    spyOn(component['dialog'],'open').and.returnValue({afterClosed:()=>of({button:'Click'})} as any);
    spyOn(component,'submit')
    component.buttonText = 'Resolve';
    component.openDialog()
    expect(component['dialog'].open).toHaveBeenCalled();
    expect(component.submit).not.toHaveBeenCalled()
  })

  it('openDialogTwo method should emit event to parent',()=>{
    spyOn(component['newEventToParent'],'emit');
    component.buttonText = 'Add User';
    component.openDialogTwo()
    expect(component['newEventToParent'].emit).toHaveBeenCalled();
  })

  it('openDialogTwo method should call submiTwo method ',()=>{
    spyOn(component['dialog'],'open').and.returnValue({afterClosed:()=>of({button:'Submit'})} as any);
    spyOn(component,'submitTwo')
    component.buttonText = 'Resolve';
    component.openDialogTwo()
    expect(component['dialog'].open).toHaveBeenCalled();
    expect(component.submitTwo).toHaveBeenCalled()
  })

  it('openDialogTwo method should not call submiTwo method ',()=>{
    spyOn(component['dialog'],'open').and.returnValue({afterClosed:()=>of({button:'Click'})} as any);
    spyOn(component,'submitTwo')
    component.buttonText = 'Resolve';
    component.openDialogTwo()
    expect(component['dialog'].open).toHaveBeenCalled();
    expect(component.submitTwo).not.toHaveBeenCalled()
  })

  it('filterChanged method should call refreshCells method',()=>{
    component.gridApi ={
      refreshCells :()=>{}
    }
    spyOn(component['gridApi'],'refreshCells');
    component.filterChanged({});
    expect(component['gridApi'].refreshCells).toHaveBeenCalled()
  })

  it('onChange method should emit event on custom row selection',()=>{
    component.customRowSelected=true;
    let mockRows= [
      {
        approved:false,
        entityId:1234,
        entityName:'Form PF'
      }
    ]
    component.gridApi ={
      getSelectedRows :()=>{}
    }
    spyOn(component['rowSelected'],'emit');
    spyOn(component['selectedRowEmitter'],'emit');
    spyOn(component['gridApi'],'getSelectedRows').and.returnValue(mockRows)
    component.onChange(mockRows);
    expect(component['gridApi'].getSelectedRows).toHaveBeenCalled()
  })

  it('onChange method should set isAllRecordSelected as true when the user selects all',()=>{
    let mockRows= [
      {
        approved:false,
        entityId:1234,
        entityName:'Form PF'
      }
    ]
    component.rowData= [
      {
        approved:false,
        entityId:1234,
        entityName:'Form PF'
      }
    ]
    component.gridApi ={
      getSelectedRows :()=>{},
      selectAll:()=>{}
    }
    spyOn(component['gridApi'],'getSelectedRows').and.returnValue(mockRows)
    spyOn(component['gridApi'],'selectAll');
    spyOn(component['selectedRowEmitterProcess'],'emit');
    component.onChange(mockRows);
    expect(component['gridApi'].getSelectedRows).toHaveBeenCalled()
    expect(component['gridApi'].selectAll).toHaveBeenCalled()
    expect(component.isAllRecordSelected).toEqual(true)

  })

  it('onChange method should call deselectAll and call isAllRecordSelected as false when the  deselects all',()=>{
    let mockRows= [
      {
        approved:false,
        entityId:1234,
        entityName:'Form PF'
      }
    ]
    component.rowData= [
      {
        approved:false,
        entityId:1234,
        entityName:'Form PF'
      }
    ]
    component.gridApi ={
      getSelectedRows :()=>{},
      selectAll:()=>{},
      deselectAll:()=>{}
    }
    spyOn(component['gridApi'],'getSelectedRows').and.returnValue([])
    spyOn(component['gridApi'],'deselectAll');
    component.onChange(mockRows);
    expect(component['gridApi'].getSelectedRows).toHaveBeenCalled()
    expect(component['gridApi'].deselectAll).toHaveBeenCalled()

  })


  it('sortChanged method should emit customSortChange event when sort changed to asc order',()=>{
    let mockSortModel= [
      {
        colId:1234,
        sort:'asc'
      }
    ]
    component.gridApi ={
      getSortModel :()=>{},
      refreshCells:()=>{}
    }
    spyOn(component['customSortChange'],'emit');
    spyOn(component['gridApi'],'getSortModel').and.returnValue(mockSortModel)
    component.sortChanged({})
    expect(component['gridApi'].getSortModel).toHaveBeenCalled()
    expect(component['customSortChange'].emit).toHaveBeenCalledWith('1234:true')
  })

  it('sortChanged method should emit customSortChange event when sort changed to desc order',()=>{
    let mockSortModel= [
      {
        colId:1234,
        sort:'desc'
      }
    ]
    component.gridApi ={
      getSortModel :()=>{},
      refreshCells:()=>{}
    }
    spyOn(component['customSortChange'],'emit');
    spyOn(component['gridApi'],'getSortModel').and.returnValue(mockSortModel)
    component.sortChanged({})
    expect(component['gridApi'].getSortModel).toHaveBeenCalled()
    expect(component['customSortChange'].emit).toHaveBeenCalledWith('1234:false')
  })

  it('sortChanged method should emit empty event',()=>{
    component.gridApi ={
      getSortModel :()=>{},
      refreshCells:()=>{}
    }
    spyOn(component['customSortChange'],'emit');
    spyOn(component['gridApi'],'getSortModel').and.returnValue([])
    component.sortChanged({})
    expect(component['gridApi'].getSortModel).toHaveBeenCalled()
    expect(component['customSortChange'].emit).toHaveBeenCalledWith('')
  })


  it('searchGrid method should serach through grid',()=>{
    let mockInput = {
      el:{
        nativeElement :{
          value:'input text'
        }
      }
    }
    component.gridApi ={
      setQuickFilter :()=>{},
      rowModel:{
        rowsToDisplay:[]
      }
    }
    spyOn(component['gridApi'],'setQuickFilter');
    component.searchGrid(mockInput)
    expect(component['gridApi'].setQuickFilter).toHaveBeenCalled()
  })

  it('updatePaginationSize method should update pagination size',()=>{
    component.gridApi ={
      paginationSetPageSize :()=>{}
    }
    spyOn(component['gridApi'],'paginationSetPageSize');
    component.updatePaginationSize(10)
    expect(component['gridApi'].paginationSetPageSize).toHaveBeenCalledWith(10)
  })

  it('updatePaginationSizeApi method should call update pagination size api',()=>{
    component.gridApi ={
      paginationSetPageSize :()=>{}
    }
    component.prevPageSize =20,
    component.currentPage=10
    spyOn(component['gridApi'],'paginationSetPageSize');
    spyOn(component['currentPageChange'],'emit');
    spyOn(component['updatePageSize'],'emit');
    component.updatePaginationSizeApi(30)
    expect(component['gridApi'].paginationSetPageSize).toHaveBeenCalledWith(30)
    expect(component['currentPageChange'].emit).toHaveBeenCalledWith(6)
    expect(component['updatePageSize'].emit).toHaveBeenCalledWith(30)

  })

});
