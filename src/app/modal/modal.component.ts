// modal.component.ts

import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';


@Component({
  selector: 'app-modal',
  templateUrl: 'modal.component.html',
  styleUrls: ['modal.component.scss'],
})
export class ModalComponent {
  startHour: string = '';
  durationHours: number = 1; // Durée par défaut en heures
  endHour: string = '';
  fixedPrice: number = 10; // Prix fixe

  constructor(private modalController: ModalController,  private router: Router,
    private dataService: DataService) {}

  closeModal() {
    this.modalController.dismiss();
  }

  calculateEndTime() {
    if (this.startHour) {
      const startDate = new Date(`2000-01-01T${this.startHour}`);
      
      // Calculer l'heure de fin en ajoutant la durée à l'heure de début
      const endTime = new Date(startDate.getTime() + this.durationHours * 60 * 60 * 1000);

      // Formater l'heure de fin comme une chaîne HH:mm
      const endHour = endTime.toTimeString().split(' ')[0].substring(0, 5);
      this.endHour = endHour;
    }
  }

  calculateFinalPrice(): number {
    const pricePerHour = 10; // Remplacez par votre prix par heure
    return this.durationHours * pricePerHour;
  }

  reserve() {
    // Insérer votre logique de réservation ici
    console.log(`Heure de début: ${this.startHour}`);
    console.log(`Durée en heures: ${this.durationHours}`);
    console.log(`Heure de fin: ${this.endHour}`);
    console.log(`Prix Final: ${this.calculateFinalPrice()}€`);

    const cardData = {
      title: 'Carrefour Market',
      endHour: this.endHour,
      finalPrice: this.calculateFinalPrice(),
    };
    
    // Partager les données via le service
    this.dataService.setCardData(cardData);

    this.closeModal();

    // Rediriger vers la page tab3
    this.router.navigate(['tabs/tab3']);
  }
}
