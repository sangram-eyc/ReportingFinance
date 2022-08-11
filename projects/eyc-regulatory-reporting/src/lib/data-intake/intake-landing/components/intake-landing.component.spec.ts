import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntakeLandingComponent } from './intake-landing.component';

describe('IntakeLandingComponent', () => {
  let component: IntakeLandingComponent;
  let fixture: ComponentFixture<IntakeLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntakeLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntakeLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
