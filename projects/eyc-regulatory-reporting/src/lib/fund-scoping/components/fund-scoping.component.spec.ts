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

describe('FundScopingComponent', () => {
  let component: FundScopingComponent;
  let fixture: ComponentFixture<FundScopingComponent>;
  let fundScopingService: FundScopingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundScopingComponent ],
      imports: [ 
        EycRegulatoryReportingModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [FundScopingService,
        EycRrSettingsService,
        {provide:"apiEndpoint",  useValue: environment.apiEndpoint}]
    })
    .compileComponents();
  }));

  beforeEach(inject([FundScopingService], (service) => {
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
});
