import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DotsCardComponent } from './dots-card.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('DotsCardComponent', () => {
  let component: DotsCardComponent;
  let fixture: ComponentFixture<DotsCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DotsCardComponent ],
      imports: [RouterTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DotsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
