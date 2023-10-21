import { TestBed } from '@angular/core/testing';

import { BusinessAddressService } from './business-address.service';

describe('BusinessAddressService', () => {
  let service: BusinessAddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessAddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
