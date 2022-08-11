import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntakeBusinessDayComponent } from './intake-business-day.component';

describe('IntakeBusinessDayComponent', () => {
  let component: IntakeBusinessDayComponent;
  let fixture: ComponentFixture<IntakeBusinessDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntakeBusinessDayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntakeBusinessDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
