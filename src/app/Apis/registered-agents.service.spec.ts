import { TestBed } from '@angular/core/testing';

import { RegisteredAgentsService } from './registered-agents.service';

describe('RegisteredAgentsService', () => {
  let service: RegisteredAgentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisteredAgentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
