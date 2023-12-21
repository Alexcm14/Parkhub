import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { take } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

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

  constructor(
    private modalController: ModalController,
    private authService: AuthService,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
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

        // Return the data from the subcollection reservation_data
        this.firestore.collection('user_data').doc(this.authService.uid).collection('reservation_data').valueChanges().pipe(
          take(1)
        ).subscribe((reservationData: any[]) => {
          console.log('Processed reservationData:', reservationData);

          // Now reservationData contains data from the 'reservation_data' subcollection for the user
          // Assign it to the property for use in the template
          this.reservationData = reservationData;
        });
      } else {
        this.email = '';
        this.motDePasse = '';
        console.log('User is not logged in');
      }
    });
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
