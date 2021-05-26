import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingTabsCardComponent } from './reporting-tabs-card.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';


describe('ReportingTabsCardComponent', () => {
  let component: ReportingTabsCardComponent;
  let fixture: ComponentFixture<ReportingTabsCardComponent>;
  let router = {
    navigate: jasmine.createSpy('navigate')
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportingTabsCardComponent ],
      imports: [RouterTestingModule],
      providers: [{provide: Router, useValue: router}]
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

  it('should navigate to data-explorer', () => {
    component.dataExplorer()
    expect(router.navigate).toHaveBeenCalledWith(['/data-explorer']);
  })
});
