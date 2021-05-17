import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingTabsCardComponent } from './reporting-tabs-card.component';

describe('ReportingTabsCardComponent', () => {
  let component: ReportingTabsCardComponent;
  let fixture: ComponentFixture<ReportingTabsCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportingTabsCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportingTabsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
