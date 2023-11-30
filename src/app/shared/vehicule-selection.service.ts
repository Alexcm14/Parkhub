// vehicule-selection.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleSelectionService {

  private selectedVehicleTypesSubject = new BehaviorSubject<string[]>([]);
  selectedVehicleTypes$ = this.selectedVehicleTypesSubject.asObservable();

  private selectedParkingTypeSubject = new BehaviorSubject<string | null>(null);
  selectedParkingType$ = this.selectedParkingTypeSubject.asObservable();

  private selectedParkingAddressSubject = new BehaviorSubject<string | null>(null);
  selectedParkingAddress$ = this.selectedParkingAddressSubject.asObservable();

  private numberOfPlacesSubject = new BehaviorSubject<number>(1);
  numberOfPlaces$ = this.numberOfPlacesSubject.asObservable();

  private selectedDescriptionSubject = new BehaviorSubject<string>('');
  selectedDescription$ = this.selectedDescriptionSubject.asObservable();

  private selectedPhotosSubject = new BehaviorSubject<string[]>([]);
  selectedPhotos$ = this.selectedPhotosSubject.asObservable();



  updateSelectedVehicleTypes(selectedTypes: string[]) {
    this.selectedVehicleTypesSubject.next(selectedTypes);
  }

  updateSelectedParkingType(selectedType: string | null) {
    this.selectedParkingTypeSubject.next(selectedType);
  }

  updateParkingAddress(selectedAddress: string | null) {
    this.selectedParkingAddressSubject.next(selectedAddress);
  }

  updateNumberOfPlaces(newNumberOfPlaces: number) {
    this.numberOfPlacesSubject.next(newNumberOfPlaces);
  }
  setSelectedDescription(description: string): void {
    this.selectedDescriptionSubject.next(description);
  }

  setSelectedPhotos(photos: string[]) {
    this.selectedPhotosSubject.next(photos);
  }

  updateSelectedPhotos(photos: string[]) {
    this.selectedPhotosSubject.next(photos);
  }
  
  
  getSelectedPhotos(): string[] {
    return this.selectedPhotosSubject.getValue();
  }
}
