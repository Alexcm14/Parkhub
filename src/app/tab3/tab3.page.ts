// tab3.page.ts

import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CardDetailsModalComponent } from '../cards/card.component/card.component.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { switchMap, take } from 'rxjs/operators';
import { from } from 'rxjs';

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
  emplacementData: any[] = []; 

  constructor(
    private modalController: ModalController,
    private authService: AuthService,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    // Fetch logged-in user data
    this.authService.getLoggedInUserObservable().pipe(
      switchMap((userData) => {
        console.log('Raw userData:', userData);

        if (userData) {
          this.email = userData.email;
          this.motDePasse = userData.motDePasse;
          console.log('User is logged in:', this.email, this.authService.uid);

          // Connecte le UID et EMAIL
          console.log('Logged-in UID:', this.authService.uid);
          console.log('Logged-in Email:', this.email);

          // Retourne les données de la collection emplacement_data
          return this.firestore.collection('emplacement_data').
            .collection('emplacement_data').valueChanges();
        } else {
          this.email = '';
          this.motDePasse = '';
          console.log('User is not logged in');
          return from([]); // Chaîne qui continue
        }
      }),
      take(1)
    ).subscribe((emplacementData: any[]) => {
      console.log('Processed emplacementData:', emplacementData);

      // Now emplacementData contains data from the 'emplacement_data' collection for the logged-in user
      // Assign it to the property for use in the template
      this.emplacementData = emplacementData;
    });
  }
}
