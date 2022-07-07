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
  it('agInit method should set params and call onSortChanged function', () => {
    let mockParams = {
      column: {
        addEventListener: () => {},
      }
    };
    spyOn(component, 'onSortChanged');
    component.agInit(mockParams);
    expect(component.onSortChanged).toHaveBeenCalled()
  });
  it('onSortChanged method should set sort', () => {
    let mockParams = {
      column: {
        isSortAscending: () => {return true},
        isSortDescending: () => {return false},
      }
    };
    component.params = mockParams
    component.onSortChanged();
    expect(component.sorted).toEqual('asc')
  });
});
