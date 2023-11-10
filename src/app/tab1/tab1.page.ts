import { Component, ElementRef,OnInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@capacitor/google-maps';
import { elementAt } from 'rxjs';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  map!: GoogleMap;
  

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
        styles: [
          {
            featureType: 'all',
            elementType: 'labels.text.fill',
            stylers: [
              { color: '#46d1c8' }, // Couleur des étiquettes
            ],
          },
        ],
          
  
        
      },
      forceCreate: true,

    })
  }
  
}

      