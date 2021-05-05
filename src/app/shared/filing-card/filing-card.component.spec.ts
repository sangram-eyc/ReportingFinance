import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilingCardComponent } from './filing-card.component';

describe('FilingCardComponent', () => {
  let component: FilingCardComponent;
  let fixture: ComponentFixture<FilingCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilingCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
