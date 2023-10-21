import { TestBed } from '@angular/core/testing';

import { ComissionAgentsService } from './comission-agents.service';

describe('ComissionAgentsService', () => {
  let service: ComissionAgentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComissionAgentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
