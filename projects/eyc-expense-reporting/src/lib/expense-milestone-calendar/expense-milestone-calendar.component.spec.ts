import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseMilestoneCalendarComponent } from './expense-milestone-calendar.component';

describe('ExpenseMilestoneCalendarComponent', () => {
  let component: ExpenseMilestoneCalendarComponent;
  let fixture: ComponentFixture<ExpenseMilestoneCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseMilestoneCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseMilestoneCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
