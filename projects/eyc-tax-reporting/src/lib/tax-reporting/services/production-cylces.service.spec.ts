import { TestBed } from '@angular/core/testing';

import { ProductionCylcesService } from './production-cylces.service';

describe('ProductionCylcesService', () => {
  let service: ProductionCylcesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductionCylcesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
