import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataExplorerForReportingAndClientComponent } from './data-explorer-for-reporting-and-client.component';

describe('DataExplorerForReportingAndClientComponent', () => {
  let component: DataExplorerForReportingAndClientComponent;
  let fixture: ComponentFixture<DataExplorerForReportingAndClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataExplorerForReportingAndClientComponent ]
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
});
