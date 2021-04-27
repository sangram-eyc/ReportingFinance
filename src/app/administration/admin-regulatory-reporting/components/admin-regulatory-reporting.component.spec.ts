import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRegulatoryReportingComponent } from './admin-regulatory-reporting.component';

describe('AdminRegulatoryReportingComponent', () => {
  let component: AdminRegulatoryReportingComponent;
  let fixture: ComponentFixture<AdminRegulatoryReportingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminRegulatoryReportingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRegulatoryReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
