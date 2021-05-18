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
        {provide:"apiEndpoint",  useValue: environment.apiEndpoint}]
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
    let upcomingFilings = []
    // spyOn(filingService, 'getFilings').and.returnValue(of(response))
    component.getFilingsData();
    fixture.detectChanges();
    filingService.getFilings().subscribe(resp  => {
      resp['data'].forEach((item) => {
        const eachitem: any  = {
          name: item.name + ' // ' + item.period,
          dueDate: item.dueDate,
          startDate: item.startDate,
          comments: item.comments,
          status: item.status
        };
        if (eachitem.startDate !== null) {
          activeFilings.push(eachitem);
          let startD = new Date(eachitem.startDate)
          var date = new Date();
          var lastD = new Date(date.getTime() - (10 * 24 * 60 * 60 * 1000));
          if (lastD < startD){
            upcomingFilings.push(eachitem)
          }
        }
      });
      expect(component.activeFilings).toEqual(activeFilings);
      expect(component.upcomingFilings).toEqual(upcomingFilings);
    })
    
  }));
  
  // it('should check after change active fillings', ()=> {
  //   component.afterChange({"currentSlide":4})
    
  // })
});
