import { TestBed } from '@angular/core/testing';

import { VehiculeSelectionService } from './vehicule-selection.service';

describe('VehiculeSelectionService', () => {
  let service: VehiculeSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehiculeSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
