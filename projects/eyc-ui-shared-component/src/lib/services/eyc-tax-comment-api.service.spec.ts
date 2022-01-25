import { TestBed } from '@angular/core/testing';

import { EycTaxCommentApiService } from './eyc-tax-comment-api.service';

describe('EycTaxCommentApiService', () => {
  let service: EycTaxCommentApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EycTaxCommentApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
