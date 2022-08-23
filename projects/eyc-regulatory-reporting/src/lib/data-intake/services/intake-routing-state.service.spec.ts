import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { EycRrApiService } from '../../services/eyc-rr-api.service';
import { EycRrSettingsService } from '../../services/eyc-rr-settings.service';

import { IntakeRoutingStateService } from './intake-routing-state.service'

describe('RoutingStateService', () => {
  let service: IntakeRoutingStateService;

  let eycRrSettingsServiceStub = {};
  let eycRrApiServiceStub = {};
  let intakeRoutingStateServiceStub = {};
  let routerStub = {}

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [
        { provide: EycRrSettingsService, useValue: eycRrSettingsServiceStub },
        { provide: EycRrApiService, useValue: eycRrApiServiceStub },
        { provide: IntakeRoutingStateService, useValue:intakeRoutingStateServiceStub},
        { provide: Router, useValue:routerStub}]
    });
    service = TestBed.inject(IntakeRoutingStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});
