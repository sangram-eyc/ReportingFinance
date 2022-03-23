import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseTaskVisibilityComponent } from './expense-task-visibility.component';

describe('ExpenseTaskVisibilityComponent', () => {
  let component: ExpenseTaskVisibilityComponent;
  let fixture: ComponentFixture<ExpenseTaskVisibilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseTaskVisibilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseTaskVisibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
