import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataIntakeLandingComponent } from './data-intake-landing.component';

describe('DataIntakeLandingComponent', () => {
  let component: DataIntakeLandingComponent;
  let fixture: ComponentFixture<DataIntakeLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataIntakeLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataIntakeLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
