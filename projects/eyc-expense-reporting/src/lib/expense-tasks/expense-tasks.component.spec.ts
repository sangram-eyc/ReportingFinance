import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseTasksComponent } from './expense-tasks.component';

describe('ExpenseTasksComponent', () => {
  let component: ExpenseTasksComponent;
  let fixture: ComponentFixture<ExpenseTasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseTasksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
