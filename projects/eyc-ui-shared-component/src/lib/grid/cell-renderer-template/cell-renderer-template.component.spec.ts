import { async, ComponentFixture, TestBed } from '@angular/core/testing';

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
});
