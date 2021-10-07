import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataIntakeComponent } from './data-intake.component';

describe('DataIntakeComponent', () => {
  let component: DataIntakeComponent;
  let fixture: ComponentFixture<DataIntakeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataIntakeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataIntakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
