import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilingCardComponent } from './filing-card.component';
import { RouterTestingModule } from '@angular/router/testing';
describe('FilingCardComponent', () => {
  let component: FilingCardComponent;
  let fixture: ComponentFixture<FilingCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilingCardComponent ],
      imports: [RouterTestingModule]
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
