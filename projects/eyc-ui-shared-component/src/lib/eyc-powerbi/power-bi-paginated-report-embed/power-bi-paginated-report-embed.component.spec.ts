import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerBiPaginatedReportEmbedComponent } from './power-bi-paginated-report-embed.component';

describe('PowerBiPaginatedReportEmbedComponent', () => {
  let component: PowerBiPaginatedReportEmbedComponent;
  let fixture: ComponentFixture<PowerBiPaginatedReportEmbedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PowerBiPaginatedReportEmbedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PowerBiPaginatedReportEmbedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
