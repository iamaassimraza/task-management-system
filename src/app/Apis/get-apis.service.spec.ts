import { TestBed } from '@angular/core/testing';

import { GetApisService } from './get-apis.service';

describe('GetApisService', () => {
  let service: GetApisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetApisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
