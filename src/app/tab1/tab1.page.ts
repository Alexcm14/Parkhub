import { CommonModule } from '@angular/common';
import { NgZone } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { Component, ElementRef,OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Subscription, elementAt } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GoogleMap,  Marker } from '@capacitor/google-maps';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { from, of, switchMap, take } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { MarkerDetailsPage } from '../marker-details/marker-details.page';
import { UserBuildConditionals } from 'ionicons/dist/types/stencil-public-runtime';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/language.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

declare var google: any;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  })
 
export class Tab1Page {

  startTimeInput: HTMLInputElement;
  hourInput: HTMLInputElement;
  endTimeSpan: HTMLElement;
  totalPriceSpan: HTMLElement;
  chosenStartTime: string = '';
  chosenEndTime: string = '';
  totalPrice: number = 0;
  

  map: any;
  markers: any[] = [];
  vehicles: any;

  formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }


  infoWindows: any[] = [];
  searchAddress: string;
  GoogleAutocomplete: any;
  autocomplete: any;
  autocompleteItems: any = [];
  geocoder: any;
  
  selectedLanguage: string = 'fr';
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  telephone: string;
  termsAccepted: boolean = false;

  selectedMarkerData: any; 


 
  selectedMarkerPrice: number;
 
  

 @ViewChild('map',{read: ElementRef, static:false}) mapRef: ElementRef;
 @ViewChild('searchbar', { read: ElementRef, static: false }) searchbarRef: ElementRef;

 

 constructor(  private auth: AngularFireAuth, private languageService: LanguageService,  private translateService: TranslateService, private alertController: AlertController, private popoverController: PopoverController, private modalController: ModalController, private router: Router, private zone: NgZone, private authService: AuthService, private firestore: AngularFirestore) {
  

  this.endTimeSpan = document.createElement('div');
  this.endTimeSpan.id = 'endTimeSpan';

  this.totalPriceSpan = document.createElement('div');
  this.totalPriceSpan.id = 'endTimeSpan';


  this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
  this.autocomplete = { input: '' };
  this.autocompleteItems = [];
  this.geocoder = new google.maps.Geocoder;
  this.markers = [];
  
}


ngOnInit() {
  
  this.languageService.selectedLanguage$.subscribe((language) => {
    this.selectedLanguage = language;
    this.translateService.use(language);
  });
  
  // Fetch données user
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

        // Retourne les données de Firestore
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

changeLanguage() {
  this.languageService.setLanguage(this.selectedLanguage);
}


loadCarData() {
  
  this.firestore.collection('user_data').doc(this.authService.uid).collection('car_data').valueChanges().subscribe((carData: any) => {
    if (carData) {
      console.log('Car Data:', carData);
      
      this.vehicles = carData;
    }
  });
}


loadMarkers() {
  console.log('loadMarkers appelé');

  
  this.firestore.collectionGroup('emplacement_data')
    .snapshotChanges()
    .subscribe(
      (snapshotChanges) => {
        this.markers = snapshotChanges.map(doc => {
          const data = doc.payload.doc.data() as any;
          const id = doc.payload.doc.id;
          // data contient le userId
          if (data && typeof data === 'object') {
            return { id, userUid: data.userUid, ...data };
          } else {
            console.error('Data is not an object:', data);
            return { id };
          }
        });
        console.log('Data recu de firebase:', this.markers);
        this.addMarkersToMap();
      },
      (error) => {
        console.error('Error', error);
      }
    );
}




addMarkersToMap() {
  console.log('addMarkersToMap appellé');
  this.zone.run(() => {
    for (const data of this.markers) {
      if (data.Adresse && data.isAdPosted) {
        this.geocodeAddress(data.Adresse, data).then(async (coordinates: any) => {
          console.log('Geocoded coordinates:', coordinates);
          const position = new google.maps.LatLng(coordinates.latitude, coordinates.longitude);

          const marker = new google.maps.Marker({
            position: position,
            title: data.Adresse,
            map: this.map,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 14,
              fillColor: '#87CEEB', // Couleur bleue pour tous les marqueurs
              fillOpacity:  1, 
              strokeColor: '#000000', // Couleur noir pour la bordure
              strokeOpacity: 1, 
              strokeWeight: 2,
            },
            label: {
              text: `${(data.Prix * 1.21).toFixed(2)} €`,  // Afficher le prix sur le marqueur            
              color: 'black',  // Couleur du texte            
              fontSize: '9px',  // taille de la police            
              fontWeight: 'bold',  // Poids de la police
        }});

          marker.addListener('click', async (event) => {
            this.closeAllInfoWindows();

            const markerData = {
              address: data.Adresse,
              description: data.Description,
              parkingType: data.ParkingType,
              vehicleType: data.VehicleType,
              price: data.Prix,
              heureDebut: data.HeureDebut,
              heureFin: data.HeureFin,
              jours: data.Jours,
              id: data.id,
              userUid: data.userUid,
              Photos : data.Photos,
            };

            console.log('Marker Details ouvert:', markerData);

            const popover = await this.popoverController.create({
              component: MarkerDetailsPage,
              componentProps: { markerData },
              event: event,
              translucent: true,
              cssClass: 'custom-popover',
            });

            await popover.present();
          });

          this.markers.push(marker);
        }).catch(error => {
          console.error('Error geocoding :', data.Adresse, error);
        });
      }
    }
  });
}



navigateToTab3() {
  console.log('Navigating to tab3');
  this.router.navigate(['./tab3']).then(() => {
    window.location.reload();
})
}






geocodeAddress(address: string, data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, (results, status) => {
      if (status === 'OK' && results[0]) {
        resolve({
          latitude: results[0].geometry.location.lat(),
          longitude: results[0].geometry.location.lng(),
        });
      } else {
        reject('Geocode was not successful for the following address: ' + address);
      }
    });
  });
}


//DEBUT BARRE DE RECHERCHE 


 updateSearchResults() {
  if (this.autocomplete.input === '') {
    this.autocompleteItems = [];
    return;
  }
  this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
  (predictions, status) => {
    this.autocompleteItems = [];
    this.zone.run(() => {
      predictions.forEach((prediction) => {
        this.autocompleteItems.push(prediction);
      });
    });
  });
}


selectSearchResult(item) {

  

  this.autocompleteItems = [];
  this.autocomplete.input = item.description;

 
  

  this.geocoder.geocode({ 'placeId': item.place_id }, (results, status) => {
    if (status === 'OK' && results[0]) {

      
      let position = {
        lat: results[0].geometry.location.lat,
        lng: results[0].geometry.location.lng
      };

      let marker = new google.maps.Marker({
        position: results[0].geometry.location,
        map: this.map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 7, // Taille du cercle
          fillColor: '#000000', // Couleur bleue
          fillOpacity: 0.7, // Opacité de remplissage
          strokeColor: '#000000', // Couleur de la bordure
          strokeWeight: 2, // Épaisseur de la bordure
        },
      });

      
      this.markers.push(marker);
      this.map.setCenter(results[0].geometry.location);

      
    }
  });
}



//FIN BARRE DE RECHERCHE 








ionViewDidEnter(){

  console.log('ionViewDidEnter called');
  this.loadMarkers();

  this.ShowMap();
  this.showTermsAndConditionsPopup();
}



async showTermsAndConditionsPopup() {
  const user = await this.auth.currentUser;

  if (user) {
    const userId = user.uid;

    try {
      const userData: any = await this.firestore.collection('user_data').doc(userId).get().toPromise();

      const termsAccepted = userData?.data()?.termsAccepted || false;

      // Check if terms have been accepted, if not, show the popup
      if (!termsAccepted) {
        const alert = await this.alertController.create({
          header: 'Conditions Générales',
          message: 'Veuillez lire et accepter les conditions générales pour poursuivre.',
          buttons: [
            {
              text: 'Lire',
              handler: () => {
                // Redirect the user to the "Conditions" page
                this.router.navigate(['/conditions']);
              },
            },
          ],
        });

        await alert.present();
      }
    } catch (error) {
      console.error('Error fetching user data from Firestore:', error);
    }
  } else {
    console.error('User not authenticated.');
  }
}


  
  // CARTE GOOGLE MAPS 
  
  
  ShowMap (){
    const location = new google.maps.LatLng(50.8504500, 4.3487800 );
    const options ={
      center: location,
      zoom:12,
      disableDefaultUI: true,
      styles: [
        {
          featureType: 'transit',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
        {
          featureType: 'road',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
      ],
    }
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);
    
    this.loadMarkers();

 //   this.addMarkersToMap(this.markers);
  
 // }   
 
  }

  closeAllInfoWindows() {
    for (const window of this.infoWindows) {
      window.close();
    }
  }
  
   
}

