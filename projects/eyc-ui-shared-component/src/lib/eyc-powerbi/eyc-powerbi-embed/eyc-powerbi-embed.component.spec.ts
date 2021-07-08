import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EycPowerbiEmbedComponent } from './eyc-powerbi-embed.component';

describe('EycPowerbiEmbedComponent', () => {
  let component: EycPowerbiEmbedComponent;
  let fixture: ComponentFixture<EycPowerbiEmbedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EycPowerbiEmbedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EycPowerbiEmbedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
