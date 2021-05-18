import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientReviewComponent } from './client-review.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EycRrSettingsService } from '../../services/eyc-rr-settings.service';
import { environment } from '../../../../../../src/environments/environment';
import { ClientReviewService } from '../services/client-review.service';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { MotifCardModule, MotifButtonModule, MotifFormsModule, MotifIconModule, MotifProrgressIndicatorsModule, MotifTableModule, MotifPaginationModule } from '@ey-xd/ng-motif';
import { AgGridModule } from 'ag-grid-angular';
import { SlickCarouselModule } from 'ngx-slick-carousel';
describe('ClientReviewComponent', () => {
  let component: ClientReviewComponent;
  let fixture: ComponentFixture<ClientReviewComponent>;
  let testBedService: ClientReviewService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientReviewComponent ],
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
      providers: [
        ClientReviewService,
        {provide:"apiEndpoint",  useValue: environment.apiEndpoint},
        
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    testBedService = TestBed.get(ClientReviewService)
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check the service', () => {
    expect(testBedService instanceof ClientReviewService).toBeTruthy();
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
