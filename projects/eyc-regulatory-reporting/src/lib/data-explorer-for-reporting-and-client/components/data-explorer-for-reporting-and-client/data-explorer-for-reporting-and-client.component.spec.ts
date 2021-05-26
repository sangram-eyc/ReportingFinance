import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataExplorerForReportingAndClientComponent } from './data-explorer-for-reporting-and-client.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';


describe('DataExplorerForReportingAndClientComponent', () => {
  let component: DataExplorerForReportingAndClientComponent;
  let fixture: ComponentFixture<DataExplorerForReportingAndClientComponent>;
  let router = {
    navigate: jasmine.createSpy('navigate')
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataExplorerForReportingAndClientComponent ],
      imports: [RouterTestingModule],
      providers: [{provide: Router, useValue: router}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataExplorerForReportingAndClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('removeFilingChip should assign empty string to selectedFiling', ()=> {
    component.removeFilingChip();
    expect(component.selectedFiling).toBe("");
  });

  it('filingModelChanged should assign value to selectedFiling', () => {
    let event = "CPO-PQR";
    component.filingModelChanged(event);
    expect(component.selectedFiling).toBe(event);
  });

  it('removePeriodChip should assign empty string to selectedPeriod ', ()=> {
    component.removePeriodChip();
    expect(component.selectedPeriod).toBe("");
  });

  it('periodModelChanged should assign value to selectedPeriod', () => {
    let event = "Q4 2020";
    component.periodModelChanged(event);
    expect(component.selectedPeriod).toBe(event);
  });

  it('should navigate back to regulatory-reporting or client-review', () => {
    component.back()
    expect(router.navigate).toHaveBeenCalledWith(['/regulatory-reporting']);
  })
});
