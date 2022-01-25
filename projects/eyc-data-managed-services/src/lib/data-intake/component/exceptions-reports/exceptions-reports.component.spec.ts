import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { MotifButtonModule, MotifCardModule, MotifFormsModule, MotifIconModule, MotifModalModule, MotifPaginationModule, MotifProrgressIndicatorsModule, MotifTableModule, MotifToastModule } from '@ey-xd/ng-motif';
import { AgGridModule } from 'ag-grid-angular';
import { environment } from '../../../../../../../src/environments/environment';
import { DataManagedSettingsService } from '../../services/data-managed-settings.service';
import { DataManagedService } from '../../services/data-managed.service';
import { EycDataApiService } from '../../services/eyc-data-api.service';

import { ExceptionsReportsComponent } from './exceptions-reports.component';

describe('ExceptionsReportsComponent', () => {
  let component: ExceptionsReportsComponent;
  let fixture: ComponentFixture<ExceptionsReportsComponent>;
  let dataManagedService: DataManagedService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExceptionsReportsComponent],
      imports: [AgGridModule.withComponents([]),
        CommonModule,
        MotifCardModule,
        MotifButtonModule,
        MotifFormsModule,
        MotifIconModule,
        MotifProrgressIndicatorsModule,
        MotifTableModule,
        HttpClientModule,
        MotifPaginationModule,
        RouterTestingModule,
        HttpClientTestingModule],
      providers: [DataManagedService, DataManagedSettingsService, EycDataApiService,
        {provide:"dataManagedEndPoint",  useValue: environment.apiEndpoint},
      {provide:"dataManagedProduction",  useValue: environment.production}]
    })
      .compileComponents();
      fixture = TestBed.createComponent(ExceptionsReportsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      dataManagedService = TestBed.get(DataManagedService)
  }));


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check the service', () => {
    expect(dataManagedService instanceof DataManagedService).toBeTruthy();
  });

  it('should check exceptionReportDetails property ', () => {
    let mokckExceptionReportDetails =[
      {Fundnumber:'AECX'},
      {Fundnumber:'70Rl'},
      {Fundnumber:'AECW'},
      {Fundnumber:'AECZ'},
      {Fundnumber:'AECY'}];
    component.exceptionReportDetails= "\"[{\"fundnumber\":\"AECX\"}, {\"fundnumber\":\"70Rl\"}, {\"fundnumber\":\"AECW\"}, {\"fundnumber\":\"AECZ\"}, {\"fundnumber\":\"AECY\"}]\"";
    fixture.detectChanges();
    component.ngOnInit()
    expect(component.exceptionTableFillData).toEqual(mokckExceptionReportDetails);
  });

  it('should change letter to uppercase', () => {
    expect(component.capitalizeFirstLetter('a')).toEqual('A');
  });

  it('should update PaginationSize', () => {
   let newSize =10;
   component.updatePaginationSize(newSize);
    expect(component.noOfCompletdFilingRecords).toEqual(10);
  });

  it('should update handlePageChange', () => {
    let value =10;
    component.handlePageChange(value);
     expect(component.currentPage).toEqual(10);
   });

  it('should call getExceptionReportstable and return list of exception list', async(()=> {
    let activeFilings = [];
    fixture.detectChanges();
    const result$ = dataManagedService.getExceptionReportstable();
    result$.subscribe(resp  => {
      resp['data'].data['rowData'].forEach((item) => {
        const eachitem: any  = {
            type: item.type,
            exposure: item.exposure,
            classification: item.classification,
            category:item.category,
            value:item.value,
            variance: item.variance
        };
        activeFilings.push(eachitem);
      });
      expect(component.exceptionTableData).toEqual(activeFilings);
    })
  }));

  it('grid API is availabl `detectChanges`', () => {
    fixture.detectChanges();
    expect(component.gridApi).toBeTruthy();
  });
});

