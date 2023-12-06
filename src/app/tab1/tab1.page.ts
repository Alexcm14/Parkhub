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

  map: any;
  markers: any[] = [];

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
  
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  telephone: string;

  // Nouvelle propriété pour stocker le prix du marqueur sélectionné
  selectedMarkerPrice: number;
 
  

 @ViewChild('map',{read: ElementRef, static:false}) mapRef: ElementRef;
 @ViewChild('searchbar', { read: ElementRef, static: false }) searchbarRef: ElementRef;

 

 constructor(private router: Router, private zone: NgZone, private authService: AuthService, private firestore: AngularFirestore) {
  // Déclarations et initialisations dans le constructeur

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

loadMarkers() {
  console.log('loadMarkers called');
  
  // Mise à jour pour accéder à la sous-collection 'emplacement_data'
  this.firestore.collectionGroup('emplacement_data').valueChanges().subscribe(
    (data: any[]) => {
      console.log('Received data from Firebase:', data);
      this.markers = data;
      this.addMarkersToMap();
    },
    (error) => {
      console.error('Error fetching data from Firebase:', error);
    }
  );
}



addMarkersToMap() {
  console.log('addMarkersToMap called');
  this.zone.run(() => {
    for (const data of this.markers) {
      if (data.Adresse) {
        this.geocodeAddress(data.Adresse, data).then((coordinates: any) => {
          console.log('Geocoded coordinates:', coordinates);
          const position = new google.maps.LatLng(coordinates.latitude, coordinates.longitude);

          const marker = new google.maps.Marker({
            position: position,
            title: data.Adresse,
            map: this.map,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 7,
              fillColor: '#46d1c8',
              fillOpacity: 0.7,
              strokeColor: '#46d1c8',
              strokeWeight: 2 ,
            },
          });

          const infowindowContent = `
            <div>
              <p><strong>Adresse:</strong> ${data.Adresse}</p>
              <p><strong>Description:</strong> ${data.Description}</p>
              <p><strong>Parking Type:</strong> ${data.ParkingType}</p>
              <p><strong>Vehicle Type:</strong> ${data.VehicleType}</p>
              <p><strong>Prix:</strong> ${data.Prix } € </p>

              <ion-datetime displayFormat="HH:mm" [(ngModel)]="chosenStartTime"></ion-datetime>

              <label for="hours">Nombre d'heures:</label>
              <input type="number" id="hours" min="1" value="1">
    
             <p><strong>Heure de fin:</strong> <span id="endTime"></span></p>
             <p><strong> Prix total:</strong> <span id="totalPrice"> totalPrice</span>  </p>


              <button class="reserveButton" > Réserver  </button>

            </div>
          `;

          const infowindow = new google.maps.InfoWindow({
            content: infowindowContent,
          });

          marker.addListener('click', () => {
            this.closeAllInfoWindows();
            infowindow.open(this.map, marker);
            
            this.selectedMarkerPrice = data.Prix;
            

            
          });
          

          this.infoWindows.push(infowindow);
        }).catch(error => {
          console.error('Error geocoding address:', data.Adresse, error);
        });

        
      }

      
    }
  });

  

  
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
          fillColor: '#46d1c8', // Couleur bleue
          fillOpacity: 0.7, // Opacité de remplissage
          strokeColor: '#46d1c8', // Couleur de la bordure
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

