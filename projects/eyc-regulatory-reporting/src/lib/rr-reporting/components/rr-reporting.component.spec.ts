import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RrReportingComponent } from './rr-reporting.component';

describe('RrReportingComponent', () => {
  let component: RrReportingComponent;
  let fixture: ComponentFixture<RrReportingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RrReportingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RrReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
