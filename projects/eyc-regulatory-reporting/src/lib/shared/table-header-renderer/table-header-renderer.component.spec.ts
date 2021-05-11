import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableHeaderRendererComponent } from './table-header-renderer.component';

describe('TableHeaderRendererComponent', () => {
  let component: TableHeaderRendererComponent;
  let fixture: ComponentFixture<TableHeaderRendererComponent>;

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
});
