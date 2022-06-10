import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ExceptionDataGrid } from '../../../../../eyc-data-managed-services/src/lib/data-intake/models/data-grid.model';

import { TableHeaderRendererComponent } from './table-header-renderer.component';

describe('TableHeaderRendererComponent', () => {
  let component: TableHeaderRendererComponent;
  let fixture: ComponentFixture<TableHeaderRendererComponent>;
  let httpDataGridParams: ExceptionDataGrid;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableHeaderRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableHeaderRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('refresh method it should return true', () => {
    expect(component.refresh({})).toEqual(true);
  });
});
