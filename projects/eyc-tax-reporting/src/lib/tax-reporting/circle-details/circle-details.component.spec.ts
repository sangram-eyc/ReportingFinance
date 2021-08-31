import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CircleDetailComponent } from './circle-details.component';

describe('EycTeamDetailsComponent', () => {
  let component: CircleDetailComponent;
  let fixture: ComponentFixture<CircleDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CircleDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CircleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
