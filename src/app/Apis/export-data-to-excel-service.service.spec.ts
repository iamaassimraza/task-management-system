import { TestBed } from '@angular/core/testing';

import { ExportDataToExcelServiceService } from './export-data-to-excel-service.service';

describe('ExportDataToExcelServiceService', () => {
  let service: ExportDataToExcelServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportDataToExcelServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
