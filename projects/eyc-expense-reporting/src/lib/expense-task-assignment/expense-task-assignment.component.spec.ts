import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseTaskAssignmentComponent } from './expense-task-assignment.component';

describe('ExpenseTaskAssignmentComponent', () => {
  let component: ExpenseTaskAssignmentComponent;
  let fixture: ComponentFixture<ExpenseTaskAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseTaskAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseTaskAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
