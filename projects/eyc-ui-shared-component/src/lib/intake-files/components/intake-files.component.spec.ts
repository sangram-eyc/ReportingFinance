import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntakeFilesComponent } from './intake-files.component';

describe('IntakeFilesComponent', () => {
  let component: IntakeFilesComponent;
  let fixture: ComponentFixture<IntakeFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntakeFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntakeFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
