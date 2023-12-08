// marker-details.page.ts

import { Component, Input } from '@angular/core';
import { PopoverController, AlertController } from '@ionic/angular';

import { Router } from '@angular/router';
import { NavigationExtras } from '@angular/router';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-marker-details',
  template: `

    <ion-content>
      <!-- Affichez les détails du marqueur ici -->
      <p><strong>Adresse:</strong> {{ markerData.address }}</p>
      <p><strong>Description:</strong> {{ markerData.description }}</p>
      <p><strong>Parking Type:</strong> {{ markerData.parkingType }}</p>
      <p><strong>Vehicle Type:</strong> {{ markerData.vehicleType }}</p>
      <p><strong>Prix:</strong> {{ markerData.price }} €</p>

      <!-- Ajoutez d'autres détails du marqueur selon vos besoins -->


    

    <!-- Ajouter des champs de formulaire pour l'heure de départ et la durée -->
    <ion-item>
        <ion-label position="stacked">Heure de départ</ion-label>
        <ion-input type="time" [(ngModel)]="departureTime"></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="stacked">Nombre d'heures</ion-label>
        <ion-input type="number" [(ngModel)]="numberOfHours"></ion-input>
      </ion-item>

      <!-- Bouton Réserver ou autre action -->
      <ion-button expand="full" (click)="reserve()">Réserver</ion-button>
    </ion-content>
  
  `,
})
export class MarkerDetailsPage {
  @Input() markerData: any;
  departureTime: string;
  numberOfHours: number;

  constructor(  private firestore: AngularFirestore,
    private authService: AuthService, private router: Router, private popoverController: PopoverController, private alertController: AlertController) {}

  async reserve() {
    // Vérifier si l'utilisateur a entré l'heure de départ et le nombre d'heures
    if (!this.departureTime || this.numberOfHours === undefined || this.numberOfHours < 0) {
      const alert = await this.alertController.create({
        header: 'Erreur',
        message: 'Veuillez entrer une heure de départ valide et un nombre d\'heures positif.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    // Logique pour effectuer la réservation avec l'heure de départ et la durée
    console.log('Réservation effectuée pour:', this.markerData.address);
    console.log('Heure de départ:', this.departureTime);
    console.log('Nombre d\'heures:', this.numberOfHours);

    // Ajouter les données de réservation à la sous-collection reservation_data de l'utilisateur actuel
    const userUid = 'votre_uid'; // Remplacez ceci par la logique pour récupérer l'UID de l'utilisateur actuel
    this.firestore.collection('user_data').doc(userUid).collection('reservation_data').add({
      address: this.markerData.address,
      description: this.markerData.description,
      parkingType: this.markerData.parkingType,
      vehicleType: this.markerData.vehicleType,
      price: this.markerData.price,
      departureTime: this.departureTime,
      numberOfHours: this.numberOfHours,
    });

    // Fermer le Popover après la réservation
    await this.popoverController.dismiss();
    this.router.navigate(['/tabs/tab3']);
  }
}