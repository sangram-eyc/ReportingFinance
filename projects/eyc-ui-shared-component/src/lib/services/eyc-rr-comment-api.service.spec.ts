import { TestBed } from '@angular/core/testing';

import { EycRrCommentApiService } from './eyc-rr-comment-api.service';

describe('EycRrCommentApiService', () => {
  let service: EycRrCommentApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EycRrCommentApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
