// shared.service.ts
import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  

  
  nombrePlaces: number = 1;
  selectedTypes: string[] = [];
  typesVehicule: string[] = ["2 roues", "Citadine", "Berline", "4x4", "Pick-up", "Camionnette"];
  private cartes: any[] = [];

  // Utilise un EventEmitter pour notifier les changements aux abonnés
  formDataChanged: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ajouterCarte(carte: any) {
    this.cartes.push(carte);
  }

  getCartes() {
    return this.cartes;
  }

  setSelectedTypes(selectedTypes: string[]) {
    this.selectedTypes = selectedTypes;

    // Émet un événement pour notifier les changements
    this.formDataChanged.emit({ nombrePlaces: this.nombrePlaces, selectedTypes: this.selectedTypes });
  }

  clearFormData() {
    this.nombrePlaces = 1;
    this.selectedTypes = [];

    // Émet un événement pour notifier les changements
    this.formDataChanged.emit({ nombrePlaces: this.nombrePlaces, selectedTypes: this.selectedTypes });
  }
}
