import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { RegulatoryReportingFilingService } from '../services/regulatory-reporting-filing.service';

import { RegulatoryReportingFilingComponent } from './regulatory-reporting-filing.component';
import { of } from 'rxjs';
import { MotifButtonModule, MotifCardModule, MotifFormsModule, MotifIconModule, MotifPaginationModule, MotifProrgressIndicatorsModule, MotifTableModule } from '@ey-xd/ng-motif';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../../src/environments/environment';
import { EycRrSettingsService } from '../../services/eyc-rr-settings.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { AgGridModule } from 'ag-grid-angular';
describe('RegulatoryReportingFilingComponent', () => {
  let component: RegulatoryReportingFilingComponent;
  let fixture: ComponentFixture<RegulatoryReportingFilingComponent>;
  let filingService: RegulatoryReportingFilingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegulatoryReportingFilingComponent ],
      imports: [
        AgGridModule.withComponents([]),
        CommonModule,
        MotifCardModule,
        MotifButtonModule,
        MotifFormsModule,
        MotifIconModule,
        MotifProrgressIndicatorsModule,
        MotifTableModule,
        SlickCarouselModule,
        HttpClientModule,
        MotifPaginationModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [RegulatoryReportingFilingService,
        EycRrSettingsService,
        {provide:"apiEndpoint",  useValue: environment.apiEndpoint},
        {provide:"rrproduction",  useValue: environment.production}]
    })
    .compileComponents();
  }));

  beforeEach(inject([RegulatoryReportingFilingService], (service) => {
    filingService = service;
    fixture = TestBed.createComponent(RegulatoryReportingFilingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getFilingsData and return list of flilingsData', async(()=> {
    let activeFilings = []
    // spyOn(filingService, 'getFilings').and.returnValue(of(response))
    fixture.detectChanges();
    const result$ = filingService.getFilings();
    result$.subscribe(resp  => {
      resp['data'].forEach((item) => {
        const eachitem: any  = {
          name: item.filingName,
          dueDate: item.dueDate,
          startDate: item.startDate,
          comments: [],
          status: item.filingStatus,
          filingName: item.filingName,
          period: item.period,
          filingId: item.filingId
        };
        activeFilings.push(eachitem);
      });
      expect(component.activeFilings).toEqual(activeFilings);
    })
    
  }));
  
  // it('should check after change active fillings', ()=> {
  //   component.afterChange({"currentSlide":4})
    
  // })
});
