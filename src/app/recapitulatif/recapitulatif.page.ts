import { Component, OnInit } from '@angular/core';
import { LocalisationPage } from '../localisation/localisation.page';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-recapitulatif',
  templateUrl: './recapitulatif.page.html',
  styleUrls: ['./recapitulatif.page.scss'],
})
export class RecapitulatifPage implements OnInit {

  parkingType: string;
  parkingAddress: string;
  nbPlaces: number;
  acceptedVehicles: string;
  description: string;
  emplacementID: number;
  isAdPosted: boolean = false;
  
  constructor(private navCtrl: NavController, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.parkingAddress = params['parkingAddress'];
      this.parkingType = params ['parkingType'];
    })
  }

}