// recapitulatif.page.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Observable, combineLatest, from, switchMap, take, finalize } from 'rxjs';
import { VehicleSelectionService } from '../shared/vehicule-selection.service';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

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
  selectedDates$: Observable<Date[]>;

  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  telephone: string;

  constructor(
    private navCtrl: NavController,
    private vehicleSelectionService: VehicleSelectionService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService, private firestore: AngularFirestore,
    private afStorage: AngularFireStorage
  ) {
    this.selectedVehicleTypes$ = this.vehicleSelectionService.selectedVehicleTypes$;
    this.selectedParkingType$ = this.vehicleSelectionService.selectedParkingType$;
    this.selectedParkingAddress$ = this.vehicleSelectionService.selectedParkingAddress$; 
    this.numberOfPlaces$ = this.vehicleSelectionService.numberOfPlaces$;
    this.selectedDescription$ = this.vehicleSelectionService.selectedDescription$;
    this.selectedPhotos$ = this.vehicleSelectionService.selectedPhotos$;
    this.selectedPrice$ = this.vehicleSelectionService.selectedPrice$;
    this.selectedDates$ = this.vehicleSelectionService.selectedDates$;
  }

  ngOnInit() {
    this.cdr.detectChanges(); 

    // Fetch logged-in user data
    this.authService.getLoggedInUserObservable().pipe(
      switchMap((userData) => {
        if (userData) {
          this.email = userData.email;
          this.motDePasse = userData.motDePasse;

          return this.firestore.collection('user_data').doc(this.authService.uid).valueChanges();
        } else {
          this.email = '';
          this.motDePasse = '';
          return from([]);
        }
      }),
      take(1)
    ).subscribe((additionalData: any) => {
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
    // No need to unsubscribe because we are using async in the template
  }

  uploadImage(event): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const filePath = `emplacement_images/${new Date().getTime()}_${file.name}`;
      const fileRef = this.afStorage.ref(filePath);
      const uploadTask = this.afStorage.upload(filePath, file);
  
      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            this.updateFirestoreWithImageUrl(url);
          });
        })
      ).subscribe();
    }
  }
  
  updateFirestoreWithImageUrl(url: string) {
    const userId = this.authService.uid; 
    if (userId) {
      const emplacementData = { imageUrl: url };
      this.firestore.collection('user_data').doc(userId)
        .collection('emplacement_data').doc(/* Specific document ID */)
        .update(emplacementData)
        .then(() => console.log('Image URL updated in Firestore'))
        .catch(error => console.error('Error updating image URL in Firestore', error));
    }
  }

  ajouterEmplacement() {
    combineLatest([
      this.selectedParkingType$,
      this.selectedParkingAddress$,
      this.selectedDescription$,
      this.selectedVehicleTypes$,
      this.numberOfPlaces$,
      this.selectedPrice$,
      this.selectedDates$,
      this.selectedPhotos$,
    ]).pipe(
      take(1)
    ).subscribe(([selectedParkingType, selectedPhotos, selectedParkingAddress, selectedDescription, selectedVehicleTypes, numberOfPlaces$, selectedPrice$, selectedDates$]) => {
      if (selectedParkingType && selectedParkingAddress && selectedDescription && selectedVehicleTypes && numberOfPlaces$ && selectedPrice$ && selectedDates$ && this.selectedPhotos$  ) {
        const userObservable = this.authService.getLoggedInUserObservable();
  
        userObservable.pipe(take(1)).subscribe((userData) => {
          if (userData) {
            const userId = this.authService.uid || userData['uid'];
  
            if (userId) {
              const user = {
                Description: selectedDescription,
                Adresse: selectedParkingAddress,
                ParkingType: selectedParkingType,
                VehicleType: selectedVehicleTypes,
                NombrePlace : numberOfPlaces$, 
                Prix: selectedPrice$, 
                Dates: selectedDates$,
                Image: this.selectedPhotos$,
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
  }
}
