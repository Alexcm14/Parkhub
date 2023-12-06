// recapitulatif.page.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Observable, combineLatest, from, switchMap, take } from 'rxjs';
import { VehicleSelectionService } from '../shared/vehicule-selection.service';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-recapitulatif',
  templateUrl: './recapitulatif.page.html',
  styleUrls: ['./recapitulatif.page.scss'],
})
export class RecapitulatifPage implements OnInit, OnDestroy {

  selectedParkingType$: Observable<string | null>;
  selectedParkingAddress$: Observable<string | null>;
  numberOfPlaces$: Observable<number>;
  selectedVehicleTypes$: Observable<string[]>;
  selectedDescription$: Observable<string | null>;
  selectedPhotos$: Observable<string[]>;
  isAdPosted: boolean = false;

  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  telephone: string;

  constructor(
    private navCtrl: NavController,
    private vehicleSelectionService: VehicleSelectionService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService, private firestore: AngularFirestore
  ) {
    this.selectedVehicleTypes$ = this.vehicleSelectionService.selectedVehicleTypes$;
    this.selectedParkingType$ = this.vehicleSelectionService.selectedParkingType$;
    this.selectedParkingAddress$ = this.vehicleSelectionService.selectedParkingAddress$; 
    this.numberOfPlaces$ = this.vehicleSelectionService.numberOfPlaces$;
    this.selectedDescription$ = this.vehicleSelectionService.selectedDescription$;
    this.selectedPhotos$ = this.vehicleSelectionService.selectedPhotos$;

  }

  ngOnInit() {
    this.cdr.detectChanges(); 

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
  
          // Retourne les données supplémentaires de Firestore
          return this.firestore.collection('user_data').doc(this.authService.uid).valueChanges();
        } else {
          this.email = '';
          this.motDePasse = '';
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
      } else {
        console.log('User data not found in Firestore.');
      }
    });
  
  }

  ngOnDestroy() {
    // Aucun besoin de désabonnement car nous utilisons async dans le template
  }

  ajouterEmplacement() {
    // Récupérer les valeurs actuelles des Observables
    combineLatest([
      this.selectedParkingType$,
      this.selectedParkingAddress$,
      this.selectedDescription$,
      this.selectedVehicleTypes$
      

    ]).pipe(
      take(1)
    ).subscribe(([selectedParkingType, selectedParkingAddress, selectedDescription, selectedVehicleTypes, ]) => {
      if (selectedParkingType && selectedParkingAddress && selectedDescription && selectedVehicleTypes ) {
        // récupérer l'observable utilisateur
        const userObservable = this.authService.getLoggedInUserObservable();
  
        // obtenir les données utilisateur
        userObservable.pipe(take(1)).subscribe((userData) => {
          if (userData) {
            const userId = this.authService.uid || userData['uid'];
  
            console.log('User ID:', userId);
  
            if (userId) {
              const user = {
                Description: selectedDescription,
                Adresse: selectedParkingAddress,
                ParkingType: selectedParkingType,
                VehicleType: selectedVehicleTypes,
              };
  
              
              const userDocRef = this.firestore.collection('user_data').doc(userId).collection('emplacement_data').doc();
  
             
              userDocRef.set(user)
                .then(() => {
                  console.log('Emplacement added to Firestore successfully!');
                  
                  this.navCtrl.navigateForward('/annonces');

                })
                .catch((error) => {
                  console.error('Error adding emplacement to Firestore: ', error);
                });


            }
          }
        });
      }
    });
  }}