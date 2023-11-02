import { Component, OnInit, importProvidersFrom } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SharedService } from '../shared.service';


@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  valeur: number = 1;
  somme: number = 20;
  

  constructor(private navCtrl: NavController, private sharedService: SharedService) { }

  afficherEstimation() {
    this.sharedService.nombrePlaces;
    this.navCtrl.navigateForward('/estimation');
  }

  calculerSomme() {
    this.somme = this.valeur * 20 * this.sharedService.nombrePlaces;
  }

  redirigerVersAnnonces() {
    this.navCtrl.navigateForward('/annonces');
  }




  ngOnInit() {
  }

}
