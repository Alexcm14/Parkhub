import { Component } from '@angular/core';
 
@Component({
  selector: 'app-car',
  templateUrl: './car.page.html',
  styleUrls: ['./car.page.scss'],
})
export class CarPage {
  plaque: string = '';
  marque: string = '';
 
  vehicles: any[] = []; // Tableau pour stocker les véhicules
  
 
  ajouterVehicule() {
    // Logique pour récupérer les données du formulaire
    const nouveauVehicule = {
      plaque: this.plaque,
      marque: this.marque,
    };
 
    // Ajouter le nouveau véhicule au tableau
    this.vehicles.unshift(nouveauVehicule);
 
    // Réinitialiser les champs du formulaire
    this.plaque = '';
    this.marque = '';
  }
}