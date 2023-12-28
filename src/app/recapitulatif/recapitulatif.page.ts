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

  days: Array<{id: string, name: string, selected: boolean}> = [
    {id: 'lundi', name: 'Lun', selected: false},
    {id: 'mardi', name: 'Mar', selected: false},
    {id: 'mercredi', name: 'Mer', selected: false},
    {id: 'jeudi', name: 'Jeu', selected: false},
    {id: 'vendredi', name: 'Ven', selected: false},
    {id: 'samedi', name: 'Sam', selected: false},
    {id: 'dimanche', name: 'Dim', selected: false}
  ];


  selectedDays$: Observable<string[]>;
  selectedParkingType$: Observable<string | null>;
  selectedParkingAddress$: Observable<string | null>;
  numberOfPlaces$: Observable<number>;
  selectedVehicleTypes$: Observable<string[]>;
  selectedDescription$: Observable<string | null>;
  selectedPhotos$: Observable<string[]>;
  isAdPosted: boolean = false;
  selectedPrice$: Observable<number>;
  selectedStartTime$: Observable<string | null>;
  selectedEndTime$: Observable<string | null>;



  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  telephone: string;
  
  
  heureDebut: string;
  heureFin: string;
  

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
    this.selectedDays$ = this.vehicleSelectionService.selectedDays$;
    this.selectedStartTime$ = this.vehicleSelectionService.selectedStartTime$;
    this.selectedEndTime$ = this.vehicleSelectionService.selectedEndTime$;
  }

  ngOnInit() {

    
    this.cdr.detectChanges(); 

     this.authService.getLoggedInUserObservable().pipe(
      switchMap((userData) => {
        console.log('Raw userData:', userData);
  
        if (userData) {
          this.email = userData.email;
          this.motDePasse = userData.motDePasse;
          console.log('User is logged in:', this.email, this.authService.uid);
  
          console.log('Logged-in UID:', this.authService.uid);
          console.log('Logged-in Email:', this.email);
  
          return this.firestore.collection('user_data').doc(this.authService.uid).valueChanges();
        } else {
          this.email = '';
          this.motDePasse = '';
          console.log('User is not logged in');
          return from([]); 
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
  
  }

  toggleDay(day: {name: string, selected: boolean}): void {
    day.selected = !day.selected;
  }



  ajouterEmplacement() {

    const joursSelectionnes = this.days.filter(day => day.selected).map(day => day.id);

    combineLatest([
      this.selectedParkingType$,
      this.selectedParkingAddress$,
      this.selectedDescription$,
      this.selectedVehicleTypes$,
      this.numberOfPlaces$,
      this.selectedPrice$,
      this.selectedDays$,
      this.selectedStartTime$,
      this.selectedEndTime$,
  
    ]).pipe(
      take(1)
    ).subscribe(([selectedParkingType, selectedParkingAddress, selectedDescription, selectedVehicleTypes, numberOfPlaces, selectedPrice, selectedDays, selectedStartTime, selectedEndTime]) => {
      if (selectedParkingType && selectedParkingAddress && selectedDescription && selectedVehicleTypes && numberOfPlaces && selectedPrice && selectedDays && selectedStartTime && selectedEndTime) {
        
        const userObservable = this.authService.getLoggedInUserObservable();
  
        userObservable.pipe(take(1)).subscribe((userData) => {
          if (userData) {
            const userId = this.authService.uid || userData['uid'];
  
            if (userId) {
              
  
              const emplacementData = {
                
                Description: selectedDescription,
                Adresse: selectedParkingAddress,
                ParkingType: selectedParkingType,
                VehicleType: selectedVehicleTypes,
                NombrePlace: numberOfPlaces, 
                Prix: selectedPrice, 
                isAdPosted: this.isAdPosted,
                isReserved: false,
                Jours: joursSelectionnes,
                HeureDebut: this.heureDebut,
                HeureFin: this.heureFin,
              };
  
              const userDocRef =  this.firestore.collection('user_data').doc(userId).collection('emplacement_data').add(emplacementData)
              .then((docRef) => {
                console.log('Emplacement added to Firestore successfully with ID:', docRef.id);
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
  }
}