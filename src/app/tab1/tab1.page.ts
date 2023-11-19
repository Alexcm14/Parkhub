import { CommonModule } from '@angular/common';
import { NgZone } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { Component, ElementRef,OnInit, ViewChild } from '@angular/core';
 
import { IonicModule } from '@ionic/angular';
import { Subscription, elementAt } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GoogleMap,  Marker } from '@capacitor/google-maps';
 
declare var google: any;
 
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  })
 
export class Tab1Page {
 
 
 
    //map google
 
 
  map!: GoogleMap;
   placesService!: google.maps.places.PlacesService;
 
 
  @ViewChild('mapRef')
  set mapRef(ref: ElementRef<HTMLElement>){
    setTimeout (() => {
      this.createMap(ref.nativeElement);
    }, 500);
  }
 
 
 
 
  async createMap(ref: HTMLElement) {
    this.map = await GoogleMap.create ({
      id: 'my-cool-app',
      apiKey: environment.mapsKey,
      element: ref,
      config : {
        center: {
          lat: 50.85045,
          lng: 4.34878,
         
 
        },
        zoom:12,
        mapTypeControl: false,  //enleve les boutons satelite/plan
        zoomControl: false,     //enleve les boutons + et -
        streetViewControl: false, //enleve le streetViewControl, a voir si il ne sera pas utile
        fullscreenControl: false, //enleve le bouton plein ecran
        styles: [
          {
            featureType: 'all',
            elementType: 'labels.text.fill',
            stylers: [
              { color: '#46d1c8' }, // Couleur des étiquettes
            ],
           
          },
          {
            featureType: 'transit',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }], // Masquer les étiquettes des transports en commun
          },
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }], // Masquer les étiquettes des points d'intérêt
          },
          {
            featureType: 'road',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }], // Masquer les étiquettes des routes
          },
         
        ],
         
 
       
      },
     
     
      forceCreate: true,
 
    })
 
 
   
  }
   
  }