import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RrVisualisationComponent } from './rr-visualisation.component';

describe('RrVisualisationComponent', () => {
  let component: RrVisualisationComponent;
  let fixture: ComponentFixture<RrVisualisationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RrVisualisationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RrVisualisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
