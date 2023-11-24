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

declare var google: any;
 
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  })
 
export class Tab1Page {
 
  map: any;
  searchAddress: string;
  GoogleAutocomplete: any;
  autocomplete: any;
  autocompleteItems: any = [];
  geocoder: any;
  email:string;
  motDePasse:string;
 
  

 @ViewChild('map',{read: ElementRef, static:false}) mapRef: ElementRef;
 @ViewChild('searchbar', { read: ElementRef, static: false }) searchbarRef: ElementRef;

 

 constructor(private router: Router, private zone: NgZone,private authService: AuthService, private firestore: AngularFirestore) {
  // Déclarations et initialisations dans le constructeur
  this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
  this.autocomplete = { input: '' };
  this.autocompleteItems = [];
  this.geocoder = new google.maps.Geocoder;
  this.markers = [];
  
}
ngOnInit() {
  // Fetch logged-in user data
  this.authService.getLoggedInUserObservable().subscribe((userData) => {
    if (userData) {
      this.email = userData.email;
      this.motDePasse = userData.motDePasse;
      console.log('User is logged in:', this.email);
    } else {
      this.email = ''; 
      this.motDePasse = '';
      console.log('User is not logged in');
  
    }
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



infoWindows: any = [];
markers: any = [
  {
     title: "Colruyt jette",
     latitude: "50.87302017211914",
     longitude:"4.327065467834473",
  },
  {
     title: "LIDL Chaussée de Gand",
     latitude: "50.857233982129245",
     longitude:"4.323334693908692"
  },

  


]




ionViewDidEnter(){
  this.ShowMap();
}


//methode pour MARKERS

// addMarkersToMap(markers) {
 // for (let marker of markers){
  //  console.log('Adding marker:', marker);
   // let position = new google.maps.LatLng(marker.latitude, marker.longitude);
    //let mapMarker = new google.maps.Marker({
//      position : position,
//      title: marker.title,
 //     latitude: marker.latitude,
 //     longitude: marker.longitude,
 //     icon: {
    //    path: google.maps.SymbolPath.CIRCLE,
  //      scale: 13, // Taille du cercle
 //       fillColor: '#46d1c8', // Couleur de remplissage
 //       fillOpacity: 1, // Opacité de remplissage
 //       strokeColor: '#ffffff', // Couleur de la bordure
  //      strokeWeight: 2, // Épaisseur de la bordure
  //    },




 //   });

 //   mapMarker.setMap(this.map);
 //   this.addInfoWindowToMarker(mapMarker);
 // }

   // SEPARATION
//  }

//  addInfoWindowToMarker(marker){
 //   let infowindowContent = '<div id = "content">' +
 //                            '<h2 id = "firstHeading" class"firstHeading">' +marker.title +'</h2>'+
 //                            '<button id="customButton">Réserver une place</button>' +
 //                            
 //                           '</div>'
  
  //   let infoWindow = new google.maps.InfoWindow({
 //     content: infowindowContent
  //   });
  ////   
  //   marker.addListener('click', () => {
//      this.closeAllInfoWindows();
 //     infoWindow.open(this.map, marker);
  
  // Ajouter un gestionnaire d'événements pour le bouton
 // const customButton = document.getElementById('customButton');
 // if (customButton) {
 //   customButton.addEventListener('click', () => {
  //    // Insérez ici le code que vous souhaitez exécuter lorsque le bouton est cliqué
 //     this.router.navigate(['../tabs/tab3']);
 //     // Vous pouvez également ajouter une navigation Angular ici si nécessaire
 //   });
//  }
  
      
  //   });
//     this.infoWindows.push(infoWindow);
  //}
  
 // closeAllInfoWindows(){
 //   for(let window of this.infoWindows){
  //    window.close();
 //   }
 // }
  
  
  
  
  
  
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
    //call the method for marker

 //   this.addMarkersToMap(this.markers);
  
 // }
  
  
  
  
 
 
 
 
 
 
  
         
        
         
 
       
    
     
     
 
  
 
 
   
  }
   
}