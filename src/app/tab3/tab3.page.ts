import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page implements OnInit {

  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  telephone: string;
  reservationData: any[] = [];
  reservations: any[] = [];

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
}
