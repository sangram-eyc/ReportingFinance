import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsPreferencesComponent } from './notifications-preferences.component';

describe('NotificationsPreferencesComponent', () => {
  let component: NotificationsPreferencesComponent;
  let fixture: ComponentFixture<NotificationsPreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationsPreferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
