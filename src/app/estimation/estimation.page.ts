import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-estimation',
  templateUrl: './estimation.page.html',
  styleUrls: ['./estimation.page.scss'],
})
export class EstimationPage {
  nombrePlaces: number = 1;
  localNombrePlaces: number;

  constructor(private navCtrl: NavController, private sharedService: SharedService) { 
    this.localNombrePlaces = sharedService.nombrePlaces;
  }

  incrementPlaces() {
    this.localNombrePlaces++;
  }

  decrementPlaces() {
    if (this.localNombrePlaces > 1) {
      this.localNombrePlaces--;
    }
  }

  mettreAJourEstimation() {
    this.sharedService.nombrePlaces = this.localNombrePlaces;
    this.navCtrl.navigateForward('/tab4');
  }
}

