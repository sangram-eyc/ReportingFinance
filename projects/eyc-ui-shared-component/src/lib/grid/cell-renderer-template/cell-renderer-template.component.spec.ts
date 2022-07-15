import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ICellRenderer, ICellRendererParams } from 'ag-grid-community';

import { CellRendererTemplateComponent } from './cell-renderer-template.component';

describe('CellRendererTemplateComponent', () => {
  let component: CellRendererTemplateComponent;
  let fixture: ComponentFixture<CellRendererTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CellRendererTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CellRendererTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('agInit method should set template and call  refresh method',()=>{
    let mockParams = {
      ngTemplate:{}
    } as any;
    spyOn(component,'refresh');
    component.agInit(mockParams);
    expect(component.refresh).toHaveBeenCalledWith(mockParams)
  })
  it('refresh method should set templateContext',()=>{
    let mockParams = {
      ngTemplate:{}
    } as any;
    let res=component.refresh(mockParams);
    expect(res).toEqual(true)
  })
});
