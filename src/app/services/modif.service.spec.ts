import { TestBed } from '@angular/core/testing';

import { ModifService } from './modif.service';

describe('ModifService', () => {
  let service: ModifService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModifService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
