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
  selectedPrice$: Observable<number>;
selectedStartDate$: Observable<Date | null>;
selectedEndDate$: Observable<Date | null>;


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
    this.selectedPrice$ = this.vehicleSelectionService.selectedPrice$;
    this.selectedStartDate$ = this.vehicleSelectionService.selectedStartDate$;
    this.selectedEndDate$ = this.vehicleSelectionService.selectedEndDate$;
  
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
      this.selectedVehicleTypes$,
      this.numberOfPlaces$,
      this.selectedPrice$,
      this.selectedStartDate$,
      this.selectedEndDate$,
  
    ]).pipe(
      take(1)
    ).subscribe(([selectedParkingType, selectedParkingAddress, selectedDescription, selectedVehicleTypes, numberOfPlaces, selectedPrice, selectedStartDate, selectedEndDate]) => {
      if (selectedParkingType && selectedParkingAddress && selectedDescription && selectedVehicleTypes && numberOfPlaces && selectedPrice && selectedStartDate && selectedEndDate) {
        // récupérer l'observable utilisateur
        const userObservable = this.authService.getLoggedInUserObservable();
  
        // obtenir les données utilisateur
        userObservable.pipe(take(1)).subscribe((userData) => {
          if (userData) {
            const userId = this.authService.uid || userData['uid'];
  
            if (userId) {
              // Generate a unique ID with prefix 'E-' and random numbers
              const uniqueEmplacementId = `E-${Math.floor(Math.random() * 1000000)}`;
  
              const emplacementData = {
                Id: uniqueEmplacementId,
                Description: selectedDescription,
                Adresse: selectedParkingAddress,
                ParkingType: selectedParkingType,
                VehicleType: selectedVehicleTypes,
                NombrePlace: numberOfPlaces, 
                Prix: selectedPrice, 
                DateDebut: selectedStartDate, 
                DateFin: selectedEndDate,
                isAdPosted: this.isAdPosted,
                isReserved: false
              };
  
              const userDocRef = this.firestore.collection('user_data').doc(userId).collection('emplacement_data').doc(uniqueEmplacementId);
  
              userDocRef.set(emplacementData)
                .then(() => {
                  console.log('Emplacement with unique ID added to Firestore successfully!');
                  this.navCtrl.navigateForward('/annonces');
                })
                .catch((error) => {
                  console.error('Error adding emplacement with unique ID to Firestore: ', error);
                });
            }
          }
        });
      }
    });
  }
}