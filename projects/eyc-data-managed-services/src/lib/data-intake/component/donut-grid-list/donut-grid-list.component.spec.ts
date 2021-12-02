import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonutGridListComponent } from './donut-grid-list.component';

describe('DonutGridListComponent', () => {
  let component: DonutGridListComponent;
  let fixture: ComponentFixture<DonutGridListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonutGridListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonutGridListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
