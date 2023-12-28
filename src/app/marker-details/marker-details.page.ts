// marker-details.page.ts

import { Component, Input } from '@angular/core';
import { PopoverController, AlertController } from '@ionic/angular';

import { Router } from '@angular/router';
import { NavigationExtras } from '@angular/router';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { take } from 'rxjs/operators';



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

      <p><strong>Jours Disponibles:</strong> {{ markerData.jours.join(', ') }}</p>
      <p><strong>Heure de Début:</strong> {{ markerData.heureDebut }}</p>
      <p><strong>Heure de Fin:</strong> {{ markerData.heureFin }}</p>

      <!-- Ajoutez d'autres détails du marqueur selon vos besoins -->


    

    <!-- Ajouter des champs de formulaire pour l'heure de départ et la durée -->
    <ion-item>
  <ion-label position="stacked">Heure de départ</ion-label>
  <ion-select placeholder="Sélectionnez l'heure de départ" [(ngModel)]="departureTime">
    <ion-select-option *ngFor="let hour of availableHours" [value]="hour">{{ hour }}</ion-select-option>
  </ion-select>
</ion-item>

<ion-item>
  <ion-label position="stacked">Heure de fin</ion-label>
  <ion-select placeholder="Sélectionnez l'heure de fin" [(ngModel)]="endTime">
    <ion-select-option *ngFor="let hour of availableEndHours" [value]="hour">{{ hour }}</ion-select-option>
  </ion-select>
</ion-item>

      <!-- Bouton Réserver ou autre action -->
      <ion-button expand="full" (click)="reserve()">Réserver</ion-button>
    </ion-content>
  
  `,
})
export class MarkerDetailsPage {
  @Input() markerData: any;
  availableHours: string[] = [];
  departureTime: string;
  numberOfHours: number;
  endTime: string;
  availableEndHours: string[] = [];
  

  constructor(  private firestore: AngularFirestore,
    private authService: AuthService, private router: Router, private popoverController: PopoverController, private alertController: AlertController) {}

   
    ngOnInit() {
      this.generateAvailableHours();
     
    }

    generateAvailableHours() {
      const startHour = parseInt(this.markerData.heureDebut.split(':')[0]);
      const endHour = parseInt(this.markerData.heureFin.split(':')[0]);
      this.availableHours = [];
      this.availableEndHours = [];
    
      for (let hour = startHour; hour <= endHour; hour++) {
        const formattedHour = hour.toString().padStart(2, '0') + ':00';
        this.availableHours.push(formattedHour);
        if (hour < endHour) { // L'heure de fin doit être après l'heure de début
          this.availableEndHours.push((hour + 1).toString().padStart(2, '0') + ':00');
        }
      }
    }

    onDepartureTimeChange() {
      const selectedStartHour = parseInt(this.departureTime.split(':')[0]);
      this.availableEndHours = this.availableHours.filter(hour => {
        return parseInt(hour.split(':')[0]) > selectedStartHour;
      });
    }
  
   
   
   
    async reserve() {
      // Verifying valid departure and end times
      if (!this.departureTime || !this.endTime) {
        const alert = await this.alertController.create({
          header: 'Erreur',
          message: 'Veuillez entrer une heure de départ et une heure de fin valides.',
          buttons: ['OK'],
        });
        await alert.present();
        return;
      }
    
      try {
        const user = await this.authService.getLoggedInUserObservable();
    
        if (user) {
          const userUid = this.authService.uid || (await this.authService.getLoggedInUserObservable().pipe(take(1)).toPromise())?.uid;
    
          if (userUid) {
            if (this.markerData && this.markerData.price !== undefined) {
              // Update the isReserved property in the emplacement_data collection
              const emplacementRef = this.firestore.collection('emplacement_data').doc(this.markerData.id); // Accessing the specific document using markerData.id
    
              // Updating the isReserved property to true
              await emplacementRef.update({ isReserved: true });
    
              // Adding reservation data to the user's reservation_data collection
              await this.firestore.collection('user_data').doc(userUid).collection('reservation_data').add({
                address: this.markerData.address,
                description: this.markerData.description,
                parkingType: this.markerData.parkingType,
                vehicleType: this.markerData.vehicleType,
                price: this.markerData.price,
                departureTime: this.departureTime,
                endTime: this.endTime,
                emplacementId: this.markerData.id, // Storing the emplacement ID for reference
              });
    
              // Close the Popover after reservation
              await this.popoverController.dismiss();
              this.router.navigate(['/tabs/tab3']);
            } else {
              console.error('Invalid value for price');
            }
          } else {
            console.error('User is not logged in.');
          }
        }
      } catch (error) {
        console.error('Error getting current user:', error);
      }
    }
  }