import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EycExpenseReportingComponent } from './eyc-expense-reporting.component';

describe('EycExpenseReportingComponent', () => {
  let component: EycExpenseReportingComponent;
  let fixture: ComponentFixture<EycExpenseReportingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EycExpenseReportingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EycExpenseReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
