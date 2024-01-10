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





@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  emplacements: Observable<any[]>;

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
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    
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
  updateCountdowns() {
    const now = new Date().getTime();
    this.reservationData.forEach(res => {
      const createdAtTime = new Date(res.createdAt.seconds * 1000).getTime();
      const timeDiff = createdAtTime + 5 * 60000 - now; // 5 minutes in milliseconds
  
      if (timeDiff > 0) {
        const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
        const seconds = Math.floor((timeDiff / 1000) % 60);
        res.countdown = `${minutes}m ${seconds}s`;
        res.isCancelled = false;
      } else {
        if (!res.isCancelled) { // Check to prevent repeated Firestore updates
          res.countdown = 'réservation annulée';
          res.isCancelled = true;
  
          // Update the reservation status in Firestore
          this.firestore.collection('user_data').doc(this.authService.uid)
            .collection('reservation_data').doc(res.id)
            .update({ isCancelled: true })
            .then(() => console.log(`Reservation ${res.id} cancelled and updated in Firestore`))
            .catch(error => console.error(`Error updating reservation ${res.id}:`, error));
        }
      }
    });
  }
  
  
  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
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
      message: `Confirmez-vous la réservation de ${reservation.address} avec le véhicule ${this.selectedCar ? this.selectedCar.marque + ' ' + this.selectedCar.plaque : ''} ?`,
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
  
            // Update Firestore and stop the countdown timer if it exists
            this.updateReservationStatus(reservation);
  
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
  
  updateReservationStatus(reservation) {
    const userId = this.authService.uid;
    if (!userId || !reservation.id) {
      console.error('Error: Missing user ID or reservation ID.');
      return;
    }
  
    this.firestore.collection('user_data').doc(userId).collection('reservation_data').doc(reservation.id).update({
      isConfirmed: reservation.isConfirmed,
      isPayed: reservation.isPayed
    })
    .then(() => {
      console.log('Reservation updated successfully!');
    })
    .catch((error) => {
      console.error('Error updating reservation:', error);
    
  }
  )}


 
  ionViewDidEnter() {
    this.loadResData(); // Call the method that fetches reservation data
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
  
  onCarChange(event: any, reservation: any) {
    reservation.selectedCar = event.detail.value; // or event.target.value
    // Additional logic if necessary
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
}
