import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualisationModalComponent } from './visualisation-modal.component';

describe('VisualisationModalComponent', () => {
  let component: VisualisationModalComponent;
  let fixture: ComponentFixture<VisualisationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualisationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualisationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
