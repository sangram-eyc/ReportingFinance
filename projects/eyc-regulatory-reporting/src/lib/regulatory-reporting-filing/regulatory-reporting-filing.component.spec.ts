import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegulatoryReportingFilingComponent } from './regulatory-reporting-filing.component';

describe('RegulatoryReportingFilingComponent', () => {
  let component: RegulatoryReportingFilingComponent;
  let fixture: ComponentFixture<RegulatoryReportingFilingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegulatoryReportingFilingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegulatoryReportingFilingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
