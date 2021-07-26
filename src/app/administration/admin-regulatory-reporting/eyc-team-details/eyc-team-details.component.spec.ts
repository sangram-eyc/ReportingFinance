import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EycTeamDetailsComponent } from './eyc-team-details.component';

describe('EycTeamDetailsComponent', () => {
  let component: EycTeamDetailsComponent;
  let fixture: ComponentFixture<EycTeamDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EycTeamDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EycTeamDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
