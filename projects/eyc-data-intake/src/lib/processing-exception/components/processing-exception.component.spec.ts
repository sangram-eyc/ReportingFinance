import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessingExceptionComponent } from './processing-exception.component';

describe('ProcessingExceptionComponent', () => {
  let component: ProcessingExceptionComponent;
  let fixture: ComponentFixture<ProcessingExceptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessingExceptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessingExceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
