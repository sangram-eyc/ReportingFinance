import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { RegulatoryReportingFilingService } from '../../regulatory-reporting-filing/services/regulatory-reporting-filing.service';
import { IntakeLandingService } from '../services/intake-landing.service';
import { IntakeRoutingStateService } from '../services/intake-routing-state.service';
import { IntakeExceptionsReportsComponent } from './intake-exceptions-reports.component';

describe('IntakeExceptionsReportsComponent', () => {
    let component: IntakeExceptionsReportsComponent;
    let fixture: ComponentFixture<IntakeExceptionsReportsComponent>;
    let regulatoryReportingFilingServiceStub = {
        getFilingData: () => {
            return { filingName: 'Form PF', period: 'Q1 2022' }
        }
    }
    let intakeLandingServiceStub = {
        getExceptionTableData: () => {
            return of({})
        },
        getExceptionDetailsTableData:()=>{
            return of({})
        }
    }

    let intakeRoutingStateServiceStub = {
        getPreviousUrl: () => {
            return '/data-intake/files-review'
        },
        getHistory: () => {
            return ['/data-intake/files-review']
        }
    }
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [IntakeExceptionsReportsComponent],
            imports: [
                HttpClientModule,
                RouterTestingModule,
                HttpClientTestingModule,
                MatDialogModule
            ],
            providers: [
                { provide: RegulatoryReportingFilingService, useValue: regulatoryReportingFilingServiceStub },
                { provide: IntakeLandingService, useValue: intakeLandingServiceStub },
                { provide: IntakeRoutingStateService, useValue: intakeRoutingStateServiceStub }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IntakeExceptionsReportsComponent);
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
        component['gridApi'] = {
            setQuickFilter: () => { },
            refreshCells: () => { },
            rowModel: {
                rowsToDisplay: []
            }
        }
        component.searchCompleted(mockInput)
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

      it('updatePaginationSize method should update pagination size',()=>{
        component.noOfCompletdFilingRecords = 10;
        component.updatePaginationSize(20);
        expect(component.noOfCompletdFilingRecords).toEqual(20);
      })

      it('handlePageChange method should handle page chnage',()=>{

        component.handlePageChange(2);
        expect(component.currentPage).toEqual(2)
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

      it('capitalizeFirstLetter method should capitalize first letter',()=>{
        let res=component.capitalizeFirstLetter('nitin');
        expect(res).toEqual('Nitin');
      })

      it('ngAfterViewInit method should set data for  - row',()=>{
        component.auditRuleType='row';
        let mockResp ={
            data:[
            { exceptionId:'101',exceptionName:'Form'}
        ]}
        spyOn(component['dataManagedService'],'getExceptionDetailsTableData').and.callFake(()=>{
            return of(mockResp)
        })
        component.ngAfterViewInit();
        expect(component['dataManagedService'].getExceptionDetailsTableData).toHaveBeenCalled()
      })

      it('ngAfterViewInit method should set data for  - fileOrTable',()=>{
        component.exceptionTableFillData = [
            {id:'23',datasetId:'234'}
        ] as any
        component.auditRuleType='fileOrTable';
        component.headerColumnName=['id','datasetId'] as any
        component.ngAfterViewInit();
      })

      it('ngOnInit method should set fileName',()=>{
        component['routingState'] ={
            getPreviousUrl: () => {
                return '/dataProvider/files-review'
            },
            getHistory: () => {
                return ['/dataProvider/data-intake/files-review']
            }
        }as any;
        component.exceptionReportDetails="no exception : found"
        component.auditRuleType='fileOrTable';
        component.ngOnInit();
      })

      it('onSortChanged method should call refreshCells',()=>{
        component['gridApi']={
            refreshCells:()=>{}
        }

        component.onSortChanged({})
        expect(component['gridApi'].refreshCells).toHaveBeenCalled();
      })
});