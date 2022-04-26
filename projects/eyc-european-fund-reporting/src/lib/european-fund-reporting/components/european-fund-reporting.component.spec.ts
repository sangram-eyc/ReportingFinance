import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EuropeanFundReportingComponent } from './european-fund-reporting.component';

describe('EuropeanFundReportingComponent', () => {
  let component: EuropeanFundReportingComponent;
  let fixture: ComponentFixture<EuropeanFundReportingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EuropeanFundReportingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EuropeanFundReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
