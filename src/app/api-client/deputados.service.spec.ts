import { TestBed } from '@angular/core/testing';

import { DeputadosService } from './deputados.service';

describe('DeputadosService', () => {
  let service: DeputadosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeputadosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
