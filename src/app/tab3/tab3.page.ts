import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { map, switchMap, take } from 'rxjs/operators';
import { Observable, from, of } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { Pipe, PipeTransform } from '@angular/core';
import { NgModule } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { interval, Subscription, } from 'rxjs';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/language.service';
import { LoadingController } from '@ionic/angular';




@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  emplacements: Observable<any[]>;
  selectedLanguage: string = 'fr';
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  telephone: string;
  
  reservations: any[] = [];
  reservationData: any[] = [];
  vehicles: any[] = [];
  selectedCar: any; // Ajoutez cette propriété dans votre composant
  timerSubscription: Subscription;
  


  constructor(
    
    private cdr: ChangeDetectorRef,
    private alertController: AlertController,
    private modalController: ModalController,
    private authService: AuthService,
    private firestore: AngularFirestore,
    private navCtrl: NavController,
    private translateService: TranslateService,
    private languageService: LanguageService,
    private loadingController: LoadingController,
  ) {}

  navigateToTab2() {
    this.navCtrl.navigateForward('tabs/tab2');
  }

  handleRefresh(event) {
    setTimeout(() => {
      event.target.complete();
    }, 10000);
  }

  changeLanguage() {
    this.languageService.setLanguage(this.selectedLanguage);
  }

   ngOnInit() {
    
    this.languageService.selectedLanguage$.subscribe((language) => {
      this.selectedLanguage = language;
      this.translateService.use(language);
    });
    


    this.timerSubscription = interval(10000).subscribe(() => {
      this.updateCountdowns();
      this.checkReservationsAndUpdateDoneStatus(); // New method to check reservation status
  });

    
    this.timerSubscription = interval(1000).subscribe(() => this.updateCountdowns());
     // Fetch logged-in user data
     this.authService.getLoggedInUserObservable().pipe(
      switchMap((userData) => {
        console.log('Raw userData:', userData);

        if (userData) {
          const userId = this.authService.uid || userData['uid']; // Access the UID property

          console.log('User ID:', userId);

          // Retrieve additional data from Firestore
          return this.firestore.collection('user_data').doc(userId).valueChanges();
        } else {
          console.log('User is not logged in');
          return from([]); // Empty observable
        }
      }),
      take(1)
    ).subscribe((additionalData: any) => {
      console.log('Processed additionalData:', additionalData);

      if (additionalData) {
        this.nom = additionalData.nom;
        this.prenom = additionalData.prenom;
        this.telephone = additionalData.telephone;

        // Load car data
        this.loadCarData();
      } else {
        console.log('User data not found in Firestore.');
      }
    });
    
    // Fetch logged-in user data
    this.authService.getLoggedInUserObservable().pipe(
      take(1)
    ).subscribe((userData) => {
      console.log('Raw userData:', userData);

      if (userData) {
        this.email = userData.email;
        this.motDePasse = userData.motDePasse;
        console.log('User is logged in:', this.email, this.authService.uid);

        // Connecte le UID et EMAIL
        console.log('Logged-in UID:', this.authService.uid);
        console.log('Logged-in Email:', this.email);

        this.firestore.collection('user_data').doc(this.authService.uid).collection('reservation_data').snapshotChanges().pipe(
          take(1),
          map(actions => actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          }))
        ).subscribe((reservationData: any[]) => {
          console.log('Processed reservationData:', reservationData);
          this.reservationData = reservationData;
      
        
        });
      } else {
        this.email = '';
        this.motDePasse = '';
        console.log('User is not logged in');
      }
    });

}



checkReservationsAndUpdateDoneStatus() {
  const now = new Date();
  this.reservationData.forEach(res => {
    const reservationDate = res.reservationDate.toDate(); // Convert to JavaScript Date
    const endTimeTimestamp = this.convertSelectedTimeToTimestamp(res.endTime);

    // Print out the original date and time values
    console.log(`Original Reservation Date: ${reservationDate}`);
    console.log(`Original End Time: ${res.endTime}`);

    // Check if combinedEndDateTime is in the past
    if (reservationDate.getTime() <= now.getTime()) {
      if (!res.isDone) {
        
        console.log(`Reservation ID: ${res.id} should be marked as done. Date & Time: ${reservationDate}`);
        this.updateReservationAsDone(res.id);
      } else {
        console.log(`Reservation ID: ${res.id} is finished, bool isDone true`);
      }
    } else {
      console.log(`Reservation ID: ${res.id} is still active. Date & Time: ${reservationDate}`);
      console.log(`End Time Timestamp: ${endTimeTimestamp}`);
    }
  });
}


convertSelectedTimeToTimestamp(selectedTime: string): number {
  const currentTime = new Date();
  const [selectedHour, selectedMinute] = selectedTime.split(':').map(Number);
  currentTime.setHours(selectedHour, selectedMinute, 0, 0);
  return currentTime.getTime();
}



updateReservationAsDone(reservationId: string) {
  const userId = this.authService.uid; // Get the user ID from your authentication service

  if (!userId || !reservationId) {
      console.error('Error: Missing user ID or reservation ID.');
      return;
  }

  const now = new Date(); // Current time
  const reservation = this.reservationData.find(res => res.id === reservationId);

  if (!reservation) {
      console.error(`Reservation with ID: ${reservationId} not found.`);
      return;
  }

  const endTimeTimestamp = this.convertSelectedTimeToTimestamp(reservation.endTime);

  if (endTimeTimestamp <= now.getTime()) {
      // Update the reservation in Firestore only if the endTime has passed
      this.firestore.collection('user_data').doc(userId)
          .collection('reservation_data').doc(reservationId)
          .update({ isDone: true })
          .then(() => {
              console.log(`Reservation with ID: ${reservationId} marked as done successfully!`);
              // Optionally update your local data here to reflect the change
          })
          .catch((error) => {
              console.error('Error updating reservation as done:', error);
          });
  } else {
      console.log(`Reservation with ID: ${reservationId} is not yet due.`);
  }
}


updateCountdowns() {
  const now = new Date().getTime();
  this.reservationData.forEach(res => {
    if (!res.isCancelled) { // Check if not already canceled
      if (!res.isPayed &&res.createdAt && typeof res.createdAt.seconds === 'number') {
        const createdAtTime = new Date(res.createdAt.seconds * 1000).getTime();
        const timeDiff = createdAtTime + 5 * 60 * 200 - now; // 5 minutes in milliseconds

        if (timeDiff > 0) {
          const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
          const seconds = Math.floor((timeDiff / 1000) % 60);
          res.countdown = `${minutes}m ${seconds}s`;
        } else if (!res.updateCalled) {
          // Only proceed if the update hasn't been called yet
          res.countdown = 'temps écoulé';
          res.isCancelled = true;
          res.updateCalled = true; // Set a flag to indicate that update has been called
          this.updateReservationStatus(res);
        }
      }
    }
  });
}

  
  
  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }


 
  
  
  
  ionViewDidEnter() {
    // This will be called every time the view is entered
    this.loadResData()
  }

  


 

  loadCarData() {
    // Retrieve data from the 'car_data' collection
    this.firestore.collection('user_data').doc(this.authService.uid).collection('car_data').valueChanges().subscribe((carData: any) => {
      if (carData) {
        console.log('Car Data:', carData);
        // Update the list of vehicles
        this.vehicles = carData;
      }
    });
  }
  






 
  async confirmReservation(reservation) {


    const duration = this.calculateDuration(reservation.departureTime, reservation.endTime);
    const reservationDate = reservation.reservationDate.toDate();
    const formattedDate = reservationDate.getFullYear() + '-' + 
                          ('0' + (reservationDate.getMonth() + 1)).slice(-2) + '-' + 
                          ('0' + reservationDate.getDate()).slice(-2);

    const totalPrice = this.calculateTotalPrice(formattedDate, reservation.departureTime, reservation.endTime, reservation.price);

    const alert = await this.alertController.create({
      header: 'Confirmation de la réservation',
      inputs: [
        {
          name: 'selectedCar',
          type: 'text', // Vous pouvez changer cela en 'hidden' si vous ne voulez pas afficher le véhicule sélectionné.
          value: this.selectedCar, // Assurez-vous que this.selectedCar contient la valeur que vous voulez enregistrer.
          disabled: true // Rendre le champ non modifiable.
        }
      ],
      message: `Confirmez-vous la réservation de ${reservation.address} avec le véhicule ${this.selectedCar ? this.selectedCar.marque + ' ' + this.selectedCar.plaque : '' }  pour un total de ${totalPrice} EUR ?`,
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirmation annulée');
          },
        },
        {
          text: 'Payer',
          handler: () => {
            console.log('Redirection vers paiement');
            this.addCarToReservation(reservation, this.selectedCar);
  
            // Update reservation properties
            reservation.isConfirmed = true;
            reservation.isPayed = true;
            reservation.countdown = 'Réservé!';
            reservation.totalPrice = totalPrice;
            reservation.duration = duration;
  
            // Update Firestore and stop the countdown timer if it exists
            this.updateReservationStatus(reservation,totalPrice);
  
            if (reservation.timerSubscription) {
              reservation.timerSubscription.unsubscribe();
            }
  
            this.cdr.detectChanges(); // Trigger change detection to update the view
          },
        },
      ],
    });
  
    await alert.present();
  }
  
  updateReservationStatus(reservation, totalPrice?: number, ) {
    const userId = this.authService.uid;
    if (!userId || !reservation.id) {
      console.error('Error: Missing user ID or reservation ID.');
      return;
    }
    const duration = this.calculateDuration(reservation.departureTime, reservation.endTime);
    reservation.duration = duration;

    this.firestore.collection('user_data').doc(userId).collection('reservation_data').doc(reservation.id).update({
    isPayed: reservation.isPayed,
    isCancelled: reservation.isCancelled,
    totalPrice: totalPrice,
    duration: reservation.duration 
   
    })
    .then(() => {
      console.log('Reservation updated successfully!');
    })
    .catch((error) => {
      console.error('Error updating reservation:', error);
    
  }
  )}

  calculateTotalPrice(startDate: string, startTime: string, endTime: string, pricePerHour: number): number {
    // Assuming your start date comes in a full date format, and start & end times are just 'HH:mm' format.
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${startDate}T${endTime}`);
  
    // Check if the end time is the next day (if end time is less than start time)
    if (endDateTime < startDateTime) {
      endDateTime.setDate(endDateTime.getDate() + 1); // Adds a day to end date
    }
  
    const durationInHours = (endDateTime.getTime() - startDateTime.getTime()) / 1000 / 3600;
    return durationInHours * pricePerHour;
  }
  
  calculateDuration(startTime: string, endTime: string): string {
    const startDate = new Date(`1970-01-01T${startTime}`);
    const endDate = new Date(`1970-01-01T${endTime}`);
  
    if (endDate < startDate) {
      endDate.setDate(endDate.getDate() + 1); // Adjust for next day
    }
  
    const diff = endDate.getTime() - startDate.getTime();
    const hours = Math.floor(diff / 3600000); // milliseconds in an hour
    const minutes = Math.round((diff % 3600000) / 60000); // milliseconds in a minute
  
    return `${hours}h ${minutes}m`;
  }

 


  
  addCarToReservation(reservation, selectedCar) {
    const userId = this.authService.uid;
    if (!userId) {
      console.error('Error: User ID is not available.');
      return;
    }
  
    if (!reservation.id) {
      console.error('Error: Reservation ID is not available.');
      return;
    }
  
    // Prepare the reservation update object with vehicle data
    const reservationUpdate = {
      vehicleId: selectedCar.id,
      vehicleMarque: selectedCar.marque,
      vehiclePlaque: selectedCar.plaque,
    };
  
    // Update the selected vehicle in the user's reservation_data collection
    this.firestore.collection('user_data').doc(userId).collection('reservation_data').doc(reservation.id).update(reservationUpdate)
      .then(() => {
        console.log('Vehicle updated in reservation successfully!');
        // Perform other actions if necessary, such as redirecting to a payment page
      })
      .catch((error) => {
        console.error('Error updating vehicle in reservation:', error);
      });
  }
  
  onCarChange(event: any) {
    this.selectedCar = event.detail.value; // ou event.target.value selon votre cas
    // Logique supplémentaire si nécessaire
  }
  
  

  loadResData() {
    // récupérer les données de toutes les collections reservation_data
    this.firestore.collection('user_data').doc(this.authService.uid).collection('reservation_data').valueChanges().subscribe((resData: any[]) => {
      if (resData) {
        console.log('Reservation Data:', resData);
        this.reservations = resData;
      }
    });
  }
  confirmerReservation(emplacement: any): void {
    const updatedStatus = emplacement.isRese;

    // Mise à jour dans l'application
    emplacement.isAdPosted = updatedStatus;

    // Mise à jour dans Firestore
    this.firestore.collection('user_data').doc(this.authService.uid)
      .collection('emplacement_data').doc(emplacement.Id)
      .update({ isAdPosted: updatedStatus })
      .then(() => console.log('Update successful'))
      .catch(error => console.error('Error updating document: ', error));
  }

  loadEmpData() {
   
    this.firestore
      .collection('user_data')
      .doc(this.authService.uid)
      .collection('emplacement_data')
      .valueChanges()
      .subscribe(
        (empData: any) => {
          if (empData) {
            console.log('Emp Data:', empData);
            
            this.emplacements = of(empData);
          } else {
            console.log('Nothing in empData');
            
            this.emplacements = of([]);
          }
        },
        (error) => {
          console.error('Error fetching data:', error);
          
          this.emplacements = of([]);
        }
      );
  }

  cancelReservation(reservation) {
    const userId = this.authService.uid;
    if (!userId || !reservation.id) {
      console.error('Error: Missing user ID or reservation ID.');
      return;
    }
  
    // Update the reservation as cancelled in Firestore
    this.firestore.collection('user_data').doc(userId)
      .collection('reservation_data').doc(reservation.id)
      .update({ isCancelled: true })
      .then(() => {
        console.log(`Reservation with ID: ${reservation.id} marked as cancelled successfully!`);
        
        // Once marked as cancelled, delete the reservation from Firestore
        return this.firestore.collection('user_data').doc(userId)
          .collection('reservation_data').doc(reservation.id)
          .delete();
      })
      .then(() => {
        console.log(`Reservation with ID: ${reservation.id} deleted from Firestore successfully!`);
        
        // Remove the reservation from local data to reflect the deletion
        this.reservationData = this.reservationData.filter(res => res.id !== reservation.id);
      })
      .catch(error => {
        console.error('Error cancelling or deleting reservation:', error);
      });
  }
  
  
  
}
