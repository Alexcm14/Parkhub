// car.page.ts

import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { from, take, switchMap } from 'rxjs';

@Component({
  selector: 'app-car',
  templateUrl: './car.page.html',
  styleUrls: ['./car.page.scss'],
})
export class CarPage {
  plaque: string = '';
  marque: string = '';
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  telephone: string;
  vehicles: any[] = [];

  constructor(private authService: AuthService, private firestore: AngularFirestore) {}

  ngOnInit() {
    // Fetch logged-in user data
    this.authService.getLoggedInUserObservable().pipe(
      switchMap((userData) => {
        console.log('Raw userData:', userData);

        if (userData) {
          const userId = this.authService.uid || userData['uid']; // Access the UID property

          console.log('User ID:', userId);

          // Retourne les données supplémentaires de Firestore
          return this.firestore.collection('user_data').doc(userId).valueChanges();
        } else {
          console.log('User is not logged in');
          return from([]); // Chaîne qui continue
        }
      }),
      take(1)
    ).subscribe((additionalData: any) => {
      console.log('Processed additionalData:', additionalData);

      if (additionalData) {
        this.nom = additionalData.nom;
        this.prenom = additionalData.prenom;
        this.telephone = additionalData.telephone;

        // Charger les données de car_data
        this.loadCarData();
      } else {
        console.log('User data not found in Firestore.');
      }
    });
  }

  loadCarData() {
    // récupérer les données de car_data
    this.firestore.collection('car_data').doc(this.authService.uid).valueChanges().subscribe((carData: any) => {
      if (carData) {
        console.log('Car Data:', carData);
        // Mettre à jour la liste des véhicules
        this.vehicles = [carData];
      }
    });
  }

  ajouterVehicule() {
    if (this.plaque && this.marque) {
      // récupèrer l'observable utilisateur
      const userObservable = this.authService.getLoggedInUserObservable();

      // obtenir les données utilisateur
      userObservable.pipe(take(1)).subscribe((userData) => {
        if (userData) {
          const userId = this.authService.uid || userData['uid']; // Access the UID property

          console.log('User ID:', userId);

          if (userId) {
            const user = {
              marque: this.marque,
              plaque: this.plaque,
            };
            this.vehicles.unshift(user);

            // Ajouter un nouveau document à la collection car_data
            this.firestore.collection('car_data').add(user)
              .then((docRef) => {
                console.log('User Car data added to Firestore successfully with ID:', docRef.id);
                // Charger les données de car_data après l'ajout
                this.loadCarData();
              })
              .catch((error) => {
                console.error('Error adding user Car data to Firestore: ', error);
              });
          }
        }
      });
    }
  }
}
