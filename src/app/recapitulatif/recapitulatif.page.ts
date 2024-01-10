// recapitulatif.page.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Observable, combineLatest, from, switchMap, take, of } from 'rxjs';
import { VehicleSelectionService } from '../shared/vehicule-selection.service';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { catchError, map, finalize } from 'rxjs/operators';
import { UploadTaskSnapshot } from '@angular/fire/compat/storage/interfaces';



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
  
  photos: string[] = [];

  selectedFiles: File[] = [];

  constructor(
    private navCtrl: NavController,
    private vehicleSelectionService: VehicleSelectionService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService, 
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
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

  uploadImagesAndGetURLs(): Observable<string[]> {
    const uploadTasks = this.selectedFiles.map(file => {
      const filePath = `images/${new Date().getTime()}_${file.name}`;
      const fileRef = this.storage.ref(filePath);

      return this.storage.upload(filePath, file).snapshotChanges().pipe(
        switchMap(() => fileRef.getDownloadURL()),
        catchError(error => {
          console.error('Error uploading image:', error);
          return of(null);
        })
      );
    });

    return combineLatest(uploadTasks).pipe(
      map(urls => urls.filter(url => url !== null))
    );
  }
  

  toggleDay(day: {name: string, selected: boolean}): void {
    day.selected = !day.selected;
  }

  ajouterPhoto() {
    this.photos.push('https://via.placeholder.com/150');
  }

  handleFileInput(event: any): void {
  const files: FileList = event.target.files;
  if (files && files.length > 0) {
    console.log('Selected files:', files);
    for (let i = 0; i < files.length; i++) {
      this.uploadFileAndGetURL(files[i]).subscribe(url => {
        if (url) {
          this.photos.push(url); // stocke l'URL de l'image téléchargée
          // Vous pouvez également mettre à jour l'aperçu de l'image ici si nécessaire
        }
      });
    }
  }
}

private uploadFileAndGetURL(file: File): Observable<string | null> {
  const filePath = `images/${new Date().getTime()}_${file.name}`;
  const fileRef = this.storage.ref(filePath);
  const uploadTask = this.storage.upload(filePath, file);

  return uploadTask.snapshotChanges().pipe(
    switchMap((snapshot: UploadTaskSnapshot) => {
      if (snapshot.state === 'success') {
        return fileRef.getDownloadURL();
      } else {
        // Handle unsuccessful uploads
        console.error('Upload failed:', snapshot);
        return of(null); // Return null or a valid default URL
      }
    }),
    catchError(error => {
      console.error('Error uploading file:', error);
      return of(null); // Return null or a valid default URL
    }),
    take(1)
  );
}



  ajouterEmplacement() {
    const joursSelectionnes = this.days.filter(day => day.selected).map(day => day.id);
  
    this.uploadImagesAndGetURLs().pipe(
      switchMap((imageURLs) => {
        return combineLatest([
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
          take(1),
          switchMap(([selectedParkingType, selectedParkingAddress, selectedDescription, selectedVehicleTypes, numberOfPlaces, selectedPrice, selectedDays, selectedStartTime, selectedEndTime]) => {
            if (selectedParkingType && selectedParkingAddress && selectedDescription && selectedVehicleTypes && numberOfPlaces && selectedPrice && selectedDays && selectedStartTime && selectedEndTime) {
              const userObservable = this.authService.getLoggedInUserObservable();
              return userObservable.pipe(
                take(1),
                switchMap((userData) => {
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
                userUid: this.authService.uid,
                Photos: imageURLs

                      };
                      return from(this.firestore.collection('user_data').doc(userId).collection('emplacement_data').add(emplacementData));
                    }
                  }
                  return of(null); // ou un autre Observable approprié si l'utilisateur n'est pas connecté
                })
              );
            } else {
              return of(null); // ou un autre Observable approprié si les données ne sont pas complètes
            }
          })
        );
      })
    ).subscribe({
      next: (docRef) => {
        if (docRef) {
          console.log('Emplacement added to Firestore successfully with ID:', docRef.id);
          this.navCtrl.navigateForward('/annonces');
        } else {
          console.log('Emplacement not added due to missing information or user not logged in.');
        }
      },
      error: (err) => console.error('Error adding emplacement to Firestore: ', err)
    });
  }
  
  }
