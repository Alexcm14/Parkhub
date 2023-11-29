// vehicle-selection.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VehicleSelectionService {
  private selectedVehicleTypesSubject = new BehaviorSubject<string[]>([]);
  selectedVehicleTypes$ = this.selectedVehicleTypesSubject.asObservable();

  setSelectedVehicleTypes(types: string[]) {
    this.selectedVehicleTypesSubject.next(types);
    console.log('Selected Vehicle Types:', types);
  }
}
