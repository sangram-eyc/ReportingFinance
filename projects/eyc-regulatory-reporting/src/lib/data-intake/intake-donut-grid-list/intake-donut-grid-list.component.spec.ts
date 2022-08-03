import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntakeDonutGridListComponent } from './intake-donut-grid-list.component';

describe('IntakeDonutGridListComponent', () => {
  let component: IntakeDonutGridListComponent;
  let fixture: ComponentFixture<IntakeDonutGridListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntakeDonutGridListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntakeDonutGridListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
