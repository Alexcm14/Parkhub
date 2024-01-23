// marker-details.page.ts

import { Component, Input } from '@angular/core';
import { PopoverController, AlertController } from '@ionic/angular';

import { Router } from '@angular/router';
import { NavigationExtras } from '@angular/router';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { take } from 'rxjs/operators';
import firebase from 'firebase/compat/app';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/language.service';



@Component({
  selector: 'app-marker-details',
  template: `
  <ion-content style="padding: 20px; max-width: 600px; margin: auto; font-family: Arial, sans-serif;">
  <img [src]="markerData.Photos" alt="{{ 'Image de l\'emplacement' | translate }}">
  <p style="font-size: 13px; color: #333; margin-bottom: 12px;">
    <strong style="color: #46d1c8;"><ion-icon name="location"></ion-icon> {{ 'Adresse' | translate }}:</strong> {{ markerData.address }} - {{ markerData.parkingType }}
  </p>
  <p style="font-size: 13px; color: #333; margin-bottom: 12px;">
    <strong style="color: #46d1c8;"><ion-icon name="pencil"></ion-icon> {{ 'Description' | translate }}:</strong> {{ markerData.description }}
  </p>
  
  <p style="font-size: 13px; color: #333; margin-bottom: 12px;">
    <strong style="color: #46d1c8;"><ion-icon name="car"></ion-icon> {{ 'Autorisé aux' | translate }}:</strong> {{ markerData.vehicleType }}
  </p>
  
  <p style="font-size: 13px; color: #333; margin-bottom: 12px;">
    <strong style="color: #46d1c8;"><ion-icon name="card"></ion-icon> {{ 'Prix' | translate }}:</strong> {{ (markerData.price * 1.21).toFixed(2) }} € TVAC
  </p>

  <ion-item style="margin-bottom: 8px;">
    <ion-label position="stacked" style="color: #32a39b;"><ion-icon name="calendar-number"></ion-icon> {{ 'Jour de la réservation' | translate }}</ion-label>
    <ion-select placeholder="{{ 'Sélectionnez un jour' | translate }}" [(ngModel)]="selectedDay" (ionChange)="onDayChange(selectedDay)" style="font-size: 13px;">
      <ion-select-option *ngFor="let day of markerData.jours" [value]="day">{{ day }}</ion-select-option>
    </ion-select>
  </ion-item>

  <ion-item style="margin-bottom: 8px;">
    <ion-label position="stacked" style="color: #32a39b;"><ion-icon name="time"></ion-icon> {{ 'Heure de départ' | translate }}</ion-label>
    <ion-select placeholder=" " [(ngModel)]="departureTime" (ionChange)="handleDepartureTimeChange(departureTime)" style="font-size: 13px;">
      <ion-select-option *ngFor="let hour of availableHours" [value]="hour">{{ hour }}</ion-select-option>
    </ion-select>
  </ion-item>

  <ion-item style="margin-bottom: 8px;">
    <ion-label position="stacked" style="color: #32a39b;"><ion-icon name="time"></ion-icon> {{ 'Heure de fin' | translate }}</ion-label>
    <ion-select placeholder=" " [(ngModel)]="endTime" style="font-size: 13px;">
      <ion-select-option *ngFor="let hour of availableEndHours" [value]="hour">{{ hour }}</ion-select-option>
    </ion-select>
  </ion-item>

  <ion-button (click)="reserve()" style="font-size: 16px; height: 50px; --background: #46d1c8; margin-top: 10px; display: flex; text-align : center; justify-content: center; margin-bottom: 20px; ">{{ 'Réserver' | translate }}</ion-button>
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
  reservations: any;
  daysOfWeek = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  selectedLanguage: string = 'fr';

  constructor(  private languageService: LanguageService,  private translateService: TranslateService,
    private firestore: AngularFirestore,
    private authService: AuthService, private router: Router, private popoverController: PopoverController, private alertController: AlertController) {}

   
    ngOnInit() {
      this.languageService.selectedLanguage$.subscribe((language) => {
        this.selectedLanguage = language;
        this.translateService.use(language);
      });

      console.log('Component initialized');
      this.logCurrentDateTime();
  
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

    logCurrentDateTime() {
      const now = new Date();
      const daysOfWeek = [ 'dimanche','lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
      const dayOfWeek = daysOfWeek[now.getDay()];
      const formattedDate = now.toLocaleDateString();
      const formattedTime = now.toLocaleTimeString();
  
      console.log(`Current Date: ${formattedDate}`);
      console.log(`Day of the Week: ${dayOfWeek}`);
      console.log(`Current Time: ${formattedTime}`);
    }

    onDayChange(newDay: string) {
      const currentDate = new Date();
      const currentDayIndex = currentDate.getDay();
      const selectedDayIndex = this.daysOfWeek.indexOf(newDay);
    
      if (selectedDayIndex < currentDayIndex || 
          (selectedDayIndex === currentDayIndex && currentDate.getHours() >= parseInt(this.markerData.heureFin.split(':')[0]))) {
        this.alertController.create({
          header: 'Erreur',
          message: 'Le jour sélectionné ne peut pas être avant le jour actuel.',
          buttons: ['OK']
        }).then(alert => alert.present());
        return;
      }
    
      this.selectedDay = newDay;
      console.log(`Day changed to: ${newDay}`);
      this.generateAvailableHours(newDay);
    }
  
    changeLanguage() {
      this.languageService.setLanguage(this.selectedLanguage);
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
    
    
    handleDepartureTimeChange(selectedTime: string) {
      const currentDateTime = new Date();
      const currentDayOfWeek = this.daysOfWeek[currentDateTime.getDay()];
      
      if (this.selectedDay === currentDayOfWeek) {
        const selectedTimestamp = this.convertSelectedTimeToTimestamp(selectedTime);
    
        if (selectedTimestamp < currentDateTime.getTime()) {
          // L'heure sélectionnée est déjà passée pour le jour actuel
          console.error('L\'heure de départ choisie est déjà passée pour aujourd\'hui.');
          this.alertController.create({
            header: 'Erreur',
            message: 'L\'heure de départ choisie est déjà passée pour aujourd\'hui.',
            buttons: ['OK']
          }).then(alert => alert.present());
          this.departureTime = ''; // Réinitialiser l'heure de départ
        } else {
          console.log(`Heure sélectionnée pour aujourd'hui : ${selectedTime}, Timestamp : ${selectedTimestamp}`);
        }
      } else {
        // Si le jour sélectionné n'est pas aujourd'hui, continuez normalement
        console.log(`Heure sélectionnée pour ${this.selectedDay} : ${selectedTime}, Timestamp : ${this.convertSelectedTimeToTimestamp(selectedTime)}`);
      }
    }
    
    
    convertSelectedTimeToTimestamp(selectedTime: string): number {
      const currentTime = new Date();
      const [selectedHour, selectedMinute] = selectedTime.split(':').map(Number);
      currentTime.setHours(selectedHour, selectedMinute, 0, 0);
      return currentTime.getTime();
    }
    
    


    onDepartureTimeChange() {
    
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

      const reservationDate = this.getNextOccurrenceOfDay(this.selectedDay);


      
    
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
            reservationDate: reservationDate,
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
            isDone: false,
            isPayed:false,
            isCancelled:false,
            Photos: this.markerData.Photos,
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

    getNextOccurrenceOfDay(dayName) {
      const daysOfWeek = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
      const currentDayIndex = new Date().getDay();
      const selectedDayIndex = daysOfWeek.indexOf(dayName);
    
      const currentDate = new Date();
      if (currentDayIndex === selectedDayIndex) {
        // If the selected day is today, return today's date
        return currentDate;
      } else {
        // Calculate the number of days until the next occurrence
        let daysUntilNextOccurrence = selectedDayIndex - currentDayIndex;
        if (daysUntilNextOccurrence < 0) {
          daysUntilNextOccurrence += 7; // Adjust for the next week
        }
    
        const nextOccurrenceDate = new Date();
        nextOccurrenceDate.setDate(currentDate.getDate() + daysUntilNextOccurrence);
    
        return nextOccurrenceDate;
      }
    }
  }    