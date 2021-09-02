import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewExceptionReportsComponent } from './view-exception-reports.component';

describe('ViewExceptionReportsComponent', () => {
  let component: ViewExceptionReportsComponent;
  let fixture: ComponentFixture<ViewExceptionReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewExceptionReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewExceptionReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
