import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarVerticalStackedComponent } from './bar-vertical-stacked.component';

describe('BarVerticalStackedComponent', () => {
  let component: BarVerticalStackedComponent;
  let fixture: ComponentFixture<BarVerticalStackedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarVerticalStackedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarVerticalStackedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
