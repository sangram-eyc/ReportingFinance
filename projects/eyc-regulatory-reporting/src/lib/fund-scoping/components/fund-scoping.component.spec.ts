import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RegulatoryReportingFilingComponent } from '../../regulatory-reporting-filing/components/regulatory-reporting-filing.component';
import { EycRegulatoryReportingModule } from '../../eyc-regulatory-reporting.module';
import { FundScopingComponent } from './fund-scoping.component';
import { EycRrSettingsService } from '../../services/eyc-rr-settings.service';
import { environment } from '../../../../../../src/environments/environment';
import { FundScopingService } from '../services/fund-scoping.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { MotifCardModule, MotifFormsModule, MotifIconModule, MotifModalModule, MotifTableCellRendererComponent, MotifTableModule, MotifToastModule } from '@ey-xd/ng-motif';
import { TableHeaderRendererComponent } from '../../shared/table-header-renderer/table-header-renderer.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DotsCardComponent } from '../../shared/dots-card/dots-card.component';
import { RegulatoryReportingFilingService } from '../../regulatory-reporting-filing/services/regulatory-reporting-filing.service';

describe('FundScopingComponent', () => {
  let component: FundScopingComponent;
  let fixture: ComponentFixture<FundScopingComponent>;
  let fundScopingService: FundScopingService;
  let dummyFunds = [
    {
      "name": "Goldman Sachs China A-Share Equity Portfolio",
      "code": "19614011",
      "id": "PV100356"
    },
    {
      "name": "Goldman Sachs China B-Share Equity Portfolio",
      "code": "19614012",
      "id": "PV100357"
    },
    {
      "name": "Goldman Sachs China C-Share Equity Portfolio",
      "code": "19614013",
      "id": "PV100358"
    },
    {
      "name": "Goldman Sachs China D-Share Equity Portfolio",
      "code": "19614014",
      "id": "PV100359"
    },
    {
      "name": "Goldman Sachs China E-Share Equity Portfolio",
      "code": "19614015",
      "id": "PV100360"
    }
  ]

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundScopingComponent ],
      imports: [ 
        CommonModule,
        RouterTestingModule,
        HttpClientModule,
        HttpClientTestingModule,
        FormsModule,
        MotifModalModule,
        MotifFormsModule,
        MotifCardModule,
        MotifIconModule,
        MotifToastModule,
        MotifTableModule,
        AgGridModule.withComponents([])
      ],
      providers: [
        FundScopingService,
        {provide:"apiEndpoint",  useValue: environment.apiEndpoint},
        {provide:"rrproduction",  useValue: environment.production}
      ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(FundScopingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    fundScopingService = TestBed.get(FundScopingService);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check the service', () => {
    expect(fundScopingService instanceof FundScopingService).toBeTruthy();
  });

  it('should call getFilingsFunds and return list of filingsFunds', () => {
    const response = [];
    spyOn(fundScopingService, 'getFilingFunds').and.returnValue(of(response))
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.rowData).toEqual(response['data']);
  });

  it('grid API is available after `detectChanges`', () => {
    fixture.detectChanges();
    expect(component.gridApi).toBeTruthy();
  });

  it('should populate grid cells as expected', () => {
    component.funds = dummyFunds;
    component.createFundRowData();
    fixture.detectChanges();
    const hostElement = fixture.nativeElement;
    const cellElements = hostElement.querySelectorAll('.ag-cell-value');
    expect(cellElements.length).toEqual(20);
  });

  it('should search table', () => {
    component.funds = dummyFunds;
    component.createFundRowData();
    fixture.detectChanges();
    const hostElement = fixture.nativeElement;
    component.gridApi.setQuickFilter('19614013');
    const cellElements = hostElement.querySelectorAll('.ag-cell-value');
    expect(cellElements.length).toEqual(4);
  })
});
