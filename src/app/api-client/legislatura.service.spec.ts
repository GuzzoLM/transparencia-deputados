import { TestBed } from '@angular/core/testing';

import { LegislaturaService } from './legislatura.service';

describe('LegislaturaService', () => {
  let service: LegislaturaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LegislaturaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
