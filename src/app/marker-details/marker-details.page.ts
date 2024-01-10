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

      <ion-item>
  <ion-label position="stacked">Jour de la réservation</ion-label>
  <ion-select placeholder="Sélectionnez un jour" [(ngModel)]="selectedDay" (ionChange)="onDayChange(selectedDay)">
  <ion-select-option *ngFor="let day of markerData.jours" [value]="day">{{ day }}</ion-select-option>
</ion-select>
</ion-item> 


    

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
  reservedHours: string[] = [];
  selectedDay: string;
  reservedHoursByDay: { [day: string]: string[] } = {};
  reservations: any[] = []; 

  

  constructor(  private firestore: AngularFirestore,
    private authService: AuthService, private router: Router, private popoverController: PopoverController, private alertController: AlertController) {}

   
    ngOnInit() {
  
      this.fetchAndLockReservedHours();

      setInterval(() => {
        this.checkReservationsAndUpdateStatus();
      }, 60000);
  
    
  
      this.authService.getLoggedInUserObservable().pipe(take(1)).subscribe(user => {
        if (user) {
          // User is authenticated
          const dayToGenerate = this.selectedDay || this.markerData.jours[0]; // Default to the first day if selectedDay is not set
          this.generateAvailableHours(dayToGenerate);
      
        } else {
          // User is not authenticated
          console.error('User is not authenticated');
          // Handle unauthenticated user scenario
        }
        
      });
      
    }
    logCurrentTime() {
      const currentDateTime = new Date().toLocaleString(); 
      console.log(`Current DateTime: ${currentDateTime}`);
    }
    getCurrentTimestamp() {
      return new Date(); // Gets the current date and time
    }
    checkReservationsAndUpdateStatus() {
      const currentTime = new Date(); // Gets the current date and time
      this.reservations.forEach(reservation => {
        const reservationEndTime = new Date(reservation.endTime);
    
        if (currentTime > reservationEndTime && !reservation.isDone) {
          this.updateReservationStatus(reservation.id, true);
        }
      });
    }
    
    updateReservationStatus(reservationId: string, isDone: boolean) {
      // Update the reservation status in Firestore
      this.firestore.collection('reservations').doc(reservationId).update({ isDone })
        .then(() => console.log(`Reservation ${reservationId} status updated to isDone: ${isDone}`))
        .catch(error => console.error('Error updating reservation status:', error));
    }
    
    fetchAndLockReservedHours() {
      const emplacementId = this.markerData.id;
      console.log(`Fetching reservations for emplacement ID: ${emplacementId}`);
    
      this.firestore.collectionGroup('reservation_data', ref => ref
        .where('isPayed', '==', true)
        .where('emplacementId', '==', emplacementId))
        .get()
        .subscribe(querySnapshot => {
          this.reservedHoursByDay = {}; // Reset the reserved hours by day
    
          querySnapshot.docs.forEach(doc => {
            const reservation = doc.data();
            const day = reservation['day']; // Fetch the 'day' field
    
            if (!this.reservedHoursByDay[day]) {
              this.reservedHoursByDay[day] = [];
            }
    
            let currentHour = reservation['departureTime'];
            const reservationEndHour = reservation['endTime'];
    
            while (currentHour !== reservationEndHour) {
              this.reservedHoursByDay[day].push(currentHour);
              let hourNumber = parseInt(currentHour.split(':')[0], 10);
              currentHour = `${(hourNumber + 1).toString().padStart(2, '0')}:00`;
            }
          });
    
          console.log(`Reserved hours by day:`, this.reservedHoursByDay);
          this.generateAvailableHours(this.selectedDay || this.markerData.jours[0]);
        }, error => {
          console.error('Error fetching reservations:', error);
        });
    }
    
    
    generateAvailableHours(selectedDay: string) {
      const startHour = parseInt(this.markerData.heureDebut.split(':')[0]);
      const endHour = parseInt(this.markerData.heureFin.split(':')[0]);
      let tempAvailableHours = [];
      let tempAvailableEndHours = [];
    
      for (let hour = startHour; hour <= endHour; hour++) {
        const formattedHour = hour.toString().padStart(2, '0') + ':00';
        tempAvailableHours.push(formattedHour);
        if (hour < endHour) {
          tempAvailableEndHours.push((hour + 1).toString().padStart(2, '0') + ':00');
        }
      }
    
      const reservedHoursForDay = this.reservedHoursByDay[selectedDay] || [];
      this.availableHours = tempAvailableHours.filter(hour => !reservedHoursForDay.includes(hour));
      this.availableEndHours = tempAvailableEndHours.filter(endHour => 
        this.availableHours.includes(`${(parseInt(endHour.split(':')[0], 10) - 1).toString().padStart(2, '0')}:00`)
      );
    
      console.log(`Updated available hours for ${selectedDay}:`, this.availableHours);
      console.log(`Updated available end hours for ${selectedDay}:`, this.availableEndHours);
    }
    
    
    
      
    onDayChange(newDay: string) {
      this.selectedDay = newDay;
      console.log(`Day changed to: ${newDay}`);
      this.generateAvailableHours(newDay);
    }
    
    onDepartureTimeChange() {
      const selectedStartHour = parseInt(this.departureTime.split(':')[0]);
      this.availableEndHours = this.availableHours.filter(hour => {
        return parseInt(hour.split(':')[0]) > selectedStartHour;
      });
    }
  
   
   
   
    async reserve() {
      // Verifying valid departure and end times
      if (!this.departureTime || !this.endTime || !this.selectedDay) {
        const alert = await this.alertController.create({
          header: 'Erreur',
          message: 'Veuillez entrer une heure de départ et une heure de fin valides.',
          buttons: ['OK'],
        });
        await alert.present();
        return;
      }
    
      // Get the current time
      const currentTime = new Date();
    
      // Convert selected start and end times to Date objects
      const selectedStartTime = new Date(currentTime.toDateString() + ' ' + this.departureTime);
      const selectedEndTime = new Date(currentTime.toDateString() + ' ' + this.endTime);
    
      // Check if the current time is greater than or equal to the selected start time
      if (currentTime >= selectedStartTime) {
        const alert = await this.alertController.create({
          header: 'Erreur',
          message: 'L\'heure de départ est déjà passée. Veuillez sélectionner une heure de départ ultérieure.',
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
              day: this.selectedDay,
              isDone: false
            });
    
            // Close the Popover after reservation
            await this.popoverController.dismiss();
            this.router.navigate(['/tabs/tab3']);
          } else {
            console.error('Missing user UID or marker data ID');
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }    