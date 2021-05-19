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

  it('report change should return tab number', () => {
    let tab = 1
    component.reportTabChange(tab)
    expect(component.tabIn).toBe(tab)
  })

});
