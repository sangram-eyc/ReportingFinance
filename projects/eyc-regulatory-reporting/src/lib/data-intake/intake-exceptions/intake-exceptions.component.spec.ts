import { IntakeExceptionsComponent } from './intake-exceptions.component'
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ElementRef, Input, Renderer2, Type } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { MotifButtonModule, MotifCardModule, MotifFormsModule, MotifIconModule, MotifPaginationModule, MotifProrgressIndicatorsModule, MotifTableModule } from '@ey-xd/ng-motif';
import { AgGridModule } from 'ag-grid-angular';
import { RowClickedEvent } from 'ag-grid-community';
import { of } from 'rxjs';
import { RegulatoryReportingFilingService } from '../../regulatory-reporting-filing/services/regulatory-reporting-filing.service';
import { IntakeLandingService } from '../services/intake-landing.service';

describe('IntakeExceptionsComponent', () => {
    let component: IntakeExceptionsComponent;
    let fixture: ComponentFixture<IntakeExceptionsComponent>;
    let regulatoryReportingFilingServiceStub = {
        getFilingData: () => {
            return { filingName: 'Form PF', period: 'Q1 2022' }
        }
    }
    let intakeLandingServiceStub = {
        getExceptionTableData :()=>{
            return of({})
        }
    }
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [IntakeExceptionsComponent],
            imports: [
                HttpClientModule,
                RouterTestingModule,
                HttpClientTestingModule,
                MatDialogModule
            ],
            providers: [
                { provide: RegulatoryReportingFilingService, useValue: regulatoryReportingFilingServiceStub },
                { provide: IntakeLandingService, useValue: intakeLandingServiceStub }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IntakeExceptionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('searchCompleted method should search', () => {
        let mockInput = {
          el: {
            nativeElement: {
              value: ''
            }
          }
        }
        component['gridApi']={
            setQuickFilter:()=>{},
            rowModel:{
                rowsToDisplay:[]
            }
        }
        component.searchCompleted(mockInput)
      })

      xit('onPasteSearchActiveReports method should search activ reports', () => {
        let mockEvent = {
          clipboardData: {
            getData: () => {}
          },
          preventDefault: () => { }
        } as any
        component.onPasteSearchActiveReports(mockEvent);
      })

      it('searchFilingValidation method should search filing validation - return false', () => {
        let mockEvent = {
          keyCode: "",
          preventDefault: () => { }
        }
        let res = component.searchFilingValidation(mockEvent)
        expect(res).toEqual(false)
      })
    
      it('searchFilingValidation method should search filing validation - return true', () => {
        let mockEvent = {
          keyCode: "abc",
          preventDefault: () => { }
        }
        let res = component.searchFilingValidation(mockEvent)
        expect(res).toEqual(false)
      })

      it('getExceptionTableData method should fetch exception table data',()=>{
        let mockResp ={
            data :[
                { exceptionId:101 }
            ]
        }
        spyOn(component['dataManagedService'],'getExceptionTableData').and.callFake(()=>{
            return of(mockResp)
        })
        component.getExceptionTableData();
        expect(component['dataManagedService'].getExceptionTableData).toHaveBeenCalled()
      })

      it('patchDatePicker method should patch date picker', () => {
        let mockDate = new Date();
        component.patchDatePicker(mockDate);
      })

      it('toggleCalendar method should toggle calender', () => {
        let mockEvent = {
          singleDate: {
            jsDate: '01/03/2002'
          }
        }
        // spyOn(component, 'getExceptionTableData');
        component.toggleCalendar(mockEvent);
        expect(component.httpDataGridParams.dueDate).toEqual('2002-01-03')
      })

      it('onRowClicked method should set data - exceptionReportDetail is null',()=>{
        let mockEvent = {
            data:{
                exceptionReportDetails:'[]',
                name:'form',
                tableName:'tableData',
                auditIngestionDate:'01-03-2022',
                auditHashId:'101',
                auditRuleTyp:'',
                exceptionReportField:{}
            }
        }
       let res= component.onRowClicked(mockEvent as RowClickedEvent);
       expect(res).toEqual(false)
      })

      it('onRowClicked method should set data - auditRuleTyp :row',()=>{
        let mockEvent = {
            data:{
                exceptionReportDetails:[],
                name:'form',
                tableName:'tableData',
                auditIngestionDate:'01-03-2022',
                auditHashId:'101',
                auditRuleTyp:'row',
                exceptionReportField:{}
            }
        }
       let res= component.onRowClicked(mockEvent as RowClickedEvent);
       expect(component['dataManagedService'].setAuditRuleType).toEqual('row')

      })

      it('onRowClicked method should set data - auditRuleTyp :file',()=>{
        let mockEvent = {
            data:{
                exceptionReportDetails:[],
                name:'form',
                tableName:'tableData',
                auditIngestionDate:'01-03-2022',
                auditHashId:'101',
                auditRuleTyp:'file',
                exceptionReportField:{}
            }
        }
       component.onRowClicked(mockEvent as RowClickedEvent);
       expect(component['dataManagedService'].setAuditRuleType).toEqual('fileOrTable')
      })

      it('onGridReady method should set grid',()=>{
        let mockParams = {
            api:{
                sizeColumnsToFit:()=>{}
            }
        }
        component['gridApi']={
            sizeColumnsToFit:()=>{}
        }
        component.onGridReady(mockParams);
      })

      it('updatePaginationSize method should update pagination size',()=>{
        component.noOfCompletdFilingRecords = 10;
        component.updatePaginationSize(20);
        expect(component.noOfCompletdFilingRecords).toEqual(20);
      })

      it('handlePageChange method should handle page chnage',()=>{

        component.handlePageChange(2);
        expect(component.currentPage).toEqual(2)
      })

      it('openComments method should open comments',()=>{
        let mockRow = {
            dataSetRuleId:'101'
        }
        component.openComments(mockRow);
        expect(component.entityId).toEqual('101')
      })

      it('addComment method should open comment modal', () => {
        let mockResult = {
          button : 'Submit',
          data :{
            assignTo:'abcd',
            comment:'',
            files:''
          }
        }
        let mockData = {
          afterClosed : ()=> of(mockResult)
        }
        spyOn(component,'commentAdded');
    
        //component.rowData = [{entityId :'101',commentsCount:0}] as any
        spyOn(component.dialog, 'open').and.returnValue(mockData as any);
        component.addComment({dataSetRuleId:'101'})
        expect(component.commentAdded).toHaveBeenCalled()
      });

      it('commentAdded method should call getExceptionTableData',()=>{
        spyOn(component,'getExceptionTableData');
        component.commentAdded();
        expect(component.getExceptionTableData).toHaveBeenCalled()
      })

      it('checkException method should check exception - return false',()=>{
        let mockParams ={
            data:{
                exceptionReportDetails:'[]'
            }
        }
       let res= component.checkException(mockParams);
        expect(res).toEqual(false)
      })

      it('checkException method should check exception - return true',()=>{
        let mockParams ={
            data:{
                exceptionReportDetails:'',
                auditRuleTyp :'row',
                auditHashId :'101'
            }
        }
       let res= component.checkException(mockParams);
        expect(res).toEqual(true)
      })

      it('ngAfterViewInit method should set dueDate',()=>{
        component.lastMonthDueDateFormat="01-02-2022"
        component.dailyMonthlyStatus = true;
        spyOn(sessionStorage,'getItem').and.returnValue('')
        component.ngAfterViewInit();
      })
      
      xit('ngAfterViewInit method should set dueDate',()=>{
        component.lastMonthDueDateFormat="01-02-2022"
        component.dailyMonthlyStatus = false;
        spyOn(sessionStorage,'getItem').and.returnValue('')
        component.ngAfterViewInit();
      })

      it('ngOnInit method should set data intake data-data provider type',()=>{
        component['routingState']={
            getPreviousUrl:()=>{
                return 'dataProvider/dataDomain'
            },
            getHistory:()=>{ 
                return ['dataProvider/dataDomain']
            }
        }as any
        component.ngOnInit();
        expect(component.previousRoute).toEqual('dataProvider/dataDomain')
        expect(component.routeHistory).toEqual(['dataProvider/dataDomain'])
      })


      it('ngOnInit method should set data intake data- files type',()=>{
        component['routingState']={
            getPreviousUrl:()=>{
                return 'files/data-intake/files/files-review'
            },
            getHistory:()=>{ 
                return ['/data-intake/files-review']
            }
        }as any
        component.ngOnInit();
        expect(component.previousRoute).toEqual('files/data-intake/files/files-review')
        expect(component.routeHistory).toEqual(['/data-intake/files-review'])
      })


      it('ngOnInit method should set data intake data- files type',()=>{
        component['routingState']={
            getPreviousUrl:()=>{
                return 'files/data-intake/files-review'
            },
            getHistory:()=>{ 
                return ['/data-intake/files-review']
            }
        }as any
        component.ngOnInit();
        expect(component.previousRoute).toEqual('files/data-intake/files-review')
        expect(component.routeHistory).toEqual(['/data-intake/files-review'])
      })

      it('ngOnInit method should set data intake data- files type',()=>{
        component['routingState']={
            getPreviousUrl:()=>{
                return 'files/data-intake/files/files-review'
            },
            getHistory:()=>{ 
                return ['/data-intake/files-review']
            }
        }as any
        component.ngOnInit();
        expect(component.previousRoute).toEqual('files/data-intake/files/files-review')
        expect(component.routeHistory).toEqual(['/data-intake/files-review'])
      })
});