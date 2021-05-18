import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MotifCardModule, MotifButtonModule, MotifFormsModule, MotifIconModule, MotifProrgressIndicatorsModule, MotifTableModule, MotifPaginationModule } from '@ey-xd/ng-motif';
import { AgGridModule } from 'ag-grid-angular';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { environment } from '../../../../../../src/environments/environment';
import { RegulatoryReportingFilingService } from '../../regulatory-reporting-filing/services/regulatory-reporting-filing.service';

import { RrReportingComponent } from './rr-reporting.component';
import { DotsCardComponent } from '../../shared/dots-card/dots-card.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { RrReportingService } from '../services/rr-reporting.service';

describe('RrReportingComponent', () => {
  let component: RrReportingComponent;
  let fixture: ComponentFixture<RrReportingComponent>;
  let testBedService: RrReportingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RrReportingComponent, DotsCardComponent],
      imports: [AgGridModule.withComponents([]),
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
        HttpClientTestingModule],
      providers: [RrReportingService,
        { provide: "apiEndpoint", useValue: environment.apiEndpoint }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RrReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    testBedService = TestBed.get(RrReportingService)
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check the service', () => {
    expect(testBedService instanceof RrReportingService).toBeTruthy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('The function onRowSelected ...', () => {
    it(`- should do something`, () => {
      component.onRowSelected({ name: 'Mock Hero' });
      expect(component).toBeTruthy();
    });
  });

  it('should get filling entities list', () => {
    const response = [];
    spyOn(testBedService, 'getfilingEntities').and.returnValue(of(response))
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.rowData).toEqual(response['data']);
  });

  it('receiveMessage should return tab number', () => {
    let tab = 1
    component.receiveMessage(tab)
    expect(component.tabs).toBe(tab)
  })
});
