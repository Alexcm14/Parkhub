// marker-details.page.ts

import { Component, Input } from '@angular/core';
import { PopoverController, AlertController } from '@ionic/angular';

import { Router } from '@angular/router';
import { NavigationExtras } from '@angular/router';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { take } from 'rxjs/operators';
import firebase from 'firebase/compat/app';



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
  reservedTimes: Array<{ departureTime: string; endTime: string; }> = [];
  

  constructor(  private firestore: AngularFirestore,
    private authService: AuthService, private router: Router, private popoverController: PopoverController, private alertController: AlertController) {}

   
    ngOnInit() {
  
      this.fetchAndLockReservedHours();
      
  
      this.authService.getLoggedInUserObservable().pipe(take(1)).subscribe(user => {
        if (user) {
          // User is authenticated
          this.generateAvailableHours();
      
        } else {
          // User is not authenticated
          console.error('User is not authenticated');
          // Handle unauthenticated user scenario
        }
      });
     
    }
    fetchAndLockReservedHours() {
      const emplacementId = this.markerData.id; // The ID of the emplacement you want to check
      console.log(`Fetching reservations for emplacement ID: ${emplacementId}`);
    
      // Adjusted query to check across all users
      this.firestore.collectionGroup('reservation_data', ref => ref
        .where('isPayed', '==', true)
        .where('emplacementId', '==', emplacementId)) // Ensure matching emplacementId
        .get()
        .subscribe(querySnapshot => {
          const reservedHours = [];
          console.log(`Found ${querySnapshot.docs.length} reservation(s) for the specified emplacement.`);
    
          querySnapshot.docs.forEach(doc => {
            const reservation = doc.data();
            console.log(`Processing reservation:`, reservation);
    
            // Ensure that reservation is for the correct emplacement
            if (reservation['emplacementId'] === emplacementId) {
              const reservationStartHour = reservation['departureTime'];
              const reservationEndHour = reservation['endTime'];
              console.log(`Reservation times: Start - ${reservationStartHour}, End - ${reservationEndHour}`);
    
              let currentHour = reservationStartHour;
              while (currentHour !== reservationEndHour) {
                reservedHours.push(currentHour);
                let hourNumber = parseInt(currentHour.split(':')[0], 10);
                currentHour = `${(hourNumber + 1).toString().padStart(2, '0')}:00`;
              }
            }
          });
    
          console.log(`Reserved hours for this emplacement:`, reservedHours);
    
          // Update availableHours to exclude reserved hours
          this.availableHours = this.availableHours.filter(hour => !reservedHours.includes(hour));
          console.log(`Updated available hours:`, this.availableHours);
    
          // Manually trigger change detection if necessary
          // this.changeDetectorRef.detectChanges(); // Uncomment if you use ChangeDetectorRef
        }, error => {
          console.error('Error fetching reservations:', error);
        });
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
        console.log('Reserving with markerData:', this.markerData);
    
        // Ensure markerData includes the UID of the emplacement holder
        if (this.markerData && this.markerData.userUid && this.markerData.id) {
          // Define emplacementRef using the UID from markerData
          const emplacementRef = this.firestore
            .collection('user_data')
            .doc(this.markerData.userUid.trim()) // Use the UID from markerData and trim it
            .collection('emplacement_data')
            .doc(this.markerData.id);
    
          // Proceed with your Firestore update
          await emplacementRef.update({ isReserved: true });
    
          // Adding reservation data to the user's reservation_data collection
          const userUid = this.authService.uid || (await this.authService.getLoggedInUserObservable().pipe(take(1)).toPromise())?.uid;
        if (userUid) {
          // Create a new document reference
          const reservationRef = this.firestore.collection('user_data').doc(userUid).collection('reservation_data').doc();
          
          // Get the automatically generated ID from the DocumentReference
          const reservationId = reservationRef.ref.id;

          // Now use set() to add data to this new document
          await reservationRef.set({
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            address: this.markerData.address,
            description: this.markerData.description,
            parkingType: this.markerData.parkingType,
            vehicleType: this.markerData.vehicleType,
            price: this.markerData.price,
            departureTime: this.departureTime,
            endTime: this.endTime,
            emplacementId: this.markerData.id,
            reservationId: reservationId,

            
          });
        }


    
          // Close the Popover after reservation
          await this.popoverController.dismiss();
          this.router.navigate(['/tabs/tab3']);
        } else {
          console.error('Missing user UID or marker data ID');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }    